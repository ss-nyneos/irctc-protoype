import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { CustomScene, PersonalScene, WorldScene } from "@/components/common/ModeScenes";
import type { View } from "@/types";

type Scene = typeof WorldScene;

interface ModeCardProps {
  scene: Scene;
  tint: string;
  title: string;
  tagline: string;
  cta: string;
  points: string[];
  view: View;
  featured?: boolean;
}

const modes: ModeCardProps[] = [
  {
    scene: WorldScene,
    tint: "from-[#e9f2ff] to-[#f5f9ff]",
    title: "Everything IRCTC",
    tagline: "Everything IRCTC, drilled down",
    cta: "Explore & compare",
    points: ["Drill down by region, budget & style", "Side-by-side comparison", "Verified reviews & pricing"],
    view: { name: "world" },
  },
  {
    scene: CustomScene,
    tint: "from-[#e3edff] to-[#eef5ff]",
    title: "Customized",
    tagline: "Built around your trip",
    cta: "Plan my trip",
    points: ["Start, end & travel dates", "AI-matched recommendations", "Book flights & hotels via IRCTC"],
    view: { name: "customise" },
    featured: true,
  },
  {
    scene: PersonalScene,
    tint: "from-[#edf3ff] to-[#f7faff]",
    title: "Personalized",
    tagline: "Your personal travel profile",
    cta: "See my picks",
    points: ["Greeting & travel profile", "Past tours & photo diary", "Suggestions from your history"],
    view: { name: "madeforyou" },
  },
];

export function ModesSection() {
  const ref = useReveal();
  const { go } = useRouter();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-36" ref={ref}>
      <div className="reveal reveal-rise mx-auto max-w-2xl text-center">
        <h2 className="heading-xl text-ink">IRCTC World</h2>
      </div>

      <div className="stagger mt-12 grid gap-5 md:grid-cols-3">
        {modes.map((mode) => {
          const Scene = mode.scene;
          return (
            <div
              key={mode.title}
              className={`group relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm ring-1 ring-brand/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                mode.featured ? "shadow-xl md:-mt-4 md:mb-4" : ""
              }`}
            >
              <div
                className={`relative mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ring-1 ring-inset ring-brand/10 ${mode.tint}`}
              >
                <span className="pointer-events-none absolute -left-7 -top-7 h-24 w-24 rounded-full bg-brand/5" />
                <span className="pointer-events-none absolute -bottom-9 -right-5 h-28 w-28 rounded-full bg-azure/10" />
                <Scene className="relative h-[132px] w-auto transition-transform duration-300 motion-safe:group-hover:scale-105" />
              </div>
              <div className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">{mode.tagline}</div>
              <h3 className="font-display text-[24px] font-semibold text-ink">{mode.title}</h3>
              <ul className="mt-2 space-y-2">
                {mode.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[13px] text-foreground/85">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                    {point}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => go(mode.view)}
                type="button"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[14px] font-bold text-white transition hover:brightness-95"
              >
                {mode.cta} <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
