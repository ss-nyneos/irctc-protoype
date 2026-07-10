import { useState } from "react";
import { buildImageUrl } from "@/utils/format";

interface ImageWithFallbackProps {
  img: string;
  grad: [string, string];
  alt: string;
  className?: string;
  overlay?: boolean;
  width?: number;
}

/**
 * Renders a photo over a gradient placeholder. If the image fails to load,
 * the gradient + soft radial texture remains visible so the layout never
 * breaks. `img` accepts either an Unsplash photo id ("photo-…", resolved via
 * `buildImageUrl`) or a bundled local asset (an imported image, used as-is).
 */
export function ImageWithFallback({
  img,
  grad,
  alt,
  className = "",
  overlay = true,
  width = 900,
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = img.startsWith("photo-") ? buildImageUrl(img, width) : img;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
    >
      {!errored && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {(errored || !loaded) && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.2), transparent 45%)",
          }}
        />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />}
    </div>
  );
}
