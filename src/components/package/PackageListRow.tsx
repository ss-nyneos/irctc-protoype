import { Check, Scale, Tag } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { InclusionIcons } from "@/components/package/InclusionIcons";
import { getPackageDetail } from "@/data/packageDetail";
import { formatINR } from "@/utils/format";

interface PackageListRowProps {
  pkg: TourPackage;
  comparing: boolean;
  onCompare: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <dt className="text-[13px] font-bold text-ink">{label}:</dt>
      <dd className="text-[13px] font-medium text-foreground/75">{value}</dd>
    </div>
  );
}

/**
 * The dense counterpart to the photo card: every field IRCTC prints on a
 * package row, laid out for comparison rather than for browsing.
 */
export function PackageListRow({ pkg, comparing, onCompare }: PackageListRowProps) {
  const { go } = useRouter();
  const detail = getPackageDetail(pkg);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border-[6px] border-white bg-white/70 shadow-md ring-1 ring-black/5 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_28px_60px_-20px_rgba(15,23,42,0.35)] sm:flex-row">
      <button
        onClick={() => go({ name: "detail", id: pkg.id })}
        type="button"
        className="relative shrink-0 overflow-hidden rounded-xl sm:w-[240px]"
      >
        <ImageWithFallback
          img={pkg.img}
          grad={pkg.grad}
          alt={pkg.name}
          overlay={false}
          width={600}
          className="h-44 w-full transform-gpu transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] sm:h-full"
        />
        {/* Holiday type — ours, not IRCTC's: it's what the filter panel sorts by. */}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11.5px] font-semibold text-white backdrop-blur-md">
          <Tag size={11} /> {pkg.category}
        </span>
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
        <button onClick={() => go({ name: "detail", id: pkg.id })} type="button" className="text-left">
          <h3 className="font-display text-[17px] font-bold uppercase leading-snug tracking-tight text-ink transition group-hover:text-brand">
            {pkg.name}
          </h3>
        </button>

        <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          <Field label="Duration" value={`${pkg.nights} Nights/${pkg.days} Days`} />
          <Field label="Package Code" value={detail.code} />
          <Field label="Origin" value={pkg.from} />
          <Field label="Destination" value={pkg.region} />
          <Field label="Departure" value={detail.departure} />
          <Field label="Upcoming Date Of Journey" value={detail.nextDeparture} />
        </dl>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3">
          <span className="text-[13px] font-bold text-ink">Inclusions:</span>
          <InclusionIcons pkg={pkg} />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-secondary/60 px-6 py-5 sm:w-[190px]">
        <span className="text-[12.5px] font-semibold text-muted-foreground">Starting from</span>
        <span className="font-display text-[26px] font-bold leading-none text-brand">{formatINR(pkg.price)}</span>
        <button
          onClick={() => go({ name: "detail", id: pkg.id })}
          type="button"
          className="mt-1 w-full rounded-full bg-brand px-4 py-2.5 text-[14px] font-bold text-white shadow transition hover:brightness-95"
        >
          View Details
        </button>
        <button
          onClick={onCompare}
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition ${
            comparing ? "bg-ink text-white" : "text-ink hover:bg-white"
          }`}
        >
          {comparing ? <Check size={13} /> : <Scale size={13} />} Compare
        </button>
      </div>
    </article>
  );
}
