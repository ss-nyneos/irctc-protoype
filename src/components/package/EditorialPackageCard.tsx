import { ArrowRight, CalendarDays, Check, Moon, Scale } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { InclusionIcons } from "@/components/package/InclusionIcons";
import { getPackageDetail } from "@/data/packageDetail";
import { formatINR } from "@/utils/format";


export const HOVER_GROW = 0.28;

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
      className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl text-left shadow-md transition-all duration-500 hover:-translate-y-1.5 ${height}`}
    >
      <ImageWithFallback
        img={pkg.img}
        grad={pkg.grad}
        alt={pkg.name}
        overlay={false}
        width={featured ? 1400 : 900}
        className="absolute inset-0 h-full w-full transform-gpu transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
      {/* Carries the readability the caption panel used to provide itself. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-x-5 top-5 flex items-start justify-end gap-2">
        <div className="flex flex-col items-end gap-2">
          {/* "Starting from" price, the only figure IRCTC prints on a row. */}
          <span className="origin-top-right rounded-full bg-brand px-3.5 py-1.5 text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
            {formatINR(pkg.price)}
          </span>

          {/* Shortlist toggle: always a full labelled pill, never hover-only —
              on touch there is no hover, so a bare icon reads as decoration.
              Selected, the pill itself goes brand — the card keeps no frame. */}
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare();
              }}
              type="button"
              aria-pressed={comparing}
              className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12px] font-bold shadow-md backdrop-blur-md transition-colors duration-300 ease-out ${
                comparing ? "bg-brand text-white" : "bg-black/40 text-white hover:bg-brand"
              }`}
            >
              {comparing ? <Check size={14} className="shrink-0" /> : <Scale size={14} className="shrink-0" />}
              {comparing ? "Added" : "Compare"}
            </button>
          )}
        </div>
      </div>

      <div
        // No panel at all: any film or blur here milks the photograph out. The
        // card's own bottom gradient plus a shadow under the type is what keeps
        // the white readable, so the picture stays whole.
        className={`absolute inset-x-[7px] bottom-[7px] overflow-hidden rounded-[11px] transition-all duration-500 [text-shadow:0_1px_10px_rgba(0,0,0,0.75)] ${
          compact ? "px-4 py-3" : "px-5 py-4"
        }`}
      >
        {/* Card title spec (World + Detail): Helvetica semibold 17.23px, always
            white over the photo. Featured tiles (Home only) keep their larger
            display size. */}
        <h3
          className={`line-clamp-2 font-semibold leading-snug text-[#FFFFFF] [font-family:Helvetica,Arial,sans-serif] ${
            featured ? "font-display text-[26px]" : "text-[17.23px]"
          }`}
        >
          {pkg.name}
        </h3>

        {/* Scan-level facts only — duration and the journey date. The route
            itself is long enough to wrap the title off the photo, so it moves
            into the hover panel below with the rest of the detail. */}
        <div
          className={`mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-semibold text-white/85 ${
            compact ? "text-[11.5px]" : "text-[13px]"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <Moon size={13} className="text-white/60" /> {pkg.nights} Nights/{pkg.days} Days
          </span>
          <span className="text-white/40">|</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} className="text-white/60" /> {detail.nextDeparture}
          </span>
        </div>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className={`border-t border-white/20 ${compact ? "mt-2 pt-2" : "mt-3 pt-3"}`}>
              {/* The route, revealed on hover: origin, then every stop. */}
              <div
                className={`flex items-center gap-1.5 font-semibold text-white/85 ${
                  compact ? "mb-1.5 text-[11.5px]" : "mb-2.5 text-[12.5px]"
                }`}
              >
                <span className="shrink-0">{pkg.from}</span>
                <ArrowRight size={13} className="shrink-0 text-white/55" />
                <span className="truncate">{pkg.region}</span>
              </div>

              {/* The shelf's cards are half height — the label/value grid won't
                  fit there without swallowing the photo, so it stays on the
                  full-size cards and the shelf keeps the inclusions row. */}
              {!compact && (
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
              )}

              <div className={`flex items-end justify-between gap-4 ${compact ? "" : "mt-2.5"}`}>
                <div className="min-w-0">
                  <div className={`font-semibold text-white/60 ${compact ? "mb-1 text-[11.5px]" : "mb-1.5 text-[12.5px]"}`}>
                    Inclusions:
                  </div>
                  <InclusionIcons pkg={pkg} tone="light" size={compact ? 12 : 13} />
                </div>
                <span
                  className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg transition group-hover:bg-brand group-hover:text-white ${
                    compact ? "h-8 w-8" : "h-10 w-10"
                  }`}
                >
                  <ArrowRight size={compact ? 15 : 17} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
