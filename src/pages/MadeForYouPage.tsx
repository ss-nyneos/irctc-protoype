import { useMemo } from "react";
import { ArrowLeft, CalendarDays, CircleUserRound, Star } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { getPackageById } from "@/data/packages";
import { demoUser, getSuggestions, pastTours } from "@/data/mockProfile";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { DestinationMarquee } from "@/components/common/DestinationMarquee";
import { PackageCard } from "@/components/package/PackageCard";

export function MadeForYouPage() {
  const { back } = useRouter();
  const ref = useReveal();
  const recommended = useMemo(() => getSuggestions(4), []);

  return (
    <div ref={ref} className="min-h-screen pb-20">
      <div className="relative overflow-hidden bg-white">
        <DestinationMarquee className="pt-8" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 md:px-6">
          <button onClick={back} type="button" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-ink">
            <ArrowLeft size={15} /> Back
          </button>
          {/* profile — a frosted panel floating over a soft brand wash. The blurred
              colour blobs sit *behind* the glass so it has something to refract;
              on a flat white background the frost would read as nothing at all. */}
          <div className="relative mt-3 overflow-hidden rounded-3xl">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#dbe8fd] via-[#eef4ff] to-[#e4eefe]" />
            <span aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-10 h-52 w-52 rounded-full bg-azure/30 blur-3xl" />
            <span aria-hidden="true" className="pointer-events-none absolute right-1/3 -top-10 h-36 w-36 rounded-full bg-saffron/20 blur-3xl" />

            <div className="glass relative flex items-center gap-4 rounded-3xl border border-white/60 p-6 shadow-[0_18px_50px_-20px_rgba(15,32,74,0.35)] ring-1 ring-inset ring-white/40 md:gap-6 md:p-8">
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white/70 text-brand shadow-sm ring-1 ring-white/60 md:h-20 md:w-20">
                <CircleUserRound size={40} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-muted-foreground">Welcome back,</div>
                <h1 className="font-display text-[38px] font-bold leading-none tracking-tight text-ink sm:text-[52px]">
                  {demoUser.name}
                </h1>
                <p className="mt-2.5 text-[12.5px] text-muted-foreground">
                  Member since {demoUser.memberSince} · {pastTours.length} tours completed · {demoUser.tags.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="reveal mt-4">
          <h2 className="font-display text-[42px] font-bold leading-none text-ink">Your travel photo diary</h2>

          {/* same columns, gap and row height as "Picked for your travel style" below, so
              every card on the page is exactly the same size */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:auto-rows-[380px] lg:grid-cols-4">
            {pastTours.map((trip) => {
              const pkg = getPackageById(trip.packageId);
              if (!pkg) return null;
              return (
                <div key={trip.packageId} className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
                  {/* collage grows to fill whatever height the row gives it (min-h keeps it
                      from collapsing when the row height is auto, e.g. below lg) */}
                  <div className="grid min-h-[160px] flex-1 grid-cols-3 grid-rows-2 gap-0.5">
                    {trip.photos.map((photo, i) => (
                      <ImageWithFallback
                        key={i}
                        img={photo}
                        grad={pkg.grad}
                        alt={`${pkg.name} photo ${i + 1}`}
                        className={i === 0 ? "col-span-2 row-span-2 h-full" : "h-full"}
                        overlay={false}
                      />
                    ))}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-bold text-ink">{pkg.name.split(" — ")[0]}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: trip.rating }).map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                        ))}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays size={11} />
                      {new Date(trip.travelDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-foreground/80">{trip.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h2 className="reveal mt-12 font-display text-[42px] font-bold leading-none text-ink">
          Picked for your travel style
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:auto-rows-[380px] lg:grid-cols-4">
          {recommended.map((pkg) => (
            <div key={pkg.id} className="reveal relative h-full">
              <PackageCard pkg={pkg} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
