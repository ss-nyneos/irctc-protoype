import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  sub?: string;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
}

export function SectionHeading({ title, sub, action, children }: SectionHeadingProps) {
  const ref = useReveal();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16" ref={ref}>
      <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.4rem)] font-semibold leading-tight text-navy">
            {title}
          </h2>
          {sub && <p className="mt-1.5 text-[14px] text-muted-foreground">{sub}</p>}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[13px] font-bold text-navy transition hover:bg-navy hover:text-white"
          >
            {action.label} <ArrowRight size={15} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
