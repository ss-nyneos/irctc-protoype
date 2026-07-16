import { useEffect, useRef } from "react";

/**
 * Drifts an element against the scroll to give a photo some depth.
 *
 * Returns a ref to put on the moving layer — usually an <img> that overflows
 * its clipping parent, never the parent itself. The parent needs
 * `overflow-hidden`, and the image wants some slack to move within (e.g.
 * `h-[125%] -top-[12%]`), otherwise the drift will drag its edge into frame.
 *
 * `strength` is how far the layer moves per pixel scrolled. Keep it low —
 * 0.08–0.2. Past that it stops reading as depth and starts reading as a bug,
 * and it's the kind of motion that makes people queasy.
 *
 * Writes transform directly on rAF: no state, so no re-render per frame, and
 * transform alone means the compositor handles it without touching layout.
 * Disabled outright under prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLImageElement>(strength = 0.12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Skip work while off-screen — a page of these shouldn't cost anything
      // you aren't looking at.
      if (rect.bottom < 0 || rect.top > vh) return;
      // 0 when the element is centred, ±1 at the edges of the viewport, so the
      // drift is symmetrical about the middle of the screen.
      const fromCentre = (rect.top + rect.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(fromCentre * strength * 100).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}
