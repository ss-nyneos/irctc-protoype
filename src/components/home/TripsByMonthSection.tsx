import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { monthlyTripCards, months, type MonthlyTripCard } from "@/data/tripsByMonth";
import { buildImageUrl } from "@/utils/format";
import vandeBharatLoco from "@/assets/cta/vande-bharat-loco.png";

export function TripsByMonthSection() {
  const ref = useReveal();
  const [selected, setSelected] = useState(0);

  const cards = monthlyTripCards.map((_, i) => monthlyTripCards[(i + selected) % monthlyTripCards.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-36" ref={ref}>
      {/* heading row — title on the left, locomotive on the right */}
      <div className="reveal mb-8 flex items-center justify-between gap-4">
        <h2 className="heading-xl text-ink">
          Find Your Perfect Trip <span className="accent">by Month</span>
        </h2>
        <img
          src={vandeBharatLoco}
          alt=""
          aria-hidden="true"
          /* asset is cropped flush to the loco, so it sits edge-to-edge with no padding */
          className="hidden h-14 w-auto shrink-0 select-none md:block lg:h-16"
        />
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
        /* local assets are already resolved URLs; only Unsplash ids need building */
        src={card.img.startsWith("photo-") ? buildImageUrl(card.img, 700) : card.img}
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
