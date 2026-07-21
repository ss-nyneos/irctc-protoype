import { useState, type CSSProperties } from 'react'
import { destinations } from '../data/content.ts'
import { ChevronL, ChevronR, Pin } from './Icons.tsx'

const card =
  'arch absolute top-0 left-1/2 h-full w-[clamp(240px,74vw,320px)] bg-paper-2 shadow-float ' +
  'transition-[transform,opacity,filter] duration-700 ease-brand ' +
  'min-[641px]:w-[clamp(280px,34vw,430px)]'

/* Plain transparent panel — no backdrop blur or saturation, so the photograph
   reads straight through it. A light dark tint stays behind the copy because
   without the blur there is nothing else keeping white text legible on a
   bright frame; the text shadows do the rest. */
const panel =
  'absolute inset-x-[0.9rem] bottom-[0.9rem] rounded-[22px] px-[0.85rem] pt-[1.1rem] pb-[1.2rem] ' +
  'border border-white/30 bg-[rgba(10,16,30,0.22)] ' +
  'shadow-[inset_0_1.5px_0_rgba(255,255,255,0.4)] ' +
  'transition-[opacity,transform] duration-500 ease-brand delay-150'

const arrow =
  'grid size-[52px] place-items-center rounded-full border-[1.5px] border-line-strong text-[1.4rem] ' +
  'text-ink transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:border-blue hover:bg-blue hover:text-white'

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
    <section className="section overflow-hidden bg-paper" id="destinations">
      <div className="wrap">
        <div className="mb-[clamp(2.4rem,5vw,3.6rem)] text-center [&_.h2]:mx-auto [&_.h2]:max-w-[18ch]">
          <h2 className="h2">The best-kept secrets of <span>India</span></h2>
        </div>

        <div className="relative h-[clamp(360px,46vw,500px)] [perspective:1600px] [transform-style:preserve-3d]">
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
                {/* vertical label on the receding cards */}
                <span
                  className={`absolute bottom-[1.2rem] left-[0.7rem] rotate-180 [writing-mode:vertical-rl]
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
                  <h3 className="border-b border-white/24 pb-[0.7rem] font-sans text-[1.8rem] leading-none font-medium text-on-dark [text-shadow:0_1px_14px_rgba(4,10,25,0.5)]">
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

        <div className="mt-[clamp(2rem,4vw,3rem)] flex items-center justify-center gap-[1.4rem]">
          <button className={arrow} aria-label="Previous destination" onClick={() => go(-1)}>
            <ChevronL />
          </button>
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
          <button className={arrow} aria-label="Next destination" onClick={() => go(1)}>
            <ChevronR />
          </button>
        </div>

        <div className="mt-[clamp(2rem,4vw,2.8rem)] flex justify-center">
          <a href="#packages" className="btn btn--primary">
            Explore all destinations
          </a>
        </div>
      </div>
    </section>
  )
}
