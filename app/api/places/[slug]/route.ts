import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Place from '@/models/Place'
import { successResponse, errorResponse } from '@/lib/apiResponse'

interface Params {
  params: Promise<{ slug: string }>
}

// GET /api/places/[slug] — full detail with sections, public
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    await connectDB()

    const place = await Place.findOne({ slug }).lean()
    if (!place) return errorResponse('Place not found.', 404)

    return successResponse(place)
  } catch (err) {
    console.error('[GET /api/places/:slug]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// PUT /api/places/[slug] — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    const { slug } = await params
    const body     = await req.json()

    await connectDB()

    const place = await Place.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true },
    )

    if (!place) return errorResponse('Place not found.', 404)
    return successResponse(place)
  } catch (err) {
    console.error('[PUT /api/places/:slug]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// DELETE /api/places/[slug] — admin only, hard delete
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    const { slug } = await params
    await connectDB()

    const place = await Place.findOneAndDelete({ slug })
    if (!place) return errorResponse('Place not found.', 404)

    return successResponse({ message: 'Place deleted successfully.' })
  } catch (err) {
    console.error('[DELETE /api/places/:slug]', err)
    return errorResponse('Internal server error.', 500)
  }
}