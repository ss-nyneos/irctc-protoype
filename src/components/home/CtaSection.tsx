import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import heroBanner from "@/assets/cta/hero-banner.png";

export function CtaSection() {
  const ref = useReveal();
  const { go } = useRouter();

  return (
    <section className="px-4 pb-28 pt-28 md:px-6 md:pb-36 md:pt-36" ref={ref}>
      <div
        className="reveal reveal-scale relative mx-auto flex min-h-[380px] max-w-7xl items-center justify-center overflow-hidden rounded-3xl bg-navy bg-cover bg-center px-6 py-16 text-center text-white md:min-h-[520px] md:px-14 md:py-24"
        style={{ backgroundImage: `url("${heroBanner}")` }}
      >
        {/* scrim keeps the copy legible over the bright coach livery behind it */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative max-w-2xl">
          <h2 className="heading-xl text-white">
            Ready To Explore the Wonders
            <br />
            of <span className="text-saffron">Travel Today?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/90">
            breathtaking views, beautiful landscapes, and unforgettable moments in one of the world’s most iconic
            destinations.
          </p>
          <button
            onClick={() => go({ name: "customise" })}
            type="button"
            className="mt-8 inline-flex items-center gap-4 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-bold text-ink shadow-lg transition hover:bg-white/90"
          >
            Reserve Your Tour Now
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron text-white">
              <ArrowUpRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
