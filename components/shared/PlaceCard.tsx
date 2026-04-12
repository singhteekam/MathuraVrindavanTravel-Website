import Link from 'next/link'
import { MapPin, Clock, ArrowRight } from 'lucide-react'

interface PlaceCardProps {
  slug: string
  name: string
  city: string
  type: string
  shortDescription: string
  thumbnail?: string
  timeRequired?: string
  entryFee?: string
  isFeatured?: boolean
}

export default function PlaceCard({
  slug,
  name,
  city,
  type,
  shortDescription,
  thumbnail,
  timeRequired,
  entryFee,
  isFeatured,
}: PlaceCardProps) {
  const typeEmoji: Record<string, string> = {
    temple: '🛕',
    ghat: '🌊',
    garden: '🌺',
    museum: '🏛️',
    'sacred-site': '🙏',
    hill: '⛰️',
    market: '🛒',
  }

  return (
    <Link href={`/places/${slug}`} className="group card card-hover overflow-hidden block h-full">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #fff8ed, #ffefd4)',
            }}
          >
            <span className="text-5xl">{typeEmoji[type] ?? '🛕'}</span>
          </div>
        )}

        {/* City badge */}
        <div className="absolute top-3 left-3">
          <span className="badge-saffron badge">
            <MapPin size={9} />
            {city}
          </span>
        </div>

        {isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="badge" style={{ background: '#312e81', color: '#c7d2fe' }}>
              ⭐ Must Visit
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#ff7d0f' }}>
          {typeEmoji[type]} {type.replace('-', ' ')}
        </p>
        <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {timeRequired && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {timeRequired}
              </span>
            )}
            {entryFee && (
              <span className="font-medium" style={{ color: entryFee === 'Free' ? '#16a34a' : '#6b7280' }}>
                {entryFee === 'Free' ? '✓ Free Entry' : `₹${entryFee}`}
              </span>
            )}
          </div>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: '#ff7d0f' }}
          />
        </div>
      </div>
    </Link>
  )
}