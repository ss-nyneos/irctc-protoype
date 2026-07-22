import { useEffect, type RefObject } from "react";

/**
 * Publishes a bottom-docked element's height as `--dock-offset` on the root, so
 * floating UI elsewhere in the tree (the Disha FAB) can lift clear of it without
 * either side importing the other or hard-coding a height.
 */
export function useDockOffset(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const clear = () => root.style.removeProperty("--dock-offset");

    if (!active) {
      clear();
      return;
    }
    const el = ref.current;
    if (!el) return;

    const publish = () => root.style.setProperty("--dock-offset", `${el.offsetHeight}px`);
    publish();
    // The tray changes height when it expands on mobile, so measure, don't guess.
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [ref, active]);
}
