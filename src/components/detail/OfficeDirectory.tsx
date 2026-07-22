import { useMemo, useState } from "react";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import type { BoardingPoint, TourPackage } from "@/types";
import { isHomeOffice, officesForPackage, type TourismOffice } from "@/data/offices";

/** Strip spaces and dashes for the `tel:` href; keep them in the label. */
const dial = (n: string) => `tel:+91${n.replace(/[^\d]/g, "")}`;

function OfficeCard({ office, home }: { office: TourismOffice; home: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const [primary, ...rest] = office.phones;

  return (
    <div
      className={`group flex flex-col rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] ${
        home ? "border-brand/40 ring-1 ring-brand/20" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-display text-[16px] font-bold leading-tight text-ink">{office.city}</h4>
          <p className="mt-0.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {office.zone} zone
          </p>
        </div>
        {/* The whole point of ranking these: say plainly which one is yours. */}
        {home && (
          <span className="flex-none rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">
            Your boarding city
          </span>
        )}
      </div>

      <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-foreground/70">
        <MapPin size={14} className="mt-0.5 flex-none text-muted-foreground" />
        {office.address}
      </p>

      <div className="mt-3 space-y-1.5">
        <a
          href={dial(primary)}
          className="inline-flex items-center gap-2 text-[14px] font-bold tabular-nums text-navy transition-colors hover:text-brand"
        >
          <Phone size={14} className="flex-none text-brand" />
          {primary}
        </a>

        {rest.length > 0 && (
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              showAll ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col items-start gap-1 pl-[22px] pt-1">
                {rest.map((phone) => (
                  <a
                    key={phone}
                    href={dial(phone)}
                    className="text-[13px] font-semibold tabular-nums text-foreground/70 transition-colors hover:text-brand"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {office.emails.map((email) => (
        <a
          key={email}
          href={`mailto:${email}`}
          className="mt-1.5 inline-flex items-center gap-2 break-all text-[13px] text-foreground/70 transition-colors hover:text-brand"
        >
          <Mail size={14} className="flex-none text-muted-foreground" />
          {email}
        </a>
      ))}

      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          className="mt-3 inline-flex items-center gap-1 self-start text-[12.5px] font-semibold text-brand transition hover:underline"
        >
          {showAll ? "Fewer numbers" : `${rest.length} more ${rest.length === 1 ? "number" : "numbers"}`}
          <ChevronDown size={13} className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

/**
 * IRCTC publishes this as a plain city/details table. Two changes: the office
 * that owns your boarding city comes first and says so, and the wall of six
 * numbers per office collapses to the desk line until you ask for the rest.
 */
export function OfficeDirectory({ pkg, boarding }: { pkg: TourPackage; boarding: BoardingPoint[] }) {
  const [expanded, setExpanded] = useState(false);
  const offices = useMemo(() => officesForPackage(pkg, boarding), [pkg, boarding]);

  // Four shown, the rest behind a toggle — a full directory above the fold is
  // the thing that made the original table unreadable.
  const visible = expanded ? offices : offices.slice(0, 4);
  const hidden = offices.length - visible.length;

  return (
    <div>
      <h3 className="font-display text-[17px] font-bold text-ink">IRCTC tourism offices</h3>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        Walk in or call the desk directly — offices handle group bookings, boarding changes and refunds on{" "}
        {pkg.name}.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {visible.map((office, i) => (
          <div
            key={office.city}
            className="animate-tileIn"
            // Cards land one after another rather than all at once, which is
            // what makes the expand read as a reveal instead of a repaint.
            style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}
          >
            <OfficeCard office={office} home={isHomeOffice(office, pkg)} />
          </div>
        ))}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[13.5px] font-semibold text-navy transition hover:bg-secondary"
        >
          Show all {offices.length} offices
          <ChevronDown size={15} />
        </button>
      )}
      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[13.5px] font-semibold text-navy transition hover:bg-secondary"
        >
          Show fewer
          <ChevronDown size={15} className="rotate-180" />
        </button>
      )}
    </div>
  );
}
