import { useEffect, useState } from "react";
import { Check, Minus, Plane, Scale, TrainFront, X } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { RatingBadge } from "@/components/common/RatingBadge";
import { AccentBar } from "@/components/common/AccentBar";
import { inclusionIcons } from "@/components/package/InclusionIcons";
import { inclusionsOf, type InclusionKey } from "@/utils/inclusions";
import { formatINR } from "@/utils/format";

interface CompareModalProps {
  items: TourPackage[];
  onClose: () => void;
}

interface Row {
  label: string;
  /** Rendered cell. */
  render: (pkg: TourPackage) => React.ReactNode;
  /** Comparable value — rows whose keys all match are the "same" rows. */
  key: (pkg: TourPackage) => string;
}

/** Column-header badges, so the table states a verdict instead of implying one. */
function winnersOf(items: TourPackage[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (items.length < 2) return out;

  const award = (label: string, best: (a: TourPackage) => number, better: "min" | "max") => {
    const scores = items.map(best);
    const target = better === "min" ? Math.min(...scores) : Math.max(...scores);
    const winners = items.filter((_, i) => scores[i] === target);
    // A badge only means something if exactly one package earns it.
    if (winners.length === 1) (out[winners[0].id] ??= []).push(label);
  };

  award("Cheapest", (p) => p.price, "min");
  award("Shortest", (p) => p.days, "min");
  award("Top rated", (p) => p.rating, "max");
  award("Most inclusive", (p) => p.inclusionKeys.length, "max");
  return out;
}

export function CompareModal({ items, onClose }: CompareModalProps) {
  const { go } = useRouter();
  const [diffOnly, setDiffOnly] = useState(false);

  // Freeze the page behind the modal so a scroll gesture moves the table, not
  // the listing underneath. Restored to whatever it was, so a stacked overlay
  // that also locked doesn't get clobbered.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const rows: Row[] = [
    {
      label: "Price / person",
      key: (p) => String(p.price),
      render: (p) => <span className="font-bold text-ink">{formatINR(p.price)}</span>,
    },
    { label: "Duration", key: (p) => `${p.nights}/${p.days}`, render: (p) => `${p.nights}N / ${p.days}D` },
    { label: "Rating", key: (p) => String(p.rating), render: (p) => <RatingBadge value={p.rating} /> },
    {
      label: "Travel mode",
      key: (p) => p.travelMode,
      render: (p) => (
        <span className="inline-flex items-center gap-1">
          {p.travelMode === "Air" ? <Plane size={12} /> : <TrainFront size={12} />}
          {p.travelMode}
        </span>
      ),
    },
    { label: "Origin", key: (p) => p.from, render: (p) => p.from },
    { label: "Itinerary", key: (p) => p.region, render: (p) => p.region },
    { label: "Climate", key: (p) => p.climate, render: (p) => p.climate },
    {
      label: "Best for",
      key: (p) => p.experience.slice(0, 2).join(","),
      render: (p) => p.experience.slice(0, 2).join(", "),
    },
  ];

  // The union, in first-seen order, so the matrix has one row per inclusion any
  // of the shortlisted packages offers — the ones nobody offers stay out.
  const allInclusions: InclusionKey[] = [];
  for (const p of items) {
    for (const k of inclusionsOf(p)) if (!allInclusions.includes(k)) allInclusions.push(k);
  }

  const inclusionRows: Row[] = allInclusions.map((k) => {
    const Icon = inclusionIcons[k];
    return {
      label: k,
      key: (p) => (inclusionsOf(p).includes(k) ? "y" : "n"),
      render: (p) =>
        inclusionsOf(p).includes(k) ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <Icon size={13} /> <Check size={13} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground/50">
            <Icon size={13} /> <Minus size={13} />
          </span>
        ),
    };
  });

  const differs = (row: Row) => new Set(items.map(row.key)).size > 1;
  const visible = (row: Row) => !diffOnly || differs(row);

  const winners = winnersOf(items);
  const facts = rows.filter(visible);
  const inclusions = inclusionRows.filter(visible);

  const section = (title: string, list: Row[]) =>
    list.length === 0 ? null : (
      <>
        <tr>
          <td
            colSpan={items.length + 1}
            className="sticky left-0 bg-secondary/60 px-3 py-2 font-display text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
          >
            {title}
          </td>
        </tr>
        {list.map((row) => {
          // A differing row is the one worth reading — it earns a soft tint and
          // a brand rule down the label. Labels stay full-contrast either way:
          // a greyed label next to a green tick read as "missing", which it isn't.
          const highlight = differs(row);
          return (
            <tr key={row.label} className={`border-t border-black/[0.06] ${highlight ? "bg-brand/[0.05]" : ""}`}>
              <td
                className={`sticky left-0 bg-white px-3 py-2.5 font-semibold text-ink ${
                  highlight ? "shadow-[inset_2px_0_0_0_theme(colors.brand)]" : ""
                }`}
              >
                {row.label}
              </td>
              {items.map((p) => (
                <td key={p.id} className="px-3 py-2.5 align-middle text-foreground">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          );
        })}
      </>
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-t-lg bg-white md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div className="flex items-center gap-2 font-display text-[18px] font-semibold text-ink">
            <Scale size={18} /> Compare packages
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiffOnly((v) => !v)}
              type="button"
              aria-pressed={diffOnly}
              className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition ${
                diffOnly ? "bg-ink text-white" : "bg-secondary text-ink hover:bg-secondary/70"
              }`}
            >
              Differences only
            </button>
            <button onClick={onClose} type="button" className="rounded-full p-1.5 hover:bg-secondary">
              <X size={18} />
            </button>
          </div>
        </div>
        <AccentBar />
        <div className="overflow-auto p-4" style={{ maxHeight: "72vh" }}>
          <table className="w-full border-collapse text-[13.5px] leading-relaxed [font-variant-numeric:tabular-nums]">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white px-3 py-2 text-left" />
                {items.map((p) => (
                  <th key={p.id} className="min-w-[180px] px-3 py-2 align-top">
                    <ImageWithFallback img={p.img} grad={p.grad} alt={p.name} className="mb-2.5 h-28 w-full rounded-lg" />
                    <div className="font-display text-[14.5px] font-semibold leading-snug text-ink">{p.name}</div>
                    {winners[p.id] && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {winners[p.id].map((w) => (
                          <span
                            key={w}
                            className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 ring-1 ring-emerald-600/20"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section("At a glance", facts)}
              {section("What's included", inclusions)}
              {facts.length === 0 && inclusions.length === 0 && (
                <tr className="border-t">
                  <td colSpan={items.length + 1} className="p-6 text-center text-muted-foreground">
                    These packages are identical on every field we compare.
                  </td>
                </tr>
              )}
              <tr className="border-t">
                <td className="sticky left-0 bg-white p-2" />
                {items.map((p) => (
                  <td key={p.id} className="p-2">
                    <button
                      onClick={() => go({ name: "detail", id: p.id })}
                      type="button"
                      className="w-full rounded-lg bg-brand px-3 py-2 text-[12px] font-bold text-white hover:brightness-95"
                    >
                      View &amp; book
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
