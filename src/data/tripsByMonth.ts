export interface MonthlyTripCard {
  title: string;
  img: string;
}

/** Featured trip cards for the bento grid; rotated per selected month. */
export const monthlyTripCards: MonthlyTripCard[] = [
  { title: "Secrets of Japan: Uncovering Hidden Charms", img: "photo-1545569341-9eb8b30979d9" },
  { title: "Secrets of Europe: Uncovering Hidden Delights", img: "photo-1491557345352-5929e343eb89" },
  { title: "Secrets of Sri Lanka: Uncovering Hidden Treasures", img: "photo-1711797750174-c3750dd9d7c9" },
  { title: "Secrets of China: Uncovering Hidden Wonders", img: "photo-1773318901379-aac92fdf5611" },
  { title: "Secrets of Sri Lanka: Uncovering Hidden Treasures", img: "photo-1711797750174-c3750dd9d7c9" },
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
