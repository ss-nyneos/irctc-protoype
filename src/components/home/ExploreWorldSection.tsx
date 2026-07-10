import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import skyline from "@/assets/cta/skyline.svg";
import skylineReflection from "@/assets/cta/skyline-reflection.svg";
import boat from "@/assets/cta/Boat (1).svg";
import gujaratImg from "@/assets/hero/jaipur-amber-fort.jpg";
import madhyaPradeshImg from "@/assets/hero/ladakh-mountains.jpg";
import tamilNaduImg from "@/assets/hero/kerala-tea-gardens.jpg";

/** Solid orange map pin with a white centre — matches the layout markers. */
function Pin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 2c-3.87 0-7 3.05-7 6.8 0 4.98 6.2 12.2 6.46 12.5a.7.7 0 0 0 1.08 0C13.8 21 20 13.78 20 8.8 20 5.05 15.87 2 12 2Z"
        fill="#F97316"
      />
      <circle cx="12" cy="8.8" r="2.6" fill="#fff" />
    </svg>
  );
}

interface DestinationCardProps {
  img: string;
  name: string;
  tours: string;
  /** classes for the image frame (size + rounding) */
  frameClassName: string;
  /** classes for the pill's absolute position relative to the card */
  pillClassName: string;
  alt: string;
}

/** A floating destination photo with an overlapping white "location pill". */
function DestinationCard({ img, name, tours, frameClassName, pillClassName, alt }: DestinationCardProps) {
  return (
    <div className="relative">
      <div className={`overflow-hidden rounded-[2rem] shadow-[0_22px_45px_-20px_rgba(15,32,74,0.5)] ${frameClassName}`}>
        <img src={img} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div
        className={`absolute flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-[0_16px_34px_-12px_rgba(15,32,74,0.45)] ${pillClassName}`}
      >
        <Pin />
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-navy">{name}</p>
          <p className="text-[11px] text-muted-foreground">{tours}</p>
        </div>
      </div>
    </div>
  );
}

/** Boat illustration that bleeds off the lower-left edge. */
function Boat({ className = "" }: { className?: string }) {
  return <img src={boat} alt="" aria-hidden="true" className={`${className} object-contain object-left-bottom`} />;
}

/** Primary CTA button, shared across breakpoints. */
function BookButton({ onBook }: { onBook: () => void }) {
  return (
    <button
      type="button"
      onClick={onBook}
      className="rounded-xl bg-brand px-9 py-3.5 text-[15px] font-bold text-white shadow-[0_16px_30px_-12px_rgba(37,99,235,0.7)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      Book Ticket
    </button>
  );
}

/** Centre content for the desktop composition — heading, sub-copy and CTA. */
function CenterContent({ onBook }: { onBook: () => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 text-center">
      <h2 className="heading-xl text-ink">
        Ready To Explore The <span className="accent">World?</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Start your next adventure today — find hidden gems, plan your trip, and make memories that last a lifetime.
      </p>
      <div className="mt-7 flex justify-center">
        <BookButton onBook={onBook} />
      </div>
    </div>
  );
}

export function ExploreWorldSection() {
  const ref = useReveal<HTMLElement>();
  const { go } = useRouter();
  const book = () => go({ name: "world" });

  return (
    <section
      ref={ref}
      id="explore-world"
      className="relative overflow-hidden bg-white"
      aria-label="Ready to explore the world"
    >
      {/* ───────────────── Desktop: floating composition ───────────────── */}
      <div className="relative hidden h-[1140px] w-full lg:block">
        {/* skyline + mirrored reflection, full-bleed edge-to-edge behind everything */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none">
          <img src={skyline} alt="" className="w-full" />
          <img src={skylineReflection} alt="" className="-mt-px w-full" />
        </div>

        {/* boat sitting flush in the exact bottom-left corner of the pane */}
        <Boat className="pointer-events-none absolute bottom-0 left-0 z-20 h-[200px] w-[260px] select-none" />

        {/* readable-width content layer, same footprint as before so every
            top/left offset below still lines up pixel-for-pixel */}
        <div className="relative mx-auto h-full max-w-7xl px-6">
          {/* Gujarat — top-left, pill overlapping bottom + bleeding left */}
          <div className="reveal absolute left-[3%] top-[116px] z-10">
            <div className="motion-safe:animate-floaty">
              <DestinationCard
                img={gujaratImg}
                alt="Heritage architecture in Gujarat"
                name="Gujarat"
                tours="125 Tours"
                frameClassName="h-[224px] w-[206px]"
                pillClassName="-bottom-6 -left-6 w-[214px]"
              />
            </div>
          </div>

          {/* Madhya Pradesh — top-right, taller, pill overlapping bottom */}
          <div className="reveal absolute right-[3%] top-[12px] z-10">
            <div className="motion-safe:animate-floaty" style={{ animationDelay: "1.4s" }}>
              <DestinationCard
                img={madhyaPradeshImg}
                alt="River canyon in Madhya Pradesh"
                name="Madhya Pradesh"
                tours="125 Tours"
                frameClassName="h-[288px] w-[218px]"
                pillClassName="-bottom-6 left-1/2 w-[204px] -translate-x-1/2"
              />
            </div>
          </div>

          {/* Tamil Nadu — mid-right, smaller, pill overlapping top + bleeding right */}
          <div className="reveal absolute right-[8%] top-[404px] z-10">
            <div className="motion-safe:animate-floaty" style={{ animationDelay: "0.7s" }}>
              <DestinationCard
                img={tamilNaduImg}
                alt="Kayaking in Tamil Nadu"
                name="Tamil Nadu"
                tours="125 Tours"
                frameClassName="h-[164px] w-[152px]"
                pillClassName="-top-5 -right-24 w-[188px]"
              />
            </div>
          </div>

          {/* centred CTA — inset-x-0 + mx-auto keeps it centred without a
              transform (the .reveal class owns `transform` for its entrance) */}
          <div className="reveal absolute inset-x-0 top-[268px] z-10">
            <CenterContent onBook={book} />
          </div>
        </div>
      </div>

      {/* ───────────────── Mobile / tablet: stacked ───────────────── */}
      <div className="w-full overflow-hidden px-5 pt-14 lg:hidden">
        <div className="reveal mx-auto max-w-md text-center">
          <h2 className="heading-xl text-ink">
            Ready To Explore The <span className="accent">World?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Start your next adventure today — find hidden gems, plan your trip, and make memories that last a lifetime.
          </p>
        </div>

        {/* full-bleed horizontal card scroller */}
        <div className="no-scrollbar -mx-5 mt-7 flex snap-x gap-4 overflow-x-auto px-5 pb-6">
          <MiniCard img={gujaratImg} name="Gujarat" tours="125 Tours" alt="Heritage architecture in Gujarat" />
          <MiniCard
            img={madhyaPradeshImg}
            name="Madhya Pradesh"
            tours="125 Tours"
            alt="River canyon in Madhya Pradesh"
          />
          <MiniCard img={tamilNaduImg} name="Tamil Nadu" tours="125 Tours" alt="Kayaking in Tamil Nadu" />
        </div>

        <div className="flex justify-center">
          <BookButton onBook={book} />
        </div>

        <div className="pointer-events-none relative -mx-5 mt-8 select-none">
          <img src={skyline} alt="" className="w-full" />
          <img src={skylineReflection} alt="" className="-mt-px w-full" />
          <Boat className="absolute bottom-0 left-0 h-[130px] w-[170px]" />
        </div>
      </div>
    </section>
  );
}

/** Compact card used in the mobile horizontal scroller. */
function MiniCard({ img, name, tours, alt }: { img: string; name: string; tours: string; alt: string }) {
  return (
    <div className="relative w-[150px] shrink-0 snap-start pb-6">
      <div className="h-[168px] w-full overflow-hidden rounded-[1.6rem] shadow-[0_18px_36px_-18px_rgba(15,32,74,0.5)]">
        <img src={img} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -bottom-1 left-1/2 flex w-[150px] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_14px_30px_-12px_rgba(15,32,74,0.45)]">
        <Pin />
        <div className="leading-tight">
          <p className="text-[12px] font-semibold text-navy">{name}</p>
          <p className="text-[10px] text-muted-foreground">{tours}</p>
        </div>
      </div>
    </div>
  );
}
