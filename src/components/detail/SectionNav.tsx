import { useEffect, useState } from "react";

export interface Section {
  id: string;
  label: string;
}

/** Site header height — what a section must clear when scrolled to. Sections
 *  carry a matching `scroll-mt-[88px]`. */
const NAV_OFFSET = 88;

/**
 * Tracks which section the reader is in. Position-based rather than an
 * IntersectionObserver: with a sticky header the question is "which heading did
 * I last scroll past", which reads more truly off the scroll position than off
 * intersection ratios. Throttled to one read per frame.
 */
function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET + 8) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}

/**
 * Always-visible section rail down the left of the detail page. Each item jumps
 * to its section and opens it (`onNavigate`), and the item for whichever section
 * you're scrolled into is highlighted.
 */
export function SectionNav({
  sections,
  onNavigate,
}: {
  sections: Section[];
  onNavigate: (id: string) => void;
}) {
  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <nav aria-label="Package sections" className="rounded-3xl border bg-white p-3 shadow-sm">
      <ul className="space-y-1.5">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onNavigate(s.id)}
                aria-current={isActive ? "location" : undefined}
                className={`flex min-h-[54px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[16px] font-bold transition ${
                  isActive
                    ? "bg-brand/[0.08] text-brand"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
