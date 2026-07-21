import { experiences } from '../data/content.ts'

/* Reference bento: one tall feature on the left, two stacked on the
   right, two along the base. Each slot carries its own grid-area at the
   wide breakpoint; below that the wall reflows to 2 columns, then 1. */
const LAYOUT = [
  { id: 'aarti', area: 'min-[901px]:[grid-area:1/1/3/8]' },
  { id: 'dance', area: 'min-[901px]:[grid-area:1/8/2/13]' },
  { id: 'thali', area: 'min-[901px]:[grid-area:2/8/3/13]' },
  { id: 'spice', area: 'min-[901px]:[grid-area:3/1/4/7]' },
  { id: 'yoga', area: 'min-[901px]:[grid-area:3/7/4/13]' },
] as const

/* Glossy sheen over each photo (no blur); softens on hover. Off on touch. */
const glass =
  'absolute inset-0 transition-[background] duration-[550ms] ease-brand ' +
  'min-[901px]:bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0)_70%)] ' +
  'min-[901px]:group-hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)] ' +
  'min-[901px]:group-focus-within:bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)]'

/* Bottom-weighted scrim so captions read on any photo, with a whisper of
   shade up top to keep the index number legible on bright shots. */
const scrim =
  'absolute inset-0 transition-[background] duration-500 ease-brand ' +
  'bg-[linear-gradient(180deg,rgba(6,12,28,0.16)_0%,rgba(6,12,28,0)_30%,rgba(6,12,28,0.4)_64%,rgba(6,12,28,0.86)_100%)] ' +
  'group-hover:bg-[linear-gradient(180deg,rgba(6,12,28,0.24)_0%,rgba(6,12,28,0.08)_26%,rgba(6,12,28,0.52)_60%,rgba(6,12,28,0.92)_100%)]'

/* visible on touch; collapses to a hover reveal once there is a pointer */
const blurb =
  'mt-2 max-h-[6em] max-w-[34ch] overflow-hidden text-[clamp(0.9rem,0.85rem+0.2vw,1.02rem)] ' +
  'leading-normal text-white/86 opacity-100 ' +
  'transition-[max-height,opacity,margin-top] duration-500 ease-brand ' +
  'min-[901px]:mt-0 min-[901px]:max-h-0 min-[901px]:opacity-0 ' +
  'min-[901px]:group-hover:mt-2 min-[901px]:group-hover:max-h-[6em] min-[901px]:group-hover:opacity-100 ' +
  'min-[901px]:group-focus-within:mt-2 min-[901px]:group-focus-within:max-h-[6em] min-[901px]:group-focus-within:opacity-100'

export default function Experiences() {
  const byId = new Map(experiences.map((x) => [x.id, x]))

  return (
    <section className="section bg-paper-2" id="experiences">
      <div className="wrap-wide">
        <div className="section-head mb-[clamp(2.2rem,4vw,3.4rem)]">
          <h2 className="h2">
            Come for the sights,<br />stay for the <span>rituals.</span>
          </h2>
        </div>

        {/* tiles sit flush; round + clip the whole wall instead of each tile */}
        <div
          className="grid auto-rows-[minmax(220px,62vw)] grid-cols-1 gap-2 overflow-hidden rounded-xl
                     min-[541px]:auto-rows-[minmax(190px,38vw)] min-[541px]:grid-cols-2
                     min-[901px]:auto-rows-auto min-[901px]:grid-cols-12 min-[901px]:gap-0
                     min-[901px]:grid-rows-[repeat(2,minmax(230px,29vh))_minmax(210px,26vh)]"
        >
          {LAYOUT.map(({ id, area }, i) => {
            const x = byId.get(id)
            if (!x) return null
            const feature = i === 0
            return (
              <article
                key={id}
                className={`reveal group relative isolate min-h-[190px] overflow-hidden ${area} ${
                  feature
                    ? 'min-[541px]:col-span-2 min-[541px]:min-h-[clamp(280px,52vw,420px)] min-[901px]:min-h-[190px]'
                    : ''
                }`}
              >
                <img
                  src={x.img}
                  alt={x.title}
                  className="px-media"
                  data-parallax={feature ? '8' : '14'}
                  loading="lazy"
                />
                <div className={glass} />
                <div className={scrim} />
                <span className="absolute top-[clamp(0.85rem,1.3vw,1.4rem)] left-[clamp(1rem,1.5vw,1.6rem)] z-[2] font-sans text-[0.72rem] font-medium tracking-[0.24em] text-white/62">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="absolute inset-x-0 bottom-0 z-[1] p-[clamp(1.2rem,1.8vw,2rem)]">
                  <h3
                    className={`font-sans leading-[1.08] font-normal tracking-[-0.01em] text-on-dark
                                [text-shadow:0_2px_26px_rgba(4,10,25,0.55)] ${
                                  feature
                                    ? 'text-[clamp(1.9rem,1.2rem+2vw,3rem)]'
                                    : 'text-[clamp(1.3rem,1rem+1vw,2rem)]'
                                }`}
                  >
                    {x.title}
                  </h3>
                  <p className={blurb}>{x.blurb}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
