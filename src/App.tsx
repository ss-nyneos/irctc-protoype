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
    case "home":
    default:
      return <HomePage />;
  }
}

function Shell() {
  const { view } = useRouter();
  const hideFooter = view.name === "customise";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CurrentPage />
      </main>
      {!hideFooter && <Footer />}
      <DishaChatbot />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
