import { Star } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";
import cardImg1 from "@/assets/cta/stat_section1.jpeg";
import cardImg2 from "@/assets/cta/stats_section_placard.jpg";
import cardImg3 from "@/assets/cta/stat_section_placard.jpg";
import avatar1 from "@/assets/hero/jaipur-amber-fort.jpg";
import avatar2 from "@/assets/hero/ladakh-mountains.jpg";
import avatar3 from "@/assets/hero/kerala-tea-gardens.jpg";
import avatar4 from "@/assets/trains/maharajas-express.jpg";

const avatars = [avatar1, avatar2, avatar3, avatar4];

/** Faint concentric quarter-arcs, anchored to a corner (à la premium bento cards). */
function CornerArcs({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      {[52, 84, 116, 148, 180].map((r) => (
        <circle key={r} cx="200" cy="0" r={r} fill="none" stroke="currentColor" strokeWidth="1.25" />
      ))}
    </svg>
  );
}

/** Overlapping traveller avatars for social proof. */
function AvatarStack() {
  return (
    <div className="flex -space-x-3">
      {avatars.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-navy"
        />
      ))}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold text-white ring-2 ring-navy">
        +2L
      </span>
    </div>
  );
}

/** A big animated number with an optional inline unit and a supporting label. */
function BigStat({
  to,
  suffix = "",
  unit,
  label,
  size = "lg",
}: {
  to: number;
  suffix?: string;
  unit?: string;
  label: string;
  size?: "lg" | "md";
}) {
  const { ref, value } = useCountUp(to);
  return (
    <div>
      <div
        className={`flex items-baseline gap-2 font-display font-bold leading-none tracking-tight text-white ${
          size === "lg" ? "text-[clamp(2.1rem,4.4vw,3.1rem)]" : "text-[clamp(1.7rem,3vw,2.2rem)]"
        }`}
      >
        <span>
          <span ref={ref}>{value.toLocaleString("en-IN")}</span>
          {suffix}
        </span>
        {unit && <span className="text-[15px] font-semibold text-white">{unit}</span>}
      </div>
      <div className="mt-2 text-[13px] font-medium text-white/80">{label}</div>
    </div>
  );
}

export function StatsSection() {
  const ref = useReveal();

  return (
    <section className="py-28 md:py-36" ref={ref}>
      <div className="reveal mx-auto grid max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-12 lg:gap-8">
        {/* ── Anchor stat ─────────────────────────────────────────── */}
        <div className="relative flex min-h-[220px] flex-col justify-center overflow-hidden rounded-[28px] p-7 shadow-[0_24px_60px_-28px_hsl(var(--navy)/0.55)] ring-1 ring-white/15 lg:col-span-3 lg:min-h-[300px]">
          <img
            src={cardImg1}
            alt="Two travellers trekking a coastal ridge at golden hour"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20 backdrop-blur-[1px]" />
          <CornerArcs className="pointer-events-none absolute -right-4 -top-4 h-44 w-44 text-white/[0.14]" />
          <div className="relative [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
            <BigStat to={240000} suffix="+" label="Happy travellers a year" />
            <p className="mt-4 max-w-[16ch] text-[13px] leading-relaxed text-white/75">
              Journeys booked with the trust of Indian Railways.
            </p>
          </div>
        </div>

        {/* ── Photo card ──────────────────────────────────────────── */}
        <div className="relative min-h-[220px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_hsl(var(--navy)/0.55)] ring-1 ring-white/15 lg:col-span-4 lg:min-h-[300px]">
          <img
            src={cardImg2}
            alt="A family walking towards their flight with luggage"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/35 to-black/5 backdrop-blur-[0.5px]" />
          <div className="relative flex h-full flex-col justify-end p-7 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
            <div className="font-display text-[clamp(1.7rem,3vw,2.2rem)] font-bold leading-none text-white">
              1,200+
            </div>
            <div className="mt-2 text-[14px] font-semibold text-white">Curated packages</div>
            <div className="text-[13px] text-white/85">Handpicked across Bharat &amp; beyond</div>
          </div>
        </div>

        {/* ── Combined stats card ─────────────────────────────────── */}
        <div className="relative flex min-h-[220px] flex-col overflow-hidden rounded-[28px] p-7 shadow-[0_24px_60px_-28px_hsl(var(--navy)/0.55)] ring-1 ring-white/15 lg:col-span-5 lg:min-h-[300px]">
          <img
            src={cardImg3}
            alt="A traveller watching hot-air balloons rise at sunrise"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/72 via-black/55 to-black/72 backdrop-blur-[1px]" />

          <div className="relative grid flex-1 grid-cols-2 items-start [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
            <div className="border-white/20 pr-6 sm:border-r">
              <BigStat to={4} unit="Luxury Trains" label="Maharajas', Golden Chariot &amp; more" size="md" />
            </div>
            <div className="pl-6">
              <BigStat to={100} suffix="%" label="Secure government payments" size="md" />
            </div>
          </div>

          <div className="relative my-5 border-t border-dashed border-white/20" />

          <div className="relative grid flex-1 grid-cols-2 items-center [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
            <div>
              <AvatarStack />
              <div className="mt-2.5 text-[13px] font-medium text-white/80">60,000+ reviews</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 font-display text-[clamp(1.7rem,3vw,2.2rem)] font-bold leading-none text-white">
                4.8 <Star size={22} className="fill-white text-white" />
              </div>
              <div className="mt-2 text-[13px] font-medium text-white/80">Average traveller rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
