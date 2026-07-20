import './Experiences.css'
import { experiences } from '../data/content.ts'

/* Reference bento: one tall feature on the left, two stacked on the
   right, two along the base. Each slot maps to a named grid area. */
const LAYOUT = [
  { id: 'aarti', area: 'feature' },
  { id: 'dance', area: 'topA' },
  { id: 'thali', area: 'topB' },
  { id: 'spice', area: 'botA' },
  { id: 'yoga', area: 'botB' },
] as const

export default function Experiences() {
  const byId = new Map(experiences.map((x) => [x.id, x]))

  return (
    <section className="section experiences" id="experiences">
      <div className="wrap-wide">
        <div className="section-head experiences__head">
          <h2 className="h2">
            Come for the sights,<br />stay for the rituals.
          </h2>
        </div>

        <div className="exp-grid">
          {LAYOUT.map(({ id, area }, i) => {
            const x = byId.get(id)
            if (!x) return null
            const feature = area === 'feature'
            return (
              <article
                key={id}
                className={`exp-card reveal${feature ? ' exp-card--feature' : ''}`}
                style={{ gridArea: area }}
              >
                <img
                  src={x.img}
                  alt={x.title}
                  className="exp-card__img px-media"
                  data-parallax={feature ? '8' : '14'}
                  loading="lazy"
                />
                <div className="exp-card__glass" />
                <div className="exp-card__scrim" />
                <span className="exp-card__num">{String(i + 1).padStart(2, '0')}</span>
                <div className="exp-card__body">
                  <h3 className="exp-card__title">{x.title}</h3>
                  <p className="exp-card__blurb">{x.blurb}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
