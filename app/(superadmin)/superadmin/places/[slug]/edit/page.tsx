'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState }      from 'react'
import { useParams, useRouter }      from 'next/navigation'
import { motion }                    from 'framer-motion'
import { Save, Plus, X, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react'
import Link                          from 'next/link'
import toast                         from 'react-hot-toast'
import ImageManager                  from '@/components/admin/ImageManager'

interface PlaceForm {
  name:             string
  city:             string
  type:             string
  shortDescription: string
  entryFee:         string
  timeRequired:     string
  thumbnail:        string
  images:           string[]
  isFeatured:       boolean
  tags:             string[]
  timings: {
    morning?: string
    evening?: string
    note?:    string
  }
  location: {
    address: string
    lat:     number
    lng:     number
  }
}

const CITIES = ['Mathura', 'Vrindavan', 'Gokul', 'Govardhan', 'Barsana', 'Nandgaon']
const TYPES  = ['temple', 'ghat', 'sacred-site', 'hill', 'garden', 'museum', 'village']

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
    {children}
  </label>
)

export default function SuperadminEditPlacePage() {
  const { slug }               = useParams<{ slug: string }>()
  const router                 = useRouter()
  const [form,    setForm]     = useState<PlaceForm | null>(null)
  const [loading, setLoading]  = useState(true)
  const [saving,  setSaving]   = useState(false)
  const [tagInput,setTagInput] = useState('')

  useEffect(() => {
    fetch(`/api/places/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const p = d.data
          setForm({
            name:             p.name             ?? '',
            city:             p.city             ?? 'Mathura',
            type:             p.type             ?? 'temple',
            shortDescription: p.shortDescription ?? '',
            entryFee:         p.entryFee         ?? 'Free',
            timeRequired:     p.timeRequired     ?? '30-60 minutes',
            thumbnail:        p.thumbnail        ?? '',
            images:           p.images           ?? [],
            isFeatured:       p.isFeatured       ?? false,
            tags:             p.tags             ?? [],
            timings: {
              morning: p.timings?.morning ?? '',
              evening: p.timings?.evening ?? '',
              note:    p.timings?.note    ?? '',
            },
            location: {
              address: p.location?.address ?? '',
              lat:     p.location?.lat     ?? 27.5,
              lng:     p.location?.lng     ?? 77.6,
            },
          })
        } else {
          toast.error('Place not found.')
          router.push('/superadmin/places')
        }
      })
      .catch(() => toast.error('Failed to load place.'))
      .finally(() => setLoading(false))
  }, [slug, router])

  function addTag() {
    if (!form || !tagInput.trim()) return
    if (form.tags.includes(tagInput.trim())) { setTagInput(''); return }
    setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
    setTagInput('')
  }

  function removeTag(tag: string) {
    if (!form) return
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
  }

  async function handleSave() {
    if (!form) return
    setSaving(true)
    try {
      const res  = await fetch(`/api/places/${slug}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Place updated successfully!')
        router.push('/superadmin/places')
      } else {
        toast.error(data.error ?? 'Failed to update place.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-8 pt-20 lg:pt-8">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!form) return (
    <div className="flex-1 p-8 pt-20 lg:pt-8 text-center">
      <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
      <p className="text-gray-600">Place not found.</p>
      <Link href="/superadmin/places" className="btn-primary mt-4 inline-flex text-sm">
        Back to Places
      </Link>
    </div>
  )

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <ShieldCheck size={16} className="text-indigo-500" />
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Superadmin</p>
          </div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Edit: {form.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/superadmin/places"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={14} /> Cancel
          </Link>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', opacity: saving ? 0.7 : 1 }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : <><Save size={15} />Save Changes</>
            }
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Place Name *</Label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <Label>Slug (read-only)</Label>
                  <input type="text" value={slug} disabled
                    className="input-field bg-gray-50 text-gray-400 cursor-not-allowed font-mono text-sm" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input-field">
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Type *</Label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="input-field capitalize">
                    {TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Short Description *</Label>
                <textarea rows={3} value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="input-field resize-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Entry Fee</Label>
                  <input type="text" placeholder="Free / ₹50" value={form.entryFee}
                    onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <Label>Time Required</Label>
                  <input type="text" placeholder="30-60 minutes" value={form.timeRequired}
                    onChange={(e) => setForm({ ...form, timeRequired: e.target.value })}
                    className="input-field" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timings */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }} className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Timings</h3>
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Morning Session</Label>
                  <input type="text" placeholder="5:00 AM – 12:00 PM"
                    value={form.timings.morning ?? ''}
                    onChange={(e) => setForm({ ...form, timings: { ...form.timings, morning: e.target.value } })}
                    className="input-field" />
                </div>
                <div>
                  <Label>Evening Session</Label>
                  <input type="text" placeholder="4:00 PM – 9:00 PM"
                    value={form.timings.evening ?? ''}
                    onChange={(e) => setForm({ ...form, timings: { ...form.timings, evening: e.target.value } })}
                    className="input-field" />
                </div>
              </div>
              <div>
                <Label>Special Note</Label>
                <input type="text" placeholder="e.g. Extended hours on Janmashtami..."
                  value={form.timings.note ?? ''}
                  onChange={(e) => setForm({ ...form, timings: { ...form.timings, note: e.target.value } })}
                  className="input-field" />
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }} className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Location</h3>
            <div className="space-y-3">
              <div>
                <Label>Address</Label>
                <input type="text" placeholder="Near XYZ, Mathura"
                  value={form.location.address}
                  onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
                  className="input-field" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <input type="number" step="0.0001" value={form.location.lat}
                    onChange={(e) => setForm({ ...form, location: { ...form.location, lat: Number(e.target.value) } })}
                    className="input-field" />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <input type="number" step="0.0001" value={form.location.lng}
                    onChange={(e) => setForm({ ...form, location: { ...form.location, lng: Number(e.target.value) } })}
                    className="input-field" />
                </div>
              </div>
              {/* Quick-fill coordinates */}
              <div className="p-3 rounded-xl" style={{ background: '#f5f3ff' }}>
                <p className="text-xs font-semibold text-indigo-600 mb-2">Quick-fill coordinates</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Mathura',   lat: 27.4924, lng: 77.6737 },
                    { label: 'Vrindavan', lat: 27.5794, lng: 77.7022 },
                    { label: 'Govardhan',lat: 27.4985, lng: 77.4668 },
                    { label: 'Gokul',    lat: 27.4565, lng: 77.7401 },
                    { label: 'Barsana',  lat: 27.6512, lng: 77.3636 },
                  ].map((c) => (
                    <button key={c.label} type="button"
                      onClick={() => setForm({ ...form, location: { ...form.location, lat: c.lat, lng: c.lng } })}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: '#ede9fe', color: '#5b21b6' }}>
                      📍 {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Photo Gallery */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }} className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-1">Photo Gallery</h3>
            <p className="text-xs text-gray-400 mb-4">
              First image = main thumbnail on cards. Drag to reorder.
            </p>
            <ImageManager
              images={form.images}
              onChange={(imgs) => setForm({ ...form, images: imgs, thumbnail: imgs[0] ?? '' })}
              folder="places"
              maxImages={8}
              label="Place Photos"
            />
          </motion.div>

          {/* Tags */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input-field text-sm py-2 flex-1" />
              <button type="button" onClick={addTag}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: '#ede9fe', color: '#5b21b6' }}>
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: '#ede9fe', color: '#5b21b6' }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}
                    className="text-indigo-300 hover:text-red-500 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
              {form.tags.length === 0 && (
                <p className="text-xs text-gray-400">No tags yet.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Featured toggle */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }} className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Settings</h3>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Featured</p>
                <p className="text-xs text-gray-400">Show on homepage</p>
              </div>
              <button type="button"
                onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 mt-0.5"
                style={{ background: form.isFeatured ? '#6366f1' : '#d1d5db' }}>
                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                  style={{ transform: form.isFeatured ? 'translateX(22px)' : 'translateX(2px)' }} />
              </button>
            </div>
          </motion.div>

          {/* View on site */}
          <Link href={`/places/${slug}`} target="_blank"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            View on Site ↗
          </Link>

          {/* Save */}
          <button type="button" onClick={handleSave} disabled={saving}
            className="w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', opacity: saving ? 0.7 : 1 }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : <><Save size={16} />Save Changes</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}