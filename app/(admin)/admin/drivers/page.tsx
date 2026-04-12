'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, CheckCircle, XCircle, Car, Phone, X } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Driver {
  _id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  vehicle: { name: string; number: string; type: string; color: string }
  isAvailable: boolean
  isVerified: boolean
  totalTrips: number
  rating: number
}

const INITIAL_FORM = {
  name: '', email: '', phone: '', password: '',
  licenseNumber: '',
  vehicle: { type: 'swift', name: 'Swift Dzire', number: '', color: '' },
}

export default function AdminDriversPage() {
  const [drivers,   setDrivers]   = useState<Driver[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form,      setForm]      = useState(INITIAL_FORM)
  const [saving,    setSaving]    = useState(false)

  const fetchDrivers = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/drivers?limit=50')
      const data = await res.json()
      if (data.success) setDrivers(data.data)
    } catch {
      toast.error('Failed to load drivers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDrivers() }, [fetchDrivers])

  const filtered = search.trim()
    ? drivers.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.phone.includes(search) ||
        d.vehicle.number.toLowerCase().includes(search.toLowerCase())
      )
    : drivers

  async function toggleAvailability(id: string, current: boolean) {
    try {
      await fetch(`/api/drivers/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isAvailable: !current }),
      })
      toast.success(`Driver marked as ${!current ? 'Available' : 'Unavailable'}.`)
      fetchDrivers()
    } catch {
      toast.error('Failed to update.')
    }
  }

  async function toggleVerified(id: string, current: boolean) {
    try {
      await fetch(`/api/drivers/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isVerified: !current }),
      })
      toast.success(`Driver ${!current ? 'verified' : 'unverified'}.`)
      fetchDrivers()
    } catch {
      toast.error('Failed to update.')
    }
  }

  async function handleAddDriver(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email || !form.password || !form.licenseNumber || !form.vehicle.number) {
      toast.error('Please fill all required fields.')
      return
    }
    setSaving(true)
    try {
      const res  = await fetch('/api/drivers', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Driver added successfully!')
        setShowModal(false)
        setForm(INITIAL_FORM)
        fetchDrivers()
      } else {
        toast.error(data.error ?? 'Failed to add driver.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const CAR_OPTIONS = [
    { id: 'swift',  name: 'Swift Dzire'  },
    { id: 'eeco',   name: 'Maruti Eeco'  },
    { id: 'ertiga', name: 'Maruti Ertiga'},
    { id: 'innova', name: 'Toyota Innova'},
    { id: 'crysta', name: 'Innova Crysta'},
  ]

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Drivers"
        crumbs={[{ label: 'Drivers' }]}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2.5 px-5">
            <Plus size={16} /> Add Driver
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total',     value: drivers.length,                                      color: '#374151', bg: '#f9fafb' },
          { label: 'Available', value: drivers.filter((d) => d.isAvailable).length,          color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Verified',  value: drivers.filter((d) => d.isVerified).length,           color: '#4338ca', bg: '#eef2ff' },
        ].map((s) => (
          <div key={s.label} className="card rounded-xl p-4 text-center"
            style={{ background: s.bg }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Search name, phone, vehicle..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 py-2.5 text-sm"
        />
      </div>

      {/* Driver cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-4 border-saffron-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((driver, i) => (
            <motion.div
              key={driver._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card rounded-2xl p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ff7d0f, #c74a06)' }}
                  >
                    {driver.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{driver.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {driver.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={driver.isVerified
                      ? { background: '#f0fdf4', color: '#16a34a' }
                      : { background: '#fff1f2', color: '#dc2626' }
                    }
                  >
                    {driver.isVerified ? '✓ Verified' : '✗ Unverified'}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={driver.isAvailable
                      ? { background: '#f0fdf4', color: '#16a34a' }
                      : { background: '#f3f4f6', color: '#6b7280' }
                    }
                  >
                    {driver.isAvailable ? '● Available' : '○ On Trip'}
                  </span>
                </div>
              </div>

              {/* Vehicle info */}
              <div className="p-3 rounded-xl mb-4"
                style={{ background: '#f9fafb' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Car size={13} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{driver.vehicle.name}</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="font-mono font-bold">{driver.vehicle.number}</span>
                  <span>{driver.vehicle.color}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-center mb-4">
                {[
                  { label: 'Trips',  value: driver.totalTrips },
                  { label: 'Rating', value: driver.rating.toFixed(1) },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-bold text-gray-900 text-base">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(driver._id, driver.isAvailable)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={driver.isAvailable
                    ? { background: '#fff1f2', color: '#dc2626' }
                    : { background: '#f0fdf4', color: '#16a34a' }
                  }
                >
                  {driver.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button
                  onClick={() => toggleVerified(driver._id, driver.isVerified)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{ background: '#fff8ed', color: '#ff7d0f' }}
                >
                  {driver.isVerified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <Car size={40} className="mx-auto mb-3 opacity-30" />
              <p>No drivers found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Add New Driver</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input type="text" placeholder="Driver name" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone *</label>
                  <input type="tel" placeholder="+91 9999999999" required
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email *</label>
                  <input type="email" placeholder="driver@email.com" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password *</label>
                  <input type="password" placeholder="Min 6 characters" required
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">License Number *</label>
                <input type="text" placeholder="UP85 20230012345" required
                  value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  className="input-field" />
              </div>

              <div className="p-4 rounded-xl space-y-3" style={{ background: '#f9fafb' }}>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vehicle Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Vehicle Type *</label>
                    <select
                      value={form.vehicle.type}
                      onChange={(e) => {
                        const car = CAR_OPTIONS.find((c) => c.id === e.target.value)!
                        setForm({ ...form, vehicle: { ...form.vehicle, type: e.target.value, name: car.name } })
                      }}
                      className="input-field text-sm py-2"
                    >
                      {CAR_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Vehicle Number *</label>
                    <input type="text" placeholder="UP85AB1234" required
                      value={form.vehicle.number}
                      onChange={(e) => setForm({ ...form, vehicle: { ...form.vehicle, number: e.target.value.toUpperCase() } })}
                      className="input-field text-sm py-2" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Vehicle Color</label>
                    <input type="text" placeholder="White / Silver / Grey..."
                      value={form.vehicle.color}
                      onChange={(e) => setForm({ ...form, vehicle: { ...form.vehicle, color: e.target.value } })}
                      className="input-field text-sm py-2" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3"
                  style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
                  ) : (
                    'Add Driver'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

const CAR_OPTIONS = [
  { id: 'swift',  name: 'Swift Dzire'  },
  { id: 'eeco',   name: 'Maruti Eeco'  },
  { id: 'ertiga', name: 'Maruti Ertiga'},
  { id: 'innova', name: 'Toyota Innova'},
  { id: 'crysta', name: 'Innova Crysta'},
]