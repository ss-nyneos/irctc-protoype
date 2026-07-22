/* Two four-image mosaics with angled seams, like the reference tiles. */
const escapes = [
  '/img/ladakh.jpg',
  '/img/mountain-train.jpg',
  '/img/dance-folk.jpg',
  '/img/kerala-waterfall.jpg',
]
const spiritual = [
  '/img/meenakshi.jpg',
  '/img/temple-gopuram.jpg',
  '/img/golden-temple.jpg',
  '/img/varanasi-hd.jpg',
]
/* The two navy "IRCTC Presents" cards. Same layout, different offer. */
const ferryOffers = {
  andaman: {
    img: '/img/havelock-hd.jpg',
    name: 'Andaman Ferry Booking',
    price: 'starting from ₹950/-',
    pill: 'Our Destinations',
    items: ['Swaraj Dweep (Havelock)', 'Shaheed Dweep (Neil)', 'Port Blair'],
  },
  charDham: {
    img: '/img/rishikesh-hd.jpg',
    name: 'Char Dham Heli Yatra',
    price: 'starting from ₹1,10,000/-',
    pill: 'Our Sectors',
    items: ['Kedarnath', 'Badrinath', 'Gangotri & Yamunotri'],
  },
}

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

function FerryCard({ offer }: { offer: (typeof ferryOffers)[keyof typeof ferryOffers] }) {
  return (
    <article className="offer offer--ferry">
      <img src={offer.img} alt="" className="offer__photo" loading="lazy" />
      <span className="offer__wave" aria-hidden="true" />
      <div className="offer__content">
        <span className="offer__kicker">IRCTC Presents</span>
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

function TileCard({ imgs, title, sub }: { imgs: string[]; title: string; sub: string }) {
  return (
    <article className="offer offer--tile">
      <Mosaic imgs={imgs} />
      <div className="offer__caption">
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
    </article>
  )
}

/* One pass of the rail. Rendered twice below so the marquee can loop
   seamlessly: translating the track by exactly -50% lands the duplicate
   set precisely where the original started. */
function OfferSet() {
  return (
    <>
      <FerryCard offer={ferryOffers.andaman} />
      <TileCard imgs={escapes} title="Exciting Escapes" sub="Explore Nature, Wildlife & Culture" />
      <TileCard imgs={spiritual} title="Spiritual Journeys" sub="Heritage. Culture. Timeless Memories." />
      <FerryCard offer={ferryOffers.charDham} />
    </>
  )
}

export default function Offers() {
  return (
    <section className="offers" id="offers">
      <div className="wrap-wide">
        <div className="offers__head">
          <h2 className="offers__title">Special <span>Offers</span></h2>
        </div>
      </div>

      {/* full-bleed rail: the cards drift horizontally in a seamless loop and
          hold still while the pointer is over them */}
      <div className="offers__rail">
        <div className="offers__track">
          <OfferSet />
          {/* duplicate pass — aria-hidden so the loop isn't announced twice */}
          <span className="offers__dup" aria-hidden="true">
            <OfferSet />
          </span>
        </div>
      </div>
    </section>
  )
}
