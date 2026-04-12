'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/shared/SectionHeader'
import PlaceCard from '@/components/shared/PlaceCard'

const places = [
  {
    slug: 'krishna-janmabhoomi',
    name: 'Krishna Janmabhoomi Temple',
    city: 'Mathura',
    type: 'temple',
    shortDescription: 'The sacred birthplace of Lord Krishna — the holiest site in all of Braj Bhoomi, visited by millions of devotees every year.',
    timeRequired: '1-2 hrs',
    entryFee: 'Free',
    isFeatured: true,
  },
  {
    slug: 'banke-bihari-temple',
    name: 'Banke Bihari Temple',
    city: 'Vrindavan',
    type: 'temple',
    shortDescription: 'One of the most revered temples in Vrindavan, where the divine presence of Thakur Banke Bihari Ji is felt by every devotee.',
    timeRequired: '1 hr',
    entryFee: 'Free',
    isFeatured: true,
  },
  {
    slug: 'prem-mandir',
    name: 'Prem Mandir',
    city: 'Vrindavan',
    type: 'temple',
    shortDescription: 'A stunning white marble temple that glows with colorful lights at night, depicting the divine love of Radha and Krishna.',
    timeRequired: '1-2 hrs',
    entryFee: 'Free',
    isFeatured: true,
  },
  {
    slug: 'vishram-ghat',
    name: 'Vishram Ghat',
    city: 'Mathura',
    type: 'ghat',
    shortDescription: 'The holiest ghat on the Yamuna river — where Lord Krishna rested after defeating Kansa. Evening aarti here is breathtaking.',
    timeRequired: '1 hr',
    entryFee: 'Free',
    isFeatured: false,
  },
  {
    slug: 'iskcon-vrindavan',
    name: 'ISKCON Temple Vrindavan',
    city: 'Vrindavan',
    type: 'temple',
    shortDescription: 'A magnificent temple of the International Society for Krishna Consciousness, known for its serene atmosphere and melodious kirtans.',
    timeRequired: '1-2 hrs',
    entryFee: 'Free',
    isFeatured: false,
  },
  {
    slug: 'raman-reti',
    name: 'Raman Reti',
    city: 'Gokul',
    type: 'sacred-site',
    shortDescription: 'The sacred sandy playground where Lord Krishna spent His divine childhood with His friends and the cows of Gokul.',
    timeRequired: '1-2 hrs',
    entryFee: 'Free',
    isFeatured: false,
  },
]

export default function PopularPlaces() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            subtitle="Sacred Places"
            title="Explore the Holy Dham of Braj"
            description="From ancient temples to sacred ghats — every corner of Mathura and Vrindavan carries the divine energy of Lord Krishna."
            centered={false}
          />
          <Link
            href="/places"
            className="inline-flex items-center gap-2 font-semibold text-sm flex-shrink-0"
            style={{ color: '#ff7d0f' }}
          >
            All 50+ Places <ArrowRight size={16} />
          </Link>
        </div>

        {/* Places grid — first one is large */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, i) => (
            <motion.div
              key={place.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <PlaceCard {...place} />
            </motion.div>
          ))}
        </div>

        {/* City filter tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap gap-3 justify-center"
        >
          {['All Places', 'Mathura', 'Vrindavan', 'Gokul', 'Govardhan', 'Barsana'].map((city) => (
            <Link
              key={city}
              href={city === 'All Places' ? '/places' : `/places?city=${city.toLowerCase()}`}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: '#fff8ed',
                color: '#c74a06',
                border: '1px solid #ffdba8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff7d0f'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff8ed'
                e.currentTarget.style.color = '#c74a06'
              }}
            >
              {city}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}