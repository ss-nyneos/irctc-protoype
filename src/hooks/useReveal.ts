import { useEffect, useRef } from "react";

/** Gap between cards that arrive together. */
const STEP_MS = 55;
/** Mirrors --dur-pop in index.css; used only to know when a delay is spent. */
const POP_MS = 550;

/**
 * Returns a ref to attach to a section container. Any descendant with `.reveal`,
 * and any direct child of a `.stagger` container, animates in (`.in` class) once
 * it reaches the viewport.
 *
 * Cards are watched **individually** rather than watching the grid around them.
 * Watching the container meant that the instant its top edge appeared, every
 * card's delay started counting — so cards still well below the fold had already
 * finished popping by the time you scrolled to them. Per-card, each one arrives
 * as you actually reach it.
 *
 * The one-by-one cascade then comes from the batch: everything crossing in the
 * same frame lands in a single observer callback, so a row entering together is
 * sorted into reading order and dealt out `STEP_MS` apart, while a card that
 * scrolls in alone simply pops with no delay.
 *
 * A MutationObserver keeps this working for content that mounts *after* the
 * initial render — e.g. filtered result lists that swap their cards. Without
 * it, freshly-rendered nodes are never observed and stay stuck at `opacity: 0`
 * (invisible but still taking up layout space).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const arriving = entries.filter((e) => e.isIntersecting);
        if (!arriving.length) return;

        // Reading order, so the cascade runs left-to-right and top-to-bottom
        // rather than in whatever order the observer happened to report.
        arriving.sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top ||
            a.boundingClientRect.left - b.boundingClientRect.left,
        );

        // Only stagger cards against their siblings. A lone heading and a grid
        // that happen to appear together shouldn't queue behind each other.
        let staggerIndex = 0;
        arriving.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const isCard = el.parentElement?.classList.contains("stagger");
          const delay = isCard ? staggerIndex++ * STEP_MS : 0;

          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
            // Clear it once the entrance is done. Tailwind's transition
            // utilities don't set a delay of their own, so leaving this behind
            // would silently delay the card's hover transition for good.
            window.setTimeout(() => {
              el.style.transitionDelay = "";
            }, delay + POP_MS + 50);
          }

          el.classList.add("in");
          io.unobserve(el); // reveal once, then stop watching it
        });
      },
      { threshold: 0.12 },
    );

    // Observe every not-yet-revealed node. Safe to call repeatedly: already-
    // revealed nodes are excluded and re-observing is a no-op.
    const observeAll = () =>
      root
        .querySelectorAll(".reveal:not(.in), .stagger > *:not(.in)")
        .forEach((node) => io.observe(node));

    observeAll();

    // Re-scan when the subtree changes so newly-added cards get observed too.
    const mo = new MutationObserver(observeAll);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return ref;
}
