import type { Destination } from "@/types";
import varanasiImg from "@/assets/cta/varanasi1.jpg";
import amritsarImg from "@/assets/cta/amritsar.webp";
import darjeelingImg from "@/assets/cta/darjeeling.webp";

export const destinations: Destination[] = [
  { name: "Varanasi", region: "Uttar Pradesh", grad: ["#9a3412", "#fbbf24"], img: varanasiImg },
  { name: "Ladakh", region: "J&K", grad: ["#1e3a8a", "#38bdf8"], img: "photo-1506905925346-21bda4d32df4" },
  { name: "Goa", region: "West Coast", grad: ["#0369a1", "#22d3ee"], img: "photo-1512343879784-a960bf40e7f2" },
  { name: "Amritsar", region: "Punjab", grad: ["#a16207", "#fde047"], img: amritsarImg },
  { name: "Darjeeling", region: "West Bengal", grad: ["#065f46", "#34d399"], img: darjeelingImg },
  { name: "Rann of Kutch", region: "Gujarat", grad: ["#7c2d12", "#fef3c7"], img: "photo-1610963277-de3d6b3d92a" },
];
