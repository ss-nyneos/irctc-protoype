import { useReveal } from "@/hooks/useReveal";
import { serviceGroups } from "@/data/services";
import servicesHeadingBanner from "@/assets/services/placement-reference.png";
import airplaneIcon from "@/assets/irctc_services_assets/airplane.png";
import hikingIcon from "@/assets/irctc_services_assets/hiking.png";
import {
  FlightsIcon,
  HotelsIcon,
  BusIcon,
  RetiringRoomIcon,
  LoungeIcon,
  TourPackagesIcon,
  BharatGauravIcon,
  BuddhistTrainIcon,
  MaharajasIcon,
  GoldenChariotIcon,
  FerryIcon,
  HeliYatraIcon,
  TAGIcon,
  TrekIcon,
} from "./ServiceIcons";

const iconMap: Record<string, (props: { size?: number; className?: string }) => JSX.Element> = {
  Flights: FlightsIcon,
  Hotels: HotelsIcon,
  "Bus Tickets": BusIcon,
  "Retiring Room": RetiringRoomIcon,
  Lounge: LoungeIcon,
  "Tour Packages": TourPackagesIcon,
  "Bharat Gaurav": BharatGauravIcon,
  "Buddhist Train": BuddhistTrainIcon,
  "Maharajas' Express": MaharajasIcon,
  "Golden Chariot": GoldenChariotIcon,
  Ferry: FerryIcon,
  "Heli Yatra": HeliYatraIcon,
  TAG: TAGIcon,
  Trek: TrekIcon,
};

/**
 * Per-service very-light pastel blob tint behind each icon, matching the
 * reference board. Tints stay intentionally pale — the same family as the
 * SVG assets in `assets/irctc_services_assets/blob-*.svg`.
 */
const blobTint: Record<string, string> = {
  Flights: "#e7f0ff",
  Hotels: "#e0f1ff",
  "Bus Tickets": "#e8fff0",
  "Retiring Room": "#efe8ff",
  Lounge: "#fff5dd",
  "Tour Packages": "#ddf7f2",
  "Bharat Gaurav": "#ffe7f2",
  "Buddhist Train": "#fff5dd",
  "Maharajas' Express": "#ffe6ea",
  "Golden Chariot": "#f2e9ff",
  Ferry: "#ddf7f2",
  "Heli Yatra": "#e7f0ff",
  TAG: "#ffe7f2",
  Trek: "#e8fff0",
};

const defaultTint = "#e7f0ff";

/** Organic blob shape, taken verbatim from the provided blob-*.svg assets. */
const BLOB_PATH =
  "M34,82C20,42,63,5,114,18C162,30,194,74,172,117C150,158,82,154,49,129C29,114,42,103,34,82Z";

/** Soft pastel blob that sits behind an icon. */
function Blob({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <path d={BLOB_PATH} fill={fill} />
    </svg>
  );
}

/** PNG line-icons that override the built-in SVG set for specific services. */
const pngIcon: Record<string, string> = {
  Flights: airplaneIcon,
  Trek: hikingIcon,
};

/**
 * Renders a black line-art PNG as a navy icon by using it as an alpha mask over
 * a `bg-navy` fill — keeps PNG icons colour-matched to the SVG (`text-navy`) set.
 */
function IconImage({ src, size, className = "" }: { src: string; size: number; className?: string }) {
  const mask = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={`block bg-ink ${className}`}
      style={{ width: size, height: size, ...mask }}
    />
  );
}

const shortLabel: Record<string, string> = {
  "Maharajas' Express": "Maharajas'",
};

const displayOrder = [
  "Flights",
  "Hotels",
  "Bus Tickets",
  "Retiring Room",
  "Lounge",
  "Tour Packages",
  "Bharat Gaurav",
  "Buddhist Train",
  "Maharajas' Express",
  "Golden Chariot",
  "Ferry",
  "Heli Yatra",
  "TAG",
  "Trek",
];

const allServices = serviceGroups.flatMap((g) => g.items);
const services = displayOrder.map((label) => allServices.find((s) => s.label === label)!).filter(Boolean);

/** Soft sky gradient backdrop for the section. */
function SkyDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#eaf1fc] via-[#f2f6fd] to-white" />
    </div>
  );
}

export function ServicesSection() {
  const ref = useReveal();

  return (
    <section className="relative overflow-hidden pb-20 md:pb-28" ref={ref}>
      <SkyDecor />
      <div className="reveal relative">
        <h2 className="sr-only">Our Services</h2>
        <p className="sr-only">Comprehensive travel solutions for every explorer.</p>
        <img src={servicesHeadingBanner} alt="" aria-hidden="true" className="block h-auto w-full select-none" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="reveal mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-7">
          {services.map((item) => {
            const Icon = iconMap[item.label] ?? FlightsIcon;
            const png = pngIcon[item.label];
            const tint = blobTint[item.label] ?? defaultTint;
            return (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[210px] flex-col items-center justify-center rounded-[28px] bg-white px-4 py-8 text-center shadow-[0_14px_34px_-16px_rgba(15,32,74,0.18)] transition-all duration-[250ms] ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_46px_-16px_rgba(15,32,74,0.28)]"
              >
                <span className="relative mb-4 flex h-[104px] w-[124px] items-center justify-center transition-transform duration-[250ms] group-hover:scale-105 sm:h-[112px] sm:w-[136px]">
                  <Blob fill={tint} className="absolute inset-0 h-full w-full" />
                  {png ? (
                    <IconImage src={png} size={54} className="relative" />
                  ) : (
                    <Icon size={54} className="relative text-ink" />
                  )}
                </span>
                <span className="text-[15px] font-bold leading-snug text-ink">{shortLabel[item.label] ?? item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
