import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// POST /api/upload — admin only, upload image to Cloudinary
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user    = session?.user as { role?: string } | undefined
    if (user?.role !== 'admin') return errorResponse('Forbidden.', 403)

    const cloudName  = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey     = process.env.CLOUDINARY_API_KEY
    const apiSecret  = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return errorResponse('Image upload not configured.', 503)
    }

    const formData = await req.formData()
    const file     = formData.get('file') as File | null
    const folder   = (formData.get('folder') as string) ?? 'mathura-vrindavan'

    if (!file) return errorResponse('No file provided.')

    // Lazy import + configure inside handler — never runs at build time
    const cloudinary = (await import('cloudinary')).v2
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

    // Convert File to base64
    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
      ],
    })

    return successResponse({
      url:      result.secure_url,
      publicId: result.public_id,
      width:    result.width,
      height:   result.height,
    }, 201)
  } catch (err) {
    console.error('[POST /api/upload]', err)
    return errorResponse('Upload failed.', 500)
  }
}
