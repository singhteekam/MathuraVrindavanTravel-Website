import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ALL_PACKAGES, PACKAGE_DETAILS } from '@/data/packages'
import PackageDetailClient, { type PackageData } from './PackageDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

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
    openGraph: { title: pkg.name, description: pkg.shortDescription },
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const base = ALL_PACKAGES.find((p) => p.slug === slug)
  if (!base) notFound()

  // Fallback detail for packages not in PACKAGE_DETAILS
  const fallback = {
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
      day:         i + 1,
      title:       `Day ${i + 1}`,
      description: h,
      places:      [] as string[],
    })),
    pricing: base.pricing ?? [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: base.basePrice },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: Math.round(base.basePrice * 1.5) },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: Math.round(base.basePrice * 2.2) },
    ],
  }

  const detail = PACKAGE_DETAILS[slug] ?? fallback

  // Build the full package object that satisfies PackageData
  const fullPackage: PackageData = {
    slug:             base.slug,
    name:             base.name,
    duration:         base.duration,
    nights:           base.nights,
    cities:           base.cities,
    basePrice:        base.basePrice,
    rating:           base.rating,
    totalReviews:     base.totalReviews,
    isPopular:        base.isPopular,
    highlights:       base.highlights,
    shortDescription: base.shortDescription,
    inclusions:       detail.inclusions,
    exclusions:       detail.exclusions,
    itinerary:        detail.itinerary,
    pricing:          detail.pricing,
  }

  return <PackageDetailClient pkg={fullPackage} />
}
