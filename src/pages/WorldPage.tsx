import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  CalendarDays,
  HandHelping,
  Headset,
  LayoutGrid,
  MapPin,
  Navigation,
  Rows3,
  ShieldCheck,
  Sparkles,
  Sun,
  Ticket,
  TrainFront,
  Wallet,
  X,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages, getPackageById } from "@/data/packages";
import type { BudgetBand, Climate, Experience, TourPackage } from "@/types";
// import { DestinationMarquee } from "@/components/common/DestinationMarquee";
// import { AiPickBanner } from "@/components/home/AiPickBanner";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";
import { PackageListRow } from "@/components/package/PackageListRow";
import { RecentPackagesDrawer } from "@/components/package/RecentPackagesDrawer";
import { FilterPanel, type FilterSection } from "@/components/package/FilterPanel";
import { PackageSearchBar, type SearchField } from "@/components/package/PackageSearchBar";
import heroScene from "@/hero_scene.jpg";
import { CompareModal } from "@/components/package/CompareModal";

const categories = ["All", "Domestic", "Pilgrimage", "Heritage", "Hills", "Beach", "Wildlife", "International", "Luxury Train", "Bharat Gaurav"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Top rated"] as const;
type SortOption = (typeof sortOptions)[number];

const regions = [...new Set(packages.map((p) => p.region))].sort();
/** Cities a package can be joined from — the "from" half of the search strip. */
const departureCities = [...new Set(packages.map((p) => p.from))].sort();
/** Anything the search strip leaves unset. Not a real value, so it never filters. */
const ANY = "Any";
const budgetBands: BudgetBand[] = ["Value", "Comfort", "Premium", "Luxury"];
const climates: Climate[] = ["Cool", "Moderate", "Warm", "Tropical"];
const experienceOptions: { k: Experience; label: string }[] = [
  { k: "spiritual", label: "Spiritual" },
  { k: "family", label: "Family" },
  { k: "honeymoon", label: "Honeymoon" },
  { k: "adventure", label: "Adventure" },
  { k: "culture", label: "Heritage & culture" },
  { k: "nature", label: "Nature & wildlife" },
  { k: "luxury", label: "Luxury" },
];
const durationOptions = ["Any", "3–5 days", "6–8 days", "9+ days"] as const;
type Duration = (typeof durationOptions)[number];

/** Stands in for a visit history until one is stored. */
const recentPackages = packages.slice(0, 3);

/** Two-up once there's room — the filter panel takes 30% of the row. */
const columnsFor = (w: number) => (w >= 640 ? 2 : 1);

/** Slider bounds, rounded out to the nearest ₹500 either side of the catalogue. */
const PRICE_MIN = Math.floor(Math.min(...packages.map((p) => p.price)) / 500) * 500;
const PRICE_MAX = Math.ceil(Math.max(...packages.map((p) => p.price)) / 500) * 500;
/** Opens mid-track rather than pinned to either end, so the control reads as
 *  adjustable at a glance. */
const PRICE_DEFAULT = Math.round((PRICE_MIN + PRICE_MAX) / 2 / 500) * 500;

/** Fractional saving vs. the struck-through price — used to rank "best value". */
// const discountPct = (p: TourPackage) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0);

export function WorldPage({ initialCategory }: { initialCategory?: string }) {
  const { back } = useRouter();
  const ref = useReveal();
  const [category, setCategory] = useState(initialCategory ?? "All");
  const [fromCity, setFromCity] = useState(ANY);
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [selRegions, setSelRegions] = useState<string[]>([]);
  const [selBands, setSelBands] = useState<BudgetBand[]>([]);
  const [selClimates, setSelClimates] = useState<Climate[]>([]);
  const [selExperiences, setSelExperiences] = useState<Experience[]>([]);
  const [duration, setDuration] = useState<Duration>("Any");
  const [maxPrice, setMaxPrice] = useState(PRICE_DEFAULT);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggle = <T,>(list: T[], setList: (v: T[]) => void, value: T) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const activeFilterCount =
    selRegions.length +
    selBands.length +
    selClimates.length +
    selExperiences.length +
    (duration !== "Any" ? 1 : 0) +
    (category !== "All" ? 1 : 0) +
    (fromCity !== ANY ? 1 : 0) +
    (maxPrice !== PRICE_DEFAULT ? 1 : 0);

  const clearFilters = () => {
    setCategory("All");
    setFromCity(ANY);
    setSelRegions([]);
    setSelBands([]);
    setSelClimates([]);
    setSelExperiences([]);
    setDuration("Any");
    setMaxPrice(PRICE_DEFAULT);
  };

  const filtered = useMemo(() => {
    let list = packages.filter((p) => {
      // "Domestic" is a scope (everything not abroad), the rest match the package category directly
      if (category === "Domestic") {
        if (p.category === "International") return false;
      } else if (category !== "All" && p.category !== category) {
        return false;
      }
      if (p.price > maxPrice) return false;
      if (fromCity !== ANY && p.from !== fromCity) return false;
      if (selRegions.length && !selRegions.includes(p.region)) return false;
      if (selBands.length && !selBands.includes(p.budgetBand)) return false;
      if (selClimates.length && !selClimates.includes(p.climate)) return false;
      if (selExperiences.length && !selExperiences.some((e) => p.experience.includes(e))) return false;
      if (duration === "3–5 days" && p.days > 5) return false;
      if (duration === "6–8 days" && (p.days < 6 || p.days > 8)) return false;
      if (duration === "9+ days" && p.days < 9) return false;
      return true;
    });
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top rated") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, selRegions, selBands, selClimates, selExperiences, duration, maxPrice, fromCity]);

  // The AI pick must come from what's actually on screen. Keep the curated default
  // when it matches the active filters; otherwise surface the best-value package in
  // the results (top rating, then biggest saving). Null → no matches, hide the banner.
  // const aiPick = useMemo(() => {
  //   if (filtered.length === 0) return null;
  //   return (
  //     filtered.find((p) => p.id === "dakshinbharat") ??
  //     [...filtered].sort((a, b) => b.rating - a.rating || discountPct(b) - discountPct(a))[0]
  //   );
  // }, [filtered]);

  /**
   * The search strip drives the same state the filter panel does. Region and
   * comfort are multi-select there but single-select here, so the strip reads
   * the first choice and writes either one value or none — no second source of
   * truth, and a pick made in either place shows up in both.
   */
  const searchFields: SearchField[] = [
    {
      key: "from",
      label: "Leaving from",
      icon: Navigation,
      value: fromCity,
      options: [{ value: ANY, label: "Any city" }, ...departureCities.map((c) => ({ value: c, label: c }))],
      onChange: setFromCity,
    },
    {
      key: "region",
      label: "Going to",
      icon: MapPin,
      value: selRegions[0] ?? ANY,
      options: [{ value: ANY, label: "Anywhere" }, ...regions.map((r) => ({ value: r, label: r }))],
      onChange: (v) => setSelRegions(v === ANY ? [] : [v]),
    },
    {
      key: "duration",
      label: "Trip length",
      icon: CalendarDays,
      value: duration,
      options: durationOptions.map((d) => ({ value: d, label: d === "Any" ? "Any length" : d })),
      onChange: (v) => setDuration(v as Duration),
    },
    {
      key: "band",
      label: "Comfort level",
      icon: Wallet,
      value: selBands[0] ?? ANY,
      options: [{ value: ANY, label: "All levels" }, ...budgetBands.map((b) => ({ value: b, label: b }))],
      onChange: (v) => setSelBands(v === ANY ? [] : [v as BudgetBand]),
    },
  ];

  const quickToggles = (["family", "honeymoon", "adventure"] as Experience[]).map((k) => ({
    label: experienceOptions.find((o) => o.k === k)!.label,
    active: selExperiences.includes(k),
    onToggle: () => toggle(selExperiences, setSelExperiences, k),
  }));

  const filterSections: FilterSection[] = [
    {
      key: "category",
      title: "Holiday type",
      icon: LayoutGrid,
      single: true,
      options: categories.map((c) => ({ label: c, active: category === c, onClick: () => setCategory(c) })),
    },
    {
      key: "duration",
      title: "Trip length",
      icon: CalendarDays,
      single: true,
      options: durationOptions.map((d) => ({ label: d, active: duration === d, onClick: () => setDuration(d) })),
    },
    {
      key: "region",
      title: "Where to",
      icon: MapPin,
      options: regions.map((r) => ({ label: r, active: selRegions.includes(r), onClick: () => toggle(selRegions, setSelRegions, r) })),
    },
    {
      key: "budget",
      title: "Comfort level",
      icon: Wallet,
      options: budgetBands.map((b) => ({ label: b, active: selBands.includes(b), onClick: () => toggle(selBands, setSelBands, b) })),
    },
    {
      key: "experience",
      title: "Good for",
      icon: Sparkles,
      options: experienceOptions.map((e) => ({
        label: e.label,
        active: selExperiences.includes(e.k),
        onClick: () => toggle(selExperiences, setSelExperiences, e.k),
      })),
    },
    {
      key: "climate",
      title: "Weather",
      icon: Sun,
      options: climates.map((c) => ({ label: c, active: selClimates.includes(c), onClick: () => toggle(selClimates, setSelClimates, c) })),
    },
    {
      key: "sort",
      title: "Sort by",
      icon: ArrowUpDown,
      single: true,
      options: sortOptions.map((o) => ({ label: o, active: sort === o, onClick: () => setSort(o) })),
    },
  ];

  const appliedChips = [
    ...selRegions.map((r) => ({ label: r, onRemove: () => toggle(selRegions, setSelRegions, r) })),
    ...selBands.map((b) => ({ label: b, onRemove: () => toggle(selBands, setSelBands, b) })),
    ...selClimates.map((c) => ({ label: c, onRemove: () => toggle(selClimates, setSelClimates, c) })),
    ...selExperiences.map((e) => ({
      label: experienceOptions.find((o) => o.k === e)!.label,
      onRemove: () => toggle(selExperiences, setSelExperiences, e),
    })),
    ...(duration !== "Any" ? [{ label: duration, onRemove: () => setDuration("Any") }] : []),
  ];

  // Cards are laid out row by row so a hovered card can steal width from the
  // ones beside it — that needs an explicit column count, not a wrapping grid.
  const [cols, setCols] = useState(() => (typeof window === "undefined" ? 3 : columnsFor(window.innerWidth)));
  useEffect(() => {
    const onResize = () => setCols(columnsFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const rows = useMemo(() => {
    const out: TourPackage[][] = [];
    for (let i = 0; i < filtered.length; i += cols) out.push(filtered.slice(i, i + cols));
    return out;
  }, [filtered, cols]);

  const toggleCompare = (id: string) =>
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev));

  const compareItems = compareIds.map((id) => getPackageById(id)!).filter(Boolean);

  return (
    <div ref={ref} className="min-h-screen pb-24">
      {/* <DestinationMarquee className="pt-8" /> */}
      {/* min-h rather than a fixed height: the recent-packages shelf lives inside
          the hero now, so the section has to be able to grow when it unfolds. */}
      <section className="relative isolate flex min-h-[80vh] w-full flex-col overflow-hidden bg-ink md:min-h-[88vh]">
        {/* Anchored to the top of the frame: at 35% the crop ate the sky and the
            domes, so the picture sits down and it's the reflection at the foot
            that gets cut instead. */}
        <img src={heroScene} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        {/* Two passes at the foot: a deep shadow that weights the bottom of the
            photo, then the navy the search strip is painted in, so the image
            sinks into the next band instead of butting against it. */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-black/45 to-black/75" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#0B2E6B]" />

        {/* Back and the shelf share one line: last-viewed packages sit at the
            top of the page, so a returning traveller can pick up where they
            left off without scrolling past the headline. */}
        {/* Back is taken out of the flow so the shelf centres on the hero
            itself rather than on whatever room the button leaves beside it. */}
        <div className="relative z-20 mx-auto w-full max-w-[1600px] px-4 pt-6 md:px-8">
          <button
            onClick={back}
            type="button"
            className="absolute left-4 top-6 z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/25 md:left-8"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="reveal mx-auto w-full px-16 md:px-24">
            <RecentPackagesDrawer packages={recentPackages} />
          </div>
        </div>

        {/* Nothing here is clickable, and it covers the whole hero — without
            this it sits over the Back button and eats the click. Centred in
            whatever room the shelf leaves. */}
       
        <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-[8vh] pt-12 text-center">
          <span className="mb-4 inline-flex items-center gap-8 rounded-full border border-white/25 bg-white/20 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            <TrainFront size={13} /> Indian Railways · Official tour packages
          </span>

          {/* heading-xl locks line-height to 100%, which is too tight once the
              headline wraps on narrow screens — hence the explicit leading. */}
          <h1 className="heading-xl max-w-3xl leading-[1.06] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] md:text-[54px]">
            Explore &amp; compare packages
          </h1>
          {/* Balanced and given room: at max-w-xl the last two words dropped to a
              line of their own, which is what made the stack look crowded. */}
          <p className="mt-4 max-w-2xl text-balance text-[16px] font-medium leading-relaxed text-white/85 drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
            Hand-picked journeys across India and beyond — filter, shortlist and compare side by side.
          </p>

          {/* Gives the headline a base to sit on, so it reads as a composed
              block rather than type dropped onto a photograph. */}
          {/* <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[13px] font-semibold text-white/80 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-white/60" /> Fares inclusive of stay &amp; meals</span>
            <span className="hidden h-4 w-px bg-white/25 sm:block" />
            <span className="inline-flex items-center gap-2"><Ticket size={15} className="text-white/60" /> Rail, road &amp; air itineraries</span>
            <span className="hidden h-4 w-px bg-white/25 sm:block" />
            <span className="inline-flex items-center gap-2"><HandHelping size={15} className="text-white/60" /> Easy Service</span>
          </div> */}
        </div>
      </section>

      <PackageSearchBar
        fields={searchFields}
        quick={quickToggles}
        count={filtered.length}
        onSearch={() => document.getElementById("results")?.scrollIntoView({ block: "start" })}
      />

      <div className="bg-[linear-gradient(180deg,#f4eff1_0%,#ffffff_460px)]">
      <div id="results" className="relative mx-auto max-w-[1600px] scroll-mt-4 px-4 pt-6 md:px-8 xl:px-12">
        {/* {aiPick && (
          <div className="mt-6">
            <AiPickBanner pkg={aiPick} />
          </div>
        )} */}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="text-[13px] font-semibold text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "package" : "packages"} match your filters
          </div>
          <div className="flex items-center gap-3">
            <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto">
              {appliedChips.map((c) => (
                <button
                  key={c.label}
                  onClick={c.onRemove}
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-[12px] font-semibold text-brand transition hover:bg-brand/20"
                >
                  {c.label} <X size={11} />
                </button>
              ))}
            </div>

            {/* Same data, two densities: photos to browse, rows to compare. */}
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl">
              {([
                { k: "gallery", icon: LayoutGrid, label: "Gallery" },
                { k: "list", icon: Rows3, label: "List" },
              ] as const).map((v) => (
                <button
                  key={v.k}
                  onClick={() => setView(v.k)}
                  type="button"
                  aria-pressed={view === v.k}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-bold transition ${
                    view === v.k ? "bg-brand text-white shadow" : "text-ink hover:bg-brand/10"
                  }`}
                >
                  <v.icon size={14} /> {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel and results start on the same line; the panel then sticks so
            the filters stay reachable all the way down the list. */}
        <div className="mt-5 flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
          <aside className="no-scrollbar w-full shrink-0 lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-110px)] lg:w-[22%] lg:min-w-[248px] lg:overflow-y-auto lg:pb-4">
            <FilterPanel
              sections={filterSections}
              priceMin={PRICE_MIN}
              priceMax={PRICE_MAX}
              price={maxPrice}
              onPriceChange={setMaxPrice}
              activeFilterCount={activeFilterCount}
              onClear={clearFilters}
            />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
            {view === "list" &&
              filtered.map((pkg) => (
                <div key={pkg.id} className="reveal">
                  <PackageListRow
                    pkg={pkg}
                    comparing={compareIds.includes(pkg.id)}
                    onCompare={() => toggleCompare(pkg.id)}
                  />
                </div>
              ))}

            {view === "gallery" &&
              rows.map((row, i) => (
              <div
                key={i}
                className="card-row flex flex-col gap-5 sm:flex-row lg:gap-6"
                style={
                  {
                    "--cell-grow": 1 + HOVER_GROW,
                    "--cell-shrink": row.length > 1 ? 1 - HOVER_GROW / (row.length - 1) : 1,
                  } as CSSProperties
                }
              >
                {row.map((pkg) => (
                  <div key={pkg.id} className="card-cell min-w-0">
                    <div className="reveal">
                      <EditorialPackageCard
                        pkg={pkg}
                        comparing={compareIds.includes(pkg.id)}
                        onCompare={() => toggleCompare(pkg.id)}
                      />
                    </div>
                  </div>
                ))}
                {/* Keep a short final row aligned with the columns above it. */}
                {Array.from({ length: cols - row.length }).map((_, k) => (
                  <div key={`spacer-${k}`} className="hidden basis-0 grow sm:block" />
                ))}
                </div>
              ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed p-10 text-center text-[14px] text-muted-foreground">
                No packages match these filters yet. Try clearing a few.
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {compareIds.length > 0 && !showCompare && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 shadow-2xl backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-2">
            <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
              <span className="whitespace-nowrap text-[13px] font-bold text-ink">Comparing {compareIds.length}/3:</span>
              {compareItems.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-secondary px-2.5 py-1 text-[12px] font-semibold text-ink">
                  {p.name.split(" ")[0]} <button onClick={() => toggleCompare(p.id)} type="button"><X size={12} /></button>
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowCompare(true)}
              disabled={compareIds.length < 2}
              type="button"
              className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-white shadow disabled:opacity-40"
            >
              Compare now
            </button>
          </div>
        </div>
      )}

      {showCompare && <CompareModal items={compareItems} onClose={() => setShowCompare(false)} />}
    </div>
  );
}

