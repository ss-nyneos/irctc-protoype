import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { View } from "@/types";

interface RouterState {
  view: View;
  go: (view: View) => void;
  back: () => void;
}

const RouterContext = createContext<RouterState | null>(null);

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within <RouterProvider>");
  return ctx;
}

/**
 * Lightweight client-only "router". This app is intentionally a single page
 * with view-switching handled in state (no history/URL syncing), matching
 * the original prototype's navigation model.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>({ name: "home" });
  const stack = useRef<View[]>([]);

  const go = useCallback(
    (next: View) => {
      stack.current.push(view);
      setView(next);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [view],
  );

  const back = useCallback(() => {
    setView(stack.current.pop() ?? { name: "home" });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return <RouterContext.Provider value={{ view, go, back }}>{children}</RouterContext.Provider>;
}
