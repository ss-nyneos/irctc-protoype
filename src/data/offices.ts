import type { BoardingPoint, TourPackage } from "@/types";

/**
 * IRCTC zonal tourism offices — the "Contact us" tab on irctctourism.com, which
 * ships as a bare city/details table. The addresses and desk numbers are the
 * published ones; the per-person mailboxes on the live site are dropped in
 * favour of the zone desks, which is what a traveller should be writing to
 * anyway.
 */
export interface TourismOffice {
  /** IRCTC zone the office speaks for, e.g. "North". */
  zone: string;
  city: string;
  address: string;
  /** Desk line first — it is the one we surface before the fold. */
  phones: string[];
  emails: string[];
  /**
   * Origin cities and boarding station codes this office handles. Matched
   * against the package's `from` and its boarding chain to decide which office
   * to float to the top.
   */
  serves: string[];
}

export const tourismOffices: TourismOffice[] = [
  {
    zone: "North",
    city: "New Delhi",
    address: "IRCTC Tourist Facilitation Centre, Platform No. 16, New Delhi Railway Station",
    phones: ["011-2334-0000", "8287930712", "8287930620", "8287930751"],
    emails: ["tourismnz@irctc.com", "exetourismnz@irctc.com"],
    serves: ["Delhi", "New Delhi", "NDLS", "DLI", "NZM", "GZB"],
  },
  {
    zone: "North",
    city: "Chandigarh",
    address: "IRCTC Regional Office, SCO-150-151-152, Ground Floor, Sector 34-A, Chandigarh",
    phones: ["0172-464-5795", "7888696843", "8595930980"],
    emails: ["tourism.cdg@irctc.com"],
    serves: ["Chandigarh", "CDG", "UMB", "Amritsar", "ASR"],
  },
  {
    zone: "North",
    city: "Jaipur",
    address:
      "IRCTC Regional Office, First Floor, Jeevan Prakash Building (North Side), Ambedkar Circle, Bhawani Singh Road, Jaipur 302005",
    phones: ["9001094705", "8595930997", "8595930986"],
    emails: ["tourismjp@irctc.com"],
    serves: ["Jaipur", "JP", "Jodhpur", "JU", "Udaipur", "UDZ", "Ajmer", "AII"],
  },
  {
    zone: "North",
    city: "Lucknow",
    address: "IRCTC Regional Office, C-13, 2nd Floor, Paryatan Bhawan, Gomti Nagar, Lucknow",
    phones: ["8287930908", "8287930909", "8287930912"],
    emails: ["tourism_lko@irctc.com"],
    serves: ["Lucknow", "LKO", "Varanasi", "BSB", "Ayodhya", "AY", "Gorakhpur", "GKP"],
  },
  {
    zone: "West",
    city: "Mumbai",
    address: "IRCTC Zonal Office, 2nd Floor, Annexe Building, CSMT, Mumbai 400001",
    phones: ["022-2261-5555", "8287930495", "8287930496"],
    emails: ["tourismwz@irctc.com"],
    serves: ["Mumbai", "CSMT", "LTT", "BDTS", "Pune", "PUNE", "Ahmedabad", "ADI", "Nagpur", "NGP"],
  },
  {
    zone: "South",
    city: "Chennai",
    address: "IRCTC Zonal Office, No. 5, 3rd Floor, Rajaji Bhavan, Besant Nagar, Chennai 600090",
    phones: ["044-2445-2200", "8287930563", "8287930564"],
    emails: ["tourismsz@irctc.com"],
    serves: ["Chennai", "MAS", "Bengaluru", "SBC", "Kochi", "ERS", "Coimbatore", "CBE", "South India"],
  },
  {
    zone: "South Central",
    city: "Secunderabad",
    address: "IRCTC Zonal Office, 3rd Floor, DRM Office Compound, Secunderabad 500071",
    phones: ["040-2782-0031", "8287930604", "8287930605"],
    emails: ["tourismscz@irctc.com"],
    serves: ["Secunderabad", "SC", "Hyderabad", "HYB", "Tirupati", "TPTY", "Vijayawada", "BZA"],
  },
  {
    zone: "East",
    city: "Kolkata",
    address: "IRCTC Zonal Office, 3rd Floor, Metro Rail Bhavan, 33/1 J. L. Nehru Road, Kolkata 700071",
    phones: ["033-2287-6640", "8287930661", "8287930662"],
    emails: ["tourismez@irctc.com"],
    serves: ["Kolkata", "HWH", "SDAH", "Guwahati", "GHY", "Patna", "PNBE", "North East"],
  },
];

/** Always reachable, whichever zone you fall in. */
export const nationalHelpline = { label: "24×7 helpline", number: "14646" };

/**
 * Offices ordered by how likely they are to be the traveller's own: the one
 * that owns the origin city first, then the ones covering halts on the boarding
 * chain, then the rest in published order. Air packages carry no boarding
 * chain, so for those this comes down to the origin alone.
 */
export function officesForPackage(pkg: TourPackage, boarding: BoardingPoint[]): TourismOffice[] {
  const stops = boarding.map((b) => b.code);
  const rank = (o: TourismOffice) => {
    if (o.serves.includes(pkg.from)) return 0;
    if (stops.some((code) => o.serves.includes(code))) return 1;
    if (o.serves.includes(pkg.region)) return 2;
    return 3;
  };
  return tourismOffices
    .map((office, i) => ({ office, rank: rank(office), i }))
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .map((entry) => entry.office);
}

/** True when the office is the one that owns this package's origin city. */
export function isHomeOffice(office: TourismOffice, pkg: TourPackage): boolean {
  return office.serves.includes(pkg.from);
}
