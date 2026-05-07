import { NextRequest }  from 'next/server'
import { connectDB }    from '@/lib/db'
import Visitor          from '@/models/Visitor'
import { successResponse, errorResponse } from '@/lib/apiResponse'

// Today's date string — YYYY-MM-DD (IST)
function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  })
}

// GET /api/visitors — returns current counts (public, cached 5 min)
export async function GET() {
  try {
    await connectDB()

    // Get or create the single counter document
    let visitor = await Visitor.findOne()
    if (!visitor) {
      visitor = await Visitor.create({
        totalCount:   0,
        todayCount:   0,
        todayDate:    todayIST(),
        weeklyCount:  0,
        monthlyCount: 0,
      })
    }

    return successResponse({
      total:   visitor.totalCount,
      today:   visitor.todayCount,
      weekly:  visitor.weeklyCount,
      monthly: visitor.monthlyCount,
    })
  } catch (err) {
    console.error('[GET /api/visitors]', err)
    return errorResponse('Internal server error.', 500)
  }
}

// POST /api/visitors — called once per unique visitor session
// Client tracks uniqueness via localStorage (visitorId + date)
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body     = await req.json().catch(() => ({}))
    const isNew    = body.isNew === true   // only true on genuinely new visitors

    if (!isNew) {
      // Not a new visit — just return current counts without incrementing
      const visitor = await Visitor.findOne()
      return successResponse({
        total:   visitor?.totalCount  ?? 0,
        today:   visitor?.todayCount  ?? 0,
        weekly:  visitor?.weeklyCount ?? 0,
        monthly: visitor?.monthlyCount?? 0,
      })
    }

    const today    = todayIST()
    let visitor    = await Visitor.findOne()

    if (!visitor) {
      // First ever visitor — create document
      visitor = await Visitor.create({
        totalCount:   1,
        todayCount:   1,
        todayDate:    today,
        weeklyCount:  1,
        monthlyCount: 1,
        lastUpdated:  new Date(),
      })
    } else {
      // Check if the date rolled over — reset daily counter
      const isNewDay = visitor.todayDate !== today

      await Visitor.findByIdAndUpdate(visitor._id, {
        $inc: {
          totalCount:   1,
          todayCount:   isNewDay ? 0 : 1,   // reset below if new day
          weeklyCount:  1,
          monthlyCount: 1,
        },
        ...(isNewDay && {
          $set: {
            todayCount:  1,
            todayDate:   today,
          },
        }),
        lastUpdated: new Date(),
      })

      // Re-fetch for accurate response
      visitor = await Visitor.findById(visitor._id)
    }

    return successResponse({
      total:   visitor!.totalCount,
      today:   visitor!.todayCount,
      weekly:  visitor!.weeklyCount,
      monthly: visitor!.monthlyCount,
    })
  } catch (err) {
    console.error('[POST /api/visitors]', err)
    return errorResponse('Internal server error.', 500)
  }
}