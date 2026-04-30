/**
 * Superadmin New Place page
 * The actual form logic lives in the admin new place component.
 * This page overrides the "back" breadcrumb so it points to /superadmin/places.
 */
'use client'

export const dynamic = 'force-dynamic'

import { useState }          from 'react'
import { useRouter }         from 'next/navigation'
import { motion }            from 'framer-motion'
import { Save, Plus, X, ArrowLeft, MapPin, ShieldCheck } from 'lucide-react'
import Link                  from 'next/link'
import toast                 from 'react-hot-toast'
import ImageManager          from '@/components/admin/ImageManager'

const CITIES = ['Mathura', 'Vrindavan', 'Gokul', 'Govardhan', 'Barsana', 'Nandgaon', 'Agra']
const TYPES  = [
  { value: 'temple',      label: '🛕 Temple'       },
  { value: 'ghat',        label: '🌊 Ghat'         },
  { value: 'sacred-site', label: '🙏 Sacred Site'  },
  { value: 'hill',        label: '⛰️ Hill'          },
  { value: 'garden',      label: '🌺 Garden'       },
  { value: 'museum',      label: '🏛️ Museum'       },
  { value: 'village',     label: '🏡 Village'      },
]

interface PlaceForm {
  name: string; slug: string; city: string; type: string
  shortDescription: string; description: string
  entryFee: string; timeRequired: string
  isFeatured: boolean; thumbnail: string; images: string[]
  tags: string[]
  timings:  { morning: string; evening: string; note: string }
  location: { address: string; lat: number; lng: number; distanceFromMathura: string }
}

const INITIAL: PlaceForm = {
  name: '', slug: '', city: 'Mathura', type: 'temple',
  shortDescription: '', description: '',
  entryFee: 'Free', timeRequired: '30-60 minutes',
  isFeatured: false, thumbnail: '', images: [],
  tags: [],
  timings:  { morning: '', evening: '', note: '' },
  location: { address: '', lat: 27.4924, lng: 77.6737, distanceFromMathura: '' },
}

function toSlug(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-|-$/g, '')
}

export default function SuperadminNewPlacePage() {
  const router                      = useRouter()
  const [form,     setForm]         = useState<PlaceForm>(INITIAL)
  const [tagInput, setTagInput]     = useState('')
  const [saving,   setSaving]       = useState(false)

  function handleNameChange(name: string) {
    setForm((prev) => ({ ...prev, name, slug: toSlug(name) }))
  }

  function addTag() {
    const tag = tagInput.trim()
    if (!tag || form.tags.includes(tag)) { setTagInput(''); return }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim())             { toast.error('Place name is required.');        return }
    if (!form.slug.trim())             { toast.error('Slug is required.');               return }
    if (!form.shortDescription.trim()) { toast.error('Short description is required.'); return }
    if (!form.location.address.trim()) { toast.error('Location address is required.');  return }

    setSaving(true)
    try {
      const res  = await fetch('/api/places', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...form,
          slug:    toSlug(form.slug),
          timings: {
            morning: form.timings.morning || undefined,
            evening: form.timings.evening || undefined,
            note:    form.timings.note    || undefined,
          },
          location: {
            address:             form.location.address,
            lat:                 Number(form.location.lat),
            lng:                 Number(form.location.lng),
            distanceFromMathura: form.location.distanceFromMathura || undefined,
          },
          description: form.description || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`"${form.name}" created! 🙏`)
        router.push('/superadmin/places')
      } else {
        toast.error(data.error ?? 'Failed to create place.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{children}</label>
  )

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <ShieldCheck size={16} className="text-indigo-500" />
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Superadmin</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Add New Place
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/superadmin/places"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={14} /> Cancel
          </Link>
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="btn-primary text-sm py-2.5 px-5"
            style={{ opacity: saving ? 0.7 : 1, background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>
              : <><Save size={15} /> Create Place</>
            }
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <Label>Place Name *</Label>
                  <input type="text" placeholder="e.g. Krishna Janmabhoomi Temple"
                    value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field" required />
                </div>
                <div>
                  <Label>Slug *</Label>
                  <input type="text" value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: toSlug(e.target.value) })}
                    className="input-field font-mono text-sm" required />
                  <p className="text-xs text-gray-400 mt-1">URL: /places/<span className="text-indigo-500 font-medium">{form.slug || 'your-slug'}</span></p>
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
                      className="input-field">
                      {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Short Description *</Label>
                  <textarea rows={2} value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="input-field resize-none" required />
                </div>
                <div>
                  <Label>Full Description</Label>
                  <textarea rows={4} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-none" placeholder="Detailed information for the detail page..." />
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

            {/* Images */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }} className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-1">Photo Gallery</h3>
              <p className="text-xs text-gray-400 mb-4">First image = main thumbnail on cards and homepage.</p>
              <ImageManager
                images={form.images}
                onChange={(imgs) => setForm((p) => ({ ...p, images: imgs, thumbnail: imgs[0] ?? '' }))}
                folder="places" maxImages={8} />
            </motion.div>

            {/* Timings */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }} className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Timings</h3>
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Morning Session</Label>
                    <input type="text" placeholder="5:00 AM – 12:00 PM"
                      value={form.timings.morning}
                      onChange={(e) => setForm({ ...form, timings: { ...form.timings, morning: e.target.value } })}
                      className="input-field" />
                  </div>
                  <div>
                    <Label>Evening Session</Label>
                    <input type="text" placeholder="4:00 PM – 9:00 PM"
                      value={form.timings.evening}
                      onChange={(e) => setForm({ ...form, timings: { ...form.timings, evening: e.target.value } })}
                      className="input-field" />
                  </div>
                </div>
                <div>
                  <Label>Special Note</Label>
                  <input type="text" placeholder="e.g. Extended hours on Janmashtami..."
                    value={form.timings.note}
                    onChange={(e) => setForm({ ...form, timings: { ...form.timings, note: e.target.value } })}
                    className="input-field" />
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }} className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin size={16} className="text-indigo-500" />Location
              </h3>
              <p className="text-xs text-gray-400 mb-4">Used for Google Maps directions link.</p>
              <div className="space-y-3">
                <div>
                  <Label>Address *</Label>
                  <input type="text" placeholder="e.g. Near Mathura Junction, Mathura, UP 281001"
                    value={form.location.address}
                    onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
                    className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <input type="number" step="0.0001" value={form.location.lat || ''}
                      onChange={(e) => setForm({ ...form, location: { ...form.location, lat: Number(e.target.value) } })}
                      className="input-field" />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <input type="number" step="0.0001" value={form.location.lng || ''}
                      onChange={(e) => setForm({ ...form, location: { ...form.location, lng: Number(e.target.value) } })}
                      className="input-field" />
                  </div>
                </div>
                {/* Quick fill */}
                <div className="p-3 rounded-xl" style={{ background: '#f9fafb' }}>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Quick-fill coordinates</p>
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
                        style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151' }}>
                        📍 {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }} className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input type="text" placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  className="input-field text-sm py-2 flex-1" />
                <button type="button" onClick={addTag}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
                  style={{ background: '#ede9fe', color: '#5b21b6' }}>
                  <Plus size={14} /> Add
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
              </div>
            </motion.div>
          </div>

          {/* Settings sidebar */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }} className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Settings</h3>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Featured</p>
                  <p className="text-xs text-gray-400 mt-0.5">Show on homepage</p>
                </div>
                <button type="button"
                  onClick={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                  style={{ background: form.isFeatured ? '#6366f1' : '#d1d5db' }}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                    style={{ transform: form.isFeatured ? 'translateX(22px)' : 'translateX(2px)' }} />
                </button>
              </div>
            </motion.div>

            <button type="submit" disabled={saving}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', opacity: saving ? 0.7 : 1 }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>
                : <><Save size={18} /> Create Place</>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}