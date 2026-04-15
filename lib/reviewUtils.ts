import mongoose from 'mongoose'
import Review   from '@/models/Review'
import Package  from '@/models/Package'

/**
 * Recalculate and save the rating + totalReviews for a package
 * based on all approved Review documents linked to it.
 * Call this whenever a review is approved, unpublished, or deleted.
 */
export async function recalcPackageRating(packageId: mongoose.Types.ObjectId | string) {
  const stats = await Review.aggregate([
    {
      $match: {
        package:    new mongoose.Types.ObjectId(packageId.toString()),
        isApproved: true,
      },
    },
    {
      $group: {
        _id:       null,
        avgRating: { $avg: '$rating' },
        count:     { $sum: 1 },
      },
    },
  ])

  const avgRating    = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0
  const totalReviews = stats.length > 0 ? stats[0].count : 0

  await Package.findByIdAndUpdate(packageId, { rating: avgRating, totalReviews })

  return { rating: avgRating, totalReviews }
}

/**
 * Get star breakdown for a package (for display on detail pages)
 * Returns: { 1: N, 2: N, 3: N, 4: N, 5: N }
 */
export async function getPackageRatingBreakdown(packageId: string) {
  const breakdown = await Review.aggregate([
    {
      $match: {
        package:    new mongoose.Types.ObjectId(packageId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id:   '$rating',
        count: { $sum: 1 },
      },
    },
  ])

  const result: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  breakdown.forEach((b) => { result[b._id] = b.count })
  return result
}