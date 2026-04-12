'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X, ChevronDown, Mail, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

interface NavChild {
  label: string
  href: string
  description?: string
}
interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Packages',
    href: '/packages',
    children: [
      { label: 'Same Day Tour',          href: '/packages/same-day-mathura-vrindavan',           description: 'Complete darshan in one day' },
      { label: '2 Days Package',         href: '/packages/2-days-mathura-vrindavan',             description: '1 Night comfortable stay' },
      { label: '3 Days Govardhan',       href: '/packages/3-days-mathura-vrindavan-govardhan',   description: 'Govardhan & Barsana included' },
      { label: '4 Days Complete Braj',   href: '/packages/4-days-mathura-vrindavan',             description: 'Complete Braj pilgrimage' },
      { label: '7 Days 84 Kos Yatra',   href: '/packages/7-days-braj-84-kos-yatra',             description: 'Sacred 84 Kos Parikrama' },
      { label: 'All Packages',           href: '/packages',                                       description: 'Browse all tour packages' },
    ],
  },
  {
    label: 'Places',
    href: '/places',
    children: [
      { label: 'Temples',       href: '/places?type=temple',      description: 'Sacred temples of Braj' },
      { label: 'Ghats',         href: '/places?type=ghat',        description: 'Holy ghats of Yamuna' },
      { label: 'Sacred Sites',  href: '/places?type=sacred-site', description: 'Divine sacred locations' },
      { label: 'All Places',    href: '/places',                   description: 'Explore 50+ places' },
    ],
  },
  { label: 'Hotels',      href: '/hotels' },
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Blog',        href: '/blog' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Us',    href: '/about',   description: 'Our story & mission' },
      { label: 'FAQ',         href: '/faq',     description: 'Common questions' },
      { label: 'Contact Us',  href: '/contact', description: 'Get in touch' },
    ],
  },
]

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileExpanded(null)
  }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Top bar ── */}
      <div className="hidden md:block bg-saffron-600 text-white text-xs py-2">
        <div className="container-custom flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <MapPin size={11} />
            Mathura, Uttar Pradesh, India
          </span>
          <div className="flex items-center gap-6">
            <a href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-1.5 hover:text-amber-200 transition-colors">
              <Phone size={11} />{siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1.5 hover:text-amber-200 transition-colors">
              <Mail size={11} />{siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-gray-100',
      )}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-saffron-500 to-saffron-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-hindi)' }}>ॐ</span>
              </div>
              {/* <div className="hidden sm:block leading-tight"> */}
              <div className="leading-tight">
                <p className="font-bold text-gray-900 text-base" style={{ fontFamily: 'var(--font-serif)' }}>
                  Mathura Vrindavan
                </p>
                <p className="text-saffron-500 text-xs font-semibold tracking-widest uppercase">Travel</p>
              </div>
            </Link>

            {/* Desktop nav items */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      pathname === item.href
                        ? 'text-saffron-600 bg-saffron-50'
                        : 'text-gray-700 hover:text-saffron-600 hover:bg-saffron-50',
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown size={13} className={cn(
                        'transition-transform duration-200 mt-px',
                        openDropdown === item.label && 'rotate-180',
                      )} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col px-4 py-3 hover:bg-saffron-50 transition-colors group"
                          >
                            <span className="text-sm font-medium text-gray-800 group-hover:text-saffron-600 transition-colors">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-xs text-gray-400 mt-0.5">{child.description}</span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right CTA */}
            <div className="flex items-center gap-2">
              <a href={`tel:${siteConfig.phone}`}
                className="hidden md:flex items-center gap-2 bg-saffron-50 text-saffron-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-saffron-100 transition-colors">
                <Phone size={14} />Call Now
              </a>
              <Link href="/booking"
                className="btn-primary text-sm px-5 py-2.5 hidden sm:inline-flex">
                Book Now
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white z-50 lg:hidden flex flex-col overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-saffron-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold" style={{ fontFamily: 'var(--font-hindi)' }}>ॐ</span>
                  </div>
                  <span className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
                    MVTravel
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 p-4 space-y-0.5">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(
                            mobileExpanded === item.label ? null : item.label
                          )}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 font-medium transition-colors text-sm"
                        >
                          {item.label}
                          <ChevronDown size={15} className={cn(
                            'transition-transform duration-200',
                            mobileExpanded === item.label && 'rotate-180',
                          )} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-3 border-l-2 border-saffron-100 mt-1 mb-1 space-y-0.5">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-saffron-600 hover:bg-saffron-50 transition-colors"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-colors',
                          pathname === item.href
                            ? 'bg-saffron-50 text-saffron-600'
                            : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-600',
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Drawer footer CTAs */}
              <div className="p-4 border-t border-gray-100 space-y-3 flex-shrink-0">
                <Link href="/booking" className="btn-primary w-full text-sm py-3">
                  Book a Tour
                </Link>
                <a href={`tel:${siteConfig.phone}`} className="btn-secondary w-full text-sm py-3">
                  <Phone size={15} />{siteConfig.phone}
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-colors"
                  style={{ background: '#dcfce7', color: '#16a34a' }}
                >
                  WhatsApp Chat
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}