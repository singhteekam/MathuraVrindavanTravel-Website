'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Eye, TrendingUp } from 'lucide-react'

interface VisitorCounts {
  total: number
  today: number
  weekly: number
  monthly: number
}

const EMPTY_COUNTS: VisitorCounts = {
  total: 0,
  today: 0,
  weekly: 0,
  monthly: 0,
}

function checkAndRecordSessionVisit(): boolean {
  try {
    const key = 'mvdy_session_visit_recorded'
    const alreadyRecorded = sessionStorage.getItem(key) === 'true'

    if (!alreadyRecorded) {
      sessionStorage.setItem(key, 'true')
      return true
    }

    return false
  } catch {
    return true
  }
}

function formatCount(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0)
  const displayedRef = useRef(0)

  useEffect(() => {
    const start = displayedRef.current
    if (value === start) return

    const diff = value - start
    const steps = 30
    const step = diff / steps
    let current = start
    let frame = 0

    const timer = setInterval(() => {
      frame += 1
      current += step
      const nextValue = Math.round(current)
      displayedRef.current = nextValue
      setDisplayed(nextValue)

      if (frame >= steps) {
        displayedRef.current = value
        setDisplayed(value)
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [value])

  return <>{formatCount(displayed)}</>
}

export default function VisitorBadge() {
  const [counts, setCounts] = useState<VisitorCounts>(EMPTY_COUNTS)
  const [expanded, setExpanded] = useState(false)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function trackAndFetch() {
      const isNew = checkAndRecordSessionVisit()

      try {
        const res = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isNew }),
        })
        const data = await res.json()

        if (res.ok && data.success) {
          setCounts(data.data)
          setIsLive(true)
          return
        }

        const fallback = await fetch('/api/visitors')
        const fallbackData = await fallback.json()

        if (fallback.ok && fallbackData.success) {
          setCounts(fallbackData.data)
          setIsLive(true)
        }
      } catch {
        setIsLive(false)
      }
    }

    trackAndFetch()
  }, [])

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-200 transition-all duration-200 hover:scale-105 hover:text-white"
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
        title="Visitor statistics"
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: isLive ? '#22c55e' : '#f59e0b' }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: isLive ? '#22c55e' : '#f59e0b' }}
          />
        </span>

        <Users size={12} className="flex-shrink-0 text-gray-300" />

        <span className="whitespace-nowrap">
          <AnimatedNumber value={counts.total} /> visitors
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setExpanded(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 z-50 mb-2 min-w-[210px] rounded-xl p-4 shadow-2xl md:left-auto md:right-0"
              style={{
                background: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div
                className="mb-3 flex items-center gap-2 pb-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255,125,15,0.2)' }}
                >
                  <Eye size={12} style={{ color: '#ff7d0f' }} />
                </div>
                <p className="text-xs font-bold text-white">Visitor Stats</p>
                <span
                  className="ml-auto flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: isLive ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                    color: isLive ? '#22c55e' : '#f59e0b',
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full"
                    style={{ background: isLive ? '#22c55e' : '#f59e0b' }}
                  />
                  {isLive ? 'Live' : 'Offline'}
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Total Visitors', value: counts.total, icon: <Users size={12} />, color: '#ff7d0f' },
                  { label: 'Today', value: counts.today, icon: <Eye size={12} />, color: '#22c55e' },
                  { label: 'This Week', value: counts.weekly, icon: <TrendingUp size={12} />, color: '#818cf8' },
                  { label: 'This Month', value: counts.monthly, icon: <TrendingUp size={12} />, color: '#38bdf8' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4">
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

              {/* <p className="mt-3 text-center text-xs text-gray-500">
                Counted once per browser tab session
              </p> */}

              <div
                className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 rounded-sm md:left-auto md:right-4"
                style={{
                  background: '#1a1a2e',
                  borderRight: '1px solid rgba(255,255,255,0.12)',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
