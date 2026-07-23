import { useState } from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import type { PolicySection } from "@/types";
import { CancellationLadder } from "@/components/detail/CancellationLadder";
import { ConductTopics } from "@/components/detail/ConductTopics";

interface PolicyPanelProps {
  sections: PolicySection[];
  code: string;
  /** Booking value the cancellation ladder prices its rungs against. */
  total: number;
  travellers: number;
  departure: string;
}

/**
 * Terms as an accordion instead of a tab. Allows expanding individual sections
 * or all sections at once via the Expand All button.
 */
export function PolicyPanel({ sections, total, travellers, departure }: PolicyPanelProps) {
  // Set of open section indices — allows multiple sections or all to expand simultaneously
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  const allOpen = openSet.size === sections.length;

  const toggleOne = (index: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenSet(new Set());
    } else {
      setOpenSet(new Set(sections.map((_, i) => i)));
    }
  };

  return (
    <div>
      {/* Top right Expand all / Collapse all action button */}
      <div className="mb-3 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5 text-[13px] font-bold text-brand transition hover:bg-brand/10"
        >
          <ChevronsUpDown size={15} />
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div>
        {sections.map((section, i) => {
          const isOpen = openSet.has(i);
          return (
            <div key={section.title} className="border-b border-gray-200/80 last:border-b-0">
              <h3>
                <button
                  type="button"
                  onClick={() => toggleOne(i)}
                  aria-expanded={isOpen}
                  className="flex min-h-[56px] w-full items-center gap-3 rounded-xl px-2 text-left transition hover:bg-secondary/40"
                >
                  <span className={`flex-1 font-semibold transition-colors ${isOpen ? "text-brand" : "text-ink"}`}>
                    {section.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-none text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </h3>

              {isOpen && (
                <div className="animate-tileIn px-2 pb-5 pl-[34px]">
                  {section.bands && (
                    <CancellationLadder
                      bands={section.bands}
                      total={total}
                      travellers={travellers}
                      departure={departure}
                    />
                  )}

                  {section.topics && <ConductTopics topics={section.topics} />}

                  {section.points && (
                    <ul className="space-y-2.5">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-[14px] leading-relaxed text-foreground/80"
                        >
                          <span className="mt-[8px] h-1.5 w-1.5 flex-none rounded-full bg-brand/70" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
