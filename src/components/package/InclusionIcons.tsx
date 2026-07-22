import {
  Bed,
  Bus,
  CarFront,
  Landmark,
  Plane,
  ShieldCheck,
  TrainFront,
  UserCheck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { TourPackage } from "@/types";
import { inclusionsOf, type InclusionKey } from "@/utils/inclusions";

/** Shared with the compare table, which draws the same icons in a matrix. */
export const inclusionIcons: Record<InclusionKey, LucideIcon> = {
  Train: TrainFront,
  Air: Plane,
  Flight: Plane,
  Cab: CarFront,
  Bus: Bus,
  Hotel: Bed,
  Meal: UtensilsCrossed,
  Guide: UserCheck,
  Darshan: Landmark,
  Insurance: ShieldCheck,
};

interface InclusionIconsProps {
  pkg: TourPackage;
  /** `light` for photo overlays, `dark` for white surfaces. */
  tone?: "light" | "dark";
  size?: number;
}

/** IRCTC's "Inclusions:" row — an icon and its label, nothing more. */
export function InclusionIcons({ pkg, tone = "dark", size = 14 }: InclusionIconsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 ${tone === "light" ? "text-white/85" : "text-foreground/70"}`}>
      {inclusionsOf(pkg).map((k) => {
        const Icon = inclusionIcons[k];
        return (
          <span key={k} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold">
            <Icon size={size} className={tone === "light" ? "text-white/70" : "text-brand"} /> {k}
          </span>
        );
      })}
    </div>
  );
}
