import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a section container. Any descendant with the
 * `.reveal` class fades/slides into view (`.in` class) once it intersects
 * the viewport.
 *
 * A MutationObserver keeps this working for content that mounts *after* the
 * initial render — e.g. filtered result lists that swap their cards. Without
 * it, freshly-rendered `.reveal` nodes are never observed and stay stuck at
 * `opacity: 0` (invisible but still taking up layout space).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target); // reveal once, then stop watching it
          }
        });
      },
      { threshold: 0.12 },
    );

    // Observe every not-yet-revealed node. Safe to call repeatedly: already-
    // revealed nodes are excluded and re-observing is a no-op.
    const observeAll = () => root.querySelectorAll(".reveal:not(.in)").forEach((node) => io.observe(node));

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
