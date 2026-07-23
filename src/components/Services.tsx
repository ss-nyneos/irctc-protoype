import { ChevronR } from './Icons.tsx'
import archFrame from '../assets/graphic/arch-frame.png'
import imgFlights from '../assets/irctc_services_assets/svc-flights.jpg'
import imgHotels from '../assets/irctc_services_assets/svc-hotels.webp'
import imgBus from '../assets/irctc_services_assets/svc-bus.webp'
import imgRetiring from '../assets/irctc_services_assets/svc-retiring-room.jpeg'
import imgLounge from '../assets/irctc_services_assets/svc-lounge.png'
import imgBharatGaurav from '../assets/irctc_services_assets/svc-bharat-gaurav.webp'
import imgBuddhist from '../assets/irctc_services_assets/svc-buddhist-train.jpg'
import imgHeli from '../assets/irctc_services_assets/svc-heli-yatra.webp'
import imgFerry from '../assets/irctc_services_assets/svc-ferry.png'
import imgTrek from '../assets/irctc_services_assets/svc-trek.webp'
import imgMaharajas from '../assets/irctc_services_assets/svc-maharajas.jpg'
import imgGoldenChariot from '../assets/irctc_services_assets/svc-golden-chariot.jpeg'

type Svc = {
  label: string
  blurb: string
  img: string
}

const SERVICES: Svc[] = [
  { label: 'Flights', img: imgFlights, blurb: 'Book domestic and international flights at the best available fares.' },
  { label: 'Hotels', img: imgHotels, blurb: 'Stay at handpicked hotels near every station and sight.' },
  { label: 'Bus Tickets', img: imgBus, blurb: 'Book comfortable and reliable bus journeys across India.' },
  { label: 'Retiring Rooms', img: imgRetiring, blurb: 'Rest between trains in clean, affordable station rooms.' },
  { label: 'Executive Lounge', img: imgLounge, blurb: 'Unwind in premium lounges with refreshments and Wi-Fi.' },
  { label: 'Bharat Gaurav', img: imgBharatGaurav, blurb: 'Themed circuit trains celebrating India’s heritage.' },
  { label: 'Buddhist Circuit', img: imgBuddhist, blurb: 'Trace the footsteps of the Buddha across sacred sites.' },
  { label: 'Heli Yatra', img: imgHeli, blurb: 'Reach high Himalayan shrines by helicopter, fast and easy.' },
  { label: 'Ferry & Cruises', img: imgFerry, blurb: 'Sail the backwaters, islands and rivers of coastal India.' },
  { label: 'Himalayan Treks', img: imgTrek, blurb: 'Guided treks through the valleys and passes of the north.' },
  { label: "Maharajas' Express", img: imgMaharajas, blurb: 'Travel like royalty aboard India’s finest luxury train.' },
  { label: 'Golden Chariot', img: imgGoldenChariot, blurb: 'A regal rail journey through the south’s temples and coasts.' },
]

/* The photo is clipped to the arch-frame's cusped opening so it sits inside the
   dome rather than as a square behind it. objectBoundingBox units, so the one
   path scales to every dome. Traced pixel-for-pixel from arch-frame.png by
   flood-filling its opening (scratchpad/trace-arch2.mjs); it pairs with the
   exact niche insets on .svc__photo-wrap in Services.css, so the photo fills
   the multifoil opening right up to the carved gold border. */
const ARCH_CLIP =
  'M0,1L0,0.574L0.008,0.445L0.016,0.393L0.024,0.309L0.032,0.305L0.04,0.289L0.047,0.284L0.055,0.273L0.063,0.272L0.071,0.263L0.079,0.255L0.087,0.247L0.095,0.22L0.103,0.196L0.111,0.188L0.119,0.183L0.127,0.176L0.135,0.171L0.142,0.169L0.15,0.163L0.158,0.161L0.166,0.158L0.174,0.154L0.182,0.148L0.19,0.144L0.198,0.134L0.206,0.128L0.214,0.112L0.222,0.101L0.23,0.096L0.237,0.089L0.245,0.087L0.253,0.082L0.261,0.081L0.269,0.079L0.277,0.077L0.285,0.077L0.293,0.077L0.301,0.072L0.309,0.07L0.317,0.069L0.325,0.064L0.332,0.064L0.34,0.057L0.348,0.057L0.356,0.055L0.364,0.049L0.372,0.047L0.38,0.04L0.388,0.034L0.396,0.029L0.404,0.025L0.412,0.025L0.42,0.02L0.427,0.017L0.435,0.015L0.443,0.013L0.451,0.012L0.459,0.008L0.467,0.007L0.475,0.005L0.483,0.005L0.491,0.003L0.499,0.002L0.507,0.002L0.515,0.002L0.522,0.005L0.53,0.007L0.538,0.007L0.546,0.01L0.554,0.012L0.562,0.015L0.57,0.017L0.578,0.017L0.586,0.02L0.594,0.022L0.602,0.025L0.609,0.025L0.617,0.037L0.625,0.039L0.633,0.044L0.641,0.049L0.649,0.06L0.657,0.062L0.665,0.064L0.673,0.064L0.681,0.067L0.689,0.072L0.697,0.074L0.704,0.074L0.712,0.074L0.72,0.072L0.728,0.076L0.736,0.076L0.744,0.077L0.752,0.079L0.76,0.082L0.768,0.082L0.776,0.086L0.784,0.092L0.792,0.099L0.799,0.106L0.807,0.107L0.815,0.148L0.823,0.149L0.831,0.156L0.839,0.159L0.847,0.163L0.855,0.166L0.863,0.171L0.871,0.176L0.879,0.178L0.887,0.18L0.894,0.185L0.902,0.201L0.91,0.213L0.918,0.248L0.926,0.258L0.934,0.263L0.942,0.267L0.95,0.272L0.958,0.282L0.966,0.285L0.974,0.305L0.982,0.379L0.989,0.414L0.997,0.44L1,0.461L1,1Z'

/* Stack each word of the label on its own line so it fits inside the narrow
   dome. A lone "&" (Ferry & Cruises) is merged into the next word so it never
   sits alone on a line. */
function labelLines(label: string): string[] {
  const words = label.split(' ')
  const lines: string[] = []
  for (let i = 0; i < words.length; i++) {
    if (words[i] === '&' && i + 1 < words.length) {
      lines.push(`& ${words[i + 1]}`)
      i++
    } else {
      lines.push(words[i])
    }
  }
  return lines
}

export default function Services() {
  return (
    <section className="section palace" id="services">
      <div className="palace__head wrap-wide">
        <h2 className="h2 palace__title">
          <span className="palace__titletext">Our <span>Services</span></span>
        </h2>
      </div>

      {/* one shared clip path for every dome; objectBoundingBox units, so it
          scales to each .svc__photo box and cuts the photo to the cusped arch */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id="svc-arch" clipPathUnits="objectBoundingBox">
            <path d={ARCH_CLIP} />
          </clipPath>
        </defs>
      </svg>

      <div className="palace__grid">
        {SERVICES.map((s) => {
            return (
              <div className="svc reveal" key={s.label}>
                <img className="svc__frame" src={archFrame} alt="" aria-hidden="true" />

                {/* the service photo, clipped to the arch so it fills the dome
                    niche rather than sitting as a square behind the frame. the
                    label and the hover card live inside the clip too, so both
                    take the arch silhouette and stay within the niche. */}
                <span className="svc__photo-wrap">
                  <img className="svc__photo" src={s.img} alt="" aria-hidden="true" loading="lazy" />
                  <span className="svc__scrim" aria-hidden="true" />
                  <span className="svc__label">
                    {labelLines(s.label).map((line, i) => (
                      <span className="svc__labelword" key={i}>{line}</span>
                    ))}
                  </span>

                  <span className="svc__pop" role="group" aria-label={s.label}>
                    <span className="svc__pop-title">{s.label}</span>
                    <span className="svc__pop-desc">{s.blurb}</span>
                    <span className="svc__pop-link">
                      Explore
                      <span className="svc__pop-circ"><ChevronR /></span>
                    </span>
                  </span>
                </span>
              </div>
            )
          })}
      </div>
    </section>
  )
}

/*
  ============================================================
  PALACE FACADE VERSION — COMMENTED OUT (2026-07-23)
  The single-image palace facade (services-palace.png with each
  service photo inset into a carved window) is disabled. The
  earlier "domes" arch-frame grid is restored above. Inner
  comment delimiters were stripped so this whole block nests
  inside one comment — restore the pristine copy from git
  (commit 0bf1a91) if you ever want it back.
  ------------------------------------------------------------

import { ChevronR } from './Icons.tsx'
import palaceImg from '../assets/services-palace.png'
import imgFlights from '../assets/irctc_services_assets/svc-flights.jpg'
import imgHotels from '../assets/irctc_services_assets/svc-hotels.jpg'
import imgBus from '../assets/irctc_services_assets/svc-bus.webp'
import imgRetiring from '../assets/irctc_services_assets/svc-retiring-room.jpg'
import imgBharatGaurav from '../assets/irctc_services_assets/svc-bharat-gaurav.webp'
import imgBuddhist from '../assets/irctc_services_assets/svc-buddhist-train.jpg'
import imgHeli from '../assets/irctc_services_assets/svc-heli.avif'
import imgFerry from '../assets/irctc_services_assets/svc-ferry.png'
import imgTrek from '../assets/irctc_services_assets/svc-trek.webp'
import imgMaharajas from '../assets/irctc_services_assets/svc-maharajas.jpg'
import imgGoldenChariot from '../assets/irctc_services_assets/svc-golden-chariot.jpeg'
import imgLounge from '../assets/irctc_services_assets/svc-lounge.webp'

type Svc = {
  label: string
  blurb: string
  img: string
}

 Order is the reading order of the palace windows: row 1 left→right, then
   row 2 left→right. Index i maps to WINDOWS[i]. 
const SERVICES: Svc[] = [
  { label: 'Flights', img: imgFlights, blurb: 'Book domestic and international flights at the best available fares.' },
  { label: 'Hotels', img: imgHotels, blurb: 'Stay at handpicked hotels near every station and sight.' },
  { label: 'Bus Tickets', img: imgBus, blurb: 'Book comfortable and reliable bus journeys across India.' },
  { label: 'Retiring Rooms', img: imgRetiring, blurb: 'Rest between trains in clean, affordable station rooms.' },
  { label: 'Executive Lounge', img: imgLounge, blurb: 'Unwind in premium lounges with refreshments and Wi-Fi.' },
  { label: 'Bharat Gaurav', img: imgBharatGaurav, blurb: 'Themed circuit trains celebrating India’s heritage.' },
  { label: 'Buddhist Circuit', img: imgBuddhist, blurb: 'Trace the footsteps of the Buddha across sacred sites.' },
  { label: 'Heli Yatra', img: imgHeli, blurb: 'Reach high Himalayan shrines by helicopter, fast and easy.' },
  { label: 'Ferry & Cruises', img: imgFerry, blurb: 'Sail the backwaters, islands and rivers of coastal India.' },
  { label: 'Himalayan Treks', img: imgTrek, blurb: 'Guided treks through the valleys and passes of the north.' },
  { label: "Maharajas' Express", img: imgMaharajas, blurb: 'Travel like royalty aboard India’s finest luxury train.' },
  { label: 'Golden Chariot', img: imgGoldenChariot, blurb: 'A regal rail journey through the south’s temples and coasts.' },
]

 Geometry of the 12 carved window openings in services-palace.png, as
   %-of-image, so each photo tracks its arch exactly at any render size.
   These are measured off the PNG itself — the openings are pure white against
   the cream facade, so scanning the bitmap for white runs gives their true
   centres rather than eyeballed ones (which drifted ~0.7% right-of-centre by
   the sixth column). Openings measure ~7.85% wide × ~19.3% tall. 
const COLS = [17.99, 30.5, 42.94, 55.52, 68.02, 80.6]
const ROWS = [45.64, 74.21]
 Sized to the bitmap-traced opening (7.75 × 19.04) plus a hair, so each photo
   fills its arch and tucks just under the carved frame's inner lip. The exact
   cusped-arch silhouette is done with clip-path (ARCH_CLIP), not border-radius —
   a rounded rectangle can't trace a pointed, scalloped Mughal arch. 
const WIN_W = 8.05
const WIN_H = 19.4

 Traced from services-palace.png's own opening: a flood-fill of one window at
   the white↔cream boundary (blue channel), mirrored to a clean symmetric arch,
   in objectBoundingBox units so it scales to every window. Verified against the
   opening in scratchpad/win0-detect.png. See scratchpad/extract-v3.mjs. 
const ARCH_CLIP =
  'M0 1L0 .5255L.0082 .352L.0164 .3265L.0246 .301L.0328 .2857L.041 .2755L.0492 .2704' +
  'L.0574 .2602L.0656 .2551L.0738 .2398L.082 .2143L.0902 .199L.0984 .1888L.1066 .1786' +
  'L.1148 .1633L.123 .1531L.1311 .148L.1475 .1429L.1639 .1378L.1803 .1327L.1885 .1276' +
  'L.1967 .1224L.2049 .1122L.2131 .0969L.2213 .0867L.2295 .0816L.2377 .0765L.2623 .0714' +
  'L.3443 .0714L.3525 .0663L.3689 .0612L.377 .0561L.3852 .051L.3934 .0408L.4016 .0357' +
  'L.4098 .0306L.4262 .0255L.4426 .0204L.4508 .0153L.4672 .0102L.4836 .0051L.5 0' +
  'L.5164 .0051L.5328 .0102L.5492 .0153L.5574 .0204L.5738 .0255L.5902 .0306L.5984 .0357' +
  'L.6066 .0408L.6148 .051L.623 .0561L.6311 .0612L.6475 .0663L.6557 .0714L.7377 .0714' +
  'L.7459 .0765L.7705 .0816L.7787 .0867L.7869 .0969L.7951 .1122L.8033 .1224L.8115 .1276' +
  'L.8197 .1327L.8361 .1378L.8525 .1429L.8689 .148L.877 .1531L.8852 .1633L.8934 .1786' +
  'L.9016 .1888L.9098 .199L.918 .2143L.9262 .2398L.9344 .2551L.9426 .2602L.9508 .2704' +
  'L.959 .2755L.9672 .2857L.9754 .301L.9836 .3265L.9918 .352L1 .5255L1 1Z'
const WINDOWS = ROWS.flatMap((top) => COLS.map((left) => ({ top, left })))

export default function Services() {
  return (
    <section className="section palace" id="services">
      { one shared clip path for every window; objectBoundingBox units, so it
          scales to each .svc box and cuts the photo to the cusped arch }
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id="svc-arch" clipPathUnits="objectBoundingBox">
            <path d={ARCH_CLIP} />
          </clipPath>
        </defs>
      </svg>

      { the palace photo IS the layout: each service photo is inset into the
          %-coordinates of its carved window, so the whole thing scales as one
          piece rather than as a grid of separate cards }
      <div className="palace__photo">
        <img className="palace__facade" src={palaceImg} alt="" aria-hidden="true" />

        { heading overlaid in the dome band, centred in the empty span
            between the two inner domes rather than floating above the image }
        <div className="palace__head">
          <h2 className="palace__title">
            Our <span>Services</span>
          </h2>
        </div>

        {SERVICES.map((s, i) => {
          const w = WINDOWS[i]
          return (
            <button
              type="button"
              className="svc"
              key={s.label}
              style={{
                top: `${w.top}%`,
                left: `${w.left}%`,
                width: `${WIN_W}%`,
                height: `${WIN_H}%`,
              }}
              aria-label={s.label}
            >
              <img className="svc__photo" src={s.img} alt="" aria-hidden="true" loading="lazy" />
              { scrim so the caption stays readable over any photograph }
              <span className="svc__scrim" aria-hidden="true" />
              <span className="svc__label">{s.label}</span>

              <span className="svc__pop" role="group">
                <span className="svc__pop-title">{s.label}</span>
                <span className="svc__pop-desc">{s.blurb}</span>
                <span className="svc__pop-link">
                  Explore
                  <span className="svc__pop-circ"><ChevronR /></span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
*/
