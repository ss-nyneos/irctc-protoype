import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  HandHelping,
  Headset,
  LayoutGrid,
  MapPin,
  Navigation,
  Rows3,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  SmilePlus,
  Sparkles,
  Sun,
  Ticket,
  Wallet,
  X,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { packages, getPackageById } from "@/data/packages";
import type { BudgetBand, Climate, Experience, TourPackage } from "@/types";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";
import { PackageListRow } from "@/components/package/PackageListRow";
import { FilterPanel, type FilterSection } from "@/components/package/FilterPanel";
import { CompareModal } from "@/components/package/CompareModal";
import { CompareTray, COMPARE_MAX } from "@/components/package/CompareTray";
import { DragGallery } from "@/components/common/DragGallery";

const heroGalleryImages = [
  { src: "/WorldPage/Maharajas Express.jpg", title: "Maharaja Express" },
  { src: "/WorldPage/bharat_tourism.jpg", title: "Bharat Tourism" },
  { src: "/WorldPage/domestic_air.jpg", title: "Domestic Air Package" },
  { src: "/WorldPage/ferry.jpg", title: "Ferry Travel" },
  { src: "/WorldPage/helly.jpg", title: "Helly Yatra" },
  { src: "/WorldPage/trek.jpg", title: "Trek " },
  { src: "/WorldPage/fight2.jpg", title: "International Packages" },
  { src: "/WorldPage/flight.jpg", title: "International Packages" },
  { src: "/WorldPage/flight3.jpg", title: "Domestic Packages" },
  { src: "/WorldPage/train.jpg", title: "Maharaja Express" },
  { src: "/WorldPage/train23.jpg", title: "Golden Chariot Train" },
  { src: "/WorldPage/train234.jpg", title: "Buddhist Circuit Train" },
].map((img) => ({ ...img, src: encodeURI(img.src) }));

const categories = ["All", "Domestic", "Pilgrimage", "Heritage", "Hills", "Beach", "Wildlife", "International", "Luxury Train", "Bharat Gaurav"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Top rated"] as const;
type SortOption = (typeof sortOptions)[number];

const regions = [...new Set(packages.map((p) => p.region))].sort();
const departureCities = [...new Set(packages.map((p) => p.from))].sort();
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

const columnsFor = (w: number) => (w >= 640 ? 2 : 1);

const PRICE_MIN = Math.floor(Math.min(...packages.map((p) => p.price)) / 500) * 500;
const PRICE_MAX = Math.ceil(Math.max(...packages.map((p) => p.price)) / 500) * 500;
const PRICE_DEFAULT = Math.round((PRICE_MIN + PRICE_MAX) / 2 / 500) * 500;

const ITEMS_PER_PAGE = 8;

export function WorldPage({ initialCategory, initialFromPlace }: { initialCategory?: string; initialFromPlace?: string }) {
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
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  // "Packages Originated from" banner
  const [originPlace, setOriginPlace] = useState(initialFromPlace ?? "");
  const [originQuery, setOriginQuery] = useState(initialFromPlace ?? "");

  // Pagination
  const [page, setPage] = useState(1);

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
      // Origin place search
      if (originPlace) {
        const q = originPlace.toLowerCase();
        if (!p.from.toLowerCase().includes(q) && !p.region.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top rated") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, selRegions, selBands, selClimates, selExperiences, duration, maxPrice, fromCity, originPlace]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [filtered.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pagedFiltered = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);



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
      icon: SmilePlus,
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

  const [cols, setCols] = useState(() => (typeof window === "undefined" ? 3 : columnsFor(window.innerWidth)));
  useEffect(() => {
    const onResize = () => setCols(columnsFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const rows = useMemo(() => {
    const out: TourPackage[][] = [];
    for (let i = 0; i < pagedFiltered.length; i += cols) out.push(pagedFiltered.slice(i, i + cols));
    return out;
  }, [pagedFiltered, cols]);

  const toggleCompare = (id: string) =>
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < COMPARE_MAX ? [...prev, id] : prev,
    );

  const compareItems = compareIds.map((id) => getPackageById(id)!).filter(Boolean);

  // Pagination helper
  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | "…")[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push("…");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("…");
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  return (
    <div ref={ref} className="min-h-screen" style={{ paddingBottom: "calc(6rem + var(--dock-offset, 0px))" }}>
      {/* ── Hero: draggable photo gallery with a dark scrim and text overlay ── */}
      <section className="relative isolate flex min-h-[72vh] w-full flex-col overflow-hidden">
        {/* Draggable gallery fills the hero */}
        <div className="absolute inset-0">
          <DragGallery
            profile={null}
            label="Drag to explore"
            labelPosition="center"
            className="h-full w-full"
            images={heroGalleryImages}
            columns={6}
            dim
            sizeScale={0.9}
          />
        </div>

        {/* Light scrim keeps the heading legible over the photos (no bottom fade) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,24,64,0.30)_0%,rgba(8,24,64,0.12)_50%,rgba(8,24,64,0.20)_100%)]" />

        <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-[6vh] pt-12 text-center">
          <h1 className="heading-xl max-w-3xl !text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.75)]">
            Explore &amp; Compare Packages
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-[16px] font-medium leading-relaxed text-white/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)]">
            Hand-picked journeys across India and beyond — filter, shortlist and compare side by side.
          </p>
        </div>
      </section>



      <div className="bg-[linear-gradient(180deg,#f4eff1_0%,#ffffff_460px)]">
        <div id="results" className="relative mx-auto max-w-[1600px] scroll-mt-4 px-4 pt-6 md:px-8 xl:px-12">

          {/* "Packages Originated from" banner */}
          {(initialFromPlace !== undefined || originQuery !== "") && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-white/80 px-5 py-3.5 shadow-sm backdrop-blur-sm">
              <span className="shrink-0 text-[14px] font-semibold text-ink/60">Packages Originated from</span>
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setOriginPlace(originQuery); setPage(1); } }}
                placeholder="Enter place name…"
                className="min-w-0 flex-1 rounded-xl border border-brand/25 bg-transparent px-3 py-1.5 text-[14px] font-semibold text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="button"
                onClick={() => { setOriginPlace(originQuery); setPage(1); }}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2 text-[14px] font-bold text-white transition hover:brightness-95"
              >
                <Search size={15} /> Search
              </button>
              {originPlace && (
                <button
                  type="button"
                  onClick={() => { setOriginQuery(""); setOriginPlace(""); setPage(1); }}
                  className="shrink-0 text-muted-foreground transition hover:text-ink"
                  aria-label="Clear origin filter"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {/* Toolbar row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="text-[16px] font-medium text-[#323232]">
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

              {/* Gallery / List toggle */}
              <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl">
                {(
                  [
                    { k: "gallery", icon: LayoutGrid, label: "Gallery" },
                    { k: "list", icon: Rows3, label: "List" },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.k}
                    onClick={() => setView(v.k)}
                    type="button"
                    aria-pressed={view === v.k}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-bold transition ${view === v.k ? "bg-brand text-white shadow" : "text-ink hover:bg-brand/10"
                      }`}
                  >
                    <v.icon size={14} /> {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel + results */}
          <div className="mt-5 flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
            {/* Collapsible filter sidebar */}
            <aside
              className={`no-scrollbar shrink-0 transition-all duration-300 ease-out lg:sticky lg:top-[40px] lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto lg:pb-4 ${filterCollapsed ? "lg:w-[48px]" : "w-full lg:w-[22%] lg:min-w-[248px]"
                }`}
            >
              {/* Collapse toggle button (desktop only) */}
              <div className="mb-3 hidden items-center justify-end lg:flex">
                <button
                  type="button"
                  onClick={() => setFilterCollapsed((c) => !c)}
                  title={filterCollapsed ? "Expand filters" : "Collapse filters"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-md transition hover:brightness-110"
                >
                  {filterCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
              </div>
              {!filterCollapsed && (
                <FilterPanel
                  sections={filterSections}
                  priceMin={PRICE_MIN}
                  priceMax={PRICE_MAX}
                  price={maxPrice}
                  onPriceChange={setMaxPrice}
                  activeFilterCount={activeFilterCount}
                  onClear={clearFilters}
                />
              )}
              {filterCollapsed && (
                <div className="hidden flex-col items-center gap-3 lg:flex">
                  {filterSections.slice(0, 5).map((s) => (
                    <button
                      key={s.key}
                      title={s.title}
                      onClick={() => setFilterCollapsed(false)}
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition hover:brightness-110"
                    >
                      <s.icon size={16} />
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
              {view === "list" &&
                pagedFiltered.map((pkg) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-1.5 pb-4">
                  {/* Prev */}
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPaginationRange().map((item, idx) =>
                    item === "…" ? (
                      <span key={`ell-${idx}`} className="flex h-9 w-9 items-center justify-center text-[14px] text-muted-foreground">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPage(item as number)}
                        aria-current={page === item ? "page" : undefined}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold transition ${page === item
                          ? "bg-brand text-white shadow-md shadow-brand/30"
                          : "border border-border bg-white text-ink hover:bg-brand/10"
                          }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                  {/* Next */}
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <span className="ml-3 text-[14px] text-[#323232]">
                    Page {page} of {totalPages}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {compareIds.length > 0 && !showCompare && (
        <CompareTray
          items={compareItems}
          onRemove={toggleCompare}
          onClearAll={() => setCompareIds([])}
          onCompare={() => setShowCompare(true)}
        />
      )}

      {showCompare && <CompareModal items={compareItems} onClose={() => setShowCompare(false)} />}
    </div>
  );
}
