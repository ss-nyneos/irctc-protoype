import { useCallback, useEffect, useRef, useState } from "react";

export interface ZoomState {
  /** Scale factor. 1 is the whole map fitted to the box. */
  k: number;
  /** Translation, in the SVG's own coordinate units. */
  x: number;
  y: number;
}

const IDENTITY: ZoomState = { k: 1, x: 0, y: 0 };

/**
 * Pan and zoom inside a fixed SVG viewBox.
 *
 * Everything is kept in the SVG's own units rather than screen pixels, so the
 * transform holds regardless of how wide the container happens to be — the map
 * scales with its box, and the zoom composes on top of that.
 *
 * Plain wheel is left alone deliberately: a map that swallows scroll traps the
 * reader halfway down a page. Zoom is ctrl/⌘ + wheel, drag, double-click, or the
 * buttons — all of which are unambiguous intent.
 */
export function useMapZoom(width: number, height: number, maxZoom = 8, initial: ZoomState = IDENTITY) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<ZoomState>(initial);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  /** Never let the box show emptiness beside the map. */
  const clamp = useCallback(
    (next: ZoomState): ZoomState => {
      const k = Math.min(maxZoom, Math.max(1, next.k));
      return {
        k,
        x: Math.min(0, Math.max(width - width * k, next.x)),
        y: Math.min(0, Math.max(height - height * k, next.y)),
      };
    },
    [width, height, maxZoom],
  );

  /** Scale about a focal point so the thing under the cursor stays put. */
  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      setZoom((current) => {
        const k = Math.min(maxZoom, Math.max(1, current.k * factor));
        const ratio = k / current.k;
        return clamp({
          k,
          x: cx - (cx - current.x) * ratio,
          y: cy - (cy - current.y) * ratio,
        });
      });
    },
    [clamp, maxZoom],
  );

  /** Screen pixels → SVG units, so drag distance tracks the pointer exactly. */
  const toSvg = useCallback(
    (clientX: number, clientY: number) => {
      const box = frameRef.current?.getBoundingClientRect();
      if (!box) return { x: 0, y: 0, unit: 1 };
      const unit = width / box.width;
      return { x: (clientX - box.left) * unit, y: (clientY - box.top) * unit, unit };
    },
    [width],
  );

  const zoomIn = useCallback(() => zoomAt(1.6, width / 2, height / 2), [zoomAt, width, height]);
  const zoomOut = useCallback(() => zoomAt(1 / 1.6, width / 2, height / 2), [zoomAt, width, height]);
  const reset = useCallback(() => setZoom(clamp(initial)), [clamp, initial]);

  useEffect(() => {
    setZoom(clamp(initial));
  }, [clamp, initial]);

  // Wheel has to be bound by hand: React's synthetic listener is passive, and a
  // passive listener can't preventDefault the browser's own page zoom.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return; // Let the page scroll.
      event.preventDefault();
      const point = toSvg(event.clientX, event.clientY);
      zoomAt(Math.exp(-event.deltaY * 0.0022), point.x, point.y);
    };

    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, [toSvg, zoomAt]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom.k <= 1) return; // Nothing to pan to yet.
    const point = toSvg(event.clientX, event.clientY);
    drag.current = { x: point.x, y: point.y, tx: zoom.x, ty: zoom.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    const point = toSvg(event.clientX, event.clientY);
    setZoom((current) =>
      clamp({ k: current.k, x: start.tx + (point.x - start.x), y: start.ty + (point.y - start.y) }),
    );
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const point = toSvg(event.clientX, event.clientY);
    zoomAt(1.8, point.x, point.y);
  };

  return {
    zoom,
    /** Attach to the map's framing element. */
    frameRef,
    zoomIn,
    zoomOut,
    reset,
    /** Spread onto the same element. */
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onDoubleClick,
    },
    /** Turn a point in map units into its on-screen position under the zoom. */
    project: (x: number, y: number): [number, number] => [x * zoom.k + zoom.x, y * zoom.k + zoom.y],
  };
}
