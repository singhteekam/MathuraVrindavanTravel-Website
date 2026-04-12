import type { Metadata } from 'next'
import HeroBanner      from '@/components/home/HeroBanner'
import StatsBar        from '@/components/home/StatsBar'
import FeaturedPackages from '@/components/home/FeaturedPackages'
import PopularPlaces   from '@/components/home/PopularPlaces'
import HowItWorks      from '@/components/home/HowItWorks'
import WhyChooseUs     from '@/components/home/WhyChooseUs'
import Testimonials    from '@/components/home/Testimonials'
import CTASection      from '@/components/home/CTASection'
import Navbar          from '@/components/layout/Navbar'
import Footer          from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Mathura Vrindavan Travel | Best Tour Packages & Taxi Service',
  description:
    'Experience the divine land of Lord Krishna. Best Mathura Vrindavan tour packages starting ₹2000. AC cars, expert drivers, hotel assistance. Book now!',
  keywords: [
    'Mathura Vrindavan tour packages',
    'Vrindavan taxi',
    'Mathura tour',
    'Krishna temple tour',
    'Brij darshan packages',
  ],
  openGraph: {
    title: 'Mathura Vrindavan Travel | Best Tour Packages',
    description: 'Tour packages starting ₹2000. AC cars, expert drivers. Book now!',
    url: 'https://mathuravrindavantravel.com',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <StatsBar />
      <FeaturedPackages />
      <HowItWorks />
      <PopularPlaces />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  )
}