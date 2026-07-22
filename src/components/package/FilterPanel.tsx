import { useState } from "react";
import { Check, Minus, Plus, Search, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { formatINR } from "@/utils/format";

export interface FilterOption {
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface FilterSection {
  key: string;
  title: string;
  icon: LucideIcon;
  /** Single-choice sections read as radios, multi-choice as checkboxes. */
  single?: boolean;
  options: FilterOption[];
}

interface FilterPanelProps {
  sections: FilterSection[];
  priceMin: number;
  priceMax: number;
  price: number;
  onPriceChange: (v: number) => void;
  activeFilterCount: number;
  onClear: () => void;
}

/** How many options a section shows before "See more". */
const COLLAPSED_COUNT = 6;
/** Longer lists than this get a search box, as Origin does on IRCTC. */
const SEARCH_FROM = 8;

export function FilterPanel({
  sections,
  priceMin,
  priceMax,
  price,
  onPriceChange,
  activeFilterCount,
  onClear,
}: FilterPanelProps) {
  // Only the first section starts open. Everything expanded at once made the
  // panel taller than the results it filters.
  const [open, setOpen] = useState<string[]>(() => sections.slice(0, 1).map((s) => s.key));
  const [expanded, setExpanded] = useState<string[]>([]);
  const [queries, setQueries] = useState<Record<string, string>>({});
  const pct = ((price - priceMin) / (priceMax - priceMin)) * 100;

  const toggleSection = (k: string) => setOpen((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]));

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-[#DADADB] bg-white/60 p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.25)] ring-1 ring-inset ring-white/60 backdrop-blur-xl">
        <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand">Price range</div>

        <div className="relative mt-8 pb-1">
          <div
            className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-lg bg-brand px-2.5 py-1 text-[12px] font-bold text-white shadow-md transition-[left] duration-200 ease-out"
            style={{ left: `${pct}%` }}
          >
            {formatINR(price)}
            <span className="absolute left-1/2 top-full -ml-1 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-brand" />
          </div>

          <div className="relative h-1.5 rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-200 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={500}
            value={price}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            aria-label="Maximum price per person"
            className="absolute inset-x-0 top-0 h-1.5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
          <span>{formatINR(priceMin)}</span>
          <span>{formatINR(priceMax)}</span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#DADADB] bg-white/60 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.25)] ring-1 ring-inset ring-white/60 backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-white/70 px-5 py-4">
          <span className="inline-flex items-center gap-2 text-[15px] font-bold text-ink">
            <SlidersHorizontal size={16} className="text-brand" /> Refine results
          </span>
          {activeFilterCount > 0 && (
            <button onClick={onClear} type="button" className="text-[12px] font-bold text-brand transition hover:underline">
              Clear all ({activeFilterCount})
            </button>
          )}
        </header>

        <div className="divide-y divide-white/60">
          {sections.map((s) => {
            const isOpen = open.includes(s.key);
            const showAll = expanded.includes(s.key);
            const q = (queries[s.key] ?? "").trim().toLowerCase();
            const searchable = s.options.length > SEARCH_FROM;
            const matched = q ? s.options.filter((o) => o.label.toLowerCase().includes(q)) : s.options;
            const visible = showAll || q ? matched : matched.slice(0, COLLAPSED_COUNT);
            const chosen = s.options.filter((o) => o.active).length;

            return (
              <div key={s.key}>
                <button
                  onClick={() => toggleSection(s.key)}
                  type="button"
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between gap-2 px-5 py-3.5 text-left transition ${
                    isOpen ? "bg-white/50" : "hover:bg-white/40"
                  }`}
                >
                  <span className="inline-flex min-w-0 items-center gap-2.5">
                    <s.icon size={16} className="shrink-0 text-brand" />
                    <span className="truncate text-[13.5px] font-bold text-ink">{s.title}</span>
                    {chosen > 0 && !isOpen && (
                      <span className="shrink-0 rounded-full bg-brand/10 px-1.5 py-0.5 text-[11px] font-bold text-brand">
                        {chosen}
                      </span>
                    )}
                  </span>
                  {/* Plus turning into minus, as on the IRCTC panel. */}
                  <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center text-ink">
                    <Minus size={16} className="absolute" />
                    <Plus
                      size={16}
                      className={`absolute transition-all duration-300 ease-out ${isOpen ? "rotate-90 opacity-0" : "opacity-100"}`}
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {searchable && (
                      <div className="relative px-5 pt-3">
                        <Search size={14} className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={queries[s.key] ?? ""}
                          onChange={(e) => setQueries((p) => ({ ...p, [s.key]: e.target.value }))}
                          placeholder={`Search ${s.title}...`}
                          className="w-full rounded-lg border bg-white/80 py-2 pl-8 pr-3 text-[13px] font-medium text-ink outline-none transition placeholder:text-muted-foreground focus:border-brand/50"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-5 pb-4 pt-3">
                      {visible.map((o) => (
                        <button
                          key={o.label}
                          onClick={o.onClick}
                          type="button"
                          className="group/opt flex items-center gap-2 rounded-lg py-1.5 text-left transition"
                        >
                          <span
                            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 transition-all duration-200 ${
                              s.single ? "rounded-full" : "rounded-md"
                            } ${
                              o.active
                                ? "border-brand bg-brand text-white"
                                : "border-border bg-white/70 text-transparent group-hover/opt:border-brand/60"
                            }`}
                          >
                            <Check size={12} strokeWidth={3.5} />
                          </span>
                          <span
                            className={`truncate text-[13px] transition-colors ${
                              o.active ? "font-bold text-ink" : "font-medium text-foreground/75 group-hover/opt:text-ink"
                            }`}
                          >
                            {o.label}
                          </span>
                        </button>
                      ))}

                      {matched.length === 0 && (
                        <p className="col-span-2 py-1 text-[12.5px] font-medium text-muted-foreground">No matches.</p>
                      )}

                      {!q && matched.length > COLLAPSED_COUNT && (
                        <button
                          onClick={() => setExpanded((e) => (showAll ? e.filter((x) => x !== s.key) : [...e, s.key]))}
                          type="button"
                          className="col-span-2 mt-1 text-left text-[12px] font-bold text-brand transition hover:underline"
                        >
                          {showAll ? "See less" : `See more (${matched.length - COLLAPSED_COUNT})`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
