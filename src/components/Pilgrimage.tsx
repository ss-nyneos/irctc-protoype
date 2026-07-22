import { pilgrimage } from '../data/content.ts'
import { Pin, ArrowUpRight } from './Icons.tsx'

export default function Pilgrimage() {
  return (
    <section className="section bg-paper-2" id="pilgrimage">
      <div className="wrap-wide">
        <div className="section-head mb-[clamp(2.2rem,4vw,3.4rem)] [&_.tlink]:pb-[0.4rem] [&_.tlink]:text-ink-soft">
          <h2 className="h2">Faith, on <span>rails.</span></h2>
          <a href="#pilgrimage" className="tlink">
            Char Dham · Vaishno Devi · Shirdi
            <ArrowUpRight />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(1.2rem,2.2vw,2.2rem)] min-[421px]:grid-cols-2 min-[861px]:grid-cols-4">
          {pilgrimage.map((p) => (
            <a
              key={p.id}
              href="#pilgrimage"
              className="reveal group flex flex-col items-center text-center transition-transform
                         duration-500 ease-brand hover:-translate-y-1.5"
            >
              {/* image drifts with scroll; the hover lift lives on the card itself */}
              <div
                className="arch relative aspect-[3/4] w-full overflow-hidden shadow-md transition-shadow
                           duration-500 ease-brand group-hover:shadow-lg
                           after:absolute after:inset-0 after:bg-blue after:opacity-0
                           after:mix-blend-soft-light after:transition-opacity after:duration-[450ms]
                           after:ease-brand after:content-[''] group-hover:after:opacity-[0.55]"
              >
                <img
                  src={p.img}
                  alt={`${p.name}, ${p.place}`}
                  className="px-media"
                  data-parallax="14"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,22,52,0.5)_100%)]" />
              </div>
              <div className="pt-[1.1rem]">
                <h3 className="font-sans text-card-title leading-[1.05] font-medium text-ink">{p.name}</h3>
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
