import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? ''
if (!MONGODB_URI) { console.error('❌  MONGODB_URI not set in .env.local'); process.exit(1) }

// ─── Schema (mirrors models/Package.ts) ──────────────────────────────────────
const PackageSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true },
  duration: Number, nights: Number, cities: [String],
  thumbnail:        { type: String, default: '' },
  images:           [String],
  shortDescription: String, highlights: [String],
  itinerary:        [mongoose.Schema.Types.Mixed],
  inclusions:       [String], exclusions: [String],
  pricing:          [mongoose.Schema.Types.Mixed],
  basePrice:        Number,
  isActive:         { type: Boolean, default: true },
  isFeatured:       { type: Boolean, default: false },
  isPopular:        { type: Boolean, default: false },
  rating:           { type: Number,  default: 0 },
  totalReviews:     { type: Number,  default: 0 },
  totalBookings:    { type: Number,  default: 0 },
}, { timestamps: true })

// ─── Image helper ─────────────────────────────────────────────────────────────
const img = (slug: string) => `/images/packages/${slug}.jpg`

// ─── Shared inclusions/exclusions ────────────────────────────────────────────
const BASE_INCLUSIONS = [
  'AC vehicle throughout the tour',
  'Experienced local driver-guide',
  'All inter-city transfers',
  'Hotel finding assistance',
  'Pickup & drop from your location',
  'Fuel charges included',
]
const BASE_EXCLUSIONS = [
  'Meals (breakfast, lunch, dinner)',
  'Hotel accommodation cost',
  'Entry fees at temples',
  'Personal expenses & tips',
  'Guide charges (optional add-on ₹500/day)',
]

// ─── Complete package data ────────────────────────────────────────────────────
const PACKAGES = [

  {
    slug:      'same-day-mathura-vrindavan',
    name:      'Same Day Mathura Vrindavan Tour',
    duration:  1, nights: 0,
    cities:    ['Mathura', 'Vrindavan'],
    thumbnail: img('same-day-mathura-vrindavan'),
    images:    [img('same-day-mathura-vrindavan')],
    basePrice: 2000,
    rating:    0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: true, isPopular: true,
    shortDescription: 'Complete Mathura and Vrindavan darshan in a single day — ideal for pilgrims on a tight schedule. 8+ temples covered.',
    highlights: [
      'Krishna Janmabhoomi & Dwarkadhish Temple',
      'Vishram Ghat evening aarti',
      'Banke Bihari & ISKCON Temple',
      'Prem Mandir light show',
    ],
    inclusions: [
      'AC vehicle for the entire day (12 hours)',
      'Experienced local driver-guide',
      'All inter-city transfers',
      'Hotel & restaurant recommendations',
      'Pickup & drop from your location',
      'Fuel charges included',
      'Complimentary mineral water',
    ],
    exclusions: [
      ...BASE_EXCLUSIONS,
    ],
    itinerary: [
      {
        day: 1,
        title: 'Complete Mathura & Vrindavan Darshan',
        description: 'Start your morning with Mathura darshan — visit Krishna Janmabhoomi, Dwarkadhish Temple, and offer prayers at Vishram Ghat. After lunch, proceed to Vrindavan for Banke Bihari Temple, ISKCON, and witness the breathtaking evening aarti and light show at Prem Mandir.',
        places: ['Krishna Janmabhoomi', 'Dwarkadhish Temple', 'Vishram Ghat', 'Gita Mandir', 'Banke Bihari Temple', 'ISKCON Vrindavan', 'Nidhivan', 'Prem Mandir'],
      },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 2000 },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 2500 },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 3000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 4500 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 5500 },
    ],
  },

  {
    slug:      '2-days-mathura-vrindavan',
    name:      '2 Days Mathura Vrindavan Darshan',
    duration:  2, nights: 1,
    cities:    ['Mathura', 'Vrindavan'],
    thumbnail: img('2-days-mathura-vrindavan'),
    images:    [img('2-days-mathura-vrindavan')],
    basePrice: 3500,
    rating: 0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: true, isPopular: true,
    shortDescription: 'Two days to soak in the spiritual energy of Mathura and Vrindavan with a comfortable overnight stay.',
    highlights: [
      'Complete Mathura darshan on Day 1',
      'Vrindavan temples on Day 2',
      'Evening aarti at Vishram Ghat',
      'Prem Mandir light show',
      'Hotel assistance included',
    ],
    inclusions: [...BASE_INCLUSIONS],
    exclusions: [...BASE_EXCLUSIONS],
    itinerary: [
      {
        day: 1, title: 'Mathura Darshan',
        description: 'Arrive in Mathura and check into your hotel. Begin with Krishna Janmabhoomi — the holy birthplace of Lord Krishna. Visit Dwarkadhish Temple, Gita Mandir, and end the day with the evening aarti at the sacred Vishram Ghat on the Yamuna.',
        places: ['Krishna Janmabhoomi', 'Dwarkadhish Temple', 'Gita Mandir', 'Vishram Ghat Evening Aarti'],
      },
      {
        day: 2, title: 'Vrindavan Darshan',
        description: 'Morning mangala aarti at Banke Bihari Temple. Visit ISKCON, Nidhivan, Seva Kunj, and Radha Damodara Temple. End with the spectacular Prem Mandir evening light show.',
        places: ['Banke Bihari Temple', 'ISKCON Temple', 'Nidhivan', 'Seva Kunj', 'Radha Damodara Temple', 'Prem Mandir'],
      },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 3500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 4500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 5500  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 8000  },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 10000 },
    ],
  },

  {
    slug:      '3-days-mathura-vrindavan-govardhan',
    name:      '3 Days Govardhan Parikrama Package',
    duration:  3, nights: 2,
    cities:    ['Mathura', 'Vrindavan', 'Govardhan'],
    thumbnail: img('3-days-mathura-vrindavan-govardhan'),
    images:    [img('3-days-mathura-vrindavan-govardhan')],
    basePrice: 5000,
    rating: 0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: true, isPopular: true,
    shortDescription: 'Extended pilgrimage covering Mathura, Vrindavan, Govardhan and Barsana over three blessed days.',
    highlights: [
      'Govardhan Parikrama (21 km sacred walk)',
      'Radha Kund & Shyam Kund darshan',
      'Barsana Radha Rani Temple',
      'Complete Mathura & Vrindavan darshan',
      'Prem Mandir light show',
    ],
    inclusions: [...BASE_INCLUSIONS],
    exclusions: [...BASE_EXCLUSIONS],
    itinerary: [
      {
        day: 1, title: 'Mathura Darshan',
        description: 'Arrive and check into hotel. Visit Krishna Janmabhoomi, Dwarkadhish Temple, Gita Mandir. Evening aarti at Vishram Ghat.',
        places: ['Krishna Janmabhoomi', 'Dwarkadhish Temple', 'Gita Mandir', 'Vishram Ghat'],
      },
      {
        day: 2, title: 'Vrindavan Darshan',
        description: 'Full day in Vrindavan — Banke Bihari, ISKCON, Nidhivan, Seva Kunj. Evening: Prem Mandir light show.',
        places: ['Banke Bihari Temple', 'ISKCON Temple', 'Nidhivan', 'Seva Kunj', 'Prem Mandir'],
      },
      {
        day: 3, title: 'Govardhan & Barsana',
        description: 'Early morning drive to Govardhan. Govardhan Parikrama (by vehicle/walk). Mukharvind darshan. Radha Kund & Shyam Kund. Afternoon: Barsana — Radha Rani Temple and Nandgaon. Return to Mathura.',
        places: ['Govardhan Hill', 'Mukharvind', 'Radha Kund', 'Shyam Kund', 'Radha Rani Temple Barsana', 'Nandgaon'],
      },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 5000  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 6500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 8000  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 12000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 15000 },
    ],
  },

  {
    slug:      '3-days-mathura-vrindavan-agra',
    name:      '3 Days Mathura Vrindavan + Agra Tour',
    duration:  3, nights: 2,
    cities:    ['Mathura', 'Vrindavan', 'Agra'],
    thumbnail: img('3-days-mathura-vrindavan-agra'),
    images:    [img('3-days-mathura-vrindavan-agra')],
    basePrice: 5500,
    rating: 0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: true, isPopular: false,
    shortDescription: 'Combine a divine pilgrimage with the wonder of the Taj Mahal in this perfect 3-day spiritual and heritage tour.',
    highlights: [
      'Taj Mahal & Agra Fort visit',
      'Complete Mathura Vrindavan darshan',
      'Prem Mandir light show',
      'Experienced driver-guide',
    ],
    inclusions: [...BASE_INCLUSIONS],
    exclusions: [...BASE_EXCLUSIONS, 'Taj Mahal entry fee (₹1300 for Indians, ₹1300 for foreigners)'],
    itinerary: [
      {
        day: 1, title: 'Mathura Darshan',
        description: 'Arrive at Mathura. Visit Krishna Janmabhoomi, Dwarkadhish Temple, Vishram Ghat evening aarti.',
        places: ['Krishna Janmabhoomi', 'Dwarkadhish Temple', 'Vishram Ghat'],
      },
      {
        day: 2, title: 'Vrindavan Darshan',
        description: 'Full day in Vrindavan — Banke Bihari, ISKCON, Nidhivan. Evening: Prem Mandir light show.',
        places: ['Banke Bihari Temple', 'ISKCON Temple', 'Nidhivan', 'Prem Mandir'],
      },
      {
        day: 3, title: 'Agra — Taj Mahal & Agra Fort',
        description: 'Early morning drive to Agra. Sunrise at Taj Mahal — the most magical time to visit. Agra Fort. Mehtab Bagh. Return journey.',
        places: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh'],
      },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 5500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 7000  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 8500  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 13000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 16000 },
    ],
  },

  {
    slug:      '4-days-mathura-vrindavan',
    name:      '4 Days Complete Braj Pilgrimage',
    duration:  4, nights: 3,
    cities:    ['Mathura', 'Vrindavan', 'Gokul', 'Govardhan'],
    thumbnail: img('4-days-mathura-vrindavan'),
    images:    [img('4-days-mathura-vrindavan')],
    basePrice: 7500,
    rating: 0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: false, isPopular: false,
    shortDescription: 'The most comprehensive 4-day Braj pilgrimage covering Mathura, Vrindavan, Gokul, Govardhan, Nandgaon and Barsana.',
    highlights: [
      'All major Mathura & Vrindavan temples',
      'Gokul Raman Reti darshan',
      'Govardhan Parikrama',
      'Nandgaon & Barsana included',
      'Radha Kund & Shyam Kund',
    ],
    inclusions: [...BASE_INCLUSIONS],
    exclusions: [...BASE_EXCLUSIONS],
    itinerary: [
      { day: 1, title: 'Mathura Darshan', description: 'Arrive. Krishna Janmabhoomi, Dwarkadhish, Gita Mandir, Vishram Ghat aarti.', places: ['Krishna Janmabhoomi', 'Dwarkadhish Temple', 'Gita Mandir', 'Vishram Ghat'] },
      { day: 2, title: 'Vrindavan — Part 1', description: 'Banke Bihari morning aarti. ISKCON. Nidhivan. Seva Kunj. Radha Damodara Temple.', places: ['Banke Bihari Temple', 'ISKCON Temple', 'Nidhivan', 'Seva Kunj'] },
      { day: 3, title: 'Vrindavan Part 2 + Gokul', description: 'Prem Mandir morning darshan. Drive to Gokul — Raman Reti, Chaurasi Khamba. Return via Govardhan.', places: ['Prem Mandir', 'Raman Reti Gokul', 'Chaurasi Khamba', 'Govardhan Hill'] },
      { day: 4, title: 'Nandgaon, Barsana & Govardhan', description: 'Nandgaon — birthplace of Nand Baba. Barsana Radha Rani Temple. Radha Kund. Govardhan Mukharvind. Return.', places: ['Nandgaon Temple', 'Radha Rani Temple Barsana', 'Radha Kund', 'Govardhan Mukharvind'] },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 7500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 9500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 12000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 18000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 22000 },
    ],
  },

  {
    slug:      '7-days-braj-84-kos-yatra',
    name:      '7 Days Shri Braj 84 Kos Yatra',
    duration:  7, nights: 6,
    cities:    ['Mathura', 'Vrindavan', 'Govardhan', 'Barsana', 'Nandgaon'],
    thumbnail: img('7-days-braj-84-kos-yatra'),
    images:    [img('7-days-braj-84-kos-yatra')],
    basePrice: 18000,
    rating: 0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: false, isPopular: false,
    shortDescription: 'The ultimate Braj pilgrimage — 7 days covering the sacred 84 Kos circuit of every divine site of Lord Krishna.',
    highlights: [
      'Complete 84 Kos Braj circuit',
      'All major Braj Dham covered',
      'Govardhan Parikrama on foot',
      'Gokul, Raman Reti, Mahavan',
      'Premium hotel accommodation',
    ],
    inclusions: [
      'AC vehicle for all 7 days',
      'Experienced local driver-guide',
      'Hotel finding assistance (all 6 nights)',
      'All inter-city transfers',
      'Pickup & drop from your location',
      'Fuel charges included',
    ],
    exclusions: [...BASE_EXCLUSIONS],
    itinerary: [
      { day: 1, title: 'Arrival & Mathura', description: 'Arrive Mathura. Rest. Evening — Vishram Ghat aarti.', places: ['Vishram Ghat'] },
      { day: 2, title: 'Mathura Darshan', description: 'Complete Mathura temple circuit.', places: ['Krishna Janmabhoomi', 'Dwarkadhish Temple', 'Gita Mandir', 'All 25 Ghats'] },
      { day: 3, title: 'Vrindavan — Part 1', description: 'Banke Bihari, ISKCON, Nidhivan, Seva Kunj, Radha Damodara.', places: ['Banke Bihari Temple', 'ISKCON', 'Nidhivan', 'Seva Kunj'] },
      { day: 4, title: 'Vrindavan — Part 2', description: 'Prem Mandir, Pagal Baba Temple, Keshi Ghat, Katyayani Peeth.', places: ['Prem Mandir', 'Keshi Ghat', 'Madan Mohan Temple'] },
      { day: 5, title: 'Gokul, Mahavan & Brahmand Ghat', description: 'Raman Reti, Chaurasi Khamba, Mahavan, Brahmand Ghat.', places: ['Raman Reti', 'Chaurasi Khamba', 'Mahavan', 'Brahmand Ghat'] },
      { day: 6, title: 'Govardhan Parikrama', description: 'Full Govardhan Parikrama. Radha Kund, Shyam Kund, Manasi Ganga.', places: ['Govardhan Hill', 'Radha Kund', 'Shyam Kund', 'Manasi Ganga'] },
      { day: 7, title: 'Barsana, Nandgaon & Departure', description: 'Radha Rani Temple Barsana, Nandgaon, Unchagaon. Departure.', places: ['Radha Rani Temple', 'Nandgaon Temple', 'Unchagaon'] },
    ],
    pricing: [
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 18000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 28000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 35000 },
    ],
  },

  {
    slug:      '8-days-braj-84-kos-yatra',
    name:      '8 Days Shri Braj 84 Kos Yatra — Extended',
    duration:  8, nights: 7,
    cities:    ['Mathura', 'Vrindavan', 'Govardhan', 'Barsana', 'Nandgaon', 'Agra'],
    thumbnail: img('8-days-braj-84-kos-yatra'),
    images:    [img('8-days-braj-84-kos-yatra')],
    basePrice: 22000,
    rating: 0, totalReviews: 0, totalBookings: 0,
    isActive: true, isFeatured: false, isPopular: false,
    shortDescription: 'Eight days of complete immersion in Braj Mandal — includes Agra on Day 8 for the Taj Mahal.',
    highlights: [
      'Complete 84 Kos Braj circuit',
      'Taj Mahal on Day 8',
      'Luxury accommodation',
      'All Braj villages covered',
    ],
    inclusions: [
      'AC vehicle for all 8 days',
      'Experienced driver-guide',
      'Hotel assistance (7 nights)',
      'All inter-city transfers',
      'Fuel charges included',
    ],
    exclusions: [...BASE_EXCLUSIONS, 'Taj Mahal entry ticket'],
    itinerary: [
      { day: 1, title: 'Arrival & Vishram Ghat Aarti',    description: 'Arrive. Vishram Ghat evening aarti.',    places: ['Vishram Ghat'] },
      { day: 2, title: 'Complete Mathura Darshan',         description: 'Full Mathura temple circuit.',           places: ['Krishna Janmabhoomi', 'Dwarkadhish', 'Gita Mandir'] },
      { day: 3, title: 'Vrindavan — Part 1',               description: 'Banke Bihari, ISKCON, Nidhivan.',       places: ['Banke Bihari', 'ISKCON', 'Nidhivan'] },
      { day: 4, title: 'Vrindavan — Part 2',               description: 'Prem Mandir, Keshi Ghat, Madan Mohan.', places: ['Prem Mandir', 'Keshi Ghat', 'Madan Mohan Temple'] },
      { day: 5, title: 'Gokul & Mahavan',                  description: 'Raman Reti, Mahavan, Brahmand Ghat.',   places: ['Raman Reti', 'Mahavan', 'Brahmand Ghat'] },
      { day: 6, title: 'Govardhan Parikrama',              description: 'Full parikrama, Radha Kund, Manasi Ganga.', places: ['Govardhan', 'Radha Kund', 'Manasi Ganga'] },
      { day: 7, title: 'Barsana & Nandgaon',              description: 'Radha Rani Temple, Nandgaon.',           places: ['Radha Rani Temple', 'Nandgaon'] },
      { day: 8, title: 'Agra — Taj Mahal & Departure',    description: 'Sunrise Taj Mahal, Agra Fort. Departure.', places: ['Taj Mahal', 'Agra Fort'] },
    ],
    pricing: [
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 22000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 34000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 42000 },
    ],
  },
]

// ─── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  console.log('🔗  Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to:', mongoose.connection.db?.databaseName, '\n')

  const Package = mongoose.models.Package ?? mongoose.model('Package', PackageSchema)

  let created = 0
  let updated  = 0

  for (const pkg of PACKAGES) {
    const existing = await Package.findOne({ slug: pkg.slug })
    if (existing) {
      await Package.findOneAndUpdate({ slug: pkg.slug }, { $set: pkg })
      console.log(`  ↻  Updated: ${pkg.name} (featured: ${pkg.isFeatured})`)
      updated++
    } else {
      await Package.create(pkg)
      console.log(`  ✓  Created: ${pkg.name} (featured: ${pkg.isFeatured})`)
      created++
    }
  }

  console.log(`\n🎉  Done! Created: ${created}  Updated: ${updated}`)
  console.log(`\n📁  Package images expected at:`)
  console.log(`    web/public/images/packages/{slug}.jpg`)
  console.log(`    Drop your photos there — Next.js serves them automatically.\n`)
  await mongoose.disconnect()
  console.log('🔌  Disconnected.')
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})