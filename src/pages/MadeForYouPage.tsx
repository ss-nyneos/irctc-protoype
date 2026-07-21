import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { getSuggestions } from "@/data/mockProfile";
import { DragGallery } from "@/components/common/DragGallery";
import { TravelPhotoDiary } from "@/components/common/TravelPhotoDiary";
import { EditorialPackageCard } from "@/components/package/EditorialPackageCard";

export function MadeForYouPage() {
  const { back } = useRouter();
  const ref = useReveal();
  const recommended = useMemo(() => getSuggestions(3), []);

  return (
    <div ref={ref} className="min-h-screen pb-20">
      <div className="relative overflow-hidden bg-white">
        <DragGallery className="h-[72vh] w-full min-h-[480px] pt-4" label="Drag to explore" />
        <div className="relative mx-auto max-w-7xl px-3 pb-4 pt-6 sm:px-4 md:px-5 lg:px-6">
          <button
            onClick={back}
            type="button"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-ink"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-5 lg:px-6">
        <div className="mt-4">
          <TravelPhotoDiary />
        </div>

        <h2 className="reveal mt-16 font-display text-[42px] font-bold leading-none text-ink">
          Picked for your travel style
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((pkg) => (
            <div key={pkg.id} className="reveal relative">
              <EditorialPackageCard pkg={pkg} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
