import { TrainFront } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useEffect, useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/router/RouterContext";
import { luxuryTrains } from "@/data/trains";
import type { LuxuryTrain } from "@/types";

// ============================================================================
// SPEC (the "prompt" for this file, kept here so the intent survives edits):
//
// - The coach graphic has two liveries: "classic" (orange/graphite) and
//   "light" (the real white/blue Vande Bharat). Geometry is identical
//   between them — only a color palette swaps.
// - Site dark theme  -> coach uses "light"   (white/blue pops on a dark page)
// - Site light theme -> coach uses "classic" (orange/graphite pops on white)
// - This is automatic: <TrainCarousel /> detects the page's dark/light state
//   itself (Tailwind `dark` class on <html>, falling back to OS preference)
//   and picks the matching livery. Nothing at the call site needs to change.
//   Pass an explicit `theme` prop to override the auto-detection.
// - The wheels (drawWheel/bogie below) are UNCHANGED and theme-independent —
//   same spoked, spinning wheel in both liveries. Only the body panels
//   (roof, band, glazing surround, stripe, lower body, skirt, underframe,
//   doors) are palette-driven.
// ============================================================================

export type CoachTheme = "classic" | "light";

interface CoachPalette {
  roof: string;
  roofVent: string;
  accentTop: string;    // top band + swoosh gradient, light stop
  accentBottom: string; // top band + swoosh gradient, dark stop
  windowBase: string;   // body panel around/behind the glazing strip
  glassTop: string;
  glassMid: string;
  glassBottom: string;
  stripeEdge: string;
  stripeMid: string;
  lowerBodyBase: string;
  skirt: string;
  underframeBox: string;
  underframeStroke: string;
  door: string;
  doorStroke: string;
  doorHandle: string;
  ventMark: string;
  glossColor: string;
  glossOpacity: number;
}

const PALETTES: Record<CoachTheme, CoachPalette> = {
  classic: {
    roof: "#202023",
    roofVent: "#9AA0A6",
    accentTop: "#F5844B",
    accentBottom: "#EE6119",
    windowBase: "#1E1E21",
    glassTop: "#3A3F46",
    glassMid: "#1B1E22",
    glassBottom: "#101215",
    stripeEdge: "#8A8E93",
    stripeMid: "#E7E9EB",
    lowerBodyBase: "#1E1E20",
    skirt: "#161618",
    underframeBox: "#0E0E10",
    underframeStroke: "rgba(255,255,255,.08)",
    door: "#17181A",
    doorStroke: "#9AA0A6",
    doorHandle: "#C3C7CB",
    ventMark: "#8A8E93",
    glossColor: "#ffffff",
    glossOpacity: 0.09,
  },
  // real-livery white/blue Vande Bharat, sampled from reference photos
  light: {
    roof: "#D8DBDE",
    roofVent: "#8A9096",
    accentTop: "#2E63B0",
    accentBottom: "#123A73",
    windowBase: "#EEF0F2",
    glassTop: "#3C4750",
    glassMid: "#1B232B",
    glassBottom: "#0B0F14",
    stripeEdge: "#9AA0A6",
    stripeMid: "#F4F6F7",
    lowerBodyBase: "#EEF0F2",
    skirt: "#6B6E73",
    underframeBox: "#33363A",
    underframeStroke: "rgba(255,255,255,.10)",
    door: "#E8EAEC",
    doorStroke: "#9AA0A6",
    doorHandle: "#5B5D61",
    ventMark: "#8A9096",
    glossColor: "#AEB8C2",
    glossOpacity: 0.16,
  },
};

// ---- wheels: UNCHANGED, theme-independent (do not recolor per theme) ----

function drawWheel(cx: number, cy: number, gid: string): string {
  let holes = "";
  for (let a = 0; a < 360; a += 45) {
    const rad = (a * Math.PI) / 180;
    const hx = cx + Math.cos(rad) * 11;
    const hy = cy + Math.sin(rad) * 11;
    holes += `<circle cx="${hx}" cy="${hy}" r="3.2" fill="#1b1c1e"/>`;
  }
  return `
    <g class="wheel-spin" style="transform-origin: ${cx}px ${cy}px;">
      <!-- Outer steel rim -->
      <circle cx="${cx}" cy="${cy}" r="24" fill="#aab2bc" stroke="#565d66" stroke-width="1.6"/>
      <!-- Inner darker tire disc -->
      <circle cx="${cx}" cy="${cy}" r="19" fill="#2d3137"/>
      <!-- Spokes/Ventilation holes -->
      ${holes}
      <!-- Hub cover/cap -->
      <circle cx="${cx}" cy="${cy}" r="7" fill="#6d747d" stroke="#101012" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="2" fill="#d0d5dd"/>
    </g>
  `;
}

/** xLeft = left edge of the bogie housing (176 wide). Wheels are drawn first,
 *  then the housing on top, so it visibly hides the upper ~35% of each wheel.
 *  Housing/frame colors are fixed (undercarriage hardware reads dark on the
 *  real train regardless of body livery) — same reason wheels don't recolor. */
function bogie(xLeft: number, gid: string): string {
  const cy = 396;
  const cx1 = xLeft + 34, cx2 = xLeft + 142;
  let ribs = "";
  for (let i = 0; i < 8; i++) {
    const rx = xLeft + 64 + i * 7;
    ribs += `<line x1="${rx}" y1="356" x2="${rx}" y2="384" stroke="#2c2d2f" stroke-width="2"/>`;
  }
  return `
    <g>
      <!-- Wheels rendered behind the frame -->
      ${drawWheel(cx1, cy, gid)}
      ${drawWheel(cx2, cy, gid)}

      <!-- Suspension details in front of wheels -->
      <path d="M${cx1 - 17},${cy + 13} A18,18 0 0 0 ${cx1 + 17},${cy + 13}" fill="none" stroke="#9298a0" stroke-width="1.6" opacity="0.55"/>
      <path d="M${cx2 - 17},${cy + 13} A18,18 0 0 0 ${cx2 + 17},${cy + 13}" fill="none" stroke="#9298a0" stroke-width="1.6" opacity="0.55"/>

      <!-- Bogie housing / Frame covers the top of the wheels -->
      <rect x="${xLeft}" y="352" width="176" height="38" rx="14" fill="#101012" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
      ${ribs}
      <rect x="${cx1 - 4}" y="386" width="8" height="18" rx="2" fill="#0c0d0e"/>
      <rect x="${cx2 - 4}" y="386" width="8" height="18" rx="2" fill="#0c0d0e"/>
    </g>`;
}

/**
 * Builds one coach as an SVG markup string (viewBox 0 0 760 430).
 * `seed` only needs to be unique per rendered instance on the page — pass
 * something like a sanitized React `useId()` so multiple coaches (e.g. the
 * marquee's duplicated rows) don't collide on gradient ids.
 * `theme` picks the livery: "classic" (orange/graphite) or "light" (the
 * real white/blue Vande Bharat). Wheels/bogie are unaffected by this.
 */
export function buildCoachShellSVG(seed: string | number, theme: CoachTheme = "classic"): string {
  const p = PALETTES[theme];
  const s = `${theme}${String(seed).replace(/[^a-zA-Z0-9]/g, "")}` || "0";
  const gid = "w" + s, glassId = "glass" + s, silverId = "silver" + s, accentId = "accent" + s, glossId = "gloss" + s;

  let mullions = "";
  for (let x = 150; x <= 680; x += 88) {
    mullions += `<line x1="${x}" y1="86" x2="${x}" y2="176" stroke="rgba(0,0,0,.38)" stroke-width="1.6"/>`;
  }

  const boxSpecs: [number, number][] = [[282, 30], [318, 44], [368, 26], [400, 48], [454, 28], [486, 24]];
  const underframe = boxSpecs
    .map(([x, w]) => `<rect x="${x}" y="369" width="${w}" height="13" rx="2" fill="${p.underframeBox}" stroke="${p.underframeStroke}"/>`)
    .join("");

  return `
  <svg viewBox="0 0 760 430" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${accentId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.accentTop}"/>
        <stop offset="1" stop-color="${p.accentBottom}"/>
      </linearGradient>
      <linearGradient id="${glassId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.glassTop}"/>
        <stop offset=".45" stop-color="${p.glassMid}"/>
        <stop offset="1" stop-color="${p.glassBottom}"/>
      </linearGradient>
      <linearGradient id="${silverId}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${p.stripeEdge}"/>
        <stop offset=".5" stop-color="${p.stripeMid}"/>
        <stop offset="1" stop-color="${p.stripeEdge}"/>
      </linearGradient>
      <linearGradient id="${glossId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.glossColor}" stop-opacity="0"/>
        <stop offset=".47" stop-color="${p.glossColor}" stop-opacity="${p.glossOpacity}"/>
        <stop offset=".55" stop-color="${p.glossColor}" stop-opacity="${p.glossOpacity}"/>
        <stop offset="1" stop-color="${p.glossColor}" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <rect x="8" y="14" width="744" height="30" rx="9" fill="${p.roof}"/>
    <rect x="330" y="17" width="42" height="8" rx="2" fill="${p.roofVent}"/>

    <rect x="8" y="44" width="744" height="18" fill="url(#${accentId})"/>

    <rect x="8" y="62" width="744" height="146" fill="${p.windowBase}"/>
    <rect x="70" y="66" width="26" height="7" rx="2" fill="${p.ventMark}"/>

    <rect x="10" y="70" width="40" height="270" rx="4" fill="${p.door}" stroke="${p.doorStroke}" stroke-width="1.2"/>
    <line x1="30" y1="76" x2="30" y2="334" stroke="${p.doorStroke}" stroke-width="1" opacity="0.6"/>
    <rect x="16" y="196" width="6" height="24" rx="2" fill="${p.doorHandle}"/>

    <rect x="62" y="80" width="646" height="100" rx="12" fill="url(#${glassId})" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    ${mullions}
    <rect x="62" y="80" width="646" height="26" rx="12" fill="#ffffff" opacity="0.06"/>

    <rect x="710" y="70" width="40" height="270" rx="4" fill="${p.door}" stroke="${p.doorStroke}" stroke-width="1.2"/>
    <line x1="730" y1="76" x2="730" y2="334" stroke="${p.doorStroke}" stroke-width="1" opacity="0.6"/>
    <rect x="738" y="196" width="6" height="24" rx="2" fill="${p.doorHandle}"/>

    <rect x="8" y="208" width="744" height="152" fill="${p.lowerBodyBase}"/>
    <rect x="8" y="208" width="744" height="6" fill="url(#${silverId})"/>
    <path d="M8,222 Q380,256 752,216 L752,246 Q380,286 8,250 Z" fill="url(#${accentId})"/>

    <rect x="8" y="360" width="744" height="26" fill="${p.skirt}"/>
    ${underframe}

    <line x1="266" y1="398" x2="520" y2="398" stroke="#2a2b2d" stroke-width="2" opacity="0.5"/>
    ${bogie(90, gid)}
    ${bogie(520, gid)}

    <rect x="8" y="14" width="744" height="396" fill="url(#${glossId})"/>
  </svg>`;
}

export const COACH_ASPECT_RATIO = 760 / 430;

export const COACH_CONTENT_PANEL = {
  leftPct: (40 / 760) * 100,   // x = 40
  widthPct: (680 / 760) * 100, // width = 680
  topPct: (54 / 430) * 100,    // y = 54
  heightPct: (282 / 430) * 100, // height = 282
};

function useIsDarkTheme(): boolean {
  const readIsDark = () =>
    typeof document !== "undefined" &&
    (document.documentElement.dataset.theme === "dark" ||
      document.documentElement.classList.contains("dark") ||
      (!document.documentElement.classList.contains("light") &&
        document.documentElement.dataset.theme !== "light" &&
        !!window.matchMedia?.("(prefers-color-scheme: dark)").matches));

  const [isDark, setIsDark] = useState(readIsDark);

  useEffect(() => {
    const update = () => setIsDark(readIsDark());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => {
      mq.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  return isDark;
}

const COACH_WIDTH = 640;
const COACH_HEIGHT = COACH_WIDTH / COACH_ASPECT_RATIO;
const COUPLER_TOP = COACH_HEIGHT * 0.107;
const COUPLER_HEIGHT = COACH_HEIGHT * 0.733;

function CoachShellSVG({ seed, theme }: { seed: string | number; theme: CoachTheme }) {
  const markup = useMemo(() => buildCoachShellSVG(seed, theme), [seed, theme]);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function TrainCarriage({
  train,
  theme,
  onClick,
}: {
  train: LuxuryTrain;
  theme: CoachTheme;
  onClick: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const reactId = useId();
  const seed = `${train.id}${reactId}`;

  return (
    <button
      onClick={onClick}
      type="button"
      className="group relative shrink-0"
      style={{ width: COACH_WIDTH, aspectRatio: COACH_ASPECT_RATIO }}
      aria-label={train.name}
    >
      <CoachShellSVG seed={seed} theme={theme} />

      <div
        className="absolute overflow-hidden"
        style={{
          left: `${COACH_CONTENT_PANEL.leftPct}%`,
          width: `${COACH_CONTENT_PANEL.widthPct}%`,
          top: `${COACH_CONTENT_PANEL.topPct}%`,
          height: `${COACH_CONTENT_PANEL.heightPct}%`,
          borderRadius: "6px",
        }}
      >
        {!broken && (
          <img
            src={train.img}
            alt={train.name}
            loading="lazy"
            onError={() => setBroken(true)}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/20 to-black/5" />
        <div className="absolute inset-x-0 bottom-0 p-2.5 text-left text-white sm:p-3">
          <div
            className="text-[9px] font-bold uppercase leading-none tracking-wider sm:text-[10px]"
            style={{ color: train.livery.trim }}
          >
            {train.tag}
          </div>
          <div className="font-display text-[13px] font-semibold leading-tight sm:text-[16px]">
            {train.name}
          </div>
          <div className="text-[10px] text-white/70 sm:text-[11.5px]">{train.route}</div>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-white/90 opacity-0 transition group-hover:opacity-100">
            Explore journeys <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </button>
  );
}

function Coupler() {
  return (
    <div
      aria-hidden="true"
      className="mx-[-7px] w-4 shrink-0 self-start rounded-sm"
      style={{
        marginTop: COUPLER_TOP,
        height: COUPLER_HEIGHT,
        background: "repeating-linear-gradient(180deg, #35363A 0 4px, #17181A 4px 8px)",
        boxShadow: "inset 0 0 4px rgba(0,0,0,.55)",
      }}
    />
  );
}

function TrainRow({ theme, onPick }: { theme: CoachTheme; onPick: (id: string) => void }) {
  return (
    <div className="flex items-start">
      {luxuryTrains.map((train) => (
        <div key={train.id} className="flex items-start">
          <Coupler />
          <TrainCarriage train={train} theme={theme} onClick={() => onPick(train.id)} />
        </div>
      ))}
      <Coupler />
    </div>
  );
}

export function TrainCarousel({ theme: themeProp }: { theme?: CoachTheme } = {}) {
  const { go } = useRouter();
  const isDark = useIsDarkTheme();
  const theme: CoachTheme = themeProp ?? (isDark ? "light" : "classic");

  const pick = (id: string) => {
    const known = ["maharajas", "goldenchariot"];
    go(known.includes(id) ? { name: "detail", id } : { name: "world" });
  };

  return (
    <div className="train-stage relative">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-76px] z-0 h-[252px]"
        style={{
          backgroundImage: "url('/track.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "top center",
        }}
      />
      <div className="relative -top-7 z-10 overflow-hidden py-2">
        <div className="train-marquee flex w-max items-start gap-0">
          <TrainRow theme={theme} onPick={pick} />
          <TrainRow theme={theme} onPick={pick} />
        </div>
      </div>
    </div>
  );
}

export function LuxuryTrainsSection() {
  const ref = useReveal();
  return (
    <section
      data-skip-gsap-reveal
      className="relative overflow-hidden bg-paper py-28 md:py-36"
    >
      <div className="relative wrap" ref={ref}>
        <div className="reveal reveal-rise flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight text-ink">
              India&apos;s luxury tourist <span className="text-[#2475EE]">trains</span>
            </h2>
          </div>
        </div>
        <div className="reveal mt-10">
          <TrainCarousel />
        </div>
      </div>
    </section>
  );
}