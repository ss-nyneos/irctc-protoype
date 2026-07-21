import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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

/** Maps view names to real browser URLs. Only "customise" is wired up today;
 *  everything else still lives at "/" with no URL syncing. */
function pathForView(view: View): string {
  return view.name === "customise" ? "/customise" : "/";
}

function viewForPath(path: string): View {
  return path === "/customise" ? { name: "customise" } : { name: "home" };
}

/**
 * Lightweight client-only "router". This app is intentionally a single page
 * with view-switching handled in state (no full history/URL syncing), matching
 * the original prototype's navigation model — except for routes explicitly
 * mapped in pathForView/viewForPath above, which get a real URL.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(() => viewForPath(window.location.pathname));
  const stack = useRef<View[]>([]);

  useEffect(() => {
    const onPopState = () => {
      setView(viewForPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const go = useCallback(
    (next: View) => {
      stack.current.push(view);
      setView(next);
      const path = pathForView(next);
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [view],
  );

  const back = useCallback(() => {
    const prev = stack.current.pop() ?? { name: "home" };
    setView(prev);
    const path = pathForView(prev);
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return <RouterContext.Provider value={{ view, go, back }}>{children}</RouterContext.Provider>;
}
