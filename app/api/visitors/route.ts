import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import Visitor from '@/models/Visitor'
import { successResponse, errorResponse } from '@/lib/apiResponse'

function getPeriodKeysIST() {
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  })
  const [year, month, day] = today.split('-').map(Number)
  const dateOnly = new Date(Date.UTC(year, month - 1, day))
  const daysSinceMonday = (dateOnly.getUTCDay() + 6) % 7
  dateOnly.setUTCDate(dateOnly.getUTCDate() - daysSinceMonday)

  return {
    today,
    weekKey: dateOnly.toISOString().slice(0, 10),
    monthKey: today.slice(0, 7),
  }
}

function visitorCounts(visitor: {
  totalCount: number
  todayCount: number
  weeklyCount: number
  monthlyCount: number
}) {
  return {
    total: visitor.totalCount,
    today: visitor.todayCount,
    weekly: visitor.weeklyCount,
    monthly: visitor.monthlyCount,
  }
}

async function getCurrentVisitorCounter() {
  const periods = getPeriodKeysIST()
  let visitor = await Visitor.findOne()

  if (!visitor) {
    return Visitor.create({
      totalCount: 0,
      todayCount: 0,
      todayDate: periods.today,
      weekKey: periods.weekKey,
      monthKey: periods.monthKey,
      weeklyCount: 0,
      monthlyCount: 0,
      lastUpdated: new Date(),
    })
  }

  const resetFields: Record<string, string | number> = {}

  if (visitor.todayDate !== periods.today) {
    resetFields.todayCount = 0
    resetFields.todayDate = periods.today
  }

  if (visitor.weekKey !== periods.weekKey) {
    resetFields.weeklyCount = 0
    resetFields.weekKey = periods.weekKey
  }

  if (visitor.monthKey !== periods.monthKey) {
    resetFields.monthlyCount = 0
    resetFields.monthKey = periods.monthKey
  }

  if (Object.keys(resetFields).length > 0) {
    visitor = await Visitor.findByIdAndUpdate(
      visitor._id,
      { $set: resetFields },
      { new: true },
    ) ?? visitor
  }

  return visitor
}

export async function GET() {
  try {
    await connectDB()

    const visitor = await getCurrentVisitorCounter()

    return successResponse(visitorCounts(visitor))
  } catch (err) {
    console.error('[GET /api/visitors]', err)
    return errorResponse('Internal server error.', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json().catch(() => ({}))
    const isNew = body.isNew === true
    const visitor = await getCurrentVisitorCounter()

    if (!isNew) {
      return successResponse(visitorCounts(visitor))
    }

    const periods = getPeriodKeysIST()
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      visitor._id,
      {
        $inc: {
          totalCount: 1,
          todayCount: 1,
          weeklyCount: 1,
          monthlyCount: 1,
        },
        $set: {
          todayDate: periods.today,
          weekKey: periods.weekKey,
          monthKey: periods.monthKey,
          lastUpdated: new Date(),
        },
      },
      { new: true },
    )

    return successResponse(visitorCounts(updatedVisitor ?? visitor))
  } catch (err) {
    console.error('[POST /api/visitors]', err)
    return errorResponse('Internal server error.', 500)
  }
}
