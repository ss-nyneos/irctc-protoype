import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  BedDouble,
  BusFront,
  CalendarDays,
  Check,
  CircleAlert,
  FileText,
  Heart,
  Hotel,
  MapPin,
  MapPinned,
  Moon,
  Phone,
  ReceiptText,
  Share2,
  Star,
  Train,
  TrainFront,
  UsersRound,
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
import { CollapsibleSection } from "@/components/detail/CollapsibleSection";
import { BoardingPanel } from "@/components/detail/BoardingPanel";
import { ItineraryMap } from "@/components/detail/ItineraryMap";
import { BookingRail } from "@/components/detail/BookingRail";
import { PolicyPanel } from "@/components/detail/PolicyPanel";
import { FaqAccordion } from "@/components/detail/FaqAccordion";
import { OfficeDirectory } from "@/components/detail/OfficeDirectory";
import { buildFaqs } from "@/data/packageFaqs";
import { nationalHelpline } from "@/data/offices";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";

/** IRCTC prints these as a bare icon row with no detail behind them. */
const inclusionIcons = [
  { key: "Rail", icon: Train, note: "AC 3 / AC 2 tier return journey" },
  { key: "Transfers", icon: BusFront, note: "Shared AC vehicle as per group size" },
  { key: "Hotel", icon: Hotel, note: "AC accommodation in Katra" },
  { key: "Meals", icon: Utensils, note: "On-board and fixed-menu off-board catering" },
  { key: "Sightseeing", icon: MapPinned, note: "Kand Kandoli and Raghunath ji temple" },
  { key: "GST", icon: ReceiptText, note: "Goods and services tax included" },
];

const detailedInclusions = [
  "Comfortable rail journey in AC 3 / AC 2 tier with return ticket.",
  "02 nights in train and 01 night accommodation at hotel in Katra.",
  "Arrival and departure transfer in AC vehicle on sharing basis as per group size.",
  "On-board catering by Railways and off-board catering on fixed menu basis as per the itinerary.",
  "AC accommodation in hotel.",
  "En-route sightseeing of Kand Kandoli Temple and Raghunath ji temple.",
  "GST.",
];

const detailedExclusions = [
  "Onboard extra meals during train journeys.",
  "Portage at hotels or railway station, tips, insurance, mineral water, telephone charges, laundry and personal expenses.",
  "Still / video camera fees, monument entrance fees and activities suggested in the itinerary, payable directly.",
  "Aarti passes.",
  "Line darshan passes.",
  "Additional meals, en-route meals, sightseeing and activities other than those mentioned in the itinerary.",
  "Any service not specified in inclusions.",
];

const tourFacts = [
  { label: "Frequency of tour", value: "Daily Ex NDLS", icon: CalendarDays },
  { label: "Group capacity & class", value: "18 berths in 3AC and 12 berths in 2AC", icon: UsersRound },
  { label: "Hotel stay included", value: "Taj Vivanta or similar, 7 km from Katra", icon: BedDouble },
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
  // Nothing open to start: the map shows the whole route, and picking a pin or a
  // label is what opens a day. -1 means "no day selected".
  const [openDay, setOpenDay] = useState(-1);
  const [boardingCode, setBoardingCode] = useState(detail.boarding[0]?.code ?? "");

  // Which sections are expanded. Each toggles on its own — opening one never
  // closes another, and they can all be closed at once. Overview leads open.
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(["overview"]));
  const toggleSection = (sid: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  // Sidebar click mirrors the section header: it opens a closed section and
  // collapses an open one, then keeps the reader anchored to that block.
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

  const sections = useMemo<Section[]>(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "itinerary", label: "Itinerary" },
        // hasBoarding ? { id: "boarding", label: "Boarding" } : null,
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

  const gst = Math.round(selectedClass.price * travellers * 0.05);
  const total = selectedClass.price * travellers + gst;

  // The pricing rail is shown twice — sticky beside the content on desktop, and
  // inline below it on narrow screens — so it's built once here.
  const rail = (
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
  );

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
          {/* Two short, evenly weighted pills — the long route list used to run
              the row off the width, so it moves to the meta line below. */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/25 px-3.5 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-md">
              <MapPin size={13} className="opacity-80" /> {pkg.category}
            </span> */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/25 px-3.5 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-md">
              <Moon size={13} className="opacity-80" /> {pkg.nights} Nights / {pkg.days} Days
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
              <MapPinned size={14} /> {pkg.region}
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

      {/* Sidebar · content · pricing — three lanes, generously spaced. */}
      <div className="mx-auto grid max-w-[1460px] gap-7 px-4 py-9 md:px-6 lg:grid-cols-[232px_minmax(0,1fr)_396px] lg:gap-9">
        {/* ── Left: always-visible section rail ─────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-[84px]">
            <SectionNav sections={sections} onNavigate={toggleAndScroll} />
          </div>
        </aside>

        {/* ── Middle: collapsible sections ──────────────────────── */}
        <div className="min-w-0 space-y-4">
          <CollapsibleSection
            id="overview"
            title="Overview"
            open={openSections.has("overview")}
            onToggle={() => toggleSection("overview")}
          >
            <p className="max-w-[65ch] text-[16px] leading-relaxed text-foreground/85">{pkg.blurb}</p>

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

          {/* {hasBoarding && (
            <CollapsibleSection
              id="boarding"
              title="Boarding"
              open={openSections.has("boarding")}
              onToggle={() => toggleSection("boarding")}
            >
              <BoardingPanel points={detail.boarding} selected={boardingCode} onSelect={setBoardingCode} />
            </CollapsibleSection>
          )} */}

          <CollapsibleSection
            id="inclusions"
            title="Inclusions"
            open={openSections.has("inclusions")}
            onToggle={() => toggleSection("inclusions")}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {inclusionIcons.map((item) => (
                <div
                  key={item.key}
                  className="group flex min-h-[96px] items-start gap-3 rounded-2xl border border-border bg-gradient-to-br from-white to-secondary/30 p-4 transition hover:border-brand/30 hover:shadow-sm"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl border border-brand/10 bg-white text-brand shadow-sm transition group-hover:bg-brand group-hover:text-white">
                    <item.icon size={19} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-ink">{item.key}</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {tourFacts.map((fact) => (
                <div key={fact.label} className="flex min-h-[104px] items-start gap-3 rounded-2xl border bg-[#F8FAFF] p-4">
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white text-brand shadow-sm ring-1 ring-border">
                    <fact.icon size={16} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                      {fact.label}
                    </div>
                    <div className="mt-1.5 text-[13px] font-normal leading-relaxed text-muted-foreground">
                      {fact.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-3xl border bg-white p-5">
              <div className="grid gap-5 border-t pt-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.78fr)]">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/35 p-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-emerald-700">
                      <Check size={15} /> Official inclusions
                    </div>
                    <p className="mt-1 text-[13px] text-foreground/65">Services covered in the published package fare.</p>
                  </div>

                  <ul className="grid gap-2.5">
                    {detailedInclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/75 p-3 text-[14px] leading-relaxed text-foreground/82">
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check size={12} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border bg-secondary/20 p-4">
                  <div className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                    <X size={15} /> Exclusions
                  </div>

                  <ul className="space-y-2.5">
                    {detailedExclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[13px] leading-relaxed text-foreground/72">
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white text-muted-foreground ring-1 ring-border">
                          <X size={12} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border bg-white p-5">
              <div className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                <FileText size={15} className="text-brand" /> Package snapshot
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-[13px] font-bold text-ink">Also listed as included</div>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground/75">
                        <Check size={14} className="mt-0.5 flex-none text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-2 text-[13px] font-bold text-ink">Package exclusions summary</div>
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
            </div>

            <div className="mt-5 flex justify-center">
              <div className="w-full max-w-[680px] rounded-3xl border border-amber-200 bg-amber-50/40 p-5">
                <div className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-amber-800">
                  <CircleAlert size={15} /> Important notes
                </div>
                <ul className="max-h-[560px] space-y-3 overflow-y-auto pr-2 slim-scrollbar">
                  {importantInclusionNotes.map((note) => (
                    <li key={note} className="flex items-start gap-3 text-[13px] leading-relaxed text-foreground/78">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-amber-600" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="policy"
            title="Terms"
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
            <div className="flex justify-end">
              <a
                href={`tel:${nationalHelpline.number}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-secondary/60 px-4 text-[13px] font-semibold text-navy transition hover:bg-secondary"
              >
                <Phone size={14} className="text-brand" />
                {nationalHelpline.label} · {nationalHelpline.number}
              </a>
            </div>

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

        {/* ── Right: pricing rail (sticky on desktop) ───────────── */}
        {/* The rail fits the viewport on its own, so it just sticks — no inner scroll. */}
        <div className="hidden lg:sticky lg:top-[84px] lg:block lg:self-start">
          {rail}
        </div>
      </div>

      {/* On narrow screens the rail can't stick, so it runs inline instead. */}
      <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6 lg:hidden">{rail}</div>

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
