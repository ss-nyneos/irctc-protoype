import { app } from '../data/content.ts'
import { Star } from './Icons.tsx'
import appDevices from '../assets/app-devices.svg'

const store =
  'inline-flex items-center gap-[0.7rem] rounded-xl bg-[#0a0a0a] px-[1.2rem] py-[0.7rem] text-white ' +
  'transition-transform duration-300 ease-brand hover:-translate-y-0.5 dark:border dark:border-line ' +
  '[&>span]:flex [&>span]:flex-col [&>span]:leading-[1.12]'
const storeSmall = 'text-[0.62rem] tracking-[0.06em] uppercase opacity-85'
const storeBig = 'text-[1.02rem] font-bold'

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
    <svg
      viewBox={`0 0 ${size + m * 2} ${size + m * 2}`}
      role="img"
      aria-label="QR code to download the app"
      className="h-auto w-[78px] rounded-[10px] bg-white p-[7px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.4)]"
    >
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
    <section className="section bg-paper" id="app">
      {/* overflow stays visible so the phone's tilted corner pops out of the blue frame */}
      <div
        className="wrap grid max-w-[1240px] grid-cols-1 items-center gap-[clamp(2rem,4vw,4rem)]
                   overflow-visible rounded-[clamp(22px,3vw,34px)] p-[clamp(2rem,4vw,3.6rem)]
                   text-left text-white shadow-[0_40px_90px_-40px_rgba(36,117,238,0.6)]
                   bg-[radial-gradient(120%_120%_at_82%_12%,#3f88f6_0%,var(--blue)_52%,#1a5ad6_100%)]
                   min-[861px]:grid-cols-2"
      >
        <div>
          <div className="mb-[1.4rem] flex items-center gap-[0.8rem]">
            <span className="rounded-full bg-white px-[0.9rem] py-[0.42rem] text-[0.8rem] font-bold text-blue">
              {app.rating} Rating
            </span>
            <span className="inline-flex gap-0.5 text-[1.1rem] text-white" aria-hidden="true">
              <Star /><Star /><Star /><Star />
              <Star className="opacity-40" />
            </span>
          </div>
          <h2 className="text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.02] font-bold tracking-[-0.03em] text-white">
            Your Journey,<br />Just a Tap Away
          </h2>
          <p className="mt-4 max-w-[34ch] text-[1.06rem] leading-normal text-white/90">
            Flights, Hotels and Travel Packages at your fingertips.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 min-[481px]:gap-[1.1rem]">
            <div className="flex flex-wrap gap-[0.8rem]">
              <a href={app.android} className={store} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M4 3.5 13.5 12 4 20.5c-.3-.2-.5-.6-.5-1V4.5c0-.4.2-.8.5-1Z" fill="#00c8ff" />
                  <path d="M4 3.5c.3-.2.7-.2 1 0l10 5.6-2.5 2.4L4 3.5Z" fill="#00e676" />
                  <path d="M4 20.5 12.5 11.9l2.5 2.4-10 5.7c-.3.1-.7.1-1-.1Z" fill="#ff3d47" />
                  <path d="m15 9.1 3.4 1.9c.7.4.7 1.6 0 2l-3.4 1.9-2.6-2.9L15 9.1Z" fill="#ffc400" />
                </svg>
                <span>
                  <span className={storeSmall}>GET IT ON</span>
                  <span className={storeBig}>Google Play</span>
                </span>
              </a>
              <a href={app.ios} className={store} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="#fff">
                  <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1-.05 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.65 1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.02-.01-2.1-.8-2.1-3.25Z" />
                  <path d="M14.5 6.3c.6-.7 1-1.7.9-2.7-.85.04-1.9.6-2.5 1.3-.55.6-1 1.6-.9 2.6.95.07 1.9-.5 2.5-1.2Z" />
                </svg>
                <span>
                  <span className={storeSmall}>Download on the</span>
                  <span className={storeBig}>App Store</span>
                </span>
              </a>
            </div>
            <div className="flex-none">
              <QrMatrix />
            </div>
          </div>
        </div>

        {/* pushed right so the phone bleeds off the edge for the 3D pop-out */}
        <div className="relative mt-2 flex items-center justify-end overflow-visible min-[861px]:mt-0">
          <img
            src={appDevices}
            alt=""
            loading="lazy"
            className="h-auto w-[min(100%,520px)] max-w-none
                       [filter:drop-shadow(0_30px_44px_rgba(0,0,0,0.4))_drop-shadow(0_6px_14px_rgba(0,0,0,0.25))]
                       min-[861px]:w-[min(156%,810px)] min-[861px]:translate-x-[11%] min-[861px]:-translate-y-[2%]"
          />
        </div>
      </div>
    </section>
  )
}
