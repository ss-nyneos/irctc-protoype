import type { TourPackage } from "@/types";

/** The inclusion chips IRCTC prints on a package row, in its own order. */
export type InclusionKey = "Train" | "Flight" | "Cab" | "Bus" | "Hotel" | "Meal" | "Insurance";

const matchers: Array<[InclusionKey, RegExp]> = [
  ["Cab", /\b(cab|taxi|transfer|transport|vehicle)\b/i],
  ["Bus", /\b(bus|coach)\b/i],
  ["Hotel", /\b(hotel|stay|resort|houseboat|cabin|night)/i],
  ["Meal", /\b(meal|breakfast|dinner|lunch|beverage)/i],
  ["Insurance", /\binsurance\b/i],
];

/**
 * Derives the inclusion icons from the package's own inclusion lines, so the
 * card never claims anything the package doesn't already list.
 */
export function inclusionsOf(pkg: TourPackage): InclusionKey[] {
  const text = pkg.inclusions.join(" · ");
  const keys: InclusionKey[] = [];

  if (pkg.travelMode === "Air" || /airfare|flight/i.test(text)) keys.push("Flight");
  if (pkg.travelMode !== "Air") keys.push("Train");
  for (const [key, re] of matchers) if (re.test(text)) keys.push(key);

  return keys;
}
