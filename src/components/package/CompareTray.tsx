import { useRef, useState } from "react";
import { ChevronUp, Moon, Plus, Scale, Trash2, X } from "lucide-react";
import type { TourPackage } from "@/types";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { useDockOffset } from "@/hooks/useDockOffset";
import { formatINR } from "@/utils/format";

/** IRCTC's own cap — three packages is what fits a readable table. */
export const COMPARE_MAX = 3;

interface CompareTrayProps {
  items: TourPackage[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onCompare: () => void;
}

/**
 * The shortlist dock: three fixed slots rather than a chip row, so the cap is
 * legible from the layout and each pick carries enough to be recognised.
 */
export function CompareTray({ items, onRemove, onClearAll, onCompare }: CompareTrayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  useDockOffset(ref, items.length > 0);

  const empty = COMPARE_MAX - items.length;
  const ready = items.length >= 2;
  const cheapest = Math.min(...items.map((p) => p.price));

  const compareButton = (className: string) => (
    <button
      onClick={onCompare}
      disabled={!ready}
      type="button"
      className={`shrink-0 rounded-full bg-brand font-bold text-white shadow transition hover:brightness-95 disabled:opacity-40 disabled:hover:brightness-100 ${className}`}
    >
      {ready ? "Compare now" : `Pick ${2 - items.length} more`}
    </button>
  );

  const clearButton = (className: string) => (
    <button
      onClick={onClearAll}
      type="button"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 font-bold text-white shadow transition hover:brightness-95 ${className}`}
    >
      <Trash2 size={14} /> Clear all
    </button>
  );

  return (
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 shadow-2xl backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Mobile: a summary line that opens the slots, so the dock stays a
            single row until you actually want to inspect the shortlist. */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setExpanded((v) => !v)}
            type="button"
            aria-expanded={expanded}
            className="flex flex-1 items-center gap-2 text-left text-[13px] font-bold text-ink"
          >
            <ChevronUp size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            <span>
              Comparing {items.length} of {COMPARE_MAX}
            </span>
            <span className="font-semibold text-muted-foreground">· from {formatINR(cheapest)}</span>
          </button>
          {clearButton("px-3 py-2 text-[13px]")}
          {compareButton("px-4 py-2 text-[13px]")}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className={`${expanded ? "grid" : "hidden"} mt-3 flex-1 gap-2 sm:mt-0 sm:grid sm:grid-cols-3`}>
            {items.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2.5 rounded-xl bg-secondary/60 p-2 ring-1 ring-black/5"
              >
                <ImageWithFallback
                  img={p.img}
                  grad={p.grad}
                  alt={p.name}
                  width={120}
                  className="h-11 w-11 flex-none rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-bold leading-tight text-ink">{p.name}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground">
                    <span className="text-brand">{formatINR(p.price)}</span>
                    <span className="text-muted-foreground/40">|</span>
                    <span className="inline-flex items-center gap-1">
                      <Moon size={11} /> {p.nights}N/{p.days}D
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  type="button"
                  aria-label={`Remove ${p.name} from comparison`}
                  className="flex-none rounded-full p-1 text-muted-foreground transition hover:bg-white hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Placeholders carry the cap: you can see there is room for more. */}
            {Array.from({ length: empty }, (_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/10 p-2 text-[12px] font-semibold text-muted-foreground/70"
              >
                <Plus size={14} /> Add a package
              </div>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 self-center sm:flex">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-bold text-muted-foreground">
              <Scale size={14} />
              {items.length}/{COMPARE_MAX}
            </span>
            {clearButton("px-4 py-2.5 text-[14px]")}
            {compareButton("px-4 py-2.5 text-[14px]")}
          </div>
        </div>
      </div>
    </div>
  );
}
