import { useParallax } from "@/hooks/useParallax";
import { cx } from "@/utils/format";

/**
 * A photo that drifts gently against the scroll inside its frame.
 *
 * The frame (the parent) must be `relative overflow-hidden`. The image is sized
 * to 124% of it and pulled up 12%, which is the slack the drift moves within —
 * without it, a parallaxed image lifts its own edge into view and shows a gap.
 * That oversize is also why this always fills the frame at rest.
 */
export function ParallaxImage({
  src,
  alt,
  strength = 0.12,
  className = "",
}: {
  src: string;
  alt: string;
  strength?: number;
  className?: string;
}) {
  const ref = useParallax<HTMLImageElement>(strength);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      className={cx("absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover will-change-transform", className)}
    />
  );
}
