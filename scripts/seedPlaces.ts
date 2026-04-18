import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? ''
if (!MONGODB_URI) { console.error('❌  MONGODB_URI not set in .env.local'); process.exit(1) }

// ─── Schema (mirrors models/Place.ts) ────────────────────────────────────────
const PlaceSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, city: String, type: String,
  shortDescription: String, description: String,
  thumbnail: { type: String, default: '' },
  images:    [String],
  location:  { address: String, lat: Number, lng: Number, distanceFromMathura: String },
  timings:   { morning: String, evening: String, note: String },
  entryFee: String, timeRequired: String,
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  sections: [mongoose.Schema.Types.Mixed],
}, { timestamps: true })

// ─── Image path helper ────────────────────────────────────────────────────────
// Images live in /public/images/places/{slug}.jpg
// Drop your own photos there and they'll be served by Next.js automatically.
// The seed stores these paths in MongoDB so the app fetches them from DB.
const img = (slug: string) => `/images/places/${slug}.jpg`

// ─── Complete place data ──────────────────────────────────────────────────────
const PLACES = [

  // ══════════════════ MATHURA ══════════════════
  {
    slug: 'krishna-janmabhoomi',
    name: 'Shri Krishna Janmabhoomi Temple',
    city: 'Mathura', type: 'temple',
    thumbnail: img('krishna-janmabhoomi'),
    images:    [img('krishna-janmabhoomi')],
    shortDescription: 'The holiest site in all of Braj — the sacred birthplace of Lord Krishna, visited by millions of devotees from around the world every year.',
    description: 'Shri Krishna Janmabhoomi is the most sacred temple complex in Mathura, marking the exact spot where Lord Krishna was born over 5,000 years ago. The original prison cell where Krishna was born to Devaki and Vasudeva is preserved inside the complex. Adjacent stands the grand Keshav Dev Temple. The site has immense spiritual significance and is a mandatory visit for every devotee travelling to Braj Bhoomi.',
    location: { address: 'Krishna Janmabhoomi, Mathura, UP 281001', lat: 27.5036, lng: 77.6698, distanceFromMathura: '2 km from Mathura Junction' },
    timings:  { morning: '5:00 AM – 12:00 PM', evening: '4:00 PM – 9:30 PM', note: 'Extended hours during Janmashtami. Aarti at 6 AM & 7 PM.' },
    entryFee: 'Free', timeRequired: '1-2 hours',
    isFeatured: true,
    tags: ['krishna', 'birthplace', 'mathura', 'temple', 'must-visit', 'janmashtami'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Original prison cell (Garbhagriha) where Lord Krishna was born',
        'Keshav Dev Temple with stunning white marble architecture',
        'Bhagavad Gita museum inside the complex',
        'Special Janmashtami celebrations — millions of devotees gather',
        'Evening aarti is a deeply moving spiritual experience',
      ]},
      { type: 'travel_tips', title: 'Visitor Tips', items: [
        'Visit early morning (5-7 AM) to avoid crowds and witness the morning aarti',
        'Photography is restricted inside the main sanctum',
        'Dress modestly — shoulders and knees must be covered',
        'Security check at entrance — no bags allowed inside',
        'Janmashtami (August/September) attracts millions — book accommodation well in advance',
      ]},
      { type: 'distances', title: 'Distance from Key Points', items: [
        { from: 'Mathura Junction Railway Station', distance: '2 km',   time: '10 mins by auto' },
        { from: 'Vishram Ghat',                    distance: '1.5 km', time: '8 mins'           },
        { from: 'Vrindavan',                       distance: '12 km',  time: '25 mins'          },
      ]},
    ],
  },

  {
    slug: 'dwarkadhish-temple',
    name: 'Dwarkadhish Temple',
    city: 'Mathura', type: 'temple',
    thumbnail: img('dwarkadhish-temple'),
    images:    [img('dwarkadhish-temple')],
    shortDescription: 'A magnificent 19th-century temple dedicated to Lord Krishna as Dwarkadhish (King of Dwarka), famous for its vibrant festivals and ornate architecture.',
    description: 'The Dwarkadhish Temple, built in 1814 by Gokul Das Parikh, is one of the most visited temples in Mathura. Dedicated to Lord Krishna in the form of Dwarkadhish (ruler of Dwarka), the temple is known for its spectacular Holi and Janmashtami celebrations. The idol of Lord Krishna is adorned with different clothes and ornaments for each day of the week, a unique tradition maintained for over 200 years.',
    location: { address: 'Chowk Bazar, Mathura, UP 281001', lat: 27.5012, lng: 77.6684, distanceFromMathura: 'City centre' },
    timings:  { morning: '6:30 AM – 12:30 PM', evening: '5:00 PM – 9:00 PM', note: 'Extended during Holi and Janmashtami.' },
    entryFee: 'Free', timeRequired: '45-60 minutes',
    isFeatured: true,
    tags: ['dwarkadhish', 'mathura', 'temple', 'holi', 'krishna'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Spectacular Holi celebrations — priests throw flowers on devotees',
        'Daily dress-change ritual — idol adorned differently each day',
        '200-year-old temple with ornate Rajasthani architecture',
        'Morning mangala aarti is a deeply sacred experience',
        'Located in the heart of Mathura\'s bazaar — vibrant surroundings',
      ]},
      { type: 'travel_tips', title: 'Tips', items: [
        'Holi here is one of India\'s most iconic — the flower Holi is unforgettable',
        'Best visited combined with Krishna Janmabhoomi (500m away)',
        'Watch out for monkeys near the entrance',
        'No footwear inside — lockers available nearby',
      ]},
    ],
  },

  {
    slug: 'vishram-ghat',
    name: 'Vishram Ghat',
    city: 'Mathura', type: 'ghat',
    thumbnail: img('vishram-ghat'),
    images:    [img('vishram-ghat')],
    shortDescription: 'The holiest of Mathura\'s 25 ghats on the Yamuna River — where Lord Krishna rested after slaying Kansa. Famous for its breathtaking evening aarti.',
    description: 'Vishram Ghat is the most sacred of all the 25 ghats (stepped riverbanks) in Mathura. According to legend, Lord Krishna rested here after slaying his evil uncle Kansa. The evening aarti at Vishram Ghat — with dozens of lamps, chanting priests, and hundreds of devotees — is one of the most spiritually powerful experiences in all of Braj Bhoomi.',
    location: { address: 'Vishram Ghat, River Bank, Mathura, UP 281001', lat: 27.5022, lng: 77.6661, distanceFromMathura: 'City centre' },
    timings:  { morning: 'Open all day', evening: 'Aarti at 7:00 PM (summer) / 6:00 PM (winter)', note: 'Evening aarti is the main attraction — arrive 30 minutes early.' },
    entryFee: 'Free', timeRequired: '1-1.5 hours',
    isFeatured: true,
    tags: ['ghat', 'yamuna', 'aarti', 'mathura', 'evening', 'river'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Grand evening aarti with oil lamps, flowers, and devotional singing',
        'Boat rides on the sacred Yamuna River (₹50-100 per person)',
        'View of all 25 Mathura ghats from the river',
        'Krishna Balram Temple complex adjacent to the ghat',
        'Sunrise is equally magical — peaceful and serene',
      ]},
      { type: 'travel_tips', title: 'Tips', items: [
        'Arrive 30 minutes before sunset for the best spot at the aarti',
        'Boat rides available — agree on price before boarding',
        'Prasad and flower offerings sold at the ghat',
        'Avoid touching the Yamuna water due to pollution',
        'Combine with a visit to Dwarkadhish Temple (10-minute walk)',
      ]},
    ],
  },

  {
    slug: 'gita-mandir',
    name: 'Gita Mandir (Birla Mandir)',
    city: 'Mathura', type: 'temple',
    thumbnail: img('gita-mandir'),
    images:    [img('gita-mandir')],
    shortDescription: 'A serene temple built by the Birla family with the entire Bhagavad Gita inscribed on its pristine white marble walls — a unique spiritual landmark.',
    description: 'Built by the Birla family in 1965, Gita Mandir (also called Birla Mandir) is a unique temple where the entire text of the Bhagavad Gita — all 18 chapters and 700 verses — is inscribed on the marble walls. The temple complex also features a tall pillar with engravings of the Gita, and the main shrine dedicated to Lord Lakshmi Narayan. The peaceful garden surrounding it makes it an ideal stop for quiet reflection.',
    location: { address: 'Gita Mandir Road, Mathura, UP 281001', lat: 27.4993, lng: 77.6780, distanceFromMathura: '3 km from city centre' },
    timings:  { morning: '8:00 AM – 12:00 PM', evening: '4:00 PM – 9:00 PM' },
    entryFee: 'Free', timeRequired: '30-45 minutes',
    isFeatured: false,
    tags: ['gita', 'birla', 'mathura', 'temple', 'peaceful', 'unique'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Entire Bhagavad Gita (700 verses) inscribed on white marble walls',
        'Gita Stambha — a tall pillar engraved with Gita chapters',
        'Beautiful peaceful garden — ideal for quiet meditation',
        'Immaculate white marble architecture typical of Birla temples',
        'Adjacent to the Mathura bus stand — easy to include in any itinerary',
      ]},
    ],
  },

  // ══════════════════ VRINDAVAN ══════════════════
  {
    slug: 'banke-bihari-temple',
    name: 'Shri Banke Bihari Temple',
    city: 'Vrindavan', type: 'temple',
    thumbnail: img('banke-bihari-temple'),
    images:    [img('banke-bihari-temple')],
    shortDescription: 'The most beloved temple in Vrindavan — home to the charismatic and playful idol of Banke Bihari, thronged by thousands of devotees daily.',
    description: 'Shri Banke Bihari Temple is the heart of Vrindavan and one of the most visited temples in India. The idol of Banke Bihari is known for its exquisitely playful form — the Lord is shown in the Tribhanga (three-bend) posture, standing in a characteristic gentle lean. A curtain is periodically drawn before the idol during darshan — according to tradition, the direct gaze of Banke Bihari is so powerful that devotees may be overwhelmed. Founded in 1864 by Swami Haridas, a saint who is said to have produced the idol from the sacred grove of Nidhivan.',
    location: { address: 'Banke Bihari Temple Road, Vrindavan, UP 281121', lat: 27.5794, lng: 77.7048, distanceFromMathura: '12 km from Mathura' },
    timings:  { morning: '7:45 AM – 12:00 PM', evening: '5:30 PM – 9:30 PM (summer) / 4:30 PM – 8:30 PM (winter)', note: 'Temple closed on Ekadashi. Swing festival in monsoon season is spectacular.' },
    entryFee: 'Free', timeRequired: '45-60 minutes',
    isFeatured: true,
    tags: ['banke-bihari', 'vrindavan', 'temple', 'must-visit', 'krishna'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Unique "curtain darshan" — curtain drawn to rest the idol\'s powerful gaze',
        'Swing festival (Jhulan Yatra) in monsoon — idol placed on an ornate swing',
        'Holi celebrations here are legendary — coloured water sprayed on devotees',
        'No bell-ringing or conch-blowing — unique temple tradition',
        'Founded by Swami Haridas, guru of Tansen of Emperor Akbar\'s court',
      ]},
      { type: 'travel_tips', title: 'Visitor Tips', items: [
        'Arrive by 8 AM for the peaceful mangala aarti before crowds gather',
        'Evenings (6-8 PM) are extremely crowded — expect a 30-min queue',
        'Leave valuable ornaments behind — the narrow lanes can be chaotic',
        'Wear closed footwear — the lane outside is often wet with flower water',
        'Combine with nearby Nidhivan (500m) and ISKCON (2 km)',
      ]},
    ],
  },

  {
    slug: 'prem-mandir',
    name: 'Prem Mandir',
    city: 'Vrindavan', type: 'temple',
    thumbnail: img('prem-mandir'),
    images:    [img('prem-mandir')],
    shortDescription: 'A breathtaking modern temple in pure white Italian marble, glowing with thousands of lights after sunset — the most photogenic temple in Braj.',
    description: 'Prem Mandir, meaning "Temple of Divine Love", is a stunning monument built by Jagadguru Shri Kripalu Ji Maharaj. Constructed from pristine white Italian marble and inaugurated in 2012, it took 11 years and 1,000 artisans to build. The temple complex spans 54 acres and features intricate carvings depicting scenes from Krishna\'s life. After sunset, the temple is illuminated by thousands of coloured lights and appears to float in the darkness — a truly magical sight.',
    location: { address: 'Raman Reti, Vrindavan, UP 281121', lat: 27.5645, lng: 77.6980, distanceFromMathura: '14 km from Mathura' },
    timings:  { morning: '5:30 AM – 12:00 PM', evening: '4:30 PM – 8:30 PM', note: 'Light show starts at 7:30 PM — most spectacular after sunset.' },
    entryFee: 'Free', timeRequired: '1-1.5 hours',
    isFeatured: true,
    tags: ['prem-mandir', 'vrindavan', 'temple', 'marble', 'light-show', 'photography', 'must-visit'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Illuminated light show every evening — thousands of coloured LEDs',
        'Pure white Italian marble with intricate hand-carved panels',
        'Life-size dioramas depicting 12 scenes from Krishna\'s childhood (Bal Leela)',
        'Musical fountain and well-maintained garden complex',
        'Panoramic Krishna-Lila murals around the entire outer wall',
      ]},
      { type: 'travel_tips', title: 'Tips', items: [
        'The evening light show (7:30 PM) is the main attraction — plan your day around it',
        'Photography allowed in the garden, not inside the main sanctum',
        'Best time for photography: golden hour before the light show begins',
        'Garden is large — allow 30 minutes just for the grounds',
        'This is the last stop on most tour itineraries — perfect for ending the day',
      ]},
    ],
  },

  {
    slug: 'iskcon-vrindavan',
    name: 'ISKCON Temple Vrindavan',
    city: 'Vrindavan', type: 'temple',
    thumbnail: img('iskcon-vrindavan'),
    images:    [img('iskcon-vrindavan')],
    shortDescription: 'The magnificent Krishna Balarama Mandir built by ISKCON — a haven of devotion offering prasadam, kirtan, and an international spiritual atmosphere.',
    description: 'The ISKCON Krishna Balarama Mandir in Vrindavan was opened in 1975 by Srila Prabhupada, the founder of ISKCON. The temple complex includes three main shrines: Krishna Balarama, Radha Shyamasundara, and Gaura Nitai. It attracts devotees from across the world and is one of the most active centres of Vaishnavism globally. The complex includes a guesthouse, Srila Prabhupada\'s samadhi, the famous Govinda\'s Restaurant, and an extensive library.',
    location: { address: 'Bhaktivedanta Swami Marg, Raman Reti, Vrindavan, UP 281121', lat: 27.5764, lng: 77.6977, distanceFromMathura: '13 km from Mathura' },
    timings:  { morning: '4:30 AM – 1:00 PM', evening: '4:00 PM – 8:45 PM', note: 'Multiple aratis daily. Mangala Arati at 4:30 AM is the most devotional.' },
    entryFee: 'Free', timeRequired: '1-2 hours',
    isFeatured: true,
    tags: ['iskcon', 'vrindavan', 'temple', 'international', 'prasadam', 'kirtan'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Six daily aartis — Mangala Arati at 4:30 AM is deeply moving',
        'Govinda\'s Restaurant — world-class pure sattvic food (prasadam)',
        'Srila Prabhupada\'s Puspa Samadhi — a beautiful memorial shrine',
        'International atmosphere — devotees from 50+ countries',
        'Extensive Vedic library and bookshop',
        'Pristine maintenance and serene gardens',
      ]},
      { type: 'travel_tips', title: 'Tips', items: [
        'Have the prasadam at Govinda\'s Restaurant — it\'s exceptional',
        'Dress code strictly enforced — cover head before entering main shrine',
        'The Mangala Arati (4:30 AM) is a once-in-a-lifetime experience for devotees',
        'Photography of the main idols is not permitted',
        'Free accommodation available for visiting devotees (limited)',
      ]},
    ],
  },

  {
    slug: 'nidhivan',
    name: 'Nidhivan',
    city: 'Vrindavan', type: 'sacred-site',
    thumbnail: img('nidhivan'),
    images:    [img('nidhivan')],
    shortDescription: 'A mysterious and mystical forest grove where, according to ancient belief, Lord Krishna and Radha perform the Raas Leela every night — no one is allowed after sunset.',
    description: 'Nidhivan is the most mysterious and revered sacred grove in Vrindavan. The intertwined tulsi trees here are believed to transform into gopis (devotees) at night for the divine Raas Leela of Krishna and Radha. Local legends say that anyone who stays to witness this is either struck blind, mute, or dies. The entire complex is locked every evening at sunset without exception. The shrine of Rangmahal inside is believed to be where Krishna rests after the night\'s dance. Even today, offerings of betel leaf, sweets, and mirror are placed inside Rangmahal before closing — found partially consumed the next morning.',
    location: { address: 'Nidhivan, Vrindavan, UP 281121', lat: 27.5796, lng: 77.7008, distanceFromMathura: '12 km from Mathura' },
    timings:  { morning: '8:00 AM – 5:00 PM', evening: 'CLOSED after sunset — no exceptions', note: 'Temple is locked at 5:30 PM. Everyone must leave the premises by 5 PM.' },
    entryFee: 'Free', timeRequired: '30-45 minutes',
    isFeatured: true,
    tags: ['nidhivan', 'vrindavan', 'sacred', 'mystical', 'raas-leela', 'tulsi'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Ancient tulsi trees with uniquely intertwined trunks — unlike anywhere else',
        'Rangmahal shrine — where offerings to Krishna are placed each evening',
        'One of the most spiritually intense sites in all of Vrindavan',
        'Peacocks and squirrels roam freely in this protected grove',
        'Legend of the nocturnal Raas Leela attracts pilgrims and researchers alike',
      ]},
      { type: 'travel_tips', title: 'Tips', items: [
        'Visit in the morning (8-10 AM) when the grove is peaceful',
        'Absolutely must leave before 5 PM — this rule is non-negotiable',
        'No photography of the main shrine area',
        'A knowledgeable guide enriches this visit enormously',
        'Combined visit with Seva Kunj (adjacent) is recommended',
      ]},
    ],
  },

  {
    slug: 'seva-kunj',
    name: 'Seva Kunj',
    city: 'Vrindavan', type: 'sacred-site',
    thumbnail: img('seva-kunj'),
    images:    [img('seva-kunj')],
    shortDescription: 'A sacred grove adjacent to Nidhivan where Lord Krishna is believed to have arranged flowers in Radha\'s hair — surrounded by ancient trees and peacocks.',
    description: 'Seva Kunj (also called Lalita Kund) is a sacred garden grove next to Nidhivan, believed to be the site where Lord Krishna arranged flowers in Radha\'s hair and served her devotedly. The central image of Radha and Krishna here depicts this intimate moment of divine service. The grove is maintained by the Vallabha sect and features a beautiful kund (sacred pond) surrounded by ancient kadamba trees. Like Nidhivan, it is closed after sunset.',
    location: { address: 'Seva Kunj Road, Vrindavan, UP 281121', lat: 27.5800, lng: 77.7015, distanceFromMathura: '12 km from Mathura' },
    timings:  { morning: '8:00 AM – 5:00 PM', evening: 'Closed after sunset' },
    entryFee: 'Free', timeRequired: '20-30 minutes',
    isFeatured: false,
    tags: ['seva-kunj', 'vrindavan', 'sacred', 'radha-krishna', 'grove'],
    sections: [],
  },

  // ══════════════════ GOKUL ══════════════════
  {
    slug: 'raman-reti',
    name: 'Raman Reti (Gokul)',
    city: 'Gokul', type: 'sacred-site',
    thumbnail: img('raman-reti'),
    images:    [img('raman-reti')],
    shortDescription: 'The golden sand banks of Gokul where the infant Krishna played — pilgrims still roll in the sacred soil and take prasadam of butter and sweets.',
    description: 'Raman Reti in Gokul is the sacred area where infant Krishna played in the golden sand banks along the Yamuna. Pilgrims have been coming here for thousands of years to roll in the sand (a form of devotion called "lota"), believing it bestows divine blessings. The ISKCON temple here (founded by Prabhupada) offers beautiful darshan and fresh prasadam. The site has an intimate, village-like atmosphere very different from the busy temples of Mathura and Vrindavan.',
    location: { address: 'Raman Reti, Gokul, Mathura, UP 281502', lat: 27.4565, lng: 77.7401, distanceFromMathura: '10 km from Mathura' },
    timings:  { morning: '6:00 AM – 12:00 PM', evening: '4:00 PM – 8:00 PM' },
    entryFee: 'Free', timeRequired: '45-60 minutes',
    isFeatured: false,
    tags: ['gokul', 'raman-reti', 'krishna-childhood', 'sand', 'yamuna', 'iskcon'],
    sections: [],
  },

  // ══════════════════ GOVARDHAN ══════════════════
  {
    slug: 'govardhan-hill',
    name: 'Govardhan Hill (Giriraj)',
    city: 'Govardhan', type: 'hill',
    thumbnail: img('govardhan-hill'),
    images:    [img('govardhan-hill')],
    shortDescription: 'The sacred hill that Lord Krishna lifted on His little finger for 7 days to protect the Braj people from Indra\'s floods — a 21 km parikrama circuit.',
    description: 'Govardhan Hill, also called Giriraj (King of Mountains), is one of the most sacred sites in Hinduism. According to the Bhagavata Purana, when Lord Krishna was seven years old, he lifted this hill on the little finger of his left hand to shelter the people of Braj from torrential rains sent by Indra. The hill is considered a direct manifestation of Lord Krishna himself. Devotees perform the Govardhan Parikrama (circumambulation) — a 21 km walk around the hill — touching the ground with their forehead at every step. Radha Kund and Shyam Kund are located along this circuit.',
    location: { address: 'Govardhan, Mathura District, UP 281502', lat: 27.4985, lng: 77.4668, distanceFromMathura: '26 km from Mathura' },
    timings:  { morning: 'Open all day for parikrama', note: 'Parikrama is done barefoot — early morning or evening is recommended.' },
    entryFee: 'Free', timeRequired: '3-6 hours (full parikrama) / 1-2 hours (Mukharvind darshan only)',
    isFeatured: true,
    tags: ['govardhan', 'giriraj', 'parikrama', 'krishna-leela', 'sacred-hill', 'pilgrimage'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Govardhan Parikrama — 21 km sacred circumambulation done barefoot',
        'Mukharvind — the "face" of Giriraj where Krishna\'s face is said to appear',
        'Radha Kund and Shyam Kund — sacred ponds along the parikrama route',
        'Manasi Ganga — a sacred lake at the foot of the hill',
        'Annakut festival (Diwali day) — massive food offering celebrated here',
      ]},
      { type: 'travel_tips', title: 'Parikrama Tips', items: [
        'Start the parikrama at 5-6 AM to avoid afternoon heat',
        'Wear comfortable footwear for the walk but remove shoes at sacred spots',
        'E-rickshaws available for those who cannot do the full walk (₹150-200)',
        'Carry water and light snacks — dhabas available every 2-3 km',
        'The full parikrama takes 4-6 hours at a devotional pace',
        'Annakut (day after Diwali) is the most spectacular time to visit',
      ]},
    ],
  },

  {
    slug: 'radha-kund',
    name: 'Radha Kund & Shyam Kund',
    city: 'Govardhan', type: 'sacred-site',
    thumbnail: img('radha-kund'),
    images:    [img('radha-kund')],
    shortDescription: 'Two sacred ponds — one created by Radha and one by Krishna — considered the most sacred bathing spots in all of Braj Bhoomi.',
    description: 'Radha Kund and adjacent Shyam Kund (also called Krishna Kund) are twin sacred ponds located at the foot of Govardhan Hill, considered the holiest bathing spots in Braj. According to the Bhagavata Purana, these ponds were created by Radha and Krishna themselves. Bathing here, especially on Karttika Ashtami (October/November), is believed to grant liberation. The ghats surrounding both ponds are beautifully maintained, and the pre-dawn atmosphere on Radha Ashtami is extraordinarily devotional.',
    location: { address: 'Radha Kund, Govardhan, Mathura, UP 281502', lat: 27.5055, lng: 77.4752, distanceFromMathura: '28 km from Mathura' },
    timings:  { morning: 'Open all day', note: 'Midnight bathing on Karttika Ashtami — attended by tens of thousands of pilgrims.' },
    entryFee: 'Free', timeRequired: '45-60 minutes',
    isFeatured: false,
    tags: ['radha-kund', 'govardhan', 'sacred-pond', 'bathing', 'radha', 'krishna'],
    sections: [],
  },

  // ══════════════════ BARSANA ══════════════════
  {
    slug: 'radha-rani-temple-barsana',
    name: 'Shri Radha Rani Temple',
    city: 'Barsana', type: 'temple',
    thumbnail: img('radha-rani-temple-barsana'),
    images:    [img('radha-rani-temple-barsana')],
    shortDescription: 'The hilltop palace-temple in Radha\'s birthplace — famous for the unique Lathmar Holi where women playfully beat men with sticks.',
    description: 'The Radha Rani Temple in Barsana is built atop a rocky hill and is dedicated to Radha, the eternal consort of Lord Krishna. Barsana is believed to be Radha\'s birthplace, making this temple one of the most important for Vaishnava devotees. The temple is particularly famous for Lathmar Holi — a unique tradition where women from Barsana playfully beat men from Nandgaon (Krishna\'s village) with lathis (bamboo sticks) while the men shield themselves with shields. This centuries-old tradition takes place a week before the main Holi festival and draws thousands of visitors from across India and the world.',
    location: { address: 'Barsana Hill, Barsana, Mathura, UP 281405', lat: 27.6512, lng: 77.3636, distanceFromMathura: '43 km from Mathura' },
    timings:  { morning: '5:30 AM – 12:00 PM', evening: '4:00 PM – 8:00 PM', note: 'Lathmar Holi takes place here — dates vary each year (typically February).' },
    entryFee: 'Free', timeRequired: '1-1.5 hours',
    isFeatured: true,
    tags: ['barsana', 'radha-rani', 'radha-birthplace', 'lathmar-holi', 'holi', 'temple', 'hilltop'],
    sections: [
      { type: 'highlights', title: 'Highlights', items: [
        'Lathmar Holi — women beat men with sticks in a joyful ancient tradition',
        'Hilltop location with panoramic views of Braj landscape',
        'The only major temple primarily dedicated to Radha (not Krishna)',
        'Phoolon Ki Holi — festival of flowers, celebrated with rose petals',
        'Ancient temple with spectacular architectural details',
      ]},
      { type: 'travel_tips', title: 'Tips', items: [
        'Lathmar Holi dates are announced a month before — check ahead',
        'The climb to the hilltop involves 200+ steps — allow 15-20 minutes',
        'Palanquin (doli) service available for elderly pilgrims',
        'Best visited as part of a day trip from Vrindavan or Mathura',
        'Local bazaar at the foot of the hill sells Braj-style sweets',
      ]},
    ],
  },
]

// ─── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  console.log('🔗  Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to:', mongoose.connection.db?.databaseName, '\n')

  const Place = mongoose.models.Place ?? mongoose.model('Place', PlaceSchema)

  let created = 0
  let updated  = 0

  for (const place of PLACES) {
    const existing = await Place.findOne({ slug: place.slug })
    if (existing) {
      await Place.findOneAndUpdate({ slug: place.slug }, { $set: place })
      console.log(`  ↻  Updated: ${place.name}`)
      updated++
    } else {
      await Place.create(place)
      console.log(`  ✓  Created: ${place.name}`)
      created++
    }
  }

  console.log(`\n🎉  Done! Created: ${created}  Updated: ${updated}`)
  console.log(`\n📁  Place images expected at:`)
  console.log(`    web/public/images/places/{slug}.jpg`)
  console.log(`    Drop your photos there — Next.js serves them automatically.\n`)
  await mongoose.disconnect()
  console.log('🔌  Disconnected.')
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})