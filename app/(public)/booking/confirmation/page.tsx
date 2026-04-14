'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Home, Package } from 'lucide-react'
import { siteConfig } from '@/config/site'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId    = searchParams.get('id') ?? 'MVT-XXXXXX'

  const whatsappMsg = `Namaste! I just booked a tour. My Booking ID is ${bookingId}. Please confirm my booking. 🙏`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #ff7d0f, #c74a06)' }}
        >
          <span className="text-4xl">🙏</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-saffron-500 font-semibold mb-6"
        >
          Jai Shri Krishna 🌸
        </motion.p>

        {/* Booking ID card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: 'linear-gradient(135deg, #fff8ed, #ffefd4)',
            border:     '1px solid #ffdba8',
          }}
        >
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
            Your Booking ID
          </p>
          <p
            className="text-2xl font-bold mb-3"
            style={{ color: '#ff7d0f', fontFamily: 'var(--font-serif)' }}
          >
            {bookingId}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Save this ID — you&apos;ll need it to track your booking and communicate
            with our team.
          </p>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card rounded-2xl p-6 mb-6 text-left"
        >
          <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Our team will call you within 30 minutes to confirm.' },
              { step: '2', text: 'We will assign you a verified driver and share their details.' },
              { step: '3', text: 'A confirmation message will be sent to your WhatsApp.' },
              { step: '4', text: 'Your driver will arrive at the pickup location on time.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: '#ff7d0f' }}
                >
                  {item.step}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm"
            style={{ background: '#22c55e', color: '#fff' }}
          >
            <MessageCircle size={18} />
            Confirm via WhatsApp
          </a>

          <a
            href={`tel:${siteConfig.phone}`}
            className="btn-secondary w-full justify-center py-3.5"
          >
            <Phone size={16} />
            {siteConfig.phone}
          </a>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-colors"
              style={{ background: '#f3f4f6', color: '#374151' }}
            >
              <Home size={15} /> Home
            </Link>
            <Link
              href="/packages"
              className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-colors"
              style={{ background: '#f3f4f6', color: '#374151' }}
            >
              <Package size={15} /> Packages
            </Link>
          </div>
        </motion.div>

        <p className="text-xs text-gray-400 mt-6">
          A confirmation email has been sent if you provided your email address.
        </p>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}