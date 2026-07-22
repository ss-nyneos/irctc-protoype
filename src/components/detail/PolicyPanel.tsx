import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
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
 * Terms as an accordion instead of a tab. Each section brings its own shape —
 * a bullet list, a refund ladder or a set of conduct topics — and the panel
 * picks the renderer to match.
 */
export function PolicyPanel({ sections, total, travellers, departure }: PolicyPanelProps) {
  // Booking & payment leads — it's the first thing a traveller needs.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {/* No rule on top: the section header above already draws one. */}
      <div>
        {sections.map((section, i) => {
          const isOpen = open === i;
          return (
            <div key={section.title} className="border-b last:border-b-0">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-[56px] w-full items-center gap-3 rounded-xl px-2 text-left transition hover:bg-secondary/40"
                >
                  <FileText
                    size={15}
                    className={`flex-none transition-colors ${isOpen ? "text-brand" : "text-muted-foreground"}`}
                  />
                  <span className={`flex-1 font-semibold transition-colors ${isOpen ? "text-ink" : "text-foreground/75"}`}>
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
                    <ul className="space-y-2">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/75"
                        >
                          <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-brand/50" />
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
