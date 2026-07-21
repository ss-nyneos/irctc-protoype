import type { SVGProps, ReactNode } from 'react'
import { Hotel, Stupa, Mountain, Ferry, ChevronR } from './Icons.tsx'
import archFrame from '../assets/graphic/arch-frame.png'
import icAirplane from '../assets/graphic/airplane.png'
import icBus from '../assets/graphic/bus.png'
import icBed from '../assets/graphic/single-bed.png'
import icLounge from '../assets/graphic/lounge.png'
import icTrain from '../assets/graphic/train.png'
import icTrain2 from '../assets/graphic/train-2.png'
import icCrown from '../assets/graphic/crown.png'
import icHiking from '../assets/graphic/hiking.png'

type Svc = {
  label: string
  blurb: string
  img?: string
  Icon?: (p: SVGProps<SVGSVGElement>) => ReactNode
}

const SERVICES: Svc[] = [
  { label: 'Flights', img: icAirplane, blurb: 'Book domestic and international flights at the best available fares.' },
  { label: 'Hotels', Icon: Hotel, blurb: 'Stay at handpicked hotels near every station and sight.' },
  { label: 'Bus Tickets', img: icBus, blurb: 'Book comfortable and reliable bus journeys across India.' },
  { label: 'Retiring Rooms', img: icBed, blurb: 'Rest between trains in clean, affordable station rooms.' },
  { label: 'Executive Lounge', img: icLounge, blurb: 'Unwind in premium lounges with refreshments and Wi-Fi.' },
  { label: 'Bharat Gaurav', img: icTrain, blurb: 'Themed circuit trains celebrating India’s heritage.' },
  { label: 'Buddhist Circuit', Icon: Stupa, blurb: 'Trace the footsteps of the Buddha across sacred sites.' },
  { label: 'Heli Yatra', Icon: Mountain, blurb: 'Reach high Himalayan shrines by helicopter, fast and easy.' },
  { label: 'Ferry & Cruises', Icon: Ferry, blurb: 'Sail the backwaters, islands and rivers of coastal India.' },
  { label: 'Himalayan Treks', img: icHiking, blurb: 'Guided treks through the valleys and passes of the north.' },
  { label: "Maharajas' Express", img: icCrown, blurb: 'Travel like royalty aboard India’s finest luxury train.' },
  { label: 'Golden Chariot', img: icTrain2, blurb: 'A regal rail journey through the south’s temples and coasts.' },
]

export default function Services() {
  return (
    <section className="section palace" id="services">
      <div className="palace__head wrap-wide">
        <h2 className="h2 palace__title">
          <span className="palace__titletext">Our <span>Services</span></span>
        </h2>
      </div>

      <div className="palace__grid">
        {SERVICES.map((s) => {
            return (
              <div className="svc reveal" key={s.label}>
                <img className="svc__frame" src={archFrame} alt="" aria-hidden="true" />
                <div className="svc__content">
                  {/* the popup is anchored to the glyph so it always opens
                      directly beneath the icon, never on top of it */}
                  <span className="svc__glyph">
                    {s.img ? (
                      <img className="svc__icon svc__icon--img" src={s.img} alt="" aria-hidden="true" />
                    ) : (
                      s.Icon?.({ className: 'svc__icon' })
                    )}

                    <div className="svc__pop" role="group" aria-label={s.label}>
                      <h3 className="svc__pop-title">{s.label}</h3>
                      <p className="svc__pop-desc">{s.blurb}</p>
                      <a className="svc__pop-link" href="#services">
                        Explore
                        <span className="svc__pop-circ"><ChevronR /></span>
                      </a>
                    </div>
                  </span>
                  <span className="svc__label">{s.label}</span>
                </div>
              </div>
            )
          })}
      </div>
    </section>
  )
}
