export interface PackagePricing {
  carType: string
  carName: string
  price:   number
}

export interface PackageData {
  slug:             string
  name:             string
  duration:         number
  nights:           number
  cities:           string[]
  basePrice:        number
  rating:           number
  totalReviews:     number
  isPopular:        boolean
  isFeatured:       boolean  // controls homepage display
  isActive:         boolean  // controls visibility on site
  thumbnail?:       string   // /images/packages/{slug}.jpg
  highlights:       string[]
  shortDescription: string
  pricing?:         PackagePricing[]
}

export const ALL_PACKAGES: PackageData[] = [
  {
    slug: 'same-day-mathura-vrindavan',
    thumbnail: '/images/packages/same-day-mathura-vrindavan.jpg',
    name: 'Same Day Mathura Vrindavan Tour',
    duration: 1, nights: 0,
    cities: ['Mathura', 'Vrindavan'],
    basePrice: 2000, rating: 4.8, totalReviews: 312,
    isPopular: true, isFeatured: true, isActive: true,
    highlights: [
      'Krishna Janmabhoomi & Dwarkadhish Temple',
      'Banke Bihari & ISKCON Temple',
      'Vishram Ghat & Prem Mandir',
    ],
    shortDescription: 'Complete Mathura and Vrindavan darshan in a single day — ideal for pilgrims on a tight schedule.',
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 2000 },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 2500 },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 3000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 4500 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 5500 },
    ],
  },
  {
    slug: '2-days-mathura-vrindavan',
    thumbnail: '/images/packages/2-days-mathura-vrindavan.jpg',
    name: '2 Days Mathura Vrindavan Darshan',
    duration: 2, nights: 1,
    cities: ['Mathura', 'Vrindavan'],
    basePrice: 3500, rating: 4.9, totalReviews: 251,
    isPopular: true, isFeatured: true, isActive: true,
    highlights: [
      'Complete Mathura darshan on Day 1',
      'Vrindavan temples on Day 2',
      'Hotel assistance included',
    ],
    shortDescription: 'Two days to soak in the spiritual energy of Mathura and Vrindavan with a comfortable overnight stay.',
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 3500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 4500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 5500  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 8000  },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 10000 },
    ],
  },
  {
    slug: '3-days-mathura-vrindavan-govardhan',
    thumbnail: '/images/packages/3-days-mathura-vrindavan-govardhan.jpg',
    name: '3 Days Goverdhan Parikrama Package',
    duration: 3, nights: 2,
    cities: ['Mathura', 'Vrindavan', 'Govardhan'],
    basePrice: 5000, rating: 4.7, totalReviews: 547,
    isPopular: true, isFeatured: true, isActive: true,
    highlights: [
      'Govardhan Parikrama experience',
      'Radha Kund & Shyam Kund visit',
      'Barsana Radha Rani Temple',
    ],
    shortDescription: 'Extended pilgrimage covering Mathura, Vrindavan, Govardhan and Barsana over three blessed days.',
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 5000  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 6500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 8000  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 12000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 15000 },
    ],
  },
  {
    slug: '3-days-mathura-vrindavan-agra',
    thumbnail: '/images/packages/3-days-mathura-vrindavan-agra.jpg',
    name: '3 Days Mathura Vrindavan + Agra',
    duration: 3, nights: 2,
    cities: ['Mathura', 'Vrindavan', 'Agra'],
    basePrice: 5500, rating: 4.8, totalReviews: 328,
    isPopular: false, isFeatured: true, isActive: true,
    highlights: [
      'Taj Mahal & Agra Fort visit',
      'Complete Mathura Vrindavan darshan',
      'Experienced driver-guide',
    ],
    shortDescription: 'Combine a divine pilgrimage with the wonder of the Taj Mahal in this perfect 3-day itinerary.',
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 5500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 7000  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 8500  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 13000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 16000 },
    ],
  },
  {
    slug: '4-days-mathura-vrindavan',
    thumbnail: '/images/packages/4-days-mathura-vrindavan.jpg',
    name: '4 Days Complete Braj Pilgrimage',
    duration: 4, nights: 3,
    cities: ['Mathura', 'Vrindavan', 'Gokul', 'Govardhan'],
    basePrice: 7500, rating: 4.9, totalReviews: 410,
    isPopular: false, isFeatured: false, isActive: true,
    highlights: [
      'All major Mathura & Vrindavan temples',
      'Gokul Raman Reti darshan',
      'Nandgaon & Barsana included',
    ],
    shortDescription: 'The most comprehensive 4-day Braj pilgrimage covering Mathura, Vrindavan, Gokul, Govardhan and more.',
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 7500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 9500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 12000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 18000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 22000 },
    ],
  },
  {
    slug: '4-days-mathura-vrindavan-bharatpur',
    thumbnail: '/images/packages/4-days-mathura-vrindavan-bharatpur.jpg',
    name: '4 Days Mathura Tour + Bharatpur',
    duration: 4, nights: 3,
    cities: ['Mathura', 'Vrindavan', 'Bharatpur'],
    basePrice: 8000, rating: 4.8, totalReviews: 352,
    isPopular: false, isFeatured: false, isActive: true,
    highlights: [
      'Keoladeo National Park bird sanctuary',
      'Complete Braj darshan',
      'Lohagarh Fort Bharatpur',
    ],
    shortDescription: 'A unique combination of spiritual pilgrimage and nature exploration at Bharatpur bird sanctuary.',
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 8000  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 10000 },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 13000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 19000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 23000 },
    ],
  },
  {
    slug: '7-days-braj-84-kos-yatra',
    thumbnail: '/images/packages/7-days-braj-84-kos-yatra.jpg',
    name: '7 Days Shri Braj 84 Kos Yatra',
    duration: 7, nights: 6,
    cities: ['Mathura', 'Vrindavan', 'Govardhan', 'Barsana'],
    basePrice: 18000, rating: 4.9, totalReviews: 152,
    isPopular: false, isFeatured: false, isActive: true,
    highlights: [
      'Complete 84 Kos Parikrama',
      'All Braj Dham coverage',
      'Premium hotel stay included',
    ],
    shortDescription: 'The ultimate Braj pilgrimage — a sacred 84 Kos Parikrama covering every divine site of Lord Krishna.',
    pricing: [
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 18000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 28000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 35000 },
    ],
  },
  {
    slug: '8-days-braj-84-kos-yatra',
    thumbnail: '/images/packages/8-days-braj-84-kos-yatra.jpg',
    name: '8 Days Shri Braj 84 Kos Yatra',
    duration: 8, nights: 7,
    cities: ['Mathura', 'Vrindavan', 'Govardhan', 'Barsana', 'Nandgaon'],
    basePrice: 22000, rating: 4.9, totalReviews: 432,
    isPopular: false, isFeatured: false, isActive: true,
    highlights: [
      'Extended 84 Kos Parikrama',
      'Nandgaon & all Braj villages',
      'Luxury accommodation',
    ],
    shortDescription: 'Eight days of complete immersion in the Braj Mandal — the most comprehensive Krishna pilgrimage available.',
    pricing: [
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 22000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 34000 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 42000 },
    ],
  },
]

// Detailed itinerary / inclusions / exclusions keyed by slug
export const PACKAGE_DETAILS: Record<string, {
  inclusions: string[]
  exclusions: string[]
  itinerary:  { day: number; title: string; description: string; places: string[] }[]
  pricing:    PackagePricing[]
}> = {
  'same-day-mathura-vrindavan': {
    inclusions: [
      'AC vehicle for the entire day',
      'Experienced local driver-guide',
      'All inter-city transfers',
      'Hotel & restaurant recommendations',
      'Pickup & drop from your Mathura location',
      'Fuel charges included',
    ],
    exclusions: [
      'Meals (breakfast, lunch, dinner)',
      'Entry fees at temples',
      'Personal expenses & tips',
      'Guide charges (optional add-on)',
      'Hotel accommodation',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Complete Mathura & Vrindavan Darshan',
        description:
          'Start your morning with Mathura darshan — visit Krishna Janmabhoomi, Dwarkadhish Temple, and offer prayers at Vishram Ghat. After lunch, proceed to Vrindavan for Banke Bihari Temple, ISKCON, and witness the breathtaking evening aarti at Prem Mandir.',
        places: [
          'Krishna Janmabhoomi Temple', 'Dwarkadhish Temple',
          'Vishram Ghat', 'Gita Mandir',
          'Banke Bihari Temple', 'ISKCON Vrindavan',
          'Prem Mandir', 'Seva Kunj',
        ],
      },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 2000 },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 2500 },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 3000 },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 4500 },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 5500 },
    ],
  },
  '2-days-mathura-vrindavan': {
    inclusions: [
      'AC vehicle for both days',
      'Experienced local driver-guide',
      'Hotel finding assistance',
      'All inter-city transfers',
      'Pickup & drop from your location',
      'Fuel charges included',
    ],
    exclusions: [
      'Meals (breakfast, lunch, dinner)',
      'Hotel accommodation cost',
      'Entry fees at temples',
      'Personal expenses & tips',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Mathura Darshan',
        description:
          'Arrive in Mathura and check in to your hotel. Begin with Krishna Janmabhoomi — the holy birthplace of Lord Krishna. Visit Dwarkadhish Temple, Gita Mandir, and end the day with evening aarti at the sacred Vishram Ghat on the Yamuna.',
        places: [
          'Krishna Janmabhoomi Temple', 'Dwarkadhish Temple',
          'Gita Mandir', 'Vishram Ghat Evening Aarti', 'Rangji Temple',
        ],
      },
      {
        day: 2,
        title: 'Vrindavan Darshan',
        description:
          'Morning mangala aarti at Banke Bihari Temple followed by a peaceful visit to ISKCON. Explore the divine Nidhivan and Seva Kunj. End your trip with the illuminated Prem Mandir and its spectacular evening light show.',
        places: [
          'Banke Bihari Temple', 'ISKCON Temple',
          'Nidhivan & Seva Kunj', 'Radha Damodara Temple',
          'Prem Mandir Evening',
        ],
      },
    ],
    pricing: [
      { carType: 'swift',  carName: 'Swift Dzire (4 pax)',    price: 3500  },
      { carType: 'eeco',   carName: 'Maruti Eeco (7 pax)',    price: 4500  },
      { carType: 'ertiga', carName: 'Maruti Ertiga (7 pax)',  price: 5500  },
      { carType: 'innova', carName: 'Toyota Innova (8 pax)',  price: 8000  },
      { carType: 'crysta', carName: 'Innova Crysta (7 pax)', price: 10000 },
    ],
  },
}