export type TravelMode = "Rail + Road" | "Train" | "Air" | "Luxury Train";
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

export interface TourPackage {
  id: string;
  name: string;
  category: string;
  region: string;
  from: string;
  nights: number;
  days: number;
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

export interface PolicySection {
  title: string;
  points: string[];
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
  | { name: "world"; category?: string }
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
