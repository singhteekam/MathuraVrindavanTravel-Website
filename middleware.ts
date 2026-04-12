import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin routes — must be admin role
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }

    // Driver routes — must be driver role
    if (pathname.startsWith('/driver') && token?.role !== 'driver') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }

    // Customer routes — any logged-in user
    if (pathname.startsWith('/customer') && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Only run middleware when the user has a session token
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/driver/:path*',
    '/customer/:path*',
  ],
}