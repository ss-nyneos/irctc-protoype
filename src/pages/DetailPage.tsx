import { useMemo, useState, type CSSProperties } from "react";
import {
  BedDouble,
  CalendarDays,
  Check,
  CircleAlert,
  Download,
  Heart,
  MapPin,
  MapPinned,
  Moon,
  Phone,
  Share2,
  ShoppingCart,
  Star,
  TrainFront,
  UsersRound,
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
import { CollapsibleSection } from "@/components/detail/CollapsibleSection";
import { BoardingPanel } from "@/components/detail/BoardingPanel";
import { ItineraryMap } from "@/components/detail/ItineraryMap";
import { PolicyPanel } from "@/components/detail/PolicyPanel";
import { FaqAccordion } from "@/components/detail/FaqAccordion";
import { OfficeDirectory } from "@/components/detail/OfficeDirectory";
import { buildFaqs } from "@/data/packageFaqs";
import { nationalHelpline } from "@/data/offices";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";
import { InclusionIcons } from "@/components/package/InclusionIcons";

/** IRCTC's published inclusions, verbatim. */
const detailedInclusions = [
  "Comfortable Rail Journey in AC 3 / AC 2 Tier (Return ticket).",
  "02 Nights in train, 01 night accommodation at hotel in Katra.",
  "Arrival / Departure transfer in AC vehicle on sharing basis as per group size.",
  "On-board Catering by Railways and off-board catering on fixed menu basis as per the itinerary.",
  "AC accommodation in Hotel.",
  "En-route sightseeing of Kand Kandoli Temple and Raghunath ji temple.",
  "GST.",
];

/** IRCTC's published exclusions, verbatim. */
const detailedExclusions = [
  "Onboard EXTRA meals during train journeys.",
  "Any portage at hotels, railway station, tips, insurance, mineral water, telephone charges, laundry and all items of personal nature.",
  "Any Still / Video Camera fees, entrance fees for monuments and any activities suggested in the itinerary are chargeable direct.",
  "Aarti Passes.",
  "Line Darshan passes.",
  "Any additional meals / en route meals, sightseeing and activities other than those mentioned in the itinerary.",
  "Any service not specified in inclusions.",
];

const importantInclusionNotes = [
  "There are limited double-bedded rooms at the hotel. Most guests are accommodated in twin-bed rooms. Double-bed requests may be made at reception during check-in and are subject to availability.",
  "Passengers will be dropped approximately 02 km away from Raghunathji Temple because buses are not permitted up to the temple premises. Guests need to arrange local transport on their own.",
  "Lower berths are at the discretion of Indian Railways.",
  "Sightseeing not mentioned in the itinerary shall be chargeable on direct payment basis.",
  "It is mandatory to carry the identity proof provided at booking. Other passengers must carry a valid photo ID during the package tour. Valid IDs include Aadhaar, Voter ID, Passport, Driving Licence and Student ID cards with photo issued by School / College. As per Jammu & Kashmir state directions, ID proof without residence address will not be entertained.",
  "Hotel check-in and check-out time is 12 noon. Early check-in or late check-out may be provided when possible, but under unavoidable circumstances hotel policy will apply.",
  "IRCTC reserves the right to cancel the tour programme at any point due to exigencies beyond its control. In such an event, IRCTC's maximum liability is limited to the package amount paid by the guest.",
  "The package price is as on the date of booking. If input costs such as railway fare or other expenses beyond IRCTC's control increase, guests are liable to pay the additional amount before commencement of journey.",
  "IRCTC reserves the right to change the itinerary due to unavoidable circumstances including bad weather, train delays or cancellations. IRCTC will make best alternative arrangements, and guests are liable to pay any additional costs for such arrangements. IRCTC is not responsible for loss of sightseeing or visits to planned sites.",
  "IRCTC does not guarantee darshan at shrines, places of interest or monuments mentioned in the itinerary.",
  "Seat allocation in trains is random, and IRCTC will not entertain preferential seat allocation requests.",
  "All passengers need to carry a valid photo ID during the tour. Valid photo IDs include Aadhaar, Voter ID, Passport, Driving Licence, PAN Card, credit cards with photo, cards issued by Central / State Government and student ID cards with photo issued by School / College.",
  "Please carry post-paid mobile phones, as pre-paid mobiles do not function in Jammu & Kashmir.",
  "While in hotel, follow house rules. If you wish to use the swimming pool, carry your own swimming costume.",
  "Tour is subject to operation if minimum booking of 2 passengers on twin / single fare is received.",
  "Train timings, hotel rules, opening and closing hours at monuments, museums, parks, gardens, shrines and sites may change. IRCTC does not take responsibility for such changes, and there will be no refund for unutilized services.",
  "Travellers must strictly follow the tour programme. No refund is given if a traveller fails to join at commencement, joins later, leaves before completion or does not use any service. Travellers may be asked to leave immediately if their behaviour causes distress, annoyance, risk or damage to co-travellers, company property or others.",
];

export function DetailPage({ id }: { id: string }) {
  const { go } = useRouter();
  const ref = useReveal();
  const pkg = getPackageById(id) ?? packages[0];
  const detail = useMemo(() => getPackageDetail(pkg), [pkg]);

  const [classCode] = useState(
    () => (detail.classes.find((c) => c.available) ?? detail.classes[0]).code,
  );
  const [travellers] = useState(2);
  const [departure, setDeparture] = useState(detail.departures[0]);
  const [openDay, setOpenDay] = useState(-1);
  const [boardingCode] = useState(detail.boarding[0]?.code ?? "");

  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(["overview"]));
  const toggleSection = (sid: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  const toggleAndScroll = (sid: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
    requestAnimationFrame(() =>
      document.getElementById(sid)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const selectedClass =
    detail.classes.find((c) => c.code === classCode) ?? detail.classes.find((c) => c.available) ?? detail.classes[0];
  const boardingPoint = detail.boarding.find((b) => b.code === boardingCode) ?? null;
  const hasBoarding = detail.boarding.length > 0;

  const faqs = useMemo(() => buildFaqs(pkg, detail), [pkg, detail]);

  const tourFacts = useMemo(
    () => [
      { label: "Frequency of tour", value: pkg.departure, icon: CalendarDays },
      {
        label: "Categories & class",
        value: detail.classes.map((c) => `${c.label} — ${c.detail}`).join(" · "),
        icon: UsersRound,
      },
      {
        label: "Stay included",
        value: `${pkg.nights} ${pkg.nights === 1 ? "night" : "nights"} · ${pkg.travelMode}`,
        icon: BedDouble,
      },
    ],
    [pkg, detail],
  );

  const sections = useMemo<Section[]>(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "itinerary", label: "Itinerary" },
        { id: "inclusions", label: "Inclusions" },
        { id: "policy", label: "Terms" },
        { id: "contact", label: "Contact us" },
      ].filter((s): s is Section => s !== null),
    [hasBoarding],
  );

  const related = useMemo(() => {
    const picked = new Map<string, (typeof packages)[number]>();
    for (const p of [...packages.filter((p) => p.category === pkg.category), ...packages]) {
      if (p.id !== pkg.id && picked.size < 4) picked.set(p.id, p);
    }
    return [...picked.values()];
  }, [pkg]);

  const gst = Math.round(selectedClass.price * travellers * 0.05);
  const total = selectedClass.price * travellers + gst;

  return (
    <div ref={ref} className="min-h-screen pb-28 lg:pb-24">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[52vh] w-full flex-col overflow-hidden bg-ink">
        {/* Background image fills the section */}
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
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-black/50 to-black/85" />

        {/* Top bar: wishlist + share */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-end px-4 pt-6 md:px-8">
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

        {/* Glass card overlay at bottom of hero */}
        <div className="relative z-10 mt-auto px-4 pb-5 md:px-8">
          <div className="mx-auto max-w-[1600px]">
            <div
              className="overflow-hidden rounded-2xl border border-white/20"
              style={{
                background: "rgba(8, 20, 55, 0.62)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              }}
            >
              <div className="px-6 py-5">
                {/* Top row: name + duration + price */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Duration + category badges */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm">
                        <Moon size={11} className="opacity-75" /> {pkg.nights} Nights / {pkg.days} Days
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm">
                        {pkg.category}
                      </span>
                    </div>

                    {/* Package name */}
                    <h1 className="!text-white text-[22px] font-bold leading-tight md:text-[28px]" style={{ fontFamily: "Helvetica, Arial, sans-serif", letterSpacing: "-0.02em" }}>
                      {pkg.name}
                    </h1>

                    {/* Route */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-white/80">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="opacity-70" /> From {pkg.from}
                      </span>
                      <span className="text-white/40">→</span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPinned size={13} className="opacity-70" /> {pkg.region}
                      </span>
                      <span className="hidden h-3.5 w-px bg-white/30 sm:block" />
                      <span className="inline-flex items-center gap-1.5">
                        <Star size={12} fill="#F26B21" stroke="none" /> {pkg.rating.toFixed(1)} · {pkg.reviews.toLocaleString("en-IN")} reviews
                      </span>
                      <span className="hidden h-3.5 w-px bg-white/30 sm:block" />
                      <span className="inline-flex items-center gap-1.5">
                        <TrainFront size={13} className="opacity-70" /> {pkg.travelMode}
                      </span>
                    </div>

                    {/* Blurb (2-line clamp) */}
                    <p className="mt-3 line-clamp-2 max-w-[70ch] text-[13px] leading-relaxed text-white/75">
                      {pkg.blurb}
                    </p>

                    {/* Inclusions */}
                    <div className="mt-3 border-t border-white/15 pt-3">
                      <InclusionIcons pkg={pkg} tone="light" size={13} />
                    </div>
                  </div>

                  {/* Price panel */}
                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-medium text-white/55">Starting from</div>
                    <div className="font-display text-[28px] font-bold tabular-nums text-white">
                      {formatINR(pkg.price)}
                    </div>
                    <div className="text-[11px] text-white/55">per person</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AccentBar />

      {/* ── Main content: sidebar · sections · action buttons ── */}
      <div className="mx-auto grid max-w-[1460px] gap-7 px-4 py-9 md:px-6 lg:grid-cols-[200px_minmax(0,1fr)_180px] lg:gap-9">

        {/* ── Left: section nav ─────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-[84px]">
            <SectionNav sections={sections} onNavigate={toggleAndScroll} />
          </div>
        </aside>

        {/* ── Middle: collapsible content sections ──────────── */}
        <div className="min-w-0 space-y-4">
          <CollapsibleSection
            id="overview"
            title="Overview"
            open={openSections.has("overview")}
            onToggle={() => toggleSection("overview")}
          >
            <p className="max-w-[65ch] text-[15px] leading-relaxed text-foreground/85">{pkg.blurb}</p>

            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={12} />
                  </span>
                  <span className="text-[14px] font-medium leading-relaxed text-foreground/80">{h}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection
            id="itinerary"
            title="Itinerary"
            open={openSections.has("itinerary")}
            onToggle={() => toggleSection("itinerary")}
          >
            <ItineraryMap days={pkg.itinerary} active={openDay} onActive={setOpenDay} />
          </CollapsibleSection>

          <CollapsibleSection
            id="inclusions"
            title="Inclusions"
            open={openSections.has("inclusions")}
            onToggle={() => toggleSection("inclusions")}
          >
            {/* Tour facts */}
            <div className="grid gap-3 md:grid-cols-3">
              {tourFacts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border bg-white p-5">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                    <fact.icon size={15} className="flex-none text-brand" /> {fact.label}
                  </div>
                  <div className="mt-2 text-[14px] leading-relaxed text-foreground/80">{fact.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
              <div className="grid divide-y xl:grid-cols-2 xl:divide-x xl:divide-y-0">
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wide text-muted-foreground">
                    <Check size={15} className="flex-none text-emerald-600" /> Inclusions
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {detailedInclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/80">
                        <Check size={16} className="mt-1 flex-none text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wide text-muted-foreground">
                    <X size={15} className="flex-none text-destructive" /> Exclusions
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {detailedExclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/80">
                        <X size={16} className="mt-1 flex-none text-destructive" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-amber-800">
                <CircleAlert size={15} className="flex-none" /> Important notes
              </div>
              <ul className="mt-4 max-h-[560px] space-y-2.5 overflow-y-auto pr-2 slim-scrollbar">
                {importantInclusionNotes.map((note) => (
                  <li key={note} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber-600" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="policy"
            title="Terms & Policy"
            open={openSections.has("policy")}
            onToggle={() => toggleSection("policy")}
          >
            <PolicyPanel
              sections={detail.policy}
              code={detail.code}
              total={total}
              travellers={travellers}
              departure={departure}
            />
          </CollapsibleSection>

          <CollapsibleSection
            id="contact"
            title="Contact us"
            open={openSections.has("contact")}
            onToggle={() => toggleSection("contact")}
          >
            <div className="mt-5">
              <OfficeDirectory pkg={pkg} boarding={detail.boarding} />
            </div>

            <div className="mt-8">
              <h3 className="font-display text-[17px] font-bold text-ink">Frequently asked questions</h3>
              <div className="mt-3">
                <FaqAccordion faqs={faqs} />
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* ── Right: Book Now + Download Details buttons ──────── */}
        <div className="hidden lg:sticky lg:top-[84px] lg:block lg:self-start">
          <div className="flex flex-col gap-3">
            {/* Price summary */}
            {/* <div className="rounded-2xl border-2 border-brand/10 bg-white p-5 shadow-lg">
              <div className="text-[11px] text-muted-foreground">{selectedClass.label} · per person</div>
              <div className="mt-1 font-display text-[26px] font-bold tabular-nums text-ink">
                {formatINR(selectedClass.price)}
              </div>
              {pkg.oldPrice && (
                <div className="mt-0.5 text-[13px] tabular-nums text-muted-foreground line-through">
                  {formatINR(pkg.oldPrice)}
                </div>
              )}
              <div className="mt-2 rounded-xl bg-secondary/50 px-3 py-2 text-[12px] tabular-nums text-muted-foreground">
                {travellers} traveller{travellers > 1 ? "s" : ""} · incl. 5% GST
              </div>
            </div> */}

            {/* Book Now */}
            <button
              type="button"
              onClick={() =>
                go({
                  name: "booking",
                  id: pkg.id,
                  classCode: selectedClass.code,
                  departure,
                  travellers,
                })
              }
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95"
            >
              <ShoppingCart size={17} />
              Book Now
            </button>

            {/* Download Details */}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand/30 bg-white px-5 py-3.5 text-[15px] font-bold text-brand transition hover:bg-brand/5"
            >
              {/* <Download size={17} /> */}
              Download Details
            </button>

            <p className="text-center text-[12px] text-muted-foreground">
              Secure government payment · Part-pay 25% today
            </p>
          </div>
        </div>
      </div>

      {/* ── Related packages ──────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="reveal font-display text-[22px] font-bold text-ink">You might also like</h2>

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

      {/* ── Mobile book bar ────────────────────────────────── */}
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
            className="flex min-h-[48px] flex-none items-center gap-2 justify-center rounded-2xl bg-brand px-5 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95"
          >
            <ShoppingCart size={16} /> Book Now
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex min-h-[48px] flex-none items-center gap-2 justify-center rounded-2xl border-2 border-brand px-4 text-[15px] font-bold text-brand transition hover:bg-brand/5"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
