import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pin, Calendar, Users } from './Icons.tsx'
import heroVideo from '../assets/hero-india.mp4'

export default function Hero() {
  const [where, setWhere] = useState('')
  const navigate = useNavigate()


  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/world')
    window.scrollTo({ top: 0 })
  }

  return (
    <section className="hero" id="top">
      <video
        className="hero__img"
        src={heroVideo}
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
          <span className="hero__band hero__band--saffron">Explore</span>
          <span className="hero__band hero__band--white">the world</span>
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
