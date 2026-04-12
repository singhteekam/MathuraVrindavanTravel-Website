/**
 * Seed script — run once to populate MongoDB with all places
 *
 * Usage:
 *   npx tsx scripts/seedPlaces.ts
 *
 * Make sure MONGODB_URI is set in .env.local before running.
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { ALL_PLACES } from '../data/places'

const MONGODB_URI = process.env.MONGODB_URI ?? ''

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local')
  process.exit(1)
}

// Inline Place schema (avoid circular import issues in scripts)
const PlaceSchema = new mongoose.Schema({
  name:             String,
  slug:             { type: String, unique: true },
  city:             String,
  type:             String,
  shortDescription: String,
  thumbnail:        { type: String, default: '' },
  images:           [String],
  location:         {
    address: String,
    lat:     Number,
    lng:     Number,
  },
  timings:      { morning: String, evening: String, note: String },
  entryFee:     String,
  timeRequired: String,
  isFeatured:   { type: Boolean, default: false },
  tags:         [String],
  sections:     [mongoose.Schema.Types.Mixed],
}, { timestamps: true })

async function seed() {
  console.log('🔗  Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected.\n')

  const Place = mongoose.models.Place ?? mongoose.model('Place', PlaceSchema)

  let created = 0
  let updated = 0

  for (const place of ALL_PLACES) {
    const result = await Place.findOneAndUpdate(
      { slug: place.slug },
      { $set: place },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    if (result.createdAt === result.updatedAt) {
      created++
    } else {
      updated++
    }
    console.log(`  ✓  ${place.name} (${place.city})`)
  }

  console.log(`\n🎉  Done! Created: ${created}  Updated: ${updated}`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})