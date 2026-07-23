import { useCallback, useEffect, useId, useMemo } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from "lucide-react";
import { IndiaMap } from "@/components/common/IndiaMap";
import { ItineraryRail } from "@/components/detail/ItineraryRail";
import { resolveStops } from "@/data/geoPlaces";
import { useMapZoom } from "@/hooks/useMapZoom";
import { INDIA_VIEW, projectPoint } from "@/maps/projection";
import type { ItineraryDay } from "@/types";

/** Pin geometry, in map units. The head floats above the anchor on a stick. */
const PIN_STICK = 20;
const PIN_HEAD = 7;

/** Label column layout, all in map units so everything scales as one. */
const LABEL_GAP = 54;
const LABEL_EDGE = 40;
const LABEL_INSET = 238;
const PLATE_H = 42;
const BADGE_R = 11;

export function ItineraryMap({
  days,
  active,
  onActive,
}: {
  days: ItineraryDay[];
  active: number;
  onActive: (index: number) => void;
}) {
  const uid = useId().replace(/:/g, "");

  const stops = useMemo(() => resolveStops(days), [days]);
  const points = useMemo(() => stops.map((s) => projectPoint(s.coordinates)), [stops]);
  const clusterBounds = useMemo(() => {
    if (points.length === 0) return { cx: 400, cy: 430, k: 2.8 };

    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Center of cluster including pill offset on right side
    const cx = (minX + maxX + 65) / 2;
    const cy = (minY + maxY - 25) / 2;

    const routeW = Math.max(1, maxX - minX + 160);
    const routeH = Math.max(1, maxY - minY + 100);

    const scaleX = INDIA_VIEW.width / routeW;
    const scaleY = INDIA_VIEW.height / routeH;
    const k = Math.min(2.8, Math.max(2.2, Math.min(scaleX, scaleY)));

    return { cx, cy, k };
  }, [points]);

  const initialZoom = useMemo(() => {
    const { cx, cy, k } = clusterBounds;
    const x = INDIA_VIEW.width / 2 - cx * k;
    const y = INDIA_VIEW.height / 2 - cy * k;

    return { k, x, y };
  }, [clusterBounds]);

  const { zoom, frameRef, zoomIn, zoomOut, reset, zoomToPoint, handlers, project } = useMapZoom(
    INDIA_VIEW.width,
    INDIA_VIEW.height,
    8,
    initialZoom,
  );

  /** The travel line, as an SVG path through every halt in order. */
  const routePath = useMemo(
    () => points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" "),
    [points],
  );

  // Which pin owns the open day (defaults to Day 1 / first stop).
  const effectiveActive = active >= 0 ? active : 0;
  const activeStopIndex = stops.findIndex((s) => s.dayIndexes.includes(effectiveActive));
  const activeStop = activeStopIndex >= 0 ? activeStopIndex : 0;

  const select = useCallback((index: number) => onActive(index), [onActive]);

  // Keep cluster + active pill centered in map frame with equal padding
  useEffect(() => {
    const { cx, cy, k } = clusterBounds;
    zoomToPoint(cx, cy, k);
  }, [clusterBounds, zoomToPoint]);

  // A single pin can't be a journey, and no pins means we can't place the trip.
  if (stops.length < 2) {
    return <ItineraryRail days={days} active={effectiveActive} onActive={onActive} />;
  }

  const day: ItineraryDay = days[effectiveActive] ?? days[0];
  const travelSeconds = Math.max(10, stops.length * 2.2);
  const k = zoom.k;

  /**
   * Leaders and labels live above the zoom, in fixed frame coordinates.
   * Only the leader line and label pill for the SELECTED DATE are rendered.
   * Pill sits on the RIGHT horizontal side with text ONLY (no badge, no DAY count).
   */
  const overlay = (
    <>
      {stops.map((stop, i) => {
        if (i !== activeStop) return null;

        const [px, py] = project(points[i][0], points[i][1]);
        const headY = py - (PIN_STICK + PIN_HEAD);

        const plateH = 36;
        const plateW = Math.max(100, stop.label.length * 10 + 28);
        const gap = 120;

        // Position pill on RIGHT horizontal side of pin
        let left = px + gap;
        let lineTargetX = left;

        // Fallback to left side only if placing on right overflows right container edge
        if (left + plateW > INDIA_VIEW.width - 20) {
          left = Math.max(20, px - gap - plateW);
          lineTargetX = left + plateW;
        }

        return (
          <g key={`active-callout-${stop.from}`}>
            {/* Leader line directly to pin head */}
            <path
              d={`M${px},${headY} L${lineTargetX},${headY}`}
              fill="none"
              stroke="#2475EE"
              strokeWidth={1.8}
              strokeDasharray="3 3"
              className="itin-leader"
            />

            {/* Pill with text ONLY (no 1 or DAY count) */}
            <g
              className="itin-label is-active cursor-pointer"
              onClick={() => select(stop.dayIndexes[0])}
              role="button"
              aria-label={stop.label}
            >
              <rect
                x={left}
                y={headY - plateH / 2}
                width={plateW}
                height={plateH}
                rx={plateH / 2}
                fill="#2475EE"
                stroke="#2475EE"
                strokeWidth={1}
                filter={`url(#${uid}-plate)`}
              />
              <text
                x={left + plateW / 2}
                y={headY + 4.5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={700}
                fill="#FFFFFF"
              >
                {stop.label}
              </text>
            </g>
          </g>
        );
      })}
    </>
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-[22px] font-bold text-ink">Day-by-day itinerary</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {days.length} days, {stops.length} stops. Follow the route, or pick a stop to open the day.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Map section (wider, zoomed in) */}
        <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-border bg-[#F8FAFF] lg:col-span-8">
          <IndiaMap
            containerRef={frameRef}
            containerProps={{
              ...handlers,
              // Vertical page scrolling stays with the browser; the map only
              // claims the gestures it was asked for.
              style: { touchAction: "pan-y", cursor: k > 1 ? "grab" : "default" },
            }}
            transform={`translate(${zoom.x} ${zoom.y}) scale(${k})`}
            zoom={k}
            overlay={overlay}
          >
            <defs>
              {/* Lit from the top-left, which is what sells the pin heads as beads
                  rather than flat dots. */}
              <radialGradient id={`${uid}-head`} cx="34%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#7FB0FF" />
                <stop offset="55%" stopColor="#2475EE" />
                <stop offset="100%" stopColor="#123E82" />
              </radialGradient>
              <radialGradient id={`${uid}-headIdle`} cx="34%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#8C93A6" />
                <stop offset="55%" stopColor="#3D4557" />
                <stop offset="100%" stopColor="#161B26" />
              </radialGradient>
              <filter id={`${uid}-plate`} x="-12%" y="-40%" width="124%" height="180%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#12224A" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* ── Route ─────────────────────────────────────────── */}
            <path
              d={routePath}
              fill="none"
              stroke="#2475EE"
              strokeOpacity={0.22}
              strokeWidth={2.4 / k}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* The flowing dash reads as direction of travel. */}
            <path
              d={routePath}
              fill="none"
              stroke="#2475EE"
              strokeOpacity={0.85}
              strokeWidth={2.4 / k}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${10 / k} ${14 / k}`}
              className="route-flow"
              style={{ ["--flow" as string]: `${-24 / k}` }}
            />

            {/* The marker running the line, on a loop. animateMotion owns the
                outer transform, so the counter-scale has to go on a child. */}
            <g>
              <animateMotion dur={`${travelSeconds}s`} repeatCount="indefinite" path={routePath} rotate="auto" />
              <g transform={`scale(${1 / k})`}>
                <circle r={9} fill="#2475EE" fillOpacity={0.18} />
                <path d="M-4,-4 L6,0 L-4,4 L-2,0 Z" fill="#2475EE" />
              </g>
            </g>

            {/* ── Pins ──────────────────────────────────────────── */}
            {stops.map((stop, i) => {
              const [x, y] = points[i];
              const isActive = i === activeStop;
              const head = isActive ? PIN_HEAD + 2.5 : PIN_HEAD;
              const stick = isActive ? PIN_STICK + 5 : PIN_STICK;
              return (
                // Counter-scaled: zooming spreads the pins apart without
                // inflating them, which is the whole point of zooming a cluster.
                <g key={`pin-${stop.from}`} transform={`translate(${x} ${y}) scale(${1 / k})`}>
                  <g
                    className="itin-pin"
                    style={{ animationDelay: `${i * 70}ms` }}
                    onClick={() => select(stop.dayIndexes[0])}
                    role="button"
                    aria-label={`Stop ${i + 1}, day ${stop.from}, ${stop.label}`}
                  >
                    {/* Invisible hit target: the pin itself is a thin stick and a
                        small head, which is a hard thing to click. */}
                    <circle cx={0} cy={-stick} r={head + 12} fill="transparent" />
                    {/* Ground shadow — the pin stands on the map, not in it. */}
                    <ellipse cx={0} cy={1} rx={head * 0.8} ry={head * 0.3} fill="#0B1B33" opacity={0.18} />
                    <line
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={-stick}
                      stroke={isActive ? "#123E82" : "#22262F"}
                      strokeWidth={1.6}
                      strokeLinecap="round"
                    />
                    {isActive && (
                      <circle cx={0} cy={-stick - head} r={head} fill="#2475EE" opacity={0.35}>
                        <animate attributeName="r" values={`${head};${head * 2.4};${head}`} dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={0} cy={-stick - head} r={head} fill={`url(#${uid}-${isActive ? "head" : "headIdle"})`} />
                    {/* Specular dot — the last 10% of the three-dimensional read. */}
                    <circle cx={-head * 0.3} cy={-stick - head - head * 0.35} r={head * 0.22} fill="#FFFFFF" opacity={0.75} />
                  </g>
                </g>
              );
            })}

          </IndiaMap>

          {/* ── Zoom controls ─────────────────────────────────── */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={zoomIn}
              disabled={k >= 8}
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white hover:text-brand disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              disabled={k <= 1}
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white hover:text-brand disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={k <= 1}
              aria-label="Reset zoom"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white hover:text-brand disabled:opacity-40"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Discoverability */}
          <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] font-medium text-muted-foreground/70">
            {k > 1 ? `${k.toFixed(1)}× · drag to pan` : "Double-click or ctrl + scroll to zoom"}
          </p>
        </div>

        {/* Right Column: Open day detail card (reduced width) */}
        <div className="flex h-full min-w-0 flex-col lg:col-span-4">
          <div className="flex h-full min-h-[360px] flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div key={active} className="min-w-0 flex-1 animate-tileIn">
              {day ? (
                <>
                  <span className="text-[12px] font-bold uppercase tracking-wide text-brand">Day {day.day}</span>
                  <h3 className="mt-1.5 font-display text-[19px] font-bold text-ink">{day.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-foreground/80">{day.detail}</p>
                </>
              ) : (
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Pick a stop on the map to view day details.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-[13px] font-semibold text-muted-foreground">
                {active >= 0 ? `Day ${active + 1} of ${days.length}` : ""}
              </span>
              <div className="flex flex-none gap-2">
                <button
                  type="button"
                  onClick={() => select(Math.max(0, active - 1))}
                  disabled={active <= 0}
                  aria-label="Previous day"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition hover:bg-secondary/50 disabled:opacity-35"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => select(active < 0 ? 0 : Math.min(days.length - 1, active + 1))}
                  disabled={active === days.length - 1}
                  aria-label="Next day"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition hover:bg-secondary/50 disabled:opacity-35"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
