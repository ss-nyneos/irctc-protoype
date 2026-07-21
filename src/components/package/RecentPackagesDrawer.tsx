import { useState } from "react";
import { ChevronDown, ChevronRight, History as HistoryIcon } from "lucide-react";
import type { TourPackage } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { formatINR } from "@/utils/format";

interface RecentPackagesDrawerProps {
  packages: TourPackage[];
}

/**
 * A quick-jump shelf above the results: the packages last looked at, listed
 * thumbnail-name-price and nothing else, with the list folding into its bar.
 */
export function RecentPackagesDrawer({ packages }: RecentPackagesDrawerProps) {
  const { go } = useRouter();
  const [open, setOpen] = useState(true);

  // Solid white on purpose: this sits on a photograph, and a translucent panel
  // takes the picture's colour with it and stops being readable.
  return (
    <section className="mx-auto w-full overflow-hidden rounded-md border border-black/5 bg-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)] lg:w-3/5">
      <button
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
        className="group/bar flex w-full items-center justify-between gap-4 px-4 py-2 text-left transition hover:bg-secondary/50"
      >
        <span className="inline-flex items-center gap-2.5">
          <HistoryIcon size={14} className="shrink-0 text-saffron" />
          <span className="font-display text-[12.5px] font-bold uppercase tracking-[0.22em] text-ink">
            Recent
            <span className="ml-1.5 font-medium tracking-[0.22em] text-muted-foreground">tour packages</span>
          </span>
        </span>
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-navy transition group-hover/bar:bg-secondary-foreground/15">
          <ChevronDown size={14} className={`transition-transform duration-500 ease-out ${open ? "" : "-rotate-180"}`} />
        </span>
      </button>

      {/* Folds into the bar on the same curve the cards use. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="divide-y divide-border border-t border-border">
            {packages.map((pkg, i) => (
              <li key={pkg.id}>
                <button
                  onClick={() => go({ name: "detail", id: pkg.id })}
                  type="button"
                  // Rows deal themselves in behind the drawer as it opens.
                  style={{ transitionDelay: open ? `${140 + i * 70}ms` : "0ms" }}
                  className={`group/row relative flex w-full items-center gap-3 px-4 py-1.5 text-left transition-all duration-500 ease-out hover:bg-secondary/50 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  {/* Fills in from the left on hover, like a track lighting up. */}
                  <span className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-saffron/15 to-transparent transition-all duration-500 ease-out group-hover/row:w-full" />

                  <ImageWithFallback
                    img={pkg.img}
                    grad={pkg.grad}
                    alt={pkg.name}
                    overlay={false}
                    width={160}
                    className="relative h-8 w-11 shrink-0 rounded-sm ring-1 ring-black/10"
                  />

                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold tracking-tight text-ink transition group-hover/row:text-navy">
                      {pkg.name}
                    </span>
                    <span className="block truncate text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      {pkg.nights}N / {pkg.days}D
                    </span>
                  </span>

                  <span className="relative shrink-0 font-display text-[14px] font-bold text-saffron">
                    {formatINR(pkg.price)}
                  </span>
                  <ChevronRight
                    size={15}
                    className="relative shrink-0 text-muted-foreground/60 transition group-hover/row:translate-x-0.5 group-hover/row:text-ink"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
