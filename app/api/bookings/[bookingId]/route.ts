import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import { successResponse, errorResponse } from '@/lib/apiResponse'

interface Params {
  params: Promise<{ bookingId: string }>
}

// GET /api/bookings/[bookingId]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('Unauthorized.', 401)

    const { bookingId } = await params
    await connectDB()

    const booking = await Booking.findOne({ bookingId })
      .populate('customer', 'name email phone')
      .populate('package',  'name slug duration cities')
      .populate('driver',   'name phone vehicle rating')
      .lean()

    if (!booking) return errorResponse('Booking not found.', 404)

    const user = session.user as { id: string; role: string }

    // Customers can only view their own bookings
    if (
      user.role !== 'admin' &&
      user.role !== 'driver' &&
      booking.customer.toString() !== user.id
    ) {
      return errorResponse('Forbidden.', 403)
    }

    return successResponse(booking)
  } catch (err) {
    console.error('[GET /api/bookings/:id]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// PATCH /api/bookings/[bookingId] — update status, assign driver, add notes
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('Unauthorized.', 401)

    const { bookingId } = await params
    const body = await req.json()
    const user = session.user as { id: string; role: string }

    await connectDB()

    const booking = await Booking.findOne({ bookingId })
    if (!booking) return errorResponse('Booking not found.', 404)

    // Admin can update anything
    if (user.role === 'admin') {
      const allowed = ['status', 'driver', 'adminNotes', 'paymentStatus', 'cancelReason']
      allowed.forEach((key) => {
        if (body[key] !== undefined) {
          // (booking as Record<string, unknown>)[key] = body[key]
          booking.set('status', body.status)
          booking.set('driver', body.driver)
        }
      })
    }
    // Driver can only update trip status
    else if (user.role === 'driver') {
      const driverStatuses = ['ongoing', 'completed']
      if (body.status && driverStatuses.includes(body.status)) {
        booking.status = body.status
      }
    }
    // Customer can cancel their own booking
    else if (booking.customer.toString() === user.id) {
      if (body.status === 'cancelled') {
        booking.status       = 'cancelled'
        booking.cancelReason = body.cancelReason ?? 'Cancelled by customer'
      }
    } else {
      return errorResponse('Forbidden.', 403)
    }

    await booking.save()
    return successResponse(booking)
  } catch (err) {
    console.error('[PATCH /api/bookings/:id]', err)
    return errorResponse('Internal server error.', 500)
  }
}