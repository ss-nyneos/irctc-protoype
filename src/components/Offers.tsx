import { useEffect, useState } from 'react'
import add1 from '@/assets/add1.jpeg'
import add2 from '@/assets/add2.jpeg'

/* Pool of offers for Card 1 (Navy IRCTC Presents Offer) */
const card1Offers = [
  {
    id: 'andaman',
    img: '/img/havelock-hd.jpg',
    kicker: 'IRCTC Presents',
    name: 'Andaman Ferry Booking',
    price: 'starting from ₹950/-',
    pill: 'Our Destinations',
    items: ['Swaraj Dweep (Havelock)', 'Shaheed Dweep (Neil)', 'Port Blair'],
  },
  {
    id: 'chardham',
    img: '/img/rishikesh-hd.jpg',
    kicker: 'IRCTC Presents',
    name: 'Char Dham Heli Yatra',
    price: 'starting from ₹1,10,000/-',
    pill: 'Our Sectors',
    items: ['Kedarnath', 'Badrinath', 'Gangotri & Yamunotri'],
  },
  {
    id: 'kashmir',
    img: '/img/kashmir-hd.jpg',
    kicker: 'IRCTC Presents',
    name: 'Kashmir Paradise Tour',
    price: 'starting from ₹24,990/-',
    pill: 'Valley Special',
    items: ['Srinagar Dal Lake', 'Gulmarg Snow Slopes', 'Pahalgam Trails'],
  },
  {
    id: 'kerala',
    img: '/img/kerala-backwaters.jpg',
    kicker: 'IRCTC Presents',
    name: 'Coastal Kerala Cruise',
    price: 'starting from ₹18,500/-',
    pill: 'Popular Package',
    items: ['Alleppey Houseboat', 'Munnar Tea Hills', 'Kochi Heritage'],
  },
]

type TileData = {
  id: string
  singleImg?: string
  imgs?: string[]
  title: string
  sub: string
}

/* Pool of mosaic & collage images for Card 2 (Exciting Escapes) */
const card2Escapes: TileData[] = [
  {
    id: 'escapes-jaipur',
    singleImg: add1,
    title: 'Highlights of Jaipur',
    sub: 'Explore Forts, Palaces & Pink City Heritage',
  },
  {
    id: 'escapes-1',
    imgs: [
      '/img/ladakh.jpg',
      '/img/mountain-train.jpg',
      '/img/dance-folk.jpg',
      '/img/kerala-waterfall.jpg',
    ],
    title: 'Exciting Escapes',
    sub: 'Explore Nature, Wildlife & Culture',
  },
  {
    id: 'escapes-south',
    singleImg: add2,
    title: 'Highlights of South India',
    sub: 'Temples, Tea Gardens & Backwaters',
  },
  {
    id: 'escapes-2',
    imgs: [
      '/img/kashmir.jpg',
      '/img/goa.jpg',
      '/img/desert-stars.jpg',
      '/img/spice-market.jpg',
    ],
    title: 'Wild & Scenic Escapes',
    sub: 'Valleys, Coasts & Mountain Trails',
  },
]

/* Pool of mosaic & collage images for Card 3 (Spiritual Journeys) */
const card3Spiritual: TileData[] = [
  {
    id: 'spiritual-south',
    singleImg: add2,
    title: 'Highlights of South India',
    sub: 'Heritage, Devotion & Coastal Serenity',
  },
  {
    id: 'spiritual-1',
    imgs: [
      '/img/meenakshi.jpg',
      '/img/temple-gopuram.jpg',
      '/img/golden-temple.jpg',
      '/img/varanasi-hd.jpg',
    ],
    title: 'Spiritual Journeys',
    sub: 'Heritage. Culture. Timeless Memories.',
  },
  {
    id: 'spiritual-jaipur',
    singleImg: add1,
    title: 'Highlights of Jaipur',
    sub: 'Royal Palaces & Cultural Grandeur',
  },
  {
    id: 'spiritual-2',
    imgs: [
      '/img/ayodhya.jpeg',
      '/img/venkateshwara.jpg',
      '/img/srisailam-hyderabad.webp',
      '/img/rishikesh-yoga.jpg',
    ],
    title: 'Sacred Pilgrimages',
    sub: 'Divinity Across Holy Sanctums',
  },
]

function Mosaic({ imgs }: { imgs: string[] }) {
  return (
    <div className="mosaic" aria-hidden="true">
      {imgs.map((src, i) => (
        <span className={`mosaic__cell mosaic__cell--${i + 1}`} key={src + i}>
          <img src={src} alt="" loading="lazy" />
        </span>
      ))}
      <span className="mosaic__slash" />
    </div>
  )
}

function FerryCard({ offer }: { offer: (typeof card1Offers)[number] }) {
  return (
    <article className="offer offer--ferry offer-anim-fade" key={offer.id}>
      <img src={offer.img} alt="" className="offer__photo" loading="lazy" />
      <span className="offer__wave" aria-hidden="true" />
      <div className="offer__content">
        <span className="offer__kicker">{offer.kicker}</span>
        <h3 className="offer__name">{offer.name}</h3>
        <p className="offer__price">{offer.price}</p>
        <span className="offer__pill">{offer.pill}</span>
        <ul className="offer__list">
          {offer.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function TileCard({ data }: { data: TileData }) {
  return (
    <article className="offer offer--tile offer-anim-fade" key={data.id}>
      {data.singleImg ? (
        <div className="offer__single-frame">
          <img
            src={data.singleImg}
            alt={data.title}
            className="offer__single-img"
            loading="lazy"
          />
        </div>
      ) : (
        <Mosaic imgs={data.imgs || []} />
      )}
      <div className="offer__caption">
        <h3>{data.title}</h3>
        <p>{data.sub}</p>
      </div>
    </article>
  )
}

export default function Offers() {
  const [c1Index, setC1Index] = useState(0)
  const [c2Index, setC2Index] = useState(0)
  const [c3Index, setC3Index] = useState(0)

  useEffect(() => {
    let t1: NodeJS.Timeout
    let t2: NodeJS.Timeout
    let tNext: NodeJS.Timeout
    let active = true

    const runSequence = () => {
      // 1. Change Card 1 image / offer
      setC1Index((prev) => (prev + 1) % card1Offers.length)

      // 2. 2 seconds later -> Change Card 2 image / offer
      t1 = setTimeout(() => {
        if (!active) return
        setC2Index((prev) => (prev + 1) % card2Escapes.length)

        // 3. 2 seconds later (4s total) -> Change Card 3 image / offer
        t2 = setTimeout(() => {
          if (!active) return
          setC3Index((prev) => (prev + 1) % card3Spiritual.length)
        }, 2000)
      }, 2000)

      // 4. Repeat cycle every 15 seconds
      tNext = setTimeout(() => {
        if (!active) return
        runSequence()
      }, 15000)
    }

    // Initial 15 sec delay before first rotation cycle starts
    const initialDelay = setTimeout(() => {
      if (active) runSequence()
    }, 15000)

    return () => {
      active = false
      clearTimeout(initialDelay)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(tNext)
    }
  }, [])

  return (
    <section className="offers" id="offers">
      <div className="wrap-wide">
        <div className="offers__head">
          <h2 className="offers__title">
            Special <span>Offers</span>
          </h2>
        </div>

        {/* Static 3-card grid with staggered image transitions */}
        <div className="offers__grid">
          <FerryCard offer={card1Offers[c1Index]} />
          <TileCard data={card2Escapes[c2Index]} />
          <TileCard data={card3Spiritual[c3Index]} />
        </div>
      </div>
    </section>
  )
}
