import './Pilgrimage.css'
import { pilgrimage } from '../data/content.ts'
import { Pin, ArrowUpRight } from './Icons.tsx'

export default function Pilgrimage() {
  return (
    <section className="section pilgrimage" id="pilgrimage">
      <div className="wrap-wide">
        <div className="section-head pilgrimage__head">
          <h2 className="h2">Faith, on rails.</h2>
          <a href="#pilgrimage" className="tlink">
            Char Dham · Vaishno Devi · Shirdi
            <ArrowUpRight />
          </a>
        </div>

        <div className="pilgrimage__grid">
          {pilgrimage.map((p) => (
            <a key={p.id} href="#pilgrimage" className="pil-card reveal">
              <div className="pil-card__media arch">
                <img
                  src={p.img}
                  alt={`${p.name}, ${p.place}`}
                  className="px-media"
                  data-parallax="14"
                  loading="lazy"
                />
                <div className="pil-card__scrim" />
              </div>
              <div className="pil-card__body">
                <h3 className="pil-card__name">{p.name}</h3>
                <span className="pil-card__place">
                  <Pin />
                  {p.place}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
