import { useState } from "react";
import { ChevronDown, History as HistoryIcon } from "lucide-react";
import type { TourPackage } from "@/types";
import { EditorialPackageCard } from "@/components/package/EditorialPackageCard";

interface RecentPackagesDrawerProps {
  packages: TourPackage[];
}

/**
 * A quick-jump shelf above the results: the packages last looked at, always
 * announced by its bar, with the cards themselves folding back into it.
 */
export function RecentPackagesDrawer({ packages }: RecentPackagesDrawerProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mx-auto w-full overflow-hidden rounded-2xl lg:w-3/5 border-[6px] border-white bg-gradient-to-r from-[#0b2a5e] via-brand to-[#1a7fc9] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.55)] ring-1 ring-black/5">
      <button
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
        className="group/bar flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition hover:bg-white/5"
      >
        <span className="inline-flex items-center gap-2.5">
          <HistoryIcon size={16} className="shrink-0 text-white/70" />
          <span className="font-display text-[14px] font-bold uppercase tracking-[0.14em] text-white">
            Recent tour packages
          </span>
        </span>
        <span className="inline-flex items-center gap-2 text-[12.5px] font-bold text-white/70">
          {open ? "Hide" : `Show (${packages.length})`}
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition group-hover/bar:bg-white/25">
            <ChevronDown size={16} className={`transition-transform duration-500 ease-out ${open ? "" : "-rotate-180"}`} />
          </span>
        </span>
      </button>

      {/* Folds into the bar on the same curve the cards use. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="card-row flex flex-col gap-4 px-3 pb-3 sm:flex-row" style={{ "--cell-grow": 1.2, "--cell-shrink": 0.9 } as React.CSSProperties}>
            {packages.map((pkg) => (
              <div key={pkg.id} className="card-cell min-w-0">
                <EditorialPackageCard pkg={pkg} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
