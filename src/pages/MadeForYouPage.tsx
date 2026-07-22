import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { getSuggestions } from "@/data/mockProfile";
import { getPackageById } from "@/data/packages";
import { DragGallery } from "@/components/common/DragGallery";
import { TravelPhotoDiary } from "@/components/common/TravelPhotoDiary";
import { EditorialPackageCard } from "@/components/package/EditorialPackageCard";
import { CompareModal } from "@/components/package/CompareModal";
import { CompareTray, COMPARE_MAX } from "@/components/package/CompareTray";

export function MadeForYouPage() {
  const ref = useReveal();
  const navigate = useNavigate();
  const { go } = useRouter();
  const recommended = useMemo(() => getSuggestions(3), []);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const viewOtherTours = () => {
    go({ name: "world" });
    navigate("/world");
  };

  const toggleCompare = (id: string) =>
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < COMPARE_MAX ? [...prev, id] : prev,
    );

  const compareItems = compareIds.map((id) => getPackageById(id)!).filter(Boolean);

  return (
    <div
      ref={ref}
      className="min-h-screen bg-[#FFFFFF] pb-20 text-[#323232]"
      style={{ paddingBottom: "calc(6rem + var(--dock-offset, 0px))" }}
    >
      {/* Gallery pins in place; content below scrolls up and covers it. */}
      <div className="sticky top-0 z-0 h-[72vh] min-h-[480px] w-full bg-[#FFFFFF]">
        <DragGallery className="h-full w-full pt-4" label="Drag to explore" />
      </div>

      <div className="relative z-10 bg-[#FFFFFF] shadow-[0_-28px_56px_-28px_rgba(10,15,30,0.28)]">
        <div className="mx-auto max-w-7xl px-3 pt-10 sm:px-4 md:px-5 md:pt-14 lg:px-6">
          <TravelPhotoDiary />
        </div>

        <div className="mx-auto max-w-[1600px] px-2 pt-16 sm:px-3 md:px-4">
          <h2 className="heading-xl reveal mt-16">
            YOU MIGHT ALSO <span className="accent">LIKE</span>
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((pkg) => (
              <div key={pkg.id} className="reveal relative">
                <EditorialPackageCard
                  pkg={pkg}
                  compact
                  comparing={compareIds.includes(pkg.id)}
                  onCompare={() => toggleCompare(pkg.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <section className="relative mt-14 overflow-hidden border-y border-[#323232]/10 bg-[#FFFFFF] py-[clamp(2rem,4.5vw,3.2rem)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0
                       bg-[radial-gradient(58%_120%_at_50%_50%,rgba(36,117,238,0.06)_0%,transparent_68%),radial-gradient(85%_140%_at_50%_50%,rgba(50,50,50,0.028)_0%,transparent_78%)]"
          />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-[clamp(1rem,2.4vw,1.8rem)] px-4 text-center min-[681px]:flex-row min-[681px]:gap-[clamp(1.4rem,3vw,2.6rem)]">
            <p className="heading-xl">
              Didn&apos;t like our <span className="accent">suggestions?</span>
            </p>
            <button
              type="button"
              onClick={viewOtherTours}
              className="inline-flex flex-none items-center rounded-full bg-[#2475EE] px-[clamp(1.5rem,2.2vw,1.9rem)] py-[0.9rem] text-[1.02rem] font-semibold text-[#FFFFFF] shadow-[0_10px_24px_-14px_rgba(36,117,238,0.7)] transition hover:brightness-95"
            >
              View other tours
            </button>
          </div>
        </section>
      </div>

      {compareIds.length > 0 && !showCompare && (
        <CompareTray
          items={compareItems}
          onRemove={toggleCompare}
          onClearAll={() => setCompareIds([])}
          onCompare={() => setShowCompare(true)}
        />
      )}

      {showCompare && <CompareModal items={compareItems} onClose={() => setShowCompare(false)} />}
    </div>
  );
}
