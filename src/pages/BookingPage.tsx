import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Calendar,
  Check,
  CreditCard,
  Download,
  MapPin,
  Moon,
  PartyPopper,
  Shield,
  Ticket,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages, getPackageById } from "@/data/packages";
import { getPackageDetail } from "@/data/packageDetail";
import { formatINR } from "@/utils/format";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { AccentBar } from "@/components/common/AccentBar";

/** Mirrors irctctourism.com's own three steps. */
const steps = ["Basic detail", "Passenger detail", "Review"];

const berthPrefs = ["No preference", "Lower", "Middle", "Upper", "Side lower", "Side upper"];
const idTypes = ["Aadhaar", "PAN", "Passport", "Voter ID", "Driving licence"];

interface Passenger {
  name: string;
  age: string;
  gender: string;
  berth: string;
  /** Children 5–11 are fared differently, so the slot remembers which it is. */
  child: boolean;
}

function blankPassenger(child: boolean): Passenger {
  return { name: "", age: "", gender: "", berth: "No preference", child };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  error,
  hint,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  error?: string;
  hint?: string;
  autoComplete?: string;
}) {
  const id = `f-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-help` : undefined}
        className={`h-12 w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink outline-none transition focus:ring-2 ${
          error ? "border-destructive focus:ring-destructive/20" : "focus:border-brand focus:ring-brand/20"
        }`}
      />
      {(error || hint) && (
        <p
          id={`${id}-help`}
          role={error ? "alert" : undefined}
          className={`mt-1.5 text-[12px] ${error ? "font-semibold text-destructive" : "text-muted-foreground"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  icon?: typeof Calendar;
}) {
  const id = `s-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        {Icon && <Icon size={13} className="text-muted-foreground" />}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full cursor-pointer rounded-xl border bg-white px-3 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function BookingPage({
  id,
  classCode,
  departure,
  boarding,
  travellers: initialPax,
}: {
  id: string;
  classCode?: string;
  departure?: string;
  boarding?: string;
  travellers?: number;
}) {
  const { back, go } = useRouter();
  const ref = useReveal();
  const pkg = getPackageById(id) ?? packages[0];
  const detail = useMemo(() => getPackageDetail(pkg), [pkg]);

  const firstAvailable = detail.classes.find((c) => c.available) ?? detail.classes[0];
  const hasBoarding = detail.boarding.length > 0;
  const isRail = pkg.travelMode !== "Air";

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // ── Step 1: basic detail ────────────────────────────────────
  const [startDate, setStartDate] = useState(departure ?? detail.departures[0]);
  const [boardingCode, setBoardingCode] = useState(boarding ?? detail.boarding[0]?.code ?? "");
  const [deboardingCode, setDeboardingCode] = useState(
    detail.boarding[detail.boarding.length - 1]?.code ?? "",
  );
  const [selectedCode, setSelectedCode] = useState(() => {
    const wanted = detail.classes.find((c) => c.code === classCode);
    return wanted?.available ? wanted.code : firstAvailable.code;
  });
  const [adults, setAdults] = useState(initialPax ?? 1);
  const [children, setChildren] = useState(0);

  // ── Step 2: passengers ──────────────────────────────────────
  const [pax, setPax] = useState<Passenger[]>([blankPassenger(false)]);
  const [contact, setContact] = useState({ email: "", phone: "", idType: idTypes[0], idNumber: "" });
  const [touched, setTouched] = useState(false);

  // ── Step 3: review ──────────────────────────────────────────
  const [payOption, setPayOption] = useState<"full" | "part">("part");
  const [agreed, setAgreed] = useState(false);

  const cls = detail.classes.find((c) => c.code === selectedCode) ?? firstAvailable;
  const boardAt = detail.boarding.find((b) => b.code === boardingCode);
  const deboardAt = detail.boarding.find((b) => b.code === deboardingCode);

  const fare = cls.price * adults + cls.childPrice * children;
  const gst = Math.round(fare * 0.05);
  const total = fare + gst;
  const partAmount = Math.round(total * 0.25);
  const dueAmount = total - partAmount;
  const bookingRef = useMemo(() => "IRCTC" + Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const phoneValid = /^[6-9]\d{9}$/.test(contact.phone.trim());
  const paxValid = pax.every((p) => p.name.trim().length >= 2 && Number(p.age) > 0 && p.gender);
  const step2Valid = paxValid && emailValid && phoneValid && contact.idNumber.trim().length >= 4;

  /** Resize the passenger list to match the pax counts chosen in step 1. */
  const goToPassengers = () => {
    const next: Passenger[] = [];
    for (let i = 0; i < adults; i++) next.push(pax[i]?.child === false ? pax[i] : blankPassenger(false));
    for (let i = 0; i < children; i++) {
      const existing = pax[adults + i];
      next.push(existing?.child ? existing : blankPassenger(true));
    }
    setPax(next);
    setStep(1);
  };

  const updatePax = (index: number, patch: Partial<Passenger>) =>
    setPax((list) => list.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  // ── Confirmation ────────────────────────────────────────────
  if (done) {
    return (
      <div ref={ref} className="min-h-screen pb-24">
        <div className="bg-navy py-14 text-center text-white">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
            <PartyPopper size={30} />
          </span>
          <h1 className="heading-xl mt-5 text-white">Your journey is booked</h1>
          <p className="mt-2 text-[15px] text-white/80">
            Booking reference <b className="tabular-nums text-white">{bookingRef}</b>
          </p>
        </div>
        <AccentBar />

        <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="font-display text-[18px] font-bold text-ink">{pkg.name}</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              {detail.code} · {cls.label} - {cls.code}
            </div>

            <dl className="mt-5 space-y-2.5 border-t pt-5 text-[14px]">
              {[
                ["Tour starting date", startDate],
                ...(hasBoarding && boardAt ? ([["Boarding", `${boardAt.station} (${boardAt.code})`]] as const) : []),
                ...(hasBoarding && deboardAt
                  ? ([["De-boarding", `${deboardAt.station} (${deboardAt.code})`]] as const)
                  : []),
                ["Duration", `${pkg.nights} Nights / ${pkg.days} Days`],
                ["Passengers", `${adults} adult${adults > 1 ? "s" : ""}${children ? `, ${children} child` : ""}`],
                ["Paid now", formatINR(payOption === "part" ? partAmount : total)],
                ...(payOption === "part" ? ([["Due before departure", formatINR(dueAmount)]] as const) : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 rounded-xl bg-secondary/50 p-3.5 text-[13px] leading-relaxed text-foreground/75">
              A confirmation voucher is on its way to {contact.email}. Carry the original {contact.idType} used at
              booking — a copy is not accepted on board.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-[15px] font-bold text-white transition hover:brightness-95"
              >
                <Download size={16} /> Download voucher
              </button>
              <button
                onClick={() => go({ name: "home" })}
                type="button"
                className="min-h-[48px] rounded-2xl border px-5 text-[15px] font-semibold text-ink transition hover:bg-secondary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="min-h-screen pb-24">
      {/* ── Stepper ──────────────────────────────────────────── */}
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
          <button
            onClick={back}
            type="button"
            className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft size={15} /> Back to package
          </button>
          <ol className="flex items-center gap-2">
            {steps.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  aria-current={i === step ? "step" : undefined}
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-[13px] font-bold transition ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand text-white" : "bg-white/15 text-white/60"
                  }`}
                >
                  {i < step ? <Check size={15} /> : i + 1}
                </span>
                <span className={`hidden text-[13px] font-semibold sm:block ${i <= step ? "text-white" : "text-white/50"}`}>
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <span className={`h-0.5 flex-1 rounded ${i < step ? "bg-emerald-500" : "bg-white/15"}`} />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <AccentBar />

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          {/* ── Step 1 — Basic detail ──────────────────────────── */}
          {step === 0 && (
            <div className="reveal rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="font-display text-[20px] font-bold text-ink">Package booking</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Confirm when you travel, where you join the tour, and who&apos;s coming.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Tour starting date"
                  value={startDate}
                  onChange={setStartDate}
                  icon={Calendar}
                  options={detail.departures.map((d) => ({ value: d, label: d }))}
                />

                <div>
                  <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    <Moon size={13} className="text-muted-foreground" /> Duration
                  </span>
                  {/* Read-only, as on IRCTC — it's a fact about the package, not a choice. */}
                  <div className="flex h-12 items-center rounded-xl bg-secondary/50 px-3.5 text-[15px] font-semibold text-ink">
                    {pkg.nights} Nights / {pkg.days} Days
                  </div>
                </div>

                {hasBoarding ? (
                  <>
                    <Select
                      label="Boarding station"
                      value={boardingCode}
                      onChange={setBoardingCode}
                      icon={MapPin}
                      options={detail.boarding.map((b) => ({
                        value: b.code,
                        label: `${b.station} (${b.code})${b.dep ? ` · dep ${b.dep}` : ""}`,
                      }))}
                    />
                    <Select
                      label="De-boarding station"
                      value={deboardingCode}
                      onChange={setDeboardingCode}
                      icon={MapPin}
                      options={detail.boarding.map((b) => ({
                        value: b.code,
                        label: `${b.station} (${b.code})${b.arr ? ` · arr ${b.arr}` : ""}`,
                      }))}
                    />
                  </>
                ) : (
                  <div className="sm:col-span-2">
                    <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      <MapPin size={13} className="text-muted-foreground" /> Departure city
                    </span>
                    <div className="flex h-12 items-center rounded-xl bg-secondary/50 px-3.5 text-[15px] font-semibold text-ink">
                      {pkg.from} · flights booked on your selected date
                    </div>
                  </div>
                )}
              </div>

              {/* ── Categories ───────────────────────────────── */}
              <fieldset className="mt-7 border-t pt-6">
                <legend className="text-[13px] font-semibold text-ink">Available categories</legend>
                <div className="mt-3 space-y-2">
                  {detail.classes.map((c) => {
                    const isSelected = c.code === selectedCode && c.available;
                    return (
                      <label
                        key={c.code}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 transition ${
                          !c.available
                            ? "cursor-not-allowed border-border bg-secondary/30 opacity-60"
                            : isSelected
                              ? "cursor-pointer border-brand bg-brand/[0.04]"
                              : "cursor-pointer border-border hover:border-brand/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={c.code}
                          checked={isSelected}
                          disabled={!c.available}
                          onChange={() => setSelectedCode(c.code)}
                          className="h-4 w-4 flex-none accent-brand"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-[14px] font-bold text-ink">
                              {c.label} - {c.code}
                            </span>
                            {/* Never colour alone: the words carry the meaning too. */}
                            <span
                              className={`text-[12px] font-bold ${c.available ? "text-emerald-700" : "text-destructive"}`}
                            >
                              {c.available ? "Available" : "Not available"}
                            </span>
                          </span>
                          <span className="block text-[12px] text-muted-foreground">{c.detail}</span>
                        </span>
                        <span className="flex-none text-right font-display text-[15px] font-bold tabular-nums text-ink">
                          {formatINR(c.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* ── Occupancy ────────────────────────────────── */}
              <div className="mt-7 border-t pt-6">
                <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <BedDouble size={14} className="text-muted-foreground" /> Rooms / occupancy
                  <span className="font-medium text-muted-foreground">(rates are per person)</span>
                </h3>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/40 p-3.5">
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-ink">Occupancy (adult)</div>
                      <div className="text-[12px] text-muted-foreground">12 years and over · twin sharing</div>
                    </div>
                    <div className="flex flex-none items-center gap-3">
                      <span className="w-20 text-right font-display text-[15px] font-bold tabular-nums text-ink">
                        {formatINR(cls.price)}
                      </span>
                      <Stepper value={adults} min={1} max={12} onChange={setAdults} label="adults" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/40 p-3.5">
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-ink">Child (5 - 11 yrs)</div>
                      <div className="text-[12px] text-muted-foreground">Shares a berth with an adult</div>
                    </div>
                    <div className="flex flex-none items-center gap-3">
                      <span className="w-20 text-right font-display text-[15px] font-bold tabular-nums text-ink">
                        {formatINR(cls.childPrice)}
                      </span>
                      <Stepper value={children} min={0} max={8} onChange={setChildren} label="children" />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[12px] text-muted-foreground">
                  No. of pax: <b className="tabular-nums text-ink">{adults + children}</b>. Infants under 5 travel free
                  and need no berth.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2 — Passenger detail ──────────────────────── */}
          {step === 1 && (
            <div className="reveal space-y-4">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-display text-[20px] font-bold text-ink">Passenger detail</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Names must match the ID each passenger will carry on board.
                </p>

                <div className="mt-5 space-y-5">
                  {pax.map((p, i) => (
                    <div key={i} className="rounded-2xl border p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-[14px] font-bold text-ink">
                          {p.child ? "Child" : "Adult"} {i + 1}
                        </span>
                        {i === 0 && (
                          <span className="rounded bg-secondary px-2 py-0.5 text-[11px] font-bold text-navy">
                            Lead passenger
                          </span>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field
                            label="Full name (as per ID)"
                            value={p.name}
                            onChange={(v) => updatePax(i, { name: v })}
                            placeholder="e.g. Rahul Sharma"
                            autoComplete={i === 0 ? "name" : "off"}
                            error={touched && p.name.trim().length < 2 ? "Enter the name as printed on the ID." : undefined}
                          />
                        </div>
                        <Field
                          label="Age"
                          value={p.age}
                          onChange={(v) => updatePax(i, { age: v.replace(/\D/g, "").slice(0, 3) })}
                          inputMode="numeric"
                          placeholder={p.child ? "5 - 11" : "12+"}
                          error={touched && !(Number(p.age) > 0) ? "Age is required." : undefined}
                        />
                        <Select
                          label="Gender"
                          value={p.gender}
                          onChange={(v) => updatePax(i, { gender: v })}
                          options={[
                            { value: "", label: "Select" },
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ]}
                        />
                        {isRail && (
                          <div className="sm:col-span-2">
                            <Select
                              label="Berth preference"
                              value={p.berth}
                              onChange={(v) => updatePax(i, { berth: v })}
                              options={berthPrefs.map((b) => ({ value: b, label: b }))}
                            />
                            <p className="mt-1.5 text-[12px] text-muted-foreground">
                              A preference, not a guarantee — berths are allotted by the chart.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-display text-[18px] font-bold text-ink">Contact &amp; ID</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Your voucher goes here, and the lead passenger&apos;s ID is checked on board.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Email address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={(v) => setContact({ ...contact, email: v })}
                    placeholder="you@email.com"
                    error={touched && !emailValid ? "Enter a valid email address." : undefined}
                  />
                  <Field
                    label="Mobile number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={contact.phone}
                    onChange={(v) => setContact({ ...contact, phone: v.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="10-digit mobile"
                    error={touched && !phoneValid ? "Enter a 10-digit number starting 6–9." : undefined}
                  />
                  <Select
                    label="ID proof type"
                    value={contact.idType}
                    onChange={(v) => setContact({ ...contact, idType: v })}
                    options={idTypes.map((t) => ({ value: t, label: t }))}
                  />
                  <Field
                    label="ID number"
                    value={contact.idNumber}
                    onChange={(v) => setContact({ ...contact, idNumber: v.toUpperCase() })}
                    placeholder="As on the document"
                    error={touched && contact.idNumber.trim().length < 4 ? "ID number is required." : undefined}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 — Review ────────────────────────────────── */}
          {step === 2 && (
            <div className="reveal space-y-4">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-display text-[20px] font-bold text-ink">Review your booking</h2>

                <dl className="mt-4 space-y-2.5 text-[14px]">
                  {[
                    ["Package", `${pkg.name} (${detail.code})`],
                    ["Category", `${cls.label} - ${cls.code}`],
                    ["Tour starting date", startDate],
                    ...(hasBoarding && boardAt
                      ? ([["Boarding", `${boardAt.station} (${boardAt.code})${boardAt.dep ? ` · dep ${boardAt.dep}` : ""}`]] as const)
                      : []),
                    ...(hasBoarding && deboardAt
                      ? ([["De-boarding", `${deboardAt.station} (${deboardAt.code})`]] as const)
                      : []),
                    ["Duration", `${pkg.nights} Nights / ${pkg.days} Days`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b pb-2.5 last:border-b-0">
                      <dt className="flex-none text-muted-foreground">{k}</dt>
                      <dd className="text-right font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <h3 className="mt-6 text-[13px] font-bold uppercase tracking-wide text-muted-foreground">
                  Passengers ({pax.length})
                </h3>
                <ul className="mt-2.5 space-y-2">
                  {pax.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
                      <User size={15} className="flex-none text-muted-foreground" />
                      <span className="flex-1 text-[14px] font-semibold text-ink">{p.name}</span>
                      <span className="text-[13px] tabular-nums text-muted-foreground">
                        {p.age} yrs · {p.gender}
                        {isRail && p.berth !== "No preference" ? ` · ${p.berth}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setStep(1)}
                  type="button"
                  className="mt-3 min-h-[44px] text-[13px] font-semibold text-brand hover:underline"
                >
                  Edit passenger detail
                </button>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink">
                  <Wallet size={18} /> Payment option
                </h2>
                <div className="mt-4 space-y-3">
                  <PayOption
                    active={payOption === "part"}
                    onClick={() => setPayOption("part")}
                    title="Part payment · 25% now"
                    sub={`Pay ${formatINR(partAmount)} today, ${formatINR(dueAmount)} up to 30 days before departure`}
                    tag="Popular"
                  />
                  <PayOption
                    active={payOption === "full"}
                    onClick={() => setPayOption("full")}
                    title="Pay in full"
                    sub={`Pay ${formatINR(total)} now and lock your booking instantly`}
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-2 text-[13px] font-semibold text-ink">Payment method</div>
                  <div className="grid grid-cols-3 gap-2">
                    {["UPI", "Card", "Net Banking"].map((m, i) => (
                      <button
                        key={m}
                        type="button"
                        className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border text-[13px] font-semibold transition ${
                          i === 0 ? "border-brand bg-brand/5 text-brand" : "hover:border-brand/40"
                        }`}
                      >
                        <CreditCard size={14} /> {m}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-secondary/40 p-3.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-none accent-brand"
                  />
                  <span className="text-[13px] leading-relaxed text-foreground/75">
                    I have read the cancellation and refund policy, and confirm each passenger will carry the original{" "}
                    {contact.idType} used at booking.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border bg-white p-4 text-[13px] text-foreground/70 shadow-sm">
                <Shield size={18} className="flex-none text-emerald-600" />
                Payments run through IRCTC&apos;s secure government gateway. No card details are stored.
              </div>
            </div>
          )}

          {/* ── Step controls ──────────────────────────────────── */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => (step === 0 ? back() : setStep(step - 1))}
              type="button"
              className="min-h-[48px] rounded-xl border bg-white px-5 text-[14px] font-bold text-ink transition hover:bg-secondary"
            >
              {step === 0 ? "Cancel" : "Back"}
            </button>

            {step === 0 && (
              <button
                onClick={goToPassengers}
                type="button"
                className="min-h-[48px] rounded-xl bg-brand px-7 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95"
              >
                Continue
              </button>
            )}
            {step === 1 && (
              <button
                onClick={() => {
                  setTouched(true);
                  if (step2Valid) setStep(2);
                }}
                type="button"
                className="min-h-[48px] rounded-xl bg-brand px-7 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95"
              >
                Continue to review
              </button>
            )}
            {step === 2 && (
              <button
                onClick={() => setDone(true)}
                disabled={!agreed}
                type="button"
                className="min-h-[48px] rounded-xl bg-brand px-7 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Pay {formatINR(payOption === "part" ? partAmount : total)}
              </button>
            )}
          </div>

          {step === 1 && touched && !step2Valid && (
            <p role="alert" className="mt-3 text-right text-[13px] font-semibold text-destructive">
              Please complete the highlighted fields.
            </p>
          )}
        </div>

        {/* ── Fare summary ─────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-32" />
            <div className="p-5">
              <div className="font-display text-[16px] font-semibold leading-tight text-ink">{pkg.name}</div>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Ticket size={12} /> {detail.code}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Moon size={12} /> {pkg.nights}N/{pkg.days}D
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={12} /> {adults + children} pax
                </span>
              </div>

              <div className="my-4 border-t" />

              <dl className="space-y-1.5 text-[13px] tabular-nums">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">
                    {cls.label} - {cls.code} × {adults}
                  </dt>
                  <dd className="font-semibold">{formatINR(cls.price * adults)}</dd>
                </div>
                {children > 0 && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Child (5-11) × {children}</dt>
                    <dd className="font-semibold">{formatINR(cls.childPrice * children)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">GST (5%)</dt>
                  <dd className="font-semibold">{formatINR(gst)}</dd>
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-2">
                  <dt className="font-bold text-ink">Total</dt>
                  <dd className="font-display text-[22px] font-bold text-ink">{formatINR(total)}</dd>
                </div>
              </dl>

              {step === 2 && payOption === "part" && (
                <div className="mt-3 rounded-xl bg-brand/10 p-2.5 text-[12px] tabular-nums text-brand">
                  <div className="flex justify-between font-bold">
                    <span>Pay now (25%)</span>
                    <span>{formatINR(partAmount)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/60">
                    <span>Due before departure</span>
                    <span>{formatINR(dueAmount)}</span>
                  </div>
                </div>
              )}

              {startDate && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/50 p-2.5 text-[12px] text-foreground/75">
                  <Calendar size={13} className="flex-none text-brand" />
                  Departs {startDate}
                  {boardAt ? ` from ${boardAt.station}` : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small +/− counter. Touch targets stay at 44px even though the chrome is small. */
function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="flex flex-none items-center gap-1">
      <button
        type="button"
        aria-label={`One fewer ${label}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white text-ink transition hover:bg-secondary disabled:opacity-30"
      >
        −
      </button>
      <span className="w-6 text-center font-bold tabular-nums text-ink">{value}</span>
      <button
        type="button"
        aria-label={`One more ${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white text-ink transition hover:bg-secondary disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

function PayOption({
  active,
  onClick,
  title,
  sub,
  tag,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  tag?: string;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-pressed={active}
      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
        active ? "border-brand bg-brand/[0.04]" : "border-border hover:border-brand/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${
          active ? "border-brand bg-brand text-white" : "border-muted"
        }`}
      >
        {active && <Check size={11} />}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[14px] font-bold text-ink">
          {title}
          {tag && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">{tag}</span>}
        </span>
        <span className="block text-[12px] text-muted-foreground">{sub}</span>
      </span>
    </button>
  );
}
