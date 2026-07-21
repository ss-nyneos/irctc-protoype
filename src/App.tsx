import { useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { RouterProvider, useRouter } from "@/router/RouterContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DishaChatbot } from "@/components/chatbot/DishaChatbot";
import { HomePage } from "@/pages/HomePage";
import { WorldPage } from "@/pages/WorldPage";
import { CustomisePage } from "@/pages/CustomisePage2";
import { MadeForYouPage } from "@/pages/MadeForYouPage";
import { DetailPage } from "@/pages/DetailPage";
import { BookingPage } from "@/pages/BookingPage";
import { CustomScrollbar } from "@/components/common/CustomScrollbar";
import { PreloadScreen } from "@/components/home/PreloadScreen";

// Design 1 imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { UIProvider } from "@/context/UI";
import { PrefsProvider } from "@/context/Prefs";
import NavBar from "@/components/NavBar";
import FooterD1 from "@/components/Footer";
import FooterStrip from "@/components/FooterStrip";
import ModalRoot from "@/components/ModalRoot";
import Home from "@/pages/Home";
import Packages from "@/pages/Packages";
import "@/styles/design1.css";

gsap.registerPlugin(ScrollTrigger);

/** Renders the correct page based on the in-app router state */
function CurrentPage() {
  const { view } = useRouter();

  switch (view.name) {
    case "world":
      return <WorldPage key={view.category ?? "all"} initialCategory={view.category} />;
    case "customise":
      return <CustomisePage />;
    case "madeforyou":
      return <MadeForYouPage />;
    case "detail":
      return <DetailPage id={view.id} />;
    case "booking":
      return (
        <BookingPage
          id={view.id}
          classCode={view.classCode}
          departure={view.departure}
          boarding={view.boarding}
          travellers={view.travellers}
        />
      );
    case "preload": // shouldn't be reached but safe-guard
    case "home":
    default:
      return <HomePage />;
  }
}

/** The main app shell — header, content, footer, chatbot, scrollbar */
function Shell() {
  const { view } = useRouter();
  const hideFooter = view.name === "customise";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CustomScrollbar />
      <Header />
      <main className="flex-1">
        <CurrentPage />
      </main>
      {!hideFooter && <Footer />}
      <DishaChatbot />
    </div>
  );
}

/**
 * "/" route — the preload overlay sits on top of a fully-mounted Shell.
 * As the overlay fades to opacity-0 the landing page is revealed below.
 * Then react-router-dom navigates to "/landing".
 */
function PreloadRoute() {
  return (
    <>
      {/* Landing page rendered behind the overlay so it's visible as overlay fades */}
      <Shell />
      {/* Preload overlay — fixed, z-[200], fades out then navigates away */}
      <PreloadScreen />
    </>
  );
}

// Layout for Design 1 (GSAP animations scoped to this layout)
function Design1Layout() {
  const root = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      /* ---- Hero: pinned behind the page, drifting and dimming as it goes ----
         Keep the drift within the zoom's overflow (|yPercent| <= (scale-1)/2*100)
         so the video always covers the hero and its black backdrop never peeks
         out at the top under the navbar. */
      gsap.to(".hero__img", {
        yPercent: 12,
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
      // hero furniture leaves faster than the footage behind it
      gsap.to(".hero__inner", {
        yPercent: -34,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom 30%",
          scrub: 0.3,
        },
      });

      /* ---- Generic multi-speed parallax: any [data-parallax] element ---- */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 16;
        const trigger = el.closest("section") ?? el;
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });

      /* ---- Section headings: scrub in, then drift ---- */
      gsap.utils.toArray<HTMLElement>(".h2").forEach((el) => {
        gsap.from(el, {
          y: 52,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
        gsap.to(el, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      /* ---- Marquee rails counter-drift as you scroll ---- */
      gsap.utils.toArray<HTMLElement>(".trend__marquee, .luxe__rail-area").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      // Cards / features batch reveal
      gsap.set(".reveal", { opacity: 0, y: 46 });
      ScrollTrigger.batch(".reveal", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.09,
            overwrite: true,
          }),
      });

      /* ---- Offers + Stats: cards introduce themselves one by one ---- */
      gsap.utils.toArray<HTMLElement>(".offers__grid, .stats__grid").forEach((grid) => {
        const cards = Array.from(grid.children) as HTMLElement[];
        if (!cards.length) return;
        gsap.set(cards, { opacity: 0, y: 64, scale: 0.9 });
        ScrollTrigger.create({
          trigger: grid,
          start: "top 84%",
          once: true,
          onEnter: () =>
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "back.out(1.5)",
              stagger: 0.16,
              // hand control back to CSS so the hover lift keeps working
              clearProps: "transform,opacity",
            }),
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <PrefsProvider>
      <UIProvider>
        <div ref={root} className="design-1-root min-h-screen">
          <NavBar />
          <Outlet />
          <FooterD1 />
          <FooterStrip />
          <ModalRoot />
        </div>
      </UIProvider>
    </PrefsProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouterProvider>
        <Routes>
          {/* Design 1 is the landing page.
              "/" mounts it with the train preload overlaid on top, so the page
              is already rendered underneath as the overlay fades; the overlay
              then navigates to "/home", which is the same page without it. */}
          <Route element={<Design1Layout />}>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <PreloadScreen to="/home" />
                </>
              }
            />
            <Route path="/home" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
          </Route>

          {/* Preload intro screen. It fades, then navigates to "/landing",
              so moving it off "/" keeps that hand-off intact. */}
          <Route path="/preload" element={<PreloadRoute />} />

          {/* Main app shell — world / customise / detail / booking views */}
          <Route path="/landing" element={<Shell />} />

          {/* Catch-all: redirect unknown paths to "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouterProvider>
    </BrowserRouter>
  );
}
