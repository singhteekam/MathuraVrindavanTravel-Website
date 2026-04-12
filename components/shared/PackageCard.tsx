import Link from 'next/link'
import { Clock, Star, Users, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PackageCardProps {
  slug: string
  name: string
  duration: number
  nights: number
  cities: string[]
  thumbnail?: string
  basePrice: number
  rating: number
  totalReviews: number
  highlights: string[]
  isPopular?: boolean
}

export default function PackageCard({
  slug,
  name,
  duration,
  nights,
  cities,
  thumbnail,
  basePrice,
  rating,
  totalReviews,
  highlights,
  isPopular,
}: PackageCardProps) {
  return (
    <div className="card card-hover group overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #ff7d0f20, #4338ca20)',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🛕</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge-saffron badge">
            <Clock size={10} />
            {duration} {duration === 1 ? 'Day' : 'Days'}
          </span>
          {isPopular && (
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
              🔥 Popular
            </span>
          )}
        </div>

        {/* Rating */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(0,0,0,0.6)', color: '#fbbf24' }}
        >
          <Star size={10} fill="currentColor" />
          {rating.toFixed(1)}
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>({totalReviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Cities */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#ff7d0f' }}>
          {cities.join(' · ')}
        </p>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-3 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>

        {/* Highlights */}
        <ul className="space-y-1 mb-4 flex-1">
          {highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
              {h}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid #f3f4f6' }}
        >
          <div>
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-xl font-bold" style={{ color: '#ff7d0f' }}>
              {formatCurrency(basePrice)}
            </p>
          </div>
          <Link
            href={`/packages/${slug}`}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: '#fff8ed',
              color: '#f06205',
              border: '1px solid #ffdba8',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff7d0f'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff8ed'
              e.currentTarget.style.color = '#f06205'
            }}
          >
            View Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}