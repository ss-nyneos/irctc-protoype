import './ExploreCta.css'
import { Link } from 'react-router-dom'
import { Pin } from './Icons.tsx'
import skyline from '../assets/explore/skyline.svg'
import skylineReflection from '../assets/explore/skyline-reflection.svg'
import boat from '../assets/explore/boat.svg'

const floats = [
  { id: 'a', state: 'Gujarat', tours: 125, img: '/img/jaipur-hd.jpg', pillFirst: false },
  { id: 'b', state: 'Madhya Pradesh', tours: 125, img: '/img/temple-gopuram.jpg', pillFirst: false },
  { id: 'c', state: 'Tamil Nadu', tours: 125, img: '/img/kerala-waterfall.jpg', pillFirst: true },
]

export default function ExploreCta() {
  return (
    <section className="explore">
      <div className="wrap explore__inner">
        <h2 className="h2 explore__title">
          Ready To Explore The <span>World?</span>
        </h2>
        <p className="explore__sub">
          Start your next adventure today — find hidden gems, plan your trip, and
          make memories that last a lifetime.
        </p>
        <Link to="/packages" className="explore__cta">
          Book Ticket
        </Link>
      </div>

      {/* floating destination cards */}
      {floats.map((f) => (
        <figure
          className={`fcard fcard--${f.id} ${f.pillFirst ? 'fcard--reverse' : ''}`}
          key={f.id}
        >
          <img className="fcard__img" src={f.img} alt={f.state} loading="lazy" />
          <figcaption className="fcard__pill">
            <Pin />
            <span className="fcard__meta">
              <strong>{f.state}</strong>
              <small>{f.tours} Tours</small>
            </span>
          </figcaption>
        </figure>
      ))}

      {/* skyline + its reflection in the water */}
      <div className="explore__scape" aria-hidden="true">
        <img src={skyline} alt="" className="explore__skyline" />
        <img src={skylineReflection} alt="" className="explore__reflection" />
        <img src={boat} alt="" className="explore__boat" />
      </div>
    </section>
  )
}
