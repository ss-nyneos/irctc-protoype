import { pilgrimage } from '../data/content.ts'
import { Pin, ArrowUpRight } from './Icons.tsx'

export default function Pilgrimage() {
  return (
    <section className="section bg-paper-2" id="pilgrimage">
      <div className="wrap-wide">
        <div className="section-head mb-[clamp(2.2rem,4vw,3.4rem)] [&_.tlink]:pb-[0.4rem] [&_.tlink]:text-ink-soft">
          <h2 className="h2">Faith, on <span>rails.</span></h2>
          
        </div>

        <div className="grid grid-cols-1 gap-[clamp(1.2rem,2.2vw,2.2rem)] min-[421px]:grid-cols-2 min-[861px]:grid-cols-4">
          {pilgrimage.map((p) => (
            <a
              key={p.id}
              href="#pilgrimage"
              className="reveal group flex flex-col items-center text-center transition-transform
                         duration-500 ease-brand hover:-translate-y-1.5"
            >
              {/* image drifts with scroll; the hover lift lives on the card itself.
                  Border colour is lifted per-photo (see `accent` in content.ts), so
                  each card frames itself in its own dominant tone rather than one
                  flat colour across all four. */}
              <div
                style={{ borderColor: p.accent }}
                className="arch relative aspect-[3/4] w-full overflow-hidden border-[3px] shadow-md
                           transition-shadow duration-500 ease-brand group-hover:shadow-lg
                           after:absolute after:inset-0 after:bg-blue after:opacity-0
                           after:mix-blend-soft-light after:transition-opacity after:duration-[450ms]
                           after:ease-brand after:content-[''] group-hover:after:opacity-[0.55]"
              >
                {/* Every temple photo is landscape in a tall portrait card, so
                    object-fit fills the card HEIGHT — object-position can't move it
                    vertically at all. The spire sits at the top of the image, so the
                    old symmetric px-media overflow (-18% top) plus the parallax hid
                    the top ~23% of the image at the worst scroll point and the tip
                    vanished. Fix: only a small top overflow (6%), the rest of the
                    over-scale pushed to the bottom, and a gentle parallax (4). The
                    upward drift then clips at most the top ~8.5% — sky/hill
                    headroom, never the spire. Verified for all four temples in
                    scratchpad/sim.mjs. */}
                <img
                  src={p.img}
                  alt={`${p.name}, ${p.place}`}
                  className="absolute inset-x-0 top-[-6%] h-[132%] w-full object-cover object-top will-change-transform"
                  data-parallax="4"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,22,52,0.5)_100%)]" />
              </div>
              <div className="pt-[1.1rem]">
                <h3 className="font-sans text-card-title leading-[1.05] font-medium text-ink-black">{p.name}</h3>
                <span className="mt-[0.4rem] inline-flex items-center gap-[0.32rem] font-sans text-card-sub font-semibold text-blue-ink">
                  <Pin />
                  {p.place}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
