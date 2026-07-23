import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Banknote,
    BedDouble,
    Bird,
    Bus,
    Camera,
    Car,
    Castle,
    Check,
    ChevronLeft,
    ChevronRight,
    Compass,
    Crown,
    Footprints,
    Gem,
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
    Wallet,
    Waves,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages } from "@/data/packages";
import type { BudgetBand, Experience, TourPackage, TravelMode } from "@/types";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";
import PriceRangeSlider from "@/components/customise/PriceRangeSlider";
import TripPass from "@/components/customise/TripPass";
import bgVideo from "@/assets/customise/25d82214-bbf9-4ec0-bfdd-deed85a779f5.mov";
import imgFrom from "@/assets/customise/from.jpg";
import imgVibes from "@/assets/customise/destination.jpeg";
import imgTravellers from "@/assets/customise/travellers.webp";
import imgDate from "@/assets/customise/date.jpg";
import imgStay from "@/assets/customise/stay.jpg";
import imgTransport from "@/assets/customise/transport.webp";
import imgExperience from "@/assets/customise/experience.jpg";
import imgBudget from "@/assets/customise/budget.webp";
import imgNotes from "@/assets/customise/budget.webp";
import imgBudgetFriendly from "@/assets/irctc_services_assets/svc-retiring-room.jpeg";
import imgBudgetBalance from "@/assets/irctc_services_assets/svc-hotels.webp";
import imgBudgetLuxury from "@/assets/irctc_services_assets/svc-maharajas.jpg";
import imgBudgetComfortable from "@/assets/irctc_services_assets/svc-lounge.png";
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
import imgCityNewDelhi from "@/assets/cutomise2/new-delhi.jpg";
import imgCityMumbai from "@/assets/cutomise2/mumbai.jpg";
import imgCityBengaluru from "@/assets/cutomise2/bengaluru.jpg";
import imgCityChennai from "@/assets/cutomise2/chennai.jpg";
import imgFerry from "@/assets/cutomise2/ferry.jpg";
import imgHeli from "@/assets/cutomise2/heli.jpg";
import imgExpAdventure from "@/assets/cutomise2/categories/adventure.jpg";
import imgExpTrekking from "@/assets/cutomise2/categories/Trekking.jpg";
import imgExpPhotography from "@/assets/cutomise2/categories/Photography.jpg";
import imgExpTemple from "@/assets/cutomise2/categories/Temple visits.jpg";
import imgExpWildlife from "@/assets/cutomise2/categories/Wildlife.jpg";
import imgExpWaterfalls from "@/assets/cutomise2/categories/Waterfalls.jpg";
import imgExpLocalFood from "@/assets/cutomise2/categories/Local food.jpg";
import imgExpShopping from "@/assets/cutomise2/categories/Shopping.jpg";
import imgExpHistory from "@/assets/cutomise2/categories/History.jpg";
import imgExpNightlife from "@/assets/cutomise2/categories/Nightlife.jpg";
import imgExpWellness from "@/assets/cutomise2/categories/Wellness.jpg";
import imgExpSnow from "@/assets/cutomise2/categories/Snow.jpg";
import imgExpCulture from "@/assets/cutomise2/categories/Culture.jpg";
import imgExpTeaGardens from "@/assets/cutomise2/categories/Tea gardens.jpg";
import imgStayStandard from "@/assets/cutomise2/categories/standard.jpg";
import imgStayHeritage from "@/assets/cutomise2/categories/heritage.jpg";
import vandeBharatLoco from "@/assets/cta/vande-bharat-loco.png";
import imgAskDisha from "@/assets/graphic/askdisha-2.png";

const fromCities = [...new Set(packages.map((p) => p.from))];
const POPULAR_CITIES: { name: string; image: string }[] = [
    { name: "New Delhi", image: imgCityNewDelhi },
    { name: "Mumbai", image: imgCityMumbai },
    { name: "Bengaluru", image: imgCityBengaluru },
    { name: "Chennai", image: imgCityChennai },
];

/** Where the flow currently is:
 *  intro        — the backdrop video plays solo for a beat before questions appear
 *  questions    — one wide card on screen, answered via the Continue button
 *  interstitial — the Vande Bharat loader, shown after every GROUP_SIZE questions
 *  matching     — the final "shortlisting packages" loader before results
 *  results      — the matched package grid
 */
type Phase = "intro" | "questions" | "interstitial" | "matching" | "results";

type Accommodation = "Standard" | "Comfort" | "Luxury" | "Homestays" | "Resorts" | "Heritage";
type CateringCost = "Low" | "Mid" | "High" | "Custom";
type Duration = "2-3 Days" | "4-6 Days" | "7-9 Days" | "10+ Days";
type GroupType = "Solo" | "Couple" | "Family" | "Friends" | "Senior citizens";

interface Option {
    key: string;
    icon: ReactNode;
    desc?: string;
    /** Overrides the key as the visible label — used when the stored value (e.g. "10000")
     *  needs to display as something else (e.g. "₹10K"). */
    label?: string;
    image?: string;
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

const GROUP_TYPES: Option[] = [
    { key: "Solo", icon: <Compass size={16} strokeWidth={1.75} />, desc: "Flexible, easy-to-navigate itineraries", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80" },
    { key: "Couple", icon: <Heart size={16} strokeWidth={1.75} />, desc: "Private stays & romantic experiences", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" },
    { key: "Family", icon: <Home size={16} strokeWidth={1.75} />, desc: "Roomy stays & kid-friendly activities", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80" },
    { key: "Friends", icon: <Users size={16} strokeWidth={1.75} />, desc: "Lively stays & shared adventures", image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80" },
    { key: "Senior citizens", icon: <Leaf size={16} strokeWidth={1.75} />, desc: "Comfortable pacing & easy-access stays", image: "https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?auto=format&fit=crop&w=800&q=80" },
];

const DURATIONS: Duration[] = ["2-3 Days", "4-6 Days", "7-9 Days", "10+ Days"];

const STAYS: Option[] = [
    {
        key: "Standard",
        icon: <BedDouble size={16} strokeWidth={1.75} />,
        desc: "Comfortable and clean stays",
        image: imgStayStandard,
    },
    {
        key: "Comfort",
        icon: <Sofa size={16} strokeWidth={1.75} />,
        desc: "Better amenities & convenience",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Luxury",
        icon: <Crown size={16} strokeWidth={1.75} />,
        desc: "Premium stays & experiences",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Homestays",
        icon: <Home size={16} strokeWidth={1.75} />,
        desc: "Local vibes & authentic stays",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Resorts",
        icon: <Palmtree size={16} strokeWidth={1.75} />,
        desc: "Nature stays & relaxation",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Heritage",
        icon: <Castle size={16} strokeWidth={1.75} />,
        desc: "Royal & heritage experiences",
        image: imgStayHeritage,
    },
];

const TRANSPORTS: Option[] = [
    {
        key: "Train",
        icon: <TrainFront size={16} strokeWidth={1.75} />,
        desc: "Scenic & comfortable",
        image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Air",
        icon: <Plane size={16} strokeWidth={1.75} />,
        desc: "Fast & convenient",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Bus",
        icon: <Bus size={16} strokeWidth={1.75} />,
        desc: "Budget friendly & flexible",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Ferry",
        icon: <Ship size={16} strokeWidth={1.75} />,
        desc: "Scenic water routes",
        image: imgFerry,
    },
    {
        key: "Road Trip",
        icon: <Car size={16} strokeWidth={1.75} />,
        desc: "Freedom to explore",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Helicopter",
        icon: <Compass size={16} strokeWidth={1.75} />,
        desc: "Quick & scenic rides",
        image: imgHeli,
    },
];

const EXPERIENCES: Option[] = [
    {
        key: "Adventure",
        icon: <Compass size={13} />,
        desc: "Thrilling outdoor sports & activities",
        image: imgExpAdventure,
    },
    {
        key: "Trekking",
        icon: <Footprints size={13} />,
        desc: "Mountain trails & hiking adventures",
        image: imgExpTrekking,
    },
    {
        key: "Photography",
        icon: <Camera size={13} />,
        desc: "Scenic viewpoints & landscape shoots",
        image: imgExpPhotography,
    },
    {
        key: "Temple visits",
        icon: <Landmark size={13} />,
        desc: "Spiritual tours & sacred temples",
        image: imgExpTemple,
    },
    {
        key: "Wildlife",
        icon: <Bird size={13} />,
        desc: "Jungle safaris & animal sightings",
        image: imgExpWildlife,
    },
    {
        key: "Waterfalls",
        icon: <Waves size={13} />,
        desc: "Majestic cascades & natural pools",
        image: imgExpWaterfalls,
    },
    {
        key: "Local food",
        icon: <Utensils size={13} />,
        desc: "Traditional street food & regional cuisine",
        image: imgExpLocalFood,
    },
    {
        key: "Shopping",
        icon: <ShoppingBag size={13} />,
        desc: "Bustling bazaars & handicraft stalls",
        image: imgExpShopping,
    },
    {
        key: "History",
        icon: <History size={13} />,
        desc: "Forts, palaces & archaeological sites",
        image: imgExpHistory,
    },
    {
        key: "Nightlife",
        icon: <Moon size={13} />,
        desc: "City clubs, bars & evening entertainment",
        image: imgExpNightlife,
    },
    {
        key: "Wellness",
        icon: <Leaf size={13} />,
        desc: "Spa therapies, yoga & retreats",
        image: imgExpWellness,
    },
    {
        key: "Snow",
        icon: <Snowflake size={13} />,
        desc: "Snow activities & winter sports",
        image: imgExpSnow,
    },
    {
        key: "Culture",
        icon: <Landmark size={13} />,
        desc: "Folk arts, craft walks & local heritage",
        image: imgExpCulture,
    },
    {
        key: "Tea gardens",
        icon: <Leaf size={13} />,
        desc: "Scenic estate walks & tea tastings",
        image: imgExpTeaGardens,
    },
];

/** Trip budget style cards — exclusive feel via single-select in the question UI. */
const BUDGET_STYLES: Option[] = [
    {
        key: "Budget friendly",
        icon: <Wallet size={16} />,
        desc: "Smart spends & great value stays",
        image: imgBudgetFriendly,
    },
    {
        key: "Balance",
        icon: <Banknote size={16} />,
        desc: "A mix of comfort and value",
        image: imgBudgetBalance,
    },
    {
        key: "Luxury",
        icon: <Crown size={16} />,
        desc: "Premium stays & elevated experiences",
        image: imgBudgetLuxury,
    },
    {
        key: "Comfortable",
        icon: <Sofa size={16} />,
        desc: "Relaxed travel with solid amenities",
        image: imgBudgetComfortable,
    },
];
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
/** Which stay styles fit each destination vibe — used to highlight (not restrict)
 *  the stay options that suit the trip already being planned. */
const VIBE_STAY: Record<string, Accommodation[]> = {
    Hills: ["Homestays", "Resorts"],
    Beaches: ["Resorts", "Luxury"],
    Pilgrimage: ["Standard", "Homestays"],
    Heritage: ["Heritage", "Luxury"],
    Wildlife: ["Resorts", "Homestays"],
    Desert: ["Heritage", "Resorts"],
    Festivals: ["Heritage", "Comfort"],
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
/** Cities with a working port — Ferry only makes sense starting from one of these. */
const COASTAL_CITIES = ["Kochi", "Kolkata", "Mumbai", "Chennai", "Goa"];
/** Cities genuinely near the Thar desert circuit — Desert only shows starting from one
 *  of these, regardless of whether a farther-off city happens to have a desert package. */
const DESERT_NEARBY_CITIES = ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Bikaner", "Ahmedabad"];
/** Regions (from VIBE_REGION) that justify each conditional transport mode. */
const FERRY_REGIONS = ["Kerala", "Karnataka & Goa", "Andaman Islands"];
const HELICOPTER_REGIONS = ["Uttarakhand", "Jammu & Kashmir"];

const isCoastalCity = (from: string) => !!from && COASTAL_CITIES.some((c) => from.toLowerCase().includes(c.toLowerCase()));
const isDesertNearbyCity = (from: string) =>
    !!from && DESERT_NEARBY_CITIES.some((c) => from.toLowerCase().includes(c.toLowerCase()));

/** Why a transport mode doesn't fit this trip yet, or null if it's fair game.
 *  Ferry needs a coastal start city or a coastal destination vibe; Helicopter
 *  only makes sense for hill/yatra routes (heli-yatra style add-ons). */
function transportBlockedReason(mode: string, t: Pick<TripInputs, "from" | "vibes">): string | null {
    const regions = t.vibes.flatMap((v) => VIBE_REGION[v] ?? []);
    if (mode === "Ferry") {
        const coastalVibe = regions.some((r) => FERRY_REGIONS.includes(r));
        if (!isCoastalCity(t.from) && !coastalVibe) return "No coastal route for this trip";
    }
    if (mode === "Helicopter") {
        if (!regions.some((r) => HELICOPTER_REGIONS.includes(r))) return "Only available on hill & yatra routes";
    }
    return null;
}
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
};
const CATERING_BANDS: Record<Exclude<CateringCost, "Custom">, BudgetBand[]> = {
    Low: ["Value", "Comfort"],
    Mid: ["Comfort", "Premium"],
    High: ["Premium", "Luxury"],
};

/** For a custom per-meal budget (₹), which price bands it maps onto. */
function customCateringBands(amount: number): BudgetBand[] {
    if (amount < 500) return ["Value"];
    if (amount < 1500) return ["Value", "Comfort"];
    if (amount < 3000) return ["Comfort", "Premium"];
    return ["Premium", "Luxury"];
}

interface TripInputs {
    from: string;
    vibes: string[];
    travellers: number;
    groupType: GroupType;
    travelStart: string;
    travelEnd: string;
    duration: Duration | null;
    accommodation: Accommodation;
    transports: string[];
    experiences: string[];
    cateringCost: CateringCost;
    customBudget: string;
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
    customBudget: "",
    cateringTypes: ["Balance"],
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
    const cateringBands =
        t.cateringCost === "Custom" ? customCateringBands(Number(t.customBudget) || 0) : CATERING_BANDS[t.cateringCost];
    if (cateringBands.includes(pkg.budgetBand)) score += 2;

    return score;
}

interface Question {
    key: string;
    title: ReactNode;
    subtitle: string;
    image: string;
    control: ReactNode;
}

/** Card exit duration — must stay in sync with `q-exit-*` in index.css. */
const CARD_EXIT_MS = 200;
/** The backdrop video plays solo for this long before the first card arrives. */
const INTRO_MS = 1200;
/** How long the Vande Bharat loader runs between question groups. */
const INTERSTITIAL_MS = 2000;
/** How long the final "shortlisting packages" loader runs before results. */
const MATCHING_MS = 2200;
/** Show the loader after every N answered questions. */
const GROUP_SIZE = 4;

const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayISO = () => toISO(new Date());
const addDaysISO = (iso: string, days: number) => {
    const d = new Date(`${iso}T00:00:00`);
    d.setDate(d.getDate() + days);
    return toISO(d);
};
/** Nights to block off on the calendar for each duration preset, keyed to its upper bound. */
const DURATION_NIGHTS: Record<Duration, number> = {
    "2-3 Days": 2,
    "4-6 Days": 5,
    "7-9 Days": 8,
    "10+ Days": 10,
};

/** Results grid column count by viewport, mirroring `sm:grid-cols-2 lg:grid-cols-3`.
 *  Cards are laid out row by row so a hovered card can steal width from the ones
 *  beside it — that needs an explicit column count, not a wrapping grid. */
const columnsFor = (w: number) => (w >= 1024 ? 3 : w >= 640 ? 2 : 1);

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
    /** Furthest question index reached — rail clicks may only jump to filled steps (≤ this). */
    const [maxReached, setMaxReached] = useState(0);
    const [exiting, setExiting] = useState(false);
    const [dir, setDir] = useState<1 | -1>(1); // 1 = forward, -1 = back — drives slide direction
    // Results are laid out row by row so a hovered card can steal width from its
    // neighbours — that needs an explicit column count, not a wrapping grid.
    const [cols, setCols] = useState(() => (typeof window === "undefined" ? 3 : columnsFor(window.innerWidth)));

    // honour prefers-reduced-motion: a looping cinematic pan is exactly the kind of
    // background motion that setting exists to suppress
    useEffect(() => {
        if (prefersReducedMotion()) videoRef.current?.pause();
    }, []);

    useEffect(() => {
        const onResize = () => setCols(columnsFor(window.innerWidth));
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const resultRows = useMemo(() => {
        const out: TourPackage[][] = [];
        for (let i = 0; i < results.length; i += cols) out.push(results.slice(i, i + cols));
        return out;
    }, [results, cols]);

    // The intro: let the backdrop video breathe, then bring in the first card.
    useEffect(() => {
        if (phase !== "intro") return;
        const t = window.setTimeout(() => setPhase("questions"), INTRO_MS);
        return () => window.clearTimeout(t);
    }, [phase]);

    const set = <K extends keyof TripInputs>(key: K, value: TripInputs[K]) =>
        setInputs((prev) => ({ ...prev, [key]: value }));

    const toggleArr = (key: "vibes" | "transports" | "experiences", value: string) =>
        setInputs((prev) => {
            const current = prev[key];
            const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
            // never let a multi-select empty out completely — keep at least one choice
            return { ...prev, [key]: next.length ? next : current };
        });

    /** Picking a duration preset blocks off that many nights on the calendar, starting
        today if no start date is set yet (or the existing start date otherwise). */
    const selectDuration = (d: Duration) =>
        setInputs((prev) => {
            const start = prev.travelStart || todayISO();
            return { ...prev, duration: d, travelStart: start, travelEnd: addDaysISO(start, DURATION_NIGHTS[d]) };
        });

    /** Manually dragging a range on the calendar is a custom selection — it no longer
        matches a preset, so clear whichever duration pill was active. */
    const pickCustomDates = (start: string, end: string) =>
        setInputs((prev) => ({ ...prev, travelStart: start, travelEnd: end, duration: null }));

    const dateLabel = useMemo(() => {
        if (!inputs.travelStart) return "";
        const fmt = (d: string) =>
            new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        return inputs.travelEnd ? `${fmt(inputs.travelStart)} – ${fmt(inputs.travelEnd)}` : fmt(inputs.travelStart);
    }, [inputs.travelStart, inputs.travelEnd]);

    // Which transport modes don't fit the chosen route yet (e.g. Ferry with no coastal
    // start/destination) — recomputed whenever the "from" city or destination vibes change.
    const transportBlocked = useMemo(
        () =>
            Object.fromEntries(TRANSPORTS.map((t) => [t.key, transportBlockedReason(t.key, inputs)])) as Record<
                string,
                string | null
            >,
        [inputs.from, inputs.vibes],
    );

    // If the route changes and strands a previously-picked transport (e.g. they had Ferry
    // selected, then switched destination away from the coast), drop it automatically —
    // falling back to Train so the selection never goes empty.
    useEffect(() => {
        const stillValid = inputs.transports.filter((k) => !transportBlocked[k]);
        if (stillValid.length !== inputs.transports.length) {
            setInputs((prev) => ({ ...prev, transports: stillValid.length ? stillValid : ["Train"] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transportBlocked]);

    // Experiences that fit the destination vibes picked earlier (e.g. "Beaches" surfaces
    // Waterfalls/Beaches) — filtered to only show relevant ones, capped at max 8.
    const orderedExperiences = useMemo(() => {
        const wantedExp = new Set(inputs.vibes.flatMap((v) => VIBE_EXP[v] ?? []));
        const recommended = EXPERIENCES.filter((e) => (EXPERIENCE_EXP[e.key] ?? []).some((exp) => wantedExp.has(exp)));
        
        let list = recommended.slice(0, 8);
        if (list.length === 0) {
            list = EXPERIENCES.slice(0, 8);
        }
        const recommendedKeys = list.map((e) => e.key);
        return { list, recommendedKeys };
    }, [inputs.vibes]);

    // Auto-deselect any selected experiences that are filtered out of the top 8 relevant ones
    useEffect(() => {
        const visibleKeys = new Set(orderedExperiences.list.map((e) => e.key));
        const stillValid = inputs.experiences.filter((k) => visibleKeys.has(k));
        if (stillValid.length !== inputs.experiences.length) {
            setInputs((prev) => ({ ...prev, experiences: stillValid }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderedExperiences]);

    // Stay styles that fit the destination vibes picked earlier — highlighted, not
    // restricted, since any stay is still bookable, just not as good a fit.
    const stayHighlights = useMemo(
        () => [...new Set(inputs.vibes.flatMap((v) => VIBE_STAY[v] ?? []))],
        [inputs.vibes],
    );

    // Beaches doesn't fit a non-coastal start city — hide it entirely rather than just
    // greying it out, same idea as the Ferry rule but for the destination picker itself.
    const visibleVibes = useMemo(
        () =>
            VIBES.filter((v) => {
                if (v.key === "Beaches") return isCoastalCity(inputs.from);
                if (v.key === "Desert") return isDesertNearbyCity(inputs.from);
                return true;
            }),
        [inputs.from],
    );

    // If they go back and change the start city after already picking Beaches, drop it —
    // falling back to Hills so the destination selection never goes empty.
    useEffect(() => {
        const visibleKeys = new Set(visibleVibes.map((v) => v.key));
        const stillValid = inputs.vibes.filter((k) => visibleKeys.has(k));
        if (stillValid.length !== inputs.vibes.length) {
            setInputs((prev) => ({ ...prev, vibes: stillValid.length ? stillValid : ["Hills"] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleVibes]);

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
                    setMaxReached((m) => Math.max(m, next));
                    setPhase("questions");
                }, INTERSTITIAL_MS);
            } else {
                setStep(next);
                setMaxReached((m) => Math.max(m, next));
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

    /** Jump via the numbered rail — only steps already filled (≤ maxReached). */
    const goToStep = (i: number) => {
        if (exiting || phase !== "questions" || i === step || i < 0 || i > maxReached) return;
        setDir(i < step ? -1 : 1);
        setExiting(true);
        window.setTimeout(() => {
            setStep(i);
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
        setMaxReached(0);
        setDir(1);
        setExiting(false);
        setPhase("questions");
    };

    // One card per question — only the current one is ever mounted.
    const questions: Question[] = [
        {
            key: "from",
            title: (
                <>
                    Where are you starting <span className="accent">from?</span>
                </>
            ),
            subtitle: "Tell us your city or current location and we'll plan from there.",
            image: imgFrom,
            control: (
                <div>
                    <div className="relative">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            list="from-cities"
                            value={inputs.from}
                            onChange={(e) => set("from", e.target.value)}
                            placeholder="Search city or location"
                            className="w-full rounded-xl border bg-[#FFFFFF] py-3 pl-10 pr-3.5 text-[15.5px] font-semibold text-[#323232] outline-none focus:border-[#2475EE]"
                        />
                        <datalist id="from-cities">
                            {fromCities.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>
                    <div className="mt-4 text-[15px] font-semibold text-muted-foreground">Popular cities</div>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {POPULAR_CITIES.map((c) => {
                            const active = inputs.from === c.name;
                            return (
                                <button
                                    key={c.name}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => set("from", c.name)}
                                    className={`group relative h-44 overflow-hidden rounded-2xl text-left shadow-sm transition ${active ? "ring-2 ring-[#2475EE] ring-offset-2 ring-offset-[#FFFFFF]" : "ring-1 ring-[#323232]/10 hover:ring-[#323232]/20"
                                        }`}
                                >
                                    <img
                                        src={c.image}
                                        alt=""
                                        aria-hidden="true"
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                    {active && (
                                        <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2475EE] text-[#FFFFFF] shadow-md ring-2 ring-[#FFFFFF]/60">
                                            <Check size={13} />
                                        </span>
                                    )}

                                    {/* frosted-glass label */}
                                    <div className="absolute inset-x-1.5 bottom-1.5">
                                        <div className="rounded-xl border border-[#FFFFFF]/30 bg-transparent px-2 py-1.5">
                                            <span className="flex items-center gap-1.5 font-display text-[16.5px] font-bold text-[#FFFFFF] [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                                                <MapPin size={16} className="text-[#FFFFFF]/90" />
                                                {c.name}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ),
        },
        {
            key: "vibes",
            title: (
                <>
                    Where do you want to <span className="accent">go?</span>
                </>
            ),
            subtitle: "Pick one or more vibes that excite you the most.",
            image: imgVibes,
            control: <VibeCards options={visibleVibes} selected={inputs.vibes} onSelect={(k) => toggleArr("vibes", k)} />,
        },
        {
            key: "travellers",
            title: (
                <>
                    How many are <span className="accent">travelling?</span>
                </>
            ),
            subtitle: "This helps us suggest the best stays and experiences.",
            image: imgTravellers,
            control: (
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => set("travellers", Math.max(1, inputs.travellers - 1))}
                            type="button"
                            aria-label="Fewer travellers"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border text-[18px] font-bold text-[#323232] hover:bg-secondary"
                        >
                            −
                        </button>
                        <span className="inline-flex items-center gap-2 font-display text-[22px] font-bold text-[#323232]">
                            <Users size={20} className="text-[#2475EE]" />
                            {inputs.travellers} {inputs.travellers === 1 ? "Traveller" : "Travellers"}
                        </span>
                        <button
                            onClick={() => set("travellers", Math.min(12, inputs.travellers + 1))}
                            type="button"
                            aria-label="More travellers"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border text-[18px] font-bold text-[#323232] hover:bg-secondary"
                        >
                            +
                        </button>
                    </div>
                    <div>
                        <div className="mb-2 text-[13px] font-semibold text-muted-foreground">Who's travelling?</div>
                        <OptionImageCards
                            options={GROUP_TYPES}
                            selected={[inputs.groupType]}
                            onSelect={(k) => set("groupType", k as GroupType)}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: "date",
            title: (
                <>
                    When do you want to <span className="accent">travel?</span>
                </>
            ),
            subtitle: "Your dates help us find the best availability and prices.",
            image: imgDate,
            control: (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start py-2">
                    <div className="md:col-span-5 flex flex-col justify-start">
                        <div>
                            <h3 className="heading-xl">
                                Select Date range between we can plan your <span className="accent">trip</span>
                            </h3>
                        </div>
                        <div className="mt-6 pt-6 border-t border-[#323232]/5">
                            <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                                Trip duration
                            </div>
                            <Pills
                                options={DURATIONS.map((d) => ({ key: d }))}
                                selected={inputs.duration ? [inputs.duration] : []}
                                onSelect={(k) => selectDuration(k as Duration)}
                                showCheck={false}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <DateRangeCalendar start={inputs.travelStart} end={inputs.travelEnd} onChange={pickCustomDates} />
                    </div>
                </div>
            ),
        },
        {
            key: "stay",
            title: (
                <>
                    What kind of stay do you <span className="accent">prefer?</span>
                </>
            ),
            subtitle: "Highlighted picks fit your destination best.",
            image: imgStay,
            control: (
                <OptionImageCards
                    options={STAYS}
                    selected={[inputs.accommodation]}
                    onSelect={(k) => set("accommodation", k as Accommodation)}
                    gridCols="grid-cols-2 gap-3 sm:grid-cols-3"
                    highlightedKeys={stayHighlights}
                />
            ),
        },
        {
            key: "transport",
            title: (
                <>
                    How do you like to <span className="accent">travel?</span>
                </>
            ),
            subtitle: "Choose your preferred mode of travel — pick all you're open to.",
            image: imgTransport,
            control: (
                <OptionImageCards
                    options={TRANSPORTS}
                    selected={inputs.transports}
                    onSelect={(k) => toggleArr("transports", k)}
                    blockedReasons={transportBlocked}
                    gridCols="grid-cols-2 gap-3 sm:grid-cols-3"
                />
            ),
        },
        {
            key: "experiences",
            title: (
                <>
                    What do you want to <span className="accent">experience?</span>
                </>
            ),
            subtitle: "Pick all that you're excited about — highlighted picks fit your destination.",
            image: imgExperience,
            control: (
                <OptionImageCards
                    options={orderedExperiences.list}
                    selected={inputs.experiences}
                    onSelect={(k) => toggleArr("experiences", k)}
                    gridCols="grid-cols-2 gap-3 md:grid-cols-4"
                    highlightedKeys={orderedExperiences.recommendedKeys}
                />
            ),
        },
        {
            key: "budget",
            title: (
                <>
                    What about your <span className="accent">budget?</span>
                </>
            ),
            subtitle: "It helps us suggest better places for you.",
            image: imgBudget,
            control: (
                <div className="space-y-5">
                    <div>
                        <PriceRangeSlider
                            label="Trip budget"
                            value={Number(inputs.customBudget) || 20000}
                            onChange={(v) => {
                                set("customBudget", String(v));
                                set("cateringCost", "Custom");
                            }}
                            min={1000}
                            max={1000000}
                            step={1000}
                        />
                    </div>
                    <div>
                        <div className="mb-3 text-[13px] font-bold uppercase tracking-wide text-muted-foreground">Budget style</div>
                        <OptionImageCards
                            options={BUDGET_STYLES}
                            selected={inputs.cateringTypes}
                            onSelect={(k) => set("cateringTypes", [k])}
                            gridCols="grid-cols-2 gap-3 sm:grid-cols-4"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: "notes",
            title: (
                <>
                    Anything else you want us to <span className="accent">know?</span>
                </>
            ),
            subtitle: "Tell us your preferences and we'll personalize everything.",
            image: imgNotes,
            control: (
                <NotesChatControl
                    notes={inputs.notes}
                    onNotesChange={(v) => set("notes", v)}
                />
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
          lightens during the intro so the footage reads, then deepens for card contrast.
          Dropped once results land — the rest of the site is light-themed, so results
          fall back to the plain page background instead of staying in the dark cinematic. */}
            {phase === "results" ? (
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[#FFFFFF]" />
            ) : (
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
                        className={`absolute inset-0 transition-colors duration-1000 ${phase === "intro" ? "bg-black/30" : "bg-gradient-to-b from-black/60 via-black/45 to-black/60"
                            }`}
                    />
                </div>
            )}

            <div className="relative z-10">
                <div className={`relative mx-auto px-4 pb-8 pt-10 md:px-6 ${phase === "results" ? "max-w-[1600px]" : phase === "questions" ? "max-w-6xl" : "max-w-5xl"}`}>
                    <button
                        onClick={back}
                        type="button"
                        className={`mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold transition ${phase === "results" ? "text-muted-foreground hover:text-[#323232]" : "text-[#FFFFFF]/80 hover:text-[#FFFFFF]"
                            }`}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1
                        className={`heading-xl ${phase === "results" ? "" : "!text-[#FFFFFF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                            }`}
                    >
                        Built around your <span className="accent">trip.</span>
                    </h1>
                    {phase !== "results" && (
                        <p className="mt-2.5 max-w-xl text-[16.5px] text-[#FFFFFF]/85">
                            A few thoughtful choices are all we need to shape an unforgettable journey, made completely for you.
                        </p>
                    )}
                </div>
            </div>

            <div className={`relative z-10 mx-auto px-4 md:px-6 ${phase === "results" ? "max-w-[1600px]" : phase === "questions" ? "max-w-6xl" : "max-w-5xl"}`}>
                {/* intro — the backdrop video plays solo, a soft hint promises what's coming */}
                {phase === "intro" && (
                    <div className="animate-fadeIn mx-auto flex min-h-[380px] max-w-3xl flex-col items-center justify-center text-center">
                        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FFFFFF]/25 bg-black/30 px-5 py-2.5">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFFFFF]/80" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FFFFFF]" />
                            </span>
                            <span className="text-[13px] font-bold uppercase tracking-wide text-[#FFFFFF]/85">Setting up your trip planner</span>
                        </div>
                        <p className="mt-4 text-[14px] text-[#FFFFFF]/70">Your questions are on their way…</p>
                    </div>
                )}

                {/* the wizard — a wide card, one question at a time, sliding horizontally */}
                {phase === "questions" && (
                    <div className="mx-auto max-w-6xl">
                        <div key={step} className={`${cardAnim} mx-auto w-full max-w-6xl`}>
                            {/* plain white card with a faint blue wash — no photo, so the ink text
                  and controls sit on a clean, high-contrast surface */}
                            <div className="relative flex w-full overflow-hidden rounded-3xl border border-[#FFFFFF]/70 bg-gradient-to-br from-white via-[#f4f8fe] to-[#e7f0fb] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)] md:h-[650px]">
                                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#FFFFFF]/60" />

                                {/* step rail — only a few numbered dots are visible at once, in a capped-height
                                    scroll box (scrollbar hidden) that auto-scrolls so the current step stays centred. */}
                                <div className="relative z-10 hidden w-14 shrink-0 items-center justify-center self-stretch md:flex">
                                <div
                                    className="flex max-h-[196px] flex-col items-center gap-2.5 overflow-y-auto overflow-x-visible py-2 [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_18px,black_calc(100%-18px),transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_18px,black_calc(100%-18px),transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                >
                                    {questions.map((q, i) => {
                                        const state = i === step ? "active" : i <= maxReached ? "done" : "upcoming";
                                        const canJump = state === "done" && !exiting;
                                        return (
                                            <button
                                                key={q.key}
                                                type="button"
                                                disabled={!canJump}
                                                aria-label={`Go to step ${i + 1}`}
                                                aria-current={state === "active" ? "step" : undefined}
                                                onClick={() => goToStep(i)}
                                                ref={(el) => {
                                                    if (state === "active") el?.scrollIntoView({ block: "center" });
                                                }}
                                                className={`flex shrink-0 items-center justify-center rounded-full font-bold transition rounded-2xl ${
                                                    state === "active"
                                                        ? "h-9 w-9 cursor-default bg-[#2475EE] text-[14px] text-[#FFFFFF] shadow-md shadow-[#2475EE]/30"
                                                        : state === "done"
                                                          ? "h-8 w-8 cursor-pointer bg-gray-200 text-[13px] text-gray-400 hover:bg-[#2475EE] hover:text-[#FFFFFF] hover:shadow-md hover:shadow-[#2475EE]/30"
                                                          : "h-8 w-8 cursor-not-allowed text-[13px] text-muted-foreground/40"
                                                }`}
                                            >
                                                {String(i + 1).padStart(2, "0")}
                                            </button>
                                        );
                                    })}
                                </div>
                                </div>

                                <div className="relative z-10 flex min-h-0 flex-1 flex-col p-5 md:px-6 md:py-8">
                                    <div className="mb-1 text-center text-[13px] font-bold tracking-wide text-muted-foreground md:hidden">
                                        <span className="text-[#2475EE]">{String(step + 1).padStart(2, "0")}</span> — {String(total).padStart(2, "0")}
                                    </div>

                                    {/* title + back/continue on one aligned row */}
                                    <div className="flex items-start justify-between gap-4">
                                        {current.key !== "date" ? (
                                            <div>
                                                <h2 className="heading-xl">{current.title}</h2>
                                                <p className="mt-1.5 text-[15px] font-semibold text-[#323232]/60">{current.subtitle}</p>
                                            </div>
                                        ) : (
                                            <div />
                                        )}

                                        {/* back + continue; continue is hidden on the last step, where the
                                            fuller "Show & Get My Trip" CTA takes over at the bottom */}
                                        <div className="flex shrink-0 items-center gap-2.5">
                                            <button
                                                type="button"
                                                onClick={onBack}
                                                disabled={step === 0 || exiting}
                                                aria-label="Back"
                                                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#323232]/10 bg-[#FFFFFF] text-[#323232] transition hover:bg-secondary disabled:pointer-events-none disabled:opacity-30"
                                            >
                                                <ArrowLeft size={20} />
                                            </button>
                                            {!isLast && (
                                                <button
                                                    type="button"
                                                    onClick={onContinue}
                                                    disabled={exiting}
                                                    aria-label="Continue"
                                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2475EE] text-[#FFFFFF] shadow-md shadow-[#2475EE]/30 transition hover:brightness-95 disabled:opacity-70"
                                                >
                                                    <ArrowRight size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="-mx-1.5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1.5 py-5">
                                        {current.control}
                                    </div>

                                    {isLast && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={findTours}
                                                disabled={exiting}
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-2xl bg-[#2475EE] px-6 py-3.5 text-[15px] font-bold text-[#FFFFFF] shadow-lg transition hover:brightness-95 disabled:opacity-70"
                                            >
                                                <Sparkles size={18} /> Show &amp; Get My Trip
                                            </button>
                                        </div>
                                    )}
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
                    <div className="reveal in space-y-8">
                        <TripPass
                            from={inputs.from || "Anywhere"}
                            to={inputs.vibes.join(", ") || "Anywhere"}
                            caption="We've matched your preferences with our premium, verified itineraries."
                            fields={[
                                { label: "Vibes", value: inputs.vibes.join(", ") || "Any" },
                                { label: "Travellers", value: String(inputs.travellers) },
                                { label: "Group", value: inputs.groupType },
                                { label: "Duration", value: inputs.duration || "Custom" },
                                { label: "Travel dates", value: dateLabel || "Flexible" },
                                { label: "Stay", value: inputs.accommodation },
                                { label: "Transport", value: inputs.transports.join(", ") || "Any" },
                                {
                                    label: "Experiences",
                                    value: inputs.experiences.join(", ") || "Open to all",
                                },
                                {
                                    label: "Trip budget",
                                    value: `₹${Number(inputs.customBudget || 20000).toLocaleString("en-IN")}`,
                                },
                                {
                                    label: "Budget style",
                                    value: inputs.cateringTypes.join(", ") || "Any",
                                },
                                ...(inputs.notes.trim()
                                    ? [{ label: "Notes", value: inputs.notes.trim() }]
                                    : []),
                            ]}
                            whatsNext={[
                                `${results.length} handpicked trips for you`,
                                "Best prices & availability",
                                "Real photos & verified stays",
                            ]}
                            onAdjust={startOver}
                        />

                        {/* Hover-to-grow rows, as on the listing grid — the hovered card
                            takes the width its neighbours give back, so each row's width
                            never moves. */}
                        <div ref={gridRef} className="mt-10 flex scroll-mt-6 flex-col gap-y-10 lg:gap-y-14">
                            {resultRows.map((row, i) => (
                                <div
                                    key={i}
                                    className="card-row flex flex-col gap-8 sm:flex-row lg:gap-12"
                                    style={
                                        {
                                            "--cell-grow": 1 + HOVER_GROW,
                                            "--cell-shrink": row.length > 1 ? 1 - HOVER_GROW / (row.length - 1) : 1,
                                        } as CSSProperties
                                    }
                                >
                                    {row.map((pkg) => (
                                        <div key={pkg.id} className="card-cell min-w-0">
                                            <div className="reveal in relative flex flex-col">
                                                <EditorialPackageCard pkg={pkg} />
                                            </div>
                                        </div>
                                    ))}
                                    {/* Keep a short final row aligned with the columns above it. */}
                                    {Array.from({ length: cols - row.length }).map((_, k) => (
                                        <div key={`spacer-${k}`} className="hidden basis-0 grow sm:block" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/** Last-step notes UI:
 *  right-aligned AskDISHA chats — typing dots → "Namaste" → 2nd typing dots → follow-up,
 *  then the large reply box below. Avatars share a fixed column so bubbles
 *  and the input share one clean right edge. */
function NotesChatControl({
    notes,
    onNotesChange,
}: {
    notes: string;
    onNotesChange: (value: string) => void;
}) {
    /** typing → namaste → typing2 → ready */
    const [phase, setPhase] = useState<"typing" | "namaste" | "typing2" | "ready">("typing");

    useEffect(() => {
        // 1s + 45ms + 30ms = 1075ms → first chat "Namaste"
        const namasteAt = 1075;
        const typing2At = namasteAt + 200;
        const readyAt = typing2At + 900;
        const t1 = window.setTimeout(() => setPhase("namaste"), namasteAt);
        const t2 = window.setTimeout(() => setPhase("typing2"), typing2At);
        const t3 = window.setTimeout(() => setPhase("ready"), readyAt);
        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
        };
    }, []);

    const bubble =
        "rounded-2xl rounded-br-md border border-[#323232]/8 bg-[#FFFFFF] px-4 py-3 text-left text-[14.5px] font-medium leading-relaxed text-[#323232] shadow-sm";

    const TypingDots = () => (
        <div className={`flex items-center gap-1.5 ${bubble}`} aria-label="Disha is typing">
            {[0, 150, 300].map((d) => (
                <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-[#2475EE]/55"
                    style={{ animationDelay: `${d}ms` }}
                />
            ))}
        </div>
    );

    const showSecond = phase === "typing2" || phase === "ready";

    return (
        <div className="flex w-full flex-col gap-5">
            {/* shared full-width column: bubble | avatar — matches input width */}
            <div className="flex w-full flex-col gap-3">
                {/* chat 1 — typing, then Namaste */}
                <div className="grid w-full grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-2.5">
                    <div className="flex justify-end">
                        {phase === "typing" ? (
                            <TypingDots />
                        ) : (
                            <div className={`animate-fadeIn ${bubble} text-[15px] font-semibold`}>
                                Namaste
                            </div>
                        )}
                    </div>
                    <img
                        src={imgAskDisha}
                        alt="AskDISHA 2.0"
                        className="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-[#FFFFFF]"
                    />
                </div>

                {/* chat 2 — typing dots, then follow-up */}
                {showSecond && (
                    <div className="animate-fadeIn grid w-full grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-2.5">
                        <div className="flex justify-end">
                            {phase === "typing2" ? (
                                <TypingDots />
                            ) : (
                                <div className={`animate-fadeIn max-w-[min(100%,28rem)] ${bubble}`}>
                                    Almost there — anything else I should keep in mind for your trip?
                                </div>
                            )}
                        </div>
                        <img
                            src={imgAskDisha}
                            alt=""
                            aria-hidden="true"
                            className="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-[#FFFFFF]"
                        />
                    </div>
                )}
            </div>

            {/* large reply box — same width as the chat grid above */}
            {phase === "ready" && (
                <div className="animate-fadeIn relative w-full">
                    <textarea
                        value={notes}
                        maxLength={120}
                        onChange={(e) => onNotesChange(e.target.value)}
                        rows={6}
                        autoFocus
                        placeholder="Type your reply…"
                        className="min-h-[160px] w-full resize-none !rounded-xl border bg-[#FFFFFF] p-4 pb-8 text-[15.5px] font-medium text-[#323232] outline-none focus:border-[#2475EE]"
                    />
                    <span className="pointer-events-none absolute bottom-3 right-3.5 text-[12px] text-muted-foreground">
                        {notes.length}/120
                    </span>
                </div>
            )}
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {options.map((o) => {
                const active = selected.includes(o.key);
                return (
                    <button
                        key={o.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(o.key)}
                        className={`group relative h-44 overflow-hidden rounded-2xl text-left shadow-sm transition duration-200 ${active ? "shadow-xl ring-2 ring-[#2475EE]" : "ring-1 ring-[#323232]/10 hover:ring-[#323232]/20"
                            }`}
                    >
                        <img
                            src={o.image}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                        {active && (
                            <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2475EE] text-[#FFFFFF] shadow-md ring-2 ring-[#FFFFFF]/60">
                                <Check size={13} />
                            </span>
                        )}

                        {/* frosted-glass label */}
                        <div className="absolute inset-x-1.5 bottom-1.5">
                            <div className="rounded-xl border border-[#FFFFFF]/30 bg-transparent px-2 py-1.5">
                                <div className="flex items-center gap-1.5 text-[#FFFFFF]">
                                    <span className="text-[#FFFFFF]/90">{o.icon}</span>
                                    <span className="font-display text-[16.5px] font-bold [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                                        {o.key}
                                    </span>
                                </div>
                                <div className="mt-0.5 text-[12px] font-medium leading-snug text-[#FFFFFF]/85 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]">
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

/** Selectable image content cards (background image + label centered) used for
    the travellers group selection. */
function OptionImageCards({
    options,
    selected,
    onSelect,
    gridCols = "grid-cols-2 gap-3 sm:grid-cols-3",
    blockedReasons,
    highlightedKeys,
}: {
    options: Option[];
    selected: string[];
    onSelect: (key: string) => void;
    gridCols?: string;
    blockedReasons?: Record<string, string | null>;
    /** Keys to flag as recommended given earlier answers (e.g. a stay style that fits
     *  the destination vibe picked earlier) — shown with a saffron ring. */
    highlightedKeys?: string[];
}) {
    return (
        <div className={`grid ${gridCols}`}>
            {options.map((o) => {
                const active = selected.includes(o.key);
                const blocked = blockedReasons?.[o.key];
                const highlighted = !active && !blocked && highlightedKeys?.includes(o.key);
                return (
                    <button
                        key={o.key}
                        type="button"
                        aria-pressed={active}
                        disabled={!!blocked}
                        onClick={() => onSelect(o.key)}
                        className={`group relative h-44 overflow-hidden rounded-2xl text-left shadow-sm transition duration-200 ${
                            blocked
                                ? "cursor-not-allowed opacity-50 grayscale"
                                : active
                                  ? "shadow-xl ring-2 ring-[#2475EE]"
                                  : highlighted
                                    ? "shadow-md ring-2 ring-[#2475EE]/45"
                                    : "ring-1 ring-[#323232]/10 hover:ring-[#323232]/20"
                        }`}
                    >
                        {o.image && (
                            <img
                                src={o.image}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                        {active && (
                            <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2475EE] text-[#FFFFFF] shadow-md ring-2 ring-[#FFFFFF]/60">
                                <Check size={13} />
                            </span>
                        )}

                        {/* frosted-glass label */}
                        <div className="absolute inset-x-1.5 bottom-1.5">
                            <div className="rounded-xl border border-[#FFFFFF]/30 bg-transparent px-2 py-1.5">
                                <div className="flex items-center gap-1.5 text-[#FFFFFF]">
                                    <span className="text-[#FFFFFF]/90">{o.icon}</span>
                                    <span className="font-display text-[16.5px] font-bold [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                                        {o.key}
                                    </span>
                                </div>
                                {(blocked || o.desc) && (
                                    <div className="mt-0.5 text-[12px] font-medium leading-snug text-[#FFFFFF]/85 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]">
                                        {blocked || o.desc}
                                    </div>
                                )}
                            </div>
                        </div>
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
    highlighted,
}: {
    options: PillOption[];
    selected: string[];
    onSelect: (key: string) => void;
    showCheck?: boolean;
    /** Keys to flag as recommended given earlier answers (e.g. experiences that fit
     *  the destination vibe picked earlier) — shown with a small sparkle + brand tint. */
    highlighted?: string[];
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((o) => {
                const active = selected.includes(o.key);
                const suggested = !active && highlighted?.includes(o.key);
                return (
                    <button
                        key={o.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(o.key)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition ${active
                                ? "border-[#2475EE] bg-[#2475EE]/10 text-[#2475EE]"
                                : suggested
                                  ? "border-[#2475EE]/30 bg-[#2475EE]/[0.04] text-[#323232] hover:bg-[#2475EE]/10"
                                  : "bg-[#FFFFFF] text-[#323232] hover:bg-secondary"
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

    // In JavaScript getDay() returns: 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
    // If we want Monday to be the first column (index 0) and Sunday the last (index 6):
    const rawDay = new Date(y, m, 1).getDay();
    const firstWeekday = rawDay === 0 ? 6 : rawDay - 1;

    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const monthName = view.toLocaleDateString("en-IN", { month: "long" });

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
        <div className="rounded-3xl border border-[#323232]/5 bg-[#FFFFFF] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-w-md mx-auto">
            <div className="mb-5 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setView(new Date(y, m - 1, 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2475EE] text-[#FFFFFF] shadow-md shadow-[#2475EE]/20 hover:brightness-95 transition"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-1 font-display text-[17px] font-bold text-[#323232]">
                    <span>{monthName}</span>
                    <span className="text-[#2475EE] text-[10px] translate-y-[0.5px]">▼</span>
                    <span className="ml-1">{y}</span>
                    <span className="text-[#2475EE] text-[10px] translate-y-[0.5px]">▼</span>
                </div>
                <button
                    type="button"
                    onClick={() => setView(new Date(y, m + 1, 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2475EE] text-[#FFFFFF] shadow-md shadow-[#2475EE]/20 hover:brightness-95 transition"
                    aria-label="Next month"
                >
                    <ChevronRight size={18} strokeWidth={2.5} />
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[12px] font-bold uppercase text-muted-foreground tracking-wider mb-3">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div key={d} className="py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1.5 text-center">
                {cells.map((day, i) => {
                    if (day === null) return <div key={`b${i}`} />;
                    const d = new Date(y, m, day);
                    const dISO = iso(d);
                    const past = d < today;
                    const isStart = dISO === start;
                    const isEnd = dISO === end;
                    const isEdge = isStart || isEnd;
                    const inRange = !!start && !!end && dISO > start && dISO < end;

                    return (
                        <div
                            key={dISO}
                            className={`h-10 w-full flex justify-center items-center ${
                                inRange
                                    ? "bg-[#2475EE]/10 text-[#2475EE]"
                                    : isStart && end
                                        ? "bg-gradient-to-r from-transparent to-brand/10 rounded-l-full"
                                        : isEnd && start
                                            ? "bg-gradient-to-l from-transparent to-brand/10 rounded-r-full"
                                            : ""
                            }`}
                        >
                            <button
                                type="button"
                                disabled={past}
                                onClick={() => pick(day)}
                                className={`flex h-10 w-10 items-center justify-center text-[14px] font-bold transition ${
                                    past
                                        ? "text-muted-foreground/35 cursor-not-allowed"
                                        : isEdge
                                            ? "bg-[#2475EE] text-[#FFFFFF] rounded-full shadow-md"
                                            : inRange
                                                ? "text-[#2475EE] hover:bg-[#2475EE]/20 rounded-none"
                                                : "text-[#323232] hover:bg-secondary rounded-full"
                                }`}
                            >
                                {day}
                            </button>
                        </div>
                    );
                })}
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
            <div className="absolute inset-0 flex items-center justify-center font-display text-[22px] font-bold text-[#323232]">
                {value}%
            </div>
        </div>
    );
}

/** Vande Bharat loco mascot for the interstitial loader.
 *  Asset faces left — mirrored so the nose points into the motion (streaks whoosh left). */
function VandeBharatTrain() {
    return (
        <img
            src={vandeBharatLoco}
            alt="Vande Bharat train"
            className="h-[190px] w-[540px] -scale-x-100 object-contain object-bottom"
        />
    );
}

/** The between-groups loader: the train bobs while speed streaks whoosh past, selling
    the idea that we're off fetching and shortlisting on the traveller's behalf. */
function VandeBharatLoader({ title, sub }: { title: string; sub: string }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="animate-fadeIn mx-auto flex min-h-[380px] max-w-3xl flex-col items-center justify-center px-6 py-14 text-center"
        >
            <div className="relative h-[200px] w-[min(100%,560px)]">
                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded bg-[#FFFFFF]/25" />
                <span className="vb-streak" style={{ top: 52 }} />
                <span className="vb-streak" style={{ top: 86, animationDelay: "0.28s" }} />
                <span className="vb-streak" style={{ top: 120, animationDelay: "0.56s" }} />
                <div className="vb-bob absolute -bottom-1 left-1/2">
                    <VandeBharatTrain />
                </div>
            </div>
            <div className="mt-7 font-display text-[19px] font-bold text-[#FFFFFF]">
                {title}
                <span className="vb-dots" />
            </div>
            <div className="mt-1.5 text-[13px] text-[#FFFFFF]/70">{sub}</div>
        </div>
    );
}
