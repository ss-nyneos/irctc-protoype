import { ArrowRight, MapPin, Moon, Plane, Star, TrainFront } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { formatINR } from "@/utils/format";

interface EditorialPackageCardProps {
  pkg: TourPackage;
  /** Wide tiles get a taller frame and show the blurb. */
  featured?: boolean;
}

/**
 * Full-bleed photo card: the image is the card, and the details live in a
 * frosted panel that rises on hover to reveal the tags and the CTA.
 */
export function EditorialPackageCard({ pkg, featured = false }: EditorialPackageCardProps) {
  const { go } = useRouter();
  const ModeIcon = pkg.travelMode === "Air" ? Plane : TrainFront;

  return (
    <button
      onClick={() => go({ name: "detail", id: pkg.id })}
      type="button"
      className={`group relative w-full overflow-hidden rounded-2xl border-[6px] border-white text-left shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(15,23,42,0.45)] ${
        featured ? "h-[440px]" : "h-[380px]"
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-md">
          <MapPin size={13} /> {pkg.region}
        </span>
        <span className="origin-top-right rounded-full bg-brand px-3.5 py-1.5 text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
          {formatINR(pkg.price)}
          {pkg.oldPrice && <span className="ml-1.5 text-[12px] font-semibold text-white/65 line-through">{formatINR(pkg.oldPrice)}</span>}
        </span>
      </div>

      <div className="absolute inset-x-[7px] bottom-[7px] overflow-hidden rounded-[11px] border border-white/30 bg-white/12 px-5 py-4 backdrop-blur-xl transition-all duration-500 group-hover:bg-white/[0.18]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-semibold text-white/90">
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" /> {pkg.rating.toFixed(1)}
            <span className="font-medium text-white/65">({pkg.reviews.toLocaleString("en-IN")})</span>
          </span>
          <span className="inline-flex items-center gap-1.5"><Moon size={14} /> {pkg.nights}N / {pkg.days}D</span>
          <span className="inline-flex items-center gap-1.5"><ModeIcon size={14} /> {pkg.travelMode}</span>
        </div>

        <h3 className={`mt-2.5 font-display font-semibold leading-snug text-white ${featured ? "text-[26px]" : "text-[20px]"}`}>
          {pkg.name}
        </h3>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex items-end justify-between gap-4 pt-4">
              <div className="min-w-0">
                {featured && <p className="mb-2 line-clamp-2 text-[13.5px] text-white/80">{pkg.blurb}</p>}
                <div className="flex flex-wrap gap-2">
                  {pkg.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-semibold text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg transition group-hover:bg-brand group-hover:text-white">
                <ArrowRight size={17} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
