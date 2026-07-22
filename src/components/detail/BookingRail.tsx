import { Calendar, Check, MapPin, Plane, ShieldCheck, Users } from "lucide-react";
import type { BoardingPoint, CoachClass, TourPackage } from "@/types";
import { formatINR } from "@/utils/format";
import { SelectMenu } from "@/components/common/SelectMenu";

export function BookingRail({
  pkg,
  classes,
  departures,
  boardingPoint,
  selectedClass,
  travellers,
  onTravellers,
  departure,
  onDeparture,
  onBook,
}: {
  pkg: TourPackage;
  classes: CoachClass[];
  departures: string[];
  boardingPoint: BoardingPoint | null;
  selectedClass: CoachClass;
  travellers: number;
  onTravellers: (n: number) => void;
  departure: string;
  onDeparture: (d: string) => void;
  onBook: () => void;
}) {
  const hasFlightAddon = false;
  const addFlight = false;
  const onAddFlight = (value: boolean) => value;
  const flightTotal = 0;
  const fareTotal = selectedClass.price * travellers;
  const gst = Math.round(fareTotal * 0.05);
  const total = fareTotal + gst;
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

        {/* No class picker here: category is chosen once, in Basic detail on
            the booking form. Two places to pick it meant two sources of truth. */}

        <div className="mt-5 flex items-center justify-between rounded-xl border p-3">
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
          <SelectMenu
            id="departure"
            bare
            ariaLabel="Departure date"
            value={departure}
            onChange={onDeparture}
            options={departures.map((d) => ({ value: d, label: d }))}
          />
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

        {hasFlightAddon && (
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
            {/* <span className="flex-1">
              <span className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
                Add IRCTC flights
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  SAVE {formatINR(1500)}
                </span>
              </span>
              <span className="text-[12px] text-muted-foreground">
                Return airfare to {pkg.from} · from {formatINR(pkg.flightAddon)}/person
              </span>
            </span> */}
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 ${
                addFlight ? "border-brand bg-brand text-white" : "border-muted"
              }`}
            >
              {addFlight && <Check size={13} />}
            </span>
          </button>
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
