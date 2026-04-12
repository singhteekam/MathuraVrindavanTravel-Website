'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, Clock, CheckCircle,
  Car, RefreshCw, XCircle, Eye, ChevronLeft, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Booking {
  _id: string
  bookingId: string
  status: string
  carName: string
  startDate: string
  totalAmount: number
  totalPassengers: number
  pickupLocation: string
  createdAt: string
  customer: { name: string; phone: string; email: string }
  package?:  { name: string }
  driver?:   { name: string; phone: string }
}

const STATUS_TABS = [
  { value: '',                label: 'All',             icon: <Filter    size={13} /> },
  { value: 'pending',         label: 'Pending',         icon: <Clock     size={13} /> },
  { value: 'confirmed',       label: 'Confirmed',       icon: <CheckCircle size={13}/> },
  { value: 'driver_assigned', label: 'Driver Assigned', icon: <Car       size={13} /> },
  { value: 'ongoing',         label: 'Ongoing',         icon: <RefreshCw size={13} /> },
  { value: 'completed',       label: 'Completed',       icon: <CheckCircle size={13}/> },
  { value: 'cancelled',       label: 'Cancelled',       icon: <XCircle   size={13} /> },
]

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  pending:         { color: '#d97706', bg: '#fffbeb' },
  confirmed:       { color: '#2563eb', bg: '#eff6ff' },
  driver_assigned: { color: '#7c3aed', bg: '#f5f3ff' },
  ongoing:         { color: '#16a34a', bg: '#f0fdf4' },
  completed:       { color: '#16a34a', bg: '#f0fdf4' },
  cancelled:       { color: '#dc2626', bg: '#fff1f2' },
}

export default function AdminBookingsPage() {
  const [bookings,   setBookings]   = useState<Booking[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [statusTab,  setStatusTab]  = useState('')
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total,      setTotal]      = useState(0)
  const LIMIT = 15

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
      })
      if (statusTab) params.set('status', statusTab)

      const res  = await fetch(`/api/bookings?${params}`)
      const data = await res.json()

      if (data.success) {
        setBookings(data.data)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.pages)
      }
    } catch {
      toast.error('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }, [page, statusTab])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  // Client-side search filter
  const filtered = search.trim()
    ? bookings.filter((b) =>
        b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        b.customer.phone.includes(search)
      )
    : bookings

  async function updateStatus(bookingId: string, status: string) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success('Status updated.')
        fetchBookings()
      } else {
        toast.error('Failed to update status.')
      }
    } catch {
      toast.error('Network error.')
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Bookings"
        crumbs={[{ label: 'Bookings' }]}
      />

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusTab(tab.value); setPage(1) }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
            style={statusTab === tab.value
              ? { background: '#ff7d0f', color: '#fff' }
              : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
            }
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Search + count */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <p className="text-sm text-gray-500 flex-shrink-0">
          <span className="font-semibold text-gray-800">{total}</span> bookings
        </p>
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-4 border-saffron-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                  {['Booking ID', 'Customer', 'Vehicle', 'Date', 'Amount', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const st = STATUS_STYLE[b.status] ?? STATUS_STYLE.pending
                  return (
                    <motion.tr
                      key={b._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-saffron-600">
                          {b.bookingId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 whitespace-nowrap">{b.customer.name}</p>
                        <p className="text-xs text-gray-400">{b.customer.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 whitespace-nowrap">{b.carName}</p>
                        {b.driver && (
                          <p className="text-xs text-gray-400">{b.driver.name}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                        {formatDate(b.startDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-800">
                        {formatCurrency(b.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.bookingId, e.target.value)}
                          className="text-xs font-semibold px-2 py-1.5 rounded-full border-none outline-none cursor-pointer"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {Object.entries(STATUS_STYLE).map(([k]) => (
                            <option key={k} value={k}>
                              {k.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/bookings/${b.bookingId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                          style={{ background: '#fff8ed', color: '#ff7d0f' }}
                        >
                          <Eye size={12} /> View
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}