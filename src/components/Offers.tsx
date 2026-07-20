import './Offers.css'
import { ChevronL, ChevronR, Ferry, Mountain, Temple } from './Icons.tsx'

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
  '/img/varanasi-ghats.jpg',
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

export default function Offers() {
  return (
    <section className="offers" id="offers">
      <div className="wrap-wide">
        <div className="offers__head">
          <h2 className="offers__title">Special Offers</h2>
          <span className="offers__rule" aria-hidden="true" />
          <div className="offers__nav">
            <button className="offers__arrow" aria-label="Previous offers">
              <ChevronL />
            </button>
            <button className="offers__arrow" aria-label="Next offers">
              <ChevronR />
            </button>
          </div>
        </div>

        <div className="offers__grid">
          {/* ---- ferry offer ---- */}
          <article className="offer offer--ferry">
            <img
              src="/img/andaman.jpg"
              alt=""
              className="offer__photo"
              data-parallax="12"
              loading="lazy"
            />
            <span className="offer__wave" aria-hidden="true" />
            <div className="offer__content">
              <span className="offer__kicker">IRCTC Presents</span>
              <h3 className="offer__name">Andaman Ferry Booking</h3>
              <p className="offer__price">starting from ₹950/-</p>
              <span className="offer__pill">Our Destinations</span>
              <ul className="offer__list">
                <li>Swaraj Dweep (Havelock)</li>
                <li>Shaheed Dweep (Neil)</li>
                <li>Port Blair</li>
              </ul>
            </div>
            <span className="offer__badge" aria-hidden="true">
              <Ferry />
            </span>
          </article>

          {/* ---- escapes ---- */}
          <article className="offer offer--tile">
            <Mosaic imgs={escapes} />
            <span className="offer__badge" aria-hidden="true">
              <Mountain />
            </span>
            <div className="offer__caption">
              <h3>Exciting Escapes</h3>
              <p>Explore Nature, Wildlife &amp; Culture</p>
            </div>
          </article>

          {/* ---- spiritual ---- */}
          <article className="offer offer--tile">
            <Mosaic imgs={spiritual} />
            <span className="offer__badge" aria-hidden="true">
              <Temple />
            </span>
            <div className="offer__caption">
              <h3>Spiritual Journeys</h3>
              <p>Heritage. Culture. Timeless Memories.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
