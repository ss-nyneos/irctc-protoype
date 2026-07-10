import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronDown, Scale, SlidersHorizontal, X } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages, getPackageById } from "@/data/packages";
import type { BudgetBand, Climate, Experience } from "@/types";
import { DestinationMarquee } from "@/components/common/DestinationMarquee";
import { AiPickBanner } from "@/components/home/AiPickBanner";
import { PackageCard } from "@/components/package/PackageCard";
import { CompareModal } from "@/components/package/CompareModal";

const categories = ["All", "Pilgrimage", "Heritage", "Hills", "Beach", "Wildlife", "International", "Luxury Train", "Bharat Gaurav"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Top rated"] as const;
type SortOption = (typeof sortOptions)[number];

const regions = [...new Set(packages.map((p) => p.region))].sort();
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

export function WorldPage() {
  const { back } = useRouter();
  const ref = useReveal();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [selRegions, setSelRegions] = useState<string[]>([]);
  const [selBands, setSelBands] = useState<BudgetBand[]>([]);
  const [selClimates, setSelClimates] = useState<Climate[]>([]);
  const [selExperiences, setSelExperiences] = useState<Experience[]>([]);
  const [duration, setDuration] = useState<Duration>("Any");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const aiPick = getPackageById("dakshinbharat")!;

  const toggle = <T,>(list: T[], setList: (v: T[]) => void, value: T) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const activeFilterCount =
    selRegions.length + selBands.length + selClimates.length + selExperiences.length + (duration !== "Any" ? 1 : 0);

  const clearFilters = () => {
    setSelRegions([]);
    setSelBands([]);
    setSelClimates([]);
    setSelExperiences([]);
    setDuration("Any");
  };

  const filtered = useMemo(() => {
    let list = packages.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
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
  }, [category, sort, selRegions, selBands, selClimates, selExperiences, duration]);

  const toggleCompare = (id: string) =>
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev));

  const compareItems = compareIds.map((id) => getPackageById(id)!).filter(Boolean);

  return (
    <div ref={ref} className="min-h-screen pb-24">
      <div className="relative overflow-hidden bg-white">
        <DestinationMarquee className="pt-8" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 md:px-6">
          <button onClick={back} type="button" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-ink">
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="heading-xl text-ink">Explore &amp; compare packages</h1>
          <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
            Ready-to-book holidays with verified pricing. Drill down by region, budget, climate & style, or let AI
            shortlist the best value — then compare any three side by side.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="-mt-6">
          <AiPickBanner pkg={aiPick} />
        </div>

        <div className="reveal sticky top-[68px] z-30 mt-8 rounded-2xl border bg-white/90 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3 p-3">
            <button
              onClick={() => setShowFilters((v) => !v)}
              type="button"
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold transition ${
                showFilters || activeFilterCount ? "bg-brand text-white" : "text-ink hover:bg-secondary"
              }`}
            >
              <SlidersHorizontal size={15} /> Filters
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={14} className={`transition ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  type="button"
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                    category === c ? "bg-brand text-white" : "bg-secondary text-foreground/70 hover:bg-brand/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="hidden shrink-0 rounded-full border bg-white px-3 py-1.5 text-[13px] font-semibold text-ink outline-none md:block"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          {showFilters && (
            <div className="border-t px-4 py-4">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <FacetGroup title="Region">
                  <div className="flex flex-wrap gap-1.5">
                    {regions.map((r) => (
                      <FacetChip key={r} active={selRegions.includes(r)} onClick={() => toggle(selRegions, setSelRegions, r)}>
                        {r}
                      </FacetChip>
                    ))}
                  </div>
                </FacetGroup>

                <FacetGroup title="Budget">
                  <div className="flex flex-wrap gap-1.5">
                    {budgetBands.map((b) => (
                      <FacetChip key={b} active={selBands.includes(b)} onClick={() => toggle(selBands, setSelBands, b)}>
                        {b}
                      </FacetChip>
                    ))}
                  </div>
                </FacetGroup>

                <FacetGroup title="Climate">
                  <div className="flex flex-wrap gap-1.5">
                    {climates.map((c) => (
                      <FacetChip key={c} active={selClimates.includes(c)} onClick={() => toggle(selClimates, setSelClimates, c)}>
                        {c}
                      </FacetChip>
                    ))}
                  </div>
                </FacetGroup>

                <FacetGroup title="Trip length">
                  <div className="flex flex-wrap gap-1.5">
                    {durationOptions.map((d) => (
                      <FacetChip key={d} active={duration === d} onClick={() => setDuration(d)}>
                        {d}
                      </FacetChip>
                    ))}
                  </div>
                </FacetGroup>
              </div>

              <div className="mt-4 border-t pt-4">
                <FacetGroup title="Style & experience">
                  <div className="flex flex-wrap gap-1.5">
                    {experienceOptions.map((e) => (
                      <FacetChip key={e.k} active={selExperiences.includes(e.k)} onClick={() => toggle(selExperiences, setSelExperiences, e.k)}>
                        {e.label}
                      </FacetChip>
                    ))}
                  </div>
                </FacetGroup>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters} type="button" className="mt-4 text-[12px] font-bold text-brand hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 text-[13px] font-semibold text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "package" : "packages"} match your filters
        </div>

        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="reveal relative">
              <PackageCard pkg={pkg} />
              <button
                onClick={() => toggleCompare(pkg.id)}
                type="button"
                className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow transition ${
                  compareIds.includes(pkg.id) ? "bg-brand text-white" : "bg-white/95 text-ink hover:bg-brand hover:text-white"
                }`}
              >
                {compareIds.includes(pkg.id) ? <Check size={12} /> : <Scale size={12} />} Compare
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-[14px] text-muted-foreground">
              No packages match these filters yet. Try clearing a few.
            </div>
          )}
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

function FacetGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function FacetChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
        active ? "border-brand bg-brand text-white" : "border-border bg-white text-foreground/75 hover:border-brand/40"
      }`}
    >
      {children}
    </button>
  );
}
