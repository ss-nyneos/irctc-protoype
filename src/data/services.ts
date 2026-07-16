export type IconKey =
  | "plane"
  | "hotel"
  | "bus"
  | "door"
  | "sofa"
  | "luggage"
  | "trainfront"
  | "landmark"
  | "fan"
  | "ship"
  | "mountain"
  | "tag"
  | "crown"
  | "gem";

export type Tone =
  | "sky"
  | "violet"
  | "amber"
  | "emerald"
  | "rose"
  | "navy"
  | "azure"
  | "teal";

export interface ServiceItem {
  label: string;
  sub: string;
  icon: IconKey;
  url: string;
  tone: Tone;
}

export interface ServiceGroup {
  group: string;
  items: ServiceItem[];
}

export const IRCTC_MAIN = "https://www.irctc.co.in/";
export const IRCTC_TOURISM = "https://www.irctctourism.com/";
export const IRCTC_ECATERING = "https://www.ecatering.irctc.co.in/";

// Per-service booking destinations (official IRCTC sub-portals).
export const IRCTC_HOTELS = "https://www.hotels.irctc.co.in/hotels";
export const IRCTC_FLIGHTS = "https://www.air.irctc.co.in/";
export const IRCTC_BUS = "https://www.bus.irctc.co.in/home";
export const IRCTC_RETIRING_ROOM = "https://www.rr.irctc.co.in/home#/home/";
export const IRCTC_LOUNGE = "https://www.irctctourism.com/accommodation";
export const IRCTC_BHARAT_GAURAV = "https://www.irctctourism.com/bharatgaurav";
export const IRCTC_BUDDHIST_TRAIN = "https://www.irctcbuddhisttrain.com/";
export const IRCTC_FERRY = "https://www.irctctourism.com/cruise/ferry";
export const IRCTC_HELI_YATRA = "https://www.heliyatra.irctc.co.in/";
export const IRCTC_TREK = "https://www.irctctourism.com/adventure/trekhome";
export const IRCTC_MAHARAJAS = "https://www.the-maharajas.com/";
export const IRCTC_GOLDEN_CHARIOT = "https://www.goldenchariot.org/";

export const serviceGroups: ServiceGroup[] = [
  {
    group: "Book & Travel",
    items: [
      { label: "Flights", sub: "Domestic & international", icon: "plane", url: IRCTC_FLIGHTS, tone: "sky" },
      { label: "Hotels", sub: "Stays across India", icon: "hotel", url: IRCTC_HOTELS, tone: "violet" },
      { label: "Bus Tickets", sub: "Intercity & sleeper", icon: "bus", url: IRCTC_BUS, tone: "amber" },
      { label: "Retiring Room", sub: "At railway stations", icon: "door", url: IRCTC_RETIRING_ROOM, tone: "emerald" },
      { label: "Lounge", sub: "Executive lounges", icon: "sofa", url: IRCTC_LOUNGE, tone: "rose" },
    ],
  },
  {
    group: "Tourism & Experiences",
    items: [
      { label: "Tour Packages", sub: "Curated holidays", icon: "luggage", url: IRCTC_TOURISM, tone: "navy" },
      { label: "Bharat Gaurav", sub: "Themed circuit trains", icon: "trainfront", url: IRCTC_BHARAT_GAURAV, tone: "azure" },
      { label: "Buddhist Train", sub: "Sacred Buddhist circuit", icon: "landmark", url: IRCTC_BUDDHIST_TRAIN, tone: "amber" },
      { label: "Heli Yatra", sub: "Char Dham by helicopter", icon: "fan", url: IRCTC_HELI_YATRA, tone: "sky" },
      { label: "Ferry", sub: "Coastal & island cruises", icon: "ship", url: IRCTC_FERRY, tone: "teal" },
      { label: "Trek", sub: "Guided Himalayan treks", icon: "mountain", url: IRCTC_TREK, tone: "emerald" },
      { label: "TAG", sub: "Travel Assistance Guide", icon: "tag", url: IRCTC_TOURISM, tone: "violet" },
    ],
  },
  {
    group: "Luxury Trains",
    items: [
      { label: "Maharajas' Express", sub: "World's leading luxury train", icon: "crown", url: IRCTC_MAHARAJAS, tone: "rose" },
      { label: "Golden Chariot", sub: "Pride of the South", icon: "gem", url: IRCTC_GOLDEN_CHARIOT, tone: "violet" },
    ],
  },
];
