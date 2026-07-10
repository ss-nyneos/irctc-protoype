import {
  Bus,
  Crown,
  DoorOpen,
  ExternalLink,
  Fan,
  Gem,
  Landmark,
  Luggage,
  Mountain,
  Plane,
  Ship,
  Sofa,
  Tag,
  TrainFront,
  Hotel,
  type LucideIcon,
} from "lucide-react";
import type { IconKey, ServiceItem, Tone } from "@/data/services";

const iconMap: Record<IconKey, LucideIcon> = {
  plane: Plane,
  hotel: Hotel,
  bus: Bus,
  door: DoorOpen,
  sofa: Sofa,
  luggage: Luggage,
  trainfront: TrainFront,
  landmark: Landmark,
  fan: Fan,
  ship: Ship,
  mountain: Mountain,
  tag: Tag,
  crown: Crown,
  gem: Gem,
};

const toneMap: Record<Tone, string> = {
  sky: "bg-sky-100 text-sky-700 group-hover:bg-sky-600",
  violet: "bg-violet-100 text-violet-700 group-hover:bg-violet-600",
  amber: "bg-amber-100 text-amber-700 group-hover:bg-amber-500",
  emerald: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600",
  rose: "bg-rose-100 text-rose-700 group-hover:bg-rose-600",
  navy: "bg-blue-100 text-blue-800 group-hover:bg-navy",
  azure: "bg-cyan-100 text-cyan-700 group-hover:bg-azure",
  teal: "bg-teal-100 text-teal-700 group-hover:bg-teal-600",
};

export function ServiceTile({ item, index }: { item: ServiceItem; index: number }) {
  const Icon = iconMap[item.icon] ?? Luggage;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="tile-in group relative flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-lg"
      style={{ animationDelay: `${25 * index}ms` }}
    >
      <span
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl transition-colors group-hover:text-white ${toneMap[item.tone] ?? toneMap.navy}`}
      >
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[14px] font-bold text-navy">
          {item.label}
          <ExternalLink size={11} className="text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{item.sub}</span>
      </span>
    </a>
  );
}
