import { ecosystem } from '../data/content.ts'

export default function Marquee() {
  const items = [...ecosystem, ...ecosystem]
  return (
    <div
      className="group overflow-hidden border-y border-line bg-paper-2 py-[1.4rem] text-ink-black"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((label, i) => (
          <span
            className="inline-flex items-center gap-[2.2rem] px-[2.2rem] font-sans text-[clamp(1.3rem,0.9rem+1.6vw,2.1rem)] font-bold tracking-[-0.01em] whitespace-nowrap text-ink-black"
            key={i}
          >
            {label}
            <span className="text-[0.65em] text-blue">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
