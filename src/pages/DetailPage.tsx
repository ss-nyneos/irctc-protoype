import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Moon,
  Plane,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages, getPackageById } from "@/data/packages";
import { formatINR } from "@/utils/format";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { AccentBar } from "@/components/common/AccentBar";

export function DetailPage({ id }: { id: string }) {
  const { back, go } = useRouter();
  const ref = useReveal();
  const pkg = getPackageById(id) ?? packages[0];

  const [travellers, setTravellers] = useState(2);
  const [addFlight, setAddFlight] = useState(false);
  const [openDay, setOpenDay] = useState<number | null>(0);

  const hasFlightAddon = pkg.flightAddon > 0;
  const total = (pkg.price + (addFlight && hasFlightAddon ? pkg.flightAddon : 0)) * travellers;

  const related = packages
    .filter((p) => p.id !== pkg.id && p.category === pkg.category)
    .concat(packages.filter((p) => p.id !== pkg.id))
    .slice(0, 4);

  return (
    <div ref={ref} className="min-h-screen pb-24">
      <div className="relative h-[46vh] min-h-[340px] w-full overflow-hidden">
        <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-full w-full" overlay={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

        <div className="absolute inset-x-0 top-0">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <button onClick={back} type="button" className="inline-flex items-center gap-1.5 rounded-full glass-dark px-4 py-2 text-[13px] font-semibold text-white">
              <ArrowLeft size={15} /> Back
            </button>
            <div className="flex gap-2">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full glass-dark text-white">
                <Heart size={16} />
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full glass-dark text-white">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6">
            <div className="flex flex-wrap items-center gap-1 text-[12px] font-semibold text-white/90">
              <MapPin size={12} /> {pkg.category} · {pkg.region}
            </div>
            <h1 className="heading-xl mt-3 max-w-3xl text-balance text-white">{pkg.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-white/90">
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <Star size={13} fill="#F26B21" stroke="none" /> {pkg.rating.toFixed(1)} · {pkg.reviews.toLocaleString("en-IN")} reviews
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <Moon size={14} />
                {pkg.nights}N / {pkg.days}D
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <MapPin size={14} />
                From {pkg.from}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AccentBar />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0">
          <p className="reveal text-[16px] leading-relaxed text-foreground/85">{pkg.blurb}</p>

          <div className="reveal mt-6 grid gap-3 sm:grid-cols-2">
            {pkg.highlights.map((h) => (
              <div key={h} className="flex items-start gap-2.5 rounded-2xl border bg-white p-3.5 shadow-sm">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check size={13} />
                </span>
                <span className="text-[14px] font-semibold text-foreground/85">{h}</span>
              </div>
            ))}
          </div>

          <div className="reveal mt-10">
            <h2 className="heading-xl text-ink">Day-by-day itinerary</h2>
            <div className="mt-4 space-y-2">
              {pkg.itinerary.map((day, idx) => {
                const open = openDay === idx;
                return (
                  <div key={day.day} className="overflow-hidden rounded-2xl border bg-white">
                    <button
                      onClick={() => setOpenDay(open ? null : idx)}
                      type="button"
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand font-display text-[15px] font-bold text-white">
                        {day.day}
                      </span>
                      <span className="flex-1 font-semibold text-ink">{day.title}</span>
                      <ChevronDown size={18} className={`text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div className="border-t bg-secondary/40 px-4 py-3 pl-[68px] text-[14px] text-foreground/75">
                        {day.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="reveal mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 font-display text-[17px] font-semibold text-emerald-700">
                <Check size={18} /> What&apos;s included
              </div>
              <ul className="space-y-2">
                {pkg.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-foreground/80">
                    <Check size={14} className="mt-0.5 flex-none text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 font-display text-[17px] font-semibold text-muted-foreground">
                <X size={18} /> Not included
              </div>
              <ul className="space-y-2">
                {pkg.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-foreground/70">
                    <X size={14} className="mt-0.5 flex-none text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border-2 border-brand/10 bg-white shadow-xl">
            <div className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-muted-foreground">from · per person</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[30px] font-bold text-ink">{formatINR(pkg.price)}</span>
                    {pkg.oldPrice && <span className="text-[14px] text-muted-foreground line-through">{formatINR(pkg.oldPrice)}</span>}
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  Free cancellation*
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border p-3">
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <Users size={16} /> Travellers
                </span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTravellers((t) => Math.max(1, t - 1))} type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border text-ink hover:bg-secondary">
                    −
                  </button>
                  <span className="w-5 text-center font-bold text-ink">{travellers}</span>
                  <button onClick={() => setTravellers((t) => Math.min(12, t + 1))} type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border text-ink hover:bg-secondary">
                    +
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-xl border p-3">
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <Calendar size={16} /> Departure
                </span>
                <select className="bg-transparent text-right text-[13px] font-semibold text-ink outline-none">
                  <option>Select date</option>
                  <option>15 Aug 2026</option>
                  <option>02 Sep 2026</option>
                  <option>19 Oct 2026</option>
                </select>
              </div>

              {hasFlightAddon ? (
                <button
                  onClick={() => setAddFlight((v) => !v)}
                  type="button"
                  className={`mt-3 flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
                    addFlight ? "border-brand bg-brand/5" : "border-dashed border-brand/25 hover:border-brand/50"
                  }`}
                >
                  <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${addFlight ? "bg-brand text-white" : "bg-brand/5 text-brand"}`}>
                    <Plane size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
                      Add IRCTC flights{" "}
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">SAVE {formatINR(1500)}</span>
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      Return airfare to {pkg.from} · from {formatINR(pkg.flightAddon)}/person
                    </span>
                  </span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${addFlight ? "border-brand bg-brand text-white" : "border-muted"}`}>
                    {addFlight && <Check size={13} />}
                  </span>
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-2 rounded-2xl bg-brand/5 p-3.5 text-[12px] text-muted-foreground">
                  <Plane size={16} className="text-brand" /> Onboard rail travel already included in this journey.
                </div>
              )}

              <div className="mt-4 space-y-1.5 rounded-xl bg-secondary/50 p-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {formatINR(pkg.price)} × {travellers}
                  </span>
                  <span className="font-semibold">{formatINR(pkg.price * travellers)}</span>
                </div>
                {addFlight && hasFlightAddon && (
                  <div className="flex justify-between text-brand">
                    <span>Flights × {travellers}</span>
                    <span className="font-semibold">{formatINR(pkg.flightAddon * travellers)}</span>
                  </div>
                )}
                <div className="mt-1.5 flex items-center justify-between border-t pt-2">
                  <span className="font-bold text-ink">Total</span>
                  <span className="font-display text-[22px] font-bold text-ink">{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={() => go({ name: "booking", id: pkg.id })}
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-[16px] font-bold text-white shadow-lg transition hover:brightness-95"
              >
                Book this tour
              </button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
                <ShieldCheck size={14} className="text-emerald-600" /> Secure government payment · Part-pay 25% today
              </div>
            </div>

            {pkg.aiReason && (
              <div className="border-t bg-brand/[0.03] p-4">
                <div className="flex items-start gap-2 text-[12px] text-foreground/75">
                  <Sparkles size={14} className="mt-0.5 flex-none text-brand" />
                  <span>
                    <b className="text-ink">AI note:</b> {pkg.aiReason}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6" ref={ref}>
        <h2 className="reveal heading-xl text-ink">You might also like</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <button
              key={p.id}
              onClick={() => go({ name: "detail", id: p.id })}
              type="button"
              className="reveal group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-lg"
            >
              <ImageWithFallback img={p.img} grad={p.grad} alt={p.name} className="h-28" />
              <div className="p-3">
                <div className="line-clamp-1 font-display text-[14px] font-semibold leading-tight text-ink">{p.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[12px]">
                    <Star size={11} fill="#F26B21" stroke="none" /> {p.rating.toFixed(1)}
                  </span>
                  <span className="font-bold text-ink">{formatINR(p.price)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
