import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bus,
  Check,
  Heart,
  Hotel,
  MapPin,
  Moon,
  Share2,
  ShieldCheck,
  Star,
  TrainFront,
  UserCheck,
  Utensils,
  X,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages, getPackageById } from "@/data/packages";
import { getPackageDetail } from "@/data/packageDetail";
import { formatINR } from "@/utils/format";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { AccentBar } from "@/components/common/AccentBar";
import { SectionNav, type Section } from "@/components/detail/SectionNav";
import { BoardingPanel } from "@/components/detail/BoardingPanel";
import { ItineraryMap } from "@/components/detail/ItineraryMap";
import { BookingRail } from "@/components/detail/BookingRail";
import { PolicyPanel } from "@/components/detail/PolicyPanel";
import { CallbackForm } from "@/components/detail/CallbackForm";

/** IRCTC prints these as a bare icon row with no detail behind them. */
const inclusionIcons = [
  { key: "Train", icon: TrainFront, note: "Reserved berths, both ways" },
  { key: "Bus", icon: Bus, note: "AC coach for sightseeing" },
  { key: "Hotel", icon: Hotel, note: "Twin sharing, en-suite" },
  { key: "Meal", icon: Utensils, note: "Breakfast & dinner daily" },
  { key: "Guide", icon: UserCheck, note: "Tour escort throughout" },
  { key: "Insurance", icon: ShieldCheck, note: "Cover for every traveller" },
];

export function DetailPage({ id }: { id: string }) {
  const { back, go } = useRouter();
  const ref = useReveal();
  const pkg = getPackageById(id) ?? packages[0];
  const detail = useMemo(() => getPackageDetail(pkg), [pkg]);

  // Never open on a sold-out class.
  const [classCode, setClassCode] = useState(
    () => (detail.classes.find((c) => c.available) ?? detail.classes[0]).code,
  );
  const [travellers, setTravellers] = useState(2);
  const [departure, setDeparture] = useState(detail.departures[0]);
  const [addFlight, setAddFlight] = useState(false);
  // Always a day open — the itinerary train is always parked at some station.
  const [openDay, setOpenDay] = useState(0);
  const [boardingCode, setBoardingCode] = useState(detail.boarding[0]?.code ?? "");

  const selectedClass =
    detail.classes.find((c) => c.code === classCode) ?? detail.classes.find((c) => c.available) ?? detail.classes[0];
  const boardingPoint = detail.boarding.find((b) => b.code === boardingCode) ?? null;
  const hasBoarding = detail.boarding.length > 0;

  const sections = useMemo<Section[]>(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "itinerary", label: "Itinerary" },
        hasBoarding ? { id: "boarding", label: "Boarding" } : null,
        { id: "inclusions", label: "Inclusions" },
        { id: "policy", label: "Terms" },
        { id: "help", label: "Help" },
      ].filter((s): s is Section => s !== null),
    [hasBoarding],
  );

  const related = packages
    .filter((p) => p.id !== pkg.id && p.category === pkg.category)
    .concat(packages.filter((p) => p.id !== pkg.id))
    .slice(0, 4);

  const gst = Math.round(
    (selectedClass.price * travellers + (addFlight ? pkg.flightAddon * travellers : 0)) * 0.05,
  );
  const total = selectedClass.price * travellers + (addFlight ? pkg.flightAddon * travellers : 0) + gst;

  return (
    <div ref={ref} className="min-h-screen pb-28 lg:pb-24">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative h-[46vh] min-h-[340px] w-full overflow-hidden">
        <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-full w-full" overlay={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

        <div className="absolute inset-x-0 top-0">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <button
              onClick={back}
              type="button"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full glass-dark px-4 text-[13px] font-semibold text-white"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Save to wishlist"
                className="flex h-11 w-11 items-center justify-center rounded-full glass-dark text-white"
              >
                <Heart size={16} />
              </button>
              <button
                type="button"
                aria-label="Share this package"
                className="flex h-11 w-11 items-center justify-center rounded-full glass-dark text-white"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/90">
                <MapPin size={12} /> {pkg.category} · {pkg.region}
              </span>
              {/* Package code as a chip — IRCTC bolts it into the title itself. */}
              <span className="rounded-full glass-dark px-2 py-0.5 text-[11px] font-bold tracking-wide text-white/90">
                {detail.code}
              </span>
            </div>
            {/* Sentence case, not the ALL CAPS of the original. */}
            <h1 className="heading-xl mt-3 max-w-3xl text-balance text-white">{pkg.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-white/90">
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <Star size={13} fill="#F26B21" stroke="none" /> {pkg.rating.toFixed(1)} ·{" "}
                {pkg.reviews.toLocaleString("en-IN")} reviews
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <Moon size={14} /> {pkg.nights}N / {pkg.days}D
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <MapPin size={14} /> From {pkg.from}
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                <TrainFront size={14} /> {pkg.travelMode}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AccentBar />
      <SectionNav sections={sections} />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0">
          {/* ── Overview ───────────────────────────────────────── */}
          <section id="overview" className="scroll-mt-[132px]">
            {/* Printed once — the original repeats it verbatim in the tab below.
                Held to ~65 characters a line, which is where prose stays readable. */}
            <p className="reveal max-w-[65ch] text-[17px] leading-relaxed text-foreground/85">{pkg.blurb}</p>

            {/* No stat row here: duration, travel mode and departure city are
                already in the hero two hundred pixels up, and the classes are
                priced in the fare rail alongside. Repeating them was most of
                what made this column read as noise. */}

            <ul className="reveal mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={12} />
                  </span>
                  <span className="text-[14px] font-medium leading-relaxed text-foreground/80">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Itinerary ──────────────────────────────────────── */}
          <section id="itinerary" className="reveal mt-14 scroll-mt-[132px]">
            <ItineraryMap days={pkg.itinerary} active={openDay} onActive={setOpenDay} />
          </section>

          {/* ── Boarding ───────────────────────────────────────── */}
          {hasBoarding && (
            <section id="boarding" className="reveal mt-14 scroll-mt-[132px]">
              <BoardingPanel points={detail.boarding} selected={boardingCode} onSelect={setBoardingCode} />
            </section>
          )}

          {/* ── Inclusions ─────────────────────────────────────── */}
          <section id="inclusions" className="reveal mt-14 scroll-mt-[132px]">
            <h2 className="font-display text-[22px] font-bold text-ink">What the fare covers</h2>

            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {inclusionIcons.map((item) => (
                <div key={item.key} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <item.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-ink">{item.key}</div>
                    {/* The original stops at the icon; the detail is the useful half. */}
                    <div className="text-[12px] leading-snug text-muted-foreground">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-x-8 gap-y-6 border-t pt-6 sm:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-emerald-700">
                  <Check size={14} /> Included
                </div>
                <ul className="space-y-2">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground/80">
                      <Check size={14} className="mt-0.5 flex-none text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                  <X size={14} /> Not included
                </div>
                <ul className="space-y-2">
                  {pkg.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground/70">
                      <X size={14} className="mt-0.5 flex-none text-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Terms ──────────────────────────────────────────── */}
          <section id="policy" className="reveal mt-14 scroll-mt-[132px]">
            <PolicyPanel sections={detail.policy} code={detail.code} />
          </section>

          {/* ── Help ───────────────────────────────────────────── */}
          <section id="help" className="reveal mt-14 scroll-mt-[132px]">
            <CallbackForm packageName={pkg.name} code={detail.code} />
          </section>
        </div>

        {/* ── Fare rail ────────────────────────────────────────── */}
        {/* Capped to the space below the sticky header and scrolled internally:
            pinned at top-[128px] with no height limit, anything past the fold —
            the flight add-on, the book button — simply could not be reached. */}
        <div className="hidden lg:sticky lg:top-[128px] lg:block lg:max-h-[calc(100vh-152px)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          <BookingRail
            pkg={pkg}
            classes={detail.classes}
            departures={detail.departures}
            boardingPoint={boardingPoint}
            selectedClass={selectedClass}
            onSelectClass={setClassCode}
            travellers={travellers}
            onTravellers={setTravellers}
            departure={departure}
            onDeparture={setDeparture}
            addFlight={addFlight}
            onAddFlight={setAddFlight}
            onBook={() =>
              go({
                name: "booking",
                id: pkg.id,
                classCode: selectedClass.code,
                departure,
                boarding: boardingCode || undefined,
                travellers,
              })
            }
          />
        </div>

        {/* On narrow screens the rail can't stick, so it runs inline instead. */}
        <div className="lg:hidden">
          <BookingRail
            pkg={pkg}
            classes={detail.classes}
            departures={detail.departures}
            boardingPoint={boardingPoint}
            selectedClass={selectedClass}
            onSelectClass={setClassCode}
            travellers={travellers}
            onTravellers={setTravellers}
            departure={departure}
            onDeparture={setDeparture}
            addFlight={addFlight}
            onAddFlight={setAddFlight}
            onBook={() =>
              go({
                name: "booking",
                id: pkg.id,
                classCode: selectedClass.code,
                departure,
                boarding: boardingCode || undefined,
                travellers,
              })
            }
          />
        </div>
      </div>

      {/* ── Related ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="reveal font-display text-[22px] font-bold text-ink">You might also like</h2>
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
                  <span className="font-bold tabular-nums text-ink">{formatINR(p.price)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile book bar ──────────────────────────────────── */}
      {/* z-45 clears the Disha launcher's z-40: on this page the fare and the
          book button are the primary action and must not sit under a chat bubble. */}
      <div className="fixed inset-x-0 bottom-0 z-[45] border-t bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] text-muted-foreground">
              {selectedClass.code} · {travellers} {travellers === 1 ? "traveller" : "travellers"} · incl. GST
            </div>
            <div className="font-display text-[19px] font-bold tabular-nums leading-tight text-ink">
              {formatINR(total)}
            </div>
          </div>
          <button
            onClick={() => go({ name: "booking", id: pkg.id })}
            type="button"
            className="flex min-h-[48px] flex-none items-center justify-center rounded-2xl bg-brand px-6 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95"
          >
            Book this tour
          </button>
        </div>
      </div>
    </div>
  );
}
