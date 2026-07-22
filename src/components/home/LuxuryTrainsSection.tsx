// import { TrainFront } from "lucide-react";
// import { useReveal } from "@/hooks/useReveal";
// import { useState } from "react";
// import { ArrowRight } from "lucide-react";
// import type { LuxuryTrain } from "@/types";
// import { useRouter } from "@/router/RouterContext";
// // import type { LuxuryTrain } from "@/types";
// import maharajasExpressImg from "@/assets/trains/maharajas-express.jpg";
// import goldenChariotImg from "@/assets/trains/golden-chariot.jpg";
// import palaceOnWheelsImg from "@/assets/trains/palace-on-wheels.jpg";
// import deccanOdysseyImg from "@/assets/trains/deccan-odyssey.jpg";

// export const luxuryTrains: LuxuryTrain[] = [
//   {
//     id: "maharajas",
//     name: "Maharajas' Express",
//     tag: "World's Leading Luxury Train",
//     route: "Delhi · Agra · Rajasthan",
//     grad: ["#7f1d1d", "#dc2626"],
//     // maroon throughout — roof, frame and edging all one colour, no contrast trim
//     livery: { roof: ["#8a2a37", "#5f1c26"], side: "#6b1f2a", trim: "#7a2430" },
//     img: maharajasExpressImg,
//   },
//   {
//     id: "goldenchariot",
//     name: "Golden Chariot",
//     tag: "Pride of the South",
//     route: "Karnataka · Goa",
//     grad: ["#4c1d95", "#7c3aed"],
//     livery: { roof: ["#e0b75f", "#a97e2f"], side: "#b8862b", trim: "#e6c565" },
//     img: goldenChariotImg,
//   },
//   {
//     id: "palace",
//     name: "Palace on Wheels",
//     tag: "Royal Rajasthan on Rails",
//     route: "Delhi · Jaipur · Udaipur",
//     grad: ["#78350f", "#d97706"],
//     livery: { roof: ["#e0b75f", "#a97e2f"], side: "#b8862b", trim: "#e6c565" },
//     img: palaceOnWheelsImg,
//   },
//   {
//     id: "deccan",
//     name: "Deccan Odyssey",
//     tag: "Maharashtra's Blue Jewel",
//     route: "Mumbai · Konkan · Goa",
//     grad: ["#1e3a8a", "#2563eb"],
//     livery: { roof: ["#e3d5bb", "#c2ab89"], side: "#c8b391", trim: "#e8dcc6" },
//     img: deccanOdysseyImg,
//   },
// ];


// function TrainCarriage({ train, onClick }: { train: LuxuryTrain; onClick: () => void }) {
//   const [broken, setBroken] = useState(false);
//   return (
//     <button onClick={onClick} type="button" className="group relative shrink-0" style={{ width: 360 }} aria-label={train.name}>
//       {/* roof — painted in this train's own livery */}
//       <div
//         className="mx-2 h-4 rounded-t-2xl"
//         style={{ background: `linear-gradient(180deg, ${train.livery.roof[0]}, ${train.livery.roof[1]})` }}
//       />
//       {/* roof vents / AC units */}
//       <div className="mx-1 -mt-[3px] flex justify-center gap-14">
//         <span className="h-1.5 w-14 rounded-b-md bg-[#2b2f36]" />
//         <span className="h-1.5 w-14 rounded-b-md bg-[#2b2f36]" />
//       </div>
//       {/* body — frame and edging in this train's livery */}
//       <div
//         className="relative h-[280px] overflow-hidden border-x-[7px] border-y-[3px] shadow-2xl"
//         style={{
//           background: `linear-gradient(135deg, ${train.grad[0]}, ${train.grad[1]})`,
//           borderLeftColor: train.livery.side,
//           borderRightColor: train.livery.side,
//           borderTopColor: train.livery.trim,
//           borderBottomColor: train.livery.trim,
//         }}
//       >
//         {!broken && (
//           <img
//             src={train.img}
//             alt={train.name}
//             loading="lazy"
//             onError={() => setBroken(true)}
//             className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
//           />
//         )}
//         <div
//           className="pointer-events-none absolute inset-0"
//           style={{
//             background:
//               "linear-gradient(90deg, rgba(255,255,255,.14) 0 2px, transparent 2px 33.3%, rgba(255,255,255,.14) 33.3% calc(33.3% + 2px), transparent calc(33.3% + 2px) 66.6%, rgba(255,255,255,.14) 66.6% calc(66.6% + 2px), transparent calc(66.6% + 2px))",
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />
//         <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
//           <div className="text-[11px] font-bold uppercase tracking-wider text-[#e6c565]">{train.tag}</div>
//           <div className="font-display text-[24px] font-semibold leading-tight">{train.name}</div>
//           <div className="text-[13px] text-white/75">{train.route}</div>
//           <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-white/90 opacity-0 transition group-hover:opacity-100">
//             Explore journeys <ArrowRight size={14} />
//           </span>
//         </div>
//       </div>
//       {/* chassis / underframe */}
//       <div className="mx-1.5 h-4 rounded-b-lg bg-gradient-to-b from-[#3b4048] to-[#1d2025]" />
//       {/* bogies + steel wheels */}
//       <div className="mx-auto flex w-4/5 justify-between px-4">
//         {[0, 1].map((g) => (
//           <div key={g} className="flex gap-3">
//             {[0, 1].map((w) => (
//               <span
//                 key={w}
//                 className="wheel-spin block h-8 w-8 rounded-full"
//                 style={{
//                   background:
//                     "radial-gradient(circle at 50% 45%, #eef2f6 0 12%, #aab2bc 14% 34%, #565d66 37% 70%, #23272d 73% 100%)",
//                   boxShadow: "inset 0 1px 2px rgba(255,255,255,.4), 0 2px 3px rgba(0,0,0,.4)",
//                 }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     </button>
//   );
// }

// function Coupler() {
//   return <div className="mx-[-6px] mt-[150px] h-2.5 w-6 shrink-0 self-start rounded bg-[#2b2f36]" />;
// }

// function TrainRow({ onPick }: { onPick: (id: string) => void }) {
//   return (
//     <div className="flex items-start">
//       {luxuryTrains.map((train) => (
//         <div key={train.id} className="flex items-start">
//           <Coupler />
//           <TrainCarriage train={train} onClick={() => onPick(train.id)} />
//         </div>
//       ))}
//       <Coupler />
//     </div>
//   );
// }

// export function TrainCarousel() {
//   const { go } = useRouter();

//   const pick = (id: string) => {
//     const known = ["maharajas", "goldenchariot"];
//     go(known.includes(id) ? { name: "detail", id } : { name: "world" });
//   };

//   return (
//     <div className="train-stage relative">
//       {/* railway track */}
//       <div className="pointer-events-none absolute inset-x-0 bottom-[10px] z-0">
//         {/* wooden sleepers */}
//         <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3">
//           {Array.from({ length: 44 }).map((_, i) => (
//             <span key={i} className="h-4 w-2 rounded-sm bg-[#7c6a4f]/80" />
//           ))}
//         </div>
//         {/* steel rail */}
//         <div
//           className="absolute bottom-[7px] h-[5px] w-full rounded-full"
//           style={{
//             background: "linear-gradient(180deg, #d3dae1 0%, #9aa2ac 45%, #5c636c 100%)",
//             boxShadow: "0 1px 2px rgba(0,0,0,.3)",
//           }}
//         />
//       </div>
//       <div className="relative z-10 overflow-hidden py-2">
//         <div className="train-marquee flex w-max items-start gap-0">
//           <TrainRow onPick={pick} />
//           <TrainRow onPick={pick} />
//         </div>
//       </div>
//     </div>
//   );
// }


// export function LuxuryTrainsSection() {
//   const ref = useReveal();
//   return (
//     <section className="relative overflow-hidden py-28 md:py-36">
//       <div className="relative mx-auto max-w-7xl px-4 md:px-6" ref={ref}>
//         <div className="reveal reveal-rise flex flex-wrap items-end justify-between gap-4">
//           <div>
//             <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-azure">
//               <TrainFront size={15} /> Palaces on rails
//             </div>
//             <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight text-ink">
//               India&apos;s luxury tourist <span className="text-[#2475EE]">trains</span>
//             </h2>
//           </div>
//         </div>
//         <div className="reveal mt-10">
//           <TrainCarousel />
//         </div>
//       </div>
//     </section>
//   );
// }

import { TrainFront } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/router/RouterContext";
import { luxuryTrains } from "@/data/trains";
import type { LuxuryTrain } from "@/types";



// Ported from "IRCTC train shell v3" — COACH ONLY.
// The engine/nose and the track/reflection background from that build are
// intentionally left out, per brief: this file draws exactly one coach body
// (roof, orange band, continuous glazing, doors, silver stripe + orange
// swoosh, skirt, dense underframe, big bogies with wheel-tops tucked behind
// the housing) as a self-contained SVG string.

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
 *  then the housing on top, so it visibly hides the upper ~35% of each wheel. */
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
 */
export function buildCoachShellSVG(seed: string | number): string {
  const s = String(seed).replace(/[^a-zA-Z0-9]/g, "") || "0";
  const gid = "w" + s, glassId = "glass" + s, silverId = "silver" + s, orangeId = "orangeC" + s, glossId = "gloss" + s;

  let mullions = "";
  for (let x = 150; x <= 680; x += 88) {
    mullions += `<line x1="${x}" y1="86" x2="${x}" y2="176" stroke="rgba(0,0,0,.38)" stroke-width="1.6"/>`;
  }

  const boxSpecs: [number, number][] = [[282, 30], [318, 44], [368, 26], [400, 48], [454, 28], [486, 24]];
  const underframe = boxSpecs
    .map(([x, w]) => `<rect x="${x}" y="369" width="${w}" height="13" rx="2" fill="#0E0E10" stroke="rgba(255,255,255,.08)"/>`)
    .join("");

  return `
  <svg viewBox="0 0 760 430" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${orangeId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F5844B"/>
        <stop offset="1" stop-color="#EE6119"/>
      </linearGradient>
      <linearGradient id="${glassId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3A3F46"/>
        <stop offset=".45" stop-color="#1B1E22"/>
        <stop offset="1" stop-color="#101215"/>
      </linearGradient>
      <linearGradient id="${silverId}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8A8E93"/>
        <stop offset=".5" stop-color="#E7E9EB"/>
        <stop offset="1" stop-color="#8A8E93"/>
      </linearGradient>
      <radialGradient id="${gid}" cx="35%" cy="30%" r="75%">
        <stop offset="0" stop-color="#55575c"/>
        <stop offset="1" stop-color="#101012"/>
      </radialGradient>
      <linearGradient id="${glossId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset=".47" stop-color="#ffffff" stop-opacity="0.09"/>
        <stop offset=".55" stop-color="#ffffff" stop-opacity="0.09"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <rect x="8" y="14" width="744" height="30" rx="9" fill="#202023"/>
    <rect x="330" y="17" width="42" height="8" rx="2" fill="#9AA0A6"/>

    <rect x="8" y="44" width="744" height="18" fill="url(#${orangeId})"/>

    <rect x="8" y="62" width="744" height="146" fill="#1E1E21"/>
    <rect x="70" y="66" width="26" height="7" rx="2" fill="#8A8E93"/>

    <rect x="10" y="70" width="40" height="270" rx="4" fill="#17181A" stroke="#9AA0A6" stroke-width="1.2"/>
    <line x1="30" y1="76" x2="30" y2="334" stroke="#5b5d61" stroke-width="1"/>
    <rect x="16" y="196" width="6" height="24" rx="2" fill="#C3C7CB"/>

    <rect x="62" y="80" width="646" height="100" rx="12" fill="url(#${glassId})" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    ${mullions}
    <rect x="62" y="80" width="646" height="26" rx="12" fill="#ffffff" opacity="0.06"/>

    <rect x="710" y="70" width="40" height="270" rx="4" fill="#17181A" stroke="#9AA0A6" stroke-width="1.2"/>
    <line x1="730" y1="76" x2="730" y2="334" stroke="#5b5d61" stroke-width="1"/>
    <rect x="738" y="196" width="6" height="24" rx="2" fill="#C3C7CB"/>

    <rect x="8" y="208" width="744" height="152" fill="#1E1E20"/>
    <rect x="8" y="208" width="744" height="6" fill="url(#${silverId})"/>
    <path d="M8,222 Q380,256 752,216 L752,246 Q380,286 8,250 Z" fill="url(#${orangeId})"/>

    <rect x="8" y="360" width="744" height="26" fill="#161618"/>
    ${underframe}

    <line x1="266" y1="398" x2="520" y2="398" stroke="#2a2b2d" stroke-width="2" opacity="0.5"/>
    ${bogie(90, gid)}
    ${bogie(520, gid)}

    <rect x="8" y="14" width="744" height="396" fill="url(#${glossId})"/>
  </svg>`;
}

/** width / height of the coach viewBox — use this to size the carriage container
 *  (e.g. `style={{ width: W, aspectRatio: COACH_ASPECT_RATIO }}`) so the coach
 *  is never stretched or squashed off its true side-elevation proportions. */
export const COACH_ASPECT_RATIO = 760 / 430;

/** The coach's "middle part": the flat lower-body panel between the silver
 *  stripe and the skirt, clear of both doors. This is where package content
 *  (image + text) belongs — everything else in the shell is fixed livery. */
export const COACH_CONTENT_PANEL = {
  leftPct: (40 / 760) * 100,      // x = 120 (0.7x width centered)
  widthPct: (680 / 760) * 100,     // width = 521
  topPct: (54 / 430) * 100,        // y = 66 (0.7x height centered)
  heightPct: (282 / 430) * 100,    // height = 242
};





// ---- coach sizing, derived once so the coupler math below always matches ----
const COACH_WIDTH = 640;
const COACH_HEIGHT = COACH_WIDTH / COACH_ASPECT_RATIO;
// same band the shell reserves for its bellows connector (10.7% -> 83.7% of height)
const COUPLER_TOP = COACH_HEIGHT * 0.107;
const COUPLER_HEIGHT = COACH_HEIGHT * 0.733;

/** Renders exactly one coach body (roof, glazing, doors, livery, underframe,
 *  bogies) from the IRCTC train-shell-v3 build. No engine, no track — coach only. */
function CoachShellSVG({ seed }: { seed: string | number }) {
  const markup = useMemo(() => buildCoachShellSVG(seed), [seed]);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function TrainCarriage({ train, onClick }: { train: LuxuryTrain; onClick: () => void }) {
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
      {/* authentic coach shell — roof, orange band, glazing, doors, livery, underframe, bogies */}
      <CoachShellSVG seed={seed} />

      {/* package content, confined to the coach's middle panel (clear of both doors) */}
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

/** Small bellows-style coupler between coaches, sized to the same band the
 *  shell reserves for its own connector so the seam lines up. */
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

function TrainRow({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="flex items-start">
      {luxuryTrains.map((train) => (
        <div key={train.id} className="flex items-start">
          <Coupler />
          <TrainCarriage train={train} onClick={() => onPick(train.id)} />
        </div>
      ))}
      <Coupler />
    </div>
  );
}

export function TrainCarousel() {
  const { go } = useRouter();

  const pick = (id: string) => {
    const known = ["maharajas", "goldenchariot"];
    go(known.includes(id) ? { name: "detail", id } : { name: "world" });
  };

  return (
    <div className="train-stage relative">
      {/* railway track */}
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
          <TrainRow onPick={pick} />
          <TrainRow onPick={pick} />
        </div>
      </div>
    </div>
  );
}

export function LuxuryTrainsSection() {
  const ref = useReveal();
  return (
    // data-skip-gsap-reveal: Design1Layout GSAP also targets .reveal; leave
    // entrance to useReveal so this section works on both Home and HomePage.
    <section
      data-skip-gsap-reveal
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-6" ref={ref}>
        <div className="reveal reveal-rise flex flex-wrap items-end justify-between gap-4">
          <div>
            {/* <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-azure">
              <TrainFront size={15} /> Palaces on rails
            </div> */}
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