import { ChevronRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import {
  IRCTC_FLIGHTS,
  IRCTC_HOTELS,
  IRCTC_BUS,
  IRCTC_RETIRING_ROOM,
  IRCTC_LOUNGE,
  IRCTC_BHARAT_GAURAV,
  IRCTC_BUDDHIST_TRAIN,
  IRCTC_HELI_YATRA,
  IRCTC_FERRY,
  IRCTC_TREK,
  IRCTC_MAHARAJAS,
  IRCTC_GOLDEN_CHARIOT,
} from "@/data/services";

import imgFlights from "@/assets/irctc_services_assets/svc-flights.jpg";
import imgHotels from "@/assets/irctc_services_assets/svc-hotels.webp";
import imgBus from "@/assets/irctc_services_assets/svc-bus.webp";
import imgRetiring from "@/assets/irctc_services_assets/svc-retiring-room.jpeg";
import imgLounge from "@/assets/irctc_services_assets/svc-lounge.png";
import imgBharat from "@/assets/irctc_services_assets/svc-bharat-gaurav.webp";
import imgBuddhist from "@/assets/irctc_services_assets/svc-buddhist-train.jpg";
import imgHeli from "@/assets/irctc_services_assets/svc-heli-yatra.webp";
import imgFerry from "@/assets/irctc_services_assets/svc-ferry.png";
import imgTrek from "@/assets/irctc_services_assets/svc-trek.webp";
import imgMaharajas from "@/assets/irctc_services_assets/svc-maharajas.jpg";
import imgGolden from "@/assets/irctc_services_assets/svc-golden-chariot.jpeg";

interface ServiceCardData {
  label: string;
  sub: string;
  tag: string;
  url: string;
  image: string;
  /** Frame colour — a gradient sampled from the photo's own dominant colour (lit
      tone at top → deepened tone at the bottom) so the frame matches the picture
      while the white label still reads at strong contrast. */
  frame: string;
  /** Optional object-position for the photo (defaults to centre). Used when the
      subject sits off-centre — e.g. the plane's nose — so it stays inside the frame. */
  pos?: string;
}

/** Oval-masked photo card. The image sits in an ellipse that bleeds off the top
    and right of the frame; thin arc lines sweep the coloured frame; the label +
    chevron rest below — matching the reference wellness cards.
    (Tour Packages and TAG are covered elsewhere on the site and have no artwork.) */
const SERVICES: ServiceCardData[] = [
  { label: "Flights", sub: "Domestic & international", tag: "Book & Travel", url: IRCTC_FLIGHTS, image: imgFlights, pos: "20% 45%", frame: "linear-gradient(165deg, #3e79b8 0%, #15314f 100%)" },
  { label: "Hotels", sub: "Stays across India", tag: "Book & Travel", url: IRCTC_HOTELS, image: imgHotels, frame: "linear-gradient(165deg, #b86b3e 0%, #4f2a15 100%)" },
  { label: "Bus Tickets", sub: "Intercity & sleeper coaches", tag: "Book & Travel", url: IRCTC_BUS, image: imgBus, frame: "linear-gradient(165deg, #83abb8 0%, #36494f 100%)" },
  { label: "Retiring Rooms", sub: "Rest right at the station", tag: "Book & Travel", url: IRCTC_RETIRING_ROOM, image: imgRetiring, frame: "linear-gradient(165deg, #b8a082 0%, #4f4435 100%)" },
  { label: "Executive Lounge", sub: "Unwind before you board", tag: "Book & Travel", url: IRCTC_LOUNGE, image: imgLounge, frame: "linear-gradient(165deg, #b86d3e 0%, #4f2b15 100%)" },
  { label: "Bharat Gaurav", sub: "Themed circuit trains", tag: "Tourism", url: IRCTC_BHARAT_GAURAV, image: imgBharat, frame: "linear-gradient(165deg, #b8846a 0%, #4f362a 100%)" },
  { label: "Buddhist Circuit", sub: "The sacred trail by rail", tag: "Tourism", url: IRCTC_BUDDHIST_TRAIN, image: imgBuddhist, frame: "linear-gradient(165deg, #3eb8ae 0%, #154f4a 100%)" },
  { label: "Heli Yatra", sub: "Char Dham by helicopter", tag: "Tourism", url: IRCTC_HELI_YATRA, image: imgHeli, frame: "linear-gradient(165deg, #7390b8 0%, #2e3c4f 100%)" },
  { label: "Ferry & Cruises", sub: "Coastal & island escapes", tag: "Tourism", url: IRCTC_FERRY, image: imgFerry, frame: "linear-gradient(165deg, #3eb8b8 0%, #154f4f 100%)" },
  { label: "Himalayan Treks", sub: "Guided high-altitude trails", tag: "Tourism", url: IRCTC_TREK, image: imgTrek, frame: "linear-gradient(165deg, #3e81b8 0%, #15354f 100%)" },
  { label: "Maharajas' Express", sub: "World's leading luxury train", tag: "Luxury Trains", url: IRCTC_MAHARAJAS, image: imgMaharajas, frame: "linear-gradient(165deg, #b8793e 0%, #4f3115 100%)" },
  { label: "Golden Chariot", sub: "Pride of the South", tag: "Luxury Trains", url: IRCTC_GOLDEN_CHARIOT, image: imgGolden, frame: "linear-gradient(165deg, #b83e76 0%, #4f1530 100%)" },
];

function ServiceCard({ s }: { s: ServiceCardData }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${s.label} — ${s.sub}`}
      style={{ backgroundImage: s.frame }}
      className="group relative block aspect-[7/10] w-full overflow-hidden rounded-[18px] shadow-[0_14px_32px_-16px_rgba(15,32,74,0.55)] ring-1 ring-white/10 transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      {/* thin concentric arc lines sweeping the frame */}
      <svg
        aria-hidden="true"
        viewBox="0 0 248 360"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
      >
        <g stroke="#ffffff" strokeWidth="1">
          <circle cx="196" cy="58" r="150" strokeOpacity="0.09" />
          <circle cx="196" cy="58" r="190" strokeOpacity="0.07" />
          <circle cx="196" cy="58" r="232" strokeOpacity="0.05" />
        </g>
      </svg>

      {/* ellipse-masked photo — bleeds off the top and right edges */}
      <div className="absolute left-[11%] right-[-16%] top-[-13%] h-[88%] overflow-hidden rounded-[50%] ring-1 ring-white/15">
        <img
          src={s.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{ objectPosition: s.pos ?? "center" }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 rounded-[50%] shadow-[inset_0_0_36px_-6px_rgba(0,0,0,0.5)]" />
      </div>

      {/* label + chevron rest on the coloured frame */}
      <div className="absolute inset-x-3.5 bottom-3.5 flex items-end justify-between gap-2">
        <div className="min-w-0 font-display text-[13.5px] font-bold leading-[1.15] text-white">
          {s.label}
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/45 text-white transition-colors duration-200 ease-out group-hover:border-white group-hover:bg-white/10">
          <ChevronRight size={13} />
        </span>
      </div>
    </a>
  );
}

export function ServicesSection() {
  const ref = useReveal();

  return (
    <section className="relative overflow-hidden py-20 md:py-28" ref={ref}>
      {/* soft backdrop so the frames pop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#eef3fb] via-[#f4f7fd] to-white"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="reveal reveal-rise mx-auto max-w-2xl text-center">
          <h2 className="heading-xl text-ink">
            Everything your <span className="accent">journey</span> needs
          </h2>
        </div>

        {/* every service laid out in a grid — 6 per row on desktop, scaling down on smaller screens */}
        <ul className="stagger mt-12 grid list-none grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6 lg:gap-6">
          {SERVICES.map((s) => (
            <li key={s.label}>
              <ServiceCard s={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
