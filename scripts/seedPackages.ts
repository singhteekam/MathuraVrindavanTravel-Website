/**
 * Seed script — populate MongoDB with all tour packages
 *
 * Usage:
 *   npx tsx scripts/seedPackages.ts
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { ALL_PACKAGES, PACKAGE_DETAILS } from '../data/packages'

const MONGODB_URI = process.env.MONGODB_URI ?? ''

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local')
  process.exit(1)
}

const PackageSchema = new mongoose.Schema({
  name:             String,
  slug:             { type: String, unique: true },
  duration:         Number,
  nights:           Number,
  cities:           [String],
  thumbnail:        { type: String, default: '' },
  images:           [String],
  shortDescription: String,
  highlights:       [String],
  itinerary:        [mongoose.Schema.Types.Mixed],
  inclusions:       [String],
  exclusions:       [String],
  pricing:          [mongoose.Schema.Types.Mixed],
  basePrice:        Number,
  isActive:         { type: Boolean, default: true },
  isFeatured:       { type: Boolean, default: false },
  isPopular:        { type: Boolean, default: false },
  rating:           { type: Number, default: 5.0 },
  totalReviews:     { type: Number, default: 0 },
  totalBookings:    { type: Number, default: 0 },
}, { timestamps: true })

async function seed() {
  console.log('🔗  Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected.\n')

  const Package = mongoose.models.Package ?? mongoose.model('Package', PackageSchema)

  let created = 0
  let updated = 0

  for (const pkg of ALL_PACKAGES) {
    const detail  = PACKAGE_DETAILS[pkg.slug] ?? {}
    const fullPkg = {
      ...pkg,
      inclusions: detail.inclusions  ?? [],
      exclusions: detail.exclusions  ?? [],
      itinerary:  detail.itinerary   ?? [],
      pricing:    detail.pricing     ?? pkg.pricing ?? [],
    }

    await Package.findOneAndUpdate(
      { slug: pkg.slug },
      { $set: fullPkg },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    const isNew = !PACKAGE_DETAILS[pkg.slug]
    if (isNew) created++; else updated++

    console.log(`  ✓  ${pkg.name} (${pkg.duration}D)`)
  }

  console.log(`\n🎉  Done! Packages seeded: ${ALL_PACKAGES.length}`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})