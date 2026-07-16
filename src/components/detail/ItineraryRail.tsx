import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pause, Play, TrainFront } from "lucide-react";
import type { ItineraryDay } from "@/types";

/** How long the train rests at each stop in play mode. Long enough to read the
 *  day's detail, short enough that a 10-day tour doesn't outstay its welcome. */
const STOP_MS = 2600;

/** Node diameter — the train chip matches it so it parks exactly over a stop. */
const NODE = 40;

/**
 * The itinerary as a railway line: each day is a station on a vertical track,
 * and a train glides between them as you move through the trip. Play sends it
 * down the whole line on its own, which is the fastest way to *see* the shape
 * of a journey without reading ten accordion rows.
 *
 * Exactly one day is open at a time — the train is always somewhere, so there
 * is no "all collapsed" state to design for.
 */
export function ItineraryRail({
  days,
  active,
  onActive,
}: {
  days: ItineraryDay[];
  active: number;
  onActive: (index: number) => void;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [trainY, setTrainY] = useState(0);
  const [trackH, setTrackH] = useState(0);
  const [playing, setPlaying] = useState(false);

  /**
   * Park the train on the active stop. Measured rather than computed: rows are
   * different heights once a day opens, and the open row pushes everything
   * below it. A ResizeObserver catches exactly that reflow.
   */
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const node = nodeRefs.current[active];
      if (!list || !node) return;
      const listBox = list.getBoundingClientRect();
      setTrainY(node.getBoundingClientRect().top - listBox.top);
      setTrackH(listBox.height);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  // Play mode. Any manual pick cancels it — motion must never trap the reader.
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (active >= days.length - 1) setPlaying(false);
      else onActive(active + 1);
    }, STOP_MS);
    return () => clearTimeout(timer);
  }, [playing, active, days.length, onActive]);

  const select = useCallback(
    (index: number) => {
      setPlaying(false);
      onActive(index);
    },
    [onActive],
  );

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    // Replaying from the end would sit there doing nothing, so rewind first.
    if (active >= days.length - 1) onActive(0);
    setPlaying(true);
  };

  const fill = trackH ? (trainY + NODE / 2) / trackH : 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-ink">Day-by-day itinerary</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {days.length} days, {days.length} stops. Ride the line or pick a day.
          </p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={playing}
          className={`inline-flex min-h-[44px] flex-none items-center gap-2 rounded-full px-4 text-[13px] font-bold transition ${
            playing ? "bg-navy text-white" : "bg-brand text-white hover:brightness-95"
          }`}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pause journey" : "Play journey"}
        </button>
      </div>

      <ol ref={listRef} className="relative">
        {/* The line itself, and the stretch already travelled. */}
        <span
          aria-hidden="true"
          className="absolute left-[19px] top-0 w-0.5 rounded bg-border"
          style={{ height: trackH }}
        />
        <span
          aria-hidden="true"
          className="train-glide absolute left-[19px] top-0 w-0.5 origin-top rounded bg-brand"
          style={{ height: trackH, transform: `scaleY(${fill})` }}
        />

        {/* The train. Rides above the stops and parks over the active one. */}
        <span
          aria-hidden="true"
          className="train-glide pointer-events-none absolute left-0 top-0 z-10"
          style={{ transform: `translateY(${trainY}px)` }}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 ring-4 ring-white ${
              playing ? "animate-pulse-ring" : ""
            }`}
          >
            <TrainFront size={19} />
          </span>
        </span>

        {days.map((day, i) => {
          const isActive = i === active;
          const isVisited = i < active;
          return (
            <li key={day.day}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-expanded={isActive}
                aria-label={`Day ${day.day}, ${day.title}`}
                className="group flex w-full items-start gap-4 rounded-2xl py-2 pr-2 text-left transition-colors hover:bg-secondary/40"
              >
                <span
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-[14px] font-bold tabular-nums transition-colors ${
                    isActive || isVisited
                      ? "bg-brand text-white"
                      : "bg-white text-muted-foreground ring-2 ring-border group-hover:ring-brand/40"
                  }`}
                >
                  {day.day}
                </span>

                <span className="min-w-0 flex-1 pt-1.5">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${
                        isActive ? "text-brand" : "text-muted-foreground"
                      }`}
                    >
                      Day {day.day}
                    </span>
                    <span
                      className={`font-display text-[16px] font-bold transition-colors ${
                        isActive ? "text-ink" : "text-foreground/70 group-hover:text-ink"
                      }`}
                    >
                      {day.title}
                    </span>
                  </span>

                  {isActive && (
                    <span className="mt-1.5 block animate-tileIn pb-4 pr-2 text-[14px] leading-relaxed text-foreground/75">
                      {day.detail}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
