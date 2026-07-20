import './AppPromo.css'
import { app } from '../data/content.ts'
import { Star } from './Icons.tsx'
import appDevices from '../assets/app-devices.svg'

/* Deterministic QR-style matrix for the marketing panel (decorative). */
function QrMatrix({ size = 25 }: { size?: number }) {
  const cells: boolean[][] = []
  const finder = (x: number, y: number) => {
    const inA = x < 7 && y < 7
    const inB = x >= size - 7 && y < 7
    const inC = x < 7 && y >= size - 7
    if (!(inA || inB || inC)) return null
    const lx = inB ? x - (size - 7) : x
    const ly = inC ? y - (size - 7) : y
    const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6
    const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
    return ring || core
  }
  for (let y = 0; y < size; y++) {
    cells[y] = []
    for (let x = 0; x < size; x++) {
      const f = finder(x, y)
      if (f !== null) cells[y][x] = f
      else cells[y][x] = ((x * 7 + y * 13 + x * y) % 5) % 2 === 0 && (x + y) % 3 !== 0
    }
  }
  const m = 4
  return (
    <svg viewBox={`0 0 ${size + m * 2} ${size + m * 2}`} className="qr" role="img" aria-label="QR code to download the app">
      <rect width="100%" height="100%" fill="#fff" />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x + m} y={y + m} width="1" height="1" fill="#0a0a0a" /> : null,
        ),
      )}
    </svg>
  )
}

export default function AppPromo() {
  return (
    <section className="section apppromo" id="app">
      <div className="wrap apppromo__card">
        <div className="apppromo__text">
          <div className="apppromo__rating">
            <span className="apppromo__pill">{app.rating} Rating</span>
            <span className="apppromo__stars" aria-hidden="true">
              <Star /><Star /><Star /><Star />
              <Star className="apppromo__star-empty" />
            </span>
          </div>
          <h2 className="apppromo__title">
            Your Journey,<br />Just a Tap Away
          </h2>
          <p className="apppromo__sub">
            Flights, Hotels and Travel Packages at your fingertips.
          </p>
          <div className="apppromo__actions">
            <div className="apppromo__badges">
              <a href={app.android} className="store" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M4 3.5 13.5 12 4 20.5c-.3-.2-.5-.6-.5-1V4.5c0-.4.2-.8.5-1Z" fill="#00c8ff" />
                  <path d="M4 3.5c.3-.2.7-.2 1 0l10 5.6-2.5 2.4L4 3.5Z" fill="#00e676" />
                  <path d="M4 20.5 12.5 11.9l2.5 2.4-10 5.7c-.3.1-.7.1-1-.1Z" fill="#ff3d47" />
                  <path d="m15 9.1 3.4 1.9c.7.4.7 1.6 0 2l-3.4 1.9-2.6-2.9L15 9.1Z" fill="#ffc400" />
                </svg>
                <span>
                  <span className="store__small">GET IT ON</span>
                  <span className="store__big">Google Play</span>
                </span>
              </a>
              <a href={app.ios} className="store" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="#fff">
                  <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1-.05 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.65 1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.02-.01-2.1-.8-2.1-3.25Z" />
                  <path d="M14.5 6.3c.6-.7 1-1.7.9-2.7-.85.04-1.9.6-2.5 1.3-.55.6-1 1.6-.9 2.6.95.07 1.9-.5 2.5-1.2Z" />
                </svg>
                <span>
                  <span className="store__small">Download on the</span>
                  <span className="store__big">App Store</span>
                </span>
              </a>
            </div>
            <div className="apppromo__qr">
              <QrMatrix />
            </div>
          </div>
        </div>

        <div className="apppromo__devices" aria-hidden="true">
          <img src={appDevices} alt="" className="apppromo__devices-img" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
