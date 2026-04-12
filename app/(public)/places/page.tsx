import type { Metadata } from 'next'
import { ALL_PLACES } from '@/data/places'
import PlacesClient from './PlacesClient'

export const metadata: Metadata = {
  title: 'Places to Visit in Mathura & Vrindavan',
  description:
    'Explore 50+ sacred temples, ghats, and divine places in Mathura, Vrindavan, Gokul, Govardhan and Barsana. Detailed timings, entry fees, travel tips.',
  openGraph: {
    title: 'Sacred Places — Mathura Vrindavan Travel',
    description: 'Explore 50+ temples, ghats and sacred sites in Braj Bhoomi.',
  },
}

export default function PlacesPage() {
  return <PlacesClient places={ALL_PLACES} />
}