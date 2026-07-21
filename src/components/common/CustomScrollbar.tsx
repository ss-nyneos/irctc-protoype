import { useEffect, useRef, useState } from "react";

export function CustomScrollbar() {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const lastScrollY = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const thumbHeight = 200; // Increased size (height 200px)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollableHeight = scrollHeight - clientHeight;

      if (scrollableHeight <= 0) {
        setScrollRatio(0);
        setIsAtBottom(false);
        return;
      }

      const ratio = scrollY / scrollableHeight;
      setScrollRatio(ratio);
      setIsAtBottom(ratio > 0.98);

      // Determine scroll direction
      if (scrollY > lastScrollY.current) {
        setIsScrollingUp(false);
      } else if (scrollY < lastScrollY.current) {
        setIsScrollingUp(true);
      }
      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startScrollY = window.scrollY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const trackElement = trackRef.current;
      if (!trackElement) return;

      const trackHeight = trackElement.clientHeight;
      const scrollableTrackHeight = trackHeight - thumbHeight;
      if (scrollableTrackHeight <= 0) return;

      const scrollableDocumentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDelta = (deltaY / scrollableTrackHeight) * scrollableDocumentHeight;

      window.scrollTo({
        top: Math.min(scrollableDocumentHeight, Math.max(0, startScrollY + scrollDelta)),
        behavior: "auto" // Instant response while dragging
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle clicking on the track to jump-scroll
  const handleTrackClick = (e: React.MouseEvent) => {
    // If user clicked the thumb itself, let handleMouseDown handle it
    if (e.target === thumbRef.current || thumbRef.current?.contains(e.target as Node)) {
      return;
    }

    const trackElement = trackRef.current;
    if (!trackElement) return;

    const rect = trackElement.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollableTrackHeight = rect.height - thumbHeight;
    if (scrollableTrackHeight <= 0) return;

    const scrollableDocumentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetRatio = (clickY - thumbHeight / 2) / scrollableTrackHeight;

    window.scrollTo({
      top: Math.min(scrollableDocumentHeight, Math.max(0, targetRatio * scrollableDocumentHeight)),
      behavior: "smooth"
    });
  };

  // Calculate thumb's top position
  const getThumbTop = () => {
    if (!trackRef.current) return 0;
    const trackHeight = trackRef.current.clientHeight;
    const scrollableTrackHeight = trackHeight - thumbHeight;
    return scrollRatio * scrollableTrackHeight;
  };

  // Natural scroll.png is oriented UP.
  // When scrolling DOWN (or at the top rest), we want it to face DOWN (so we flip vertically via scaleY(-1)).
  // When scrolling UP or at the bottom, we want it to face UP (so we scaleY(1)).
  const shouldFlip = !isScrollingUp && !isAtBottom;

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className="fixed right-3 -top-0 bottom-3 w-10 z-[100] cursor-pointer bg-transparent select-none"
      style={{ touchAction: "none" }}
    >
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        className="absolute left-1/2 -translate-x-1/2 w-44 h-[260px] cursor-grab active:cursor-grabbing select-none"
        style={{
          top: `${getThumbTop()}px`,
          transform: `translate3d(-50%, 0, 0) scaleY(${shouldFlip ? -1 : 1})`,
          transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" // Smooth flip animation
        }}
      >
        {/* Custom train image indicator (increased size) */}
        <img
          src="/scroll.png"
          alt="Train scroll indicator"
          className="w-full h-full object-contain drop-shadow-md"
          draggable="false"
        />
      </div>
    </div>
  );
}
