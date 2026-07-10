import { Check, Plane, Scale, TrainFront, X } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { RatingBadge } from "@/components/common/RatingBadge";
import { AccentBar } from "@/components/common/AccentBar";
import { formatINR } from "@/utils/format";

interface CompareModalProps {
  items: TourPackage[];
  onClose: () => void;
}

type Row = [string, (pkg: TourPackage) => React.ReactNode];

export function CompareModal({ items, onClose }: CompareModalProps) {
  const { go } = useRouter();

  const rows: Row[] = [
    ["Price / person", (p) => <span className="font-bold text-ink">{formatINR(p.price)}</span>],
    ["Duration", (p) => `${p.nights}N / ${p.days}D`],
    ["Rating", (p) => <RatingBadge value={p.rating} />],
    [
      "Travel mode",
      (p) => (
        <span className="inline-flex items-center gap-1">
          {p.travelMode === "Air" ? <Plane size={12} /> : <TrainFront size={12} />}
          {p.travelMode}
        </span>
      ),
    ],
    ["Climate", (p) => p.climate],
    ["Best for", (p) => p.experience.slice(0, 2).join(", ")],
    [
      "Highlights",
      (p) => (
        <ul className="space-y-1">
          {p.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-1">
              <Check size={12} className="mt-0.5 flex-none text-emerald-600" />
              {h}
            </li>
          ))}
        </ul>
      ),
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 md:items-center md:p-6" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-t-3xl bg-white md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 font-display text-[18px] font-semibold text-ink">
            <Scale size={18} /> Compare packages
          </div>
          <button onClick={onClose} type="button" className="rounded-full p-1.5 hover:bg-secondary">
            <X size={18} />
          </button>
        </div>
        <AccentBar />
        <div className="overflow-auto p-4" style={{ maxHeight: "72vh" }}>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white p-2 text-left" />
                {items.map((p) => (
                  <th key={p.id} className="min-w-[160px] p-2 align-top">
                    <ImageWithFallback img={p.img} grad={p.grad} alt={p.name} className="mb-2 h-20 w-full rounded-xl" />
                    <div className="font-display text-[14px] font-semibold leading-tight text-ink">{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render], i) => (
                <tr key={i} className="border-t">
                  <td className="sticky left-0 bg-white p-2 font-bold text-muted-foreground">{label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-2 align-top">
                      {render(p)}
                    </td>
                  ))}
                </tr>
              ))}
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
