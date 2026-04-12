import type { Metadata } from 'next'
import { Poppins, Playfair_Display, Baloo_2 } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-baloo',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mathuravrindavantravel.com'),
  title: {
    default: 'Mathura Vrindavan Travel | Best Tour Packages & Taxi Service',
    template: '%s | Mathura Vrindavan Travel',
  },
  description:
    'Experience the divine land of Lord Krishna with Mathura Vrindavan Travel. Best tour packages, taxi service, hotel assistance and spiritual trip planning from ₹2000.',
  keywords: [
    'Mathura Vrindavan tour packages',
    'Vrindavan taxi service',
    'Mathura tour',
    'Krishna temple tour',
    'Brij darshan',
    'Mathura travel',
    'Vrindavan travel',
  ],
  authors: [{ name: 'Mathura Vrindavan Travel' }],
  creator: 'Mathura Vrindavan Travel',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mathuravrindavantravel.com',
    siteName: 'Mathura Vrindavan Travel',
    title: 'Mathura Vrindavan Travel | Best Tour Packages & Taxi Service',
    description:
      'Experience the divine land of Lord Krishna. Best tour packages from ₹2000.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mathura Vrindavan Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mathura Vrindavan Travel',
    description: 'Experience the divine land of Lord Krishna.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      
    >
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#ff7d0f', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}