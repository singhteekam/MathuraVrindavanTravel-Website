'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/shared/SectionHeader'
import PackageCard from '@/components/shared/PackageCard'

const FILTER_TABS = ['All', '1 Day', '2-3 Days', '4+ Days']

const packages = [
  {
    slug: 'same-day-mathura-vrindavan',
    name: 'Same Day Mathura Vrindavan Tour',
    duration: 1,
    nights: 0,
    cities: ['Mathura', 'Vrindavan'],
    basePrice: 2000,
    rating: 4.8,
    totalReviews: 312,
    isPopular: true,
    highlights: [
      'Krishna Janmabhoomi & Dwarkadhish Temple',
      'Banke Bihari & ISKCON Temple',
      'Vishram Ghat & Prem Mandir',
    ],
  },
  {
    slug: '2-days-mathura-vrindavan',
    name: '2 Days Mathura Vrindavan Darshan',
    duration: 2,
    nights: 1,
    cities: ['Mathura', 'Vrindavan'],
    basePrice: 3500,
    rating: 4.9,
    totalReviews: 251,
    isPopular: true,
    highlights: [
      'Complete Mathura darshan on Day 1',
      'Vrindavan temples on Day 2',
      'Hotel assistance included',
    ],
  },
  {
    slug: '3-days-mathura-vrindavan-govardhan',
    name: '3 Days Goverdhan Parikrama Package',
    duration: 3,
    nights: 2,
    cities: ['Mathura', 'Vrindavan', 'Govardhan'],
    basePrice: 5000,
    rating: 4.7,
    totalReviews: 547,
    isPopular: false,
    highlights: [
      'Govardhan Parikrama experience',
      'Radha Kund & Shyam Kund visit',
      'Barsana Radha Rani Temple',
    ],
  },
  {
    slug: '4-days-mathura-vrindavan',
    name: '4 Days Complete Braj Pilgrimage',
    duration: 4,
    nights: 3,
    cities: ['Mathura', 'Vrindavan', 'Gokul', 'Govardhan'],
    basePrice: 7500,
    rating: 4.9,
    totalReviews: 410,
    isPopular: false,
    highlights: [
      'All major Mathura & Vrindavan temples',
      'Gokul Raman Reti darshan',
      'Nandgaon & Barsana included',
    ],
  },
  {
    slug: '3-days-mathura-vrindavan-agra',
    name: '3 Days Mathura Vrindavan + Agra',
    duration: 3,
    nights: 2,
    cities: ['Mathura', 'Vrindavan', 'Agra'],
    basePrice: 5500,
    rating: 4.8,
    totalReviews: 328,
    isPopular: false,
    highlights: [
      'Taj Mahal & Agra Fort visit',
      'Complete Mathura Vrindavan darshan',
      'Experienced driver-guide',
    ],
  },
  {
    slug: '7-days-braj-84-kos-yatra',
    name: '7 Days Shri Braj 84 Kos Yatra',
    duration: 7,
    nights: 6,
    cities: ['Mathura', 'Vrindavan', 'Govardhan', 'Barsana'],
    basePrice: 18000,
    rating: 4.9,
    totalReviews: 152,
    isPopular: false,
    highlights: [
      'Complete 84 Kos Parikrama',
      'All Braj Dham coverage',
      'Premium hotel stay included',
    ],
  },
]

function filterPackages(tab: string) {
  if (tab === 'All') return packages
  if (tab === '1 Day') return packages.filter((p) => p.duration === 1)
  if (tab === '2-3 Days') return packages.filter((p) => p.duration >= 2 && p.duration <= 3)
  if (tab === '4+ Days') return packages.filter((p) => p.duration >= 4)
  return packages
}

export default function FeaturedPackages() {
  const [activeTab, setActiveTab] = useState('All')
  const filtered = filterPackages(activeTab)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            subtitle="Tour Packages"
            title="Choose Your Perfect Braj Journey"
            description="Handcrafted spiritual tour packages for every devotee — from quick day trips to extended pilgrimage retreats."
            centered={false}
          />
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 font-semibold text-sm flex-shrink-0"
            style={{ color: '#ff7d0f' }}
          >
            View All Packages <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
              style={
                activeTab === tab
                  ? {
                      background: '#ff7d0f',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(255,125,15,0.35)',
                    }
                  : {
                      background: '#fff',
                      color: '#6b7280',
                      border: '1px solid #e5e7eb',
                    }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Package grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg, i) => (
            <motion.div
              key={pkg.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <PackageCard {...pkg} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 mb-4">
            Can&apos;t find the right package? We create custom itineraries too!
          </p>
          <Link href="/contact" className="btn-secondary">
            Request Custom Package
          </Link>
        </motion.div>
      </div>
    </section>
  )
}