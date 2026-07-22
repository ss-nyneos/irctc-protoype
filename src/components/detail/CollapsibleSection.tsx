import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/**
 * One expandable block on the detail page. Each section opens and closes on its
 * own — opening one never closes another — so a reader can have any combination
 * of them open at once, or collapse them all. The left sidebar jumps to a
 * section and opens it; the header here toggles it.
 */
export function CollapsibleSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[88px] overflow-hidden rounded-2xl border bg-white shadow-sm">
      <h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-secondary/40"
        >
          <span className="font-display text-[18px] font-bold text-ink">{title}</span>
          <ChevronDown
            size={20}
            className={`flex-none text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h2>

      {open && <div className="animate-tileIn border-t px-5 py-5 md:px-6">{children}</div>}
    </section>
  );
}
