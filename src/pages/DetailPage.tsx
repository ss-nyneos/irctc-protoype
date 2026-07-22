import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  Bus,
  Check,
  Heart,
  Hotel,
  MapPin,
  Moon,
  Phone,
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
import { FaqAccordion } from "@/components/detail/FaqAccordion";
import { OfficeDirectory } from "@/components/detail/OfficeDirectory";
import { buildFaqs } from "@/data/packageFaqs";
import { nationalHelpline } from "@/data/offices";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";

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

  const faqs = useMemo(() => buildFaqs(pkg, detail), [pkg, detail]);

  const sections = useMemo<Section[]>(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "itinerary", label: "Itinerary" },
        hasBoarding ? { id: "boarding", label: "Boarding" } : null,
        { id: "inclusions", label: "Inclusions" },
        { id: "policy", label: "Terms" },
        { id: "contact", label: "Contact us" },
      ].filter((s): s is Section => s !== null),
    [hasBoarding],
  );

  // Same category first, then anything else to top the shelf up to four. The
  // backfill repeats the whole catalogue, so it has to be de-duped by id —
  // otherwise a same-category package shows up twice in the same row.
  const related = useMemo(() => {
    const picked = new Map<string, (typeof packages)[number]>();
    for (const p of [...packages.filter((p) => p.category === pkg.category), ...packages]) {
      if (p.id !== pkg.id && picked.size < 4) picked.set(p.id, p);
    }
    return [...picked.values()];
  }, [pkg]);

  const gst = Math.round(
    (selectedClass.price * travellers + (addFlight ? pkg.flightAddon * travellers : 0)) * 0.05,
  );
  const total = selectedClass.price * travellers + (addFlight ? pkg.flightAddon * travellers : 0) + gst;

  return (
    <div ref={ref} className="min-h-screen pb-28 lg:pb-24">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[80vh] w-full flex-col overflow-hidden bg-ink md:min-h-[88vh]">
        {/* Wrapped rather than positioned directly: the component's own root is
            `relative`, which outranks an `absolute` passed in via className. */}
        <div className="absolute inset-0">
          <ImageWithFallback
            img={pkg.img}
            grad={pkg.grad}
            alt={pkg.name}
            overlay={false}
            width={1800}
            className="h-full w-full scale-105 [&_img]:object-[center_25%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-black/45 to-black/75" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#0B2E6B]" />

        <div className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 pt-6 md:px-8">
          <button
            onClick={back}
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Save to wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <Heart size={16} />
            </button>
            <button
              type="button"
              aria-label="Share this package"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-[8vh] pt-12 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/20 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <MapPin size={13} /> {pkg.category} · {pkg.region}
            </span>
            <span className="rounded-full border border-white/25 bg-white/20 px-3 py-1.5 text-[11.5px] font-bold tracking-wide text-white backdrop-blur-md">
              {detail.code}
            </span>
          </div>

          <h1 className="heading-xl max-w-3xl text-balance leading-[1.06] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] md:text-[54px]">
            {pkg.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <Star size={13} fill="#F26B21" stroke="none" /> {pkg.rating.toFixed(1)} ·{" "}
              {pkg.reviews.toLocaleString("en-IN")} reviews
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <Moon size={14} /> {pkg.nights}N / {pkg.days}D
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <MapPin size={14} /> From {pkg.from}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <TrainFront size={14} /> {pkg.travelMode}
            </span>
          </div>
        </div>
      </section>

      <AccentBar />
      <SectionNav sections={sections} />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0">
          {/* ── Overview ───────────────────────────────────────── */}
          <section id="overview" className="scroll-mt-[132px]">
            <p className="reveal max-w-[65ch] text-[17px] leading-relaxed text-foreground/85">{pkg.blurb}</p>

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
            <PolicyPanel
              sections={detail.policy}
              code={detail.code}
              total={total}
              travellers={travellers}
              departure={departure}
            />
          </section>

          {/* ── Contact us ─────────────────────────────────────── */}
          <section id="contact" className="mt-14 scroll-mt-[132px]">
            <div className="reveal flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-[22px] font-bold text-ink">Contact us</h2>
              <a
                href={`tel:${nationalHelpline.number}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-secondary/60 px-4 text-[13px] font-semibold text-navy transition hover:bg-secondary"
              >
                <Phone size={14} className="text-brand" />
                {nationalHelpline.label} · {nationalHelpline.number}
              </a>
            </div>

            <div className="reveal mt-5">
              <OfficeDirectory pkg={pkg} boarding={detail.boarding} />
            </div>

            <div className="reveal mt-8">
              <CallbackForm packageName={pkg.name} code={detail.code} />
            </div>

            <div className="reveal mt-8">
              <h3 className="font-display text-[17px] font-bold text-ink">Frequently asked questions</h3>
              <div className="mt-3">
                <FaqAccordion faqs={faqs} />
              </div>
            </div>
          </section>
        </div>

        
        <div className="slim-scrollbar hidden lg:sticky lg:top-[128px] lg:block lg:max-h-[calc(100vh-152px)] lg:self-start lg:overflow-y-auto lg:pr-2">
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

        {/* Hover-to-grow row, as on the listing grid — what one cell takes the
            others give back, so the row's total width never moves. */}
        <div
          className="card-row mt-4 flex flex-col gap-4 sm:flex-row"
          style={
            {
              "--cell-grow": 1 + HOVER_GROW,
              "--cell-shrink": related.length > 1 ? 1 - HOVER_GROW / (related.length - 1) : 1,
            } as CSSProperties
          }
        >
          {related.map((p) => (
            <div key={p.id} className="card-cell min-w-0">
              <div className="reveal">
                <EditorialPackageCard pkg={p} compact />
              </div>
            </div>
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
