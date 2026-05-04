import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Booking  from '@/models/Booking'
import User     from '@/models/User'
import Driver   from '@/models/Driver'
import Contact  from '@/models/Contact'
import Package  from '@/models/Package'
import Place    from '@/models/Place'
import Review   from '@/models/Review'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// GET /api/admin/stats — admin only
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin' && user?.role !== 'superadmin') return errorResponse('Forbidden.', 403)

    await connectDB()

    const now       = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
      totalPackages,
      totalPlaces,
      totalReviews,
      pendingReviews,
      totalBookings,
      thisMonthBookings,
      lastMonthBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalDrivers,
      availableDrivers,
      unreadEnquiries,
      revenueAgg,
      thisMonthRevenueAgg,
      recentBookings,
      bookingsByStatus,
    ] = await Promise.all([
      Package.countDocuments({ isActive: true }),
      Place.countDocuments(),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: thisMonth } }),
      Booking.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'customer' }),
      Driver.countDocuments(),
      Driver.countDocuments({ isAvailable: true }),
      Contact.countDocuments({ isRead: false }),

      // Total revenue from completed bookings
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      // This month's revenue
      Booking.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      // 5 most recent bookings
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'name phone')
        .populate('package',  'name')
        .lean(),

      // Bookings grouped by status
      Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
      ]),
    ])

    const totalRevenue      = revenueAgg[0]?.total          ?? 0
    const thisMonthRevenue  = thisMonthRevenueAgg[0]?.total ?? 0
    const lastMonthRevenue  = 0 // Can be computed similarly

    // Month-over-month growth %
    const bookingGrowth = lastMonthBookings > 0
      ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100)
      : 100

    return successResponse({
      totalPackages,
      totalPlaces,
      totalReviews,
      pendingReviews,
      totalUsers: totalCustomers,
      bookings: {
        total:      totalBookings,
        thisMonth:  thisMonthBookings,
        lastMonth:  lastMonthBookings,
        pending:    pendingBookings,
        completed:  completedBookings,
        cancelled:  cancelledBookings,
        growth:     bookingGrowth,
        byStatus:   bookingsByStatus,
      },
      revenue: {
        total:     totalRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
      },
      users: {
        totalCustomers,
        totalDrivers,
        availableDrivers,
      },
      enquiries: {
        unread: unreadEnquiries,
      },
      recentBookings,
    })
  } catch (err) {
    console.error('[GET /api/admin/stats]', err)
    return errorResponse('Internal server error.', 500)
  }
}