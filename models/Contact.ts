import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IContactDoc extends Document {
  name: string
  phone: string
  email?: string
  message: string
  tourDate?: string
  passengers?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContactDoc>(
  {
    name:       { type: String, required: true, trim: true },
    phone:      { type: String, required: true, trim: true },
    email:      { type: String, lowercase: true, trim: true },
    message:    { type: String, required: true, trim: true },
    tourDate:   { type: String },
    passengers: { type: String },
    isRead:     { type: Boolean, default: false },
  },
  { timestamps: true },
)

ContactSchema.index({ isRead: 1 })
ContactSchema.index({ createdAt: -1 })

const Contact: Model<IContactDoc> =
  mongoose.models.Contact ?? mongoose.model<IContactDoc>('Contact', ContactSchema)

export default Contact