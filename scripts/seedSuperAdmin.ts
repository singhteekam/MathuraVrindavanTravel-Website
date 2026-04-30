/**
 * scripts/seedSuperAdmin.ts
 *
 * Creates the first superadmin account in MongoDB.
 * Run ONCE after deploying:
 *
 *   npx tsx scripts/seedSuperAdmin.ts
 *
 * Then set SUPERADMIN_SECRET_KEY in Vercel env vars.
 * Login at /login → Superadmin tab with email + password + secret key.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI ?? ''
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set in .env.local')
  process.exit(1)
}

// ─── Superadmin credentials — change before running ─────────────────────────
const SUPERADMIN = {
  name:     'Super Admin',
  email:    'superadmin@mathuravrindavandhamyatra.com',  // ← change this
  phone:    '+91 9999999999',                          // ← change this
  password: 'SuperSecure@2025',                        // ← change this (use a strong password)
  role:     'superadmin' as const,
  isActive: true,
}
// ─────────────────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  phone:    String,
  password: String,
  role:     { type: String, enum: ['customer', 'driver', 'admin', 'superadmin'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  avatar:   String,
}, { timestamps: true })

async function seed() {
  console.log('🔗  Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected\n')

  const User = mongoose.models.User ?? mongoose.model('User', UserSchema)

  // Check if already exists
  const existing = await User.findOne({ email: SUPERADMIN.email })
  if (existing) {
    if (existing.role === 'superadmin') {
      console.log(`✓  Superadmin already exists: ${SUPERADMIN.email}`)
      console.log('   To reset password, delete the user and re-run this script.')
    } else {
      // Upgrade existing user to superadmin
      const hashed = await bcrypt.hash(SUPERADMIN.password, 12)
      await User.findOneAndUpdate(
        { email: SUPERADMIN.email },
        { $set: { role: 'superadmin', password: hashed, isActive: true } },
      )
      console.log(`↻  Upgraded existing user to superadmin: ${SUPERADMIN.email}`)
    }
  } else {
    const hashed = await bcrypt.hash(SUPERADMIN.password, 12)
    await User.create({ ...SUPERADMIN, password: hashed })
    console.log(`✓  Superadmin created: ${SUPERADMIN.email}`)
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Superadmin account ready!

  Email:    ${SUPERADMIN.email}
  Password: ${SUPERADMIN.password}

Next steps:
  1. Set SUPERADMIN_SECRET_KEY in Vercel env vars
     (any strong random string, e.g. openssl rand -base64 32)

  2. Login at: /login → "Superadmin" tab
     → Enter email, password, AND your secret key

  3. Delete this script's plaintext password after setup!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

  await mongoose.disconnect()
  console.log('🔌  Disconnected.')
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})