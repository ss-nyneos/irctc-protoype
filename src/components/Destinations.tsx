import './Destinations.css'
import { useState, type CSSProperties } from 'react'
import { destinations } from '../data/content.ts'
import { ChevronL, ChevronR, Pin } from './Icons.tsx'

export default function Destinations() {
  const n = destinations.length
  const [active, setActive] = useState(Math.floor(n / 2))

  const go = (dir: number) => setActive((a) => (a + dir + n) % n)

  const offsetOf = (i: number) => {
    let raw = i - active
    if (raw > n / 2) raw -= n
    if (raw < -n / 2) raw += n
    return raw
  }

  const styleFor = (i: number): CSSProperties => {
    const off = offsetOf(i)
    const abs = Math.abs(off)
    if (abs > 2) {
      return { opacity: 0, pointerEvents: 'none', transform: 'translate(-50%,0) scale(.5)' }
    }
    const scale = 1 - abs * 0.13
    const shiftX = off * 58
    const rotate = off === 0 ? 0 : -Math.sign(off) * 7
    return {
      transform: `translateX(calc(-50% + ${shiftX}%)) scale(${scale}) rotateY(${rotate}deg)`,
      zIndex: 10 - abs,
      opacity: abs === 0 ? 1 : abs === 1 ? 0.95 : 0.6,
      filter: abs === 0 ? 'none' : `brightness(${1 - abs * 0.22})`,
    }
  }

  return (
    <section className="section destinations" id="destinations">
      <div className="wrap">
        <div className="destinations__head">
          <h2 className="h2">The best-kept secrets of <span>India</span></h2>
        </div>

        <div className="coverflow">
          {destinations.map((d, i) => {
            const isActive = offsetOf(i) === 0
            return (
              <button
                key={d.id}
                className={`cf-card arch ${isActive ? 'is-active' : ''}`}
                style={styleFor(i)}
                onClick={() => setActive(i)}
                aria-label={`${d.name}, ${d.state}`}
                aria-current={isActive}
                tabIndex={isActive ? 0 : -1}
              >
                <img src={d.img} alt={`${d.name}, ${d.state}`} className="img-cover" loading="lazy" />
                <span className="cf-card__side">{d.name}</span>
                <div className="cf-card__panel">
                  <h3 className="cf-card__name">{d.name}</h3>
                  <div className="cf-card__meta">
                    <span className="cf-card__state">
                      <Pin />
                      {d.state}
                    </span>
                    <span className="cf-card__kind">{d.kind}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="coverflow__nav">
          <button className="cf-arrow" aria-label="Previous destination" onClick={() => go(-1)}>
            <ChevronL />
          </button>
          <div className="cf-dots" role="tablist" aria-label="Destinations">
            {destinations.map((d, i) => (
              <button
                key={d.id}
                className={`cf-dot ${offsetOf(i) === 0 ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={d.name}
                aria-selected={offsetOf(i) === 0}
                role="tab"
              />
            ))}
          </div>
          <button className="cf-arrow" aria-label="Next destination" onClick={() => go(1)}>
            <ChevronR />
          </button>
        </div>

        <div className="destinations__foot">
          <a href="#packages" className="btn btn--primary">
            Explore all destinations
          </a>
        </div>
      </div>
    </section>
  )
}
