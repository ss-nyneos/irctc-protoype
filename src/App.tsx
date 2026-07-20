import { useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { UIProvider } from './context/UI.tsx'
import { PrefsProvider } from './context/Prefs.tsx'
import NavBar from './components/NavBar.tsx'
import Footer from './components/Footer.tsx'
import ModalRoot from './components/ModalRoot.tsx'
import Home from './pages/Home.tsx'
import Packages from './pages/Packages.tsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      /* ---- Hero: pinned behind the page, drifting and dimming as it goes ---- */
      gsap.to('.hero__img', {
        yPercent: 26,
        scale: 1.22,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
        },
      })
      // hero furniture leaves faster than the footage behind it
      gsap.to('.hero__inner', {
        yPercent: -34,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom 30%',
          scrub: 0.3,
        },
      })

      /* ---- Generic multi-speed parallax: any [data-parallax] element ---- */
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = Number(el.dataset.parallax) || 16
        const trigger = el.closest('section') ?? el
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
              trigger,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          },
        )
      })

      /* ---- Section headings: scrub in, then drift ---- */
      gsap.utils.toArray<HTMLElement>('.h2').forEach((el) => {
        gsap.from(el, {
          y: 52,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
        gsap.to(el, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      })

      /* ---- Marquee rails counter-drift as you scroll ---- */
      gsap.utils.toArray<HTMLElement>('.trend__marquee, .luxe__rail-area').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        )
      })

      // Cards / features batch reveal
      gsap.set('.reveal', { opacity: 0, y: 46 })
      ScrollTrigger.batch('.reveal', {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.09,
            overwrite: true,
          }),
      })

      /* ---- Offers + Stats: cards introduce themselves one by one ---- */
      gsap.utils.toArray<HTMLElement>('.offers__grid, .stats__grid').forEach((grid) => {
        const cards = Array.from(grid.children) as HTMLElement[]
        if (!cards.length) return
        gsap.set(cards, { opacity: 0, y: 64, scale: 0.9 })
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 84%',
          once: true,
          onEnter: () =>
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: 'back.out(1.5)',
              stagger: 0.16,
              // hand control back to CSS so the hover lift keeps working
              clearProps: 'transform,opacity',
            }),
        })
      })

      ScrollTrigger.refresh()
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  )

  return (
    <PrefsProvider>
      <UIProvider>
        <div ref={root}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
          </Routes>
          <Footer />
          <ModalRoot />
        </div>
      </UIProvider>
    </PrefsProvider>
  )
}
