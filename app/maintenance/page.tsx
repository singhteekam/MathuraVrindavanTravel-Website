'use client'

import { useEffect, useState } from 'react'
import { motion }              from 'framer-motion'
import { Wrench, Clock, Mail, MessageCircle, RefreshCw } from 'lucide-react'

const CONTACT_WHATSAPP = '919999999999'
const CONTACT_EMAIL    = 'info@mathuravrindavandhamyatra.com'
const SITE_NAME        = 'Mathura Vrindavan Dham Yatra'

// Animated countdown — counts up seconds since page load
// to give a sense that work is happening
function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="font-mono tabular-nums">
      {time.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      })}
    </span>
  )
}

// Animated progress dots
function ProgressDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: '#ff7d0f' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function MaintenancePage() {
  const [count, setCount] = useState(0)

  // Refresh button — reloads after countdown
  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [count])

  function handleRefresh() {
    setCount(5)
    setTimeout(() => window.location.reload(), 5000)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0f0e2a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <div className="max-w-lg w-full mx-auto text-center">

        {/* Logo / om */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, delay: 0.1 }}
          className="mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #ff7d0f, #c74a06)' }}>
            <Wrench size={36} className="text-white" />
          </div>
          <p className="text-saffron-400 text-xs font-semibold uppercase tracking-[0.3em] mb-2"
            style={{ color: '#ff9a3c' }}>
            🙏 {SITE_NAME}
          </p>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}>
            Under Maintenance
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-2">
            We are currently performing scheduled maintenance to improve your
            pilgrimage experience. We&apos;ll be back shortly.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            In the meantime, you can reach us directly on WhatsApp to book a tour.
          </p>
        </motion.div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 mb-5 text-left"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Work in progress row */}
          <div className="flex items-center justify-between mb-4 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">Maintenance in Progress</span>
            </div>
            <ProgressDots />
          </div>

          {/* Expected back */}
          {/* <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Clock size={13} />
              <span>Current time</span>
            </div>
            <span className="text-sm font-semibold text-white">
              <LiveClock />
            </span>
          </div> */}

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Status</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,125,15,0.2)', color: '#ff7d0f' }}>
              🔧 Upgrading Systems
            </span>
          </div>
        </motion.div>

        {/* What we're working on */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-5 mb-5 text-left"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            What we&apos;re working on
          </p>
          <div className="space-y-2">
            {[
              { label: 'Server upgrades',      done: false  },
              { label: 'Performance improvements', done: false  },
              { label: 'New features & fixes', done: true },
              { label: 'Security updates',     done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="text-sm">{item.done ? '✅' : '⏳'}</span>
                <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-5">
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=Namaste! I want to book a tour. Please help. 🙏`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: '#22c55e', color: '#fff' }}>
            <MessageCircle size={16} />WhatsApp Us
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Mail size={16} />Email Us
          </a>
        </motion.div>

        {/* Refresh button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <button type="button" onClick={handleRefresh}
            disabled={count > 0}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{
              background:   count > 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
              color:        count > 0 ? '#6b7280' : '#9ca3af',
              border:       '1px solid rgba(255,255,255,0.08)',
              cursor:       count > 0 ? 'not-allowed' : 'pointer',
            }}>
            <RefreshCw size={14} className={count > 0 ? 'animate-spin' : ''} />
            {count > 0 ? `Checking in ${count}s...` : 'Check again'}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-xs mt-8">
          {SITE_NAME} · Mathura, Uttar Pradesh, India
        </motion.p>
      </div>
    </div>
  )
}