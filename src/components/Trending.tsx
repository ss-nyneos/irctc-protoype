import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { packages } from '../data/content.ts'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/* Fixed width so the loop never shifts; 1:2 portrait, and the height stays
   put while the width elongates on hover. --card-w is set on the section. */
const card =
  'group relative h-[calc(var(--card-w)*2)] w-[var(--card-w)] flex-none overflow-hidden rounded-[20px] ' +
  'bg-[#14161a] shadow-md transition-[width,box-shadow] duration-[550ms] ease-brand ' +
  'hover:w-[calc(var(--card-w)*1.65)] hover:shadow-lg min-[701px]:hover:w-[calc(var(--card-w)*1.95)]'

const scrim =
  'absolute inset-0 transition-[background] duration-[450ms] ease-brand ' +
  'bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0)_32%,rgba(0,0,0,0.45)_62%,rgba(0,0,0,0.88)_100%)] ' +
  'group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.22)_30%,rgba(0,0,0,0.62)_58%,rgba(0,0,0,0.94)_100%)]'

/* frosted price panel — appears on hover */
const price =
  'pointer-events-none absolute top-[5%] right-[5%] z-[2] flex flex-col items-center gap-[0.38rem] ' +
  'rounded-[14px] border border-white/32 bg-white/14 px-3 pt-[0.6rem] pb-[0.58rem] ' +
  'backdrop-blur-[16px] backdrop-saturate-[1.3] ' +
  '-translate-y-2.5 opacity-0 transition-[opacity,transform] duration-[400ms] ease-brand delay-[50ms] ' +
  'group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100'

/* collapsed until hover */
const reveal =
  'max-h-0 overflow-hidden text-white/92 opacity-0 ' +
  'transition-[opacity,max-height,margin] duration-500 ease-brand group-hover:opacity-100'

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
    <section
      className="overflow-hidden bg-paper py-[var(--section-y)]
                 [--card-w:clamp(150px,42vw,190px)] min-[701px]:[--card-w:clamp(190px,15.5vw,238px)]"
      id="packages"
    >
      <div className="wrap-wide">
        <h2 className="h2 mb-[clamp(2rem,4vw,3rem)] text-center [&_span]:text-blue">
          Trending <span>Packages</span>
        </h2>
      </div>

      <div className="group/rail overflow-hidden">
        <div
          ref={trackRef}
          style={dist ? ({ ['--loop' as string]: `${dist}px` } as CSSProperties) : undefined}
          className="flex w-max animate-trend-slide gap-4 px-2 will-change-transform
                     group-hover/rail:[animation-play-state:paused]
                     motion-reduce:animate-none motion-reduce:overflow-x-auto"
        >
          {loop.map((p, i) => (
            <article className={card} key={`${p.id}-${i}`}>
              <img
                src={p.img}
                alt={p.place}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-brand group-hover:scale-[1.07]"
              />
              <span className={scrim} aria-hidden="true" />

              <div className={price}>
                <span className="text-[0.58rem] font-bold tracking-[0.08em] whitespace-nowrap uppercase text-white/88">
                  Starting from
                </span>
                <span className="text-[1.08rem] leading-none font-bold tabular-nums text-white">
                  {inr(p.price)}
                </span>
                <span className="mt-[0.2rem] cursor-pointer rounded-full bg-blue px-4 py-[0.48rem] text-[0.8rem] font-bold whitespace-nowrap text-white transition-[background] duration-250 ease-brand hover:bg-blue-deep">
                  Book Now
                </span>
              </div>

              {/* caption: title always, details on hover */}
              <div className="absolute inset-x-[7%] bottom-[6%] z-[2]">
                <span className={`${reveal} mb-0 block text-[0.75rem] font-semibold group-hover:mb-[0.32rem] group-hover:max-h-[2em]`}>
                  {p.nights} Nights / {p.days} Days
                </span>
                <h3 className="text-[clamp(1.02rem,0.9rem+0.45vw,1.28rem)] leading-[1.12] font-bold tracking-[-0.02em] text-white">
                  {p.title}
                </h3>
                <p className={`${reveal} mt-0 text-[0.82rem] leading-[1.45] group-hover:mt-[0.45rem] group-hover:max-h-[8em]`}>
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
