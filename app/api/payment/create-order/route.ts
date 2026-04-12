import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
})

// POST /api/payment/create-order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('Unauthorized.', 401)

    const { amount, bookingId } = await req.json()

    if (!amount || amount < 100) {
      return errorResponse('Invalid amount.')
    }

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // Razorpay uses paise
      currency: 'INR',
      receipt:  bookingId ?? `order_${Date.now()}`,
      notes:    { bookingId: bookingId ?? '' },
    })

    return successResponse({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[POST /api/payment/create-order]', err)
    return errorResponse('Failed to create payment order.', 500)
  }
}