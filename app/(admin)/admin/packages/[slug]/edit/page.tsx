'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Plus, X, ArrowLeft, AlertCircle } from 'lucide-react'
import Link  from 'next/link'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ImageManager    from '@/components/admin/ImageManager'
import { cars } from '@/config/site'

interface PackageForm {
  name:             string
  slug:             string
  duration:         number
  nights:           number
  basePrice:        number
  shortDescription: string
  highlights:       string[]
  inclusions:       string[]
  exclusions:       string[]
  thumbnail:  string
  images:     string[]
  isActive:   boolean
  isFeatured: boolean
  isPopular:        boolean
  pricing:          { carType: string; carName: string; price: number }[]
}

export default function EditPackagePage() {
  const { slug }              = useParams<{ slug: string }>()
  const router                = useRouter()
  const [form,    setForm]    = useState<PackageForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    fetch(`/api/packages/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const p = d.data
          setForm({
            name:             p.name             ?? '',
            slug:             p.slug             ?? '',
            duration:         p.duration         ?? 1,
            nights:           p.nights           ?? 0,
            basePrice:        p.basePrice        ?? 0,
            shortDescription: p.shortDescription ?? '',
            highlights:       p.highlights?.length ? p.highlights : [''],
            inclusions:       p.inclusions?.length ? p.inclusions : [''],
            exclusions:       p.exclusions?.length ? p.exclusions : [''],
            thumbnail:        p.thumbnail  ?? '',
            images:           p.images     ?? [],
            isActive:         p.isActive   ?? true,
            isFeatured:       p.isFeatured ?? false,
            isPopular:        p.isPopular  ?? false,
            pricing: cars.map((c) => {
              const existing = p.pricing?.find((pr: { carType: string }) => pr.carType === c.id)
              return { carType: c.id, carName: c.name, price: existing?.price ?? 0 }
            }),
          })
        } else {
          toast.error('Package not found.')
          router.push('/admin/packages')
        }
      })
      .catch(() => toast.error('Failed to load package.'))
      .finally(() => setLoading(false))
  }, [slug, router])

  function updateListItem(field: 'highlights' | 'inclusions' | 'exclusions', i: number, value: string) {
    if (!form) return
    const arr = [...form[field]]
    arr[i]    = value
    setForm({ ...form, [field]: arr })
  }

  function addListItem(field: 'highlights' | 'inclusions' | 'exclusions') {
    if (!form) return
    setForm({ ...form, [field]: [...form[field], ''] })
  }

  function removeListItem(field: 'highlights' | 'inclusions' | 'exclusions', i: number) {
    if (!form) return
    setForm({ ...form, [field]: form[field].filter((_, idx) => idx !== i) })
  }

  function updatePricing(i: number, price: number) {
    if (!form) return
    const updated = [...form.pricing]
    updated[i]    = { ...updated[i], price }
    setForm({ ...form, pricing: updated })
  }

  async function handleSave() {
    if (!form) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(Boolean),
        inclusions: form.inclusions.filter(Boolean),
        exclusions: form.exclusions.filter(Boolean),
        pricing:    form.pricing.filter((p) => p.price > 0),
      }
      const res  = await fetch(`/api/packages/${slug}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Package updated successfully!')
        router.push('/admin/packages')
      } else {
        toast.error(data.error ?? 'Failed to update package.')
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

  if (!form) return (
    <div className="flex-1 p-8 pt-20 lg:pt-8 text-center">
      <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
      <p className="text-gray-600">Package not found.</p>
      <Link href="/admin/packages" className="btn-primary mt-4 inline-flex text-sm">
        Back to Packages
      </Link>
    </div>
  )

  const ListEditor = ({ field, label }: { field: 'highlights' | 'inclusions' | 'exclusions'; label: string }) => (
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
        title={`Edit: ${form.name}`}
        crumbs={[{ label: 'Packages', href: '/admin/packages' }, { label: 'Edit' }]}
        action={
          <div className="flex gap-2">
            <Link href="/admin/packages"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={14} />Cancel
            </Link>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 px-5">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                : <><Save size={15} />Save Changes</>
              }
            </button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Basic info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Package Name *</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Slug (read-only)</label>
                  <input type="text" value={form.slug} disabled
                    className="input-field bg-gray-50 text-gray-400 cursor-not-allowed font-mono text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Short Description *</label>
                <textarea rows={2} value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="input-field resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Duration (days)</label>
                  <input type="number" min={1} value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nights</label>
                  <input type="number" min={0} value={form.nights}
                    onChange={(e) => setForm({ ...form, nights: Number(e.target.value) })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Base Price (₹)</label>
                  <input type="number" min={0} value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
                    className="input-field" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
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
                    <input type="number" min={0} value={p.price || ''}
                      placeholder="0"
                      onChange={(e) => updatePricing(i, Number(e.target.value))}
                      className="input-field py-2 text-sm w-28 text-right" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-1">Photo Gallery</h3>
            <p className="text-xs text-gray-400 mb-4">Upload package/tour photos via Cloudinary. First image is the main thumbnail shown on cards and the homepage.</p>
            <ImageManager
              images={form.images}
              onChange={(imgs) => setForm({ ...form, images: imgs, thumbnail: imgs[0] ?? '' })}
              folder="packages"
              maxImages={6}
              label="Package Photos"
            />
          </motion.div>

          {/* Lists */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="card rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-gray-900">Package Details</h3>
            <ListEditor field="highlights"  label="Highlights"  />
            <ListEditor field="inclusions"  label="Inclusions"  />
            <ListEditor field="exclusions"  label="Exclusions"  />
          </motion.div>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="card rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">Visibility Settings</h3>
            <div className="space-y-4">
              {[
                { key: 'isActive',   label: 'Active',   desc: 'Visible on public site'    },
                { key: 'isFeatured', label: 'Featured', desc: 'Shown on homepage'          },
                { key: 'isPopular',  label: 'Popular',  desc: 'Shows popular badge'        },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{toggle.label}</p>
                    <p className="text-xs text-gray-400">{toggle.desc}</p>
                  </div>
                  <button type="button"
                    onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key as keyof PackageForm] })}
                    className="relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 mt-0.5"
                    style={{ background: form[toggle.key as keyof PackageForm] ? '#ff7d0f' : '#d1d5db' }}>
                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                      style={{ left: form[toggle.key as keyof PackageForm] ? '20px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* View on site */}
          <Link href={`/packages/${slug}`} target="_blank"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            View on Site ↗
          </Link>

          <button onClick={handleSave} disabled={saving}
            className="btn-primary w-full py-3.5" style={{ opacity: saving ? 0.7 : 1 }}>
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