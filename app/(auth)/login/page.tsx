'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/'
  const errorParam   = searchParams.get('error')

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter email and password.'); return }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email:    email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password. Please try again.')
      } else {
        toast.success('Welcome back! 🙏')
        // Redirect based on role stored in session
        // We use the callbackUrl or default based on role
        if (callbackUrl && callbackUrl !== '/') {
          router.push(callbackUrl)
        } else {
          // Fetch session to determine role
          const sessionRes = await fetch('/api/auth/session')
          const session    = await sessionRes.json()
          const role       = session?.user?.role ?? 'customer'
          if (role === 'admin')  router.push('/admin')
          else if (role === 'driver') router.push('/driver')
          else router.push('/customer')
        }
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Link href="/" className="inline-flex flex-col items-center gap-2">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ff7d0f, #c74a06)' }}
          >
            <span className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-hindi)' }}>ॐ</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'var(--font-serif)' }}>
              Mathura Vrindavan Travel
            </p>
            <p className="text-saffron-500 text-xs font-semibold tracking-widest uppercase">Admin / Driver Login</p>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card rounded-3xl p-7 sm:p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

        {/* Error banner */}
        {errorParam === 'unauthorized' && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm"
            style={{ background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3' }}>
            <AlertCircle size={16} className="flex-shrink-0" />
            You don&apos;t have permission to access that page.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@mathuravrindavantravel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base mt-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Customer?{' '}
            <Link href="/" className="font-semibold hover:underline" style={{ color: '#ff7d0f' }}>
              Go to main site
            </Link>
          </p>
        </div>
      </motion.div>

      <p className="text-center text-xs text-gray-400 mt-6">
        New customer account?{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: '#ff7d0f' }}>
          Create one here
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
    }>
      <LoginForm />
    </Suspense>
  )
}