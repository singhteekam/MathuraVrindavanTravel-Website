'use client'

export const dynamic = 'force-dynamic'

import { useState }          from 'react'
import { useRouter }         from 'next/navigation'
import { motion }            from 'framer-motion'
import { Save, Plus, X, ArrowLeft, MapPin } from 'lucide-react'
import Link                  from 'next/link'
import toast                 from 'react-hot-toast'
import AdminPageHeader        from '@/components/admin/AdminPageHeader'

// ── Constants ────────────────────────────────────────────────────────────────
const CITIES = ['Mathura', 'Vrindavan', 'Gokul', 'Govardhan', 'Barsana', 'Nandgaon', 'Agra']
const TYPES  = [
  { value: 'temple',      label: '🛕 Temple'      },
  { value: 'ghat',        label: '🌊 Ghat'        },
  { value: 'sacred-site', label: '🙏 Sacred Site'  },
  { value: 'hill',        label: '⛰️ Hill'         },
  { value: 'garden',      label: '🌺 Garden'      },
  { value: 'museum',      label: '🏛️ Museum'      },
  { value: 'village',     label: '🏡 Village'     },
]

// Default lat/lng centres on Mathura
const DEFAULT_LOCATION = { address: '', lat: 27.4924, lng: 77.6737, distanceFromMathura: '' }

interface PlaceForm {
  name:             string
  slug:             string
  city:             string
  type:             string
  shortDescription: string
  description:      string
  entryFee:         string
  timeRequired:     string
  isFeatured:       boolean
  tags:             string[]
  timings: {
    morning: string
    evening: string
    note:    string
  }
  location: {
    address:             string
    lat:                 number
    lng:                 number
    distanceFromMathura: string
  }
}

const INITIAL_FORM: PlaceForm = {
  name:             '',
  slug:             '',
  city:             'Mathura',
  type:             'temple',
  shortDescription: '',
  description:      '',
  entryFee:         'Free',
  timeRequired:     '30-60 minutes',
  isFeatured:       false,
  tags:             [],
  timings:          { morning: '', evening: '', note: '' },
  location:         { ...DEFAULT_LOCATION },
}

// ── Slug generator ────────────────────────────────────────────────────────────
function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Main page component ───────────────────────────────────────────────────────
export default function NewPlacePage() {
  const router                = useRouter()
  const [form,    setForm]    = useState<PlaceForm>(INITIAL_FORM)
  const [tagInput, setTagInput] = useState('')
  const [saving,  setSaving]  = useState(false)

  // Auto-generate slug from name
  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      // Only auto-set slug if it hasn't been manually edited (i.e. still matches auto slug)
      slug: toSlug(name),
    }))
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

  function updateLocation<K extends keyof PlaceForm['location']>(
    key: K, value: PlaceForm['location'][K],
  ) {
    setForm((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }))
  }

  function updateTimings<K extends keyof PlaceForm['timings']>(
    key: K, value: string,
  ) {
    setForm((prev) => ({ ...prev, timings: { ...prev.timings, [key]: value } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validation
    if (!form.name.trim())             { toast.error('Place name is required.');        return }
    if (!form.slug.trim())             { toast.error('Slug is required.');               return }
    if (!form.shortDescription.trim()) { toast.error('Short description is required.'); return }
    if (!form.location.address.trim()) { toast.error('Location address is required.'); return }
    if (!form.location.lat || !form.location.lng) {
      toast.error('Latitude and longitude are required.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        slug:     toSlug(form.slug),
        tags:     form.tags,
        timings:  {
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
      }

      const res  = await fetch('/api/places', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok) {
        toast.success(`"${form.name}" created successfully! 🙏`)
        router.push('/admin/places')
      } else {
        toast.error(data.error ?? 'Failed to create place.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Reusable label component ─────────────────────────────────────────────
  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {children}
    </label>
  )

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Add New Place"
        crumbs={[{ label: 'Places', href: '/admin/places' }, { label: 'Add New' }]}
        action={
          <div className="flex gap-2">
            <Link href="/admin/places"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={14} /> Cancel
            </Link>
            <button type="button" onClick={handleSubmit} disabled={saving}
              className="btn-primary text-sm py-2.5 px-5"
              style={{ opacity: saving ? 0.7 : 1 }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>
                : <><Save size={15} /> Create Place</>
              }
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column — main info ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">

                {/* Name + auto-slug */}
                <div>
                  <Label>Place Name *</Label>
                  <input type="text"
                    placeholder="e.g. Krishna Janmabhoomi Temple"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field" required />
                </div>

                <div>
                  <Label>Slug (URL path) *</Label>
                  <input type="text"
                    placeholder="krishna-janmabhoomi-temple"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: toSlug(e.target.value) })}
                    className="input-field font-mono text-sm" required />
                  <p className="text-xs text-gray-400 mt-1">
                    URL: /places/<span className="text-saffron-600 font-medium">{form.slug || 'your-slug'}</span>
                  </p>
                </div>

                {/* City + Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <select value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="input-field">
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Place Type *</Label>
                    <select value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="input-field">
                      {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Short description */}
                <div>
                  <Label>Short Description * <span className="normal-case font-normal text-gray-400">(shown on cards)</span></Label>
                  <textarea rows={2}
                    placeholder="Brief description shown on listing cards and SEO..."
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="input-field resize-none" required />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.shortDescription.length}/200 chars
                  </p>
                </div>

                {/* Full description */}
                <div>
                  <Label>Full Description <span className="normal-case font-normal text-gray-400">(optional, shown on detail page)</span></Label>
                  <textarea rows={4}
                    placeholder="Detailed history, significance, and visitor information..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-none" />
                </div>

                {/* Entry fee + time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Entry Fee</Label>
                    <input type="text" placeholder="Free / ₹50 / ₹100"
                      value={form.entryFee}
                      onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                      className="input-field" />
                  </div>
                  <div>
                    <Label>Time Required</Label>
                    <input type="text" placeholder="30-60 minutes / 2-3 hours"
                      value={form.timeRequired}
                      onChange={(e) => setForm({ ...form, timeRequired: e.target.value })}
                      className="input-field" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timings */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Temple / Place Timings</h3>
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Morning Session</Label>
                    <input type="text" placeholder="5:00 AM – 12:00 PM"
                      value={form.timings.morning}
                      onChange={(e) => updateTimings('morning', e.target.value)}
                      className="input-field" />
                  </div>
                  <div>
                    <Label>Evening Session</Label>
                    <input type="text" placeholder="4:00 PM – 9:00 PM"
                      value={form.timings.evening}
                      onChange={(e) => updateTimings('evening', e.target.value)}
                      className="input-field" />
                  </div>
                </div>
                <div>
                  <Label>Special Note</Label>
                  <input type="text"
                    placeholder="e.g. Closed on Holi, Extended hours on Janmashtami..."
                    value={form.timings.note}
                    onChange={(e) => updateTimings('note', e.target.value)}
                    className="input-field" />
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin size={16} className="text-saffron-500" />Location
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Used for Google Maps directions link on the detail page.
              </p>
              <div className="space-y-3">
                <div>
                  <Label>Address *</Label>
                  <input type="text"
                    placeholder="e.g. Near Mathura Junction, Mathura, UP — 281001"
                    value={form.location.address}
                    onChange={(e) => updateLocation('address', e.target.value)}
                    className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude *</Label>
                    <input type="number" step="0.0001"
                      placeholder="27.4924"
                      value={form.location.lat || ''}
                      onChange={(e) => updateLocation('lat', Number(e.target.value))}
                      className="input-field" required />
                  </div>
                  <div>
                    <Label>Longitude *</Label>
                    <input type="number" step="0.0001"
                      placeholder="77.6737"
                      value={form.location.lng || ''}
                      onChange={(e) => updateLocation('lng', Number(e.target.value))}
                      className="input-field" required />
                  </div>
                </div>
                <div>
                  <Label>Distance from Mathura <span className="normal-case font-normal text-gray-400">(optional)</span></Label>
                  <input type="text" placeholder="e.g. 12 km from Mathura city centre"
                    value={form.location.distanceFromMathura}
                    onChange={(e) => updateLocation('distanceFromMathura', e.target.value)}
                    className="input-field" />
                </div>

                {/* Quick-fill lat/lng for known cities */}
                <div className="p-3 rounded-xl" style={{ background: '#f9fafb' }}>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Quick-fill coordinates</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Mathura',    lat: 27.4924, lng: 77.6737 },
                      { label: 'Vrindavan',  lat: 27.5794, lng: 77.7022 },
                      { label: 'Govardhan', lat: 27.4985, lng: 77.4668 },
                      { label: 'Gokul',     lat: 27.4565, lng: 77.7401 },
                      { label: 'Barsana',   lat: 27.6512, lng: 77.3636 },
                    ].map((city) => (
                      <button key={city.label} type="button"
                        onClick={() => {
                          updateLocation('lat', city.lat)
                          updateLocation('lng', city.lng)
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151' }}>
                        📍 {city.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
              <p className="text-xs text-gray-400 mb-3">
                Tags help visitors find this place through search. Add relevant keywords.
              </p>
              <div className="flex gap-2 mb-3">
                <input type="text"
                  placeholder="Add a tag and press Enter or Add"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addTag() }
                  }}
                  className="input-field text-sm py-2 flex-1" />
                <button type="button" onClick={addTag}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
                  style={{ background: '#fff8ed', color: '#ff7d0f', border: '1px solid #ffdba8' }}>
                  <Plus size={14} /> Add
                </button>
              </div>

              {/* Suggested tags */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Suggested:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Krishna', 'Radha', 'Temple', 'Pilgrimage', 'Darshan',
                    'Aarti', 'Ghat', 'Historic', 'Must Visit', 'Free Entry',
                  ].filter((t) => !form.tags.includes(t)).map((tag) => (
                    <button key={tag} type="button"
                      onClick={() => setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))}
                      className="px-2.5 py-1 rounded-full text-xs transition-colors"
                      style={{ background: '#f3f4f6', color: '#6b7280' }}>
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Added tags */}
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span key={tag}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: '#fff8ed', color: '#c74a06', border: '1px solid #ffdba8' }}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {form.tags.length === 0 && (
                <p className="text-xs text-gray-300">No tags added yet.</p>
              )}
            </motion.div>
          </div>

          {/* ── Right column — settings sidebar ── */}
          <div className="space-y-5">

            {/* Visibility settings */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Visibility</h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Featured</p>
                    <p className="text-xs text-gray-400 mt-0.5">Show on homepage & top of listings</p>
                  </div>
                  <button type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                    style={{ background: form.isFeatured ? '#ff7d0f' : '#d1d5db' }}>
                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                      style={{ transform: form.isFeatured ? 'translateX(22px)' : 'translateX(2px)' }} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Preview card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Preview</h3>
              <div className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="h-24 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #fff8ed, #ffefd4)' }}>
                  <span className="text-4xl">
                    {TYPES.find((t) => t.value === form.type)?.label.split(' ')[0] ?? '📍'}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: '#ff7d0f' }}>
                    {form.city || 'City'} · {form.type.replace('-', ' ')}
                  </p>
                  <p className="font-bold text-gray-900 text-sm leading-tight mb-1">
                    {form.name || 'Place Name'}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {form.shortDescription || 'Short description will appear here...'}
                  </p>
                  {(form.entryFee || form.timeRequired) && (
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      {form.timeRequired && <span>⏱ {form.timeRequired}</span>}
                      {form.entryFee && (
                        <span style={{ color: form.entryFee === 'Free' ? '#16a34a' : '#6b7280' }}>
                          🎫 {form.entryFee}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <div className="rounded-2xl p-4 text-xs leading-relaxed"
              style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
              <p className="font-semibold mb-2">💡 Tips</p>
              <ul className="space-y-1.5 list-none">
                <li>• Slug is auto-generated from name — edit if needed</li>
                <li>• Use Quick-fill buttons for accurate coordinates</li>
                <li>• Featured places appear on the homepage</li>
                <li>• Add relevant tags to improve search visibility</li>
              </ul>
            </div>

            {/* Submit */}
            <button type="submit" disabled={saving}
              className="btn-primary w-full py-4 text-base"
              style={{ opacity: saving ? 0.7 : 1 }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Place...</>
                : <><Save size={18} /> Create Place</>
              }
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}