import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // ── Check for token-level errors ────────────────────────────
    // Catches: account deactivated by admin, server-side inactivity expiry
    if (token?.error === 'AccountDeactivated') {
      return NextResponse.redirect(new URL('/login?error=account_disabled', req.url))
    }
    if (token?.error === 'SessionExpiredInactivity') {
      return NextResponse.redirect(new URL('/login?reason=inactivity', req.url))
    }

    // ── Role-based route guards ─────────────────────────────────
    if (pathname.startsWith('/superadmin')) {
      if (token?.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
      }
    }

    if (pathname.startsWith('/admin')) {
      // Both admin and superadmin can access admin panel
      if (token?.role !== 'admin' && token?.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
      }

      // Places and Settings are superadmin-only — block admin access at proxy level
      // Only /admin/places is fully superadmin-only.
      // /admin/settings is allowed for admin (limited view — booking config only).
      const saOnlyPaths = ['/admin/places']
      if (saOnlyPaths.some((p) => pathname.startsWith(p))) {
        if (token?.role !== 'superadmin') {
          return NextResponse.redirect(new URL('/admin', req.url))
        }
      }
    }

    if (pathname.startsWith('/driver')) {
      if (token?.role !== 'driver') {
        return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
      }
    }

    if (pathname.startsWith('/customer')) {
      // Any authenticated user can access /customer
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      /**
       * `authorized` runs BEFORE the middleware function above.
       * Return false to redirect to signIn page immediately.
       * We allow the request through here and do fine-grained
       * role checks in the middleware function above.
       */
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // All protected routes require a valid token
        if (
          pathname.startsWith('/admin')      ||
          pathname.startsWith('/superadmin') ||
          pathname.startsWith('/driver')     ||
          pathname.startsWith('/customer')
        ) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/superadmin/:path*',
    '/driver/:path*',
    '/customer/:path*',
  ],
}