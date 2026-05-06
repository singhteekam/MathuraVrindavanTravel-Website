import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse, NextRequest }     from 'next/server'
import { getToken }                      from 'next-auth/jwt'

// ─── Routes that bypass maintenance mode ─────────────────────────────────────
// Admin and superadmin can still access the site during maintenance.
// /api routes must stay live so admin can log in and toggle maintenance off.
const MAINTENANCE_BYPASS_PREFIXES = [
  '/maintenance',
  '/admin',
  '/superadmin',
  '/login',
  '/api',
  '/_next',
  '/favicon',
  '/images',
]

// ─── Main middleware ──────────────────────────────────────────────────────────
// We export a custom function instead of withAuth directly so we can run the
// maintenance check BEFORE next-auth's auth logic.
export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // ── 1. Maintenance mode check ─────────────────────────────────────────────
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  if (isMaintenanceMode) {
    const isBypassed = MAINTENANCE_BYPASS_PREFIXES.some((p) => pathname.startsWith(p))

    if (!isBypassed) {
      // Admins and superadmins can bypass via their JWT role
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      const role  = token?.role as string | undefined

      if (role !== 'admin' && role !== 'superadmin') {
        // Redirect public users to maintenance page
        return NextResponse.redirect(new URL('/maintenance', req.url))
      }
    }
  }

  // ── 2. Auth / role guards (only for protected routes) ────────────────────
  const isProtected =
    pathname.startsWith('/admin')      ||
    pathname.startsWith('/superadmin') ||
    pathname.startsWith('/driver')     ||
    pathname.startsWith('/customer')

  if (!isProtected) return NextResponse.next()

  // Delegate to withAuth for protected routes
  return withAuth(
    function authMiddleware(req: NextRequestWithAuth) {
      const token     = req.nextauth.token
      const pathname  = req.nextUrl.pathname

      // ── Token-level error checks ──────────────────────────────────────────
      if (token?.error === 'AccountDeactivated') {
        return NextResponse.redirect(new URL('/login?error=account_disabled', req.url))
      }
      if (token?.error === 'SessionExpiredInactivity') {
        return NextResponse.redirect(new URL('/login?reason=inactivity', req.url))
      }

      // ── Superadmin routes ─────────────────────────────────────────────────
      if (pathname.startsWith('/superadmin')) {
        if (token?.role !== 'superadmin') {
          return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
        }
      }

      // ── Admin routes ──────────────────────────────────────────────────────
      if (pathname.startsWith('/admin')) {
        if (token?.role !== 'admin' && token?.role !== 'superadmin') {
          return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
        }
        // /admin/places is superadmin-only
        if (pathname.startsWith('/admin/places') && token?.role !== 'superadmin') {
          return NextResponse.redirect(new URL('/admin', req.url))
        }
      }

      // ── Driver routes ─────────────────────────────────────────────────────
      if (pathname.startsWith('/driver')) {
        if (token?.role !== 'driver') {
          return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
        }
      }

      // ── Customer routes ───────────────────────────────────────────────────
      if (pathname.startsWith('/customer')) {
        if (!token) {
          return NextResponse.redirect(new URL('/login', req.url))
        }
      }

      return NextResponse.next()
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          const p = req.nextUrl.pathname
          if (
            p.startsWith('/admin')      ||
            p.startsWith('/superadmin') ||
            p.startsWith('/driver')     ||
            p.startsWith('/customer')
          ) {
            return !!token
          }
          return true
        },
      },
    },
  )(req as NextRequestWithAuth, {} as never)
}

// ─── Matcher — includes ALL routes so maintenance mode can intercept public pages
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static (static files)
     *   - _next/image (image optimisation)
     *   - favicon.ico
     *   - public image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
}