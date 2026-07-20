import { ArrowRight, CalendarDays, Check, Moon, Scale, Tag } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { InclusionIcons } from "@/components/package/InclusionIcons";
import { getPackageDetail } from "@/data/packageDetail";
import { formatINR } from "@/utils/format";

interface EditorialPackageCardProps {
  pkg: TourPackage;
  /** Wide tiles get a taller frame. */
  featured?: boolean;
  /** Shorter frame, for the recent-packages shelf. */
  compact?: boolean;
  /** Shown top-right under the price when the card can be compared. */
  comparing?: boolean;
  onCompare?: () => void;
}

/**
 * Full-bleed photo card: the image is the card, and the details live in a
 * frosted panel that rises on hover to reveal the tags and the CTA.
 */
export function EditorialPackageCard({
  pkg,
  featured = false,
  compact = false,
  comparing = false,
  onCompare,
}: EditorialPackageCardProps) {
  const { go } = useRouter();
  const detail = getPackageDetail(pkg);
  const height = featured ? "h-[470px]" : compact ? "h-[330px]" : "h-[410px]";

  return (
    <div
      onClick={() => go({ name: "detail", id: pkg.id })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && go({ name: "detail", id: pkg.id })}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border-[6px] text-left shadow-md ring-1 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(15,23,42,0.45)] ${height} ${
        comparing ? "border-brand ring-brand/40" : "border-white ring-black/5"
      }`}
    >
      <ImageWithFallback
        img={pkg.img}
        grad={pkg.grad}
        alt={pkg.name}
        overlay={false}
        width={featured ? 1400 : 900}
        className="absolute inset-0 h-full w-full transform-gpu transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      {/* Hairline highlight so the white frame reads as part of the photo. */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/25" />

      <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-2">
        {/* Holiday type — ours, not IRCTC's: it's what the filter panel sorts by. */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-md">
          <Tag size={12} /> {pkg.category}
        </span>
        <div className="flex flex-col items-end gap-2">
          {/* "Starting from" price, the only figure IRCTC prints on a row. */}
          <span className="origin-top-right rounded-full bg-brand px-3.5 py-1.5 text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
            {formatINR(pkg.price)}
          </span>

          {/* Shortlist toggle: a bare icon until you reach the card, then it
              opens out into a labelled pill. Selected, it stays open and the
              whole card takes a brand frame — the state reads from a distance. */}
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare();
              }}
              type="button"
              aria-pressed={comparing}
              className={`inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-full px-2 text-[12px] font-bold shadow-md backdrop-blur-md transition-all duration-300 ease-out ${
                comparing ? "bg-brand text-white" : "bg-black/40 text-white hover:bg-brand"
              }`}
            >
              {comparing ? <Check size={14} className="shrink-0" /> : <Scale size={14} className="shrink-0" />}
              <span
                className={`grid transition-[grid-template-columns] duration-300 ease-out ${
                  comparing ? "grid-cols-[1fr]" : "grid-cols-[0fr] group-hover:grid-cols-[1fr]"
                }`}
              >
                <span className="overflow-hidden whitespace-nowrap pr-1">{comparing ? "Added" : "Compare"}</span>
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="absolute inset-x-[7px] bottom-[7px] overflow-hidden rounded-[11px] border border-white/30 bg-white/12 px-5 py-4 backdrop-blur-md transition-all duration-500 group-hover:bg-white/[0.18]">
        <h3 className={`font-display font-semibold leading-snug text-white ${featured ? "text-[26px]" : "text-[20px]"}`}>
          {pkg.name}
        </h3>

        {/* Scan-level facts stay put — duration, origin, destination and the
            journey date are what you compare on, so they are never behind an
            interaction. */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-semibold text-white/85">
          <span className="inline-flex items-center gap-1.5">
            <Moon size={13} className="text-white/60" /> {pkg.nights} Nights/{pkg.days} Days
          </span>
          <span className="text-white/40">|</span>
          <span>{pkg.from}</span>
          <ArrowRight size={13} className="text-white/55" />
          <span>{pkg.region}</span>
          <span className="text-white/40">|</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} className="text-white/60" /> {detail.nextDeparture}
          </span>
        </div>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="mt-3 border-t border-white/20 pt-3">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px]">
                <div className="flex gap-1.5">
                  <dt className="font-semibold text-white/60">Package Code:</dt>
                  <dd className="font-semibold text-white">{detail.code}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="font-semibold text-white/60">Departure:</dt>
                  <dd className="truncate font-semibold text-white">{detail.departure}</dd>
                </div>
              </dl>

              <div className="mt-2.5 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-1.5 text-[12.5px] font-semibold text-white/60">Inclusions:</div>
                  <InclusionIcons pkg={pkg} tone="light" size={13} />
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg transition group-hover:bg-brand group-hover:text-white">
                  <ArrowRight size={17} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
