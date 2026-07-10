import { packages, getPackageById } from "./packages";
import { destinations } from "./destinations";

const destImg = (name: string): string => destinations.find((d) => d.name === name)!.img;

export interface PastTour {
  packageId: string;
  travelDate: string;
  rating: number;
  note: string;
  photos: string[];
}

export const demoUser = {
  name: "Shubhi",
  homeCity: "New Delhi",
  memberSince: 2021,
  tags: ["Heritage", "Hill stations", "Mid-range comfort", "Photography"],
};

export const pastTours: PastTour[] = [
  {
    packageId: "rajasthan",
    travelDate: "2025-11-08",
    rating: 5,
    note: "Forts, palaces & folk evenings — Udaipur stole the show.",
    photos: [getPackageById("rajasthan")!.img, destImg("Amritsar"), destImg("Rann of Kutch")],
  },
  {
    packageId: "kashmir",
    travelDate: "2025-05-14",
    rating: 5,
    note: "Shikara sunsets on Dal Lake, snow at Gulmarg.",
    photos: [getPackageById("kashmir")!.img, destImg("Ladakh"), destImg("Darjeeling")],
  },
  {
    packageId: "keralabackwaters",
    travelDate: "2024-09-02",
    rating: 4,
    note: "Houseboat nights in Alleppey were unreal.",
    photos: [getPackageById("keralabackwaters")!.img, destImg("Goa"), destImg("Varanasi")],
  },
];

/** Recommends packages the user hasn't been on yet, scored by overlap with the
 *  experience tags & categories seen across their past tours. */
export function getSuggestions(max = 4) {
  const visitedIds = new Set(pastTours.map((t) => t.packageId));
  const expCount: Partial<Record<string, number>> = {};
  const catCount: Partial<Record<string, number>> = {};

  pastTours.forEach((t) => {
    const pkg = getPackageById(t.packageId);
    if (!pkg) return;
    pkg.experience.forEach((e) => (expCount[e] = (expCount[e] ?? 0) + 1));
    catCount[pkg.category] = (catCount[pkg.category] ?? 0) + 1;
  });

  return packages
    .filter((p) => !visitedIds.has(p.id))
    .map((p) => {
      let score = 0;
      p.experience.forEach((e) => (score += expCount[e] ?? 0));
      score += (catCount[p.category] ?? 0) * 2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.p);
}
