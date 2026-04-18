export interface PlaceSection {
  type: 'rich_text' | 'highlights' | 'travel_tips' | 'distances' | 'faq'
  title: string
  content?: string
  items?: Array<string | { from: string; distance: string; time: string } | { question: string; answer: string }>
}

export interface Place {
  slug: string
  name: string
  city: string
  type: 'temple' | 'ghat' | 'garden' | 'museum' | 'sacred-site' | 'hill' | 'market'
  shortDescription: string
  thumbnail?: string
  images: string[]
  location: {
    address: string
    lat: number
    lng: number
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
  sections: PlaceSection[]
}

export const ALL_PLACES: Place[] = [
  // ─── MATHURA ───────────────────────────────────────────
  {
    slug: 'krishna-janmabhoomi',
    name: 'Shri Krishna Janmabhoomi Temple',
    city: 'Mathura',
    type: 'temple',
    shortDescription:
      'The holiest site in all of Braj — the sacred birthplace of Lord Krishna, visited by millions of devotees from around the world every year.',
    thumbnail: '/images/places/krishna-janmabhoomi.jpg',
    images: ['/images/places/krishna-janmabhoomi.jpg'],
    location: {
      address: 'Krishna Janmabhoomi, Mathura, Uttar Pradesh 281001',
      lat: 27.5036,
      lng: 77.6698,
    },
    timings: {
      morning: '5:00 AM – 12:00 PM',
      evening: '4:00 PM – 9:30 PM',
      note: 'Timing changes during festivals. Aarti at 6 AM & 7 PM.',
    },
    entryFee: 'Free',
    timeRequired: '1-2 hours',
    isFeatured: true,
    tags: ['krishna', 'birthplace', 'mathura', 'temple', 'must-visit'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Shri Krishna Janmabhoomi',
        content:
          'Shri Krishna Janmabhoomi is the most sacred temple complex in Mathura, marking the exact spot where Lord Krishna was born over 5,000 years ago. The prison cell where Krishna was born to Devaki and Vasudeva is preserved inside the complex. Adjacent to it stands the grand Keshav Dev Temple. The site has immense spiritual significance and is a mandatory visit for every devotee travelling to Braj Bhoomi.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'The original prison cell (Garbhagriha) where Lord Krishna was born',
          'Keshav Dev Temple with stunning architecture',
          'Bhagavad Gita museum inside the complex',
          'Special Janmashtami celebrations — millions of devotees gather',
          'Evening aarti is a deeply moving spiritual experience',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction Railway Station', distance: '2 km',   time: '10 mins' },
          { from: 'Mathura New Bus Stand',            distance: '3 km',   time: '12 mins' },
          { from: 'Vrindavan',                        distance: '12 km',  time: '25 mins' },
          { from: 'New Delhi',                        distance: '145 km', time: '2.5 hrs' },
          { from: 'Agra',                             distance: '58 km',  time: '1.5 hrs' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Reach before 6 AM for the peaceful mangala aarti',
          'Photography is restricted inside the main shrine',
          'Dress modestly — cover shoulders and legs',
          'Avoid Mondays and festival days if you want smaller crowds',
          'Store mobile phones and bags at the cloak room outside',
        ],
      },
      {
        type: 'faq',
        title: 'Frequently Asked Questions',
        items: [
          { question: 'Is there an entry fee?',            answer: 'No entry fee. The temple complex is free to visit.' },
          { question: 'Can we do aarti here?',             answer: 'Yes, aarti happens twice daily at 6 AM and 7 PM.' },
          { question: 'Is it open on all days?',           answer: 'Yes, open every day of the year.' },
          { question: 'Is photography allowed?',           answer: 'Photography is not permitted inside the main sanctum.' },
        ],
      },
    ],
  },

  {
    slug: 'dwarkadhish-temple',
    name: 'Dwarkadhish Temple',
    city: 'Mathura',
    type: 'temple',
    shortDescription:
      'One of the most magnificent temples in Mathura, dedicated to Lord Krishna in his form as King of Dwarka — famous for its vibrant architecture and festivals.',
    thumbnail: '/images/places/dwarkadhish-temple.jpg',
    images: ['/images/places/dwarkadhish-temple.jpg'],
    location: {
      address: 'Dwarkadhish Temple, Vishram Ghat Road, Mathura 281001',
      lat: 27.5015,
      lng: 77.6714,
    },
    timings: {
      morning: '6:30 AM – 12:30 PM',
      evening: '4:00 PM – 7:30 PM',
      note: 'The beautiful Shringar aarti at 7 AM is most popular.',
    },
    entryFee: 'Free',
    timeRequired: '1 hour',
    isFeatured: true,
    tags: ['temple', 'mathura', 'krishna', 'architecture'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Dwarkadhish Temple',
        content:
          'The Dwarkadhish Temple, built in 1814 by Seth Gokuldas Parikh, is one of the most visited temples in Mathura. The temple showcases stunning Rajasthani architecture with intricate carvings. The main deity is Lord Dwarkadhish — Krishna as the Lord of Dwarka — adorned in elaborate decorations that change every season. The temple is especially spectacular during Holi, Janmashtami, and Annakut celebrations.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Stunning Rajasthani architecture with intricate marble carvings',
          'Elaborate seasonal decoration of the main deity',
          'World-famous Holi celebrations — colours fly for 7 days',
          'Annakut festival with 56 food offerings (Chappan Bhog)',
          'The temple swing (jhula) ceremony during Sawan',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction',  distance: '2 km',   time: '8 mins'  },
          { from: 'Vishram Ghat',      distance: '0.5 km', time: '3 mins'  },
          { from: 'Vrindavan',         distance: '12 km',  time: '25 mins' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Visit during Shringar aarti at 7 AM for the best darshan',
          'The temple is very crowded on Ekadashi — plan accordingly',
          'Book Holi visit well in advance — accommodation fills up fast',
          'Wear shoes that are easy to remove at the entrance',
        ],
      },
    ],
  },

  {
    slug: 'vishram-ghat',
    name: 'Vishram Ghat',
    city: 'Mathura',
    type: 'ghat',
    shortDescription:
      'The holiest ghat on the Yamuna river — where Lord Krishna rested after defeating Kansa. The evening aarti here is one of the most spiritually charged experiences in all of India.',
    thumbnail: '/images/places/vishram-ghat.jpg',
    images: ['/images/places/vishram-ghat.jpg'],
    location: {
      address: 'Vishram Ghat, Yamuna Bank, Mathura, Uttar Pradesh 281001',
      lat: 27.5012,
      lng: 77.6720,
    },
    timings: {
      morning: 'Open 24 hours',
      evening: 'Evening Aarti: 6:30 PM – 7:30 PM',
      note: 'Evening aarti timing changes by season. Ask locals for exact time.',
    },
    entryFee: 'Free',
    timeRequired: '1 hour',
    isFeatured: true,
    tags: ['ghat', 'yamuna', 'aarti', 'mathura', 'must-visit'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Vishram Ghat',
        content:
          'Vishram Ghat is considered the most sacred of all 25 ghats in Mathura. According to Hindu mythology, Lord Krishna rested (vishram) at this very spot after slaying the demon king Kansa. The evening Yamuna aarti here rivals the famous Ganga aarti in Varanasi — priests perform synchronized rituals with large diyas (oil lamps) to the sound of bells and devotional chants. A boat ride on the Yamuna from Vishram Ghat is a deeply moving experience.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Spectacular evening Yamuna aarti — not to be missed',
          'Boat rides on the sacred Yamuna river',
          '25 ghats stretching along the Yamuna river bank',
          'The spot where Krishna rested after defeating Kansa',
          'Ancient temples lining the ghat steps',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction',        distance: '2 km',  time: '10 mins' },
          { from: 'Dwarkadhish Temple',      distance: '0.5 km',time: '3 mins'  },
          { from: 'Krishna Janmabhoomi',     distance: '1 km',  time: '5 mins'  },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Arrive 30 minutes before aarti for a good spot',
          'Hire a boat for ₹50-100 for a Yamuna river experience',
          'Avoid swimming — the river has strong undercurrents',
          'The ghat is most beautiful during sunrise and sunset',
          'Keep your belongings secure — the ghat can get very crowded',
        ],
      },
    ],
  },

  {
    slug: 'gita-mandir',
    name: 'Gita Mandir (Birla Mandir)',
    city: 'Mathura',
    type: 'temple',
    shortDescription:
      'A magnificent temple with the entire Bhagavad Gita inscribed on its walls — a unique spiritual landmark built by the Birla family in stunning white marble.',
    thumbnail: '/images/places/gita-mandir.jpg',
    images: ['/images/places/gita-mandir.jpg'],
    location: {
      address: 'Gita Mandir Road, Mathura, Uttar Pradesh 281001',
      lat: 27.4881,
      lng: 77.6576,
    },
    timings: {
      morning: '5:00 AM – 12:00 PM',
      evening: '3:00 PM – 8:00 PM',
    },
    entryFee: 'Free',
    timeRequired: '45 minutes',
    isFeatured: false,
    tags: ['temple', 'mathura', 'gita', 'birla', 'architecture'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Gita Mandir',
        content:
          'Gita Mandir, also known as Birla Mandir, is a unique temple where all 18 chapters of the Bhagavad Gita are inscribed on the pillars and walls. Built by the industrialist Jugal Kishore Birla, the temple is dedicated to Lord Lakshmi Narayan. A 35-foot tall pillar called "Gita Stambha" stands in front of the temple with Gita shlokas engraved throughout. The serene garden surrounding the temple makes it ideal for quiet contemplation.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Complete Bhagavad Gita inscribed on temple walls and pillars',
          '35-foot Gita Stambha (pillar) with Sanskrit shlokas',
          'Beautiful white marble architecture by the Birla family',
          'Peaceful garden — perfect for meditation',
          'Unique in all of India — no other temple displays the full Gita',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction',    distance: '5 km',  time: '15 mins' },
          { from: 'Vrindavan',           distance: '8 km',  time: '20 mins' },
          { from: 'Krishna Janmabhoomi', distance: '4 km',  time: '12 mins' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Take time to read the Gita shlokas inscribed on the walls',
          'The garden is a good spot for a peaceful break between temple visits',
          'Best combined with Mathura darshan on Day 1 of your trip',
        ],
      },
    ],
  },

  // ─── VRINDAVAN ─────────────────────────────────────────
  {
    slug: 'banke-bihari-temple',
    name: 'Shri Banke Bihari Temple',
    city: 'Vrindavan',
    type: 'temple',
    shortDescription:
      'The most beloved temple in Vrindavan — where the divine presence of Thakur Banke Bihari Ji is so powerful that the curtain is drawn every few minutes to protect devotees from overwhelming divine energy.',
    thumbnail: '/images/places/banke-bihari-temple.jpg',
    images: ['/images/places/banke-bihari-temple.jpg'],
    location: {
      address: 'Banke Bihari Temple Road, Vrindavan, Uttar Pradesh 281121',
      lat: 27.5799,
      lng: 77.6957,
    },
    timings: {
      morning: '7:45 AM – 12:00 PM',
      evening: '5:30 PM – 9:30 PM',
      note: 'Closed between 12 PM and 5:30 PM. No aarti performed here by tradition.',
    },
    entryFee: 'Free',
    timeRequired: '1 hour',
    isFeatured: true,
    tags: ['temple', 'vrindavan', 'krishna', 'must-visit', 'famous'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Banke Bihari Temple',
        content:
          'Banke Bihari Temple is the most iconic temple of Vrindavan, established in 1864 by Swami Haridas — the music guru of the legendary Tansen. The black-stone idol of Banke Bihari (Krishna in a triple-bent posture) is said to have been revealed from Nidhivan by Swami Haridas himself. Uniquely, no aarti is performed at this temple — legend says that when an aarti was attempted, devotees were so overwhelmed by the divine energy that they fainted. The curtain before the deity is opened and closed every few minutes to prevent devotees from getting "lost" in Krishna\'s gaze.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'The divine curtain ritual — drawn every few minutes, unique to this temple',
          'Black-stone idol of Banke Bihari revealed by Saint Swami Haridas',
          'No bell ringing or conch blowing — extraordinary silence during darshan',
          'Phool Bangla (flower bungalow) decoration during summer is spectacular',
          'Holi celebration here is the most famous in all of Vrindavan',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Vrindavan Bus Stand',  distance: '2 km',  time: '10 mins' },
          { from: 'Mathura Junction',     distance: '14 km', time: '30 mins' },
          { from: 'Prem Mandir',          distance: '2 km',  time: '8 mins'  },
          { from: 'ISKCON Temple',        distance: '1.5 km',time: '7 mins'  },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Arrive at 7:45 AM sharp for the opening darshan — least crowded',
          'Avoid visiting on weekends and Mondays — extremely crowded',
          'The lanes leading to the temple have many shops — watch for pickpockets',
          'No photography inside the temple — strictly enforced',
          'Hire a local rickshaw from Vrindavan bus stand for ₹20-30',
        ],
      },
      {
        type: 'faq',
        title: 'Frequently Asked Questions',
        items: [
          { question: 'Why is the curtain closed so frequently?',    answer: 'Tradition holds that Banke Bihari\'s gaze is so captivating that devotees could get "lost" in it. The curtain is drawn every few minutes to protect them.' },
          { question: 'Why is there no aarti at Banke Bihari?',      answer: 'It is said that when an aarti was attempted, devotees fainted from the overwhelming divine energy. The tradition of no aarti has been maintained since.' },
          { question: 'Who established this temple?',                answer: 'Swami Haridas, the revered saint and music guru of Tansen, established the temple in 1864.' },
        ],
      },
    ],
  },

  {
    slug: 'prem-mandir',
    name: 'Prem Mandir',
    city: 'Vrindavan',
    type: 'temple',
    shortDescription:
      'A grand white marble temple that transforms into a glowing spectacle of colored lights every evening — depicting the divine love of Radha and Krishna through intricate carvings.',
    thumbnail: '/images/places/prem-mandir.jpg',
    images: ['/images/places/prem-mandir.jpg'],
    location: {
      address: 'Raman Reti, Vrindavan, Uttar Pradesh 281121',
      lat: 27.5654,
      lng: 77.6756,
    },
    timings: {
      morning: '5:30 AM – 12:00 PM',
      evening: '4:30 PM – 8:30 PM',
      note: 'Light show: 7:00 PM to 8:00 PM (45 minutes). Do not miss it.',
    },
    entryFee: 'Free',
    timeRequired: '1-2 hours',
    isFeatured: true,
    tags: ['temple', 'vrindavan', 'architecture', 'light-show', 'must-visit'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Prem Mandir',
        content:
          'Prem Mandir (Temple of Divine Love) was built by Jagadguru Shri Kripalu Ji Maharaj and inaugurated in 2012 after 11 years of construction. The temple is crafted entirely from Italian white marble and features 84 intricately carved panels depicting the leelas (divine pastimes) of Radha-Krishna and Ram-Sita. The 54-acre complex transforms every evening into a dreamlike spectacle as the temple is illuminated with color-changing LED lights synchronized to devotional music. The musical fountain in front of the temple adds to the magical atmosphere.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Stunning evening light show — colored LED illumination synchronized to music',
          '84 carved panels depicting Radha-Krishna leelas in Italian marble',
          'Musical fountain show in the evening',
          'Massive 54-acre beautifully landscaped complex',
          'Life-size tableaux of Krishna\'s childhood pastimes in the garden',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Banke Bihari Temple',  distance: '2 km',   time: '8 mins'  },
          { from: 'ISKCON Vrindavan',     distance: '1.5 km', time: '6 mins'  },
          { from: 'Mathura Junction',     distance: '14 km',  time: '30 mins' },
          { from: 'Vrindavan Bus Stand',  distance: '3 km',   time: '12 mins' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Plan to arrive at 6:30 PM to find a good spot for the light show',
          'The best view of the illuminated temple is from the main gate',
          'Photography of the evening light show is allowed and stunning',
          'The complex is very large — wear comfortable footwear',
          'Combine with ISKCON temple on the same evening — they are nearby',
        ],
      },
    ],
  },

  {
    slug: 'iskcon-vrindavan',
    name: 'ISKCON Temple Vrindavan',
    city: 'Vrindavan',
    type: 'temple',
    shortDescription:
      'The International Society for Krishna Consciousness temple — known for its melodious kirtans, peaceful atmosphere, and the majestic Krishna-Balaram deities.',
    thumbnail: '/images/places/iskcon-vrindavan.jpg',
    images: ['/images/places/iskcon-vrindavan.jpg'],
    location: {
      address: 'Bhaktivedanta Swami Marg, Raman Reti, Vrindavan 281121',
      lat: 27.5672,
      lng: 77.6743,
    },
    timings: {
      morning: '4:30 AM – 1:00 PM',
      evening: '4:00 PM – 8:45 PM',
      note: '7 aarti timings daily. Mangala aarti at 4:30 AM is most powerful.',
    },
    entryFee: 'Free',
    timeRequired: '1-2 hours',
    isFeatured: true,
    tags: ['temple', 'vrindavan', 'iskcon', 'kirtan', 'peaceful'],
    sections: [
      {
        type: 'rich_text',
        title: 'About ISKCON Temple Vrindavan',
        content:
          'The ISKCON Krishna-Balaram Mandir in Vrindavan was inaugurated in 1975 by Srila A.C. Bhaktivedanta Swami Prabhupada, the founder of ISKCON. The temple houses three pairs of deities: Krishna-Balaram, Radha-Shyamasundar, and Gaura-Nitai. The marble temple is surrounded by serene gardens, a world-famous goshala (cow sanctuary), and a Vedic cultural center. The kirtan here — devotees singing Krishna\'s names with mridanga and karatalas — creates an atmosphere of profound peace and joy.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Magnificent Krishna-Balaram, Radha-Shyamasundar, and Gaura-Nitai deities',
          'Continuous kirtan — melodious devotional singing throughout the day',
          'Samadhi of Srila Prabhupada — the founder of ISKCON worldwide',
          'Vedic cultural center with books, prasadam restaurant, and guesthouse',
          'Beautiful gardens and a serene cow sanctuary (goshala)',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Prem Mandir',         distance: '1.5 km', time: '6 mins'  },
          { from: 'Banke Bihari Temple', distance: '1.5 km', time: '7 mins'  },
          { from: 'Mathura Junction',    distance: '13 km',  time: '28 mins' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Attend the evening Sandhya aarti at 7 PM — extremely blissful experience',
          'Prasadam (blessed food) is served daily — try the full meal',
          'The guesthouse is a good clean option for devotees staying in Vrindavan',
          'Visit Prabhupada\'s Samadhi — a place of deep peace',
          'Photography is allowed in the gardens but not inside the main shrine',
        ],
      },
    ],
  },

  {
    slug: 'nidhivan',
    name: 'Nidhivan',
    city: 'Vrindavan',
    type: 'sacred-site',
    shortDescription:
      'One of the most mysterious and sacred sites in Vrindavan — a forest where Lord Krishna is believed to perform the Raas Leela every night, leaving evidence of divine presence by morning.',
    thumbnail: '/images/places/nidhivan.jpg',
    images: ['/images/places/nidhivan.jpg'],
    location: {
      address: 'Nidhivan, Vrindavan, Uttar Pradesh 281121',
      lat: 27.5812,
      lng: 77.6943,
    },
    timings: {
      morning: '5:00 AM – 8:00 PM',
      note: 'The forest is locked after 8 PM — no one stays inside overnight.',
    },
    entryFee: 'Free',
    timeRequired: '45 minutes',
    isFeatured: true,
    tags: ['sacred-site', 'vrindavan', 'mysterious', 'raas-leela', 'must-visit'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Nidhivan',
        content:
          'Nidhivan is perhaps the most mysterious place in all of Vrindavan. This ancient forest is believed to be the sacred ground where Radha-Krishna perform the divine Raas Leela every night. The trees in Nidhivan are twisted and intertwined in extraordinary formations — locals believe they transform into gopis (cowherd girls) to participate in the nightly Raas. Every morning, fresh flower petals, paan (betel leaf), and sweets are found placed as if by unseen hands. No animal, bird, or insect remains in the forest after sunset — an unexplained phenomenon that has baffled scientists.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Mysteriously twisted trees believed to be gopis by night',
          'Rang Mahal — Radha\'s chamber where fresh offerings appear every morning',
          'No living creature stays in the forest after 8 PM — a scientific mystery',
          'The forest is completely silent despite being in a busy city',
          'Ancient Banke Bihari idol that was moved to the main temple by Swami Haridas',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Banke Bihari Temple', distance: '0.3 km', time: '3 mins'  },
          { from: 'Mathura Junction',    distance: '14 km',  time: '30 mins' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Visit early morning to see the fresh offerings in Rang Mahal',
          'Do not try to stay after closing time — the site is considered extremely sacred',
          'Maintain silence and respect inside the forest',
          'A local guide can explain the mysteries and stories of each tree',
        ],
      },
    ],
  },

  {
    slug: 'seva-kunj',
    name: 'Seva Kunj',
    city: 'Vrindavan',
    type: 'sacred-site',
    shortDescription:
      'A tranquil garden adjacent to Nidhivan where Krishna performed the eternal Raas Leela with Radha and the gopis — radiating a peace that is felt even today.',
    thumbnail: '/images/places/seva-kunj.jpg',
    images: ['/images/places/seva-kunj.jpg'],
    location: {
      address: 'Seva Kunj, Vrindavan, Uttar Pradesh 281121',
      lat: 27.5810,
      lng: 77.6940,
    },
    timings: { morning: '5:00 AM – 8:00 PM' },
    entryFee: 'Free',
    timeRequired: '30 minutes',
    isFeatured: false,
    tags: ['sacred-site', 'vrindavan', 'garden', 'raas-leela'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Seva Kunj',
        content:
          'Seva Kunj is a serene grove adjacent to Nidhivan, considered to be the site of the eternal Raas Leela. The garden contains ancient trees under which Radha-Krishna are believed to have rested. A small temple houses their footprints. Like Nidhivan, Seva Kunj is also locked after 8 PM and no living creature remains inside overnight.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Sacred site of the eternal Raas Leela',
          'Footprints of Radha-Krishna preserved in the temple',
          'Ancient trees with extraordinary spiritual energy',
          'Peaceful and uncrowded compared to nearby Banke Bihari',
        ],
      },
    ],
  },

  // ─── GOKUL ─────────────────────────────────────────────
  {
    slug: 'raman-reti',
    name: 'Raman Reti',
    city: 'Gokul',
    type: 'sacred-site',
    shortDescription:
      'The sacred sandy playground of Gokul where Lord Krishna spent His divine childhood — the soft golden sand is considered holy, and devotees roll in it as an act of devotion.',
    thumbnail: '/images/places/raman-reti.jpg',
    images: ['/images/places/raman-reti.jpg'],
    location: {
      address: 'Raman Reti, Gokul, Uttar Pradesh 281303',
      lat: 27.4711,
      lng: 77.6711,
    },
    timings: {
      morning: '5:00 AM – 12:00 PM',
      evening: '4:00 PM – 8:00 PM',
    },
    entryFee: 'Free',
    timeRequired: '1-2 hours',
    isFeatured: false,
    tags: ['sacred-site', 'gokul', 'krishna', 'childhood', 'sand'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Raman Reti',
        content:
          'Raman Reti in Gokul is believed to be the very playground where Lord Krishna spent His playful childhood with His friends and cows. The word "Raman" means to play, and "Reti" means sand. The soft, golden sand of this sacred site is considered holy by devotees. Many pilgrims roll in the sand as an act of complete surrender and devotion. The serene surroundings and the gentle sound of cowbells create an atmosphere of deep peace and a connection to Krishna\'s divine pastimes.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Sacred sand — devotees roll in it as an act of devotion',
          'The exact playground of baby Krishna and His friends',
          'Gokul Mahotsav celebrations held here annually',
          'Serene atmosphere ideal for meditation and spiritual reflection',
          'Adjacent Brahmand Ghat where Krishna showed Yashoda the universe',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction', distance: '12 km',  time: '30 mins' },
          { from: 'Vrindavan',        distance: '20 km',  time: '40 mins' },
          { from: 'New Delhi',        distance: '160 km', time: '3.5 hrs' },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Visit early morning for the most serene experience',
          'Combine with Brahmand Ghat and Chaurasi Khamba on the same trip',
          'Taxis and autos from Mathura are available for ₹300-500 for the trip',
          'Carry water — limited facilities in the immediate area',
        ],
      },
    ],
  },

  // ─── GOVARDHAN ─────────────────────────────────────────
  {
    slug: 'govardhan-hill',
    name: 'Govardhan Hill (Giriraj)',
    city: 'Govardhan',
    type: 'hill',
    shortDescription:
      'The sacred hill that Lord Krishna lifted on His little finger to shelter the people of Braj from Indra\'s wrath — the 21 km Govardhan Parikrama is one of the most spiritually powerful walks in India.',
    thumbnail: '/images/places/govardhan-hill.jpg',
    images: ['/images/places/govardhan-hill.jpg'],
    location: {
      address: 'Govardhan, Mathura District, Uttar Pradesh 281502',
      lat: 27.4977,
      lng: 77.4665,
    },
    timings: { morning: 'Open 24 hours — Parikrama can be done any time' },
    entryFee: 'Free',
    timeRequired: '4-6 hours (full Parikrama)',
    isFeatured: true,
    tags: ['hill', 'govardhan', 'parikrama', 'sacred', 'krishna'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Govardhan Hill',
        content:
          'Govardhan Hill (Giriraj) is the sacred hill that Lord Krishna lifted on the little finger of His left hand for seven continuous days to shelter the people of Vrindavan from the devastating rains sent by the angry Indra. The hill is worshipped as a form of Krishna Himself by devotees. The Govardhan Parikrama — a 21 km circumambulation of the hill — is one of the most spiritually charged pilgrimages in India. Millions perform this Parikrama barefoot, rolling on the ground with each step as an act of extreme devotion.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'The 21 km Govardhan Parikrama — a life-transforming experience',
          'Mansi Ganga — the lake at the heart of Govardhan',
          'Radha Kund and Shyam Kund — the holiest lakes in all of Braj',
          'Daan Ghati Temple — where Krishna collected tolls from gopis playfully',
          'Mukharavind — the face of Govardhan Hill, worshipped as Krishna\'s face',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction', distance: '26 km',  time: '45 mins' },
          { from: 'Vrindavan',        distance: '24 km',  time: '40 mins' },
          { from: 'Barsana',          distance: '22 km',  time: '40 mins' },
          { from: 'New Delhi',        distance: '160 km', time: '3 hrs'   },
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Start the Parikrama early at 5 AM to avoid afternoon heat',
          'Wear comfortable footwear — the path is mostly flat but long',
          'Carry water and snacks — many small shops along the Parikrama path',
          'E-rickshaws are available if you cannot complete the full 21 km',
          'Govardhan Puja (Annakut) celebrations here are extraordinary',
          'Stay overnight in Govardhan to do the Parikrama at sunrise',
        ],
      },
      {
        type: 'faq',
        title: 'Frequently Asked Questions',
        items: [
          { question: 'How long does the Govardhan Parikrama take?', answer: 'Walking takes 4-6 hours. E-rickshaw takes about 2 hours. Many devotees take the entire day, stopping at temples along the route.' },
          { question: 'Can elderly people do the Parikrama?',         answer: 'Yes — e-rickshaws cover the entire 21 km route with stops at major temples.' },
          { question: 'What is the best time to visit Govardhan?',    answer: 'Govardhan Puja (Diwali+1 day) and Annakut festival are the most spectacular. Mornings year-round are most peaceful.' },
        ],
      },
    ],
  },

  {
    slug: 'radha-kund',
    name: 'Radha Kund & Shyam Kund',
    city: 'Govardhan',
    type: 'sacred-site',
    shortDescription:
      'The two holiest lakes in all of Braj — created by Radha and Krishna themselves, bathing in Radha Kund on Ashtami is said to grant liberation from the cycle of birth and death.',
    thumbnail: '/images/places/radha-kund.jpg',
    images: ['/images/places/radha-kund.jpg'],
    location: {
      address: 'Radha Kund, Govardhan, Mathura District, Uttar Pradesh',
      lat: 27.5234,
      lng: 77.4834,
    },
    timings: { morning: 'Open 24 hours' },
    entryFee: 'Free',
    timeRequired: '1 hour',
    isFeatured: false,
    tags: ['sacred-site', 'govardhan', 'kund', 'radha', 'holy-lake'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Radha Kund & Shyam Kund',
        content:
          'Radha Kund and Shyam Kund are two adjacent sacred lakes considered the holiest water bodies in all of Braj Mandal. According to scripture, these lakes were created by Radha and Krishna Themselves. Bathing in Radha Kund on the Ashtami (eighth day) of the Krishna paksha in Kartik month is believed to be equivalent to bathing in all the sacred rivers of India. Great Vaishnava saints like Raghunath Das Goswami spent their entire lives meditating at Radha Kund.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Radha Kund — the holiest lake in Braj, created by Srimati Radharani',
          'Shyam Kund — created by Lord Krishna adjacent to Radha Kund',
          'Raghunath Das Goswami\'s bhajan kutir (meditation hut)',
          'Sacred bathing on Bahulastami (Kartik Ashtami) — thousands gather',
          'Surrounded by ancient temples and mediation ashrams',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Govardhan Hill',   distance: '8 km',  time: '15 mins' },
          { from: 'Mathura Junction', distance: '28 km', time: '50 mins' },
          { from: 'Vrindavan',        distance: '28 km', time: '50 mins' },
        ],
      },
    ],
  },

  // ─── BARSANA ────────────────────────────────────────────
  {
    slug: 'radha-rani-temple-barsana',
    name: 'Shri Radha Rani Temple',
    city: 'Barsana',
    type: 'temple',
    shortDescription:
      'The hilltop temple dedicated to Srimati Radharani — the birthplace of Radha and one of the most important pilgrimage sites in Braj, famous for Lathmar Holi.',
    thumbnail: '/images/places/radha-rani-temple-barsana.jpg',
    images: ['/images/places/radha-rani-temple-barsana.jpg'],
    location: {
      address: 'Barsana, Mathura District, Uttar Pradesh 281405',
      lat: 27.6502,
      lng: 77.3829,
    },
    timings: {
      morning: '5:00 AM – 12:00 PM',
      evening: '4:00 PM – 8:00 PM',
    },
    entryFee: 'Free',
    timeRequired: '1-2 hours',
    isFeatured: false,
    tags: ['temple', 'barsana', 'radha', 'lathmar-holi', 'hilltop'],
    sections: [
      {
        type: 'rich_text',
        title: 'About Radha Rani Temple, Barsana',
        content:
          'The Radha Rani Temple (also called Ladli Ji Temple) sits atop a hill in Barsana — the birthplace of Srimati Radharani. The temple is dedicated to Radha in her childhood form as Ladli (beloved one). Barsana is world-famous for its Lathmar Holi — a unique festival where women playfully beat men with sticks (lathis) while the men try to protect themselves with shields, re-enacting the playful Holi Krishna had with the gopis of Barsana.',
      },
      {
        type: 'highlights',
        title: 'Highlights',
        items: [
          'Birthplace of Srimati Radharani — one of the most sacred sites in Braj',
          'World-famous Lathmar Holi — a unique & joyful festival',
          'Hilltop location with panoramic views of the Braj landscape',
          'Ancient temple with beautiful architecture',
          '400 steps lead to the temple — pilgrims climb barefoot in devotion',
        ],
      },
      {
        type: 'distances',
        title: 'Distance from Major Points',
        items: [
          { from: 'Mathura Junction', distance: '48 km', time: '1.5 hrs' },
          { from: 'Nandgaon',         distance: '9 km',  time: '20 mins' },
          { from: 'Vrindavan',        distance: '42 km', time: '1.25 hrs'},
        ],
      },
      {
        type: 'travel_tips',
        title: 'Travel Tips',
        items: [
          'Visit during Lathmar Holi (usually February/March) for a once-in-a-lifetime experience',
          'Wear bright colors when visiting during Holi season',
          'The climb up the steps is manageable — takes about 15-20 minutes',
          'Best combined with Nandgaon (Krishna\'s village) on the same day',
        ],
      },
    ],
  },
]

// Helper to get places by city
export function getPlacesByCity(city: string) {
  return ALL_PLACES.filter((p) => p.city.toLowerCase() === city.toLowerCase())
}

// Helper to get places by type
export function getPlacesByType(type: string) {
  return ALL_PLACES.filter((p) => p.type === type)
}

// Helper to get featured places
export function getFeaturedPlaces() {
  return ALL_PLACES.filter((p) => p.isFeatured)
}