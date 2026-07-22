import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { usePrefs } from '../context/Prefs.tsx'
import dayImg from '../assets/journey-hero-day.jpg'
import nightImg from '../assets/journey-hero-night.png'

gsap.registerPlugin(ScrollTrigger)

export default function Interstitial() {
  const { theme } = usePrefs()
  const isDark = theme === 'dark'
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  /* The parallax is owned here rather than by the generic [data-parallax] sweep
     in App.tsx. That sweep runs once on mount and caches each trigger's scroll
     position, but this section sits far down a page full of lazy-loaded images
     — by the time you scroll to it the page has grown and those cached
     positions are stale, so the tween never scrubbed and the photo sat frozen
     at its start offset. Binding locally lets it re-bind on the theme swap and
     refresh once the (2.8MB) night image has actually decoded. */
  useGSAP(
    () => {
      const el = imgRef.current
      const trigger = sectionRef.current
      if (!el || !trigger) return

      gsap.fromTo(
        el,
        { yPercent: -22 },
        {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      )

      // the image decides this section's height only after it decodes
      if (!el.complete) el.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
      ScrollTrigger.refresh()
    },
    { scope: sectionRef, dependencies: [isDark], revertOnUpdate: true },
  )

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[clamp(420px,62vh,640px)] items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {/* Matched day/night shots of the same train — swapped by theme rather
            than filtered, since the sky and lighting differ entirely.

            Sized here instead of via .px-media: that shared class is only 136%
            tall (18% of overflow per side) while a drift of 22 travels
            22% × 1.36 ≈ 30% of the container — past its own edge. At 200% tall
            there's 50% of overflow per side and 22 travels 44%: a large, clearly
            visible drift that still never exposes an edge. */}
        <img
          ref={imgRef}
          src={isDark ? nightImg : dayImg}
          alt="An IRCTC train crossing the countryside"
          className="absolute inset-x-0 top-[-50%] h-[200%] w-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.32)_46%,rgba(0,0,0,0.12)_100%)]" />
      </div>
      <div className="wrap w-full">
        {/* 64px is the desktop size; it steps down on narrow viewports or a
            single line would run well past the screen edge. */}
        <h2
          className="max-w-[18ch] font-sans text-display leading-[0.98] font-extrabold text-white
                     [text-shadow:0_4px_40px_rgba(0,0,0,0.4)]
                     max-[900px]:text-[48px] max-[560px]:text-[34px]"
        >
          Every great journey<br />begins with IRCTC.
        </h2>
      </div>
    </section>
  )
}
