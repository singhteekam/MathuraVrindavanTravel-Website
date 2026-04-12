import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ALL_PACKAGES } from '@/data/packages'
import PackageDetailClient from './PackageDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

// Pre-generate all package URLs at build time (SSG)
export async function generateStaticParams() {
  return ALL_PACKAGES.map((pkg) => ({ slug: pkg.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pkg = ALL_PACKAGES.find((p) => p.slug === slug)
  if (!pkg) return { title: 'Package Not Found' }
  return {
    title: `${pkg.name} — Mathura Vrindavan Travel`,
    description: pkg.shortDescription,
    openGraph: {
      title: pkg.name,
      description: pkg.shortDescription,
    },
  }
}

// Full package detail data (will come from MongoDB later)
const PACKAGE_DETAILS: Record<string, object> = {
  'same-day-mathura-vrindavan': {
    inclusions: [
      'AC vehicle for the entire day',
      'Experienced local driver-guide',
      'All inter-city transfers',
      'Hotel & restaurant recommendations',
      'Pickup & drop from your location in Mathura',
      'Fuel charges included',
    ],
    exclusions: [
      'Meals (breakfast, lunch, dinner)',
      'Entry fees at temples',
      'Personal expenses & tips',
      'Guide charges (optional add-on)',
      'Hotel accommodation',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Complete Mathura & Vrindavan Darshan',
        description:
          'Start your morning with Mathura darshan — visit Krishna Janmabhoomi, Dwarkadhish Temple, and offer prayers at Vishram Ghat. After lunch, proceed to Vrindavan for Banke Bihari Temple, ISKCON, and witness the breathtaking evening aarti at Prem Mandir.',
        places: [
          'Krishna Janmabhoomi Temple',
          'Dwarkadhish Temple',
          'Vishram Ghat',
          'Gita Mandir',
          'Banke Bihari Temple',
          'ISKCON Vrindavan',
          'Prem Mandir',
          'Seva Kunj',
        ],
      },
    ],
    pricing: [
      { carType: 'swift',   carName: 'Swift Dzire (4 pax)',    price: 2000 },
      { carType: 'eeco',    carName: 'Maruti Eeco (7 pax)',    price: 2500 },
      { carType: 'ertiga',  carName: 'Maruti Ertiga (7 pax)',  price: 3000 },
      { carType: 'innova',  carName: 'Toyota Innova (8 pax)',  price: 4500 },
      { carType: 'crysta',  carName: 'Innova Crysta (7 pax)', price: 5500 },
    ],
  },
  '2-days-mathura-vrindavan': {
    inclusions: [
      'AC vehicle for both days',
      'Experienced local driver-guide',
      'Hotel finding assistance',
      'All inter-city transfers',
      'Pickup & drop from your location',
      'Fuel charges included',
    ],
    exclusions: [
      'Meals (breakfast, lunch, dinner)',
      'Hotel accommodation cost',
      'Entry fees at temples',
      'Personal expenses & tips',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Mathura Darshan',
        description:
          'Arrive in Mathura and check in to your hotel. Begin with Krishna Janmabhoomi — the holy birthplace of Lord Krishna. Visit Dwarkadhish Temple, Gita Mandir, and end the day with evening aarti at the sacred Vishram Ghat on the Yamuna.',
        places: [
          'Krishna Janmabhoomi Temple',
          'Dwarkadhish Temple',
          'Gita Mandir',
          'Vishram Ghat Evening Aarti',
          'Rangji Temple',
        ],
      },
      {
        day: 2,
        title: 'Vrindavan Darshan',
        description:
          'Morning mangala aarti at Banke Bihari Temple followed by a peaceful visit to ISKCON. Explore the divine Nidhivan and Seva Kunj. End your trip with the illuminated Prem Mandir and its spectacular evening light show before your departure.',
        places: [
          'Banke Bihari Temple',
          'ISKCON Temple',
          'Nidhivan & Seva Kunj',
          'Radha Damodara Temple',
          'Prem Mandir Evening',
        ],
      },
    ],
    pricing: [
      { carType: 'swift',   carName: 'Swift Dzire (4 pax)',    price: 3500  },
      { carType: 'eeco',    carName: 'Maruti Eeco (7 pax)',    price: 4500  },
      { carType: 'ertiga',  carName: 'Maruti Ertiga (7 pax)',  price: 5500  },
      { carType: 'innova',  carName: 'Toyota Innova (8 pax)',  price: 8000  },
      { carType: 'crysta',  carName: 'Innova Crysta (7 pax)', price: 10000 },
    ],
  },
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const base = ALL_PACKAGES.find((p) => p.slug === slug)
  if (!base) notFound()

  const detail = PACKAGE_DETAILS[slug] ?? {
    inclusions: [
      'AC vehicle throughout the tour',
      'Experienced local driver',
      'All inter-city transfers',
      'Hotel assistance',
      'Fuel charges included',
    ],
    exclusions: [
      'Meals',
      'Hotel accommodation cost',
      'Entry fees',
      'Personal expenses',
    ],
    itinerary: base.highlights.map((h, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      description: h,
      places: [],
    })),
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',   price: base.basePrice },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)', price: Math.round(base.basePrice * 1.5) },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)', price: Math.round(base.basePrice * 2.2) },
    ],
  }

  const fullPackage = { ...base, ...detail }
  return <PackageDetailClient pkg={fullPackage} />
}