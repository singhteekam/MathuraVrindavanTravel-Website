import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// POST /api/payment/verify
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('Unauthorized.', 401)

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse('Missing payment details.')
    }

    // Verify signature
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return errorResponse('Payment verification failed. Invalid signature.', 400)
    }

    // Update booking payment status
    if (bookingId) {
      await connectDB()
      await Booking.findOneAndUpdate(
        { bookingId },
        {
          paymentId:       razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          paymentStatus:   'partial', // 30% advance paid
          status:          'confirmed',
        },
      )
    }

    return successResponse({
      verified:  true,
      paymentId: razorpay_payment_id,
      message:   'Payment verified successfully.',
    })
  } catch (err) {
    console.error('[POST /api/payment/verify]', err)
    return errorResponse('Payment verification error.', 500)
  }
}