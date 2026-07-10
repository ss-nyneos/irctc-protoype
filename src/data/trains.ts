import type { LuxuryTrain } from "@/types";
import maharajasExpressImg from "@/assets/trains/maharajas-express.jpg";
import goldenChariotImg from "@/assets/trains/golden-chariot.jpg";
import palaceOnWheelsImg from "@/assets/trains/palace-on-wheels.jpg";
import deccanOdysseyImg from "@/assets/trains/deccan-odyssey.jpg";

export const luxuryTrains: LuxuryTrain[] = [
  {
    id: "maharajas",
    name: "Maharajas' Express",
    tag: "World's Leading Luxury Train",
    route: "Delhi · Agra · Rajasthan",
    grad: ["#7f1d1d", "#dc2626"],
    img: maharajasExpressImg,
  },
  {
    id: "goldenchariot",
    name: "Golden Chariot",
    tag: "Pride of the South",
    route: "Karnataka · Goa",
    grad: ["#4c1d95", "#7c3aed"],
    img: goldenChariotImg,
  },
  {
    id: "palace",
    name: "Palace on Wheels",
    tag: "Royal Rajasthan on Rails",
    route: "Delhi · Jaipur · Udaipur",
    grad: ["#78350f", "#d97706"],
    img: palaceOnWheelsImg,
  },
  {
    id: "deccan",
    name: "Deccan Odyssey",
    tag: "Maharashtra's Blue Jewel",
    route: "Mumbai · Konkan · Goa",
    grad: ["#1e3a8a", "#2563eb"],
    img: deccanOdysseyImg,
  },
];
