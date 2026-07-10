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

function CurrentPage() {
  const { view } = useRouter();

  switch (view.name) {
    case "world":
      return <WorldPage />;
    case "customise":
      return <CustomisePage />;
    case "madeforyou":
      return <MadeForYouPage />;
    case "detail":
      return <DetailPage id={view.id} />;
    case "booking":
      return <BookingPage id={view.id} />;
    case "home":
    default:
      return <HomePage />;
  }
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CurrentPage />
      </main>
      <Footer />
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
