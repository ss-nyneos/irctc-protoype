import { useMemo, useState } from "react";
import { Check, Search, TrainFront } from "lucide-react";
import type { BoardingPoint } from "@/types";

/**
 * Boarding-point picker.
 *
 * On irctctourism.com this is a static table wedged into the top of the
 * itinerary — fifteen rows that all read "Boarding of passenger", burying the
 * day-by-day content below them. But a traveller reading it has one question:
 * *can I join near me, and when?* So it belongs on its own, and it should be
 * answerable — picking a halt here carries through to the fare summary.
 *
 * Drawn as a line of stations rather than a stack of boxes, matching the
 * itinerary rail: these halts genuinely are consecutive stops on one route,
 * and a table throws that away.
 */
export function BoardingPanel({
  points,
  selected,
  onSelect,
}: {
  points: BoardingPoint[];
  selected: string;
  onSelect: (code: string) => void;
}) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return points;
    return points.filter((p) => p.station.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }, [points, query]);

  // The line is only continuous when nothing is filtered out.
  const showRail = matches.length === points.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-ink">Where will you board?</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            The train picks up at all {points.length} halts. Pick yours — the fare summary follows.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a station or code"
          aria-label="Search boarding stations"
          className="h-12 w-full rounded-2xl bg-secondary/50 pl-10 pr-4 text-[15px] text-ink outline-none transition placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {matches.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-secondary/40 p-6 text-center text-[14px] text-muted-foreground">
          No halt matches “{query}”. This tour boards only at the {points.length} stations listed.
        </p>
      ) : (
        <ol className="relative mt-4">
          {showRail && (
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-[15px] top-8 w-0.5 rounded bg-gradient-to-b from-brand/50 via-brand/30 to-brand/50"
            />
          )}

          {matches.map((p) => {
            const isSelected = selected === p.code;
            const isOrigin = p.arr === null;
            return (
              <li key={p.code}>
                <button
                  type="button"
                  onClick={() => onSelect(p.code)}
                  aria-pressed={isSelected}
                  className={`group flex w-full items-center gap-3.5 rounded-2xl py-2 pr-3 text-left transition-colors ${
                    isSelected ? "bg-brand/[0.06]" : "hover:bg-secondary/40"
                  }`}
                >
                  <span
                    className={`z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full ring-4 ring-white transition ${
                      isSelected
                        ? "scale-110 bg-brand text-white shadow-md shadow-brand/30"
                        : "bg-white text-muted-foreground ring-2 ring-border group-hover:ring-brand/40"
                    }`}
                  >
                    {isSelected ? <Check size={15} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                  </span>

                  <span className="min-w-0 flex-1 py-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={`truncate font-semibold ${isSelected ? "text-ink" : "text-foreground/80"}`}>
                        {p.station}
                      </span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-navy">
                        {p.code}
                      </span>
                      {isOrigin && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Starts here
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="flex flex-none gap-4 text-right tabular-nums">
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Arr</span>
                      <span className="text-[14px] font-semibold text-ink">{p.arr ?? "—"}</span>
                    </span>
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Dep</span>
                      <span className="text-[14px] font-semibold text-ink">{p.dep ?? "—"}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
        <TrainFront size={14} className="mt-0.5 flex-none text-brand" />
        Timings are tentative and move with the running of the train. Reach your halt 45 minutes early.
      </p>
    </div>
  );
}
