import { trains, type Train } from '../data/content.ts'
import { Arrow } from './Icons.tsx'

/* Drape silhouettes.
   Wide across the top, swept inward and cinched at the tie-back (~56% down),
   then the fabric curls back out and falls away into shadow. */
const DRAPE_R = 'M100 0 L4 0 C28 62 6 132 62 190 C30 244 22 300 18 340 L100 340 Z'
const DRAPE_L = 'M0 0 L96 0 C72 62 94 132 38 190 C70 244 78 300 82 340 L0 340 Z'

/* The curl: the lit leading edge of the swept fabric. */
const CURL_R = 'M4 0 C28 62 6 132 62 190 C30 244 22 300 18 340'
const CURL_L = 'M96 0 C72 62 94 132 38 190 C70 244 78 300 82 340'

function Curtain({ side, id }: { side: 'l' | 'r'; id: string }) {
  const isL = side === 'l'
  return (
    <span className={`curtain curtain--${side}`} aria-hidden="true">
      <svg className="curtain__svg" viewBox="0 0 100 340" preserveAspectRatio="none">
        <path d={isL ? DRAPE_L : DRAPE_R} fill={`url(#fold-${id})`} />
        <path d={isL ? DRAPE_L : DRAPE_R} fill="url(#drapeShade)" />
        <path
          d={isL ? CURL_L : CURL_R}
          fill="none"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="tieback">
        <span className="tieback__cord" />
        <span className="tassel">
          <span className="tassel__head" />
          <span className="tassel__body" />
        </span>
      </span>
    </span>
  )
}

function Carriage({ t }: { t: Train }) {
  return (
    <article className="carriage" style={{ ['--frame' as string]: t.frame }}>
      <div className="carriage__box">
        <span className="knob knob--l" aria-hidden="true" />
        <span className="knob knob--r" aria-hidden="true" />

        <a href="#trains" className="carriage__window">
          <img src={t.img} alt={t.name} className="carriage__img" loading="lazy" />

          <Curtain side="l" id={t.id} />
          <Curtain side="r" id={t.id} />

          <span className="carriage__scrim" aria-hidden="true" />
          <span className="carriage__pin" aria-hidden="true" />

          <span className="carriage__text">
            <span className="carriage__tag">{t.tagline}</span>
            <span className="carriage__name">{t.name}</span>
            <span className="carriage__route">{t.route}</span>
          </span>
          <span className="carriage__arrow" aria-hidden="true">
            <Arrow />
          </span>
        </a>
      </div>
    </article>
  )
}

export default function Trains() {
  const consist = [...trains, ...trains]

  return (
    <section className="luxe" id="trains">
      {/* one fold gradient per train, plus a shared vertical shade */}
      <svg className="luxe__defs" aria-hidden="true" focusable="false">
        <defs>
          {trains.map((t) => (
            <linearGradient id={`fold-${t.id}`} key={t.id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={t.drape.dark} />
              <stop offset="10%" stopColor={t.drape.light} />
              <stop offset="22%" stopColor={t.drape.mid} />
              <stop offset="36%" stopColor={t.drape.light} />
              <stop offset="50%" stopColor={t.drape.mid} />
              <stop offset="64%" stopColor={t.drape.light} />
              <stop offset="78%" stopColor={t.drape.dark} />
              <stop offset="90%" stopColor={t.drape.mid} />
              <stop offset="100%" stopColor={t.drape.dark} />
            </linearGradient>
          ))}
          <linearGradient id="drapeShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="45%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="72%" stopColor="#000" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>

      <div className="wrap-wide">
        <h2 className="h2 luxe__title">
          India's luxury tourist <span>trains</span>
        </h2>
      </div>

      <div className="luxe__rail-area">
        <div className="luxe__consist">
          {consist.map((t, i) => (
            <Carriage t={t} key={`${t.id}-${i}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
