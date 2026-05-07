import mongoose from 'mongoose'

export interface IVisitor {
  _id:          mongoose.Types.ObjectId
  totalCount:   number          // all-time unique visitor count
  todayCount:   number          // today's unique visitors
  todayDate:    string          // YYYY-MM-DD — resets todayCount when date changes
  weeklyCount:  number          // rolling 7-day count
  monthlyCount: number          // rolling 30-day count
  lastUpdated:  Date
}

const VisitorSchema = new mongoose.Schema<IVisitor>({
  totalCount:   { type: Number, default: 0 },
  todayCount:   { type: Number, default: 0 },
  todayDate:    { type: String, default: '' },
  weeklyCount:  { type: Number, default: 0 },
  monthlyCount: { type: Number, default: 0 },
  lastUpdated:  { type: Date,   default: Date.now },
}, { timestamps: false })

export default mongoose.models.Visitor ?? mongoose.model<IVisitor>('Visitor', VisitorSchema)