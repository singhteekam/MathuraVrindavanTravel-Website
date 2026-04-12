'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/shared/SectionHeader'

const features = [
  {
    emoji: '🚗',
    title: 'Premium Fleet of Vehicles',
    description:
      'Choose from Swift, Eeco, Ertiga, Innova and more — all AC, GPS-equipped, well-maintained vehicles with experienced drivers.',
  },
  {
    emoji: '💰',
    title: 'Transparent Pricing',
    description:
      'What you see is what you pay. No hidden charges, no surprises. All-inclusive pricing from ₹2,000 onwards.',
  },
  {
    emoji: '🗺️',
    title: 'Expert Local Knowledge',
    description:
      'Our drivers and guides are born and raised in Braj. They know every temple story, every shortcut, every aarti timing.',
  },
  {
    emoji: '🏨',
    title: 'Hotel & Restaurant Help',
    description:
      'Need a place to stay or eat? We help you find the best pure-veg restaurants and budget-to-premium hotels in Mathura & Vrindavan.',
  },
  {
    emoji: '📞',
    title: '24/7 Customer Support',
    description:
      'Our team is always available on call and WhatsApp. Any issue during your trip — we solve it immediately.',
  },
  {
    emoji: '🔒',
    title: 'Safe & Verified Drivers',
    description:
      'All our drivers are police-verified, licensed, and trained in safe driving. Your safety is our highest priority.',
  },
  {
    emoji: '📿',
    title: 'Puja Arrangements',
    description:
      'We help arrange special pujas, Yamuna aarti participation, temple VIP passes, and spiritual guide services.',
  },
  {
    emoji: '❌',
    title: 'Free Cancellation',
    description:
      'Plans changed? Cancel up to 24 hours before your trip for a full refund. No questions asked.',
  },
]

export default function WhyChooseUs() {
  return (
    <section
      className="py-20"
      style={{
        background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 50%, #1e1b4b 100%)',
      }}
    >
      <div className="container-custom">
        <SectionHeader
          subtitle="Why Choose Us"
          title="The Most Trusted Tour Partner in Braj"
          description="Thousands of devotees have trusted us with their most sacred journeys. Here's what makes us different."
          className="mb-14"
        />

        {/* Override section-title color for dark bg */}
        <style>{`.why-us .section-title { color: #fff; } .why-us .section-subtitle { color: #ff9b37; }`}</style>
        <div className="why-us">
          <SectionHeader
            subtitle="Why Choose Us"
            title="The Most Trusted Tour Partner in Braj"
            description="Thousands of devotees have trusted us with their most sacred journeys. Here's what makes us different."
            className="mb-14 hidden"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group p-6 rounded-2xl transition-all duration-300 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,125,15,0.12)'
                e.currentTarget.style.border = '1px solid rgba(255,125,15,0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: 'rgba(255,125,15,0.15)' }}
              >
                {feature.emoji}
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{feature.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}