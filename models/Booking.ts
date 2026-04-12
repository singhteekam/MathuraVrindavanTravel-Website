import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'driver_assigned'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded'

export interface IBookingDoc extends Document {
  bookingId: string
  customer: Types.ObjectId
  package?: Types.ObjectId
  driver?: Types.ObjectId
  carType: string
  carName: string
  startDate: Date
  endDate: Date
  duration: number
  pickupLocation: string
  dropLocation?: string
  totalPassengers: number
  totalAmount: number
  advanceAmount: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentId?: string
  razorpayOrderId?: string
  addons: string[]
  specialRequests?: string
  adminNotes?: string
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBookingDoc>(
  {
    bookingId:       { type: String, required: true, unique: true },
    customer:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    package:         { type: Schema.Types.ObjectId, ref: 'Package' },
    driver:          { type: Schema.Types.ObjectId, ref: 'Driver' },
    carType:         { type: String, required: true },
    carName:         { type: String, required: true },
    startDate:       { type: Date, required: true },
    endDate:         { type: Date, required: true },
    duration:        { type: Number, required: true },
    pickupLocation:  { type: String, required: true },
    dropLocation:    { type: String },
    totalPassengers: { type: Number, required: true, default: 1 },
    totalAmount:     { type: Number, required: true },
    advanceAmount:   { type: Number, required: true },
    status: {
      type:    String,
      enum:    ['pending', 'confirmed', 'driver_assigned', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentId:      { type: String },
    razorpayOrderId:{ type: String },
    addons:         [{ type: String }],
    specialRequests:{ type: String },
    adminNotes:     { type: String },
    cancelReason:   { type: String },
  },
  { timestamps: true },
)

BookingSchema.index({ bookingId: 1 })
BookingSchema.index({ customer: 1 })
BookingSchema.index({ driver: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ startDate: 1 })
BookingSchema.index({ createdAt: -1 })

const Booking: Model<IBookingDoc> =
  mongoose.models.Booking ?? mongoose.model<IBookingDoc>('Booking', BookingSchema)

export default Booking