'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CalendarCheck, Car, MapPin, Users,
  Phone, Mail, Clock, CheckCircle, RefreshCw,
  XCircle, User, Save, AlertCircle,
} from 'lucide-react'
import Link  from 'next/link'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Driver { _id: string; name: string; phone: string; vehicle: { name: string; number: string }; isAvailable: boolean }
interface Booking {
  _id: string; bookingId: string; status: string; paymentStatus: string
  carName: string; carType: string; startDate: string; endDate: string
  duration: number; pickupLocation: string; dropLocation?: string
  totalPassengers: number; totalAmount: number; advanceAmount: number
  addons: string[]; specialRequests?: string; adminNotes?: string
  cancelReason?: string; createdAt: string
  customer: { _id: string; name: string; email: string; phone: string }
  package?:  { name: string; slug: string; duration: number }
  driver?:   { _id: string; name: string; phone: string; vehicle: { name: string; number: string } }
}

const STATUS_STEPS = ['pending', 'confirmed', 'driver_assigned', 'ongoing', 'completed']
const STATUS_LABELS: Record<string, string> = {
  pending:         'Pending',
  confirmed:       'Confirmed',
  driver_assigned: 'Driver Assigned',
  ongoing:         'Ongoing',
  completed:       'Completed',
  cancelled:       'Cancelled',
}

export default function AdminBookingDetailPage() {
  const { bookingId }          = useParams<{ bookingId: string }>()
  const router                 = useRouter()
  const [booking,  setBooking] = useState<Booking | null>(null)
  const [drivers,  setDrivers] = useState<Driver[]>([])
  const [loading,  setLoading] = useState(true)
  const [saving,   setSaving]  = useState(false)

  const [selectedDriver, setSelectedDriver] = useState('')
  const [newStatus,      setNewStatus]      = useState('')
  const [adminNotes,     setAdminNotes]     = useState('')
  const [paymentStatus,  setPaymentStatus]  = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/bookings/${bookingId}`).then((r) => r.json()),
      fetch('/api/drivers?available=true&limit=50').then((r) => r.json()),
    ]).then(([bData, dData]) => {
      if (bData.success) {
        setBooking(bData.data)
        setNewStatus(bData.data.status)
        setAdminNotes(bData.data.adminNotes ?? '')
        setPaymentStatus(bData.data.paymentStatus)
        setSelectedDriver(bData.data.driver?._id ?? '')
      }
      if (dData.success) setDrivers(dData.data)
    }).catch(() => toast.error('Failed to load booking details.'))
      .finally(() => setLoading(false))
  }, [bookingId])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          status:        newStatus,
          driver:        selectedDriver || undefined,
          adminNotes,
          paymentStatus,
        }),
      })
      if (res.ok) {
        toast.success('Booking updated successfully!')
        const data = await res.json()
        setBooking(data.data)
      } else {
        toast.error('Failed to update booking.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-8 pt-20 lg:pt-8">
      <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!booking) return (
    <div className="flex-1 p-8 pt-20 lg:pt-8 text-center">
      <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
      <p className="text-gray-600">Booking not found.</p>
      <Link href="/admin/bookings" className="btn-primary mt-4 inline-flex text-sm">
        Back to Bookings
      </Link>
    </div>
  )

  const currentStepIndex = STATUS_STEPS.indexOf(booking.status)
  const isCancelled = booking.status === 'cancelled'

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title={`Booking — ${booking.bookingId}`}
        crumbs={[
          { label: 'Bookings', href: '/admin/bookings' },
          { label: booking.bookingId },
        ]}
        action={
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 px-5">
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : <><Save size={16} />Save Changes</>
            }
          </button>
        }
      />

      {/* Status progress bar */}
      {!isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="card rounded-2xl p-5 mb-6"
        >
          <h3 className="font-bold text-gray-900 text-sm mb-4">Trip Progress</h3>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={i <= currentStepIndex
                      ? { background: '#ff7d0f', color: '#fff' }
                      : { background: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {i < currentStepIndex ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <p className="text-xs mt-1.5 text-center font-medium whitespace-nowrap"
                    style={{ color: i <= currentStepIndex ? '#ff7d0f' : '#9ca3af', fontSize: '10px' }}>
                    {STATUS_LABELS[step]}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 mb-4"
                    style={{ background: i < currentStepIndex ? '#ff7d0f' : '#f3f4f6' }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {isCancelled && (
        <div className="flex items-center gap-2 p-4 rounded-2xl mb-6"
          style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <XCircle size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700 text-sm">This booking was cancelled</p>
            {booking.cancelReason && <p className="text-xs text-red-500 mt-0.5">Reason: {booking.cancelReason}</p>}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left — booking info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Trip details */}
          <div className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarCheck size={16} className="text-saffron-500" />Trip Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: <Car     size={13} />, label: 'Vehicle',    value: booking.carName },
                { icon: <Clock   size={13} />, label: 'Start Date', value: formatDate(booking.startDate) },
                { icon: <Clock   size={13} />, label: 'Duration',   value: `${booking.duration} day${booking.duration > 1 ? 's' : ''}` },
                { icon: <Users   size={13} />, label: 'Passengers', value: `${booking.totalPassengers} people` },
                { icon: <MapPin  size={13} />, label: 'Pickup',     value: booking.pickupLocation },
                { icon: <MapPin  size={13} />, label: 'Drop',       value: booking.dropLocation ?? 'Same as pickup' },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ background: '#f9fafb' }}>
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">{row.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400">{row.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {booking.package && (
              <div className="mt-3 p-3 rounded-xl"
                style={{ background: '#fff8ed', border: '1px solid #ffdba8' }}>
                <p className="text-xs text-saffron-600 font-semibold">Package</p>
                <p className="text-sm font-bold text-gray-900">{booking.package.name}</p>
              </div>
            )}
            {booking.specialRequests && (
              <div className="mt-3 p-3 rounded-xl"
                style={{ background: '#fffbeb' }}>
                <p className="text-xs text-amber-600 font-semibold mb-0.5">Special Requests</p>
                <p className="text-sm text-gray-700">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Customer info */}
          <div className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-saffron-500" />Customer Details
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #ff7d0f, #c74a06)' }}>
                {booking.customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{booking.customer.name}</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  <a href={`tel:${booking.customer.phone}`}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-saffron-600 transition-colors">
                    <Phone size={11} />{booking.customer.phone}
                  </a>
                  <a href={`mailto:${booking.customer.email}`}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-saffron-600 transition-colors">
                    <Mail size={11} />{booking.customer.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`https://wa.me/${booking.customer.phone.replace(/\D/g, '')}?text=Namaste! Regarding your booking ${booking.bookingId} — `}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: '#dcfce7', color: '#16a34a' }}>
                WhatsApp Customer
              </a>
              <a href={`tel:${booking.customer.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: '#fff8ed', color: '#ff7d0f' }}>
                <Phone size={12} />Call Customer
              </a>
            </div>
          </div>

          {/* Admin notes */}
          <div className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Admin Notes</h3>
            <textarea rows={3}
              placeholder="Add internal notes about this booking..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="input-field resize-none text-sm"
            />
          </div>
        </div>

        {/* Right — actions */}
        <div className="space-y-5">

          {/* Payment summary */}
          <div className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-gray-900">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Advance (30%)</span>
                <span className="font-semibold text-green-600">{formatCurrency(booking.advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2.5">
                <span className="text-gray-500">Remaining</span>
                <span className="font-bold text-saffron-600">
                  {formatCurrency(booking.totalAmount - booking.advanceAmount)}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Payment Status
              </label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}
                className="input-field text-sm">
                {['pending', 'partial', 'paid', 'refunded'].map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status update */}
          <div className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Update Status</h3>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
              className="input-field text-sm mb-3">
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400">
              Booking created: {formatDate(booking.createdAt)}
            </p>
          </div>

          {/* Assign driver */}
          <div className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Car size={15} className="text-saffron-500" />Assign Driver
            </h3>
            {booking.driver && (
              <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm flex-shrink-0">
                  {booking.driver.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{booking.driver.name}</p>
                  <p className="text-xs text-gray-500">{booking.driver.vehicle.name} · {booking.driver.vehicle.number}</p>
                </div>
              </div>
            )}
            <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}
              className="input-field text-sm">
              <option value="">— Select a driver —</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} · {d.vehicle.name} ({d.vehicle.number})
                </option>
              ))}
            </select>
            {drivers.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                No available drivers. Mark a driver as available first.
              </p>
            )}
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            className="btn-primary w-full py-3.5" style={{ opacity: saving ? 0.7 : 1 }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : <><Save size={16} />Save All Changes</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}