import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import { sendBookingConfirmation } from '@/lib/email'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/apiResponse'
import { generateBookingId } from '@/lib/utils'

// POST /api/bookings — create a new booking
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('You must be logged in to book.', 401)
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
      addons,
      specialRequests,
    } = body

    // Validate required fields
    if (!carType || !startDate || !pickupLocation || !totalAmount) {
      return errorResponse('Missing required booking fields.')
    }

    await connectDB()

    const bookingId    = generateBookingId()
    const advanceAmount = Math.round(totalAmount * 0.3)

    const booking = await Booking.create({
      bookingId,
      customer:       (session.user as { id: string }).id,
      package:        packageId ?? undefined,
      carType,
      carName:        carName ?? carType,
      startDate:      new Date(startDate),
      endDate:        endDate ? new Date(endDate) : new Date(startDate),
      duration:       duration ?? 1,
      pickupLocation,
      dropLocation,
      totalPassengers: totalPassengers ?? 1,
      totalAmount,
      advanceAmount,
      addons:          addons ?? [],
      specialRequests,
      status:          'pending',
      paymentStatus:   'pending',
    })

    // Send confirmation email (non-blocking)
    if (session.user.email) {
      sendBookingConfirmation({
        bookingId,
        customerName:  session.user.name ?? 'Valued Customer',
        customerEmail: session.user.email,
        carName:       carName ?? carType,
        startDate:     new Date(startDate).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
        pickupLocation,
        totalAmount,
      }).catch(console.error)
    }

    return successResponse(
      {
        bookingId,
        id:             booking._id.toString(),
        status:         'pending',
        totalAmount,
        advanceAmount,
      },
      201,
    )
  } catch (err) {
    console.error('[POST /api/bookings]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// GET /api/bookings — list bookings (admin: all, customer: own)
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

    const user = session.user as { id: string; role: string }

    const filter: Record<string, unknown> = {}

    // Customers see only their own bookings
    if (user.role !== 'admin') filter.customer = user.id
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