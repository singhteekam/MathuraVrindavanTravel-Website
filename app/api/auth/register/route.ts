import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/apiResponse'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !phone || !password) {
      return errorResponse('All fields are required.')
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters.')
    }

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return errorResponse('An account with this email already exists.', 409)
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role:     'customer',
    })

    return successResponse(
      {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
        phone: user.phone,
        role:  user.role,
      },
      201,
    )
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return errorResponse('Internal server error.', 500)
  }
}