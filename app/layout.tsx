import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/AuthProvider'
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://mathuravrindavantravel.com'),
  title: {
    default: 'Mathura Vrindavan Travel | Best Tour Packages & Taxi Service',
    template: '%s | Mathura Vrindavan Travel',
  },
  description:
    'Experience the divine land of Lord Krishna with Mathura Vrindavan Travel. Best tour packages, taxi service, hotel assistance from ₹2000.',
  keywords: [
    'Mathura Vrindavan tour packages',
    'Vrindavan taxi service',
    'Mathura tour',
    'Krishna temple tour',
  ],
  authors: [{ name: 'Mathura Vrindavan Travel' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mathuravrindavantravel.com',
    siteName: 'Mathura Vrindavan Travel',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Analytics />
          <SpeedInsights />
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
        </AuthProvider>
      </body>
    </html>
  )
}