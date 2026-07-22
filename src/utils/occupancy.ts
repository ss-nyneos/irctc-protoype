export interface OccupancyRates {
  single: number;
  double: number;
  triple: number;
  childWithBed: number;
  childNoBed: number;
}

/**
 * IRCTC's published per-person rates, copied from the live site — one sheet per
 * booking category. The fewer to a room, the more each pays; children are
 * priced separately by whether they take a berth.
 *
 * These are printed figures, not a formula: the booking form must quote exactly
 * what the tourism site quotes, so nothing here is derived from the fare.
 */
export const occupancyByCategory: Record<string, OccupancyRates> = {
  // Comfort — AC 3-tier berths, 3-star stays.
  CMF: {
    single: 10770,
    double: 8100,
    triple: 6990,
    childWithBed: 6320,
    childNoBed: 5255,
  },
  // Superior — AC 2-tier berths, 4-star stays.
  SUP: {
    single: 11995,
    double: 9330,
    triple: 8220,
    childWithBed: 7550,
    childNoBed: 6485,
  },
};

/**
 * Rates for a booking category. Falls back to Comfort, which is the category
 * every package opens on.
 */
export function occupancyRates(categoryCode?: string): OccupancyRates {
  return occupancyByCategory[categoryCode ?? ""] ?? occupancyByCategory.CMF;
}

/** The rows as IRCTC labels them, ready to render. */
export function occupancyRows(rates: OccupancyRates) {
  return {
    adult: [
      ["Single", rates.single],
      ["Double", rates.double],
      ["Triple", rates.triple],
    ] as Array<[string, number]>,
    child: [
      ["Child with bed", rates.childWithBed],
      ["Child without bed", rates.childNoBed],
    ] as Array<[string, number]>,
  };
}
