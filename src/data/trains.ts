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
    // maroon throughout — roof, frame and edging all one colour, no contrast trim
    livery: { roof: ["#8a2a37", "#5f1c26"], side: "#6b1f2a", trim: "#7a2430" },
    img: maharajasExpressImg,
  },
  {
    id: "goldenchariot",
    name: "Golden Chariot",
    tag: "Pride of the South",
    route: "Karnataka · Goa",
    grad: ["#4c1d95", "#7c3aed"],
    livery: { roof: ["#e0b75f", "#a97e2f"], side: "#b8862b", trim: "#e6c565" },
    img: goldenChariotImg,
  },
  {
    id: "palace",
    name: "Palace on Wheels",
    tag: "Royal Rajasthan on Rails",
    route: "Delhi · Jaipur · Udaipur",
    grad: ["#78350f", "#d97706"],
    livery: { roof: ["#e0b75f", "#a97e2f"], side: "#b8862b", trim: "#e6c565" },
    img: palaceOnWheelsImg,
  },
  {
    id: "deccan",
    name: "Deccan Odyssey",
    tag: "Maharashtra's Blue Jewel",
    route: "Mumbai · Konkan · Goa",
    grad: ["#1e3a8a", "#2563eb"],
    livery: { roof: ["#e3d5bb", "#c2ab89"], side: "#c8b391", trim: "#e8dcc6" },
    img: deccanOdysseyImg,
  },
];
