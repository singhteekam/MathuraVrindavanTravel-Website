'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion }   from 'framer-motion'
import { Save, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ImageManager    from '@/components/admin/ImageManager'
import { cars }        from '@/config/site'

interface PackageForm {
  name:             string
  slug:             string
  duration:         number
  nights:           number
  cities:           string[]
  basePrice:        number
  shortDescription: string
  highlights:       string[]
  inclusions:       string[]
  exclusions:       string[]
  isActive:         boolean
  isFeatured:       boolean
  isPopular:        boolean
  thumbnail:        string
  images:           string[]
  pricing:          { carType: string; carName: string; price: number }[]
}

const INITIAL: PackageForm = {
  name:             '',
  slug:             '',
  duration:         1,
  nights:           0,
  cities:           ['Mathura', 'Vrindavan'],
  basePrice:        2000,
  shortDescription: '',
  highlights:       ['', '', ''],
  inclusions:       [
    'AC vehicle throughout the tour',
    'Experienced local driver',
    'All inter-city transfers',
    'Hotel assistance',
    'Fuel charges included',
  ],
  exclusions: [
    'Meals',
    'Hotel accommodation cost',
    'Entry fees at temples',
    'Personal expenses',
  ],
  thumbnail:  '',
  images:     [],
  isActive:   true,
  isFeatured: false,
  isPopular:  false,
  pricing: cars.map((c) => ({ carType: c.id, carName: c.name, price: 0 })),
}

export default function NewPackagePage() {
  const router  = useRouter()
  const [form,  setForm]  = useState<PackageForm>(INITIAL)
  const [saving,setSaving]= useState(false)

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function updatePricing(index: number, price: number) {
    const updated = [...form.pricing]
    updated[index] = { ...updated[index], price }
    setForm({ ...form, pricing: updated })
  }

  function updateListItem(field: 'highlights' | 'inclusions' | 'exclusions', i: number, value: string) {
    const arr = [...form[field]]
    arr[i] = value
    setForm({ ...form, [field]: arr })
  }

  function addListItem(field: 'highlights' | 'inclusions' | 'exclusions') {
    setForm({ ...form, [field]: [...form[field], ''] })
  }

  function removeListItem(field: 'highlights' | 'inclusions' | 'exclusions', i: number) {
    setForm({ ...form, [field]: form[field].filter((_, idx) => idx !== i) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug || !form.shortDescription) {
      toast.error('Please fill name, slug, and description.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(Boolean),
        inclusions: form.inclusions.filter(Boolean),
        exclusions: form.exclusions.filter(Boolean),
        pricing:    form.pricing.filter((p) => p.price > 0),
      }

      const res  = await fetch('/api/packages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok) {
        toast.success('Package created successfully!')
        router.push('/admin/packages')
      } else {
        toast.error(data.error ?? 'Failed to create package.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const ListEditor = ({
    field, label,
  }: {
    field: 'highlights' | 'inclusions' | 'exclusions'
    label: string
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
        <button type="button" onClick={() => addListItem(field)}
          className="flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:text-saffron-700">
          <Plus size={12} />Add
        </button>
      </div>
      <div className="space-y-2">
        {form[field].map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} placeholder={`${label} ${i + 1}`}
              onChange={(e) => updateListItem(field, i, e.target.value)}
              className="input-field text-sm py-2 flex-1" />
            <button type="button" onClick={() => removeListItem(field, i)}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Add New Package"
        crumbs={[{ label: 'Packages', href: '/admin/packages' }, { label: 'New' }]}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic info */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Package Name *</label>
                  <input type="text" placeholder="Same Day Mathura Vrindavan Tour" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    className="input-field" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Slug (URL) *</label>
                  <input type="text" placeholder="same-day-mathura-vrindavan" required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="input-field font-mono text-sm" />
                  <p className="text-xs text-gray-400 mt-1">URL: /packages/{form.slug || 'your-slug-here'}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Short Description *</label>
                  <textarea rows={2} placeholder="Brief description shown on listing pages..."
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="input-field resize-none" required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Duration (days)</label>
                    <input type="number" min={1} max={30}
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: Number(e.target.value), nights: Math.max(0, Number(e.target.value) - 1) })}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nights</label>
                    <input type="number" min={0}
                      value={form.nights}
                      onChange={(e) => setForm({ ...form, nights: Number(e.target.value) })}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Base Price (₹)</label>
                    <input type="number" min={0}
                      value={form.basePrice}
                      onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
                      className="input-field" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-1">Photo Gallery</h3>
              <p className="text-xs text-gray-400 mb-4">Upload package photos. First image becomes the main thumbnail.</p>
              <ImageManager
                images={form.images}
                onChange={(imgs) => setForm({ ...form, images: imgs, thumbnail: imgs[0] ?? '' })}
                folder="packages"
                maxImages={6}
                label="Package Photos"
              />
            </motion.div>

            {/* Pricing per vehicle */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Pricing Per Vehicle</h3>
              <div className="space-y-3">
                {form.pricing.map((p, i) => (
                  <div key={p.carType} className="flex items-center gap-4 p-3 rounded-xl"
                    style={{ background: '#f9fafb' }}>
                    <p className="text-sm font-semibold text-gray-800 flex-1">{p.carName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">₹</span>
                      <input type="number" min={0} placeholder="0"
                        value={p.price || ''}
                        onChange={(e) => updatePricing(i, Number(e.target.value))}
                        className="input-field py-2 text-sm w-28 text-right" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Leave 0 if this vehicle type is not available for this package</p>
            </motion.div>

            {/* Highlights, inclusions, exclusions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="card rounded-2xl p-5 space-y-5">
              <h3 className="font-bold text-gray-900">Package Details</h3>
              <ListEditor field="highlights"  label="Highlights"  />
              <ListEditor field="inclusions"  label="Inclusions"  />
              <ListEditor field="exclusions"  label="Exclusions"  />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="card rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                {[
                  { key: 'isActive',   label: 'Active (visible on site)'      },
                  { key: 'isFeatured', label: 'Featured (homepage display)'   },
                  { key: 'isPopular',  label: 'Popular (badge on card)'       },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{toggle.label}</span>
                    <button type="button"
                      onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key as keyof typeof form] })}
                      className="relative w-10 h-5 rounded-full transition-all duration-200"
                      style={{ background: form[toggle.key as keyof typeof form] ? '#ff7d0f' : '#d1d5db' }}>
                      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                        style={{ left: form[toggle.key as keyof typeof form] ? '20px' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <button type="submit" disabled={saving}
              className="btn-primary w-full py-3.5" style={{ opacity: saving ? 0.7 : 1 }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>
                : <><Save size={16} />Create Package</>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}