import { Sparkles } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { RatingBadge } from "@/components/common/RatingBadge";
import { formatINR } from "@/utils/format";

export function AiPickBanner({ pkg }: { pkg: TourPackage }) {
  const { go } = useRouter();

  return (
    <div className="reveal overflow-hidden rounded-3xl border-2 border-brand/30 bg-white shadow-xl">
      <div className="flex items-center gap-2 bg-brand px-5 py-2.5 text-white">
        <Sparkles size={16} /> <span className="text-[13px] font-bold">AI recommends · best value right now</span>
      </div>
      <div className="grid gap-0 md:grid-cols-[1.1fr_1.4fr]">
        <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-56 md:h-full" />
        <div className="p-6">
          <RatingBadge value={pkg.rating} reviews={pkg.reviews} />
          <h3 className="mt-2 font-display text-[22px] font-semibold text-ink">{pkg.name}</h3>
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-brand/5 p-3 text-[13px] text-foreground/80">
            <Sparkles size={15} className="mt-0.5 flex-none text-brand" />
            <span>
              <b className="text-ink">Why this pick:</b> {pkg.aiReason}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-muted-foreground">from · per person</div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[26px] font-bold text-ink">{formatINR(pkg.price)}</span>
                {pkg.oldPrice && <span className="text-[14px] text-muted-foreground line-through">{formatINR(pkg.oldPrice)}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go({ name: "detail", id: pkg.id })}
                type="button"
                className="rounded-xl border-2 border-brand px-4 py-2.5 text-[14px] font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                View details
              </button>
              <button
                onClick={() => go({ name: "booking", id: pkg.id })}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-[14px] font-bold text-white shadow transition hover:brightness-95"
              >
                Book now <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
