'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CalendarCheck, Car, MapPin, Package,
  Users, Star, Mail, BarChart2, Settings,
  ChevronLeft, ChevronRight, LogOut, Menu,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin',           icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
  { href: '/admin/bookings',  icon: <CalendarCheck   size={18} />, label: 'Bookings'    },
  { href: '/admin/drivers',   icon: <Car             size={18} />, label: 'Drivers'     },
  { href: '/admin/packages',  icon: <Package         size={18} />, label: 'Packages'    },
  { href: '/admin/places',    icon: <MapPin          size={18} />, label: 'Places'      },
  { href: '/admin/customers', icon: <Users           size={18} />, label: 'Customers'   },
  { href: '/admin/reviews',   icon: <Star            size={18} />, label: 'Reviews'     },
  { href: '/admin/enquiries', icon: <Mail            size={18} />, label: 'Enquiries'   },
  { href: '/admin/analytics', icon: <BarChart2       size={18} />, label: 'Analytics'   },
  { href: '/admin/settings',  icon: <Settings        size={18} />, label: 'Settings'    },
]

export default function AdminSidebarWrapper() {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="w-9 h-9 bg-saffron-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold" style={{ fontFamily: 'var(--font-hindi)' }}>ॐ</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">MVTravel</p>
            <p className="text-gray-400 text-xs whitespace-nowrap">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(item.href)
                ? 'bg-saffron-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/10',
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom: sign out */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col flex-shrink-0 relative"
        style={{ background: '#111827', minHeight: '100vh' }}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10"
          style={{ background: '#1f2937', border: '1px solid #374151', color: '#9ca3af' }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile: top bar + drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 shadow-md"
        style={{ background: '#111827' }}>
        <button onClick={() => setMobileOpen(true)} className="text-white">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-saffron-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-hindi)' }}>ॐ</span>
          </div>
          <span className="text-white font-bold text-sm">MVTravel Admin</span>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden"
              style={{ background: '#111827' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}