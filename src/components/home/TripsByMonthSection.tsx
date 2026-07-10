import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { monthlyTripCards, months, type MonthlyTripCard } from "@/data/tripsByMonth";
import { buildImageUrl } from "@/utils/format";

/** Stylised blue diesel locomotive accenting the month picker. */
function TrainIcon() {
  return (
    <svg viewBox="0 0 210 90" className="h-12 w-auto md:h-14" aria-hidden="true">
      {/* undercarriage */}
      <rect x="12" y="60" width="188" height="9" rx="3" fill="#243b53" />
      {/* wheels */}
      {[42, 84, 134, 172].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="76" r="9" fill="#2b3a4d" />
          <circle cx={cx} cy="76" r="3.5" fill="#8aa0b8" />
        </g>
      ))}
      {/* body */}
      <rect x="16" y="16" width="180" height="46" rx="7" fill="#2f6bd8" />
      {/* roof highlight */}
      <rect x="16" y="16" width="180" height="12" rx="7" fill="#508ae6" />
      {/* front warning panel (left) */}
      <rect x="16" y="16" width="18" height="46" fill="#eef2f7" />
      <path d="M16 28h18v6H16zM16 40h18v6H16zM16 52h18v6H16z" fill="#d64545" opacity="0.85" />
      {/* windows */}
      <rect x="150" y="24" width="30" height="17" rx="2.5" fill="#cfe0f5" />
      <rect x="118" y="27" width="24" height="13" rx="2" fill="#a9c6ef" />
      <rect x="88" y="27" width="22" height="13" rx="2" fill="#a9c6ef" />
      <rect x="58" y="27" width="20" height="13" rx="2" fill="#a9c6ef" />
      {/* side stripe */}
      <rect x="40" y="49" width="150" height="4" rx="2" fill="#dfe9f7" opacity="0.7" />
    </svg>
  );
}

export function TripsByMonthSection() {
  const ref = useReveal();
  const [selected, setSelected] = useState(0);

  const cards = monthlyTripCards.map((_, i) => monthlyTripCards[(i + selected) % monthlyTripCards.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28" ref={ref}>
      {/* heading row — title on the left, locomotive on the right */}
      <div className="reveal mb-8 flex items-center justify-between gap-4">
        <h2 className="heading-xl text-ink">
          Find Your Perfect Trip <span className="accent">by Month</span>
        </h2>
        <div className="hidden shrink-0 md:block">
          <TrainIcon />
        </div>
      </div>

      <div className="reveal grid min-w-0 gap-x-8 gap-y-6 md:grid-cols-[1fr_170px]">
        {/* staircase bento — top-right cell intentionally empty; the four inner
            corners are heavily rounded so their negative space forms the big
            "star" gap at the centre where the cards meet */}
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
          <TripCard card={cards[0]} align="left" className="h-60 sm:h-64 sm:rounded-br-[6rem]" />
          <TripCard card={cards[1]} align="right" className="h-60 sm:h-64 sm:rounded-bl-[6rem]" />
          <div className="hidden sm:block" aria-hidden="true" />
          <TripCard card={cards[2]} align="left" className="h-56 sm:h-60 sm:rounded-tr-[6rem]" />
          <TripCard card={cards[3]} align="right" className="h-56 sm:h-60 sm:rounded-tl-[6rem]" />
          <TripCard card={cards[4]} align="left" className="h-56 sm:h-60 sm:rounded-tr-[6rem]" />
        </div>

        {/* month picker */}
        <div className="no-scrollbar flex min-w-0 flex-row gap-3 overflow-x-auto md:flex-col md:items-end md:gap-4 md:overflow-visible md:text-right">
          {months.map((month, i) => {
            const active = i === selected;
            return (
              <button
                key={month}
                type="button"
                onClick={() => setSelected(i)}
                aria-current={active ? "true" : undefined}
                className={`flex flex-none items-center gap-2 whitespace-nowrap transition-colors ${
                  active
                    ? "text-[22px] font-extrabold text-ink sm:text-[28px]"
                    : "text-[15px] font-medium text-muted-foreground hover:text-ink"
                }`}
              >
                {active && <span className="h-3 w-3 flex-none rounded-full bg-brand" />}
                {month}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TripCard({
  card,
  align,
  className,
}: {
  card: MonthlyTripCard;
  align: "left" | "right";
  className: string;
}) {
  return (
    <div className={`reveal group relative overflow-hidden rounded-3xl shadow-[0_16px_38px_-18px_rgba(15,32,74,0.35)] ${className}`}>
      <img
        src={buildImageUrl(card.img, 700)}
        alt={card.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/30" />
      <div className={`absolute inset-x-0 top-0 p-5 ${align === "right" ? "text-right" : "text-left"}`}>
        <span className="text-[15px] font-medium leading-snug text-white drop-shadow">{card.title}</span>
      </div>
    </div>
  );
}
