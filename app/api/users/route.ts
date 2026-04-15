import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Booking from '@/models/Booking'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/apiResponse'

// GET /api/users — admin only, list users with optional role filter
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    await connectDB()

    const { searchParams } = new URL(req.url)
    const page   = Number(searchParams.get('page')  ?? 1)
    const limit  = Number(searchParams.get('limit') ?? 20)
    const role   = searchParams.get('role')   ?? 'customer'
    const search = searchParams.get('search') ?? ''
    const skip   = (page - 1) * limit

    const filter: Record<string, unknown> = { role }

    if (search.trim()) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password')
        .lean(),
      User.countDocuments(filter),
    ])

    // Attach booking counts for customers
    if (role === 'customer') {
      const userIds = users.map((u) => u._id)
      const counts  = await Booking.aggregate([
        { $match: { customer: { $in: userIds } } },
        { $group: { _id: '$customer', count: { $sum: 1 } } },
      ])
      const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]))
      const enriched = users.map((u) => ({
        ...u,
        bookingCount: countMap[u._id.toString()] ?? 0,
      }))
      return paginatedResponse(enriched, page, limit, total)
    }

    return paginatedResponse(users, page, limit, total)
  } catch (err) {
    console.error('[GET /api/users]', err)
    return errorResponse('Internal server error.', 500)
  }
}