import type { TourPackage } from "@/types";

/** The inclusion chips IRCTC prints on a package row, in its own order. */
export type InclusionKey =
  | "Train"
  | "Air"
  | "Flight"
  | "Cab"
  | "Bus"
  | "Hotel"
  | "Meal"
  | "Guide"
  | "Darshan"
  | "Insurance";

/**
 * The icon row comes straight off the IRCTC listing now, so the card shows
 * exactly what the real site shows — no inference from the prose inclusions.
 */
export function inclusionsOf(pkg: TourPackage): InclusionKey[] {
  return pkg.inclusionKeys;
}
