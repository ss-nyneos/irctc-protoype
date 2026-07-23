import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import trainLoco from '../assets/trains/vande-bharat-loco.png'

gsap.registerPlugin(ScrollTrigger)

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const SLOTS = [
  {
    area: 'a',
    place: '[grid-area:a]',
    radius: 'rounded-[var(--mt-sm)_var(--mt-sm)_var(--mt-big)_var(--mt-sm)]',
    textPos: 'top',
  },
  {
    area: 'b',
    place: '[grid-area:b]',
    radius: 'rounded-[var(--mt-sm)_var(--mt-sm)_var(--mt-big)_var(--mt-big)]',
    textPos: 'top',
  },
  {
    area: 'c',
    place: '[grid-area:c]',
    radius: 'rounded-[var(--mt-sm)_var(--mt-big)_var(--mt-sm)_var(--mt-sm)]',
    textPos: 'bottom',
  },
  {
    area: 'd',
    place: '[grid-area:d]',
    radius: 'rounded-[var(--mt-big)_var(--mt-big)_var(--mt-sm)_var(--mt-sm)]',
    textPos: 'bottom',
  },
  {
    area: 'e',
    place: '[grid-area:e]',
    radius: 'rounded-[var(--mt-big)_var(--mt-sm)_var(--mt-sm)_var(--mt-sm)]',
    textPos: 'bottom',
  },
] as const

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

const grid =
  'grid gap-[clamp(9px,1vw,15px)] ' +
  '[--mt-big:26px] [--mt-sm:26px] ' +
  'grid-cols-1 auto-rows-[minmax(200px,58vw)] ' +
  "[grid-template-areas:'a'_'b'_'c'_'d'_'e'] " +
  'min-[541px]:[--mt-big:clamp(46px,8vw,74px)] min-[541px]:[--mt-sm:20px] ' +
  'min-[541px]:grid-cols-2 min-[541px]:auto-rows-[minmax(180px,34vw)] ' +
  "min-[541px]:[grid-template-areas:'a_b'_'c_d'_'e_e'] " +
  'min-[901px]:[--mt-big:clamp(60px,6.8vw,100px)] ' +
  'min-[901px]:grid-cols-3 min-[901px]:auto-rows-auto ' +
  'min-[901px]:grid-rows-[repeat(2,minmax(280px,36vh))] ' +
  "min-[901px]:[grid-template-areas:'a_b_.'_'c_d_e']"

const month =
  'flex items-center gap-[0.65rem] font-sans font-medium transition-[opacity,color,font-size] ' +
  'duration-300 ease-brand ' +
  "min-[901px]:before:content-[''] min-[901px]:before:size-2.5 min-[901px]:before:rounded-full " +
  'min-[901px]:before:bg-blue min-[901px]:before:transition-transform min-[901px]:before:duration-300 ' +
  'min-[901px]:before:ease-brand'

function CrossfadeImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [current, setCurrent] = useState(src)
  const [outgoing, setOutgoing] = useState<string | null>(null)

  useEffect(() => {
    setCurrent((prev) => {
      if (prev === src) return prev
      setOutgoing(prev)
      return src
    })
  }, [src])

  useEffect(() => {
    if (!outgoing) return
    const id = window.setTimeout(() => setOutgoing(null), 600)
    return () => window.clearTimeout(id)
  }, [outgoing])

  return (
    <>
      {outgoing && <img src={outgoing} alt="" aria-hidden="true" className={className} />}
      <img key={current} src={current} alt={alt} className={`${className} animate-mt-dissolve`} />
    </>
  )
}

export default function MonthlyTrips() {
  const [active, setActive] = useState(() => new Date().getMonth())
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    POOL.forEach((p) => {
      const img = new Image()
      img.src = p.img
    })
  }, [])

  useGSAP(
    () => {
      const el = sectionRef.current
      if (!el) return
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=2200',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onToggle: (self) => {
          if (self.isActive) {
            document.body.classList.add('hide-nav-pinned')
          } else {
            document.body.classList.remove('hide-nav-pinned')
          }
        },
        onUpdate: (self) => {
          const idx = Math.min(11, Math.floor(self.progress * 12))
          setActive((prev) => (prev === idx ? prev : idx))
        },
      })

      return () => {
        document.body.classList.remove('hide-nav-pinned')
        st.kill()
      }
    },
    { scope: sectionRef },
  )

  const visible = SLOTS.map((slot, i) => ({ ...slot, ...POOL[(active + i) % POOL.length] }))

  return (
    <section ref={sectionRef} className="section bg-paper flex min-h-screen flex-col justify-center py-8" id="monthly">
      <div className="wrap-wide my-auto">
        <div className="section-head mb-[clamp(2rem,4vw,3.2rem)] items-center">
          <h2 className="h2">
            Find Your Perfect Trip by <span className="text-blue">Month</span>
          </h2>
          <img
            src={trainLoco}
            alt=""
            aria-hidden="true"
            className="h-auto w-[clamp(160px,22vw,300px)] flex-none object-contain"
          />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-[clamp(1.6rem,4vw,2.4rem)] min-[901px]:grid-cols-[1fr_auto] min-[901px]:gap-[clamp(1.5rem,3.5vw,3.5rem)]">
          <div className={grid}>
            {visible.map((t) => (
              <article
                key={t.area}
                className={`group relative min-h-[210px] animate-mt-card-in
                            transition-transform duration-500 ease-brand
                            hover:-translate-y-[5px] motion-reduce:animate-none
                            ${t.place}`}
              >
                <div className={`relative isolate h-full w-full overflow-hidden ${t.radius}`}>
                  <CrossfadeImage
                    src={t.img}
                    alt={t.title}
                    className="px-media transition-transform duration-[900ms] ease-brand group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-black/40 ${t.radius}`} />
                  <h3
                    className={`absolute inset-x-0 z-[1] ml-auto max-w-[21ch]
                               pr-[clamp(1.15rem,1.7vw,1.7rem)] pl-[clamp(1.7rem,2.3vw,2.4rem)]
                               text-right font-sans text-white
                               [text-shadow:0_1px_3px_rgba(6,12,28,0.8),0_2px_16px_rgba(6,12,28,0.6)]
                               ${t.textPos === 'top' ? 'top-0 pt-[clamp(1.7rem,2.3vw,2.4rem)]' : 'bottom-0 pb-[clamp(1.7rem,2.3vw,2.4rem)]'}`}
                    style={{
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '17.23px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    <span key={t.title} className="block animate-fadeIn">
                      {t.title}
                    </span>
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <nav
            className="flex flex-row flex-wrap items-center justify-start gap-x-[1.1rem] gap-y-2
                       whitespace-nowrap min-[901px]:flex-col min-[901px]:flex-nowrap
                       min-[901px]:items-end min-[901px]:justify-between min-[901px]:gap-0"
            aria-label="Choose a month"
          >
            {MONTHS.map((m, i) => (
              <button
                key={m}
                type="button"
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`${month} ${
                  i === active
                    ? 'text-[clamp(1.15rem,0.95rem+0.55vw,1.55rem)] font-bold text-blue min-[901px]:text-ink-black min-[901px]:before:scale-100'
                    : 'text-[clamp(0.88rem,0.78rem+0.32vw,1.15rem)] text-ink-faint hover:text-ink-soft min-[901px]:before:scale-0'
                }`}
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
