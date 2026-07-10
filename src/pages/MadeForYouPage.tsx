import { useMemo } from "react";
import { ArrowLeft, CalendarDays, CircleUserRound, Sparkles, Star } from "lucide-react";
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
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <CircleUserRound size={32} />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-muted-foreground">Welcome back,</div>
              <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[30px]">
                {demoUser.name}
              </h1>
              <p className="mt-2 text-[12.5px] text-muted-foreground">
                Member since {demoUser.memberSince} · {pastTours.length} tours completed · {demoUser.tags.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="reveal mt-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <CalendarDays size={18} />
            </span>
            <div>
              <div className="font-display text-[18px] font-semibold text-ink">Your travel photo diary</div>
              <div className="text-[12px] text-muted-foreground">Every trip you&apos;ve booked with IRCTC, in pictures</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastTours.map((trip) => {
              const pkg = getPackageById(trip.packageId);
              if (!pkg) return null;
              return (
                <div key={trip.packageId} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                  <div className="grid grid-cols-3 gap-0.5">
                    {trip.photos.map((photo, i) => (
                      <ImageWithFallback
                        key={i}
                        img={photo}
                        grad={pkg.grad}
                        alt={`${pkg.name} photo ${i + 1}`}
                        className={i === 0 ? "col-span-2 row-span-2 h-full min-h-[120px]" : "h-[59px]"}
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
                    <p className="mt-2 text-[12px] leading-relaxed text-foreground/80">{trip.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="reveal mt-12 rounded-3xl border bg-white p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brand" />
            <div>
              <div className="font-display text-[18px] font-semibold text-ink">Picked for your travel style</div>
              <div className="text-[12px] text-muted-foreground">
                Based on the trips you&apos;ve already taken with us
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((pkg) => (
            <div key={pkg.id} className="reveal relative">
              <PackageCard pkg={pkg} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
