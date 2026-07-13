import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import heroVideo from "@/assets/hero/hero.mp4";
import posterImg from "@/assets/hero/jaipur-amber-fort.jpg";

/**
 * Full-bleed autoplaying hero background video. Starts muted (required for
 * browser autoplay) with a poster fallback; a top-right control lets the user
 * toggle sound. Autoplay is skipped when the user prefers reduced motion.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      v.pause(); // honour reduced-motion — keep the poster frame instead
      return;
    }
    v.muted = true; // guarantee muted so autoplay is allowed
    void v.play().catch(() => {}); // best-effort; poster covers a blocked play
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) void v.play().catch(() => {}); // ensure it's running when sound is on
    setMuted(next);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={posterImg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* mute / unmute toggle — top-right corner */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-6 md:top-6"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
}
