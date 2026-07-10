import { ArrowRight, MapPin, Moon, Plane, TrainFront } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { RatingBadge } from "@/components/common/RatingBadge";
import { formatINR } from "@/utils/format";

interface PackageCardProps {
  pkg: TourPackage;
  compact?: boolean;
}

export function PackageCard({ pkg, compact = false }: PackageCardProps) {
  const { go } = useRouter();
  const ModeIcon = pkg.travelMode === "Air" ? Plane : TrainFront;

  return (
    <button
      onClick={() => go({ name: "detail", id: pkg.id })}
      type="button"
      className="group flex w-full flex-col overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative">
        <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className={compact ? "h-40" : "h-52"} />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center gap-1 text-[12px] font-semibold text-white/90">
            <MapPin size={12} />
            {pkg.region}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90">
            <ModeIcon size={12} /> {pkg.travelMode}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <RatingBadge value={pkg.rating} reviews={pkg.reviews} />
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground">
            <Moon size={12} /> {pkg.nights}N / {pkg.days}D
          </span>
        </div>
        <h3 className="font-display text-[17px] font-semibold leading-snug text-ink">{pkg.name}</h3>
        {!compact && <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{pkg.blurb}</p>}

        {pkg.tags.length > 0 && (
          <p className="mt-3 text-[12px] font-medium text-muted-foreground">{pkg.tags.slice(0, 3).join(" · ")}</p>
        )}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <div className="text-[11px] text-muted-foreground">from · per person</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[22px] font-bold text-ink">{formatINR(pkg.price)}</span>
              {pkg.oldPrice && <span className="text-[13px] text-muted-foreground line-through">{formatINR(pkg.oldPrice)}</span>}
            </div>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition group-hover:brightness-95">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </button>
  );
}
