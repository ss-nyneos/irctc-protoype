import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function MobileNavRow({
  label,
  onClick,
  external = false,
}: {
  label: string;
  onClick: () => void;
  external?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex w-full items-center justify-between border-b px-2 py-3 text-left text-[15px] font-bold text-navy"
    >
      {label} {external && <span className="text-muted-foreground text-xs">↗</span>}
    </button>
  );
}

export function MobileNavGroup({
  label,
  items,
  onPick,
}: {
  label: string;
  items: string[];
  onPick: (item: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        onClick={() => setOpen((o) => !o)}
        type="button"
        className="flex w-full items-center justify-between px-2 py-3 text-[15px] font-bold text-navy"
      >
        {label} {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="pb-2">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onPick(item)}
              type="button"
              className="block w-full rounded-lg px-4 py-2 text-left text-[14px] text-foreground/80 hover:bg-secondary"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileMenuPanel({ children }: { children: ReactNode }) {
  return <div className="p-3">{children}</div>;
}
