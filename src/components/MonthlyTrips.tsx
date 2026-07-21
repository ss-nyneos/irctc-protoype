import { useState, useEffect } from 'react'
import './MonthlyTrips.css'
import trainLoco from '../assets/trains/vande-bharat-loco.png'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/* Bento slots: row 1 = a, b (wide) · row 2 = c, d, e */
const AREAS = ['a', 'b', 'c', 'd', 'e'] as const

/* A pool of destinations; each month shows a window of five, so the
   places and images rotate as the month changes. */
const POOL = [
  { title: 'Secrets of Kashmir: Uncovering Hidden Valleys', img: '/img/kashmir-hd.jpg' },
  { title: 'Secrets of Ladakh: Uncovering Hidden Monasteries', img: '/img/ladakh.jpg' },
  { title: 'Secrets of Kerala: Uncovering Hidden Backwaters', img: '/img/kerala-backwaters.jpg' },
  { title: 'Secrets of Rajasthan: Uncovering Hidden Palaces', img: '/img/jaipur-hd.jpg' },
  { title: 'Secrets of Varanasi: Uncovering Hidden Ghats', img: '/img/varanasi-hd.jpg' },
  { title: 'Secrets of Rishikesh: Uncovering Hidden Rapids', img: '/img/rishikesh-hd.jpg' },
  { title: 'Secrets of the Andamans: Uncovering Hidden Reefs', img: '/img/andaman-nicobar.webp' },
  { title: 'Secrets of Gangtok: Uncovering Hidden Ridges', img: '/img/gangtok.jpeg' },
  { title: 'Secrets of Hyderabad: Uncovering Hidden Bazaars', img: '/img/hyderabad.webp' },
  { title: 'Secrets of Goa: Uncovering Hidden Shores', img: '/img/goa.jpg' },
  { title: 'Secrets of Havelock: Uncovering Hidden Sands', img: '/img/havelock-hd.jpg' },
  { title: 'Secrets of Agra: Uncovering Hidden Marvels', img: '/img/taj-dawn.jpg' },
]

export default function MonthlyTrips() {
  // default to the current month
  const [active, setActive] = useState(() => new Date().getMonth())

  // auto-rotate to the next month every 4s; a click just resets the timer
  useEffect(() => {
    const id = setTimeout(() => setActive((m) => (m + 1) % 12), 4000)
    return () => clearTimeout(id)
  }, [active])

  const visible = AREAS.map((area, i) => {
    const p = POOL[(active + i) % POOL.length]
    return { area, ...p }
  })

  return (
    <section className="section monthly" id="monthly">
      <div className="wrap-wide">
        <div className="section-head monthly__head">
          <h2 className="h2">
            Find Your Perfect Trip by <span className="monthly__accent">Month</span>
          </h2>
          <img src={trainLoco} className="monthly__train" alt="" aria-hidden="true" />
        </div>

        <div className="monthly__layout">
          <div className="monthly__grid">
            {visible.map((t) => (
              <article
                key={`${active}-${t.area}`}
                className={`mt-card mt-card--${t.area}`}
              >
                <img
                  src={t.img}
                  alt={t.title}
                  className="mt-card__img px-media"
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
