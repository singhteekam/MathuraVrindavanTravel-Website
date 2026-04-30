'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { motion }              from 'framer-motion'
import Link                    from 'next/link'
import {
  MapPin, Package, Users, BookOpen, Star,
  ShieldCheck, Settings, ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Stats {
  totalPackages: number
  totalPlaces:   number
  totalUsers:    number
  totalBookings: number
  totalReviews:  number
  pendingReviews:number
}

export default function SuperadminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
    ]).then(([s]) => {
      if (s.success) setStats(s.data)
      else toast.error('Failed to load stats.')
    }).catch(() => toast.error('Network error.'))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Places',         value: stats?.totalPlaces   ?? '—', icon: <MapPin    size={22} />, color: '#ff7d0f', bg: '#fff8ed', href: '/superadmin/places'   },
    { label: 'Packages',       value: stats?.totalPackages ?? '—', icon: <Package   size={22} />, color: '#4338ca', bg: '#eef2ff', href: '/superadmin/packages' },
    { label: 'Total Users',    value: stats?.totalUsers    ?? '—', icon: <Users     size={22} />, color: '#16a34a', bg: '#f0fdf4', href: '/superadmin/users'    },
    { label: 'Total Bookings', value: stats?.totalBookings ?? '—', icon: <BookOpen  size={22} />, color: '#0ea5e9', bg: '#f0f9ff', href: '/admin/bookings'      },
    { label: 'All Reviews',    value: stats?.totalReviews  ?? '—', icon: <Star      size={22} />, color: '#f59e0b', bg: '#fffbeb', href: '/admin/reviews'       },
    { label: 'Pending Reviews',value: stats?.pendingReviews?? '—', icon: <Star      size={22} />, color: '#dc2626', bg: '#fff1f2', href: '/admin/reviews'       },
  ]

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
            <ShieldCheck size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-serif)' }}>
            Superadmin Dashboard
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">
          Full platform control — places, settings, and all data.
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 animate-pulse">
              <div className="h-8 w-8 bg-gray-100 rounded-xl mb-3" />
              <div className="h-7 w-20 bg-gray-100 rounded mb-1" />
              <div className="h-4 w-24 bg-gray-50 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div key={card.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <Link href={card.href}
                className="card card-hover rounded-2xl p-5 flex flex-col block h-full">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                  style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-5">
        {[
          {
            title: '🗺️ Manage Places',
            desc:  'Add, edit, or feature sacred places — temples, ghats, and heritage sites.',
            href:  '/superadmin/places',
            newHref: '/superadmin/places/new',
          },
          {
            title: '⚙️ Site Settings',
            desc:  'Update business info, contact details, SMTP config, and booking rules.',
            href:  '/superadmin/settings',
            newHref: null,
          },
          {
            title: '👥 User Management',
            desc:  'View all customers, admins, and drivers. Activate or deactivate accounts.',
            href:  '/superadmin/users',
            newHref: null,
          },
          {
            title: '📦 Package Management',
            desc:  'Create and manage tour packages — pricing, itinerary, and visibility.',
            href:  '/superadmin/packages',
            newHref: '/admin/packages/new',
          },
        ].map((action, i) => (
          <motion.div key={action.title}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{action.desc}</p>
            <div className="flex gap-2">
              <Link href={action.href}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
                style={{ background: '#eef2ff', color: '#4338ca' }}>
                View All <ArrowRight size={12} />
              </Link>
              {action.newHref && (
                <Link href={action.newHref}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
                  style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  + Add New
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admin panel link */}
      <div className="mt-6 p-4 rounded-2xl flex items-center gap-3"
        style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
        <Settings size={16} className="text-gray-400 flex-shrink-0" />
        <p className="text-sm text-gray-500 flex-1">
          For bookings, drivers, customers, and reviews — use the{' '}
          <Link href="/admin" className="font-semibold text-saffron-600 hover:underline">
            Admin Panel
          </Link>.
        </p>
      </div>
    </div>
  )
}