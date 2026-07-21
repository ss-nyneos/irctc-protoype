/**
 * PreloadScreen.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Fixed overlay rendered on top of the landing page (which is mounted
 * behind it). When the animation ends the overlay fades to opacity-0,
 * revealing the landing page below — no white flash.
 *
 * Timeline:
 *   0 – 600ms   → Static split: 50% blue | 50% white with train
 *   600 – 2600ms → Train slides off right + blue expands 50%→100% (2 s)
 *   2600 – 2800ms → "Explore the world with IRCTC" fades in  (200 ms)
 *   2800 – 3000ms → Hold
 *   3000 – 3300ms → Overlay fades out, revealing landing page  (300 ms)
 *   3300ms        → URL switches to /landing
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const T_HOLD_END = 600;    // static split ends
const T_EXPAND_END = 2600;   // train exit + blue expansion complete (2 s)
const T_TEXT_START = 600;    // text starts fading in
const T_TEXT_END = 2000;   // "Explore…" fully visible
const T_HOLD2_END = 3000;   // short hold
const T_TOTAL = 3300;   // overlay fully transparent → navigate


function easeInOut(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** `to` is where the overlay hands off once it has faded. Defaults to the
    main app shell; the Design 1 landing page passes its own route. */
export function PreloadScreen({ to = "/landing" }: { to?: string } = {}) {
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  // Lock body scroll while the preload overlay is visible
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const ms = now - startRef.current;
      setElapsed(ms);

      if (ms < T_TOTAL) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        navigate(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [navigate, to]);

  // ── Derived values ────────────────────────────────────────────────────

  // Train + blue expansion: progress over [T_HOLD_END, T_EXPAND_END]
  const expandProgress = easeInOut(
    Math.max(0, Math.min(1, (elapsed - T_HOLD_END) / (T_EXPAND_END - T_HOLD_END)))
  );

  const blueWidth = lerp(50, 100, expandProgress);   // 50% → 100%
  const trainTranslateVw = lerp(0, 55, expandProgress);     // slide off right — matches blue travel speed
  const trainOpacity = lerp(1, 0, expandProgress);
  const dividerOpacity = lerp(1, 0, expandProgress);

  // "Explore" text: [T_TEXT_START, T_TEXT_END] — fade in during expansion
  const textProgress = easeInOut(
    Math.max(0, Math.min(1, (elapsed - T_TEXT_START) / (T_TEXT_END - T_TEXT_START)))
  );


  // Overlay fade-out: [T_HOLD2_END, T_TOTAL] — 300 ms
  const fadeOutProgress = easeInOut(
    Math.max(0, Math.min(1, (elapsed - T_HOLD2_END) / (T_TOTAL - T_HOLD2_END)))
  );
  const overlayOpacity = 1 - fadeOutProgress;

  return (
    <div
      className="fixed inset-0 z-[200] select-none overflow-hidden"
      style={{
        opacity: overlayOpacity,
        pointerEvents: overlayOpacity > 0 ? "all" : "none",
      }}
    >
      {/* White base */}
      <div className="absolute inset-0 bg-white" />

      {/* Train — right half, slides off to the right */}
      <div
        className="absolute right-[5%] md:right-[10%] -bottom-72 w-[280px] sm:w-[420px] md:w-[560px] pointer-events-none"
        style={{
          transform: `translate3d(${trainTranslateVw}vw, -50%, 0)`,
          opacity: trainOpacity,
        }}
      >
        <img
          src="/vandeBharat.png"
          alt="Vande Bharat Express"
          className="w-full h-auto object-contain"
          draggable="false"
        />
      </div>

      {/* Centre divider */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-neutral-200/60 z-20 pointer-events-none"
        style={{ opacity: dividerOpacity }}
      />

      {/* Blue pane — expands to full width */}
      <div
        className="absolute left-0 top-0 h-full bg-brand z-10 overflow-hidden"
        style={{ width: `${blueWidth}%` }}
      >
        {/* "Explore the world with IRCTC" */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none"
          style={{ opacity: textProgress }}
        >
          <h1
            className="text-[61px] font-extrabold text-white
                       text-center leading-[1.1] tracking-tight font-sans drop-shadow-md max-w-4xl"
          >
            Explore the world
            <br />
            with IRCTC
          </h1>
        </div>
      </div>
    </div>
  );
}
