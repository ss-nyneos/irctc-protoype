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

export const serviceGroups: ServiceGroup[] = [
  {
    group: "Book & Travel",
    items: [
      { label: "Flights", sub: "Domestic & international", icon: "plane", url: "https://www.air.irctc.co.in/", tone: "sky" },
      { label: "Hotels", sub: "Stays across India", icon: "hotel", url: IRCTC_TOURISM, tone: "violet" },
      { label: "Bus Tickets", sub: "Intercity & sleeper", icon: "bus", url: "https://www.bus.irctc.co.in/", tone: "amber" },
      { label: "Retiring Room", sub: "At railway stations", icon: "door", url: IRCTC_TOURISM, tone: "emerald" },
      { label: "Lounge", sub: "Executive lounges", icon: "sofa", url: IRCTC_TOURISM, tone: "rose" },
    ],
  },
  {
    group: "Tourism & Experiences",
    items: [
      { label: "Tour Packages", sub: "Curated holidays", icon: "luggage", url: IRCTC_TOURISM, tone: "navy" },
      { label: "Bharat Gaurav", sub: "Themed circuit trains", icon: "trainfront", url: IRCTC_TOURISM, tone: "azure" },
      { label: "Buddhist Train", sub: "Sacred Buddhist circuit", icon: "landmark", url: IRCTC_TOURISM, tone: "amber" },
      { label: "Heli Yatra", sub: "Char Dham by helicopter", icon: "fan", url: IRCTC_TOURISM, tone: "sky" },
      { label: "Ferry", sub: "Coastal & island cruises", icon: "ship", url: IRCTC_TOURISM, tone: "teal" },
      { label: "Trek", sub: "Guided Himalayan treks", icon: "mountain", url: IRCTC_TOURISM, tone: "emerald" },
      { label: "TAG", sub: "Travel Assistance Guide", icon: "tag", url: IRCTC_TOURISM, tone: "violet" },
    ],
  },
  {
    group: "Luxury Trains",
    items: [
      { label: "Maharajas' Express", sub: "World's leading luxury train", icon: "crown", url: "https://www.the-maharajas.com/", tone: "rose" },
      { label: "Golden Chariot", sub: "Pride of the South", icon: "gem", url: "https://www.goldenchariot.org/", tone: "violet" },
    ],
  },
];
