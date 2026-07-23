import { pilgrimage } from '../data/content.ts'
import { Pin } from './Icons.tsx'

export default function Pilgrimage() {
  return (
    <section className="section bg-paper-2" id="pilgrimage">
      <div className="wrap-wide">
        <div className="section-head mb-[clamp(2.2rem,4vw,3.4rem)] [&_.tlink]:pb-[0.4rem] [&_.tlink]:text-ink-soft">
          <h2 className="h2">
            Faith, on <span>rails.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(1.2rem,2.2vw,2.2rem)] min-[421px]:grid-cols-2 min-[861px]:grid-cols-4">
          {pilgrimage.map((p) => (
            <a
              key={p.id}
              href="#pilgrimage"
              className="reveal group flex flex-col items-center text-center cursor-pointer"
            >
              <div
                style={{ borderColor: p.accent }}
                className="arch relative aspect-[3/4] w-full overflow-hidden border-[3px] shadow-md transition-shadow duration-500 group-hover:shadow-xl"
              >
                {/* Separate container scales on hover so hover zoom works independently of GSAP scroll parallax */}
                <div className="absolute inset-0 size-full overflow-hidden transition-transform duration-700 ease-brand group-hover:scale-[1.15]">
                  <img
                    src={p.img}
                    alt={`${p.name}, ${p.place}`}
                    className="absolute inset-x-0 top-[-10%] h-[145%] w-full object-cover object-top will-change-transform"
                    data-parallax="3"
                    loading="lazy"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,22,52,0.5)_100%)]" />
              </div>
              <div className="pt-[1.1rem]">
                <h3 className="font-sans text-card-title leading-[1.05] font-medium text-ink-black">
                  {p.name}
                </h3>
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
