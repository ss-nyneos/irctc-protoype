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
    <section id={id} className="scroll-mt-[88px] overflow-hidden border-y bg-white">
      <h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex bg-brand/90 text-white w-full items-center justify-between gap-3 px-5 py-4 text-left transition"
        >
          <span className="text-[22px] font-medium">{title}</span>
          <ChevronDown
            size={20}
            className={`flex-none  transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h2>

      {open && <div className="animate-tileIn border-t border-x border-x-gray-300  px-5 py-5 md:px-6">{children}</div>}
    </section>
  );
}
