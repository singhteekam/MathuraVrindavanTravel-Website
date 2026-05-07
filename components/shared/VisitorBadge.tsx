'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Eye, TrendingUp } from 'lucide-react'

interface VisitorCounts {
  total:   number
  today:   number
  weekly:  number
  monthly: number
}

// ── Unique visitor detection ──────────────────────────────────────────────────
// Uses localStorage to track:
//   visitorId  — random ID assigned on first visit
//   lastVisit  — date string (YYYY-MM-DD) of last recorded visit
// A "new" visit is recorded when:
//   a) No visitorId exists (first ever visit)
//   b) lastVisit date is different from today (returning after 24h+)

function getTodayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

function checkAndRecordVisit(): boolean {
  try {
    const today      = getTodayIST()
    const visitorId  = localStorage.getItem('mvdy_visitor_id')
    const lastVisit  = localStorage.getItem('mvdy_last_visit')

    const isNew = !visitorId || lastVisit !== today

    if (isNew) {
      // Assign ID if first time
      if (!visitorId) {
        const id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
        localStorage.setItem('mvdy_visitor_id', id)
      }
      localStorage.setItem('mvdy_last_visit', today)
    }

    return isNew
  } catch {
    // localStorage blocked (private mode etc.) — treat as new each time
    return true
  }
}

// ── Number formatter ──────────────────────────────────────────────────────────
function formatCount(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

// ── Animated number ───────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (value === 0) return
    const diff  = value - displayed
    const steps = 40
    const step  = diff / steps
    let current = displayed
    let frame   = 0

    const timer = setInterval(() => {
      frame++
      current += step
      setDisplayed(Math.round(current))
      if (frame >= steps) {
        setDisplayed(value)
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [value])

  return <>{formatCount(displayed)}</>
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function VisitorBadge() {
  const [counts,  setCounts]  = useState<VisitorCounts | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded,setExpanded]= useState(false)

  useEffect(() => {
    async function trackAndFetch() {
      try {
        const isNew = checkAndRecordVisit()

        const res  = await fetch('/api/visitors', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ isNew }),
        })
        const data = await res.json()

        if (data.success) setCounts(data.data)
      } catch {
        // Silently fail — visitor badge is non-critical
      } finally {
        setLoading(false)
      }
    }

    trackAndFetch()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-pulse"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-3 h-3 rounded-full bg-gray-700" />
        <div className="w-12 h-3 rounded bg-gray-700" />
      </div>
    )
  }

  if (!counts) return null

  return (
    <div className="relative">
      {/* Main badge */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border:     '1px solid rgba(255,255,255,0.12)',
        }}
        title="Visitor statistics"
      >
        {/* Live dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#22c55e' }} />
          <span className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: '#22c55e' }} />
        </span>

        <Users size={12} className="text-gray-400 flex-shrink-0" />

        <span className="text-xs font-semibold text-gray-300">
          <AnimatedNumber value={counts.total} /> visitors
        </span>
      </button>

      {/* Expanded popup */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40"
              onClick={() => setExpanded(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 z-50 min-w-[200px] rounded-2xl p-4 shadow-2xl"
              style={{
                background: '#1a1a2e',
                border:     '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 pb-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,125,15,0.2)' }}>
                  <Eye size={12} style={{ color: '#ff7d0f' }} />
                </div>
                <p className="text-xs font-bold text-white">Visitor Stats</p>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Stats rows */}
              <div className="space-y-2">
                {[
                  { label: 'Total Visitors',   value: counts.total,   icon: <Users       size={12} />, color: '#ff7d0f' },
                  { label: 'Today',            value: counts.today,   icon: <Eye         size={12} />, color: '#22c55e' },
                  { label: 'This Week',        value: counts.weekly,  icon: <TrendingUp  size={12} />, color: '#818cf8' },
                  { label: 'This Month',       value: counts.monthly, icon: <TrendingUp  size={12} />, color: '#38bdf8' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2" style={{ color: stat.color }}>
                      {stat.icon}
                      <span className="text-xs text-gray-400">{stat.label}</span>
                    </div>
                    <span className="text-xs font-bold text-white">
                      <AnimatedNumber value={stat.value} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <p className="text-xs text-gray-600 mt-3 text-center">
                Unique visitors from India 🇮🇳
              </p>

              {/* Arrow */}
              <div className="absolute -bottom-1.5 right-4 w-3 h-3 rotate-45 rounded-sm"
                style={{ background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}