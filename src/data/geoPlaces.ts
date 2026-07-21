import type { ItineraryDay } from "@/types";

/**
 * Where India's tour stops actually are, as [longitude, latitude].
 *
 * The itinerary data carries place *names*, not coordinates, so the map has to
 * resolve them. Keys are lowercase and matched as whole words inside a day's
 * title, which is why "Yamunotri Darshan" and "Munnar Sightseeing" both land
 * without needing an entry of their own.
 *
 * Only Indian places belong here — the map is an India outline, so an overseas
 * stop should stay unresolved and let the caller fall back to the list view.
 */
export const PLACE_COORDS: Record<string, [number, number]> = {
  // Uttarakhand / Char Dham
  haridwar: [78.163, 29.946],
  rishikesh: [78.267, 30.087],
  dehradun: [78.032, 30.317],
  mussoorie: [78.072, 30.459],
  barkot: [78.201, 30.809],
  yamunotri: [78.459, 31.01],
  uttarkashi: [78.45, 30.729],
  gangotri: [78.941, 30.995],
  guptkashi: [79.049, 30.526],
  kedarnath: [79.067, 30.735],
  badrinath: [79.494, 30.744],
  rudraprayag: [78.981, 30.284],
  nainital: [79.454, 29.391],

  // North & Himalaya
  delhi: [77.209, 28.614],
  agra: [78.008, 27.177],
  amritsar: [74.873, 31.634],
  shimla: [77.173, 31.104],
  manali: [77.189, 32.24],
  dharamshala: [76.323, 32.219],
  jammu: [74.857, 32.727],
  katra: [74.945, 32.991],
  srinagar: [74.797, 34.084],
  gulmarg: [74.383, 34.048],
  pahalgam: [75.315, 34.015],
  sonmarg: [75.288, 34.302],
  leh: [77.577, 34.152],

  // Rajasthan & west
  jaipur: [75.787, 26.912],
  udaipur: [73.713, 24.586],
  jodhpur: [73.024, 26.238],
  jaisalmer: [70.913, 26.915],
  bikaner: [73.312, 28.023],
  pushkar: [74.551, 26.487],
  ajmer: [74.639, 26.449],
  ranthambore: [76.503, 26.017],
  ahmedabad: [72.571, 23.023],
  "statue of unity": [73.719, 21.838],
  somnath: [70.401, 20.888],
  dwarka: [68.968, 22.238],

  // Maharashtra & Deccan
  mumbai: [72.878, 19.076],
  pune: [73.856, 18.52],
  nashik: [73.79, 19.997],
  shirdi: [74.477, 19.766],
  bhimashankar: [73.535, 19.072],
  aurangabad: [75.343, 19.877],
  nagpur: [79.089, 21.146],
  goa: [73.828, 15.496],

  // Central & east
  khajuraho: [79.919, 24.852],
  ujjain: [75.784, 23.179],
  varanasi: [82.973, 25.317],
  prayagraj: [81.846, 25.436],
  ayodhya: [82.199, 26.792],
  lucknow: [80.947, 26.847],
  patna: [85.138, 25.594],
  "bodh gaya": [84.991, 24.696],
  kolkata: [88.363, 22.573],
  darjeeling: [88.263, 27.036],
  gangtok: [88.606, 27.339],
  puri: [85.831, 19.813],
  konark: [86.094, 19.888],
  bhubaneswar: [85.819, 20.296],

  // North-east
  guwahati: [91.746, 26.144],
  shillong: [91.883, 25.578],
  cherrapunji: [91.732, 25.3],
  kaziranga: [93.371, 26.577],
  tawang: [91.858, 27.586],

  // South
  hyderabad: [78.486, 17.385],
  bengaluru: [77.595, 12.972],
  mysore: [76.64, 12.295],
  bandipur: [76.63, 11.67],
  hampi: [76.46, 15.335],
  badami: [75.68, 15.915],
  pattadakal: [75.816, 15.948],
  chennai: [80.271, 13.083],
  mahabalipuram: [80.192, 12.617],
  kanchipuram: [79.704, 12.837],
  puducherry: [79.808, 11.934],
  tirupati: [79.419, 13.629],
  madurai: [78.12, 9.925],
  rameswaram: [79.313, 9.288],
  kanyakumari: [77.538, 8.088],
  ooty: [76.695, 11.41],
  kochi: [76.267, 9.931],
  munnar: [77.06, 10.089],
  thekkady: [77.16, 9.585],
  alleppey: [76.339, 9.498],
  kumarakom: [76.43, 9.617],
  kovalam: [76.978, 8.399],
  wayanad: [76.132, 11.685],

  // Islands
  "port blair": [92.746, 11.624],
  havelock: [92.977, 12.028],
  "elephant beach": [92.945, 12.019],
  "neil island": [93.048, 11.833],
};

/** Longest keys first, so "port blair" wins over a stray "blair". */
const KEYS = Object.keys(PLACE_COORDS).sort((a, b) => b.length - a.length);

/**
 * Titles routinely name two places ("Bikaner & Jaipur", "Mumbai → Nashik").
 * The day *ends* at the last one, which is the halt worth pinning.
 */
const SEGMENT = /\s*(?:→|->|\/|&|,|\bto\b|\bvia\b)\s*/g;

/** Gazetteer keys are lowercase; "statue of unity" must not become "Of". */
const MINOR = new Set(["of", "and", "the"]);

function displayName(key: string): string {
  return key
    .split(" ")
    .map((word, i) => (i && MINOR.has(word) ? word : word[0].toUpperCase() + word.slice(1)))
    .join(" ");
}

function lookup(title: string): { coordinates: [number, number]; name: string } | null {
  const parts = title.split(SEGMENT).filter(Boolean);
  for (const part of parts.reverse()) {
    const text = part.toLowerCase();
    const hit = KEYS.find((key) => new RegExp(`\\b${key}\\b`).test(text));
    if (hit) return { coordinates: PLACE_COORDS[hit], name: displayName(hit) };
  }
  return null;
}

/** One pin on the map: a place, and the day(s) the trip spends there. */
export interface ItineraryStop {
  coordinates: [number, number];
  /** Place name shown on the label. */
  label: string;
  /** Indices into the original days array — a pin can cover a run of days. */
  dayIndexes: number[];
  /** Day numbers as printed, e.g. 5 and 6 for a two-night halt. */
  from: number;
  to: number;
}

/**
 * Turn a day list into map pins.
 *
 * Two things happen here. Days that name no place at all ("Departure", "Safari
 * Day", "Onboard") inherit the previous stop's location — that is where the
 * traveller actually is. And consecutive days at the same place collapse into
 * one pin labelled with a range, because ten days on the Char Dham circuit is
 * only six or seven distinct halts and stacking pins would just make mud.
 */
export function resolveStops(days: ItineraryDay[]): ItineraryStop[] {
  const stops: ItineraryStop[] = [];
  let last: [number, number] | null = null;
  let lastLabel = "";

  days.forEach((day, index) => {
    const found = lookup(day.title);
    const coordinates = found?.coordinates ?? last;
    if (!coordinates) return; // Trip opens somewhere we can't place — skip it.

    // The pin is labelled with the *place*, not the day's headline — "Yamunotri
    // Darshan" is a thing you do, "Yamunotri" is where the pin is standing.
    const label = found ? found.name : lastLabel;
    const previous = stops[stops.length - 1];

    if (previous && previous.coordinates === coordinates) {
      previous.dayIndexes.push(index);
      previous.to = day.day;
    } else {
      stops.push({ coordinates, label, dayIndexes: [index], from: day.day, to: day.day });
    }

    last = coordinates;
    lastLabel = label;
  });

  return stops;
}
