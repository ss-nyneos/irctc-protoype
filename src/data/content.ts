/* ============================================================
   Content — the single source of truth for the home page.
   Real IRCTC Tourism information: packages, experiences,
   heritage trains, pilgrimage circuits, FAQs, contact,
   part-payment rules, and the footer sitemap.
   Imagery lives in /public/img and is referenced by path.
   ============================================================ */

import deccanImg from '../assets/trains/deccan-odyssey.jpg'
import maharajasImg from '../assets/trains/maharajas-express.jpg'
import goldenChariotImg from '../assets/trains/golden-chariot.jpg'
import palaceImg from '../assets/trains/palace-on-wheels.jpg'
import kashiImg from '../assets/places/kashi_vishwanath.png'
import venkateshwaraImg from '../assets/places/venkateshwara_temple.png'

export interface NavItem {
  label: string
  href: string
}

export type ServiceIcon =
  | 'plane'
  | 'bed'
  | 'bus'
  | 'key'
  | 'sofa'
  | 'compass'
  | 'heli'
  | 'ferry'

export interface QuickService {
  label: string
  icon: ServiceIcon
  href: string
}

export interface Package {
  id: string
  title: string
  place: string
  route: string
  nights: number
  days: number
  price: number
  tag: string
  img: string
  desc: string
  /** IRCTC package code, e.g. EHH121 */
  code?: string
  /** boarding point(s) */
  origin?: string
  /** departure frequency */
  departure?: string
}

export interface Experience {
  id: string
  title: string
  blurb: string
  img: string
  span: 'tall' | 'wide' | 'std'
}

export interface Destination {
  id: string
  name: string
  state: string
  kind: string
  img: string
}

export interface Train {
  id: string
  name: string
  /** small gold eyebrow inside the carriage */
  tagline: string
  /** dotted route line */
  route: string
  img: string
  /** carriage livery — outer frame colour */
  frame: string
  /** drape colours, keyed to the photograph inside the carriage */
  drape: { light: string; mid: string; dark: string }
}

export interface Pilgrimage {
  id: string
  name: string
  place: string
  img: string
}

export interface Faq {
  q: string
  a: string
  img: string
}

export interface FooterColumn {
  title: string
  links: string[]
}

export const contact = {
  tollFree: '1800-110-139',
  tollFreeRaw: '1800110139',
  landline: '080-4464 7998',
  landlineAlt: '080-3573 4998',
  email: 'tourism@irctc.com',
  address: ['Statesman House, Barakhamba Road', 'New Delhi 110001, India'],
} as const

export const nav: NavItem[] = [
  { label: 'Packages', href: '#packages' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Heritage Trains', href: '#trains' },
  { label: 'Pilgrimage', href: '#pilgrimage' },
]

export const quickServices: QuickService[] = [
  { label: 'Flights', icon: 'plane', href: 'https://air.irctc.co.in' },
  { label: 'Hotels', icon: 'bed', href: 'https://hotels.irctc.co.in' },
  { label: 'Buses', icon: 'bus', href: 'https://bus.irctc.co.in' },
  { label: 'Retiring Room', icon: 'key', href: 'https://rr.irctc.co.in' },
  { label: 'Lounge', icon: 'sofa', href: '#' },
  { label: 'Packages', icon: 'compass', href: '#packages' },
  { label: 'Heli Yatra', icon: 'heli', href: 'https://heliyatra.irctc.co.in' },
  { label: 'Ferry', icon: 'ferry', href: '#' },
]

export const packages: Package[] = [
  {
    id: 'sikkim-silver',
    title: 'Sikkim Silver',
    place: 'Sikkim',
    route: 'Darjeeling · Gangtok · Kalimpong',
    nights: 5,
    days: 6,
    price: 18610,
    tag: 'Hill Escape',
    code: 'EHH121',
    origin: 'Bagdogra / New Jalpaiguri',
    departure: 'Daily',
    img: '/img/gangtok.jpeg',
    desc: 'Kanchenjunga at first light, Darjeeling\u2019s tea slopes and the monastery ridges above Gangtok. Six days across the eastern Himalaya, boarding at Bagdogra or New Jalpaiguri.',
  },
  {
    id: 'family-andaman-gold',
    title: 'Family Andaman Holidays \u2014 Gold',
    place: 'Andaman',
    route: 'Havelock · Neil · Port Blair',
    nights: 5,
    days: 6,
    price: 25000,
    tag: 'Islands',
    code: 'EHH96',
    origin: 'Port Blair',
    departure: 'Daily',
    img: '/img/havelock-hd.jpg',
    desc: 'Radhanagar\u2019s white sand, Neil\u2019s coral shallows and Port Blair\u2019s colonial harbour \u2014 built for families, with stays and transfers handled end to end.',
  },
  {
    id: 'spiritual-telangana',
    title: 'Spiritual Telangana with Srisailam',
    place: 'Telangana',
    route: 'Hyderabad · Srisailam · Yadadri',
    nights: 3,
    days: 4,
    price: 15430,
    tag: 'Heritage',
    code: 'SHH004',
    origin: 'Hyderabad',
    departure: 'All days except Friday',
    img: '/img/srisailam-hyderabad.webp',
    desc: 'Srisailam\u2019s hilltop jyotirlinga, the golden gopuram at Yadadri and Hyderabad in between. Four days of darshan with cab, hotel and meals included.',
  },
  {
    id: 'mesmerizing-keralam',
    title: 'Mesmerizing Keralam',
    place: 'Kerala',
    route: 'Munnar · Thekkady · Alleppey · Kumarakom',
    nights: 6,
    days: 7,
    price: 26185,
    tag: 'Backwaters',
    code: 'SEH047',
    origin: 'Kochi',
    departure: 'Every day',
    img: '/img/kerala-backwaters.jpg',
    desc: 'Munnar\u2019s tea hills, Thekkady\u2019s spice trails and a night afloat on the Alleppey backwaters. The long version of Kerala, finishing at Kumarakom.',
  },
  {
    id: 'keralam-gods-own',
    title: 'Keralam \u2014 God\u2019s Own Country',
    place: 'Kerala',
    route: 'Kochi · Munnar · Thekkady',
    nights: 3,
    days: 4,
    price: 13350,
    tag: 'Backwaters',
    code: 'SEH049',
    origin: 'Kochi',
    departure: 'Every day',
    img: '/img/coastal-kerala.webp',
    desc: 'Kochi, Munnar and Thekkady in four unhurried days \u2014 tea estates by morning, cardamom air by evening.',
  },
  {
    id: 'lively-leh-ladakh',
    title: 'Lively Leh Ladakh',
    place: 'Ladakh',
    route: 'Leh · Ladakh, ex Coimbatore',
    nights: 7,
    days: 8,
    price: 45300,
    tag: 'High Altitude',
    code: 'SEA56',
    origin: 'Coimbatore',
    departure: '25 Jul 2026',
    img: '/img/ladakh.jpg',
    desc: 'Pangong\u2019s changing blues, the dunes of Nubra and monasteries clinging to the cliffs. Flights from Coimbatore, eight days at the top of the country.',
  },
  {
    id: 'essence-of-keralam',
    title: 'Essence of Keralam',
    place: 'Kerala',
    route: 'Munnar · Thekkady · Kanyakumari · Kumarakom',
    nights: 7,
    days: 8,
    price: 31665,
    tag: 'Backwaters',
    code: 'SEH046',
    origin: 'Kochi',
    departure: 'Every day',
    img: '/img/coastal-kerala.webp',
    desc: 'Kathakali under lamplight, the three seas at Kanyakumari and backwater evenings at Kumarakom \u2014 Kerala\u2019s fullest circuit in eight days.',
  },
  {
    id: 'beautiful-gangtok',
    title: 'Beautiful Gangtok',
    place: 'Sikkim',
    route: 'Gangtok · Tsomgo Lake',
    nights: 3,
    days: 4,
    price: 14650,
    tag: 'Hill Escape',
    code: 'EHH139',
    origin: 'Bagdogra / New Jalpaiguri',
    departure: 'Daily',
    img: '/img/gangtok.jpeg',
    desc: 'Tsomgo Lake, yak trails and the ridge-top capital of Sikkim \u2014 a short Himalayan break with cab, hotel and meals arranged.',
  },
  {
    id: 'ram-lalla-ayodhya',
    title: 'Ram Lalla Darshan, Ayodhya',
    place: 'Ayodhya',
    route: 'Delhi · Ayodhya',
    nights: 1,
    days: 2,
    price: 9700,
    tag: 'Heritage',
    code: 'NDR012',
    origin: 'Delhi',
    departure: 'Every Friday & Saturday',
    img: '/img/ayodhya.jpeg',
    desc: 'An overnight run from Delhi for Ram Lalla darshan at Ayodhya, with rail, cab, hotel and meals in a single booking.',
  },
  {
    id: 'magical-andaman-gold',
    title: 'Magical Andaman Holiday \u2014 Gold',
    place: 'Andaman',
    route: 'Port Blair · Neil · Havelock',
    nights: 4,
    days: 5,
    price: 26200,
    tag: 'Islands',
    code: 'EHH140',
    origin: 'Port Blair',
    departure: 'Every day',
    img: '/img/andaman-nicobar.webp',
    desc: 'Five days between Port Blair, Neil and Havelock \u2014 reef water, near-empty beaches and slow island ferries.',
  },
  {
    id: 'highlights-hyderabad',
    title: 'Highlights of Hyderabad',
    place: 'Hyderabad',
    route: 'Charminar · Golconda · Ramoji',
    nights: 2,
    days: 3,
    price: 9020,
    tag: 'Heritage',
    code: 'SHH001',
    origin: 'Hyderabad',
    departure: 'All days except Friday',
    img: '/img/hyderabad.webp',
    desc: 'The bazaars around Charminar, the ramparts of Golconda and the film lots at Ramoji \u2014 three days in the Deccan\u2019s grandest city.',
  },
  {
    id: 'yadadri-chilkur',
    title: 'Yadadri & Chilkur Balaji Darshan',
    place: 'Telangana',
    route: 'Secunderabad · Yadadri · Ramoji',
    nights: 3,
    days: 4,
    price: 12860,
    tag: 'Heritage',
    code: 'SHH009',
    origin: 'Hyderabad / Yadadri',
    departure: 'All days except Friday',
    img: '/img/meenakshi.jpg',
    desc: 'Balaji darshan at Yadadri and Chilkur, paired with a day at Ramoji Film City \u2014 four days of temples and spectacle.',
  },
]

export const experiences: Experience[] = [
  {
    id: 'dance',
    title: 'Classical Dance & Kathakali',
    blurb: 'Front-row seats to Kathakali, Bharatanatyam and folk stages.',
    img: '/img/kathakali.webp',
    span: 'tall',
  },
  {
    id: 'aarti',
    title: 'Ganga Aarti at Varanasi',
    blurb: 'Lamps, conch and river at the oldest living city on earth.',
    img: '/img/varanasi-hd.jpg',
    span: 'wide',
  },
  {
    id: 'thali',
    title: 'Regional Thali Feasts',
    blurb: 'Twenty bowls, one leaf — a whole region on a single plate.',
    img: '/img/thali-hd.jpg',
    span: 'std',
  },
  {
    id: 'spice',
    title: 'Spice Trails & Bazaar Walks',
    blurb: 'Cardamom, saffron and stories through the oldest markets.',
    img: '/img/bazaar-walks.jpeg',
    span: 'std',
  },
  {
    id: 'stars',
    title: 'Stargazing in the Thar',
    blurb: 'Desert silence, a charpai and the full spread of the night sky.',
    img: '/img/desert-stars.jpg',
    span: 'wide',
  },
  {
    id: 'yoga',
    title: 'Yoga & Wellness, Rishikesh',
    blurb: 'Sunrise asanas where the Ganga leaves the mountains.',
    img: '/img/rishikesh-hd.jpg',
    span: 'tall',
  },
]

export const destinations: Destination[] = [
  { id: 'kashmir', name: 'Srinagar', state: 'Jammu & Kashmir', kind: 'Dal Lake · Shikara', img: '/img/kashmir-hd.jpg' },
  { id: 'kerala', name: 'Alleppey', state: 'Kerala', kind: 'Backwaters · Houseboat', img: '/img/kerala-backwaters.jpg' },
  { id: 'ladakh', name: 'Leh', state: 'Ladakh', kind: 'High Desert · Monastery', img: '/img/ladakh.jpg' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', kind: 'Pink City · Forts', img: '/img/jaipur-hd.jpg' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', kind: 'Ghats · Ganga', img: '/img/varanasi-hd.jpg' },
  { id: 'andaman', name: 'Havelock', state: 'Andaman & Nicobar', kind: 'Coral · White Sand', img: '/img/havelock-hd.jpg' },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', kind: 'Himalaya · Ganga', img: '/img/rishikesh-hd.jpg' },
]

/* The four luxury tourist trains, with their carriage liveries */
export const trains: Train[] = [
  {
    id: 'deccan-odyssey',
    name: 'Deccan Odyssey',
    tagline: "Maharashtra's Blue Jewel",
    route: 'Mumbai • Konkan • Goa',
    img: deccanImg,
    frame: '#1e3f7a', // blue, like its dining-car upholstery
    drape: { light: '#4a7fd0', mid: '#1e3f7a', dark: '#0c1c3c' },
  },
  {
    id: 'maharajas',
    name: "Maharajas' Express",
    tagline: "The World's Leading Luxury Train",
    route: 'Delhi • Agra • Rajasthan',
    img: maharajasImg,
    frame: '#7d1f22', // deep red livery
    drape: { light: '#b52f28', mid: '#7d1f22', dark: '#3c090c' },
  },
  {
    id: 'golden-chariot',
    name: 'Golden Chariot',
    tagline: 'Pride of the South',
    route: 'Karnataka • Goa',
    img: goldenChariotImg,
    frame: '#62276f', // purple livery
    drape: { light: '#9243a4', mid: '#62276f', dark: '#2c1033' },
  },
  {
    id: 'palace-on-wheels',
    name: 'Palace on Wheels',
    tagline: "Rajasthan's Royal Ride",
    route: 'Delhi • Jaipur • Udaipur',
    img: palaceImg,
    frame: '#0f6b6b', // teal drapes and gold interior
    drape: { light: '#2ea9a0', mid: '#0f6b6b', dark: '#053434' },
  },
]

export const pilgrimage: Pilgrimage[] = [
  { id: 'kashi', name: 'Kashi Vishwanath', place: 'Varanasi', img: kashiImg },
  { id: 'golden-temple', name: 'Harmandir Sahib', place: 'Amritsar', img: '/img/harmandir-sahib.webp' },
  { id: 'meenakshi', name: 'Meenakshi Amman', place: 'Madurai', img: '/img/meenakshi-amman.webp' },
  { id: 'tirupati', name: 'Sri Venkateswara', place: 'Tirupati', img: venkateshwaraImg },
]

export const ecosystem: string[] = [
  'Bharat Gaurav',
  "Maharajas' Express",
  'Golden Chariot',
  'Buddhist Circuit',
  'Hill Railways',
  'Char Dham',
  'Incredible India',
  'Dekho Apna Desh',
]

export const faqs: Faq[] = [
  {
    q: 'How do I book an IRCTC tour package?',
    a: 'Search a destination or theme from the strip above, open any package, choose your departure date and boarding point, then proceed to pay. Registered and guest users can both book online; bookings above ₹50,000 also qualify for the part-payment scheme.',
    img: '/img/havelock-hd.jpg',
  },
  {
    q: 'What does a tour package include?',
    a: 'Most packages bundle accommodation, daily breakfast and selected meals, sightseeing transfers, applicable rail or air travel, and on-tour assistance. Exact inclusions and exclusions are listed on every package detail page before you pay.',
    img: '/img/kerala-backwaters.jpg',
  },
  {
    q: 'How do I book a hotel or retiring room through IRCTC?',
    a: 'Hotels are booked on the dedicated IRCTC Hotels portal, and retiring rooms through the Retiring Room service — both reachable from the top navigation. Your IRCTC login carries across, so there is no second account to create.',
    img: '/img/goa.jpg',
  },
  {
    q: 'What are the most popular pilgrimage journeys?',
    a: 'Char Dham, Vaishno Devi, Tirupati, Kashi Vishwanath, Shirdi, Ujjain, Rameswaram and the Buddhist Circuit are among the most-booked — several running as dedicated Bharat Gaurav and Buddhist Circuit trains.',
    img: '/img/varanasi-hd.jpg',
  },
  {
    q: 'Can I book international tour packages too?',
    a: 'Yes. Switch to International in the search strip. Itineraries cover Europe, Nepal, Sri Lanka, Thailand, Singapore–Malaysia, Vietnam, Japan and the UAE, all through the same secure IRCTC checkout.',
    img: '/img/ladakh.jpg',
  },
  {
    q: 'How does part payment work?',
    a: 'On bookings above ₹50,000 you can pay a share now and the balance at least 30 days before departure. Air packages split 30/70 and all others 25/75. See the full terms from the Part Payment link in the header.',
    img: '/img/train-interior.jpg',
  },
]

export const partPayment = {
  title: 'How Part Payment works',
  intro:
    'Book now and pay the balance closer to departure. These terms are set by IRCTC and apply exactly as written.',
  rules: [
    'Available on bookings above ₹50,000 per transaction.',
    'Open to registered users, guest users and IRCTC counters — not to agents booking online.',
    'Minimum advance reservation period: 35 days before departure.',
    'Split for Domestic & International air packages is 30% now / 70% later.',
    'Split for all other packages is 25% now / 75% later.',
    'The balance is due at least 30 days before departure, or the booking auto-cancels.',
    'Partial passenger cancellation is not allowed — only full cancellation, with applicable charges.',
  ],
  escalation: 'portal@irctc.com',
} as const

export const states: string[] = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'INTERNATIONAL',
]

export const app = {
  rating: '4.1',
  android: 'https://play.google.com/store/apps/details?id=com.irctc.tourism_new',
  ios: 'https://apps.apple.com/app/id1452471610',
} as const

export const footer: {
  columns: FooterColumn[]
  social: string[]
  partners: string[]
} = {
  columns: [
    {
      title: 'Services',
      links: ['Flights', 'Buses', 'Hotels', 'Retiring Rooms', 'e-Ticketing', 'e-Catering', 'Travel Agents'],
    },
    {
      title: 'Domestic Tours',
      links: ['Agra', 'Andaman', 'Goa', 'Gujarat', 'Kerala', 'Ladakh', 'Ooty', 'Rajasthan'],
    },
    {
      title: 'Pilgrimage',
      links: ['Char Dham', 'Puri', 'Rameswaram', 'Shirdi', 'Tirupati', 'Ujjain', 'Vaishno Devi', 'Varanasi'],
    },
    {
      title: 'International',
      links: ['Europe', 'Japan', 'Nepal', 'Singapore–Malaysia', 'Sri Lanka', 'Thailand', 'UAE', 'Vietnam'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Bharat Gaurav', 'Travel Advisory', 'Media Corner', 'Gallery', 'Blog', 'FAQ', 'Contact Us'],
    },
  ],
  social: ['Facebook', 'Instagram', 'YouTube', 'LinkedIn', 'WhatsApp', 'Telegram', 'X'],
  partners: ['Incredible India', 'Buddhist Train', "Maharajas'", 'Golden Chariot'],
}
