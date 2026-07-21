import { useState } from "react";
import { Check } from "lucide-react";
import type { PolicyTopic } from "@/types";

export function ConductTopics({ topics }: { topics: PolicyTopic[] }) {
  const [active, setActive] = useState(0);
  const topic = topics[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {topics.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.title}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={`min-h-[36px] rounded-full px-3.5 text-[12.5px] font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-navy text-white shadow-sm"
                  : "bg-secondary/60 text-foreground/70 hover:bg-secondary hover:text-ink"
              }`}
            >
              {t.title}
              <span className={`ml-1.5 tabular-nums ${isActive ? "text-white/60" : "text-muted-foreground"}`}>
                {t.points.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Keyed so the entry animation replays on every switch. */}
      <ul key={topic.title} className="mt-4 space-y-2.5">
        {topic.points.map((point, i) => (
          <li
            key={point}
            className="flex animate-tileIn items-start gap-2.5 text-[13.5px] leading-relaxed text-foreground/80"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand/10 text-brand">
              <Check size={11} strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
