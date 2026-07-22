import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { interpolate } from "flubber";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "@/router/RouterContext";

// ─── 1. Shape paths ────────────────────────────────────────────────────────
// All shapes are in a shared 1279 × 520 viewBox so they register correctly.

/** Stage A – plain rounded rectangle (the opening hero card) */
const RECT_PATH =
  "M24,0 " +
  "L1255,0 " +
  "Q1279,0 1279,24 " +
  "L1279,496 " +
  "Q1279,520 1255,520 " +
  "L24,520 " +
  "Q0,520 0,496 " +
  "L0,24 " +
  "Q0,0 24,0 Z";

/** Stage B – "gumdrop" arch: same bottom, top pulls into a semicircle */
const ARCH_PATH =
  "M0,306 " +
  "Q0,0 640,0 " +
  "Q1279,0 1279,306 " +
  "L1279,496 " +
  "Q1279,520 1255,520 " +
  "L24,520 " +
  "Q0,520 0,496 Z";

const TRAIN_PATH =
  "M1182.0,488.9 L1167.3,499.6 L1096.1,510.2 L995.6,514.3 L936.7,513.5 " +
  "L903.2,510.2 L824.7,493.8 L705.3,461.9 L619.5,435.8 L554.9,427.6 " +
  "L522.2,417.0 L339.0,373.6 L80.7,307.4 L80.7,197.0 L136.3,182.3 " +
  "L149.3,182.3 L272.8,152.1 L558.1,89.1 L584.3,77.7 L636.6,60.5 " +
  "L735.6,39.2 L738.8,30.3 L746.2,21.3 L781.4,11.4 L832.0,5.7 " +
  "L837.8,12.3 L838.6,27.0 L877.8,23.7 L920.3,26.2 L924.4,21.3 " +
  "L938.3,21.3 L945.7,31.9 L976.8,39.2 L1015.2,54.8 L1037.3,67.9 " +
  "L1054.4,82.6 L1088.8,128.4 L1159.9,253.5 L1175.4,286.2 L1185.3,316.4 " +
  "L1191.8,347.5 L1194.2,377.7 L1191.8,397.4 L1186.1,412.9 L1155.8,444.0 " +
  "L1151.7,474.2 L1167.3,476.7 L1173.0,481.6 L1179.5,482.4 Z";

// ─── 2. Design tokens ──────────────────────────────────────────────────────

/* Theme tokens, not fixed hex: these resolve through --vb-* (see tokens.css),
   which invert under [data-theme='dark'] so the whole morph flips to night
   instead of staying a light band in dark mode. Inline style honours var(). */
const T = {
  bg: "var(--vb-bg)",       // section surface
  ink: "var(--vb-ink)",     // headline + body text
  muted: "var(--vb-muted)", // secondary text
  accent: "var(--vb-accent)", // VB saffron-orange (check icons, ticks)
  rail: "var(--vb-rail)",   // dividers
};

// ─── 3. Checklist data ─────────────────────────────────────────────────────

const LEFT_ITEMS = [
  "Semi-high-speed, self-propelled train set",
  "Manufactured in India (Make in India)",
  "Anti-collision (Kavach) equipped",
  "Energy-efficient, zero-discharge design",
];
const RIGHT_ITEMS = [
  "Anti-collision (Kavach) equipped",
  "Energy-efficient, zero-discharge design",
];

// ─── 4. Component ──────────────────────────────────────────────────────────

interface Props {
  /** URL or import of the train photo (4:3 or 1:1, cab centred, non-mirrored) */
  imageSrc: string;
  headline?: string;
}

export function VandeBharatScrollMorph({
  imageSrc,
  headline = "INDIAN RAIL",
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const clipPathId = "vb-morph-clip";
  const { go } = useRouter();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Build flubber interpolators once (they're expensive to create).
  const trainToArch = useMemo(
    () => interpolate(TRAIN_PATH, ARCH_PATH, { maxSegmentLength: 6 }),
    [],
  );
  const archToRect = useMemo(
    () => interpolate(ARCH_PATH, RECT_PATH, { maxSegmentLength: 6 }),
    [],
  );

  // Map scroll progress → SVG path string for the clip shape.
  const clipD = useTransform(scrollYProgress, (t: number) => {
    if (prefersReducedMotion) return RECT_PATH;
    if (t <= 0.3) return trainToArch(t / 0.3);
    if (t <= 0.6) return archToRect((t - 0.3) / 0.3);
    return RECT_PATH;
  });

  // Parallax for supporting layers
  const headlineY = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 0;
    if (t > 1) return -120;
    return -120 * t; // Moves upward by 120px as you scroll down
  });
  const headlineOpacity = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 1;    // Visible initially
    if (t > 0.4) return 0;  // Fades out by progress 0.4
    return 1 - (t / 0.4);
  });


  const imageScale = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 1.2;
    if (t > 1) return 1.0;
    return 1.2 - 0.2 * t;
  });

  const imageX = useTransform(scrollYProgress, (t) => {
    if (t < 0) return -60;
    if (t > 1) return 0;
    return -60 * (1 - t);
  });


  // Checklists and stats fade out as we scroll down to show the final card
  const leftX = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 0;
    if (t > 0.3) return -70;
    return -70 * (t / 0.3);
  });
  const rightX = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 0;
    if (t > 0.3) return 70;
    return 70 * (t / 0.3);
  });
  const itemsOp = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 1;
    if (t > 0.25) return 0;
    return 1 - (t / 0.25);
  });

  // CTA overlay inside the card fades in as the card becomes a rounded rectangle
  const ctaOpacity = useTransform(scrollYProgress, (t) => {
    if (t < 0.6) return 0;
    if (t >= 0.9) return 1;
    return (t - 0.6) / 0.3;
  });
  const ctaPointerEvents = useTransform(scrollYProgress, (t) => t > 0.6 ? "auto" : "none");

  // Initial SVG size is smaller and expands as we scroll
  const containerScale = useTransform(scrollYProgress, (t) => {
    if (t < 0) return 0.8;
    if (t > 0.6) return 1.0;
    return 0.8 + 0.2 * (t / 0.6);
  });

  return (
    /* Tall scroll container – gives the morph room to play out */
    <div ref={sectionRef} className="relative" style={{ height: "300vh" }}>

      {/* Sticky stage – pinned at top for the full scroll travel */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: T.bg }}
      >
        {/* ── Giant ghost headline ─────────────────────────────────────── */}
        <motion.p
          aria-hidden
          style={{ top: "15%", y: headlineY, opacity: headlineOpacity }}
          className="
            absolute inset-x-0 text-center select-none pointer-events-none
            font-extrabold uppercase leading-none tracking-tighter
            text-[18vw] z-0
          "
        >
          <span style={{ color: T.ink, opacity: 0.09 }}>{headline}</span>
        </motion.p>

        {/* ── Morphing clip + photo ────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          style={{
            width: "min(90vw, 1279px)",
            aspectRatio: "1279/520",
            overflow: "visible",
            scale: containerScale
          }}
        >
          <svg
            viewBox="0 0 1279 520"
            className="w-full h-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
                {/* framer-motion animates the `d` attribute directly */}
                <motion.path d={clipD as unknown as string} />
              </clipPath>
            </defs>

            {/* The train photo, clipped to the morphing shape */}
            <motion.image
              href={imageSrc}
              x={imageX as unknown as number}
              y={0}
              width={1279}
              height={520}
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipPathId})`}
              style={{ scale: imageScale, transformOrigin: "640px 260px" }}
            />

          </svg>

          {/* CTA Overlay inside the card */}
          <motion.div
            style={{ opacity: ctaOpacity, pointerEvents: ctaPointerEvents }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white"
          >
            {/* Dark scrim to make text highly readable over the background train image */}
            <div className="absolute inset-0" style={{ borderRadius: "24px" }} />

            <div className="relative max-w-3xl px-4 flex flex-col items-center justify-center">
              <h2 className="text-3xl md:text-5xl lg:text-[42px] font-bold leading-[1.1] tracking-tight text-white font-sans">
                Ready To Explore the Wonders
                <br />
                of <span className="text-[#F2662A]" style={{ color: "#F2662A" }}>Travel Today?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm md:text-[17px] leading-relaxed text-white/90">
                breathtaking views, beautiful landscapes, and unforgettable moments in one of the world's most iconic destinations.
              </p>
              <button
                onClick={() => go({ name: "customise" })}
                type="button"
                className="mt-8 inline-flex items-center gap-4 rounded-full bg-white py-2 pl-7 pr-2 text-sm md:text-[15px] font-bold text-[#323232] shadow-lg transition hover:bg-white/90"
              >
                Reserve Your Tour Now
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8532E] text-white">
                  <ArrowUpRight size={18} />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>



        {/* ── Left checklist ───────────────────────────────────────────── */}
        <motion.ul
          style={{ x: leftX, opacity: itemsOp }}
          className="hidden md:flex flex-col gap-5 absolute left-8 lg:left-14 top-[60%] -translate-y-1/2 z-20"
        >
          {LEFT_ITEMS.map((label) => (
            <CheckItem key={label} label={label} />
          ))}
        </motion.ul>

        {/* ── Right checklist ──────────────────────────────────────────── */}
        {/* <motion.ul
          style={{ x: rightX, opacity: itemsOp }}
          className="hidden md:flex flex-col gap-5 absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 z-20"
        >
          {RIGHT_ITEMS.map((label) => (
            <CheckItem key={label} label={label} />
          ))}
        </motion.ul> */}


      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function CheckItem({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3 max-w-[200px]">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
                   rounded-full text-white text-[10px] font-bold"
        style={{ backgroundColor: T.accent }}
        aria-hidden
      >
        ✓
      </span>
      <span className="text-[13px] font-medium leading-snug" style={{ color: T.ink }}>
        {label}
      </span>
    </li>
  );
}

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className="font-mono text-[22px] font-bold tracking-tight"
        style={{ color: T.ink }}
      >
        {value}
        {unit && (
          <span className="text-[13px] font-normal ml-1" style={{ color: T.muted }}>
            {unit}
          </span>
        )}
      </span>
      <span className="text-[11px] tracking-widest uppercase" style={{ color: T.muted }}>
        {label}
      </span>
    </div>
  );
}