import { AlertTriangle } from "lucide-react";
import type { CancellationBand } from "@/types";
import { bandForDaysOut, deductionFor } from "@/data/policyContent";
import { formatINR } from "@/utils/format";

/** Whole days from today to `date`, or null if the date won't parse. */
function daysUntil(date: string): number | null {
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  const startOfDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((startOfDay(target) - startOfDay(today)) / 86_400_000);
}

interface CancellationLadderProps {
  bands: CancellationBand[];
  /** Booking value the percentage rungs are taken from, incl. add-ons and GST. */
  total: number;
  travellers: number;
  /** The departure currently selected in the fare rail, e.g. "03 Aug 2026". */
  departure: string;
}

export function CancellationLadder({ bands, total, travellers, departure }: CancellationLadderProps) {
  const daysOut = daysUntil(departure);
  // A departure already past has no live rung to highlight.
  const current = daysOut !== null && daysOut >= 0 ? bandForDaysOut(daysOut) : null;

  return (
    <div>
      {current && (
        <div className="mb-3 flex items-start gap-2.5 rounded-xl bg-secondary/50 px-3.5 py-3">
          <AlertTriangle size={16} className="mt-0.5 flex-none text-brand" />
          <p className="text-[13px] leading-relaxed text-foreground/80">
            Your departure is <strong className="font-semibold text-ink">{daysOut} days</strong> away. Cancelling
            today falls in the <strong className="font-semibold text-ink">{current.label}</strong> band and would
            cost{" "}
            <strong className="font-semibold text-ink tabular-nums">
              {formatINR(deductionFor(current, total, travellers))}
            </strong>
            .
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand text-white text-[13px] font-bold uppercase tracking-wider">
              <th scope="col" className="px-6 py-3.5">Cancelled before departure</th>
              <th scope="col" className="px-6 py-3.5">Deduction</th>
              <th scope="col" className="px-6 py-3.5 text-right">You lose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60 text-[14px]">
            {bands.map((band, idx) => {
              const isCurrent = current === band;
              const amount = deductionFor(band, total, travellers);
              const rowBg = isCurrent
                ? "bg-brand/10 font-bold"
                : idx % 2 === 1
                ? "bg-[#EBF3FF]"
                : "bg-white";

              return (
                <tr key={band.label} className={`transition-colors ${rowBg}`}>
                  <td className="px-6 py-4 font-semibold text-ink">
                    <div className="flex items-center gap-2">
                      <span>{band.label}</span>
                      {isCurrent && (
                        <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                          You are here
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground/80">
                    {band.flat !== undefined ? `${formatINR(band.flat)} / person` : `${band.percent}%`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-1.5 text-[13px] font-bold tabular-nums text-white shadow-sm transition hover:brightness-95">
                      {formatINR(amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2.5 text-[12.5px] text-muted-foreground">
        Figures are for {travellers} {travellers === 1 ? "traveller" : "travellers"} on the class selected in the
        fare panel, and move with it. Departure day itself is excluded from the count. Refunds reach the original
        payment method within 7 to 10 working days.
      </p>
    </div>
  );
}
