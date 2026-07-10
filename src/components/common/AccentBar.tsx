import { cx } from "@/utils/format";

export function AccentBar({ className = "" }: { className?: string }) {
  return <div className={cx("h-[3px] w-full accent-bar", className)} />;
}
