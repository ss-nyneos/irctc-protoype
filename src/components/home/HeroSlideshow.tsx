import { useEffect, useState } from "react";

const SLIDE_DURATION_MS = 6000;

interface Slide {
  src: string;
  alt: string;
}

export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy" aria-hidden="true">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          className="hero-slide absolute inset-0 h-full w-full object-cover"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
