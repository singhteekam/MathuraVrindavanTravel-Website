import { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import UserModel from '@/models/User'

// Token lifetime constants
const ACCESS_TOKEN_MAX_AGE  = 60 * 60 * 8          // 8 hours  (re-validate on every request)
const SESSION_MAX_AGE       = 60 * 60 * 24 * 7     // 7 days   (JWT cookie lifetime)
const TOKEN_REFRESH_BUFFER  = 60 * 60              // Refresh token if < 1 hr left
const SERVER_INACTIVITY_TTL = 60 * 60 * 24         // Server-side: expire after 24 hrs of no API call
                                                   // Client-side: InactivityWatcher fires at 30 min

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:     { label: 'Email',      type: 'email'    },
        password:  { label: 'Password',   type: 'password' },
        secretKey: { label: 'Secret Key', type: 'password' },  // superadmin only
      },

      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null

        try {
          await connectDB()

          const user = await UserModel
            .findOne({ email: credentials.email.toLowerCase().trim() })
            .select('+password')
            .lean()

          if (!user)          return null
          if (!user.password) return null
          if (!user.isActive) return null   // Account disabled by admin

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null

          // Superadmin requires an additional secret key
          if (user.role === 'superadmin') {
            const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET_KEY ?? ''
            if (!SUPERADMIN_SECRET) {
              console.error('[Auth] SUPERADMIN_SECRET_KEY env var not set')
              return null
            }
            if (credentials.secretKey !== SUPERADMIN_SECRET) {
              console.warn('[Auth] Invalid superadmin secret key attempt:', credentials.email)
              return null
            }
          }

          // Return the minimal user object stored in the JWT
          return {
            id:    user._id.toString(),
            name:  user.name,
            email: user.email,
            role:  user.role,
            image: user.avatar ?? null,
          } as NextAuthUser & { role: string }
        } catch (err) {
          console.error('[Auth] authorize error:', err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback — runs on every token creation AND every session check.
     * We store role + expiry in the JWT so middleware can validate without
     * hitting the database on every request.
     */
    async jwt({ token, user, trigger }) {
      const now = Math.floor(Date.now() / 1000)

      // First sign-in — populate token from user object
      if (user) {
        const u = user as NextAuthUser & { role?: string }
        token.id          = u.id
        token.role        = u.role ?? 'customer'
        token.issuedAt    = now
        token.lastActive  = now                         // track last activity
        token.accessExp   = now + ACCESS_TOKEN_MAX_AGE
        return token
      }

      // ── Server-side inactivity check ─────────────────────────────────────
      // If the JWT hasn't been touched for SERVER_INACTIVITY_TTL, force logout.
      // The client-side InactivityWatcher catches short inactivity (30 min).
      // This catches cases like: browser closed without logging out for 24+ hrs.
      const lastActive = token.lastActive as number | undefined
      if (lastActive && now - lastActive > SERVER_INACTIVITY_TTL) {
        console.info('[Auth] Server-side inactivity logout — user:', token.id)
        return { ...token, error: 'SessionExpiredInactivity' }
      }

      // Update lastActive on every token check (proves the session is being used)
      token.lastActive = now

      // Subsequent requests — check if access token has expired
      const accessExp = token.accessExp as number | undefined

      // Token still valid — return as-is
      if (accessExp && now < accessExp - TOKEN_REFRESH_BUFFER) {
        return token
      }

      // Access token near expiry or expired — re-validate user from DB
      // This is the "silent refresh" — user stays logged in, but we verify
      // they are still active in the database
      if (trigger !== 'signIn') {
        try {
          await connectDB()
          const dbUser = await UserModel
            .findById(token.id as string)
            .select('isActive role name email')
            .lean()

          // User deactivated by admin — invalidate session
          if (!dbUser || !dbUser.isActive) {
            return { ...token, error: 'AccountDeactivated' }
          }

          // Refresh the access token window + pick up any role changes
          token.role      = dbUser.role
          token.accessExp = now + ACCESS_TOKEN_MAX_AGE
        } catch (err) {
          console.error('[Auth] jwt refresh error:', err)
          // On DB error keep token alive — don't log out user on infra issue
        }
      }

      return token
    },

    /**
     * Session callback — shapes what is available to the client via useSession().
     * Only include what the client actually needs — no sensitive data.
     */
    async session({ session, token }) {
      // If token has an error (deactivated, inactivity) attach it to session
      // The client reads session.error to redirect to login
      if (token.error) {
        (session as typeof session & { error?: string }).error = token.error as string
      }

      if (token && session.user) {
        const u = session.user as typeof session.user & {
          id?:   string
          role?: string
        }
        u.id   = token.id   as string
        u.role = token.role as string
      }

      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge:   SESSION_MAX_AGE,
    // Update session cookie expiry on every activity
    updateAge: 60 * 60 * 24,   // Extend every 24 hrs of activity
  },

  jwt: {
    maxAge: SESSION_MAX_AGE,
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Useful in development
  debug: process.env.NODE_ENV === 'development',
}