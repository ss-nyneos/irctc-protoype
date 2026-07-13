import keralaImg from "@/assets/hero/kerala-tea-gardens.jpg";
import jaipurImg from "@/assets/hero/jaipur-amber-fort.jpg";
import varanasiImg from "@/assets/cta/varanasi1.jpg";

export interface MonthlyTripCard {
  title: string;
  /** Either an Unsplash photo id ("photo-…") or an imported local asset URL. */
  img: string;
}

/** Featured trip cards for the bento grid; rotated per selected month. */
export const monthlyTripCards: MonthlyTripCard[] = [
  { title: "Secrets of Japan: Uncovering Hidden Charms", img: "photo-1545569341-9eb8b30979d9" },
  { title: "Secrets of Europe: Uncovering Hidden Delights", img: "photo-1491557345352-5929e343eb89" },
  { title: "Secrets of Kerala: Uncovering Hidden Backwaters", img: keralaImg },
  { title: "Secrets of Rajasthan: Uncovering Hidden Palaces", img: jaipurImg },
  { title: "Secrets of Varanasi: Uncovering Hidden Ghats", img: varanasiImg },
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
