import { useEffect, useRef } from "react";

/** The oval the plane rides, in viewBox units spanning the whole section — the
 *  empty band and the bento below it. Sized so the loop crosses the cards
 *  rather than skimming the whitespace above them, which means the plane has to
 *  paint *over* the cards (see the z-index on the wrapper). */
const CX = 690;
const CY = 292;
const RX = 430;
const RY = 205;

/** Radians a second at rest — a lap every ~31s. The perimeter is roughly four
 *  times what it was, so the angular speed drops to keep the actual glide the
 *  same gentle pace. */
const BASE_SPEED = 0.2;
/** Scroll pixels → radians a second of extra push. */
const GUST_PER_PX = 0.02;
/** However hard you scroll, it never becomes a blur. */
const MAX_GUST = 3.4;
/** How fast a gust bleeds back to the resting drift (e-folds a second). */
const GUST_DECAY = 2.2;
/** Frames of contrail kept. Because this counts frames rather than distance,
 *  a gust stretches the trail on its own — faster plane, longer streak. */
const TRAIL_FRAMES = 42;
/** Half the gap between the twin contrails, in viewBox units. */
const TRAIL_SPREAD = 6;

interface Mark {
  x: number;
  y: number;
  /** Unit vector perpendicular to travel, so the twin trails stay on the
   *  wingtips through a turn instead of crossing over. */
  px: number;
  py: number;
}

/**
 * A paper plane circling on the breeze between Special Offers and the stats
 * bento, with twin contrails drawn from where it has actually been.
 *
 * Motion is time-driven with scroll as an *impulse*: it always drifts, and
 * scrolling gusts it along before it coasts back down. A scroll-scrubbed plane
 * freezes dead the moment you stop, which is the opposite of wind.
 *
 * Colours follow the site rather than the reference that inspired it — that
 * demo is light-on-black, so its pale pinks would vanish here. These are the
 * brand blues, darkening toward the nose, on our light band.
 *
 * No React state: the loop writes path data and transforms straight to the DOM,
 * and only runs while the band is on screen.
 */
export function BreezePlane() {
  const bandRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const trailARef = useRef<SVGPathElement>(null);
  const trailBRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const plane = planeRef.current;
    const trailA = trailARef.current;
    const trailB = trailBRef.current;
    if (!band || !plane || !trailA || !trailB) return;

    const marks: Mark[] = [];

    const at = (angle: number) => {
      const x = CX + RX * Math.cos(angle);
      const y = CY + RY * Math.sin(angle);
      // Tangent of the oval — where it's heading next, so it banks into turns.
      const vx = -RX * Math.sin(angle);
      const vy = RY * Math.cos(angle);
      const mag = Math.hypot(vx, vy) || 1;
      return { x, y, heading: (Math.atan2(vy, vx) * 180) / Math.PI, px: -vy / mag, py: vx / mag };
    };

    const render = () => {
      if (marks.length < 2) return;
      const toPath = (side: number) =>
        marks
          .map((m, i) => `${i ? "L" : "M"} ${(m.x + m.px * side).toFixed(1)} ${(m.y + m.py * side).toFixed(1)}`)
          .join(" ");
      trailA.setAttribute("d", toPath(TRAIL_SPREAD));
      trailB.setAttribute("d", toPath(-TRAIL_SPREAD));
    };

    const place = (angle: number) => {
      const p = at(angle);
      plane.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.heading.toFixed(2)})`);
      marks.push({ x: p.x, y: p.y, px: p.px, py: p.py });
      if (marks.length > TRAIL_FRAMES) marks.shift();
      render();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Park it mid-glide with a short trail, so a still page still reads as
      // flight rather than as a plane pinned to a page.
      for (let i = 0; i < 10; i++) place(-1.1 + i * 0.02);
      return;
    }

    let angle = -1.1;
    let gust = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let raf = 0;
    let visible = true;

    const tick = (now: number) => {
      // Clamped: a backgrounded tab resumes with a huge dt and would otherwise
      // teleport the plane several laps on the first frame.
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      angle += (BASE_SPEED + gust) * dt;
      gust *= Math.exp(-GUST_DECAY * dt);
      place(angle);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      // Either direction is wind; how hard you scrolled sets how hard it blows.
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      gust = Math.min(MAX_GUST, gust + delta * GUST_PER_PX);
    };

    // Don't burn frames animating a plane nobody can see.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(band);

    place(angle);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      // z-20 puts it above the bento's z-10: the loop crosses the cards, and
      // behind them it would simply vanish for half of every lap.
      // pointer-events-none keeps it from stealing clicks off the cards.
      className="pointer-events-none absolute inset-0 z-20 mx-auto hidden max-w-7xl select-none px-4 md:px-6 lg:block"
    >
      {/* Sway and bob ride on top of the orbit, on periods that don't divide
          into its ~31s lap — that layering is what keeps a circling plane from
          reading as a mechanism. */}
      <div ref={bandRef} className="breeze-sway relative h-full">
        <div className="breeze-bob h-full">
          {/* Spans the section: the empty band plus the cards below it. */}
          <svg viewBox="0 0 1200 588" fill="none" className="h-full w-full overflow-visible">
            <defs>
              {/* userSpaceOnUse so each gradient runs tail-to-nose along the
                  plane's own axis, not its bounding box. The keel is a mid navy
                  rather than the near-black it wants to be: the loop crosses
                  both the white band and the dark photo cards, and a true
                  shadow tone would disappear on the cards. */}
              <linearGradient id="bp-top" gradientUnits="userSpaceOnUse" x1="-50" y1="-25" x2="65" y2="8">
                <stop stopColor="#9AD2F7" />
                <stop offset="1" stopColor="#2475EE" />
              </linearGradient>
              <linearGradient id="bp-keel" gradientUnits="userSpaceOnUse" x1="-40" y1="5" x2="65" y2="0">
                <stop stopColor="#3C6FC4" />
                <stop offset="1" stopColor="#234E9E" />
              </linearGradient>
              <linearGradient id="bp-under" gradientUnits="userSpaceOnUse" x1="-50" y1="32" x2="65" y2="3">
                <stop stopColor="#5FC0F0" />
                <stop offset="1" stopColor="#2A64C8" />
              </linearGradient>
            </defs>

            {/* Brighter than the brand blue for the same reason as the keel —
                this has to stay legible over the dark cards too. */}
            <g stroke="#4B9BF2" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path ref={trailARef} />
              <path ref={trailBRef} />
            </g>

            {/* Drawn nose-along +x, which is the angle the heading maths assumes.
                Three facets fanning from the nose read as folded paper. The
                shadow lifts it off whichever surface it's crossing. */}
            <g ref={planeRef} style={{ filter: "drop-shadow(0 3px 7px rgba(11,45,107,0.35))" }}>
              <path d="M 65 0 L -50 -32 L -25 -1 Z" fill="url(#bp-top)" />
              <path d="M 65 0 L -25 -1 L -40 10 Z" fill="url(#bp-keel)" />
              <path d="M 65 0 L -40 10 L -50 32 Z" fill="url(#bp-under)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
