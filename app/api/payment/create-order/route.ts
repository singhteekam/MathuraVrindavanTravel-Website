import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// POST /api/payment/create-order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('Unauthorized.', 401)

    const keyId     = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return errorResponse('Payment gateway not configured.', 503)
    }

    const { amount, bookingId } = await req.json()

    if (!amount || amount < 100) {
      return errorResponse('Invalid amount.')
    }

    // Lazy import + initialize inside handler — never runs at build time
    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

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
