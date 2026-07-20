import './Trending.css'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { packages } from '../data/content.ts'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function Trending() {
  // duplicated so the horizontal loop is seamless
  const loop = [...packages, ...packages]
  const trackRef = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState<number | null>(null)

  /* Measure one full set (cards + gaps) so the loop travels an exact pixel
     distance. A percentage would re-resolve when a card widens on hover and
     make the whole rail jump. */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0
      setDist((el.scrollWidth + gap) / 2)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section className="trend" id="packages">
      <div className="wrap-wide">
        <h2 className="h2 trend__title">
          Trending <span>Packages</span>
        </h2>
      </div>

      <div className="trend__marquee">
        <div
          className="trend__track"
          ref={trackRef}
          style={dist ? ({ ['--loop' as string]: `${dist}px` } as CSSProperties) : undefined}
        >
          {loop.map((p, i) => (
            <article className="tcard" key={`${p.id}-${i}`}>
              <img src={p.img} alt={p.place} className="tcard__img" loading="lazy" />
              <span className="tcard__scrim" aria-hidden="true" />

              <div className="tcard__price">
                <span className="tcard__from">Starting from</span>
                <span className="tcard__amt">{inr(p.price)}</span>
                <span className="tcard__book">Book Now</span>
              </div>

              <div className="tcard__body">
                <span className="tcard__dur">
                  {p.nights} Nights / {p.days} Days
                </span>
                <h3 className="tcard__name">{p.title}</h3>
                <p className="tcard__desc">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
