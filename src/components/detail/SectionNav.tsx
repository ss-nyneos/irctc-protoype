import { useEffect, useState } from "react";

export interface Section {
  id: string;
  label: string;
}

/** Header (60px bar + 3px accent bar) plus this nav — what a section must clear
 *  when scrolled to. Sections carry a matching `scroll-mt-[132px]`. */
const NAV_OFFSET = 132;

/**
 * Tracks which section the reader is in. Position-based rather than an
 * IntersectionObserver: with a sticky header the question is "which heading did
 * I last scroll past", which reads more truly off the scroll position than off
 * intersection ratios — a long section and a short one otherwise behave
 * differently. Throttled to one read per frame.
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
 * In-page section nav. Stands in for the tab strip on irctctourism.com: tabs
 * hid inclusions from terms exactly when a traveller wants to weigh them
 * against each other, and cost a page load each. Everything is on one scroll
 * now; this just says where you are and jumps you around.
 */
export function SectionNav({ sections }: { sections: Section[] }) {
  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <div className="sticky top-[63px] z-30 border-b bg-white/90 backdrop-blur-md">
      <nav aria-label="Package sections" className="mx-auto max-w-7xl px-4 md:px-6">
        <ul className="no-scrollbar flex gap-1 overflow-x-auto">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="flex-none">
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex h-12 items-center border-b-2 px-3.5 text-[14px] font-semibold transition-colors ${
                    isActive
                      ? "border-brand text-brand"
                      : "border-transparent text-muted-foreground hover:text-ink"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
