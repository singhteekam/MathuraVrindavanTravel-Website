import mongoose, { Schema, Document, Model } from 'mongoose'

interface ISection {
  type: 'rich_text' | 'highlights' | 'travel_tips' | 'distances' | 'faq'
  title: string
  content?: string
  items?: mongoose.Types.Mixed[]
}

export interface IPlaceDoc extends Document {
  name: string
  slug: string
  city: string
  type: string
  shortDescription: string
  description?: string
  thumbnail: string
  images: string[]
  location: {
    address: string
    lat: number
    lng: number
    distanceFromMathura?: string
  }
  timings?: {
    morning?: string
    evening?: string
    note?: string
  }
  entryFee?: string
  timeRequired?: string
  isFeatured: boolean
  tags: string[]
  sections: ISection[]
  createdAt: Date
  updatedAt: Date
}

const PlaceSchema = new Schema<IPlaceDoc>(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    city:             { type: String, required: true, trim: true },
    type:             { type: String, required: true },
    shortDescription: { type: String, required: true },
    description:      { type: String },
    thumbnail:        { type: String, default: '' },
    images:           [{ type: String }],
    location: {
      address:             { type: String, required: true },
      lat:                 { type: Number, required: true },
      lng:                 { type: Number, required: true },
      distanceFromMathura: { type: String },
    },
    timings: {
      morning: { type: String },
      evening: { type: String },
      note:    { type: String },
    },
    entryFee:     { type: String },
    timeRequired: { type: String },
    isFeatured:   { type: Boolean, default: false },
    tags:         [{ type: String }],
    sections: [
      {
        type:    { type: String, enum: ['rich_text', 'highlights', 'travel_tips', 'distances', 'faq'] },
        title:   { type: String },
        content: { type: String },
        items:   [{ type: Schema.Types.Mixed }],
      },
    ],
  },
  { timestamps: true },
)

PlaceSchema.index({ slug: 1 })
PlaceSchema.index({ city: 1 })
PlaceSchema.index({ type: 1 })
PlaceSchema.index({ isFeatured: 1 })
PlaceSchema.index({ tags: 1 })

const Place: Model<IPlaceDoc> =
  mongoose.models.Place ?? mongoose.model<IPlaceDoc>('Place', PlaceSchema)

export default Place