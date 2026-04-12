import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import Contact from '@/models/Contact'
import { sendEnquiryNotification } from '@/lib/email'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// POST /api/contact — save enquiry + send email to admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, message, tourDate, passengers } = body

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return errorResponse('Name, phone, and message are required.')
    }

    await connectDB()

    const contact = await Contact.create({
      name:       name.trim(),
      phone:      phone.trim(),
      email:      email?.trim(),
      message:    message.trim(),
      tourDate,
      passengers,
    })

    // Send email notification to admin (non-blocking)
    sendEnquiryNotification({ name, phone, email, message, tourDate }).catch(console.error)

    return successResponse(
      { id: contact._id.toString(), message: 'Enquiry submitted successfully.' },
      201,
    )
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// GET /api/contact — admin only, list all enquiries
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page    = Number(searchParams.get('page')  ?? 1)
    const limit   = Number(searchParams.get('limit') ?? 20)
    const unread  = searchParams.get('unread') === 'true'
    const skip    = (page - 1) * limit

    const filter = unread ? { isRead: false } : {}

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter),
    ])

    return successResponse({ contacts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    console.error('[GET /api/contact]', err)
    return errorResponse('Internal server error.', 500)
  }
}