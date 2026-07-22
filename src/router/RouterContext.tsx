import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

function pathForView(view: View): string | null {
  switch (view.name) {
    case "world":
      return "/world";
    case "customise":
      return "/customise";
    case "madeforyou":
      return "/personal";
    // The shell's own home page lives at /landing; /home is the Design-1
    // landing, which belongs to react-router, not to this router.
    case "home":
      return "/landing";
    default:
      return null;
  }
}

function viewForPath(path: string): View {
  switch (path) {
    case "/world":
      return { name: "world" };
    case "/customise":
      return { name: "customise" };
    case "/personal":
      return { name: "madeforyou" };
    case "/home":
    case "/landing":
    case "/":
    default:
      return { name: "home" };
  }
}


const shellPaths = new Set(["/world", "/personal", "/customise", "/landing", "/preload"]);

/**
 * Lightweight client-only "router". This app is intentionally a single page
 * with view-switching handled in state (no full history/URL syncing), matching
 * the original prototype's navigation model — except for routes explicitly
 * mapped in pathForView/viewForPath above, which get a real URL.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(() => viewForPath(window.location.pathname));
  const stack = useRef<View[]>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onPopState = () => {
      // Leaving the shell entirely: let react-router unmount it as-is.
      if (!shellPaths.has(window.location.pathname)) return;
      setView(viewForPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  
  const firstLocation = useRef(true);
  useEffect(() => {
    if (firstLocation.current) {
      firstLocation.current = false;
      return;
    }
    if (!shellPaths.has(pathname)) return;
    setView(viewForPath(pathname));
  }, [pathname]);

  const go = useCallback(
    (next: View) => {
      stack.current.push(view);
      setView(next);
      const path = pathForView(next);
      if (path && window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [view],
  );

  const back = useCallback(() => {
    // Nothing left to go back to inside the shell: hand off to the Design-1
    // landing through react-router, so the layout swaps in one commit. Setting
    // the view to "home" here instead would paint the shell's own home page for
    // a frame first, which reads as a flash of the wrong page.
    if (stack.current.length === 0) {
      navigate("/home");
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const prev = stack.current.pop() ?? { name: "home" };
    setView(prev);
    const path = pathForView(prev);
    if (path && window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [navigate]);

  return <RouterContext.Provider value={{ view, go, back }}>{children}</RouterContext.Provider>;
}
