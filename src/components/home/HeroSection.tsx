import type { ReactNode } from "react";
import { Calendar, MapPin, Search, Users } from "lucide-react";
import { useRouter } from "@/router/RouterContext";
import { destinations } from "@/data/destinations";
import { HeroSlideshow } from "./HeroSlideshow";
import jaipurImg from "@/assets/hero/jaipur-amber-fort.jpg";
import ladakhImg from "@/assets/hero/ladakh-mountains.jpg";
import keralaImg from "@/assets/hero/kerala-tea-gardens.jpg";
import rajasthanImg from "@/assets/hero/rajasthan-desert-camp.jpg";

const slides = [
  { src: jaipurImg, alt: "Amber Fort, Jaipur, at sunset" },
  { src: ladakhImg, alt: "Snow-capped mountains of Ladakh" },
  { src: keralaImg, alt: "Tea gardens and temple in Kerala" },
  { src: rajasthanImg, alt: "Desert camp under a full moon in Rajasthan" },
];

export function HeroSection() {
  const { go } = useRouter();

  return (
    <section className="relative flex min-h-[92dvh] flex-col overflow-hidden md:min-h-[94vh]">
      <HeroSlideshow slides={slides} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-6">
        <h1
          className="heading-xl text-balance bg-gradient-to-r from-[#FF9A3D] via-[#FFF3DA] to-[#34D399] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]"
          style={{ fontSize: 64 }}
        >
          Explore the world
          <br />
          with IRCTC
        </h1>
        <div className="mt-5 flex items-center gap-4 text-[18px] font-bold md:gap-5 md:text-[22px]">
          <span className="text-[#FF9A3D]">Safety</span>
          <span className="h-5 w-px bg-[#FF9A3D]/70 md:h-6" />
          <span className="text-white">Security</span>
          <span className="h-5 w-px bg-[#34D399]/70 md:h-6" />
          <span className="text-[#34D399]">Punctuality</span>
        </div>

        <div className="mt-8 w-full max-w-3xl overflow-hidden rounded-full bg-white/25 p-1.5 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl backdrop-saturate-150">
          <div className="flex flex-col divide-y divide-white/25 md:flex-row md:items-stretch md:divide-x md:divide-y-0">
            <SearchField icon={<MapPin size={16} />} label="Where to?">
              <select className="w-full bg-transparent text-[14px] font-bold text-white outline-none">
                <option className="text-navy">Explore destinations</option>
                {destinations.map((d) => (
                  <option key={d.name} className="text-navy">{d.name}</option>
                ))}
              </select>
            </SearchField>
            <SearchField icon={<Calendar size={16} />} label="When?">
              <select className="w-full bg-transparent text-[14px] font-bold text-white outline-none">
                <option className="text-navy">Add dates</option>
                <option className="text-navy">This month</option>
                <option className="text-navy">Next month</option>
                <option className="text-navy">Festive season</option>
              </select>
            </SearchField>
            <SearchField icon={<Users size={16} />} label="Travellers">
              <select className="w-full bg-transparent text-[14px] font-bold text-white outline-none">
                <option className="text-navy">2 Adults, 1 Room</option>
                <option className="text-navy">Family (4)</option>
                <option className="text-navy">Solo</option>
                <option className="text-navy">Group (10+)</option>
              </select>
            </SearchField>
            <button
              onClick={() => go({ name: "world" })}
              type="button"
              className="m-1 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110 md:m-1.5"
            >
              <Search size={18} /> Explore
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-px left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function SearchField({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center gap-3 px-4 py-2.5 md:min-w-0">
      <span className="text-white/80">{icon}</span>
      <div className="min-w-0 flex-1 text-left">
        <div className="text-[10.5px] font-bold uppercase tracking-wide text-white/70">{label}</div>
        {children}
      </div>
    </div>
  );
}
