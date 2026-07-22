import { Star } from './Icons.tsx'

const avatars = [
  '/img/taj-front.jpg',
  '/img/kerala-backwaters.jpg',
  '/img/jaipur-hd.jpg',
  '/img/goa.jpg',
]

const card =
  'relative isolate h-[clamp(260px,62vw,320px)] overflow-hidden rounded-[20px] text-white shadow-md ' +
  'transition-[transform,box-shadow] duration-500 ease-brand hover:-translate-y-2 hover:shadow-lg ' +
  'min-[621px]:h-[clamp(210px,19vw,288px)] ' +
  "after:absolute after:inset-0 after:-z-[1] after:content-['']"

/* oversized so the parallax drift never exposes an edge */
const bg = 'absolute inset-x-0 -inset-y-[18%] -z-[2] h-[136%] w-full object-cover will-change-transform'

const body = 'absolute inset-x-0 z-[1] flex flex-col p-[clamp(1rem,1.7vw,1.7rem)]'
const num = 'text-[clamp(1.5rem,1.1rem+1.7vw,2.4rem)] leading-none font-bold tracking-[-0.03em] text-white'
const label = 'mt-[0.35rem] text-[clamp(0.85rem,0.8rem+0.2vw,0.98rem)] font-semibold text-white'
const note = 'text-[0.84rem] leading-[1.45] text-white/78'

const cell = 'flex min-w-0 flex-col justify-center gap-[0.4rem] px-[clamp(0.8rem,1.4vw,1.4rem)] py-2'
const big =
  'inline-flex items-baseline gap-[0.4rem] text-[clamp(1.2rem,0.9rem+1.1vw,1.75rem)] leading-none ' +
  'font-bold tracking-[-0.02em] text-white ' +
  '[&_em]:text-[clamp(0.9rem,0.8rem+0.35vw,1.1rem)] [&_em]:font-semibold [&_em]:not-italic'
const sub = 'text-[clamp(0.84rem,0.8rem+0.2vw,0.98rem)] leading-snug text-white/85'
const avatar = 'size-[29px] rounded-full border-2 border-white/85 object-cover -ml-[9px] first:ml-0'

export default function Stats() {
  return (
    <section className="bg-paper py-[var(--section-y)]">
      <div className="wrap-wide grid grid-cols-1 gap-[clamp(14px,1.5vw,26px)] min-[621px]:grid-cols-2 min-[1041px]:grid-cols-[1fr_1.32fr_1.76fr]">
        {/* ---- travellers: muted olive wash + faint rings ---- */}
        <article
          className={`${card} after:bg-[linear-gradient(180deg,rgba(74,76,56,0.9)_0%,rgba(46,50,36,0.72)_55%,rgba(20,24,16,0.9)_100%)]`}
        >
          <img src="/img/kerala-waterfall.jpg" alt="" className={bg} data-parallax="18" loading="lazy" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[26%] -right-[18%] z-0 aspect-square w-[78%]
                       rounded-full bg-[repeating-radial-gradient(circle,transparent_0_24px,rgba(255,255,255,0.08)_24px_25px)]"
          />
          <div className={`${body} top-1/2 -translate-y-1/2`}>
            <span className={num}>2,40,000+</span>
            <span className={label}>Happy travellers a year</span>
            <p className={`${note} mt-[0.7rem] max-w-[22ch]`}>
              Journeys booked with the trust of Indian Railways.
            </p>
          </div>
        </article>

        {/* ---- packages ---- */}
        <article
          className={`${card} after:bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.05)_40%,rgba(0,0,0,0.72)_100%)]`}
        >
          <img src="/img/train-scenic.jpg" alt="" className={bg} data-parallax="11" loading="lazy" />
          <div className={`${body} bottom-0`}>
            <span className={num}>1,200+</span>
            <span className={label}>Curated packages</span>
            <p className={`${note} mt-[0.25rem] max-w-[34ch]`}>Handpicked across Bharat &amp; beyond</p>
          </div>
        </article>

        {/* ---- quadrant panel ---- */}
        <article
          className={`${card} col-span-1 min-h-[340px] !h-auto
                      min-[621px]:col-span-2 min-[621px]:min-h-0 min-[621px]:!h-[clamp(260px,40vw,340px)]
                      min-[1041px]:col-span-1 min-[1041px]:!h-[clamp(210px,19vw,288px)]
                      after:bg-[linear-gradient(180deg,rgba(28,18,46,0.62)_0%,rgba(40,22,40,0.42)_45%,rgba(20,12,26,0.72)_100%)]`}
        >
          <img src="/img/taj-dawn.jpg" alt="" className={bg} data-parallax="24" loading="lazy" />
          {/* dashed rule across the middle via ::before */}
          <div
            className="absolute inset-0 z-[1] grid grid-cols-2 grid-rows-2 p-[clamp(1.1rem,2vw,2rem)]
                       before:absolute before:top-1/2 before:right-[clamp(1.1rem,2vw,2rem)]
                       before:left-[clamp(1.1rem,2vw,2rem)] before:border-t before:border-dashed
                       before:border-white/45 before:content-['']"
          >
            {/* vertical rule, top half only */}
            <div className={`${cell} border-r border-white/32`}>
              <span className={big}>
                4 <em>Luxury Trains</em>
              </span>
              <span className={sub}>Maharajas', Golden Chariot &amp; more</span>
            </div>

            <div className={cell}>
              <span className={big}>100%</span>
              <span className={sub}>Secure government payments</span>
            </div>

            <div className={cell}>
              <span className="flex items-center">
                {avatars.map((a) => (
                  <img src={a} alt="" key={a} loading="lazy" className={avatar} />
                ))}
                <span className="-ml-[9px] grid size-[29px] place-items-center rounded-full border-2 border-white/85 bg-blue text-[0.6rem] font-bold text-white">
                  +2L
                </span>
              </span>
              <span className={sub}>60,000+ reviews</span>
            </div>

            <div className={cell}>
              <span className={`${big} items-center [&_svg]:text-[0.62em] [&_svg]:text-white`}>
                4.8 <Star />
              </span>
              <span className={sub}>Average traveller rating</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
