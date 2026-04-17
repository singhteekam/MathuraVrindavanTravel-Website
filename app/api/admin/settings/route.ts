import { NextRequest }    from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }     from '@/lib/auth'
import { connectDB }       from '@/lib/db'
import mongoose            from 'mongoose'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// ─── Inline schema for site settings ────────────────────────────────────────
// Stored as a single "singleton" document in the settings collection.
const SettingsSchema = new mongoose.Schema({
  key:           { type: String, default: 'site', unique: true },
  siteInfo:      { type: mongoose.Schema.Types.Mixed, default: {} },
  emailConfig:   { type: mongoose.Schema.Types.Mixed, default: {} },
  bookingConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

function getSettingsModel() {
  return mongoose.models.Settings ?? mongoose.model('Settings', SettingsSchema)
}

// GET /api/admin/settings — load current settings
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    await connectDB()
    const Settings = getSettingsModel()
    const settings = await Settings.findOne({ key: 'site' }).lean()
    return successResponse(settings ?? {})
  } catch (err) {
    console.error('[GET /api/admin/settings]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// POST /api/admin/settings — save settings
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    const body = await req.json()
    const { siteInfo, emailConfig, bookingConfig } = body

    await connectDB()
    const Settings = getSettingsModel()

    // Upsert the singleton settings document
    const settings = await Settings.findOneAndUpdate(
      { key: 'site' },
      {
        $set: {
          key: 'site',
          siteInfo:      siteInfo      ?? {},
          // Never persist raw passwords in DB — only save non-sensitive parts
          emailConfig:   {
            smtpHost: emailConfig?.smtpHost ?? '',
            smtpPort: emailConfig?.smtpPort ?? '587',
            // smtpUser and smtpPass stay in Vercel env vars — not stored in DB
          },
          bookingConfig: bookingConfig ?? {},
        },
      },
      { upsert: true, new: true },
    )

    return successResponse({ message: 'Settings saved.', settings })
  } catch (err) {
    console.error('[POST /api/admin/settings]', err)
    return errorResponse('Internal server error.', 500)
  }
}