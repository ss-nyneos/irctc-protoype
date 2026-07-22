import type { CancellationBand, PolicyTopic } from "@/types";

export const cancellationBands: CancellationBand[] = [
  { label: "15 days or more", minDays: 15, maxDays: null, flat: 250 },
  { label: "8 to 14 days", minDays: 8, maxDays: 14, percent: 25 },
  { label: "4 to 7 days", minDays: 4, maxDays: 7, percent: 50 },
  { label: "Under 4 days", minDays: null, maxDays: 3, percent: 100 },
];

export function bandForDaysOut(days: number): CancellationBand {
  return (
    cancellationBands.find(
      (b) => (b.minDays === null || days >= b.minDays) && (b.maxDays === null || days <= b.maxDays),
    ) ?? cancellationBands[cancellationBands.length - 1]
  );
}

export function deductionFor(band: CancellationBand, total: number, travellers: number): number {
  if (band.flat !== undefined) return band.flat * travellers;
  return Math.round((total * (band.percent ?? 0)) / 100);
}

export const importantNotes: string[] = [
  "The itinerary is tentative and may change to keep the train running to time. Final timings follow the train order issued by the railways.",
  "IRCTC may alter the itinerary under unavoidable circumstances and is not liable for natural calamities, strikes, cancellation or delay of the train, or insurgency of any nature during the tour.",
  "Operation of the tourist train is subject to a minimum number of passengers booked.",
  "Get a health check-up before boarding and travel only if fit. IRCTC is not responsible for any mishap arising from an unfit condition — restlessness, anxiety, asthma or other physical problems — or from natural death.",
];

export const conductTopics: PolicyTopic[] = [
  {
    title: "General",
    points: [
      "Maintain general hygiene throughout the tour.",
      "Wear a face mask if you are suffering from a cough or cold.",
      "Refrain from spitting on the train, at tourist sites, and in buses and hotels.",
      "Do not touch statues, idols or holy objects at religious and tourist sites.",
      "No prasad distribution or sprinkling of holy water inside the train.",
      "Be mindful with your phone in common areas, and keep music low enough not to intrude on fellow passengers.",
      "Formals or smart casuals at the restaurant during meal times.",
    ],
  },
  {
    title: "Tour manager",
    points: [
      "The tour manager is your single point of contact for anything about the train or the itinerary.",
      "Follow the tour manager's guidance at all times.",
      "Leave emergency contact details for someone at home with the tour manager.",
    ],
  },
  {
    title: "On the train",
    points: [
      "Do not pull the chain — without valid reason it is a punishable offence.",
      "Do not waste water on board.",
      "Do not cross the tracks. Use the foot over bridge.",
    ],
  },
  {
    title: "Attire",
    points: [
      "Dress so as not to offend locals or other visitors at the places on the itinerary.",
      "You may be asked to remove your shoes at holy shrines.",
    ],
  },
  {
    title: "Decorum",
    points: [
      "Keep your language civil, as a courtesy to fellow passengers and to visitors at the places you go.",
      "Do not be rude to locals or get drawn into arguments — raise anything in doubt with the tour manager.",
      "Stay with the group and keep to the timings the tour manager sets at each stop.",
      "Photography is restricted at some sites. Respect the local rules.",
      "IRCTC may remove any passenger it judges to be creating discord on the tour.",
      "Disruptive behaviour is not tolerated, on the train or off it.",
    ],
  },
  {
    title: "Sightseeing",
    points: [
      "The itinerary you were given may change for reasons outside anyone's control; follow the tour manager.",
      "IRCTC is not responsible for mishaps caused by negligence or by instructions not being followed.",
    ],
  },
  {
    title: "Safety and security",
    points: [
      "Take full care of your belongings for the length of the tour.",
      "Carry a photo ID — Aadhaar, voter's ID, passport or PAN — for security checks.",
    ],
  },
];
