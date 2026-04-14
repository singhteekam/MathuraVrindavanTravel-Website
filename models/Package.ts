import mongoose, { Schema, Document, Model } from 'mongoose'

interface IItineraryDay {
  day: number
  title: string
  description: string
  places: string[]
}

interface IPricing {
  carType: string
  carName: string
  price: number
}

export interface IPackageDoc extends Document {
  name: string
  slug: string
  duration: number
  nights: number
  cities: string[]
  thumbnail: string
  images: string[]
  shortDescription: string
  highlights: string[]
  itinerary: IItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  pricing: IPricing[]
  basePrice: number
  isActive: boolean
  isFeatured: boolean
  isPopular: boolean
  rating: number
  totalReviews: number
  totalBookings: number
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackageDoc>(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, lowercase: true, trim: true },
    duration:         { type: Number, required: true },
    nights:           { type: Number, required: true, default: 0 },
    cities:           [{ type: String, trim: true }],
    thumbnail:        { type: String, default: '' },
    images:           [{ type: String }],
    shortDescription: { type: String, required: true },
    highlights:       [{ type: String }],
    itinerary: [
      {
        day:         { type: Number, required: true },
        title:       { type: String, required: true },
        description: { type: String, required: true },
        places:      [{ type: String }],
      },
    ],
    inclusions:    [{ type: String }],
    exclusions:    [{ type: String }],
    pricing: [
      {
        carType: { type: String, required: true },
        carName: { type: String, required: true },
        price:   { type: Number, required: true },
      },
    ],
    basePrice:     { type: Number, required: true },
    isActive:      { type: Boolean, default: true },
    isFeatured:    { type: Boolean, default: false },
    isPopular:     { type: Boolean, default: false },
    rating:        { type: Number, default: 5.0 },
    totalReviews:  { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true },
)

PackageSchema.index({ slug: 1 })
PackageSchema.index({ isActive: 1 })
PackageSchema.index({ isFeatured: 1 })
PackageSchema.index({ duration: 1 })

const Package: Model<IPackageDoc> =
  mongoose.models.Package ?? mongoose.model<IPackageDoc>('Package', PackageSchema)

export default Package
