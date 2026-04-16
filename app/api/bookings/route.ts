import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { connectDB }         from '@/lib/db'
import Booking              from '@/models/Booking'
import User                 from '@/models/User'
import { sendBookingConfirmation } from '@/lib/email'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/apiResponse'
import { generateBookingId } from '@/lib/utils'
import bcrypt from 'bcryptjs'

// POST /api/bookings — create a new booking (must be authenticated)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('You must be signed in to create a booking.', 401)
    }

    const body = await req.json()
    const {
      packageId,
      carType,
      carName,
      startDate,
      endDate,
      duration,
      pickupLocation,
      dropLocation,
      totalPassengers,
      totalAmount,
      advanceAmount,
      addons,
      specialRequests,
      customerName,
      customerPhone,
      customerEmail,
    } = body

    if (!carType || !startDate || !pickupLocation || !totalAmount) {
      return errorResponse('Missing required booking fields.')
    }

    await connectDB()

    const customerId  = (session.user as { id: string }).id
    const bookingId   = generateBookingId()
    const calcAdvance = advanceAmount ?? Math.round(totalAmount * 0.3)

    const booking = await Booking.create({
      bookingId,
      customer:       customerId,
      package:        packageId  ?? undefined,
      carType,
      carName:        carName    ?? carType,
      startDate:      new Date(startDate),
      endDate:        endDate ? new Date(endDate) : new Date(startDate),
      duration:       duration   ?? 1,
      pickupLocation: pickupLocation.trim(),
      dropLocation:   dropLocation ?? undefined,
      totalPassengers:totalPassengers ?? 1,
      totalAmount,
      advanceAmount:  calcAdvance,
      addons:         addons     ?? [],
      specialRequests:specialRequests ?? undefined,
      status:         'pending',
      paymentStatus:  'pending',
    })

    // Send confirmation email (non-blocking)
    const emailTarget = customerEmail ?? session.user.email
    if (emailTarget) {
      sendBookingConfirmation({
        bookingId,
        customerName:   customerName ?? session.user.name ?? 'Valued Customer',
        customerEmail:  emailTarget,
        carName:        carName ?? carType,
        startDate:      new Date(startDate).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
        pickupLocation: pickupLocation.trim(),
        totalAmount,
      }).catch(console.error)
    }

    return successResponse(
      {
        bookingId,
        id:            booking._id.toString(),
        status:        'pending',
        totalAmount,
        advanceAmount: calcAdvance,
      },
      201,
    )
  } catch (err) {
    console.error('[POST /api/bookings]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// GET /api/bookings — list (admin: all, customer/driver: own)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('Unauthorized.', 401)

    await connectDB()

    const { searchParams } = new URL(req.url)
    const page   = Number(searchParams.get('page')   ?? 1)
    const limit  = Number(searchParams.get('limit')  ?? 10)
    const status = searchParams.get('status')
    const skip   = (page - 1) * limit

    const user   = session.user as { id: string; role: string }
    const filter: Record<string, unknown> = {}

    if (user.role === 'driver') {
      // Drivers see bookings assigned to their driver profile
      // We look up their driver doc first
      const Driver = (await import('@/models/Driver')).default
      const driverDoc = await Driver.findOne({ userId: user.id }).select('_id').lean()
      if (!driverDoc) return successResponse({ data: [], pagination: { page: 1, limit, total: 0, pages: 0 } })
      filter.driver = driverDoc._id
    } else if (user.role !== 'admin') {
      // Customers see only their own
      filter.customer = user.id
    }

    if (status) filter.status = status

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer', 'name email phone')
        .populate('package',  'name slug duration')
        .populate('driver',   'name phone vehicle')
        .lean(),
      Booking.countDocuments(filter),
    ])

    return paginatedResponse(bookings, page, limit, total)
  } catch (err) {
    console.error('[GET /api/bookings]', err)
    return errorResponse('Internal server error.', 500)
  }
}