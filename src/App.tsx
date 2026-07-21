import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RouterProvider, useRouter } from "@/router/RouterContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DishaChatbot } from "@/components/chatbot/DishaChatbot";
import { HomePage } from "@/pages/HomePage";
import { WorldPage } from "@/pages/WorldPage";
import { CustomisePage } from "@/pages/CustomisePage";
import { MadeForYouPage } from "@/pages/MadeForYouPage";
import { DetailPage } from "@/pages/DetailPage";
import { BookingPage } from "@/pages/BookingPage";
import { CustomScrollbar } from "@/components/common/CustomScrollbar";
import { PreloadScreen } from "@/components/home/PreloadScreen";

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

export default function App() {
  return (
    <BrowserRouter>
      <RouterProvider>
        <Routes>
          {/* Preload intro screen — "/" */}
          <Route path="/" element={<PreloadRoute />} />

          {/* Main landing page — "/landing" */}
          <Route path="/landing" element={<Shell />} />

          {/* Catch-all: redirect unknown paths to "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouterProvider>
    </BrowserRouter>
  );
}
