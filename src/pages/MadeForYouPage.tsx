import { useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { getSuggestions } from "@/data/mockProfile";
import { getPackageById } from "@/data/packages";
import { DragGallery } from "@/components/common/DragGallery";
import { TravelPhotoDiary } from "@/components/common/TravelPhotoDiary";
import { EditorialPackageCard, HOVER_GROW } from "@/components/package/EditorialPackageCard";
import { CompareModal } from "@/components/package/CompareModal";
import { CompareTray, COMPARE_MAX } from "@/components/package/CompareTray";

export function MadeForYouPage() {
  const ref = useReveal();
  const navigate = useNavigate();
  const { go } = useRouter();
  const recommended = useMemo(() => getSuggestions(3), []);
  const recommendedRows = useMemo(() => {
    const rows: (typeof recommended)[] = [];
    for (let i = 0; i < recommended.length; i += 2) rows.push(recommended.slice(i, i + 2));
    return rows;
  }, [recommended]);
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
      className="min-h-screen bg-[#FFFFFF] pb-12 text-[#323232]"
    // style={{ paddingBottom: "calc(6rem + var(--dock-offset, 0px))" }}
    >
      {/* Gallery pins in place; content below scrolls up and covers it. */}
      <div className="sticky top-0 z-0 h-[72vh] min-h-[480px] w-full bg-[#FFFFFF]">
        <DragGallery className="h-full w-full pt-4" label="Drag to explore" />
      </div>

      <div className="relative z-10 bg-[#FFFFFF] shadow-[0_-28px_56px_-28px_rgba(10,15,30,0.28)]">
        <div className="mx-auto max-w-7xl px-3 pt-10 sm:px-4 md:px-5 md:pt-14 lg:px-6">
          <TravelPhotoDiary />
        </div>

        <div className="mx-auto max-w-7xl px-3 pt-16 sm:px-4 md:px-5 lg:px-6">
          <h2 className="heading-xl reveal mt-16" style={{ fontSize: "28px" }}>
            YOU MIGHT ALSO <span className="accent">LIKE</span>
          </h2>

          {/* Two cards per row; a third wraps below. Each row is its own
              hover-to-grow group — what one cell takes the other gives back,
              so the row's total width never moves. */}
          <div className="mt-6 space-y-5">
            {recommendedRows.map((row, r) => (
              <div
                key={r}
                className={`card-row flex flex-col gap-5 sm:flex-row ${row.length === 1
                  ? "sm:w-[calc(50%-0.625rem)] sm:transition-[width] sm:duration-500 sm:ease-[cubic-bezier(0.22,1,0.36,1)] sm:hover:w-[calc(63%-0.625rem)]"
                  : ""
                  }`}
                style={
                  {
                    "--cell-grow": 1 + HOVER_GROW,
                    "--cell-shrink": row.length > 1 ? 1 - HOVER_GROW / (row.length - 1) : 1,
                  } as CSSProperties
                }
              >
                {row.map((pkg) => (
                  <div key={pkg.id} className="card-cell min-w-0">
                    <div className="reveal relative">
                      <EditorialPackageCard
                        pkg={pkg}
                        compact
                        comparing={compareIds.includes(pkg.id)}
                        onCompare={() => toggleCompare(pkg.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="relative mt-6 overflow-hidden bg-[#FFFFFF] pb-[clamp(0.15rem,0.6vw,0.4rem)] pt-[clamp(3rem,5.5vw,5rem)]">
          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-[clamp(1rem,2.4vw,1.8rem)] px-4 text-center min-[681px]:flex-row min-[681px]:gap-[clamp(1.4rem,3vw,2.6rem)]">
            <p className="heading-xl" style={{ fontSize: "28px" }}>
              Didn&apos;t like our <span className="accent">suggestions?</span>
            </p>
            <button
              type="button"
              onClick={viewOtherTours}
              className="inline-flex flex-none items-center rounded-full bg-[#2475EE] px-[clamp(1.1rem,1.8vw,1.4rem)] py-[0.6rem] text-[0.9rem] font-semibold text-[#FFFFFF] shadow-[0_10px_24px_-14px_rgba(36,117,238,0.7)] transition hover:brightness-95"
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
