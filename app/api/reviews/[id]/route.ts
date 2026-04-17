import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'
import { revalidateTag }        from 'next/cache'
import { recalcPackageRating } from '@/lib/reviewUtils'
import { successResponse, errorResponse } from '@/lib/apiResponse'

interface Params {
  params: Promise<{ id: string }>
}

// PATCH /api/reviews/[id] — admin approve/unpublish
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    const { id }         = await params
    const { isApproved } = await req.json()

    await connectDB()

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true },
    )

    if (!review) return errorResponse('Review not found.', 404)

    // Recalculate package rating from real review data
    if (review.package) {
      await recalcPackageRating(review.package)
    }

    revalidateTag('reviews', 'default')
    revalidateTag('reviews', 'default')
    revalidateTag('packages', 'default')  // package ratings updated
    return successResponse({
      review,
      message: isApproved ? 'Review approved and published.' : 'Review unpublished.',
    })
  } catch (err) {
    console.error('[PATCH /api/reviews/:id]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// DELETE /api/reviews/[id] — admin delete
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    const { id } = await params
    await connectDB()

    const review = await Review.findByIdAndDelete(id)
    if (!review) return errorResponse('Review not found.', 404)

    // Recalculate rating after deletion
    if (review.package) {
      await recalcPackageRating(review.package)
    }

    revalidateTag('reviews', 'default')
    revalidateTag('packages', 'default')
    return successResponse({ message: 'Review deleted.' })
  } catch (err) {
    console.error('[DELETE /api/reviews/:id]', err)
    return errorResponse('Internal server error.', 500)
  }
}