import { useEffect, useState } from "react";

export interface Section {
  id: string;
  label: string;
}

/** Site header height — what a section must clear when scrolled to. */
const NAV_OFFSET = 88;

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
 * Line-and-number section navigation.
 * Active item: brand blue line, brand blue index, brand blue semibold title.
 * Inactive items: gray line, gray index, gray semibold title (highlighting on hover).
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
    <nav aria-label="Package sections" className="py-2">
      <ul className="space-y-4">
        {sections.map((s, idx) => {
          const isActive = active === s.id;
          const num = String(idx + 1).padStart(2, "0");

          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onNavigate(s.id)}
                aria-current={isActive ? "location" : undefined}
                className="group flex w-full items-center gap-3.5 py-1 text-left transition-all duration-200"
              >
                {/* Horizontal line indicator */}
                <span
                  className={`h-[2px] rounded-full transition-all duration-300 ease-out ${isActive
                    ? "w-10 bg-brand"
                    : "w-6 bg-gray-400 group-hover:w-10 group-hover:bg-brand dark:bg-gray-600"
                    }`}
                />

                {/* 2-digit index */}
                <span
                  className={` text-[14px] font-semibold tabular-nums transition-colors duration-200 ${isActive
                    ? "text-brand"
                    : "text-gray-400 group-hover:text-brand dark:text-gray-500"
                    }`}
                >
                  {num}
                </span>

                {/* Section title */}
                <span
                  className={`text-[16px] font-semibold transition-colors duration-200 ${isActive
                    ? "text-brand"
                    : "text-gray-400 group-hover:text-brand dark:text-gray-500"
                    }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
