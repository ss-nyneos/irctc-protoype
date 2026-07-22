import type { BoardingPoint, CoachClass, PackageDetail, PolicySection, TourPackage, TravelMode } from "@/types";
import { cancellationBands, conductTopics, importantNotes } from "@/data/policyContent";

/**
 * Booking-desk detail for a package: code, class-wise fares, boarding chain,
 * departures and policy. This lives apart from `packages.ts` because that file
 * is the catalogue — the fields cards and filters read. Nothing here is needed
 * until a traveller actually opens a package.
 *
 * Fares are derived from the package's base price rather than hand-typed per
 * class, so a price edit in `packages.ts` stays the single source of truth.
 */

/**
 * Booking categories per travel mode, cheapest first. `delta` is the uplift over
 * the base fare. IRCTC sells its tourism packages under two categories —
 * "Comfort" and "Superior" — so every mode carries the same pair; only the
 * `detail` line, which spells out what the category buys on that mode, differs.
 */
const tiers: Record<
  TravelMode,
  Array<Omit<CoachClass, "price" | "childPrice" | "available" | "seatsLeft"> & { delta: number }>
> = {
  Train: [
    { code: "CMF", label: "Comfort", detail: "AC 3-tier berths, 3-star stays", delta: 0 },
    { code: "SUP", label: "Superior", detail: "AC 2-tier berths, 4-star stays", delta: 0.3 },
  ],
  "Rail + Road": [
    { code: "CMF", label: "Comfort", detail: "AC 3-tier berths, 3-star stays", delta: 0 },
    { code: "SUP", label: "Superior", detail: "AC 2-tier berths, 4-star stays", delta: 0.3 },
  ],
  "Luxury Train": [
    { code: "CMF", label: "Comfort", detail: "Deluxe cabin, en-suite bath, picture window", delta: 0 },
    { code: "SUP", label: "Superior", detail: "Suite cabin with lounge seating", delta: 0.45 },
  ],
  Air: [
    { code: "CMF", label: "Comfort", detail: "3-star stays, economy airfare", delta: 0 },
    { code: "SUP", label: "Superior", detail: "4-star stays, preferred flight timings", delta: 0.3 },
  ],
  // Road packages are joined at the destination, so the category you pick is the
  // hotel grade rather than a coach class.
  Road: [
    { code: "CMF", label: "Comfort", detail: "3-star stays, AC cab or coach", delta: 0 },
    { code: "SUP", label: "Superior", detail: "4-star stays, private transfers", delta: 0.3 },
  ],
};

/**
 * Boarding chains, in running order. Air packages are absent by design — there
 * is no train to join, so the detail page shows airport info instead.
 */
const boardingChains: Record<string, BoardingPoint[]> = {
  dakshinbharat: [
    { station: "Delhi Safdarjung", code: "DSJ", arr: null, dep: "15:20" },
    { station: "Mathura Junction", code: "MTJ", arr: "17:05", dep: "17:10" },
    { station: "Agra Cantt", code: "AGC", arr: "18:00", dep: "18:05" },
    { station: "Gwalior", code: "GWL", arr: "19:30", dep: "19:35" },
    { station: "Jhansi Junction", code: "JHS", arr: "20:40", dep: "20:50" },
    { station: "Bhopal Junction", code: "BPL", arr: "00:15", dep: "00:25" },
    { station: "Nagpur Junction", code: "NGP", arr: "06:10", dep: "06:20" },
    { station: "Balharshah", code: "BPQ", arr: "09:05", dep: "09:15" },
  ],
  chardham: [
    { station: "Delhi Junction", code: "DLI", arr: null, dep: "06:40" },
    { station: "Meerut City", code: "MTC", arr: "08:15", dep: "08:20" },
    { station: "Muzaffarnagar", code: "MOZ", arr: "09:05", dep: "09:10" },
    { station: "Roorkee", code: "RK", arr: "10:00", dep: "10:05" },
    { station: "Haridwar Junction", code: "HW", arr: "10:45", dep: "10:55" },
    { station: "Dehradun", code: "DDN", arr: "12:10", dep: null },
  ],
  keralabackwaters: [
    { station: "Coimbatore Junction", code: "CBE", arr: null, dep: "07:15" },
    { station: "Palakkad Junction", code: "PGT", arr: "08:30", dep: "08:35" },
    { station: "Thrissur", code: "TCR", arr: "09:40", dep: "09:45" },
    { station: "Aluva", code: "AWY", arr: "10:35", dep: "10:40" },
    { station: "Ernakulam Junction", code: "ERS", arr: "11:15", dep: null },
  ],
  jyotirlinga: [
    { station: "Mumbai CSMT", code: "CSMT", arr: null, dep: "06:05" },
    { station: "Dadar", code: "DR", arr: "06:20", dep: "06:25" },
    { station: "Thane", code: "TNA", arr: "06:50", dep: "06:55" },
    { station: "Kalyan Junction", code: "KYN", arr: "07:20", dep: "07:25" },
    { station: "Nashik Road", code: "NK", arr: "09:40", dep: "09:50" },
    { station: "Manmad Junction", code: "MMR", arr: "11:05", dep: "11:15" },
  ],
  rajasthan: [
    { station: "Delhi Cantt", code: "DEC", arr: null, dep: "16:30" },
    { station: "Gurgaon", code: "GGN", arr: "16:55", dep: "17:00" },
    { station: "Rewari Junction", code: "RE", arr: "17:50", dep: "17:55" },
    { station: "Alwar Junction", code: "AWR", arr: "19:10", dep: "19:15" },
    { station: "Jaipur Junction", code: "JP", arr: "21:20", dep: null },
  ],
};

const baseDepartures = ["20 Jul 2026", "03 Aug 2026", "17 Aug 2026", "07 Sep 2026", "19 Oct 2026"];

const commonPolicy: PolicySection[] = [
  {
    title: "Booking & payment",
    points: [
      "Confirm with 25% of the tour cost; the balance falls due 30 days before departure.",
      "Fares are per person on the selected class and exclude GST at 5%.",
      "Bookings inside 30 days of departure must be paid in full.",
      "A booking is confirmed only once IRCTC issues a confirmation voucher by email and SMS.",
    ],
  },
  {
    title: "Cancellation & refund",
    bands: cancellationBands,
  },
  {
    title: "Identity & documents",
    points: [
      "Carry the original government photo ID used at booking; a copy is not accepted on board.",
      "Children over 5 need their own ID and a full-fare berth.",
      "Foreign nationals must carry passport and a valid Indian visa.",
    ],
  },
];

const railPolicy: PolicySection = {
  title: "On board the train",
  points: [
    "Reach your boarding station 45 minutes before the tentative departure time.",
    "Timings are tentative and move with the running of the train; IRCTC is not liable for delays.",
    "One suitcase and one cabin bag per traveller; berths are allotted by the coach attendant.",
    "The train is fully non-smoking and alcohol is not permitted in the coaches.",
  ],
};

const airPolicy: PolicySection = {
  title: "Flights & hotels",
  points: [
    "Airfare is quoted on the day of booking and is only held once ticketed.",
    "Hotels are named as indicative; a similar or better property may be substituted.",
    "Check-in is 14:00 and check-out 12:00 unless the itinerary says otherwise.",
    "Web check-in and baggage limits are the operating airline's to set.",
  ],
};

const extraPolicy: Record<string, PolicySection> = {
  chardham: {
    title: "Health & fitness",
    points: [
      "The dhams sit between 3,000 and 3,600 m; a doctor's fitness certificate is required over 70.",
      "Yamunotri and Kedarnath need a trek or a pony; pony and palki charges are paid on the spot.",
      "Helicopter shuttles fly at the operator's discretion and are grounded in poor weather.",
      "Carry regular medication for the full trip — pharmacies on the route are sparse.",
    ],
  },
  andaman: {
    title: "Island travel",
    points: [
      "Inter-island ferries are weather-dependent and may be rescheduled without notice.",
      "Indian nationals need a photo ID; foreign nationals need a permit issued on arrival.",
      "Scuba and snorkelling are booked on the island and are not part of the tour cost.",
    ],
  },
};

/** Deterministic 0–255 hash, so seat counts stay put across re-renders. */
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) & 0xff;
  return h;
}

function buildClasses(pkg: TourPackage): CoachClass[] {
  return tiers[pkg.travelMode].map((tier, i) => {
    const price = Math.round((pkg.price * (1 + tier.delta)) / 10) * 10;
    return {
      code: tier.code,
      label: tier.label,
      detail: tier.detail,
      price,
      // Children 5–11 travel at a small discount, as on the real fare chart.
      childPrice: Math.round((price * 0.95) / 100) * 100,
      // Categories genuinely sell out. Comfort (the base) always survives so
      // every package stays bookable; Superior turns over per package.
      available: i === 0 || hash(pkg.id + tier.code) % 4 !== 0,
      // Scarcity thins out as the category gets pricier, which is how these sell.
      seatsLeft: 4 + (hash(pkg.id + tier.code) % (18 - i * 5)),
    };
  });
}

function buildPolicy(pkg: TourPackage): PolicySection[] {
  const modePolicy = pkg.travelMode === "Air" ? airPolicy : railPolicy;
  const extra = extraPolicy[pkg.id];
  return [
    ...commonPolicy.slice(0, 2),
    { title: "Important notes", points: importantNotes },
    modePolicy,
    ...(extra ? [extra] : []),
    commonPolicy[2],
    { title: "On-tour conduct", topics: conductTopics },
  ];
}

export function getPackageDetail(pkg: TourPackage): PackageDetail {
  return {
    // Straight off the IRCTC listing — see `tourDetail.json`.
    code: pkg.code,
    departure: pkg.departure,
    nextDeparture: pkg.nextDeparture,
    classes: buildClasses(pkg),
    // Only a package with a rail leg has a boarding chain to show. Air and
    // road-only tours are joined at the destination city.
    boarding: pkg.inclusionKeys.includes("Train") ? boardingChains[pkg.id] ?? [] : [],
    departures: baseDepartures,
    policy: buildPolicy(pkg),
  };
}
