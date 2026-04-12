import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Driver from '@/models/Driver'
import { successResponse, errorResponse } from '@/lib/apiResponse'

interface Params {
  params: Promise<{ driverId: string }>
}

// GET /api/drivers/[driverId]/trips
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { id?: string; role?: string } | undefined
    if (!user) return errorResponse('Unauthorized.', 401)

    const { driverId } = await params
    await connectDB()

    // Verify the requesting user is the driver or admin
    const driver = await Driver.findById(driverId).lean()
    if (!driver) return errorResponse('Driver not found.', 404)

    const isOwnProfile = driver.userId.toString() === user.id
    if (!isOwnProfile && user.role !== 'admin') {
      return errorResponse('Forbidden.', 403)
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const filter: Record<string, unknown> = { driver: driverId }
    if (status) filter.status = status

    const trips = await Booking.find(filter)
      .sort({ startDate: 1 })
      .populate('customer', 'name phone')
      .populate('package',  'name cities')
      .lean()

    return successResponse(trips)
  } catch (err) {
    console.error('[GET /api/drivers/:id/trips]', err)
    return errorResponse('Internal server error.', 500)
  }
}