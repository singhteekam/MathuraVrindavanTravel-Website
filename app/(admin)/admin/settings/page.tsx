'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Phone, Mail, Globe, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { siteConfig } from '@/config/site'

export default function AdminSettingsPage() {
  const [saved,    setSaved]    = useState(false)
  const [showPass, setShowPass] = useState(false)

  const [siteInfo, setSiteInfo] = useState({
    name:      siteConfig.name,
    phone:     siteConfig.phone,
    email:     siteConfig.email,
    whatsapp:  siteConfig.whatsapp,
    address:   'Mathura, Uttar Pradesh — 281001',
    tagline:   'Spiritual Journeys, Sacred Memories',
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.gmail.com',
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

  function handleSave() {
    // In production: POST to /api/admin/settings
    setSaved(true)
    toast.success('Settings saved successfully!')
    setTimeout(() => setSaved(false), 3000)
  }

  const Section = ({ title, description, children }: {
    title: string; description?: string; children: React.ReactNode
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card rounded-2xl p-6 mb-5"
    >
      <div className="mb-5 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </motion.div>
  )

  return (
    <div className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
      <AdminPageHeader
        title="Settings"
        crumbs={[{ label: 'Settings' }]}
        action={
          <button onClick={handleSave}
            className="btn-primary text-sm py-2.5 px-5">
            {saved
              ? <><CheckCircle size={16} /> Saved!</>
              : <><Save size={16} /> Save Changes</>
            }
          </button>
        }
      />

      <div className="max-w-2xl">

        {/* Site information */}
        <Section title="Site Information" description="Basic business details shown on the website">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Business Name</label>
                <input type="text"
                  value={siteInfo.name}
                  onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Tagline</label>
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
                  WhatsApp Number
                </label>
                <input type="tel" placeholder="91XXXXXXXXXX"
                  value={siteInfo.whatsapp}
                  onChange={(e) => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
                  className="input-field" />
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

        {/* Booking configuration */}
        <Section title="Booking Configuration" description="Control how bookings work on your platform">
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
                <p className="text-xs text-gray-400 mt-1">
                  Customers pay this % upfront to confirm
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Free Cancellation (hours)
                </label>
                <input type="number" min={0}
                  value={bookingConfig.cancellationHours}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, cancellationHours: Number(e.target.value) })}
                  className="input-field" />
                <p className="text-xs text-gray-400 mt-1">
                  Hours before trip for free cancellation
                </p>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              {[
                { key: 'autoConfirm',   label: 'Auto-confirm bookings',     desc: 'Skip manual confirmation step'          },
                { key: 'whatsappNotify',label: 'WhatsApp notifications',     desc: 'Send booking updates via WhatsApp'      },
                { key: 'emailNotify',   label: 'Email notifications',        desc: 'Send booking confirmation emails'       },
              ].map((toggle) => (
                <div key={toggle.key}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: '#f9fafb' }}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{toggle.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{toggle.desc}</p>
                  </div>
                  <button
                    onClick={() => setBookingConfig((prev) => ({
                      ...prev,
                      [toggle.key]: !prev[toggle.key as keyof typeof prev],
                    }))}
                    className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: bookingConfig[toggle.key as keyof typeof bookingConfig]
                        ? '#ff7d0f' : '#d1d5db',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                      style={{
                        left: bookingConfig[toggle.key as keyof typeof bookingConfig]
                          ? '22px' : '2px',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Email config */}
        <Section title="Email Configuration" description="SMTP settings for sending emails">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">SMTP Host</label>
                <input type="text" placeholder="smtp.gmail.com"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">SMTP Port</label>
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
                <input type={showPass ? 'text' : 'password'} placeholder="Gmail App Password"
                  value={emailConfig.smtpPass}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
                  className="input-field pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Generate at Google Account → Security → 2FA → App Passwords
              </p>
            </div>
          </div>
        </Section>

        {/* Environment variables info */}
        <div className="rounded-2xl p-5" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div className="flex items-start gap-3">
            <Globe size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Environment Variables</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                For security, sensitive settings like API keys and passwords are configured
                as environment variables in your Vercel dashboard, not stored in the database.
                Go to Vercel → Project → Settings → Environment Variables to update them.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={handleSave} className="btn-primary w-full py-4 text-base">
            {saved
              ? <><CheckCircle size={18} /> All Changes Saved!</>
              : <><Save size={18} /> Save All Settings</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}