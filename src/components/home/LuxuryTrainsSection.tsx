import { TrainFront } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { TrainCarousel } from "./TrainCarousel";

export function LuxuryTrainsSection() {
  const ref = useReveal();
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6" ref={ref}>
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-azure">
              <TrainFront size={15} /> Palaces on rails
            </div>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight text-ink">
              India&apos;s luxury tourist <span className="text-[#2475EE]">trains</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] text-muted-foreground">
            Seven-time &apos;World&apos;s Leading Luxury Train&apos; and its royal peers — fine dining, butler
            service and curated heritage, all on the move.
          </p>
        </div>
        <div className="reveal mt-10">
          <TrainCarousel />
        </div>
      </div>
    </section>
  );
}
