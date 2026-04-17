'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import {
  Save, Phone, Mail, Globe, Eye, EyeOff,
  CheckCircle, AlertCircle,
} from 'lucide-react'
import toast           from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { siteConfig }  from '@/config/site'

// ─── Section wrapper — plain div, NO framer-motion animation
// (motion.div with initial/animate re-plays every time parent re-renders from
//  state changes like toggle clicks, making it look like a page refresh)
function Section({
  title, description, children,
}: {
  title: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="card rounded-2xl p-6 mb-5">
      <div className="mb-5 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Toggle switch — extracted so it doesn't cause parent re-render issues
function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean
  onChange: () => void
  label:   string
  desc:    string
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl"
      style={{ background: '#f9fafb' }}>
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"   // ← critical: prevents any accidental form submit
        onClick={onChange}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2"
        style={{ background: checked ? '#ff7d0f' : '#d1d5db' }}
        role="switch"
        aria-checked={checked}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')

  const [siteInfo, setSiteInfo] = useState({
    name:     siteConfig.name,
    phone:    siteConfig.phone,
    email:    siteConfig.email,
    whatsapp: siteConfig.whatsapp,
    address:  'Mathura, Uttar Pradesh — 281001',
    tagline:  siteConfig.tagline,
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: process.env.NEXT_PUBLIC_SMTP_HOST ?? 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
  })

  const [bookingConfig, setBookingConfig] = useState({
    advancePercent:    30,
    cancellationHours: 24,
    autoConfirm:       false,
    whatsappNotify:    true,
    emailNotify:       true,
  })

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteInfo, emailConfig, bookingConfig }),
      })

      if (res.ok) {
        setSaved(true)
        toast.success('Settings saved successfully!')
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        const msg  = data.error ?? 'Failed to save settings.'
        setError(msg)
        toast.error(msg)
      }
    } catch {
      const msg = 'Network error — settings not saved.'
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const SaveButton = ({ fullWidth }: { fullWidth?: boolean }) => (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className={`btn-primary text-sm py-2.5 px-5 ${fullWidth ? 'w-full py-4 text-base' : ''}`}
      style={{ opacity: saving ? 0.7 : 1 }}
    >
      {saving ? (
        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
      ) : saved ? (
        <><CheckCircle size={16} /> Saved!</>
      ) : (
        <><Save size={16} /> Save Changes</>
      )}
    </button>
  )

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Settings"
        crumbs={[{ label: 'Settings' }]}
        action={<SaveButton />}
      />

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl mb-5"
          style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="max-w-2xl">

        {/* ── Site Information ── */}
        <Section
          title="Site Information"
          description="Basic business details shown on the website">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Business Name
                </label>
                <input type="text"
                  value={siteInfo.name}
                  onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Tagline
                </label>
                <input type="text"
                  value={siteInfo.tagline}
                  onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
                  className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  <Phone size={11} className="inline mr-1" />Phone Number
                </label>
                <input type="tel"
                  value={siteInfo.phone}
                  onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  WhatsApp (with country code)
                </label>
                <input type="tel" placeholder="919XXXXXXXXX"
                  value={siteInfo.whatsapp}
                  onChange={(e) => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
                  className="input-field" />
                <p className="text-xs text-gray-400 mt-1">No + or spaces — e.g. 919876543210</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <Mail size={11} className="inline mr-1" />Email Address
              </label>
              <input type="email"
                value={siteInfo.email}
                onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
                className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Office Address
              </label>
              <input type="text"
                value={siteInfo.address}
                onChange={(e) => setSiteInfo({ ...siteInfo, address: e.target.value })}
                className="input-field" />
            </div>
          </div>
        </Section>

        {/* ── Booking Configuration ── */}
        <Section
          title="Booking Configuration"
          description="Control how bookings work on your platform">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Advance Payment %
                </label>
                <input type="number" min={0} max={100}
                  value={bookingConfig.advancePercent}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, advancePercent: Number(e.target.value) })}
                  className="input-field" />
                <p className="text-xs text-gray-400 mt-1">Customers pay this % upfront to confirm</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Free Cancellation (hours)
                </label>
                <input type="number" min={0}
                  value={bookingConfig.cancellationHours}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, cancellationHours: Number(e.target.value) })}
                  className="input-field" />
                <p className="text-xs text-gray-400 mt-1">Hours before trip for free cancellation</p>
              </div>
            </div>

            {/* Toggles — using extracted Toggle component to prevent re-animation */}
            <div className="space-y-3 pt-2">
              <Toggle
                checked={bookingConfig.autoConfirm}
                onChange={() => setBookingConfig((p) => ({ ...p, autoConfirm: !p.autoConfirm }))}
                label="Auto-confirm bookings"
                desc="Skip manual confirmation — bookings confirmed instantly"
              />
              <Toggle
                checked={bookingConfig.whatsappNotify}
                onChange={() => setBookingConfig((p) => ({ ...p, whatsappNotify: !p.whatsappNotify }))}
                label="WhatsApp notifications"
                desc="Send booking updates via WhatsApp to customer"
              />
              <Toggle
                checked={bookingConfig.emailNotify}
                onChange={() => setBookingConfig((p) => ({ ...p, emailNotify: !p.emailNotify }))}
                label="Email notifications"
                desc="Send booking confirmation emails"
              />
            </div>
          </div>
        </Section>

        {/* ── Email / SMTP ── */}
        <Section
          title="Email Configuration"
          description="SMTP settings for sending confirmation emails">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  SMTP Host
                </label>
                <input type="text" placeholder="smtp.gmail.com"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  SMTP Port
                </label>
                <input type="text" placeholder="587"
                  value={emailConfig.smtpPort}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                  className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                <Mail size={11} className="inline mr-1" />SMTP Email
              </label>
              <input type="email" placeholder="yourgmail@gmail.com"
                value={emailConfig.smtpUser}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                App Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Gmail App Password (16 characters)"
                  value={emailConfig.smtpPass}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Google Account → Security → 2-Step Verification → App Passwords
              </p>
            </div>
          </div>
        </Section>

        {/* ── Environment Variables note ── */}
        <div className="rounded-2xl p-5 mb-6"
          style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div className="flex items-start gap-3">
            <Globe size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Sensitive keys stay in Vercel</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                API keys (Razorpay, Cloudinary, MongoDB URI) are set as Environment Variables in Vercel
                and are never stored in the database. Go to Vercel → Project → Settings → Environment Variables.
              </p>
            </div>
          </div>
        </div>

        <SaveButton fullWidth />
      </div>
    </div>
  )
}