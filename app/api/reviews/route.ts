import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'
import Package from '@/models/Package'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/apiResponse'

// GET /api/reviews — public, approved only
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page      = Number(searchParams.get('page')    ?? 1)
    const limit     = Number(searchParams.get('limit')   ?? 10)
    const packageId = searchParams.get('packageId')
    const skip      = (page - 1) * limit

    const filter: Record<string, unknown> = { isApproved: true }
    if (packageId) filter.package = packageId

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer', 'name avatar')
        .populate('package',  'name slug')
        .lean(),
      Review.countDocuments(filter),
    ])

    return paginatedResponse(reviews, page, limit, total)
  } catch (err) {
    console.error('[GET /api/reviews]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// POST /api/reviews — logged-in customer submits a review
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return errorResponse('You must be logged in to leave a review.', 401)

    const body = await req.json()
    const { bookingId, packageId, rating, title, comment } = body

    if (!bookingId || !rating || !title || !comment) {
      return errorResponse('Booking, rating, title, and comment are required.')
    }

    if (rating < 1 || rating > 5) {
      return errorResponse('Rating must be between 1 and 5.')
    }

    await connectDB()

    const user = session.user as { id: string }

    // Check for duplicate review on same booking
    const existing = await Review.findOne({ booking: bookingId })
    if (existing) return errorResponse('You have already reviewed this booking.', 409)

    const review = await Review.create({
      customer:   user.id,
      booking:    bookingId,
      package:    packageId,
      rating,
      title:      title.trim(),
      comment:    comment.trim(),
      isApproved: false, // admin must approve
    })

    // Update package aggregate rating
    if (packageId) {
      const stats = await Review.aggregate([
        { $match: { package: review.package, isApproved: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ])
      if (stats.length > 0) {
        await Package.findByIdAndUpdate(packageId, {
          rating:       Math.round(stats[0].avgRating * 10) / 10,
          totalReviews: stats[0].count,
        })
      }
    }

    return successResponse(
      { id: review._id.toString(), message: 'Review submitted! It will appear after approval.' },
      201,
    )
  } catch (err) {
    console.error('[POST /api/reviews]', err)
    return errorResponse('Internal server error.', 500)
  }
}