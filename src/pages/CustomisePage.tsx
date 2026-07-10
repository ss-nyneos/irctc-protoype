import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Bus,
  CalendarRange,
  Camera,
  Check,
  Hotel,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Sparkles,
  Users,
  Utensils,
  Wallet,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages } from "@/data/packages";
import type { BudgetBand, Experience, TourPackage, TravelMode } from "@/types";
import { formatINR } from "@/utils/format";
import { PackageCard } from "@/components/package/PackageCard";
import { DestinationMarquee } from "@/components/common/DestinationMarquee";

const ANY = "Anywhere";
const fromCities = [ANY, ...new Set(packages.map((p) => p.from))];
const toRegions = [ANY, ...new Set(packages.map((p) => p.region))];

type Stage = "form" | "loading" | "results";

type Accommodation = "Standard" | "Comfort" | "Luxury";
type CateringCost = "Low" | "Mid" | "High";

const ACCOMMODATIONS = ["Standard", "Comfort", "Luxury"] as const;
const TRANSPORTS = ["Bus", "Train", "Air", "Ferry"] as const;
const SIGHTSEEING = ["Nightlife", "Cultural", "Historical", "Nature", "Adventure", "Spiritual"] as const;
const CATERING_COSTS = ["Low", "Mid", "High"] as const;
const CATERING_TYPES = ["Traditional", "Continental", "Gourmet", "Regional"] as const;

/** How each user preference maps onto the fields the packages actually carry. */
const ACCOMMODATION_BANDS: Record<Accommodation, BudgetBand[]> = {
  Standard: ["Value", "Comfort"],
  Comfort: ["Comfort", "Premium"],
  Luxury: ["Premium", "Luxury"],
};

const TRANSPORT_MODES: Record<string, TravelMode[]> = {
  Bus: ["Rail + Road"],
  Train: ["Train", "Luxury Train"],
  Air: ["Air"],
  Ferry: [],
};

const SIGHTSEEING_EXP: Record<string, Experience[]> = {
  Nightlife: ["luxury"],
  Cultural: ["culture"],
  Historical: ["culture", "spiritual"],
  Nature: ["nature"],
  Adventure: ["adventure"],
  Spiritual: ["spiritual"],
};

const CATERING_BANDS: Record<CateringCost, BudgetBand[]> = {
  Low: ["Value", "Comfort"],
  Mid: ["Comfort", "Premium"],
  High: ["Premium", "Luxury"],
};

interface TripInputs {
  from: string;
  to: string;
  budget: number;
  travellers: number;
  travelDate: string;
  accommodation: Accommodation;
  transports: string[];
  sightseeing: string[];
  cateringCost: CateringCost;
  cateringTypes: string[];
}

const defaultInputs: TripInputs = {
  from: ANY,
  to: ANY,
  budget: 40000,
  travellers: 2,
  travelDate: "",
  accommodation: "Comfort",
  transports: ["Train"],
  sightseeing: ["Cultural"],
  cateringCost: "Mid",
  cateringTypes: ["Traditional"],
};

function scorePackage(pkg: TourPackage, t: TripInputs): number {
  let score = pkg.price <= t.budget ? 3 : -2;
  if (t.from !== ANY && pkg.from === t.from) score += 3;
  if (t.to !== ANY && pkg.region === t.to) score += 3;
  if (t.travellers >= 3 && pkg.experience.includes("family")) score += 2;
  if (t.travellers <= 2 && pkg.experience.includes("honeymoon")) score += 1;

  // Accommodation preference → budget band.
  if (ACCOMMODATION_BANDS[t.accommodation].includes(pkg.budgetBand)) score += 3;

  // Preferred transport modes → the package's travel mode.
  if (t.transports.some((tr) => TRANSPORT_MODES[tr]?.includes(pkg.travelMode))) score += 3;

  // Sightseeing interests → the package's experiences (each overlap counts).
  const wantedExp = t.sightseeing.flatMap((s) => SIGHTSEEING_EXP[s] ?? []);
  score += wantedExp.filter((e) => pkg.experience.includes(e)).length * 2;

  // Catering budget → budget band.
  if (CATERING_BANDS[t.cateringCost].includes(pkg.budgetBand)) score += 2;

  return score;
}

export function CustomisePage() {
  const { back } = useRouter();
  const ref = useReveal();
  const [inputs, setInputs] = useState<TripInputs>(defaultInputs);
  const [stage, setStage] = useState<Stage>("form");
  const [results, setResults] = useState<TourPackage[]>([]);

  const set = <K extends keyof TripInputs>(key: K, value: TripInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const toggleArr = (key: "transports" | "sightseeing" | "cateringTypes", value: string) =>
    setInputs((prev) => {
      const current = prev[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });

  const travelDateLabel = useMemo(() => {
    if (!inputs.travelDate) return "";
    return new Date(inputs.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }, [inputs.travelDate]);

  const findTours = () => {
    setStage("loading");
    const scored = packages
      .map((p) => ({ p, s: scorePackage(p, inputs) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((r) => r.p);

    setTimeout(() => {
      setResults(scored.length ? scored : packages.slice(0, 4));
      setStage("results");
    }, 1500);
  };

  const startOver = () => {
    setStage("form");
    setInputs(defaultInputs);
  };

  return (
    <div ref={ref} className="min-h-screen pb-20">
      <div className="relative overflow-hidden bg-white">
        {stage !== "results" && <DestinationMarquee className="pt-8" />}
        <div className={`relative mx-auto px-4 pb-8 pt-8 md:px-6 ${stage === "results" ? "max-w-7xl" : "max-w-5xl"}`}>
          <button onClick={back} type="button" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-ink">
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="heading-xl text-ink">Built around your trip</h1>
          {stage !== "results" && (
            <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
              Tell us where you&apos;re starting from, your budget, who&apos;s travelling and when — our AI will match
              the best tours, and you can book flights &amp; hotels straight through IRCTC.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {stage !== "results" && (
          <div className="reveal mx-auto -mt-6 max-w-5xl rounded-3xl border bg-white p-6 shadow-xl md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormRow icon={<MapPin size={16} />} title="Starting from">
                <select
                  value={inputs.from}
                  onChange={(e) => set("from", e.target.value)}
                  className="w-full rounded-xl border bg-white px-3.5 py-3 text-[14px] font-semibold text-ink outline-none focus:border-brand"
                >
                  {fromCities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </FormRow>
              <FormRow icon={<MapPin size={16} />} title="Travelling to">
                <select
                  value={inputs.to}
                  onChange={(e) => set("to", e.target.value)}
                  className="w-full rounded-xl border bg-white px-3.5 py-3 text-[14px] font-semibold text-ink outline-none focus:border-brand"
                >
                  {toRegions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </FormRow>
            </div>

            <FormRow icon={<Wallet size={16} />} title="Your budget (per person)">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Up to</span>
                <span className="font-display text-[24px] font-bold text-ink">
                  {formatINR(inputs.budget)}
                  {inputs.budget >= 100000 ? "+" : ""}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={100000}
                step={5000}
                value={inputs.budget}
                onChange={(e) => set("budget", Number(e.target.value))}
                className="mt-2 w-full accent-brand"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>₹10k</span>
                <span>₹1L+</span>
              </div>
            </FormRow>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormRow icon={<Users size={16} />} title="Family size">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => set("travellers", Math.max(1, inputs.travellers - 1))}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border text-[18px] font-bold text-ink hover:bg-secondary"
                  >
                    −
                  </button>
                  <span className="font-display text-[20px] font-bold text-ink">
                    {inputs.travellers} {inputs.travellers === 1 ? "traveller" : "travellers"}
                  </span>
                  <button
                    onClick={() => set("travellers", Math.min(10, inputs.travellers + 1))}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border text-[18px] font-bold text-ink hover:bg-secondary"
                  >
                    +
                  </button>
                </div>
              </FormRow>
              <FormRow icon={<CalendarRange size={16} />} title="Time of travel">
                <input
                  type="date"
                  value={inputs.travelDate}
                  onChange={(e) => set("travelDate", e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border bg-white px-3.5 py-3 text-[14px] font-semibold text-ink outline-none focus:border-brand"
                />
              </FormRow>
            </div>

            <FormRow icon={<Hotel size={16} />} title="Accommodation">
              <Segmented
                options={ACCOMMODATIONS}
                value={inputs.accommodation}
                onChange={(v) => set("accommodation", v)}
              />
            </FormRow>

            <FormRow icon={<Bus size={16} />} title="Travel & transport" hint="Select all you're open to">
              <Chips options={TRANSPORTS} value={inputs.transports} onToggle={(v) => toggleArr("transports", v)} />
            </FormRow>

            <FormRow icon={<Camera size={16} />} title="Sightseeing" hint="What do you want to experience?">
              <Chips options={SIGHTSEEING} value={inputs.sightseeing} onToggle={(v) => toggleArr("sightseeing", v)} />
            </FormRow>

            <FormRow icon={<Utensils size={16} />} title="Catering">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Budget</div>
                  <Segmented
                    options={CATERING_COSTS}
                    value={inputs.cateringCost}
                    onChange={(v) => set("cateringCost", v)}
                    renderLabel={(c) => `${c} cost`}
                  />
                </div>
                <div>
                  <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Cuisine style</div>
                  <Chips
                    options={CATERING_TYPES}
                    value={inputs.cateringTypes}
                    onToggle={(v) => toggleArr("cateringTypes", v)}
                  />
                </div>
              </div>
            </FormRow>

            <button
              onClick={findTours}
              disabled={stage === "loading"}
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-[16px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:opacity-70"
            >
              {stage === "loading" ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" /> Matching your trip…
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Get AI suggestions
                </>
              )}
            </button>
          </div>
        )}

        {stage === "results" && (
          <div className="reveal in">
            <div className="rounded-3xl border-2 border-brand/10 bg-white p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <div className="font-display text-[18px] font-semibold text-ink">
                      {results.length} tours matched your trip
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {inputs.from} → {inputs.to} · {formatINR(inputs.budget)}/person · {inputs.travellers}{" "}
                      {inputs.travellers === 1 ? "traveller" : "travellers"}
                      {travelDateLabel ? ` · ${travelDateLabel}` : ""}
                    </div>
                  </div>
                </div>
                <button
                  onClick={startOver}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-bold text-ink hover:bg-secondary"
                >
                  <RefreshCw size={14} /> Adjust preferences
                </button>
              </div>
              <MiniTrain
                cars={[
                  { icon: <Users size={14} />, caption: "Group", value: `${inputs.travellers} pax` },
                  { icon: <Hotel size={14} />, caption: "Stay", value: inputs.accommodation },
                  { icon: <Bus size={14} />, caption: "Travel", value: inputs.transports.join(" · ") || "Any" },
                  { icon: <Camera size={14} />, caption: "Sightsee", value: inputs.sightseeing.join(" · ") || "Any" },
                  { icon: <Wallet size={14} />, caption: "Catering", value: `${inputs.cateringCost} cost` },
                  { icon: <Utensils size={14} />, caption: "Cuisine", value: inputs.cateringTypes.join(" · ") || "Any" },
                ]}
              />
            </div>

            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">
              {results.map((pkg) => (
                <div key={pkg.id} className="reveal in relative flex flex-col">
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormRow({
  icon,
  title,
  hint,
  children,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b py-5 first:pt-0 last:border-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/5 text-brand">{icon}</span>
        <span className="text-[15px] font-bold text-ink">{title}</span>
        {hint && <span className="text-[12px] font-medium text-muted-foreground">· {hint}</span>}
      </div>
      {children}
    </div>
  );
}

interface TrainCar {
  icon: ReactNode;
  caption: string;
  value: string;
}

/** A small wheel used under the locomotive and carriages. */
function Wheel() {
  return <span className="h-2.5 w-2.5 rounded-full border-2 border-ink/45 bg-white" />;
}

/** Coupler link that connects two train units at chassis level. */
function Coupler() {
  return <span className="mb-[13px] h-1.5 w-2.5 shrink-0 rounded-full bg-ink/30" />;
}

/** The engine at the head of the preference train. */
function Locomotive() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[46px] items-center gap-1.5 rounded-l-2xl rounded-r-lg bg-brand px-3 pr-3.5 text-white shadow-md">
        {/* chimney + smoke */}
        <span className="absolute -top-2 left-2.5 h-2.5 w-2 rounded-t bg-brand" />
        <span className="absolute -top-3.5 left-1.5 h-1.5 w-1.5 rounded-full bg-brand/25" />
        <span className="absolute -top-5 left-3 h-2 w-2 rounded-full bg-brand/15" />
        <Sparkles size={15} className="text-white" />
        <div className="leading-none">
          <div className="text-[8px] font-semibold uppercase tracking-wide text-white/70">AI plan</div>
          <div className="mt-0.5 text-[12px] font-bold">Express</div>
        </div>
        {/* headlight */}
        <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
      </div>
      <div className="mt-[3px] flex gap-3 px-2.5">
        <Wheel />
        <Wheel />
      </div>
    </div>
  );
}

/** One carriage holding a single user preference. */
function Carriage({ icon, caption, value }: TrainCar) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[46px] min-w-[86px] flex-col justify-center rounded-lg border border-ink/10 bg-white px-3 shadow-sm">
        {/* windows */}
        <div className="mb-1 flex gap-1">
          <span className="h-1.5 w-3 rounded-sm bg-brand/25" />
          <span className="h-1.5 w-3 rounded-sm bg-brand/25" />
          <span className="h-1.5 w-3 rounded-sm bg-brand/25" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-brand">{icon}</span>
          <div className="leading-tight">
            <div className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{caption}</div>
            <div className="whitespace-nowrap text-[12px] font-bold text-ink">{value}</div>
          </div>
        </div>
      </div>
      <div className="mt-[3px] flex w-full justify-between px-3">
        <Wheel />
        <Wheel />
      </div>
    </div>
  );
}

/** Renders the user's step-by-step inputs as a little train — one carriage per step. */
function MiniTrain({ cars }: { cars: TrainCar[] }) {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        <Sparkles size={12} className="text-brand" /> Your preferences, all aboard
      </div>
      <div className="no-scrollbar overflow-x-auto pb-1">
        <div className="relative w-max pt-3">
          {/* track: rail line + sleepers */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[1px] h-[2px] rounded bg-ink/20" />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(50,50,50,0.16) 0 2px, transparent 2px 11px)",
            }}
          />
          <div className="relative flex items-end">
            <Locomotive />
            {cars.map((car) => (
              <div key={car.caption} className="flex items-end">
                <Coupler />
                <Carriage {...car} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Single-select segmented control (pick one). */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel?: (value: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`rounded-xl border px-4 py-2.5 text-[13px] font-bold transition ${
              active ? "border-brand bg-brand text-white shadow" : "bg-white text-ink hover:bg-secondary"
            }`}
          >
            {renderLabel ? renderLabel(option) : option}
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select chip group (pick any number). */
function Chips({
  options,
  value,
  onToggle,
}: {
  options: readonly string[];
  value: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${
              active ? "border-brand bg-brand/10 text-brand" : "bg-white text-ink hover:bg-secondary"
            }`}
          >
            {active && <Check size={13} />}
            {option}
          </button>
        );
      })}
    </div>
  );
}
