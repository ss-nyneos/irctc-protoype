/* Editorial wall: two tall cards, a band of three short ones, two tall again.
   Laid out as a single 6-column grid so the rows stay locked together —
   tall cards span 3, the short band spans 2 each. */
const CARDS = [
  { kind: 'mountains',      place: 'Kashmir',   img: '/img/kashmir-hd.jpg',        size: 'lg' },
  { kind: 'Beaches',        place: 'Goa',       img: '/img/goa.jpg',               size: 'lg' },
  { kind: 'greenery',       place: 'Meghalaya', img: '/img/kerala-waterfall.jpg',  size: 'sm' },
  { kind: 'ghats',          place: 'Varanasi',  img: '/img/varanasi-ghats.jpg',    size: 'sm' },
  { kind: 'passes',         place: 'Ladakh',    img: '/img/ladakh.jpg',            size: 'sm' },
  { kind: 'Royal heritage', place: 'Jaipur',    img: '/img/hawa-mahal.jpg',        size: 'lg' },
  { kind: 'Backwaters',     place: 'Kerala',    img: '/img/kerala-backwaters.jpg', size: 'lg' },
] as const

/* Caption sits straight on the photograph — no panel behind it, so the
   drop shadow plus the card scrim carry all of the legibility. */
const caption =
  'absolute top-1/2 left-1/2 z-[2] flex w-full -translate-x-1/2 -translate-y-1/2 ' +
  'flex-col items-center px-3 text-center ' +
  '[text-shadow:0_2px_10px_rgba(4,10,25,0.55),0_4px_30px_rgba(4,10,25,0.4)]'

export default function Experiences() {
  return (
    <section className="section bg-paper-2" id="experiences">
      <div className="wrap-wide">
        <div className="section-head mb-[clamp(2.2rem,4vw,3.4rem)]">
          <h2 className="h2">
            Come for the sights,<br />stay for the <span>rituals</span>
          </h2>
        </div>

        <div
          className="grid auto-rows-[clamp(188px,48vw,240px)] grid-cols-1 gap-[clamp(8px,0.8vw,12px)]
                     min-[561px]:grid-cols-2
                     min-[901px]:auto-rows-auto min-[901px]:grid-cols-6
                     min-[901px]:grid-rows-[clamp(262px,28vw,392px)_clamp(130px,14vw,178px)_clamp(244px,26vw,368px)]"
        >
          {CARDS.map((c) => {
            const big = c.size === 'lg'
            return (
              <article
                key={c.place + c.kind}
                className={`reveal group relative isolate overflow-hidden rounded-[14px] ${
                  big
                    ? 'min-[901px]:col-span-3'
                    : 'min-[561px]:max-[900px]:h-[clamp(160px,25vw,206px)] min-[901px]:col-span-2'
                }`}
              >
                <img
                  src={c.img}
                  alt={`${c.kind} in ${c.place}`}
                  className="px-media transition-transform duration-[900ms] ease-brand group-hover:scale-[1.04]"
                  data-parallax={big ? '10' : '6'}
                  loading="lazy"
                />
                {/* keeps the caption legible on bright photographs */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,28,0.28)_0%,rgba(6,12,28,0.08)_45%,rgba(6,12,28,0.45)_100%)]" />

                <div className={`${caption} ${big ? 'gap-1' : 'gap-0.5'}`}>
                  {/* Island Moments, centred. The spec'd sizes are the caps —
                      114.73px tall cards, 43.85px short band — reached at wide
                      viewports; below that they scale or the glyphs overflow
                      a card that is itself only ~280px tall. */}
                  <span
                    className={`font-script text-center leading-none font-normal text-white/95 ${
                      big
                        ? 'text-[clamp(2.75rem,7.5vw,var(--text-script))]'
                        : 'text-[clamp(1.5rem,2.9vw,var(--text-script-sm))]'
                    }`}
                  >
                    {c.kind}
                  </span>
                  <span
                    className={`font-sans leading-tight font-bold tracking-[-0.01em] text-white ${
                      big ? 'text-[clamp(1rem,1.5vw,1.35rem)]' : 'text-[clamp(0.8rem,1vw,0.92rem)]'
                    }`}
                  >
                    {c.place}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
