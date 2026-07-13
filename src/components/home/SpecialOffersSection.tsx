import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { buildImageUrl } from "@/utils/format";

interface OfferCard {
  id: string;
  background: string;
  photo: string;
  photoAlt: string;
  textClass: string;
  lines: { text: string; emphasis?: boolean }[];
  badge?: string;
  decor: "beach" | "balloon" | "palm";
}

const offerCards: OfferCard[] = [
  {
    id: "egypt",
    background: "linear-gradient(120deg, #c2571f 0%, #e2823f 60%)",
    photo: "photo-1519046904884-53103b34b206",
    photoAlt: "Sailboat on a tropical beach",
    textClass: "text-white",
    lines: [{ text: "Enjoy Upto" }, { text: "60% OFF", emphasis: true }, { text: "on Your Booking" }],
    decor: "beach",
  },
  {
    id: "turkey",
    background: "linear-gradient(120deg, #4650c9 0%, #5b6bea 65%)",
    photo: "photo-1541432901042-2d8bd64b4a9b",
    photoAlt: "The Blue Mosque in Istanbul, Turkey",
    textClass: "text-white",
    lines: [{ text: "80% Discount" }, { text: "Are You Ready", emphasis: true }, { text: "To Turkey Tour", emphasis: true }],
    decor: "balloon",
  },
  {
    id: "europe",
    background: "linear-gradient(120deg, #f3ddc9 0%, #f6e6d8 100%)",
    photo: "photo-1533105079780-92b9be482077",
    photoAlt: "Santorini, Greece coastline",
    textClass: "text-navy",
    lines: [{ text: "Discover The Wow", emphasis: true }, { text: "Of Europe", emphasis: true }],
    badge: "-50% Only This Week",
    decor: "palm",
  },
];

function RingAccent({ className }: { className?: string }) {
  return <span className={`pointer-events-none absolute rounded-full border-[3px] border-white/30 ${className}`} />;
}

/** Small floating circles that straddle the photo/gradient seam, rendered above the photo. */
function SeamAccents({ ring = "border-white/50" }: { ring?: string }) {
  return (
    <>
      <RingAccent className={`left-[50%] top-4 h-8 w-8 ${ring}`} />
      <span className="pointer-events-none absolute left-[47%] bottom-5 h-5 w-5 rounded-full bg-white/70" />
    </>
  );
}

const decorMap = {
  beach: () => <SeamAccents />,
  balloon: () => <SeamAccents />,
  palm: () => <SeamAccents ring="border-navy/30" />,
};

export function SpecialOffersSection() {
  const ref = useReveal();
  const [errored, setErrored] = useState<Record<string, boolean>>({});

  return (
    <section className="mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-36" ref={ref}>
      <h2 className="reveal heading-xl text-center text-ink">
        Special <span className="accent">Offers</span>
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {offerCards.map((offer) => {
          const Decor = decorMap[offer.decor];
          return (
            <div
              key={offer.id}
              className="reveal relative h-56 overflow-hidden rounded-2xl shadow-md md:h-52"
              style={{ background: offer.background }}
            >
              <RingAccent className={`left-3 top-3 h-8 w-8 ${offer.textClass === "text-navy" ? "border-navy/25" : "border-white/35"}`} />

              {!errored[offer.id] && (
                <img
                  src={buildImageUrl(offer.photo, 700)}
                  alt={offer.photoAlt}
                  loading="lazy"
                  onError={() => setErrored((prev) => ({ ...prev, [offer.id]: true }))}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ clipPath: "polygon(56% 0%, 100% 0%, 100% 100%, 34% 100%)" }}
                />
              )}

              <Decor />

              <div className={`relative z-10 flex h-full flex-col justify-start gap-1 py-7 pl-6 ${offer.textClass}`}>
                {offer.lines.map((line) => (
                  <span
                    key={line.text}
                    className={
                      line.emphasis
                        ? "whitespace-nowrap font-display text-[20px] font-extrabold leading-tight md:text-[22px]"
                        : "whitespace-nowrap text-[14px] font-semibold"
                    }
                  >
                    {line.text}
                  </span>
                ))}
              </div>

              {offer.badge && (
                <div
                  className="absolute bottom-3 left-3 z-10 flex h-16 w-16 -rotate-6 items-center justify-center rounded-lg bg-rose-500 p-1.5 text-center text-[9.5px] font-bold leading-tight text-white shadow-lg"
                  style={{
                    clipPath:
                      "polygon(10% 0%,30% 8%,50% 0%,70% 8%,90% 0%,100% 20%,92% 40%,100% 60%,92% 80%,100% 100%,70% 92%,50% 100%,30% 92%,10% 100%,0% 80%,8% 60%,0% 40%,8% 20%)",
                  }}
                >
                  {offer.badge}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="reveal mt-8 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-[14px] font-bold text-white shadow-sm transition hover:brightness-95"
        >
          More <ChevronDown size={16} />
        </button>
      </div>
    </section>
  );
}
