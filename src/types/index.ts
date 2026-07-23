import type { InclusionKey } from "@/utils/inclusions";

/** "Road" covers the packages IRCTC sells with no train and no flight leg —
 *  cab or coach only, joined at the destination city. */
export type TravelMode = "Rail + Road" | "Train" | "Air" | "Road" | "Luxury Train";
export type Climate = "Cool" | "Moderate" | "Warm" | "Tropical";
export type BudgetBand = "Value" | "Comfort" | "Premium" | "Luxury";
export type Experience =
  | "spiritual"
  | "family"
  | "nature"
  | "honeymoon"
  | "adventure"
  | "culture"
  | "luxury";

export interface ItineraryDay {
  day: number;
  title: string;
  detail: string;
}

/**
 * The fields IRCTC itself publishes on a listing row. These are read straight
 * out of `tourDetail.json` and must never be edited by hand — the live site is
 * the source of truth for every one of them.
 */
export interface IrctcListing {
  /** IRCTC package code, e.g. "SEH035". */
  code: string;
  name: string;
  nights: number;
  days: number;
  /** IRCTC's own wording, e.g. "4 Nights/5 Days" or "1 Day". */
  durationLabel: string;
  origin: string;
  destination: string;
  /** Which days the package runs, e.g. "All Days (Except Friday)". */
  departure: string;
  /** "Upcoming Date Of Journey", printed as DD-MMM-YY. */
  nextDeparture: string;
  /** The inclusion icon row, in IRCTC's own order. */
  inclusions: InclusionKey[];
  /** "Starting from" fare, in rupees. */
  price: number;
}

export interface TourPackage {
  id: string;
  /** IRCTC package code — the join key back into `tourDetail.json`. */
  code: string;
  name: string;
  category: string;
  /** IRCTC's "Destination" string, verbatim. */
  region: string;
  /** IRCTC's "Origin" string, verbatim. */
  from: string;
  nights: number;
  days: number;
  durationLabel: string;
  departure: string;
  nextDeparture: string;
  /** IRCTC's inclusion icons. Distinct from `inclusions`, which is prose. */
  inclusionKeys: InclusionKey[];
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  travelMode: TravelMode;
  climate: Climate;
  budgetBand: BudgetBand;
  experience: Experience[];
  tags: string[];
  grad: [string, string];
  img: string;
  photoUrl?: string;
  blurb: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  aiReason: string;
  flightAddon: number;
}

/** Carriage livery — each train's real-world colours, painted on its roof and frame. */
export interface TrainLivery {
  /** Roof gradient, light → dark. */
  roof: [string, string];
  /** Left/right frame (the thick side pillars). */
  side: string;
  /** Top/bottom edging. */
  trim: string;
}

export interface LuxuryTrain {
  id: string;
  name: string;
  tag: string;
  route: string;
  grad: [string, string];
  livery: TrainLivery;
  /** Local image module path (imported asset URL) */
  img: string;
}

export interface Destination {
  name: string;
  region: string;
  grad: [string, string];
  img: string;
}

export interface Offer {
  code: string;
  title: string;
  sub: string;
  grad: [string, string];
}

/** A halt where travellers may join or leave a tourist-train package. IRCTC
 *  publishes these as "boarding/de-boarding points" with tentative timings. */
export interface BoardingPoint {
  station: string;
  /** Indian Railways station code, e.g. "SC" for Secunderabad. */
  code: string;
  /** 24h "HH:MM". null at the originating halt, which has no arrival. */
  arr: string | null;
  /** 24h "HH:MM". null at the final halt, which has no departure. */
  dep: string | null;
}

/** A comfort tier the same package sells at — coach class on rail, hotel
 *  category on air. Each carries its own per-person fare. */
export interface CoachClass {
  /** Booking-chart code, e.g. "3AC". */
  code: string;
  /** IRCTC's category name — "Economy", "Standard", "Comfort". */
  label: string;
  detail: string;
  /** Adult fare, per person. */
  price: number;
  /** Fare for a child aged 5–11, per person. */
  childPrice: number;
  /** Classes sell out independently; an unavailable one can't be booked. */
  available: boolean;
  seatsLeft: number;
}

/** One rung of the cancellation ladder: what is withheld when you cancel this
 *  many days before the tour starts. */
export interface CancellationBand {
  label: string;
  /** `null` at the last-minute rung, which has no lower bound. */
  minDays: number | null;
  /** `null` at the earliest rung, which has no upper bound. */
  maxDays: number | null;
  /** Flat per-passenger deduction in rupees. Mutually exclusive with `percent`. */
  flat?: number;
  /** Share of the package cost withheld, 0–100. */
  percent?: number;
}

/** A named cluster of conduct rules — "Attire", "Safety and security". */
export interface PolicyTopic {
  title: string;
  points: string[];
}

/** A block of the terms. Exactly one of `points`, `bands` or `topics` is set;
 *  `PolicyPanel` picks its renderer from whichever is present. */
export interface PolicySection {
  title: string;
  points?: string[];
  bands?: CancellationBand[];
  topics?: PolicyTopic[];
}

/** The booking-desk detail IRCTC publishes per package. Kept apart from the
 *  catalogue fields in `TourPackage`, which are what cards and filters read. */
export interface PackageDetail {
  /** IRCTC package code, e.g. "SCZBG63". */
  code: string;
  /** IRCTC's "Departure" — which days the package runs, e.g. "All Days (Except Friday)". */
  departure: string;
  /** IRCTC's "Upcoming Date Of Journey", printed as DD-MMM-YY. */
  nextDeparture: string;
  classes: CoachClass[];
  /** Empty for air packages, which have no rail boarding chain. */
  boarding: BoardingPoint[];
  departures: string[];
  policy: PolicySection[];
}

/** Custom in-app "router" view state — this app is a single page with
 *  view-switching handled entirely on the client (no URL routing). */
export type View =
  | { name: "preload" }
  | { name: "home" }
  | { name: "world"; category?: string; fromPlace?: string }
  | { name: "customise" }
  | { name: "madeforyou" }
  | { name: "detail"; id: string }
  /** Choices made on the detail page ride along so the booking form opens
   *  prefilled rather than asking twice. */
  | {
      name: "booking";
      id: string;
      classCode?: string;
      departure?: string;
      boarding?: string;
      travellers?: number;
    };
