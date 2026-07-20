import { useState } from 'react'
import './MonthlyTrips.css'
import trainLoco from '../assets/trains/vande-bharat-loco.png'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/* Row 1: two wide cards (a, b). Row 2: three cards (c, d, e). */
const TRIPS = [
  { area: 'a', title: 'Secrets of Kashmir: Uncovering Hidden Valleys', img: '/img/kashmir.jpg' },
  { area: 'b', title: 'Secrets of Ladakh: Uncovering Hidden Monasteries', img: '/img/ladakh.jpg' },
  { area: 'c', title: 'Secrets of Kerala: Uncovering Hidden Backwaters', img: '/img/kerala-backwaters.jpg' },
  { area: 'd', title: 'Secrets of Rajasthan: Uncovering Hidden Palaces', img: '/img/hawa-mahal.jpg' },
  { area: 'e', title: 'Secrets of Varanasi: Uncovering Hidden Ghats', img: '/img/varanasi-ghats.jpg' },
] as const

export default function MonthlyTrips() {
  const [active, setActive] = useState(0)

  return (
    <section className="section monthly" id="monthly">
      <div className="wrap-wide">
        <div className="section-head monthly__head">
          <h2 className="h2">
            Find Your Perfect Trip <span className="monthly__accent">by Month</span>
          </h2>
          <img src={trainLoco} className="monthly__train" alt="" aria-hidden="true" />
        </div>

        <div className="monthly__layout">
          <div className="monthly__grid">
            {TRIPS.map((t) => (
              <article key={t.area} className={`mt-card mt-card--${t.area} reveal`}>
                <img
                  src={t.img}
                  alt={t.title}
                  className="mt-card__img px-media"
                  data-parallax="12"
                  loading="lazy"
                />
                <div className="mt-card__scrim" />
                <h3 className="mt-card__title">{t.title}</h3>
              </article>
            ))}
          </div>

          <nav className="monthly__months" aria-label="Choose a month">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                type="button"
                className={`month${i === active ? ' is-active' : ''}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
              >
                {m}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
