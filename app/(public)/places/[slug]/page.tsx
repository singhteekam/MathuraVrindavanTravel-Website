import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ALL_PLACES } from '@/data/places'
import PlaceDetailClient from './PlaceDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

// Pre-build all 50+ place pages at build time
export async function generateStaticParams() {
  return ALL_PLACES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const place = ALL_PLACES.find((p) => p.slug === slug)
  if (!place) return { title: 'Place Not Found' }
  return {
    title: `${place.name} — ${place.city} | Mathura Vrindavan Travel`,
    description: place.shortDescription,
    openGraph: {
      title: place.name,
      description: place.shortDescription,
    },
  }
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params
  const place = ALL_PLACES.find((p) => p.slug === slug)
  if (!place) notFound()

  // Related places — same city, different slug
  const related = ALL_PLACES
    .filter((p) => p.city === place.city && p.slug !== place.slug)
    .slice(0, 3)

  return <PlaceDetailClient place={place} related={related} />
}