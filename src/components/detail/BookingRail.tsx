import { Calendar, Check, MapPin, Plane, ShieldCheck, Users } from "lucide-react";
import type { BoardingPoint, CoachClass, TourPackage } from "@/types";
import { formatINR } from "@/utils/format";

/**
 * The fare panel. Holds the prime sticky slot that irctctourism.com gives to a
 * callback form and a bus advert — while its only Book Now sits at the top of
 * the page and scrolls away. Here the price travels with the reader, and the
 * class selector replaces "Starting from ₹15600", which quietly hid the fact
 * that the same tour sells at three fares.
 */
export function BookingRail({
  pkg,
  classes,
  departures,
  boardingPoint,
  selectedClass,
  onSelectClass,
  travellers,
  onTravellers,
  departure,
  onDeparture,
  addFlight,
  onAddFlight,
  onBook,
}: {
  pkg: TourPackage;
  classes: CoachClass[];
  departures: string[];
  boardingPoint: BoardingPoint | null;
  selectedClass: CoachClass;
  onSelectClass: (code: string) => void;
  travellers: number;
  onTravellers: (n: number) => void;
  departure: string;
  onDeparture: (d: string) => void;
  addFlight: boolean;
  onAddFlight: (v: boolean) => void;
  onBook: () => void;
}) {
  const hasFlightAddon = pkg.flightAddon > 0;
  const flightTotal = addFlight && hasFlightAddon ? pkg.flightAddon * travellers : 0;
  const fareTotal = selectedClass.price * travellers;
  const gst = Math.round((fareTotal + flightTotal) * 0.05);
  const total = fareTotal + flightTotal + gst;
  const saving = pkg.oldPrice ? (pkg.oldPrice - classes[0].price) * travellers : 0;

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-brand/10 bg-white shadow-xl">
      <div className="p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground">
              {selectedClass.label} · per person
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[30px] font-bold tabular-nums text-ink">
                {formatINR(selectedClass.price)}
              </span>
              {pkg.oldPrice && selectedClass.code === classes[0].code && (
                <span className="text-[14px] tabular-nums text-muted-foreground line-through">
                  {formatINR(pkg.oldPrice)}
                </span>
              )}
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            Free cancellation*
          </span>
        </div>

        {/* Class-wise fares, up front rather than discovered at checkout. Kept
            to one line each: three tall cards pushed travellers and dates off
            the bottom of the rail, and the tier description only matters while
            you're choosing — the selected one restates it below. */}
        <fieldset className="mt-5">
          <legend className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
            Choose your class
          </legend>
          <div className="divide-y overflow-hidden rounded-2xl border">
            {classes.map((c) => {
              const isSelected = c.code === selectedClass.code && c.available;
              const isTight = c.seatsLeft <= 6;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectClass(c.code)}
                  disabled={!c.available}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition ${
                    !c.available
                      ? "cursor-not-allowed bg-secondary/40 opacity-55"
                      : isSelected
                        ? "bg-brand/[0.06]"
                        : "hover:bg-secondary/50"
                  }`}
                >
                  <span
                    className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border-2 transition ${
                      isSelected ? "border-brand bg-brand text-white" : "border-muted"
                    }`}
                  >
                    {isSelected && <Check size={11} />}
                  </span>

                  <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                    <span className={`text-[13.5px] font-bold ${isSelected ? "text-ink" : "text-foreground/80"}`}>
                      {c.label}
                    </span>
                    <span className="flex-none text-[11px] font-bold text-muted-foreground">{c.code}</span>
                  </span>

                  <span className="flex-none text-right">
                    <span className="block font-display text-[14px] font-bold tabular-nums text-ink">
                      {formatINR(c.price)}
                    </span>
                    {c.available ? (
                      <span className={`block text-[10.5px] font-semibold ${isTight ? "text-saffron" : "text-muted-foreground"}`}>
                        {c.seatsLeft} left
                      </span>
                    ) : (
                      <span className="block text-[10.5px] font-semibold text-destructive">Sold out</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[12px] leading-snug text-muted-foreground">{selectedClass.detail}</p>
        </fieldset>

        <div className="mt-4 flex items-center justify-between rounded-xl border p-3">
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Users size={16} /> Travellers
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTravellers(Math.max(1, travellers - 1))}
              type="button"
              aria-label="One traveller fewer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border text-ink transition hover:bg-secondary"
            >
              −
            </button>
            <span className="w-5 text-center font-bold tabular-nums text-ink">{travellers}</span>
            <button
              onClick={() => onTravellers(Math.min(12, travellers + 1))}
              type="button"
              aria-label="One traveller more"
              className="flex h-11 w-11 items-center justify-center rounded-lg border text-ink transition hover:bg-secondary"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-xl border p-3">
          <label htmlFor="departure" className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Calendar size={16} /> Departure
          </label>
          <select
            id="departure"
            value={departure}
            onChange={(e) => onDeparture(e.target.value)}
            className="cursor-pointer bg-transparent py-2 text-right text-[13px] font-semibold text-ink outline-none"
          >
            {departures.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {boardingPoint && (
          <div className="mt-2 flex items-center justify-between rounded-xl border p-3">
            <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
              <MapPin size={16} /> Boarding
            </span>
            <a href="#boarding" className="text-right text-[13px] font-semibold text-brand hover:underline">
              {boardingPoint.station}
              <span className="block text-[11px] font-medium tabular-nums text-muted-foreground">
                Departs {boardingPoint.dep ?? boardingPoint.arr}
              </span>
            </a>
          </div>
        )}

        {hasFlightAddon ? (
          <button
            onClick={() => onAddFlight(!addFlight)}
            type="button"
            aria-pressed={addFlight}
            className={`mt-3 flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
              addFlight ? "border-brand bg-brand/5" : "border-dashed border-brand/25 hover:border-brand/50"
            }`}
          >
            <span
              className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${
                addFlight ? "bg-brand text-white" : "bg-brand/5 text-brand"
              }`}
            >
              <Plane size={18} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
                Add IRCTC flights
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  SAVE {formatINR(1500)}
                </span>
              </span>
              <span className="text-[12px] text-muted-foreground">
                Return airfare to {pkg.from} · from {formatINR(pkg.flightAddon)}/person
              </span>
            </span>
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 ${
                addFlight ? "border-brand bg-brand text-white" : "border-muted"
              }`}
            >
              {addFlight && <Check size={13} />}
            </span>
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-brand/5 p-3.5 text-[12px] text-muted-foreground">
            <Plane size={16} className="flex-none text-brand" /> Onboard rail travel already included in this journey.
          </div>
        )}

        {/* GST is stated here rather than sprung at checkout. */}
        <div className="mt-4 space-y-1.5 rounded-xl bg-secondary/50 p-3 text-[13px] tabular-nums">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {selectedClass.code} {formatINR(selectedClass.price)} × {travellers}
            </span>
            <span className="font-semibold">{formatINR(fareTotal)}</span>
          </div>
          {flightTotal > 0 && (
            <div className="flex justify-between text-brand">
              <span>Flights × {travellers}</span>
              <span className="font-semibold">{formatINR(flightTotal)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (5%)</span>
            <span className="font-semibold">{formatINR(gst)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between border-t pt-2">
            <span className="font-bold text-ink">Total</span>
            <span className="font-display text-[22px] font-bold text-ink">{formatINR(total)}</span>
          </div>
          {saving > 0 && selectedClass.code === classes[0].code && (
            <div className="text-right text-[12px] font-semibold text-emerald-700">
              You save {formatINR(saving)}
            </div>
          )}
        </div>

        <button
          onClick={onBook}
          type="button"
          className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-[16px] font-bold text-white shadow-lg transition hover:brightness-95"
        >
          Book this tour
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-muted-foreground">
          <ShieldCheck size={14} className="flex-none text-emerald-600" /> Secure government payment · Part-pay 25% today
        </div>
      </div>
    </div>
  );
}
