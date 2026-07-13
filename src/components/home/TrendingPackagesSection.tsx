import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages } from "@/data/packages";
import { formatINR } from "@/utils/format";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import planePath from "@/assets/trending/plane-path.svg";

const NUDGE = 320;

function TrendingCard({ pkg }: { pkg: (typeof packages)[number] }) {
  const { go } = useRouter();

  return (
    <div
      className="group relative h-[420px] w-[210px] flex-none overflow-hidden rounded-3xl shadow-lg transition-[width] duration-500 ease-out hover:z-20 hover:w-[440px]"
      style={{ background: `linear-gradient(135deg, ${pkg.grad[0]}, ${pkg.grad[1]})` }}
    >
      <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="absolute inset-0 h-full w-full" overlay={false} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:mb-2 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <span className="overflow-hidden">
            <span className="inline-block whitespace-nowrap text-[11px] font-bold text-white/85">
              {pkg.nights} Nights / {pkg.days} Days
            </span>
          </span>
        </div>

        <h3 className="font-display text-[18px] font-bold leading-tight text-white">{pkg.name.split(" — ")[0]}</h3>

        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <p className="overflow-hidden pr-24 pt-2 text-[12px] leading-relaxed text-white/85">{pkg.blurb}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 top-12 max-w-0 opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:max-w-[150px] group-hover:opacity-100">
        <div className="w-[150px] rounded-2xl border border-white/30 bg-white/15 p-3 shadow-xl backdrop-blur-xl">
          <div className="text-[9.5px] font-bold uppercase tracking-wide text-white/80">Starting from</div>
          <div className="font-display text-[18px] font-bold text-white drop-shadow-sm">
            {formatINR(pkg.price)}
            <span className="text-[12px] font-semibold text-white/70">*</span>
          </div>
          <button
            onClick={() => go({ name: "booking", id: pkg.id })}
            type="button"
            className="mt-2 w-full whitespace-nowrap rounded-full bg-brand py-2 text-[12px] font-bold text-white transition hover:brightness-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrendingPackagesSection() {
  const ref = useReveal();
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const track = trackRef.current;
      if (track && !paused.current) {
        offset.current += dt * 0.035;
        const half = track.scrollWidth / 2;
        if (half > 0 && offset.current >= half) offset.current -= half;
        track.style.transform = `translateX(-${offset.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nudge = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    offset.current = ((offset.current + dir * NUDGE) % half + half) % half;
    track.style.transform = `translateX(-${offset.current}px)`;
  };

  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-4 py-28 md:px-6 md:py-36" ref={ref}>
      <h2 className="reveal heading-xl text-center text-ink">
        Trending <span className="accent">Packages</span>
      </h2>

      {/* z-0 vs the carousel's z-10: keeps the flight path behind the cards, so the
          descending tail is hidden by them and only shows in the gaps above */}
      <div className="reveal relative z-0 mt-8 flex items-end justify-end">
        {/* flight path — trails down over the top-right of the carousel below */}
        {/* natural 800px width, starting just above the arrows and bleeding ~190px
            past them, so the trail runs off the right edge (clipped by the section) */}
        <img
          src={planePath}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-[-190px] z-10 hidden w-[800px] max-w-none select-none lg:block"
        />
        <div className="relative z-20 flex gap-2">
          <button
            onClick={() => nudge(-1)}
            type="button"
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow transition hover:brightness-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => nudge(1)}
            type="button"
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow transition hover:brightness-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        className="reveal relative z-10 mt-6 overflow-hidden"
      >
        <div ref={trackRef} className="flex w-max gap-4" style={{ willChange: "transform" }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-4">
              {packages.map((pkg) => (
                <TrendingCard key={`${copy}-${pkg.id}`} pkg={pkg} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
