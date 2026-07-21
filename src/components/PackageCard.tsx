import type { Package } from '../data/content.ts'
import { ArrowUpRight } from './Icons.tsx'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article
      className="reveal group flex h-[480px] flex-col overflow-hidden rounded-lg border
                 border-line bg-card p-2 transition-[box-shadow,transform,border-color]
                 duration-[450ms] ease-brand hover:-translate-y-1 hover:border-transparent hover:shadow-lg"
    >
      {/* media shrinks on hover to make room for the description */}
      <div className="relative h-[328px] flex-none overflow-hidden rounded-md transition-[height] duration-500 ease-brand group-hover:h-[200px]">
        <img
          src={pkg.img}
          alt={`${pkg.place}, India`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-brand group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-[0.45rem] pt-[0.65rem] pb-[0.3rem]">
        <div className="mb-[0.25rem] flex items-center justify-between text-[0.8rem] font-semibold text-blue-ink">
          <span>{pkg.place}</span>
          <span className="tabular-nums text-ink-faint">{pkg.nights}N · {pkg.days}D</span>
        </div>
        <h3 className="text-[1.42rem] leading-[1.05] font-bold tracking-[-0.02em] text-black">
          {pkg.title}
        </h3>
        <p className="mt-[0.3rem] text-[0.98rem] font-bold tabular-nums text-blue-ink">
          from {inr(pkg.price)}
        </p>

        {/* 0fr -> 1fr grid row is what animates the description open */}
        <div className="grid min-h-0 grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-brand group-hover:grid-rows-[1fr]">
          <p
            className="mt-0 overflow-hidden text-[0.92rem] leading-[1.55] text-ink-soft opacity-0
                       transition-[opacity,margin-top] duration-[400ms] ease-brand
                       group-hover:mt-[0.7rem] group-hover:opacity-100 group-hover:delay-100"
          >
            {pkg.desc}
          </p>
        </div>

        <a
          href="#packages"
          className="mt-auto inline-flex items-center gap-[0.4rem] self-start pt-[0.55rem] text-[0.92rem]
                     font-bold text-blue [&_svg]:transition-transform [&_svg]:duration-[350ms]
                     [&_svg]:ease-brand hover:[&_svg]:translate-x-[3px] hover:[&_svg]:-translate-y-[3px]"
        >
          View details
          <ArrowUpRight />
        </a>
      </div>
    </article>
  )
}
