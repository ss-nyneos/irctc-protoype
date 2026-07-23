import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Calendar,
  Check,
  CreditCard,
  Download,
  MapPin,
  Minus,
  Moon,
  PartyPopper,
  Plus,
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
import { SelectMenu } from "@/components/common/SelectMenu";
import { occupancyRates, type OccupancyRates } from "@/utils/occupancy";

/** Mirrors irctctourism.com's own three steps. */
const steps = ["Basic detail", "Passenger detail", "Review"];

const berthPrefs = ["No preference", "Lower", "Middle", "Upper", "Side lower", "Side upper"];


/** The room combinations IRCTC sells, in its own order and wording. One room
 *  takes one of these; the fare is the sum of its occupants' rates. */
const accommodationTypes: Array<{
  id: string;
  label: string;
  adults: number;
  children: number;
  fare: (r: OccupancyRates) => number;
}> = [
    { id: "a1", label: "1 Adult", adults: 1, children: 0, fare: (r) => r.single },
    {
      id: "a1cb",
      label: "1 Adult + 1 Child with bed",
      adults: 1,
      children: 1,
      fare: (r) => r.single + r.childWithBed,
    },
    {
      id: "a1cn",
      label: "1 Adult + 1 child WithOut Extra Bed",
      adults: 1,
      children: 1,
      fare: (r) => r.single + r.childNoBed,
    },
    { id: "a2", label: "2 Adult", adults: 2, children: 0, fare: (r) => r.double * 2 },
    {
      id: "a2cb",
      label: "2 Adult + 1 Child with bed",
      adults: 2,
      children: 1,
      fare: (r) => r.double * 2 + r.childWithBed,
    },
    {
      id: "a2cn",
      label: "2 Adult + 1 Child without bed",
      adults: 2,
      children: 1,
      fare: (r) => r.double * 2 + r.childNoBed,
    },
    {
      id: "a2c2",
      label: "2 Adult + 2 child One WithOut Extra Bed & Other With Bed",
      adults: 2,
      children: 2,
      fare: (r) => r.double * 2 + r.childWithBed + r.childNoBed,
    },
    { id: "a3", label: "3 Adult", adults: 3, children: 0, fare: (r) => r.triple * 3 },
    {
      id: "a3cn",
      label: "3 Adult+1 child WithOut Extra Bed",
      adults: 3,
      children: 1,
      fare: (r) => r.triple * 3 + r.childNoBed,
    },
  ];

const indianStates = [
  "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR", "CHANDIGARH",
  "CHHATTISGARH", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "DELHI", "GOA", "GUJARAT", "HARYANA",
  "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA", "KERALA", "LADAKH", "LAKSHADWEEP",
  "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY",
  "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU", "TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND",
  "WEST BENGAL",
];

const countries = ["India", "Nepal", "Bhutan", "Bangladesh", "Sri Lanka", "Other"];

/**
 * IRCTC's own Id-Card list, in its order and wording. Each carries the rule its
 * number is checked against.
 *
 * Only the documents with a nationally fixed format are checked strictly (PAN,
 * Aadhaar, Voter, Passport). Driving licences and the two generic cards have no
 * single national format — a DL number is issued per state — so those are held
 * to a length and character check only. A rule that rejects a valid document is
 * worse than no rule.
 */
interface IdCardType {
  value: string;
  /** Shown under the number field before anything is typed. */
  hint: string;
  test: (normalised: string) => boolean;
  message: string;
}

const idCardTypes: IdCardType[] = [
  {
    value: "Driving License",
    hint: "As printed on the licence",
    // State-issued, no common national format — length and charset only.
    test: (v) => /^[A-Z0-9]{8,18}$/.test(v),
    message: "Enter the licence number as printed (8–18 letters or digits).",
  },
  {
    value: "Govt issued I-Card",
    hint: "As printed on the card",
    test: (v) => /^[A-Z0-9]{4,20}$/.test(v),
    message: "Enter the number as printed (4–20 letters or digits).",
  },
  {
    value: "Pan Card",
    hint: "10 characters, e.g. ABCDE1234F",
    // Five letters, four digits, one letter — fixed by the Income Tax Dept.
    test: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v),
    message: "A PAN is 5 letters, 4 digits and 1 letter — e.g. ABCDE1234F.",
  },
  {
    value: "Passport Number",
    hint: "8 characters, e.g. A1234567",
    // Indian passports: one letter followed by seven digits.
    test: (v) => /^[A-Z][0-9]{7}$/.test(v),
    message: "An Indian passport number is one letter followed by 7 digits.",
  },
  {
    value: "Student I-Card",
    hint: "As printed on the card",
    test: (v) => /^[A-Z0-9]{4,20}$/.test(v),
    message: "Enter the number as printed (4–20 letters or digits).",
  },
  {
    value: "UID/Aadhar Card",
    hint: "12 digits",
    // UIDAI issues 12 digits; spaces are stripped before this runs.
    test: (v) => /^[0-9]{12}$/.test(v),
    message: "An Aadhaar number is 12 digits.",
  },
  {
    value: "Voter I-Card",
    hint: "3 letters then 7 digits, e.g. ABC1234567",
    // EPIC: a three-letter state code followed by a seven-digit serial.
    test: (v) => /^[A-Z]{3}[0-9]{7}$/.test(v),
    message: "A Voter ID is 3 letters followed by 7 digits — e.g. ABC1234567.",
  },
];

/** Documents are quoted with spaces and hyphens; the rules above don't want them. */
const normaliseId = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

interface Passenger {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  berth: string;
  /** Children 5–11 are fared differently, so the slot remembers which it is. */
  child: boolean;
}

function blankPassenger(child: boolean): Passenger {
  return {
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    nationality: "Indian",
    passportNumber: "",
    passportExpiry: "",
    berth: "No preference",
    child,
  };
}

/** Full name for the summary rows, which read as one string. */
const paxName = (p: Passenger) => `${p.firstName} ${p.lastName}`.trim();

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
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-muted-foreground">
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
        className={`h-12 w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink outline-none transition focus:ring-2 ${error ? "border-destructive focus:ring-destructive/20" : "focus:border-brand focus:ring-brand/20"
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
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  icon?: typeof Calendar;
  error?: string;
  hint?: string;
}) {
  const id = `s-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label
        htmlFor={id}
        onClick={() => document.getElementById(id)?.focus()}
        className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground"
      >
        {Icon && <Icon size={13} className="text-muted-foreground" />}
        {label}
      </label>
      <SelectMenu
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        ariaLabel={label}
        invalid={Boolean(error)}
        describedBy={error || hint ? `${id}-help` : undefined}
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

export function BookingPage({
  id,
  classCode,
  departure,
  boarding,
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step, done]);

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
  // One entry per room, holding the id of the accommodation type chosen for it.
  // Starts empty — the traveller picks the occupancy before they can continue.
  const [rooms, setRooms] = useState<string[]>([""]);

  // ── Step 2: passengers ──────────────────────────────────────
  const [pax, setPax] = useState<Passenger[]>([blankPassenger(false)]);
  // Mandatory on IRCTC — the tour is sold with travel insurance attached.
  const [nominee, setNominee] = useState({ name: "", relation: "", contact: "" });
  const [gstChoice, setGstChoice] = useState("No");
  const [gstin, setGstin] = useState({ number: "", company: "" });
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    country: "India",
    nationality: "Indian",
    // Empty, like IRCTC's "Select" — the traveller has to choose.
    idType: "",
    idNumber: "",
  });
  const [touched, setTouched] = useState(false);

  // ── Step 3: review ──────────────────────────────────────────
  const [payOption, setPayOption] = useState<"full" | "part">("part");
  const [agreed, setAgreed] = useState(false);

  const cls = detail.classes.find((c) => c.code === selectedCode) ?? firstAvailable;
  const boardAt = detail.boarding.find((b) => b.code === boardingCode);
  const deboardAt = detail.boarding.find((b) => b.code === deboardingCode);

  // IRCTC's published sheet for the chosen category — Comfort and Superior are
  // priced separately, so switching category re-prices every room option.
  const rates = occupancyRates(cls.code);
  const chosen = rooms.map((id) => accommodationTypes.find((t) => t.id === id) ?? null);
  const roomsComplete = chosen.every(Boolean);

  const adults = chosen.reduce((n, t) => n + (t?.adults ?? 0), 0);
  const children = chosen.reduce((n, t) => n + (t?.children ?? 0), 0);
  const fare = chosen.reduce((sum, t) => sum + (t ? t.fare(rates) : 0), 0);
  const gst = Math.round(fare * 0.05);
  const total = fare + gst;
  const partAmount = Math.round(total * 0.25);
  const dueAmount = total - partAmount;
  const bookingRef = useMemo(() => "IRCTC" + Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const phoneValid = /^[6-9]\d{9}$/.test(contact.phone.trim());
  const pinValid = /^\d{6}$/.test(contact.pin.trim());
  const nomineePhoneValid = /^[6-9]\d{9}$/.test(nominee.contact.trim());
  const paxValid = pax.every(
    (p) => p.firstName.trim().length >= 2 && p.lastName.trim().length >= 1 && Number(p.age) > 0 && p.gender,
  );
  // Every field IRCTC stars is required here too.
  const nomineeValid = nominee.name.trim().length >= 2 && nominee.relation.trim().length >= 2 && nomineePhoneValid;

  /* The number is checked against whichever document was picked, so a PAN can't
     pass as an Aadhaar. Nothing is checked until a type is chosen — there'd be
     no rule to check it against. */
  const idCard = idCardTypes.find((t) => t.value === contact.idType) ?? null;
  const idNumberError = !idCard
    ? undefined
    : contact.idNumber.trim() === ""
      ? "Id-Card number is required."
      : idCard.test(normaliseId(contact.idNumber))
        ? undefined
        : idCard.message;
  const idValid = Boolean(idCard) && !idNumberError;

  const contactValid =
    emailValid &&
    phoneValid &&
    contact.address.trim().length >= 4 &&
    contact.city.trim().length >= 2 &&
    Boolean(contact.state) &&
    pinValid &&
    Boolean(contact.country) &&
    contact.nationality.trim().length >= 2 &&
    idValid;
  // GSTIN only has to hold up when the traveller says they want one.
  const gstValid = gstChoice === "No" || (gstin.number.trim().length === 15 && gstin.company.trim().length >= 2);
  const step2Valid = paxValid && nomineeValid && gstValid && contactValid;

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
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <button
            onClick={back}
            type="button"
            className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft size={15} /> Back to package
          </button>
          <ol className="flex items-center justify-center gap-2">
            {steps.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  aria-current={i === step ? "step" : undefined}
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-[13px] font-bold transition ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand text-white" : "bg-white/15 text-white/60"
                    }`}
                >
                  {i < step ? <Check size={15} /> : i + 1}
                </span>
                <span className={`hidden text-[13px] font-semibold sm:block ${i <= step ? "text-white" : "text-white/50"}`}>
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <span className={`h-0.5 w-12 rounded sm:w-24 lg:w-36 ${i < step ? "bg-emerald-500" : "bg-white/15"}`} />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <AccentBar />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)] lg:gap-10">
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
                  <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                    <Moon size={13} className="text-muted-foreground" /> Duration
                  </span>
                  {/* Read-only, as on IRCTC — it's a fact about the package, not a choice. */}
                  <div className="flex h-12 items-center rounded-xl bg-secondary/50 px-3.5 text-[15px] font-medium text-ink">
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
                    <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                      <MapPin size={13} className="text-muted-foreground" /> Departure city
                    </span>
                    {/* min-h, not h — a long boarding list wraps to several lines. */}
                    <div className="flex min-h-12 items-center rounded-xl bg-secondary/50 px-3.5 py-2.5 text-[15px] font-medium leading-relaxed text-ink">
                      {pkg.from} · flights booked on your selected date
                    </div>
                  </div>
                )}
              </div>

              {/* ── Categories ───────────────────────────────── */}
              <fieldset className="mt-7 border-t pt-6">
                <legend className="text-[14px] font-bold text-ink">Available categories</legend>
                <div className="mt-3 space-y-2">
                  {detail.classes.map((c) => {
                    const isSelected = c.code === selectedCode && c.available;
                    return (
                      <label
                        key={c.code}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 transition ${!c.available
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
                            <span className="text-[14px] font-medium text-ink">
                              {c.label} - {c.code}
                            </span>
                            {/* Never colour alone: the words carry the meaning too. */}
                            <span
                              className={`text-[12px] font-medium ${c.available ? "text-emerald-700" : "text-destructive"}`}
                            >
                              {c.available ? "Available" : "Not available"}
                            </span>
                          </span>
                        </span>
                        {/* No headline fare here, as on IRCTC. A category has no
                            single price — what it costs depends on how many
                            share the room, which the rates below spell out. The
                            per-person single rate stands in as the opening fare. */}
                        <span className="flex-none text-right">
                          <span className="block text-[11px] text-muted-foreground">starting from</span>
                          <span className="block text-[15px] font-semibold tabular-nums text-ink">
                            {formatINR(occupancyRates(c.code).single)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* ── Rates card, as IRCTC prints it: read-only reference for
                     the accommodation picker below. ─────────────────── */}
              <div className="mt-7 border-t pt-6">
                <h3 className="flex flex-wrap items-center gap-1.5 text-[14px] font-bold text-ink">
                  <BedDouble size={14} className="text-muted-foreground" /> Rooms / occupancy
                  <span className="text-[12px] font-normal text-muted-foreground">(rates are per person)</span>
                </h3>

                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl bg-secondary/40 p-3.5">
                    <div className="text-[13px] font-medium text-muted-foreground">Occupancy (adult)</div>
                    <dl className="mt-2 grid gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-3">
                      {[
                        ["Single", rates.single],
                        ["Double", rates.double],
                        ["Triple", rates.triple],
                      ].map(([k, v]) => (
                        <div key={k as string} className="flex justify-between gap-2 sm:justify-start">
                          <dt className="text-muted-foreground">{k}</dt>
                          <dd className="font-semibold tabular-nums text-ink">{formatINR(v as number)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="rounded-2xl bg-secondary/40 p-3.5">
                    <div className="text-[13px] font-medium text-muted-foreground">Child (5 - 11 yrs)</div>
                    <dl className="mt-2 grid gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-3">
                      {[
                        ["Child with bed", rates.childWithBed],
                        ["Child without bed", rates.childNoBed],
                      ].map(([k, v]) => (
                        <div key={k as string} className="flex justify-between gap-2 sm:justify-start">
                          <dt className="text-muted-foreground">{k}</dt>
                          <dd className="font-semibold tabular-nums text-ink">{formatINR(v as number)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>

              {/* ── Accommodation type, one dropdown per room ─────── */}
              <div className="mt-7 border-t pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[14px] font-bold text-ink">Select accommodation type</h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Remove a room"
                      onClick={() => setRooms((r) => (r.length > 1 ? r.slice(0, -1) : r))}
                      disabled={rooms.length <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-full border text-ink transition hover:bg-secondary disabled:opacity-30"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-14 text-center text-[13px] tabular-nums text-muted-foreground">
                      {rooms.length} room{rooms.length > 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      aria-label="Add a room"
                      onClick={() => setRooms((r) => (r.length < 6 ? [...r, ""] : r))}
                      disabled={rooms.length >= 6}
                      className="flex h-9 w-9 items-center justify-center rounded-full border text-ink transition hover:bg-secondary disabled:opacity-30"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {rooms.map((value, i) => (
                    <Select
                      key={i}
                      label={`Room ${i + 1}`}
                      value={value}
                      onChange={(v) => setRooms((r) => r.map((old, j) => (j === i ? v : old)))}
                      // The fare rides on its own line, so a long occupancy
                      // label doesn't have to compete with a number.
                      options={accommodationTypes.map((t) => ({
                        value: t.id,
                        label: t.label,
                        hint: formatINR(t.fare(rates)),
                      }))}
                    />
                  ))}
                </div>

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-[13px]">
                  {[
                    ["Total passenger", String(adults + children)],
                    ["Adult", String(adults)],
                    ["Child", String(children)],
                    ["Fare", formatINR(fare)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-semibold tabular-nums text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-3 text-[12px] text-muted-foreground">
                  Infants under 5 travel free and need no berth.
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

                      {/* Same fields IRCTC prints across its passenger table:
                          first/last name, age, gender, nationality, then the
                          passport pair. */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field
                          label="First Name*"
                          value={p.firstName}
                          onChange={(v) => updatePax(i, { firstName: v })}
                          placeholder="e.g. Rahul"
                          autoComplete={i === 0 ? "given-name" : "off"}
                          error={touched && p.firstName.trim().length < 2 ? "First name is required." : undefined}
                        />
                        <Field
                          label="Last Name*"
                          value={p.lastName}
                          onChange={(v) => updatePax(i, { lastName: v })}
                          placeholder="e.g. Sharma"
                          autoComplete={i === 0 ? "family-name" : "off"}
                          error={touched && p.lastName.trim().length < 1 ? "Last name is required." : undefined}
                        />
                        <Field
                          label="Age*"
                          value={p.age}
                          onChange={(v) => updatePax(i, { age: v.replace(/\D/g, "").slice(0, 3) })}
                          inputMode="numeric"
                          placeholder={p.child ? "5 - 11" : "12+"}
                          error={touched && !(Number(p.age) > 0) ? "Age is required." : undefined}
                        />
                        <Select
                          label="Gender*"
                          value={p.gender}
                          onChange={(v) => updatePax(i, { gender: v })}
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ]}
                          error={touched && !p.gender ? "Gender is required." : undefined}
                        />
                        <Field
                          label="Nationality"
                          value={p.nationality}
                          onChange={(v) => updatePax(i, { nationality: v })}
                          placeholder="Indian"
                        />
                        <Field
                          label="Passport Number"
                          value={p.passportNumber}
                          onChange={(v) => updatePax(i, { passportNumber: v.toUpperCase() })}
                          placeholder="If carrying one"
                        />
                        <Field
                          label="Passport Expiry Date"
                          type="date"
                          value={p.passportExpiry}
                          onChange={(v) => updatePax(i, { passportExpiry: v })}
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

              {/* Travel insurance rides with every IRCTC tour, so the nominee
                  is collected here and every field is mandatory. */}
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-display text-[18px] font-bold text-ink">Travel Insurance Nominee Details</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  The nominee on the policy issued against this booking.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Field
                    label="Nominee Name*"
                    value={nominee.name}
                    onChange={(v) => setNominee({ ...nominee, name: v })}
                    placeholder="As per ID"
                    error={touched && nominee.name.trim().length < 2 ? "Nominee name is required." : undefined}
                  />
                  <Field
                    label="Relation with Passenger*"
                    value={nominee.relation}
                    onChange={(v) => setNominee({ ...nominee, relation: v.toUpperCase() })}
                    placeholder="e.g. FATHER"
                    error={touched && nominee.relation.trim().length < 2 ? "Relation is required." : undefined}
                  />
                  <Field
                    label="Contact No*"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={nominee.contact}
                    onChange={(v) => setNominee({ ...nominee, contact: v.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="10-digit mobile"
                    error={touched && !nomineePhoneValid ? "Enter a 10-digit number starting 6–9." : undefined}
                  />
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-display text-[18px] font-bold text-ink">GST</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Claiming input credit against this booking?
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Select
                    label="GST*"
                    value={gstChoice}
                    onChange={setGstChoice}
                    options={[
                      { value: "No", label: "No" },
                      { value: "Yes", label: "Yes" },
                    ]}
                  />
                  {gstChoice === "Yes" && (
                    <>
                      <Field
                        label="GSTIN*"
                        value={gstin.number}
                        onChange={(v) => setGstin({ ...gstin, number: v.toUpperCase().slice(0, 15) })}
                        placeholder="15-character GSTIN"
                        error={touched && gstin.number.trim().length !== 15 ? "Enter the 15-character GSTIN." : undefined}
                      />
                      <Field
                        label="Company Name*"
                        value={gstin.company}
                        onChange={(v) => setGstin({ ...gstin, company: v })}
                        placeholder="Registered name"
                        error={touched && gstin.company.trim().length < 2 ? "Company name is required." : undefined}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-display text-[18px] font-bold text-ink">Contact Details</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Your voucher goes here, and the lead passenger&apos;s ID is checked on board.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Field
                    label="Mobile No.*"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={contact.phone}
                    onChange={(v) => setContact({ ...contact, phone: v.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="10-digit mobile"
                    error={touched && !phoneValid ? "Enter a 10-digit number starting 6–9." : undefined}
                  />
                  <Field
                    label="Email*"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={(v) => setContact({ ...contact, email: v })}
                    placeholder="you@email.com"
                    error={touched && !emailValid ? "Enter a valid email address." : undefined}
                  />
                  <Field
                    label="Address*"
                    value={contact.address}
                    onChange={(v) => setContact({ ...contact, address: v })}
                    autoComplete="street-address"
                    placeholder="House, street, area"
                    error={touched && contact.address.trim().length < 4 ? "Address is required." : undefined}
                  />
                  <Field
                    label="City*"
                    value={contact.city}
                    onChange={(v) => setContact({ ...contact, city: v })}
                    autoComplete="address-level2"
                    placeholder="City"
                    error={touched && contact.city.trim().length < 2 ? "City is required." : undefined}
                  />
                  <Select
                    label="State*"
                    value={contact.state}
                    onChange={(v) => setContact({ ...contact, state: v })}
                    options={indianStates.map((s) => ({ value: s, label: s }))}
                    error={touched && !contact.state ? "Select a state." : undefined}
                  />
                  <Field
                    label="Pin Code*"
                    value={contact.pin}
                    onChange={(v) => setContact({ ...contact, pin: v.replace(/\D/g, "").slice(0, 6) })}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    placeholder="6 digits"
                    error={touched && !pinValid ? "Enter a 6-digit PIN code." : undefined}
                  />
                  <Select
                    label="Country*"
                    value={contact.country}
                    onChange={(v) => setContact({ ...contact, country: v })}
                    options={countries.map((c) => ({ value: c, label: c }))}
                    error={touched && !contact.country ? "Select a country." : undefined}
                  />
                  <Field
                    label="Nationality*"
                    value={contact.nationality}
                    onChange={(v) => setContact({ ...contact, nationality: v })}
                    placeholder="Indian"
                    error={touched && contact.nationality.trim().length < 2 ? "Nationality is required." : undefined}
                  />
                  <Select
                    label="Id-Card Type*"
                    value={contact.idType}
                    onChange={(v) => setContact({ ...contact, idType: v })}
                    options={idCardTypes.map((t) => ({ value: t.value, label: t.value }))}
                    error={touched && !contact.idType ? "Choose the ID you will carry." : undefined}
                  />
                  <Field
                    label="Id-Card No*"
                    value={contact.idNumber}
                    onChange={(v) => setContact({ ...contact, idNumber: v.toUpperCase() })}
                    placeholder={idCard ? idCard.hint : "Choose a type first"}
                    // Held back until the field has been left alone once, so the
                    // rule doesn't fire on the first keystroke of a valid entry.
                    error={touched ? idNumberError : undefined}
                    hint={idCard && !idNumberError ? idCard.hint : undefined}
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
                      <span className="flex-1 text-[14px] font-semibold text-ink">{paxName(p)}</span>
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
                        className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border text-[13px] font-semibold transition ${i === 0 ? "border-brand bg-brand/5 text-brand" : "hover:border-brand/40"
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
                disabled={!roomsComplete}
                type="button"
                className="min-h-[48px] rounded-xl bg-brand px-7 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
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

          {step === 0 && !roomsComplete && (
            <p className="mt-3 text-right text-[13px] text-muted-foreground">
              Choose an accommodation type for every room to continue.
            </p>
          )}

          {step === 1 && touched && !step2Valid && (
            <p role="alert" className="mt-3 text-right text-[13px] font-semibold text-destructive">
              Please complete the highlighted fields.
            </p>
          )}
        </div>

        {/* ── Fare summary ─────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-48 md:h-52" />
            <div className="p-6">
              <div className="font-display text-[20px] font-bold leading-tight text-ink">{pkg.name}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
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

              <div className="my-5 border-t" />

              <dl className="space-y-2.5 text-[14px] tabular-nums">
                {/* One line per room, so the occupancy chosen above is what the
                    traveller sees priced here. */}
                {chosen.map((t, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <dt className="min-w-0 text-muted-foreground">
                      Room {i + 1} · {t ? t.label : "Not selected"}
                    </dt>
                    <dd className="font-semibold">{formatINR(t ? t.fare(rates) : 0)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">GST (5%)</dt>
                  <dd className="font-semibold">{formatINR(gst)}</dd>
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-2">
                  <dt className="font-bold text-ink">Total</dt>
                  <dd className="font-display text-[28px] font-bold text-ink">{formatINR(total)}</dd>
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
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/50 p-3 text-[13px] text-foreground/75">
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
      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${active ? "border-brand bg-brand/[0.04]" : "border-border hover:border-brand/40"
        }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${active ? "border-brand bg-brand text-white" : "border-muted"
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
