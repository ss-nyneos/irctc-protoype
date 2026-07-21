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

      <div className="overflow-hidden rounded-xl border">
        <div className="flex items-center gap-3 border-b bg-secondary/40 px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          <span className="flex-1">Cancelled before departure</span>
          <span className="hidden w-24 text-right sm:block">Deduction</span>
          <span className="w-28 text-right">You lose</span>
        </div>

        {bands.map((band) => {
          const isCurrent = current === band;
          const amount = deductionFor(band, total, travellers);
          return (
            <div
              key={band.label}
              className={`flex items-center gap-3 border-b px-3.5 py-3 text-[13.5px] transition-colors duration-300 last:border-b-0 ${
                isCurrent ? "bg-brand/[0.07]" : ""
              }`}
            >
              <span className={`flex-1 ${isCurrent ? "font-bold text-ink" : "font-medium text-foreground/80"}`}>
                {band.label}
                {isCurrent && <span className="ml-2 text-[11px] font-bold uppercase text-brand">You are here</span>}
              </span>
              <span className="hidden w-24 text-right font-semibold text-muted-foreground sm:block">
                {band.flat !== undefined ? `${formatINR(band.flat)}/person` : `${band.percent}%`}
              </span>
              <span className={`w-28 text-right font-bold tabular-nums ${isCurrent ? "text-brand" : "text-ink"}`}>
                {formatINR(amount)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-2.5 text-[12.5px] text-muted-foreground">
        Figures are for {travellers} {travellers === 1 ? "traveller" : "travellers"} on the class selected in the
        fare panel, and move with it. Departure day itself is excluded from the count. Refunds reach the original
        payment method within 7 to 10 working days.
      </p>
    </div>
  );
}
