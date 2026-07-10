import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import varanasiImg from "@/assets/cta/varanasi1.jpg";

interface Spot {
  name: string;
  tours: string;
  img: string;
  grad: [string, string];
}

/**
 * Curated destinations for the header marquee. Known-good Unsplash ids are
 * mixed with famous international spots; `ImageWithFallback` shows a themed
 * gradient if any photo fails, so the strip never looks broken.
 */
const SPOTS: Spot[] = [
  { name: "Jaipur", tours: "120+ Tours", img: "photo-1477587458883-47145ed94245", grad: ["#b45309", "#fbbf24"] },
  { name: "Bali", tours: "90+ Tours", img: "photo-1537996194471-e657df975ab4", grad: ["#0f766e", "#2dd4bf"] },
  { name: "Paris", tours: "80+ Tours", img: "photo-1502602898657-3e91760cbb34", grad: ["#9f1239", "#fb7185"] },
  { name: "Ladakh", tours: "110+ Tours", img: "photo-1506905925346-21bda4d32df4", grad: ["#1e3a8a", "#38bdf8"] },
  { name: "Roma", tours: "75+ Tours", img: "photo-1552832230-c0197dd311b5", grad: ["#7c2d12", "#f59e0b"] },
  { name: "Goa", tours: "150+ Tours", img: "photo-1512343879784-a960bf40e7f2", grad: ["#0369a1", "#22d3ee"] },
  { name: "Bangkok", tours: "95+ Tours", img: "photo-1508009603885-50cf7c579365", grad: ["#5b21b6", "#a78bfa"] },
  { name: "Varanasi", tours: "130+ Tours", img: varanasiImg, grad: ["#9a3412", "#fbbf24"] },
  { name: "Santorini", tours: "60+ Tours", img: "photo-1533105079780-92b9be482077", grad: ["#1d4ed8", "#60a5fa"] },
];

function MarqueeCard({ spot }: { spot: Spot }) {
  return (
    <div className="relative h-[210px] w-[168px] shrink-0 overflow-hidden rounded-[26px] shadow-[0_22px_44px_-18px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:h-[268px] sm:w-[214px]">
      <ImageWithFallback img={spot.img} grad={spot.grad} alt={spot.name} className="h-full w-full" width={520} />
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <div className="font-display text-[19px] font-bold leading-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] sm:text-[21px]">
          {spot.name}
        </div>
        <div className="mt-1 text-[12px] font-semibold text-white/85 sm:text-[13px]">{spot.tours}</div>
      </div>
    </div>
  );
}

/**
 * A slow, seamless left-to-right marquee of destination cards used as the
 * header banner across the three trip-planning modes. Two identical halves +
 * a -50%→0 transform give an infinite loop; pauses on hover, still on
 * reduced-motion (see `.dest-marquee` in index.css).
 */
export function DestinationMarquee({ className = "" }: { className?: string }) {
  const row = [...SPOTS, ...SPOTS];
  return (
    <div className={`dest-stage relative overflow-hidden ${className}`} aria-hidden="true">
      <div className="dest-marquee flex w-max gap-4">
        {row.map((spot, i) => (
          <MarqueeCard key={`${spot.name}-${i}`} spot={spot} />
        ))}
      </div>
    </div>
  );
}
