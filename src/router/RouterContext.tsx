import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
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

/**
 * Every view has a URL. This is what makes the browser's own Back button
 * correct: one view = one history entry, so going back is always exactly one
 * screen. Detail and booking used to be state-only, which meant walking
 * world → detail → booking added no history at all and Back jumped out of the
 * flow entirely.
 */
function pathForView(view: View): string {
  switch (view.name) {
    case "world":
      return view.category ? `/world?category=${encodeURIComponent(view.category)}` : "/world";
    case "customise":
      return "/customise";
    case "madeforyou":
      return "/personal";
    case "detail":
      return `/package/${encodeURIComponent(view.id)}`;
    case "booking": {
      const q = new URLSearchParams();
      if (view.classCode) q.set("class", view.classCode);
      if (view.departure) q.set("departure", view.departure);
      if (view.boarding) q.set("boarding", view.boarding);
      if (view.travellers != null) q.set("pax", String(view.travellers));
      const search = q.toString();
      return `/package/${encodeURIComponent(view.id)}/book${search ? `?${search}` : ""}`;
    }
    case "preload":
      return "/preload";
    // The shell's own home page lives at /landing; /home is the Design-1
    // landing, which belongs to react-router, not to this router.
    case "home":
    default:
      return "/landing";
  }
}

/** The inverse of pathForView — a reload or a Back lands here. */
function viewForLocation(pathname: string, search: string): View {
  const params = new URLSearchParams(search);

  const booking = pathname.match(/^\/package\/([^/]+)\/book\/?$/);
  if (booking) {
    const pax = params.get("pax");
    return {
      name: "booking",
      id: decodeURIComponent(booking[1]),
      classCode: params.get("class") ?? undefined,
      departure: params.get("departure") ?? undefined,
      boarding: params.get("boarding") ?? undefined,
      travellers: pax ? Number(pax) : undefined,
    };
  }

  const detail = pathname.match(/^\/package\/([^/]+)\/?$/);
  if (detail) return { name: "detail", id: decodeURIComponent(detail[1]) };

  switch (pathname) {
    case "/world":
      return { name: "world", category: params.get("category") ?? undefined };
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

/**
 * View state derived from the URL, so there is exactly one source of truth.
 * The previous implementation mirrored the URL into React state and kept its
 * own `stack` of visited views; the two drifted apart the moment a view had no
 * path of its own, and `back()` pushed a *new* entry instead of unwinding, so
 * the browser's Back went somewhere else entirely.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const view = useMemo(
    () => viewForLocation(location.pathname, location.search),
    [location.pathname, location.search],
  );

  // A new screen starts at the top; Back restores the browser's own position.
  useEffect(() => {
    if (location.key === "default") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.key]);

  const go = useCallback(
    (next: View) => {
      const path = pathForView(next);
      if (path !== location.pathname + location.search) navigate(path);
    },
    [navigate, location.pathname, location.search],
  );

  const back = useCallback(() => {
    // react-router stamps an index onto each history entry it creates. At 0
    // there is nothing of ours behind us — the user deep-linked or arrived from
    // another site — so going back would leave the app. Land on the Design-1
    // home instead of stepping off.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/home", { replace: true });
  }, [navigate]);

  return <RouterContext.Provider value={{ view, go, back }}>{children}</RouterContext.Provider>;
}
