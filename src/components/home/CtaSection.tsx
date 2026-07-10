import { ChevronRight, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { AccentBar } from "@/components/common/AccentBar";
import vandeBharat from "@/assets/cta/vande-bharat.png";

export function CtaSection() {
  const ref = useReveal();
  const { go } = useRouter();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6 md:pb-28 md:pt-8" ref={ref}>
      <div
        className="reveal relative overflow-hidden rounded-3xl bg-navy bg-cover bg-center p-8 text-white md:p-14"
        style={{ backgroundImage: `url(${vandeBharat})` }}
      >
        <AccentBar className="absolute left-0 top-0 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        <div className="relative max-w-xl">
          <h2 className="heading-xl text-white">Not sure where to begin?</h2>
          <p className="mt-3 text-[15px] text-white/80">
            Let our AI trip planner suggest the perfect holiday from your budget, dates and travel style — then
            fine-tune and book in minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => go({ name: "customise" })}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95"
            >
              <Sparkles size={17} /> Plan with AI
            </button>
            <button
              onClick={() => go({ name: "madeforyou" })}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-[15px] font-bold backdrop-blur transition hover:bg-white/20"
            >
              Build my own tour <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
