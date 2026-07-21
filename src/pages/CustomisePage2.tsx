import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
    ChefHat,
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
    UtensilsCrossed,
    Wallet,
    Waves,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages } from "@/data/packages";
import type { BudgetBand, Experience, TourPackage, TravelMode } from "@/types";
import { EditorialPackageCard } from "@/components/package/EditorialPackageCard";
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
import imgCityNewDelhi from "@/assets/cutomise2/new-delhi.jpg";
import imgCityMumbai from "@/assets/cutomise2/mumbai.jpg";
import imgCityBengaluru from "@/assets/cutomise2/bengaluru.jpg";
import imgCityChennai from "@/assets/cutomise2/chennai.jpg";

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
        image: "https://images.unsplash.com/photo-1611891405120-449e7e78072e?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1585983224974-084a8e065e76?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=600&q=80",
    },
];

const EXPERIENCES: Option[] = [
    {
        key: "Adventure",
        icon: <Compass size={13} />,
        desc: "Thrilling outdoor sports & activities",
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Trekking",
        icon: <Footprints size={13} />,
        desc: "Mountain trails & hiking adventures",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Photography",
        icon: <Camera size={13} />,
        desc: "Scenic viewpoints & landscape shoots",
        image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Temple visits",
        icon: <Landmark size={13} />,
        desc: "Spiritual tours & sacred temples",
        image: "https://images.unsplash.com/photo-1602631985686-2bb0686a6ae6?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Wildlife",
        icon: <Bird size={13} />,
        desc: "Jungle safaris & animal sightings",
        image: "https://images.unsplash.com/photo-1475809913362-28a064062ccd?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Waterfalls",
        icon: <Waves size={13} />,
        desc: "Majestic cascades & natural pools",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Local food",
        icon: <Utensils size={13} />,
        desc: "Traditional street food & regional cuisine",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Shopping",
        icon: <ShoppingBag size={13} />,
        desc: "Bustling bazaars & handicraft stalls",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "History",
        icon: <History size={13} />,
        desc: "Forts, palaces & archaeological sites",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Nightlife",
        icon: <Moon size={13} />,
        desc: "City clubs, bars & evening entertainment",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Wellness",
        icon: <Leaf size={13} />,
        desc: "Spa therapies, yoga & retreats",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Snow",
        icon: <Snowflake size={13} />,
        desc: "Snow activities & winter sports",
        image: "https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Culture",
        icon: <Landmark size={13} />,
        desc: "Folk arts, craft walks & local heritage",
        image: "https://images.unsplash.com/photo-1561375750-7e28df959775?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Tea gardens",
        icon: <Leaf size={13} />,
        desc: "Scenic estate walks & tea tastings",
        image: "https://images.unsplash.com/photo-1563889362-49e07584bd8c?auto=format&fit=crop&w=600&q=80",
    },
];

/** Quick-fill shortcuts for the food-budget input — clicking one fills the amount in
 *  rather than acting as an exclusive radio choice, so typing a custom number always works too. */
const CATERING_TYPES: Option[] = [
    {
        key: "Traditional",
        icon: <UtensilsCrossed size={16} />,
        desc: "Local authentic thalis & classic dishes",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Continental",
        icon: <Utensils size={16} />,
        desc: "Western, Italian & European favorites",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Gourmet",
        icon: <ChefHat size={16} />,
        desc: "Fine dining & premium chef specialties",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    },
    {
        key: "Regional",
        icon: <MapPin size={16} />,
        desc: "State specialties & popular street food",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80",
    },
];
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
            title: (
                <>
                    Where are you <span className="text-brand">starting</span> from?
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
                            className="w-full rounded-xl border bg-white py-3 pl-10 pr-3.5 text-[15.5px] font-semibold text-ink outline-none focus:border-brand"
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
                                    className={`group relative h-44 overflow-hidden rounded-2xl text-left shadow-sm transition ${active ? "ring-2 ring-brand ring-offset-2 ring-offset-white" : "ring-1 ring-black/10 hover:ring-black/20"
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
                                        <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-md ring-2 ring-white/60">
                                            <Check size={13} />
                                        </span>
                                    )}

                                    {/* frosted-glass label */}
                                    <div className="absolute inset-x-1.5 bottom-1.5">
                                        <div className="rounded-xl border border-white/30 bg-transparent px-2 py-1.5">
                                            <span className="flex items-center gap-1.5 font-display text-[16.5px] font-bold text-white [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                                                <MapPin size={16} className="text-white/90" />
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
                    Where do you want to <span className="text-brand">go</span>?
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
                    How many are <span className="text-brand">travelling</span>?
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
                            className="flex h-11 w-11 items-center justify-center rounded-xl border text-[18px] font-bold text-ink hover:bg-secondary"
                        >
                            −
                        </button>
                        <span className="inline-flex items-center gap-2 font-display text-[22px] font-bold text-ink">
                            <Users size={20} className="text-brand" />
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
                    When do you want to <span className="text-brand">travel</span>?
                </>
            ),
            subtitle: "Your dates help us find the best availability and prices.",
            image: imgDate,
            control: (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start py-2">
                    <div className="md:col-span-5 flex flex-col justify-start">
                        <div>
                            <h3 className="font-display text-[20px] font-bold leading-tight text-ink md:text-[25px]">
                                Select Date range between we can plan your trip
                            </h3>
                        </div>
                        <div className="mt-6 pt-6 border-t border-black/5">
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
                    What kind of <span className="text-brand">stay</span> do you prefer?
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
                    How do you like to <span className="text-brand">travel</span>?
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
                    What do you want to <span className="text-brand">experience</span>?
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
            key: "food",
            title: (
                <>
                    And what about <span className="text-brand">food</span>?
                </>
            ),
            subtitle: "It helps us suggest better places for you.",
            image: imgFood,
            control: (
                <div className="space-y-5">
                    <div>
                        <PriceRangeSlider
                            label="Food budget"
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
                        <div className="mb-3 text-[13px] font-bold uppercase tracking-wide text-muted-foreground">Cuisine style</div>
                        <OptionImageCards
                            options={CATERING_TYPES}
                            selected={inputs.cateringTypes}
                            onSelect={(k) => toggleArr("cateringTypes", k)}
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
                    Anything else you want us to <span className="text-brand">know</span>?
                </>
            ),
            subtitle: "Tell us your preferences and we'll personalize everything.",
            image: imgNotes,
            control: (
                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={inputs.notes}
                            maxLength={120}
                            onChange={(e) => set("notes", e.target.value)}
                            rows={4}
                            placeholder="E.g. no spicy food, quiet places, accessible stays, extra comfort, etc."
                            className="w-full resize-none rounded-xl border bg-white p-3.5 pb-7 text-[15.5px] font-medium text-ink outline-none focus:border-brand"
                        />
                        <span className="pointer-events-none absolute bottom-2.5 right-3 text-[12px] text-muted-foreground">
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
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition ${active ? "border-brand bg-brand/10 text-brand" : "bg-white text-ink hover:bg-secondary"
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
          lightens during the intro so the footage reads, then deepens for card contrast.
          Dropped once results land — the rest of the site is light-themed, so results
          fall back to the plain page background instead of staying in the dark cinematic. */}
            {phase === "results" ? (
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-white" />
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
                        className={`mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold transition ${phase === "results" ? "text-muted-foreground hover:text-ink" : "text-white/80 hover:text-white"
                            }`}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1
                        className={`heading-xl text-[48px] md:text-[58px] ${phase === "results" ? "text-ink" : "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                            }`}
                    >
                        Built around <span className="text-saffron">your</span> trip.
                    </h1>
                    {phase !== "results" && (
                        <p className="mt-2.5 max-w-xl text-[16.5px] text-white/85">
                            A few thoughtful choices are all we need to shape an unforgettable journey, made completely for you.
                        </p>
                    )}
                </div>
            </div>

            <div className={`relative z-10 mx-auto px-4 md:px-6 ${phase === "results" ? "max-w-[1600px]" : phase === "questions" ? "max-w-6xl" : "max-w-5xl"}`}>
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
                    <div className="mx-auto max-w-6xl">
                        <div key={step} className={`${cardAnim} mx-auto w-full max-w-6xl`}>
                            {/* plain white card with a faint blue wash — no photo, so the ink text
                  and controls sit on a clean, high-contrast surface */}
                            <div className="relative flex w-full overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-[#f4f8fe] to-[#e7f0fb] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)] md:h-[650px]">
                                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60" />

                                {/* step rail — only a few numbered dots are visible at once, in a capped-height
                                    scroll box (scrollbar hidden) that auto-scrolls so the current step stays centred. */}
                                <div className="relative z-10 hidden w-14 shrink-0 items-center justify-center self-stretch md:flex">
                                <div
                                    className="flex max-h-[196px] flex-col items-center gap-2.5 overflow-y-auto overflow-x-visible py-2 [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_18px,black_calc(100%-18px),transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_18px,black_calc(100%-18px),transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                >
                                    {questions.map((q, i) => {
                                        const state = i === step ? "active" : i < step ? "done" : "upcoming";
                                        return (
                                            <span
                                                key={q.key}
                                                ref={(el) => {
                                                    if (state === "active") el?.scrollIntoView({ block: "center" });
                                                }}
                                                className={`flex shrink-0 items-center justify-center rounded-full font-bold transition ${
                                                    state === "active"
                                                        ? "h-9 w-9 bg-brand text-[14px] text-white shadow-md shadow-brand/30"
                                                        : state === "done"
                                                          ? "h-8 w-8 bg-[#64748b] text-[13px] text-white"
                                                          : "h-8 w-8 text-[13px] text-muted-foreground/40"
                                                }`}
                                            >
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        );
                                    })}
                                </div>
                                </div>

                                <div className="relative z-10 flex min-h-0 flex-1 flex-col p-5 md:px-6 md:py-8">
                                    <div className="mb-1 text-center text-[13px] font-bold tracking-wide text-muted-foreground md:hidden">
                                        <span className="text-brand">{String(step + 1).padStart(2, "0")}</span> — {String(total).padStart(2, "0")}
                                    </div>

                                    {/* title + back/continue on one aligned row */}
                                    <div className="flex items-start justify-between gap-4">
                                        {current.key !== "date" ? (
                                            <div>
                                                <h2 className="font-display text-[25px] font-bold leading-tight text-ink md:text-[29px]">{current.title}</h2>
                                                <p className="mt-1.5 text-[15px] font-semibold text-ink/60">{current.subtitle}</p>
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
                                                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition hover:bg-secondary disabled:pointer-events-none disabled:opacity-30"
                                            >
                                                <ArrowLeft size={20} />
                                            </button>
                                            {!isLast && (
                                                <button
                                                    type="button"
                                                    onClick={onContinue}
                                                    disabled={exiting}
                                                    aria-label="Continue"
                                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/30 transition hover:brightness-95 disabled:opacity-70"
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
                                                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:opacity-70"
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
                                { label: "Travellers", value: `${inputs.travellers} · ${inputs.groupType}` },
                                { label: "Duration", value: dateLabel || inputs.duration || "Flexible" },
                                { label: "Transport", value: inputs.transports.join(", ") },
                                { label: "Stay", value: inputs.accommodation },
                                { label: "Interests", value: inputs.experiences.slice(0, 3).join(", ") || "Open to all" },
                                { label: "Pass no.", value: `IR-${(results[0]?.id ?? "TRIP").toUpperCase()}`, code: true },
                            ]}
                            whatsNext={[
                                `${results.length} handpicked trips for you`,
                                "Best prices & availability",
                                "Real photos & verified stays",
                            ]}
                            ctaLabel="Show My Trips"
                            onShowTrips={() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            onAdjust={startOver}
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
                        className={`group relative h-44 overflow-hidden rounded-2xl text-left shadow-sm transition duration-200 ${active ? "shadow-xl ring-2 ring-brand" : "ring-1 ring-black/10 hover:ring-black/20"
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
                            <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-md ring-2 ring-white/60">
                                <Check size={13} />
                            </span>
                        )}

                        {/* frosted-glass label */}
                        <div className="absolute inset-x-1.5 bottom-1.5">
                            <div className="rounded-xl border border-white/30 bg-transparent px-2 py-1.5">
                                <div className="flex items-center gap-1.5 text-white">
                                    <span className="text-white/90">{o.icon}</span>
                                    <span className="font-display text-[16.5px] font-bold [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                                        {o.key}
                                    </span>
                                </div>
                                <div className="mt-0.5 text-[12px] font-medium leading-snug text-white/85 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]">
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
                                  ? "shadow-xl ring-2 ring-brand"
                                  : highlighted
                                    ? "shadow-md ring-2 ring-brand/45"
                                    : "ring-1 ring-black/10 hover:ring-black/20"
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
                            <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-md ring-2 ring-white/60">
                                <Check size={13} />
                            </span>
                        )}

                        {/* frosted-glass label */}
                        <div className="absolute inset-x-1.5 bottom-1.5">
                            <div className="rounded-xl border border-white/30 bg-transparent px-2 py-1.5">
                                <div className="flex items-center gap-1.5 text-white">
                                    <span className="text-white/90">{o.icon}</span>
                                    <span className="font-display text-[16.5px] font-bold [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
                                        {o.key}
                                    </span>
                                </div>
                                {(blocked || o.desc) && (
                                    <div className="mt-0.5 text-[12px] font-medium leading-snug text-white/85 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]">
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
                                ? "border-brand bg-brand/10 text-brand"
                                : suggested
                                  ? "border-brand/30 bg-brand/[0.04] text-ink hover:bg-brand/10"
                                  : "bg-white text-ink hover:bg-secondary"
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
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-w-md mx-auto">
            <div className="mb-5 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setView(new Date(y, m - 1, 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/20 hover:brightness-95 transition"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-1 font-display text-[17px] font-bold text-ink">
                    <span>{monthName}</span>
                    <span className="text-brand text-[10px] translate-y-[0.5px]">▼</span>
                    <span className="ml-1">{y}</span>
                    <span className="text-brand text-[10px] translate-y-[0.5px]">▼</span>
                </div>
                <button
                    type="button"
                    onClick={() => setView(new Date(y, m + 1, 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/20 hover:brightness-95 transition"
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
                                    ? "bg-brand/10 text-brand"
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
                                            ? "bg-[#1a56db] text-white rounded-full shadow-md"
                                            : inRange
                                                ? "text-[#1a56db] hover:bg-brand/20 rounded-none"
                                                : "text-ink hover:bg-secondary rounded-full"
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
        <img
            src="/vandeBharat.png"
            alt="Vande Bharat train"
            className="h-[110px] w-[340px] object-contain"
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
            className="animate-fadeIn mx-auto flex min-h-[380px] max-w-3xl flex-col items-center justify-center rounded-3xl border border-white/20 bg-black/35 px-6 py-14 text-center shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]"
        >
            <div className="relative h-[140px] w-[380px]">
                <div className="absolute bottom-4 left-0 right-0 h-[2px] rounded bg-white/25" />
                <span className="vb-streak" style={{ top: 40 }} />
                <span className="vb-streak" style={{ top: 62, animationDelay: "0.28s" }} />
                <span className="vb-streak" style={{ top: 84, animationDelay: "0.56s" }} />
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
