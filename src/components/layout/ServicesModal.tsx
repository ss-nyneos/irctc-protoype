import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { serviceGroups } from "@/data/services";
import { AccentBar } from "@/components/common/AccentBar";
import { ServiceTile } from "./ServiceTile";

interface ServicesModalProps {
  open: boolean;
  onClose: () => void;
}

export function ServicesModal({ open, onClose }: ServicesModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  let tileIndex = 0;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="animate-fadeIn absolute inset-0 bg-navy/30 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-launcherIn absolute inset-x-0 top-0 mx-auto max-w-6xl px-3 pt-[92px] md:pt-[104px]">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-2xl">
          <AccentBar />
          <div className="flex items-center justify-between gap-3 border-b bg-navy/[0.03] px-5 py-4">
            <div>
              <div className="flex items-center gap-2 font-display text-[19px] font-semibold text-ink">
                <Sparkles size={18} className="text-brand" /> All IRCTC Services
              </div>
              <p className="text-[12.5px] text-muted-foreground">
                Everything for your journey — opens on the official IRCTC portal
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-secondary"
            >
              <X size={19} />
            </button>
          </div>
          <div className="max-h-[68vh] overflow-y-auto p-5">
            {serviceGroups.map((group) => (
              <div key={group.group} className="mb-5 last:mb-0">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {group.group}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <ServiceTile key={item.label} item={item} index={tileIndex++} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
