import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local explicitly — dotenv/config only reads .env by default
config({ path: resolve(process.cwd(), '.env.local') })

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
  console.log('✅  Connected to:', mongoose.connection.db?.databaseName, '\n')

  const Package = mongoose.models.Package ?? mongoose.model('Package', PackageSchema)

  let created = 0
  let updated  = 0

  for (const pkg of ALL_PACKAGES) {
    const detail  = PACKAGE_DETAILS[pkg.slug] ?? {}
    const fullPkg = {
      ...pkg,
      inclusions: detail.inclusions ?? [],
      exclusions: detail.exclusions ?? [],
      itinerary:  detail.itinerary  ?? [],
      pricing:    detail.pricing    ?? pkg.pricing ?? [],
    }

    const existing = await Package.findOne({ slug: pkg.slug })
    if (existing) {
      await Package.findOneAndUpdate({ slug: pkg.slug }, { $set: fullPkg })
      updated++
    } else {
      await Package.create(fullPkg)
      created++
    }
    console.log(`  ✓  ${pkg.name} (${pkg.duration}D) — featured: ${pkg.isFeatured}, active: ${pkg.isActive}`)
  }

  console.log(`\n🎉  Done! Created: ${created}  Updated: ${updated}`)
  await mongoose.disconnect()
  console.log('🔌  Disconnected.')
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})