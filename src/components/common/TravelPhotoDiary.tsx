import { useEffect, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { getPackageById } from "@/data/packages";
import { pastTours } from "@/data/mockProfile";
import { useRouter } from "@/router/RouterContext";
import { buildImageUrl } from "@/utils/format";

type DiaryTrip = {
  packageId: string;
  title: string;
  region: string;
  category: string;
  tags: string[];
  note: string;
  photo: string;
};

function resolveSrc(img: string) {
  return img.startsWith("photo-") ? buildImageUrl(img, 1200) : img;
}

function useDiaryTrips(): DiaryTrip[] {
  return useMemo(
    () =>
      pastTours.slice(0, 3).flatMap((trip) => {
        const pkg = getPackageById(trip.packageId);
        if (!pkg) return [];
        return [
          {
            packageId: pkg.id,
            title: pkg.name.split(" — ")[0],
            region: pkg.region,
            category: pkg.category,
            tags: pkg.tags.slice(0, 3),
            note: trip.note,
            photo: resolveSrc(trip.photos[0] ?? pkg.img),
          },
        ];
      }),
    [],
  );
}

/**
 * Image taller than the frame — as you scroll, it shifts up/down inside the crop
 * (same direction feel: scroll down → image drifts up; scroll up → drifts down).
 */
function ScrollShiftImage({ src, alt }: { src: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const tick = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -80 || rect.top > vh + 80) return;

      // 0 when the frame just enters from the bottom, 1 when it leaves the top.
      const progress = (vh - rect.top) / (vh + rect.height);
      const t = Math.min(1, Math.max(0, progress));

      // Extra height is 70% of the frame — travel most of that slack so the
      // crop shift reads clearly while scrolling.
      const travel = rect.height * 0.32;
      // Scroll down (t ↑) → image moves up (negative Y).
      const y = (0.5 - t) * 2 * travel;
      img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_20px_50px_-28px_rgba(15,32,74,0.35)] md:aspect-auto md:min-h-[280px] lg:min-h-[320px]"
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="pointer-events-none absolute inset-x-0 -top-[35%] h-[170%] w-full object-cover will-change-transform"
      />
    </div>
  );
}

export function TravelPhotoDiary() {
  const { go } = useRouter();
  const trips = useDiaryTrips();
  if (!trips.length) return null;

  return (
    <section>
      <h2 className="reveal font-display text-[42px] font-bold leading-none tracking-tight text-ink">
        Your travel photo diary
      </h2>

      <div className="mt-12 space-y-16 md:space-y-20">
        {trips.map((trip, i) => {
          const n = String(i + 1).padStart(2, "0");
          const total = String(trips.length).padStart(2, "0");

          return (
            <article
              key={trip.packageId}
              className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[160px_minmax(0,340px)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[180px_minmax(0,380px)_minmax(0,1fr)] lg:gap-14"
            >
              <aside className="flex flex-col justify-between gap-8 md:min-h-[280px] lg:min-h-[320px]">
                <div>
                  <p className="text-[16px] font-medium text-muted-foreground">Trip</p>
                  <p className="mt-3 font-display text-[22px] font-bold tracking-tight text-ink">
                    {n} {trip.title}
                  </p>
                  <p className="mt-2 text-[17px] text-muted-foreground">
                    {trip.region} · {trip.category}
                  </p>
                </div>

                <div>
                  <ul className="space-y-2.5">
                    {trip.tags.map((tag) => (
                      <li key={tag} className="text-[17px] text-muted-foreground">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              <ScrollShiftImage src={trip.photo} alt={trip.title} />

              <div className="flex flex-col justify-between md:min-h-[280px] lg:min-h-[320px]">
                <div>
                  <p className="text-[15px] font-medium text-muted-foreground">
                    {n} / {total} · Diary
                  </p>
                  <h3 className="mt-4 font-display text-[40px] font-bold leading-none tracking-tight text-ink sm:text-[48px]">
                    {trip.title}
                  </h3>
                  <p className="mt-3 text-[16px] font-medium text-muted-foreground">
                    {trip.category}
                  </p>
                  <p className="mt-4 max-w-md text-[17px] leading-relaxed text-foreground/85">
                    {trip.note}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => go({ name: "detail", id: trip.packageId })}
                  className="group mt-8 inline-flex max-w-sm flex-col gap-2.5 text-left md:mt-0"
                >
                  <span className="h-px w-full bg-ink/20 transition-colors group-hover:bg-ink/50" />
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink">
                    View package
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
