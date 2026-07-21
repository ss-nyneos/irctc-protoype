import { useLayoutEffect, useRef, useState } from "react";
import { TrainFront } from "lucide-react";
import type { ItineraryDay } from "@/types";

/** Node diameter — the train chip matches it so it parks exactly over a stop. */
const NODE = 40;

/**
 * The itinerary as a railway line: each day is a station on a vertical track,
 * and a train glides between them as you move through the trip.
 *
 * This is the fallback for trips the India map can't place — an overseas
 * package has nothing to pin. Exactly one day is open at a time, so there is no
 * "all collapsed" state to design for.
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

  const select = onActive;

  const fill = trackH ? (trainY + NODE / 2) / trackH : 0;

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-[22px] font-bold text-ink">Day-by-day itinerary</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {days.length} days, {days.length} stops. Pick a day to open it.
        </p>
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
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 ring-4 ring-white">
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
