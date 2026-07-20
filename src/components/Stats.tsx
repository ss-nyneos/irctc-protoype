import './Stats.css'
import { Star } from './Icons.tsx'

const avatars = [
  '/img/taj-front.jpg',
  '/img/kerala-backwaters.jpg',
  '/img/hawa-mahal.jpg',
  '/img/goa.jpg',
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="wrap-wide stats__grid">
        {/* ---- travellers ---- */}
        <article className="stat stat--a">
          <img src="/img/kerala-waterfall.jpg" alt="" className="stat__bg" data-parallax="18" loading="lazy" />
          <span className="stat__rings" aria-hidden="true" />
          <div className="stat__body">
            <span className="stat__num">2,40,000+</span>
            <span className="stat__label">Happy travellers a year</span>
            <p className="stat__note">
              Journeys booked with the trust of Indian Railways.
            </p>
          </div>
        </article>

        {/* ---- packages ---- */}
        <article className="stat stat--b">
          <img src="/img/train-scenic.jpg" alt="" className="stat__bg" data-parallax="11" loading="lazy" />
          <div className="stat__body stat__body--bottom">
            <span className="stat__num">1,200+</span>
            <span className="stat__label">Curated packages</span>
            <p className="stat__note">Handpicked across Bharat &amp; beyond</p>
          </div>
        </article>

        {/* ---- quadrant panel ---- */}
        <article className="stat stat--c">
          <img src="/img/taj-dawn.jpg" alt="" className="stat__bg" data-parallax="24" loading="lazy" />
          <div className="quad">
            <div className="quad__cell quad__cell--tl">
              <span className="quad__big">
                4 <em>Luxury Trains</em>
              </span>
              <span className="quad__sub">Maharajas', Golden Chariot &amp; more</span>
            </div>

            <div className="quad__cell">
              <span className="quad__big">100%</span>
              <span className="quad__sub">Secure government payments</span>
            </div>

            <div className="quad__cell">
              <span className="avatars">
                {avatars.map((a) => (
                  <img src={a} alt="" key={a} loading="lazy" />
                ))}
                <span className="avatars__more">+2L</span>
              </span>
              <span className="quad__sub">60,000+ reviews</span>
            </div>

            <div className="quad__cell">
              <span className="quad__big quad__big--rating">
                4.8 <Star />
              </span>
              <span className="quad__sub">Average traveller rating</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
