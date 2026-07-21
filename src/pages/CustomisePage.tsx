import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bird,
  Bus,
  CalendarDays,
  Camera,
  Car,
  Castle,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crown,
  Footprints,
  Heart,
  History,
  Home,
  Landmark,
  Leaf,
  MapPin,
  Moon,
  Mountain,
  PartyPopper,
  Palmtree,
  Plane,
  RefreshCw,
  Search,
  Ship,
  ShoppingBag,
  Snowflake,
  Sofa,
  Sparkles,
  Sun,
  TrainFront,
  Users,
  Utensils,
  Waves,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages } from "@/data/packages";
import type { BudgetBand, Experience, TourPackage, TravelMode } from "@/types";
import { EditorialPackageCard } from "@/components/package/EditorialPackageCard";
import bgVideo from "@/assets/customise/25d82214-bbf9-4ec0-bfdd-deed85a779f5.mov";
import imgFrom from "@/assets/customise/from.jpg";
import imgVibes from "@/assets/customise/destination.jpeg";
import imgTravellers from "@/assets/customise/travellers.webp";
import imgDate from "@/assets/customise/date.jpg";
import imgStay from "@/assets/customise/stay.jpg";
import imgTransport from "@/assets/customise/transport.webp";
import imgExperience from "@/assets/customise/experience.jpg";
import imgFood from "@/assets/customise/food.avif";
import imgNotes from "@/assets/customise/budget.webp";
// "Where do you want to go?" vibe artwork
import imgHills from "@/assets/customise/hills.png";
import imgBeaches from "@/assets/customise/beaches.webp";
import imgHeritage from "@/assets/customise/heritage.png";
import imgDesert from "@/assets/customise/deser.png";
import imgFestival from "@/assets/customise/festival.png";
// No dedicated Pilgrimage / Wildlife art yet — reuse fitting repo photos as stand-ins.
// Drop pilgrimage.* / wildlife.* into assets/customise and swap these two imports.
import imgPilgrimage from "@/assets/cta/varanasi1.jpg";
import imgWildlife from "@/assets/hero/kerala-tea-gardens.jpg";

const fromCities = [...new Set(packages.map((p) => p.from))];
const POPULAR_CITIES = ["New Delhi", "Mumbai", "Bengaluru", "Ahmedabad", "Kolkata", "Chennai"];

/** Where the flow currently is:
 *  intro        — the backdrop video plays solo for a beat before questions appear
 *  questions    — one wide card on screen, answered via the Continue button
 *  interstitial — the Vande Bharat loader, shown after every GROUP_SIZE questions
 *  matching     — the final "shortlisting packages" loader before results
 *  results      — the matched package grid
 */
type Phase = "intro" | "questions" | "interstitial" | "matching" | "results";

type Accommodation = "Standard" | "Comfort" | "Luxury" | "Homestays" | "Resorts" | "Heritage";
type CateringCost = "Low" | "Mid" | "High";
type Duration = "2-3 Days" | "4-6 Days" | "7-9 Days" | "10+ Days";
type GroupType = "Solo" | "Couple" | "Family" | "Friends" | "Senior citizens";

interface Option {
  key: string;
  icon: ReactNode;
  desc?: string;
}

interface VibeOption {
  key: string;
  icon: ReactNode;
  desc: string;
  image: string;
}

interface PillOption {
  key: string;
  label?: string;
  icon?: ReactNode;
}

const VIBES: VibeOption[] = [
  { key: "Hills", icon: <Mountain size={16} />, desc: "Cool weather & mountain vibes", image: imgHills },
  { key: "Beaches", icon: <Waves size={16} />, desc: "Sun, sand & sea breeze", image: imgBeaches },
  { key: "Pilgrimage", icon: <Landmark size={16} />, desc: "Sacred places & spiritual journeys", image: imgPilgrimage },
  { key: "Heritage", icon: <Castle size={16} />, desc: "History & royal experiences", image: imgHeritage },
  { key: "Wildlife", icon: <Bird size={16} />, desc: "Safaris & nature adventures", image: imgWildlife },
  { key: "Desert", icon: <Sun size={16} />, desc: "Sand dunes & unique culture", image: imgDesert },
  { key: "Festivals", icon: <PartyPopper size={16} />, desc: "Local culture & festive vibes", image: imgFestival },
];

const GROUP_TYPES: PillOption[] = [
  { key: "Solo", icon: <Compass size={14} /> },
  { key: "Couple", icon: <Heart size={14} /> },
  { key: "Family", icon: <Home size={14} /> },
  { key: "Friends", icon: <Users size={14} /> },
  { key: "Senior citizens", icon: <Leaf size={14} /> },
];

const DURATIONS: Duration[] = ["2-3 Days", "4-6 Days", "7-9 Days", "10+ Days"];

const STAYS: Option[] = [
  { key: "Standard", icon: <BedDouble size={20} />, desc: "Comfortable and clean stays" },
  { key: "Comfort", icon: <Sofa size={20} />, desc: "Better amenities & convenience" },
  { key: "Luxury", icon: <Crown size={20} />, desc: "Premium stays & experiences" },
  { key: "Homestays", icon: <Home size={20} />, desc: "Local vibes & authentic stays" },
  { key: "Resorts", icon: <Palmtree size={20} />, desc: "Nature stays & relaxation" },
  { key: "Heritage", icon: <Castle size={20} />, desc: "Royal & heritage experiences" },
];

const TRANSPORTS: Option[] = [
  { key: "Train", icon: <TrainFront size={20} />, desc: "Scenic & comfortable" },
  { key: "Air", icon: <Plane size={20} />, desc: "Fast & convenient" },
  { key: "Bus", icon: <Bus size={20} />, desc: "Budget friendly & flexible" },
  { key: "Ferry", icon: <Ship size={20} />, desc: "Scenic water routes" },
  { key: "Road Trip", icon: <Car size={20} />, desc: "Freedom to explore" },
  { key: "Helicopter", icon: <Compass size={20} />, desc: "Quick & scenic rides" },
];

const EXPERIENCES: PillOption[] = [
  { key: "Adventure", icon: <Compass size={13} /> },
  { key: "Trekking", icon: <Footprints size={13} /> },
  { key: "Photography", icon: <Camera size={13} /> },
  { key: "Temple visits", icon: <Landmark size={13} /> },
  { key: "Wildlife", icon: <Bird size={13} /> },
  { key: "Waterfalls", icon: <Waves size={13} /> },
  { key: "Local food", icon: <Utensils size={13} /> },
  { key: "Shopping", icon: <ShoppingBag size={13} /> },
  { key: "History", icon: <History size={13} /> },
  { key: "Nightlife", icon: <Moon size={13} /> },
  { key: "Wellness", icon: <Leaf size={13} /> },
  { key: "Snow", icon: <Snowflake size={13} /> },
  { key: "Culture", icon: <Landmark size={13} /> },
  { key: "Tea gardens", icon: <Leaf size={13} /> },
  { key: "Beaches", icon: <Waves size={13} /> },
];

const CATERING_COSTS: { value: CateringCost; label: string }[] = [
  { value: "Low", label: "Low cost" },
  { value: "Mid", label: "Mid cost" },
  { value: "High", label: "High cost" },
];
const CATERING_TYPES = ["Traditional", "Continental", "Gourmet", "Regional"] as const;
const NOTES_TAGS = ["No spicy food", "Quiet places", "Accessible stays", "Extra comfort"];

/** How each preference maps onto the fields the packages actually carry. */
const VIBE_EXP: Record<string, Experience[]> = {
  Hills: ["nature"],
  Beaches: ["nature", "luxury"],
  Pilgrimage: ["spiritual"],
  Heritage: ["culture"],
  Wildlife: ["nature", "adventure"],
  Desert: ["culture", "adventure"],
  Festivals: ["culture"],
};
const VIBE_REGION: Record<string, string[]> = {
  Hills: ["Uttarakhand", "Jammu & Kashmir", "North East"],
  Beaches: ["Kerala", "Karnataka & Goa", "Andaman Islands"],
  Pilgrimage: ["Uttarakhand", "South India"],
  Heritage: ["Rajasthan", "Rajasthan Circuit"],
  Wildlife: ["North East", "South India"],
  Desert: ["Rajasthan", "Rajasthan Circuit"],
  Festivals: ["Rajasthan", "Maharashtra & Gujarat"],
};
const GROUP_EXP: Record<GroupType, Experience[]> = {
  Solo: ["adventure", "spiritual"],
  Couple: ["honeymoon", "luxury"],
  Family: ["family"],
  Friends: ["adventure", "nature"],
  "Senior citizens": ["spiritual", "culture"],
};
const ACCOMMODATION_BANDS: Record<Accommodation, BudgetBand[]> = {
  Standard: ["Value", "Comfort"],
  Comfort: ["Comfort", "Premium"],
  Luxury: ["Premium", "Luxury"],
  Homestays: ["Value", "Comfort"],
  Resorts: ["Premium", "Luxury"],
  Heritage: ["Premium", "Luxury"],
};
const ACCOMMODATION_MAXPRICE: Record<Accommodation, number> = {
  Standard: 45000,
  Homestays: 45000,
  Comfort: 75000,
  Resorts: 115000,
  Luxury: 150000,
  Heritage: 130000,
};
const TRANSPORT_MODES: Record<string, TravelMode[]> = {
  Train: ["Train", "Luxury Train"],
  Air: ["Air"],
  Bus: ["Rail + Road"],
  Ferry: [],
  "Road Trip": ["Rail + Road"],
  Helicopter: ["Air"],
};
const EXPERIENCE_EXP: Record<string, Experience[]> = {
  Adventure: ["adventure"],
  Trekking: ["adventure", "nature"],
  Photography: ["nature", "culture"],
  "Temple visits": ["spiritual"],
  Wildlife: ["nature"],
  Waterfalls: ["nature"],
  "Local food": ["culture"],
  Shopping: ["luxury"],
  History: ["culture"],
  Nightlife: ["luxury"],
  Wellness: ["luxury", "spiritual"],
  Snow: ["nature", "adventure"],
  Culture: ["culture"],
  "Tea gardens": ["nature"],
  Beaches: ["nature"],
};
const CATERING_BANDS: Record<CateringCost, BudgetBand[]> = {
  Low: ["Value", "Comfort"],
  Mid: ["Comfort", "Premium"],
  High: ["Premium", "Luxury"],
};

interface TripInputs {
  from: string;
  vibes: string[];
  travellers: number;
  groupType: GroupType;
  travelStart: string;
  travelEnd: string;
  duration: Duration;
  accommodation: Accommodation;
  transports: string[];
  experiences: string[];
  cateringCost: CateringCost;
  cateringTypes: string[];
  notes: string;
}

const defaultInputs: TripInputs = {
  from: "",
  vibes: ["Hills"],
  travellers: 2,
  groupType: "Couple",
  travelStart: "",
  travelEnd: "",
  duration: "7-9 Days",
  accommodation: "Standard",
  transports: ["Train"],
  experiences: ["Adventure"],
  cateringCost: "Mid",
  cateringTypes: ["Traditional"],
  notes: "",
};

function scorePackage(pkg: TourPackage, t: TripInputs): number {
  let score = pkg.price <= ACCOMMODATION_MAXPRICE[t.accommodation] ? 3 : -2;
  if (t.from && pkg.from === t.from) score += 3;

  // Destination vibes → region affinity and matching experiences.
  const vibeRegions = t.vibes.flatMap((v) => VIBE_REGION[v] ?? []);
  if (vibeRegions.includes(pkg.region)) score += 3;
  const vibeExp = t.vibes.flatMap((v) => VIBE_EXP[v] ?? []);
  score += vibeExp.filter((e) => pkg.experience.includes(e)).length * 2;

  // Who's travelling → the experience the package leans into.
  if (GROUP_EXP[t.groupType].some((e) => pkg.experience.includes(e))) score += 2;

  // Stay preference → budget band.
  if (ACCOMMODATION_BANDS[t.accommodation].includes(pkg.budgetBand)) score += 3;

  // Preferred travel modes → the package's travel mode.
  if (t.transports.some((tr) => TRANSPORT_MODES[tr]?.includes(pkg.travelMode))) score += 3;

  // Experiences → the package's experiences (each overlap counts).
  const wantedExp = t.experiences.flatMap((s) => EXPERIENCE_EXP[s] ?? []);
  score += wantedExp.filter((e) => pkg.experience.includes(e)).length * 2;

  // Catering budget → budget band.
  if (CATERING_BANDS[t.cateringCost].includes(pkg.budgetBand)) score += 2;

  return score;
}

interface Question {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  insight: (t: TripInputs) => string;
  control: ReactNode;
}

/** Card exit duration — must stay in sync with `q-exit-*` in index.css. */
const CARD_EXIT_MS = 200;
/** The backdrop video plays solo for this long before the first card arrives. */
const INTRO_MS = 4000;
/** How long the Vande Bharat loader runs between question groups. */
const INTERSTITIAL_MS = 2000;
/** How long the final "shortlisting packages" loader runs before results. */
const MATCHING_MS = 2200;
/** Show the loader after every N answered questions. */
const GROUP_SIZE = 4;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function CustomisePage() {
  const { back } = useRouter();
  const ref = useReveal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [inputs, setInputs] = useState<TripInputs>(defaultInputs);
  // Reduced motion skips the cinematic intro and lands straight on the first question.
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? "questions" : "intro"));
  const [results, setResults] = useState<TourPackage[]>([]);
  const [matchScore, setMatchScore] = useState(96);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = forward, -1 = back — drives slide direction

  // honour prefers-reduced-motion: a looping cinematic pan is exactly the kind of
  // background motion that setting exists to suppress
  useEffect(() => {
    if (prefersReducedMotion()) videoRef.current?.pause();
  }, []);

  // The intro: let the backdrop video breathe, then bring in the first card.
  useEffect(() => {
    if (phase !== "intro") return;
    const t = window.setTimeout(() => setPhase("questions"), INTRO_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  const set = <K extends keyof TripInputs>(key: K, value: TripInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const toggleArr = (key: "vibes" | "transports" | "experiences" | "cateringTypes", value: string) =>
    setInputs((prev) => {
      const current = prev[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      // never let a multi-select empty out completely — keep at least one choice
      return { ...prev, [key]: next.length ? next : current };
    });

  const toggleNote = (tag: string) =>
    setInputs((prev) => {
      const has = prev.notes.toLowerCase().includes(tag.toLowerCase());
      if (has) {
        const notes = prev.notes
          .replace(new RegExp(`\\s*,?\\s*${tag}`, "i"), "")
          .replace(/^\s*,\s*/, "")
          .trim();
        return { ...prev, notes };
      }
      const sep = prev.notes.trim() ? ", " : "";
      return { ...prev, notes: (prev.notes.trim() + sep + tag).slice(0, 120) };
    });

  const dateLabel = useMemo(() => {
    if (!inputs.travelStart) return "";
    const fmt = (d: string) =>
      new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return inputs.travelEnd ? `${fmt(inputs.travelStart)} – ${fmt(inputs.travelEnd)}` : fmt(inputs.travelStart);
  }, [inputs.travelStart, inputs.travelEnd]);

  /** Advance to the next card. Every GROUP_SIZE questions the flow first detours through
      the Vande Bharat loader, so it reads as "fetching your info" before continuing. */
  const onContinue = () => {
    if (exiting || phase !== "questions") return;
    const next = step + 1;
    const crossesGroup = next % GROUP_SIZE === 0; // just answered the 4th / 8th question
    setDir(1);
    setExiting(true);
    window.setTimeout(() => {
      setExiting(false);
      if (crossesGroup) {
        setPhase("interstitial");
        window.setTimeout(() => {
          setStep(next);
          setPhase("questions");
        }, INTERSTITIAL_MS);
      } else {
        setStep(next);
      }
    }, CARD_EXIT_MS);
  };

  const onBack = () => {
    if (exiting || phase !== "questions" || step === 0) return;
    setDir(-1);
    setExiting(true);
    window.setTimeout(() => {
      setStep((s) => s - 1);
      setExiting(false);
    }, CARD_EXIT_MS);
  };

  const findTours = () => {
    if (exiting || phase !== "questions") return;
    const ranked = packages
      .map((p) => ({ p, s: scorePackage(p, inputs) }))
      .sort((a, b) => b.s - a.s);
    const scored = ranked.slice(0, 6).map((r) => r.p);
    const top = ranked[0]?.s ?? 0;

    setDir(1);
    setExiting(true);
    window.setTimeout(() => {
      setExiting(false);
      setPhase("matching");
      window.setTimeout(() => {
        setResults(scored.length ? scored : packages.slice(0, 4));
        setMatchScore(Math.max(88, Math.min(98, 78 + top)));
        setPhase("results");
      }, MATCHING_MS);
    }, CARD_EXIT_MS);
  };

  const startOver = () => {
    setInputs(defaultInputs);
    setStep(0);
    setDir(1);
    setExiting(false);
    setPhase("questions");
  };

  // One card per question — only the current one is ever mounted.
  const questions: Question[] = [
    {
      key: "from",
      title: "Where are you starting from?",
      subtitle: "Tell us your city or current location and we'll plan from there.",
      image: imgFrom,
      insight: () => "We'll find the best routes, trains and packages from your location.",
      control: (
        <div>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              list="from-cities"
              value={inputs.from}
              onChange={(e) => set("from", e.target.value)}
              placeholder="Search city or location"
              className="w-full rounded-xl border bg-white py-3 pl-10 pr-3.5 text-[14px] font-semibold text-ink outline-none focus:border-brand"
            />
            <datalist id="from-cities">
              {fromCities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="mt-4 text-[12px] font-semibold text-muted-foreground">Popular cities</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_CITIES.map((c) => {
              const active = inputs.from === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("from", c)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                    active ? "border-brand bg-brand/10 text-brand" : "bg-white text-ink hover:bg-secondary"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      key: "vibes",
      title: "Where do you want to go?",
      subtitle: "Pick one or more vibes that excite you the most.",
      image: imgVibes,
      insight: (t) =>
        t.vibes.includes("Hills")
          ? "Great choice! Hill stations are lovely this season — expect cool, pleasant weather."
          : "Great picks! We'll match destinations to the vibes you love most.",
      control: <VibeCards options={VIBES} selected={inputs.vibes} onSelect={(k) => toggleArr("vibes", k)} />,
    },
    {
      key: "travellers",
      title: "How many are travelling?",
      subtitle: "This helps us suggest the best stays and experiences.",
      image: imgTravellers,
      insight: (t) =>
        ({
          Solo: "Solo trips get flexible, easy-to-navigate itineraries built for one.",
          Couple: "Couple trips get more private stays and romantic experiences recommended.",
          Family: "Family trips get roomy stays and kid-friendly activities lined up.",
          Friends: "Group trips get lively stays and shared adventures front and centre.",
          "Senior citizens": "We'll prioritise comfortable pacing and easy-access stays.",
        })[t.groupType],
      control: (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => set("travellers", Math.max(1, inputs.travellers - 1))}
              type="button"
              aria-label="Fewer travellers"
              className="flex h-11 w-11 items-center justify-center rounded-xl border text-[18px] font-bold text-ink hover:bg-secondary"
            >
              −
            </button>
            <span className="font-display text-[22px] font-bold text-ink">
              {inputs.travellers} {inputs.travellers === 1 ? "Traveller" : "Travellers"}
            </span>
            <button
              onClick={() => set("travellers", Math.min(12, inputs.travellers + 1))}
              type="button"
              aria-label="More travellers"
              className="flex h-11 w-11 items-center justify-center rounded-xl border text-[18px] font-bold text-ink hover:bg-secondary"
            >
              +
            </button>
          </div>
          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Who's travelling?</div>
            <Pills
              options={GROUP_TYPES}
              selected={[inputs.groupType]}
              onSelect={(k) => set("groupType", k as GroupType)}
              showCheck={false}
            />
          </div>
        </div>
      ),
    },
    {
      key: "date",
      title: "When do you want to travel?",
      subtitle: "Your dates help us find the best availability and prices.",
      image: imgDate,
      insight: (t) =>
        ({
          "2-3 Days": "A short getaway — perfect for a single destination done well.",
          "4-6 Days": "A relaxed pace to enjoy one region without rushing.",
          "7-9 Days": "7–9 days is ideal for exploring multiple places comfortably.",
          "10+ Days": "A grand trip — great for covering several regions end to end.",
        })[t.duration],
      control: (
        <div className="space-y-5">
          <DateRangeCalendar
            start={inputs.travelStart}
            end={inputs.travelEnd}
            onChange={(s, e) => setInputs((p) => ({ ...p, travelStart: s, travelEnd: e }))}
          />
          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Trip duration</div>
            <Pills
              options={DURATIONS.map((d) => ({ key: d }))}
              selected={[inputs.duration]}
              onSelect={(k) => set("duration", k as Duration)}
              showCheck={false}
            />
          </div>
        </div>
      ),
    },
    {
      key: "stay",
      title: "What kind of stay do you prefer?",
      subtitle: "We'll show you stays that match your comfort style.",
      image: imgStay,
      insight: (t) =>
        ({
          Standard: "Standard stays offer the best value for your trip.",
          Comfort: "Comfort stays balance great amenities with a fair price.",
          Luxury: "Luxury stays unlock premium service and standout experiences.",
          Homestays: "Homestays give you authentic local hospitality and character.",
          Resorts: "Resorts are perfect for unwinding with nature at your doorstep.",
          Heritage: "Heritage stays put you inside palaces and royal history.",
        })[t.accommodation],
      control: (
        <OptionCards
          options={STAYS}
          selected={[inputs.accommodation]}
          onSelect={(k) => set("accommodation", k as Accommodation)}
        />
      ),
    },
    {
      key: "transport",
      title: "How do you like to travel?",
      subtitle: "Choose your preferred mode of travel — pick all you're open to.",
      image: imgTransport,
      insight: (t) =>
        t.transports.includes("Train")
          ? "Train journeys offer the best views in the hills."
          : "We'll route your trip around the modes you prefer.",
      control: <OptionCards options={TRANSPORTS} selected={inputs.transports} onSelect={(k) => toggleArr("transports", k)} />,
    },
    {
      key: "experiences",
      title: "What do you want to experience?",
      subtitle: "Pick all that you're excited about.",
      image: imgExperience,
      insight: () => "Adventure + nature experiences make a trip unforgettable — pick freely!",
      control: <Pills options={EXPERIENCES} selected={inputs.experiences} onSelect={(k) => toggleArr("experiences", k)} />,
    },
    {
      key: "food",
      title: "And what about food?",
      subtitle: "It helps us suggest better places for you.",
      image: imgFood,
      insight: () => "Traditional food experiences are a must-try wherever you go.",
      control: (
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Budget</div>
            <Pills
              options={CATERING_COSTS.map((c) => ({ key: c.value, label: c.label }))}
              selected={[inputs.cateringCost]}
              onSelect={(k) => set("cateringCost", k as CateringCost)}
              showCheck={false}
            />
          </div>
          <div>
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">Cuisine style</div>
            <Pills
              options={CATERING_TYPES.map((c) => ({ key: c }))}
              selected={inputs.cateringTypes}
              onSelect={(k) => toggleArr("cateringTypes", k)}
            />
          </div>
        </div>
      ),
    },
    {
      key: "notes",
      title: "Anything else you want us to know?",
      subtitle: "Tell us your preferences and we'll personalize everything.",
      image: imgNotes,
      insight: () => "The more you tell us, the better we can personalize your perfect trip.",
      control: (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={inputs.notes}
              maxLength={120}
              onChange={(e) => set("notes", e.target.value)}
              rows={4}
              placeholder="E.g. no spicy food, quiet places, accessible stays, extra comfort, etc."
              className="w-full resize-none rounded-xl border bg-white p-3.5 pb-7 text-[14px] font-medium text-ink outline-none focus:border-brand"
            />
            <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-muted-foreground">
              {inputs.notes.length}/120
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {NOTES_TAGS.map((tag) => {
              const active = inputs.notes.toLowerCase().includes(tag.toLowerCase());
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleNote(tag)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition ${
                    active ? "border-brand bg-brand/10 text-brand" : "bg-white text-ink hover:bg-secondary"
                  }`}
                >
                  {active && <Check size={13} />}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  const total = questions.length;
  const isLast = step === total - 1;
  const current = questions[step];
  const cardAnim = exiting
    ? dir === 1
      ? "q-exit-fwd"
      : "q-exit-back"
    : dir === 1
      ? "q-enter-fwd"
      : "q-enter-back";

  return (
    <div ref={ref} className="relative min-h-screen overflow-x-hidden pb-20">
      {/* cinematic video backdrop — kept sharp (no filter/blur); a plain dark scrim,
          not a blur, carries the text contrast so the footage stays legible. The scrim
          lightens during the intro so the footage reads, then deepens for card contrast. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            phase === "intro" ? "bg-black/30" : "bg-gradient-to-b from-black/60 via-black/45 to-black/60"
          }`}
        />
      </div>

      <div className="relative z-10">
        <div className={`relative mx-auto px-4 pb-8 pt-10 md:px-6 ${phase === "results" ? "max-w-7xl" : "max-w-5xl"}`}>
          <button onClick={back} type="button" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80 transition hover:text-white">
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="heading-xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">Built around your trip</h1>
          {phase !== "results" && (
            <p className="mt-2 max-w-xl text-[15px] text-white/85">
              Answer a few quick questions — one at a time — and our AI will match the best tours. You can book flights
              &amp; hotels straight through IRCTC.
            </p>
          )}
        </div>
      </div>

      <div className={`relative z-10 mx-auto px-4 md:px-6 ${phase === "results" ? "max-w-7xl" : "max-w-5xl"}`}>
        {/* intro — the backdrop video plays solo, a soft hint promises what's coming */}
        {phase === "intro" && (
          <div className="animate-fadeIn mx-auto flex min-h-[380px] max-w-3xl flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/30 px-5 py-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="text-[13px] font-bold uppercase tracking-wide text-white/85">Setting up your trip planner</span>
            </div>
            <p className="mt-4 text-[14px] text-white/70">Your questions are on their way…</p>
          </div>
        )}

        {/* the wizard — a wide card, one question at a time, sliding horizontally */}
        {phase === "questions" && (
          <div className="mx-auto max-w-5xl">
            <StepHeader step={step} exiting={exiting} total={total} />
            <div key={step} className={`${cardAnim} mx-auto w-full max-w-5xl`}>
              {/* plain white card with a faint blue wash — no photo, so the ink text
                  and controls sit on a clean, high-contrast surface */}
              <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-[#f4f8fe] to-[#e7f0fb] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)] md:min-h-[452px]">
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60" />

                <div className="relative z-10 flex flex-1 flex-col p-6 md:p-10">
                  <h2 className="font-display text-[22px] font-bold leading-tight text-ink md:text-[26px]">{current.title}</h2>
                  <p className="mt-1.5 text-[13.5px] font-semibold text-ink/60">{current.subtitle}</p>

                  <div className="flex-1 py-5">{current.control}</div>

                  {/* AI insight — a light contextual note that rides on the card, not a panel */}
                  <div className="mb-5 inline-flex max-w-xl items-start gap-2 self-start rounded-2xl bg-brand/10 px-3.5 py-2 text-brand ring-1 ring-brand/15">
                    <Sparkles size={14} className="mt-0.5 shrink-0" />
                    <span className="text-[12.5px] font-semibold leading-snug">{current.insight(inputs)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onBack}
                      disabled={step === 0 || exiting}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-bold text-muted-foreground transition hover:text-ink disabled:pointer-events-none disabled:opacity-0"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>

                    {isLast ? (
                      <button
                        onClick={findTours}
                        disabled={exiting}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:opacity-70"
                      >
                        <Sparkles size={18} /> Show &amp; Get My Trip
                      </button>
                    ) : (
                      <button
                        onClick={onContinue}
                        disabled={exiting}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:opacity-70"
                      >
                        Continue <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* mini-loader after every group of questions */}
        {phase === "interstitial" && (
          <VandeBharatLoader title="Fetching your details" sub="Personalising your next few questions" />
        )}

        {/* final loader before the matched packages appear */}
        {phase === "matching" && (
          <VandeBharatLoader title="Matching your perfect trips" sub="Shortlisting the best packages for you" />
        )}

        {phase === "results" && (
          <div className="reveal in">
            <DoneHeader
              inputs={inputs}
              dateLabel={dateLabel}
              count={results.length}
              matchScore={matchScore}
              onStartOver={startOver}
              onShowTrips={() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            />

            <div
              ref={gridRef}
              className="mt-10 grid scroll-mt-6 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14"
            >
              {results.map((pkg) => (
                <div key={pkg.id} className="reveal in relative flex flex-col">
                  <EditorialPackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** The "Step N" rule from the reference: divider lines on either side, with only the
    number morphing in place (vanish → spring back in) as the flow advances. */
function StepHeader({ step, exiting, total }: { step: number; exiting: boolean; total: number }) {
  return (
    <div className="mx-auto mb-6 flex max-w-2xl items-center gap-4">
      <span className="h-px flex-1 bg-white/35" />
      <div className="flex items-baseline gap-2 whitespace-nowrap font-display text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        <span className="text-[22px] font-bold uppercase tracking-tight md:text-[26px]">Step</span>
        <span
          key={step}
          className={`inline-block min-w-[0.7em] text-center text-[22px] font-bold md:text-[26px] ${
            exiting ? "num-out" : "num-in"
          }`}
        >
          {step + 1}
        </span>
        <span className="text-[13px] font-semibold text-white/55">/ {total}</span>
      </div>
      <span className="h-px flex-1 bg-white/35" />
    </div>
  );
}

/** Destination "vibe" picker — each choice is a photo card with a frosted-glass label
    (blurred bar over the image) carrying the name + description. Multi-select, with a
    brand ring + check when chosen. */
function VibeCards({
  options,
  selected,
  onSelect,
}: {
  options: VibeOption[];
  selected: string[];
  onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((o) => {
        const active = selected.includes(o.key);
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(o.key)}
            className={`group relative h-44 overflow-hidden rounded-2xl text-left shadow-sm transition ${
              active ? "ring-2 ring-brand ring-offset-2 ring-offset-white" : "ring-1 ring-black/10 hover:ring-black/20"
            }`}
          >
            <img
              src={o.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {/* legibility gradient so the glass label reads on any photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5" />

            {active && (
              <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-md ring-2 ring-white/60">
                <Check size={13} />
              </span>
            )}

            {/* frosted-glass label */}
            <div className="absolute inset-x-2.5 bottom-2.5">
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-white">
                  <span className="text-white/90">{o.icon}</span>
                  <span className="font-display text-[15px] font-bold [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                    {o.key}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] font-medium leading-snug text-white/85 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]">
                  {o.desc}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Selectable content cards (icon + label + description) used for stays and travel
    modes. `selected` is an array so the same component serves single and multi-select —
    the caller decides whether onSelect toggles or replaces. */
function OptionCards({
  options,
  selected,
  onSelect,
}: {
  options: Option[];
  selected: string[];
  onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {options.map((o) => {
        const active = selected.includes(o.key);
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(o.key)}
            className={`relative flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition ${
              active
                ? "border-brand bg-brand/5 shadow-sm ring-1 ring-brand"
                : "border-border bg-white hover:border-brand/40 hover:bg-secondary/40"
            }`}
          >
            {active && (
              <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                <Check size={12} />
              </span>
            )}
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                active ? "bg-brand text-white" : "bg-brand/10 text-brand"
              }`}
            >
              {o.icon}
            </span>
            <span className="mt-1 text-[13.5px] font-bold text-ink">{o.key}</span>
            {o.desc && <span className="text-[11.5px] leading-snug text-muted-foreground">{o.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Pill group — single or multi-select depending on how the caller wires onSelect.
    Shows the option icon by default, swapping to a check when active (unless showCheck
    is off, e.g. duration/group chips that keep their icon). */
function Pills({
  options,
  selected,
  onSelect,
  showCheck = true,
}: {
  options: PillOption[];
  selected: string[];
  onSelect: (key: string) => void;
  showCheck?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.key);
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(o.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition ${
              active ? "border-brand bg-brand/10 text-brand" : "bg-white text-ink hover:bg-secondary"
            }`}
          >
            {active && showCheck ? <Check size={13} /> : o.icon}
            {o.label ?? o.key}
          </button>
        );
      })}
    </div>
  );
}

/** Compact single-month range picker: tap a start day, then an end day. Past days are
    disabled; the range highlights between the two edges. */
function DateRangeCalendar({
  start,
  end,
  onChange,
}: {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => {
    const base = start ? new Date(`${start}T00:00:00`) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const y = view.getFullYear();
  const m = view.getMonth();
  const firstWeekday = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const monthName = view.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const pick = (day: number) => {
    const d = new Date(y, m, day);
    if (d < today) return;
    const s = iso(d);
    if (!start || (start && end)) {
      onChange(s, "");
    } else if (d < new Date(`${start}T00:00:00`)) {
      onChange(s, "");
    } else {
      onChange(start, s);
    }
  };

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border bg-white p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(y, m - 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink hover:bg-secondary"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="font-display text-[14px] font-bold text-ink">{monthName}</div>
        <button
          type="button"
          onClick={() => setView(new Date(y, m + 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink hover:bg-secondary"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`b${i}`} />;
          const d = new Date(y, m, day);
          const dISO = iso(d);
          const past = d < today;
          const isEdge = dISO === start || dISO === end;
          const inRange =
            !!start && !!end && dISO > start && dISO < end;
          return (
            <button
              key={dISO}
              type="button"
              disabled={past}
              onClick={() => pick(day)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-[12.5px] font-semibold transition ${
                past
                  ? "text-muted-foreground/40"
                  : isEdge
                    ? "bg-brand text-white"
                    : inRange
                      ? "bg-brand/15 text-brand"
                      : "text-ink hover:bg-secondary"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The results banner — a "Done!" summary, an AI match-score ring and a what's-next list,
    mirroring the reference's completion card. */
function DoneHeader({
  inputs,
  dateLabel,
  count,
  matchScore,
  onStartOver,
  onShowTrips,
}: {
  inputs: TripInputs;
  dateLabel: string;
  count: number;
  matchScore: number;
  onStartOver: () => void;
  onShowTrips: () => void;
}) {
  const summary: { icon: ReactNode; caption: string; value: string }[] = [
    { icon: <MapPin size={14} />, caption: "From", value: inputs.from || "Anywhere" },
    { icon: <Mountain size={14} />, caption: "To", value: inputs.vibes.join(", ") },
    {
      icon: <Users size={14} />,
      caption: "Travellers",
      value: `${inputs.travellers} · ${inputs.groupType}`,
    },
    { icon: <CalendarDays size={14} />, caption: "Duration", value: dateLabel || inputs.duration },
    { icon: <TrainFront size={14} />, caption: "By", value: inputs.transports.join(", ") },
    { icon: <BedDouble size={14} />, caption: "Stay", value: inputs.accommodation },
    { icon: <Sparkles size={14} />, caption: "Interests", value: inputs.experiences.slice(0, 3).join(", ") },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/15 bg-white shadow-xl">
      <div className="grid lg:grid-cols-[1.5fr_0.9fr_1.1fr]">
        {/* done + summary */}
        <div className="p-6 md:p-7">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-saffron/15 text-saffron">
              <PartyPopper size={20} />
            </span>
            <h2 className="font-display text-[20px] font-bold leading-tight text-ink md:text-[23px]">
              Done! We've got your perfect trip
            </h2>
          </div>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Our AI has analysed your preferences and found the best options just for you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.map((s) => (
              <div
                key={s.caption}
                className="inline-flex items-center gap-2 rounded-xl border bg-secondary/40 px-3 py-1.5"
              >
                <span className="text-brand">{s.icon}</span>
                <span className="leading-tight">
                  <span className="block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    {s.caption}
                  </span>
                  <span className="block max-w-[160px] truncate text-[12.5px] font-bold text-ink">{s.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI match score */}
        <div className="flex flex-col items-center justify-center border-t p-6 lg:border-l lg:border-t-0">
          <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">AI Match Score</div>
          <div className="mt-3">
            <ScoreRing value={matchScore} />
          </div>
          <p className="mt-3 max-w-[180px] text-center text-[12px] font-semibold text-ink/70">
            Great choice! You're going to love this trip.
          </p>
        </div>

        {/* what's next */}
        <div className="border-t p-6 lg:border-l lg:border-t-0">
          <div className="text-[13px] font-bold text-ink">What's next?</div>
          <ul className="mt-3 space-y-2.5">
            {[
              `${count} handpicked trips for you`,
              "Best prices & availability",
              "Real photos & verified stays",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] font-semibold text-ink/80">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600">
                  <Check size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={onShowTrips}
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-[14px] font-bold text-white shadow-lg transition hover:brightness-95"
            >
              Show My Trips <ArrowRight size={16} />
            </button>
            <button
              onClick={onStartOver}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-bold text-ink hover:bg-secondary"
            >
              <RefreshCw size={14} /> Adjust
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Circular AI-match-score gauge. */
function ScoreRing({ value }: { value: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="relative h-[96px] w-[96px]">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e5eaf2" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-[22px] font-bold text-ink">
        {value}%
      </div>
    </div>
  );
}

/** A sleek side profile of a Vande Bharat set — white body, saffron stripe sweeping to
    the nose — used purely as the loader's mascot. */
function VandeBharatTrain() {
  return (
    <svg width="200" height="64" viewBox="0 0 200 64" fill="none" role="img" aria-label="Vande Bharat train">
      {/* body */}
      <path
        d="M14 16 H150 C172 16 190 26 196 36 C190 44 176 48 150 48 H14 C8 48 4 44 4 38 V26 C4 20 8 16 14 16 Z"
        fill="#ffffff"
        stroke="#d7e0ec"
        strokeWidth="1.4"
      />
      {/* passenger window band */}
      <rect x="20" y="21" width="118" height="9" rx="3" fill="#14294c" />
      {/* windshield */}
      <path d="M150 21 C166 22 179 28 186 35 L168 35 C162 30 157 27 150 27 Z" fill="#14294c" />
      {/* saffron stripe, sweeping down toward the nose */}
      <path d="M4 32 H150 C171 32 187 37 196 42 L195 45 C186 41 169 43 150 43 H4 Z" fill="#F2662A" />
      {/* door seam */}
      <line x1="88" y1="17" x2="88" y2="47" stroke="#e2e8f0" strokeWidth="1" />
      {/* headlight */}
      <circle cx="189" cy="39" r="2.3" fill="#ffe9a8" />
      {/* wheels */}
      <g fill="#0e1f38">
        <circle cx="42" cy="52" r="5.2" />
        <circle cx="60" cy="52" r="5.2" />
        <circle cx="118" cy="52" r="5.2" />
        <circle cx="136" cy="52" r="5.2" />
      </g>
      <g fill="#8aa0bd">
        <circle cx="42" cy="52" r="1.8" />
        <circle cx="60" cy="52" r="1.8" />
        <circle cx="118" cy="52" r="1.8" />
        <circle cx="136" cy="52" r="1.8" />
      </g>
    </svg>
  );
}

/** The between-groups loader: the train bobs while speed streaks whoosh past, selling
    the idea that we're off fetching and shortlisting on the traveller's behalf. */
function VandeBharatLoader({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-fadeIn mx-auto flex min-h-[380px] max-w-3xl flex-col items-center justify-center rounded-3xl border border-white/20 bg-black/35 px-6 py-14 text-center shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]"
    >
      <div className="relative h-[92px] w-[280px]">
        <div className="absolute bottom-4 left-0 right-0 h-[2px] rounded bg-white/25" />
        <span className="vb-streak" style={{ top: 30 }} />
        <span className="vb-streak" style={{ top: 44, animationDelay: "0.28s" }} />
        <span className="vb-streak" style={{ top: 58, animationDelay: "0.56s" }} />
        <div className="vb-bob absolute bottom-4 left-1/2">
          <VandeBharatTrain />
        </div>
      </div>
      <div className="mt-7 font-display text-[19px] font-bold text-white">
        {title}
        <span className="vb-dots" />
      </div>
      <div className="mt-1.5 text-[13px] text-white/70">{sub}</div>
    </div>
  );
}
