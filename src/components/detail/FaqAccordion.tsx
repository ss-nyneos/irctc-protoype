import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { Faq } from "@/data/packageFaqs";

/**
 * Answers before phone numbers. Most people who open "Contact us" want a fact,
 * not a call, and the questions here are answered from this package's own fares
 * and boarding chain — see `buildFaqs`.
 *
 * The panels stay mounted and animate on `grid-template-rows`, so they collapse
 * as smoothly as they open; unmounting on close gives you an animation in one
 * direction and a jump in the other.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-3xl border bg-white">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.question} className="border-b last:border-b-0">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-300 md:px-5 ${
                  isOpen ? "bg-secondary/40" : "hover:bg-secondary/25"
                }`}
              >
                <HelpCircle
                  size={17}
                  className={`flex-none transition-colors duration-300 ${isOpen ? "text-brand" : "text-muted-foreground"}`}
                />
                <span
                  className={`flex-1 text-[14.5px] font-semibold leading-snug transition-colors duration-300 ${
                    isOpen ? "text-ink" : "text-foreground/80"
                  }`}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-none text-muted-foreground transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                {/* Opacity trails the height so the text is not legible while the
                    row is still a sliver. */}
                <p
                  className={`px-4 pb-4 pl-[46px] text-[13.5px] leading-relaxed text-foreground/75 transition-opacity duration-300 md:px-5 md:pl-[52px] ${
                    isOpen ? "opacity-100 delay-100" : "opacity-0"
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
