export interface IUser {
  _id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'driver' | 'admin'
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface IDriver {
  _id: string
  userId: string
  name: string
  phone: string
  email: string
  avatar?: string
  vehicle: {
    type: string
    name: string
    number: string
    color: string
    image?: string
  }
  licenseNumber: string
  isAvailable: boolean
  isVerified: boolean
  totalTrips: number
  rating: number
  earnings: number
  createdAt: string
}

export interface IPlaceSection {
  type: 'rich_text' | 'highlights' | 'travel_tips' | 'distances' | 'faq'
  title: string
  content?: string
  items?: Array<
    | string
    | { from?: string; distance?: string; time?: string }
    | { question?: string; answer?: string }
  >
}

export interface IPlace {
  _id: string
  name: string
  slug: string
  city: string
  type: string
  shortDescription: string
  description: string
  thumbnail: string
  images: string[]
  location: {
    address: string
    lat: number
    lng: number
    distanceFromMathura?: string
  }
  timings?: { morning?: string; evening?: string; closed?: string }
  entryFee?: string
  timeRequired?: string
  isFeatured: boolean
  tags: string[]
  sections: IPlaceSection[]
  createdAt: string
}

export interface IPackageDay {
  day: number
  title: string
  places: string[]
  description: string
}

export interface IPackagePricing {
  carType: string
  carName: string
  price: number
}

export interface IPackage {
  _id: string
  name: string
  slug: string
  duration: number
  nights: number
  cities: string[]
  thumbnail: string
  images: string[]
  shortDescription: string
  highlights: string[]
  itinerary: IPackageDay[]
  inclusions: string[]
  exclusions: string[]
  pricing: IPackagePricing[]
  basePrice: number
  isActive: boolean
  isFeatured: boolean
  isPopular: boolean
  rating: number
  totalReviews: number
  totalBookings: number
  createdAt: string
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'driver_assigned'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export interface IBooking {
  _id: string
  bookingId: string
  customer: IUser | string
  package?: IPackage | string
  driver?: IDriver | string
  carType: string
  carName: string
  startDate: string
  endDate: string
  pickupLocation: string
  dropLocation?: string
  totalPassengers: number
  totalAmount: number
  advanceAmount: number
  status: BookingStatus
  addons: string[]
  specialRequests?: string
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded'
  paymentId?: string
  createdAt: string
}

export interface IHotel {
  _id: string
  name: string
  slug: string
  city: string
  address: string
  thumbnail: string
  images: string[]
  description: string
  priceRange: { min: number; max: number }
  rating: number
  amenities: string[]
  contactPhone?: string
  bookingUrl?: string
  isFeatured: boolean
  createdAt: string
}

export interface IRestaurant {
  _id: string
  name: string
  slug: string
  city: string
  address: string
  thumbnail: string
  cuisine: string[]
  priceRange: 'budget' | 'mid-range' | 'premium'
  rating: number
  isVegOnly: boolean
  timings: string
  isFeatured: boolean
  createdAt: string
}

export interface IReview {
  _id: string
  customer: IUser | string
  booking: IBooking | string
  rating: number
  title: string
  comment: string
  images?: string[]
  isApproved: boolean
  createdAt: string
}

export interface IBlog {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  author: string
  tags: string[]
  isPublished: boolean
  publishedAt: string
  readTime: number
  createdAt: string
}

export interface IContact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  tourDate?: string
  isRead: boolean
  createdAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}