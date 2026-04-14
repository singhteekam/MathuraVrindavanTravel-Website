'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, MapPin, Star, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Place {
  _id: string
  slug: string
  name: string
  city: string
  type: string
  entryFee?: string
  timeRequired?: string
  isFeatured: boolean
  tags: string[]
}

const CITY_FILTER = ['All', 'Mathura', 'Vrindavan', 'Gokul', 'Govardhan', 'Barsana']
const TYPE_FILTER = ['all', 'temple', 'ghat', 'sacred-site', 'hill', 'garden', 'museum']

export default function AdminPlacesPage() {
  const [places,  setPlaces]  = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [city,    setCity]    = useState('All')
  const [type,    setType]    = useState('all')

  const fetchPlaces = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (city !== 'All')  params.set('city', city)
      if (type !== 'all')  params.set('type', type)
      if (search.trim())   params.set('search', search)

      const res  = await fetch(`/api/places?${params}`)
      const data = await res.json()
      if (data.success) setPlaces(data.data)
    } catch {
      toast.error('Failed to load places.')
    } finally {
      setLoading(false)
    }
  }, [city, type, search])

  useEffect(() => {
    const timeout = setTimeout(() => fetchPlaces(), 300)
    return () => clearTimeout(timeout)
  }, [fetchPlaces])

  async function toggleFeatured(slug: string, current: boolean) {
    try {
      await fetch(`/api/places/${slug}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isFeatured: !current }),
      })
      toast.success(`Place ${!current ? 'featured' : 'unfeatured'}.`)
      fetchPlaces()
    } catch {
      toast.error('Failed to update.')
    }
  }

  const TYPE_EMOJI: Record<string, string> = {
    temple: '🛕', ghat: '🌊', 'sacred-site': '🙏', hill: '⛰️', garden: '🌺', museum: '🏛️',
  }

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Places"
        crumbs={[{ label: 'Places' }]}
        action={
          <Link href="/admin/places/new" className="btn-primary text-sm py-2.5 px-5">
            <Plus size={16} /> Add Place
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search places..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm w-52" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {CITY_FILTER.map((c) => (
            <button key={c} onClick={() => setCity(c)}
              className="px-3 py-2 rounded-full text-xs font-semibold transition-all"
              style={city === c
                ? { background: '#4338ca', color: '#fff' }
                : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >{c}</button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTER.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className="px-3 py-2 rounded-full text-xs font-semibold transition-all capitalize"
              style={type === t
                ? { background: '#ff7d0f', color: '#fff' }
                : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >{t === 'all' ? 'All Types' : `${TYPE_EMOJI[t] ?? ''} ${t.replace('-', ' ')}`}</button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing <strong>{places.length}</strong> places
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-4 border-saffron-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place, i) => (
            <motion.div
              key={place._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TYPE_EMOJI[place.type] ?? '📍'}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{place.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={9} />{place.city}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFeatured(place.slug, place.isFeatured)}
                  title="Toggle featured"
                >
                  <Star
                    size={16}
                    fill={place.isFeatured ? '#f59e0b' : 'none'}
                    stroke={place.isFeatured ? '#f59e0b' : '#d1d5db'}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{ background: '#f3f4f6', color: '#6b7280' }}>
                  {place.type.replace('-', ' ')}
                </span>
                {place.entryFee && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    {place.entryFee === 'Free' ? '✓ Free' : `₹${place.entryFee}`}
                  </span>
                )}
                {place.isFeatured && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#fffbeb', color: '#d97706' }}>
                    ⭐ Featured
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/places/${place.slug}`} target="_blank"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{ background: '#eef2ff', color: '#4338ca' }}>
                  <Eye size={12} /> View
                </Link>
                <Link href={`/admin/places/${place.slug}/edit`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{ background: '#fff8ed', color: '#ff7d0f' }}>
                  <Pencil size={12} /> Edit
                </Link>
              </div>
            </motion.div>
          ))}

          {places.length === 0 && !loading && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <MapPin size={40} className="mx-auto mb-3 opacity-30" />
              <p>No places found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}