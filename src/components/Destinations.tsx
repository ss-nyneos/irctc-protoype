import { useEffect, useState, type CSSProperties } from 'react'
import { destinations } from '../data/content.ts'
import { Pin } from './Icons.tsx'

const card =
  'arch absolute top-0 left-1/2 h-full w-[clamp(240px,74vw,320px)] bg-paper-2 shadow-float ' +
  'border border-white/25 ' +
  'transition-[transform,opacity,filter] duration-700 ease-brand ' +
  'min-[641px]:w-[clamp(280px,34vw,430px)]'

/* Glass surface over the photograph: a diagonal specular sheen plus an inset
   rim light, so the card reads as a pane of glass rather than a bare image.
   No backdrop-blur on purpose — it would frost the photo underneath, and the
   brief here has consistently been transparent glass, not frosted. */
const glass =
  'pointer-events-none absolute inset-0 z-[1] ' +
  'bg-[linear-gradient(140deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.08)_34%,rgba(255,255,255,0)_58%,rgba(255,255,255,0.05)_100%)] ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.18)] ' +
  'transition-opacity duration-700 ease-brand'

/* Plain transparent panel — no backdrop blur or saturation, so the photograph
   reads straight through it. A light dark tint stays behind the copy because
   without the blur there is nothing else keeping white text legible on a
   bright frame; the text shadows do the rest. */
const panel =
  'absolute inset-x-[0.9rem] bottom-[0.9rem] z-[2] rounded-[22px] px-[0.85rem] pt-[1.1rem] pb-[1.2rem] ' +
  'border border-white/30 bg-[rgba(10,16,30,0.22)] ' +
  'shadow-[inset_0_1.5px_0_rgba(255,255,255,0.4)] ' +
  'transition-[opacity,transform] duration-500 ease-brand delay-150'

const ROTATE_MS = 4000

export default function Destinations() {
  const n = destinations.length
  const [active, setActive] = useState(Math.floor(n / 2))
  const [paused, setPaused] = useState(false)

  /* Auto-advance the coverflow. Held while the pointer is over the rail or a
     control has keyboard focus, so it never yanks a card out from under
     someone mid-interaction. Skipped entirely under prefers-reduced-motion —
     an unattended looping animation is exactly what that setting is for. */
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused, n, active])

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
    <section className="section overflow-hidden bg-paper" id="destinations">
      <div className="wrap">
        <div className="mb-[clamp(2.4rem,5vw,3.6rem)] text-center [&_.h2]:mx-auto [&_.h2]:max-w-[18ch]">
          <h2 className="h2">The best-kept secrets of <span>India</span></h2>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="relative h-[clamp(360px,46vw,500px)] [perspective:1600px] [transform-style:preserve-3d]"
        >
          {destinations.map((d, i) => {
            const isActive = offsetOf(i) === 0
            return (
              <button
                key={d.id}
                className={`${card} ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
                style={styleFor(i)}
                onClick={() => setActive(i)}
                aria-label={`${d.name}, ${d.state}`}
                aria-current={isActive}
                tabIndex={isActive ? 0 : -1}
              >
                <img
                  src={d.img}
                  alt={`${d.name}, ${d.state}`}
                  loading="lazy"
                  className="img-cover transition-transform duration-1000 ease-brand"
                />
                {/* lighter on the focused card so the photo stays the hero */}
                <span
                  aria-hidden="true"
                  className={`${glass} ${isActive ? 'opacity-60' : 'opacity-100'}`}
                />
                {/* vertical label on the receding cards */}
                <span
                  className={`absolute bottom-[1.2rem] left-[0.7rem] z-[2] rotate-180 [writing-mode:vertical-rl]
                              font-sans text-[1.2rem] font-medium tracking-[0.02em] text-on-dark
                              [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] transition-opacity duration-[400ms]
                              ease-brand min-[641px]:text-[1.5rem] ${isActive ? 'opacity-0' : 'opacity-100'}`}
                >
                  {d.name}
                </span>
                {/* full detail panel on the active card */}
                <div
                  className={`${panel} ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-[14px] opacity-0'}`}
                >
                  <h3 className="border-b border-white/24 pb-[0.7rem] font-sans text-card-title leading-none font-medium text-on-dark [text-shadow:0_1px_14px_rgba(4,10,25,0.5)]">
                    {d.name}
                  </h3>
                  <div className="mt-[0.7rem] flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-[0.35rem] text-[0.95rem] font-semibold text-on-dark [&_svg]:text-blue">
                      <Pin />
                      {d.state}
                    </span>
                    <span className="text-right text-[0.85rem] text-on-dark-soft">{d.kind}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-[clamp(2rem,4vw,3rem)] flex items-center justify-center">
          <div className="flex items-center gap-2" role="tablist" aria-label="Destinations">
            {destinations.map((d, i) => (
              <button
                key={d.id}
                className={`h-2 rounded-full transition-all duration-300 ease-brand ${
                  offsetOf(i) === 0 ? 'w-[26px] bg-blue' : 'w-2 bg-line-strong'
                }`}
                onClick={() => setActive(i)}
                aria-label={d.name}
                aria-selected={offsetOf(i) === 0}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
