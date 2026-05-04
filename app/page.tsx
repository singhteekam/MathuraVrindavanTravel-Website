import type { Metadata } from 'next'
import HeroBanner       from '@/components/home/HeroBanner'
import StatsBar         from '@/components/home/StatsBar'
import FeaturedPackages from '@/components/home/FeaturedPackages'
import PopularPlaces    from '@/components/home/PopularPlaces'
import HowItWorks       from '@/components/home/HowItWorks'
import WhyChooseUs      from '@/components/home/WhyChooseUs'
import Testimonials     from '@/components/home/Testimonials'
import CTASection       from '@/components/home/CTASection'
import {
  getFeaturedPackages,
  getFeaturedPlaces,
  getApprovedReviews,
} from '@/lib/fetchData'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Mathura Vrindavan Dham Yatra | Best Tour Packages & Taxi Service',
  description:
    'Experience the divine land of Lord Krishna. Best Mathura Vrindavan tour packages starting \u20b92000. AC cars, expert drivers, hotel assistance. Book now!',
  keywords: ['Mathura Vrindavan tour packages', 'Vrindavan taxi', 'Mathura tour', 'Krishna temple tour'],
  openGraph: {
    title:       'Mathura Vrindavan Dham Yatra | Best Tour Packages',
    description: 'Tour packages starting \u20b92000. AC cars, expert drivers. Book now!',
    url:         'https://mathuravrindavantravel.com',
    images:      [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
}

// ISR: revalidate every 5 minutes
// Tags: 'packages' | 'places' | 'reviews' — busted by admin mutations
export const revalidate = 300

export default async function HomePage() {
  // All three queries run in parallel, each independently cached
  const [featuredPackages, popularPlaces, reviews] = await Promise.all([
    getFeaturedPackages(),
    getFeaturedPlaces(),
    getApprovedReviews(6),
  ])

  return (
    <>
    <Navbar />
      <HeroBanner />
      <StatsBar />
      <FeaturedPackages packages={featuredPackages} />
      <HowItWorks />
      <PopularPlaces    places={popularPlaces} />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}