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

/** Custom in-app "router" view state — this app is a single page with
 *  view-switching handled entirely on the client (no URL routing). */
export type View =
  | { name: "home" }
  | { name: "world" }
  | { name: "customise" }
  | { name: "madeforyou" }
  | { name: "detail"; id: string }
  | { name: "booking"; id: string };
