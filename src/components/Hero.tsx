import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pin, Calendar, Users } from './Icons.tsx'
import { usePrefs } from '../context/Prefs.tsx'
import heroVideo from '../assets/hero-india.mp4'
import heroVideoDark from '../assets/darkModeHero.mp4'

export default function Hero() {
  const [where, setWhere] = useState('')
  const navigate = useNavigate()
  const { theme } = usePrefs()
  const isDark = theme === 'dark'
  const videoRef = useRef<HTMLVideoElement>(null)

  /* Changing <video src> alone doesn't reliably re-decode — the element can sit
     on the previous clip's last frame. load() forces the swap without
     remounting the node (see the note on the element below). */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
    v.play().catch(() => {
      /* autoplay can be blocked; the poster still shows */
    })
  }, [isDark])


  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/world')
    window.scrollTo({ top: 0 })
  }

  return (
    <section className="hero" id="top">
      {/* Deliberately NOT keyed: App.tsx's GSAP pins `.hero__img` on mount, so
          remounting on a theme toggle would leave that tween bound to a
          detached node and kill the hero drift. The node persists and the
          effect above reloads it in place instead. */}
      <video
        ref={videoRef}
        className="hero__img"
        src={isDark ? heroVideoDark : heroVideo}
        poster="/img/taj-dawn.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="hero__inner wrap">
        {/* three solid bands, stacked in flag order: saffron, white, green */}
        <h1 className="hero__heading">
          {/* line 1: "Explore the world" (saffron + white), line 2: "with IRCTC" (green) */}
          <span className="hero__line">
            <span className="hero__band hero__band--saffron">Explore</span>
            <span className="hero__band hero__band--white">the world</span>
          </span>
          <span className="hero__band hero__band--green">with IRCTC</span>
        </h1>

        <form className="hstrip" onSubmit={onSubmit}>
          <label className="hseg">
            <Pin />
            <span className="hseg__col">
              <span className="hseg__label">Where to?</span>
              <input
                className="hseg__input"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Explore destinations"
                aria-label="Where to"
              />
            </span>
          </label>

          <span className="hseg__div" aria-hidden="true" />

          <label className="hseg">
            <Calendar />
            <span className="hseg__col">
              <span className="hseg__label">When?</span>
              <select className="hseg__select" aria-label="When" defaultValue="">
                <option value="">Add dates</option>
                <option>This month</option>
                <option>Next 3 months</option>
                <option>Later this year</option>
              </select>
            </span>
          </label>

          <span className="hseg__div" aria-hidden="true" />

          <label className="hseg">
            <Users />
            <span className="hseg__col">
              <span className="hseg__label">Travellers</span>
              <select className="hseg__select" aria-label="Travellers" defaultValue="2 Adults, 1 Room">
                <option>2 Adults, 1 Room</option>
                <option>1 Adult</option>
                <option>2 Adults, 2 Rooms</option>
                <option>Family (4)</option>
              </select>
            </span>
          </label>

          <button type="submit" className="hstrip__go">
            <Search />
            <span>Explore</span>
          </button>
        </form>
      </div>
    </section>
  )
}
