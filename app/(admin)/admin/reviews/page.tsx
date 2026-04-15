'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Check, X, RefreshCw, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Review {
  _id: string
  rating: number
  title: string
  comment: string
  isApproved: boolean
  createdAt: string
  customer: { name: string; email: string }
  package?: { name: string; slug: string }
}

export default function AdminReviewsPage() {
  const [reviews,  setReviews]  = useState<Review[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'approved'>('pending')

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/reviews?limit=50')
      const data = await res.json()
      if (data.success) setReviews(data.data)
    } catch {
      toast.error('Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const filtered = reviews.filter((r) => {
    if (filter === 'pending')  return !r.isApproved
    if (filter === 'approved') return r.isApproved
    return true
  })

  async function toggleApproval(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isApproved: !current }),
      })
      if (res.ok) {
        toast.success(current ? 'Review unpublished.' : 'Review approved and published!')
        fetchReviews()
      } else {
        toast.error('Failed to update review.')
      }
    } catch {
      toast.error('Network error.')
    }
  }

  const pendingCount  = reviews.filter((r) => !r.isApproved).length
  const approvedCount = reviews.filter((r) =>  r.isApproved).length

  function StarRow({ count }: { count: number }) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13}
            fill={i < count ? '#f59e0b' : 'none'}
            stroke={i < count ? '#f59e0b' : '#d1d5db'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Reviews"
        crumbs={[{ label: 'Reviews' }]}
        action={
          <button onClick={fetchReviews}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Reviews', value: reviews.length,  color: '#374151', bg: '#f9fafb' },
          { label: 'Pending',       value: pendingCount,    color: '#d97706', bg: '#fffbeb' },
          { label: 'Published',     value: approvedCount,   color: '#16a34a', bg: '#f0fdf4' },
        ].map((s) => (
          <div key={s.label} className="card rounded-xl p-4 text-center" style={{ background: s.bg }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'pending',  label: `Pending (${pendingCount})`   },
          { value: 'approved', label: `Published (${approvedCount})` },
          { value: 'all',      label: `All (${reviews.length})`      },
        ].map((tab) => (
          <button key={tab.value}
            onClick={() => setFilter(tab.value as typeof filter)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={filter === tab.value
              ? { background: '#ff7d0f', color: '#fff' }
              : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
            }>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-4 border-saffron-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card rounded-2xl p-16 text-center">
          <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {filter === 'all' ? '' : filter} reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card rounded-2xl p-5"
              style={!review.isApproved ? { borderLeft: '3px solid #f59e0b' } : {}}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #ff7d0f, #c74a06)' }}
                    >
                      {review.customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.customer.name}</p>
                      <p className="text-xs text-gray-400">{review.customer.email}</p>
                    </div>
                    <StarRow count={review.rating} />
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={review.isApproved
                        ? { background: '#f0fdf4', color: '#16a34a' }
                        : { background: '#fffbeb', color: '#d97706' }
                      }>
                      {review.isApproved ? 'Published' : 'Pending'}
                    </span>
                  </div>

                  {/* Review content */}
                  <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    {review.package && (
                      <span className="px-2.5 py-1 rounded-full"
                        style={{ background: '#f3f4f6' }}>
                        {review.package.name}
                      </span>
                    )}
                    <span>{new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleApproval(review._id, review.isApproved)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                    style={review.isApproved
                      ? { background: '#fff1f2', color: '#dc2626' }
                      : { background: '#f0fdf4', color: '#16a34a' }
                    }>
                    {review.isApproved
                      ? <><X size={12} /> Unpublish</>
                      : <><Check size={12} /> Approve</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}