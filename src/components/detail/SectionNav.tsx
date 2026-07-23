import { useEffect, useState } from "react";
import {
  BookOpen,
  CircleAlert,
  FileText,
  MessageCircle,
  LayoutList,
} from "lucide-react";

export interface Section {
  id: string;
  label: string;
}

/** Site header height — what a section must clear when scrolled to. */
const NAV_OFFSET = 88;

const sectionIcons: Record<string, typeof BookOpen> = {
  overview: BookOpen,
  itinerary: LayoutList,
  inclusions: FileText,
  policy: CircleAlert,
  contact: MessageCircle,
};

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
 * Pill-style vertical section navigation for the detail page.
 * Active item: solid brand-blue fill + white text with left accent stripe.
 * Hover: light brand tint.
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
    <nav aria-label="Package sections">
      <ul className="space-y-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          const Icon = sectionIcons[s.id] ?? BookOpen;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onNavigate(s.id)}
                aria-current={isActive ? "location" : undefined}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-left text-[14px] font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-brand text-white shadow-md shadow-brand/25"
                    : "text-muted-foreground hover:bg-brand/10 hover:text-ink"
                }`}
              >
                {/* Left accent stripe */}
                <span
                  className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-200 ${
                    isActive ? "bg-white/50 opacity-100" : "opacity-0"
                  }`}
                />
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-brand/70 group-hover:text-brand"
                  }`}
                />
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
