import { footer, contact } from '../data/content.ts'
import emblem from '../assets/irctc-emblem.png'
import { useUI } from '../context/UI.tsx'
import { Instagram, XLogo, YouTube } from './Icons.tsx'

/* The footer re-maps the palette to light so every child reads on navy.
   Because tailwind.css declares the theme with `@theme inline`, utilities
   like `text-ink-soft` resolve through these same variables — so overriding
   them here re-themes the utilities too. No bold anywhere: hierarchy comes
   from size, case and colour, per the reference. */
const palette =
  '[--ink:#ffffff] [--ink-soft:rgba(255,255,255,0.72)] [--ink-faint:rgba(255,255,255,0.5)] ' +
  '[--black:#ffffff] [--blue:#7ba6ff] [--blue-ink:#9dc0ff] [--line:rgba(255,255,255,0.16)]'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'X', href: 'https://x.com', Icon: XLogo },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTube },
]

const colLink =
  'text-[0.95rem] font-normal text-ink-soft transition-[color,padding-left] duration-250 ease-brand ' +
  'hover:pl-1 hover:text-white'

const legalLink = 'font-normal text-ink-soft transition-colors duration-250 ease-brand hover:text-white'

export default function Footer() {
  const { openPartPayment } = useUI()
  return (
    <footer className={`bg-[#0e2149] py-0 text-ink-soft ${palette}`}>
      <div className="wrap-wide pt-[clamp(2.4rem,4.2vw,3.6rem)] pb-[clamp(1.8rem,3vw,2.6rem)]">
        {/* One grid for the brand/contact block AND the link columns, so they
            share the same tracks and the columns stay perfectly even. */}
        <div
          className="grid grid-cols-2 gap-x-[clamp(1.4rem,2.5vw,2.6rem)] gap-y-[clamp(2rem,3vw,2.8rem)]
                     min-[561px]:grid-cols-3 min-[901px]:grid-cols-[1.4fr_repeat(5,1fr)]"
        >
          <div className="col-span-2 min-[561px]:col-span-3 min-[901px]:col-span-1">
            <a href="#top" className="inline-flex items-center gap-[0.7rem]">
              <span
                className="grid size-11 place-items-center rounded-xl border border-line bg-white"
                aria-hidden="true"
              >
                <img src={emblem} alt="" className="size-8 object-contain" />
              </span>
              <span>
                <span className="block font-sans text-[1.3rem] font-normal tracking-[-0.01em] text-white">
                  IRCTC Tourism
                </span>
                <span className="mt-0.5 block font-deva text-[0.76rem] font-normal text-ink-faint">
                  आईआरसीटीसी पर्यटन
                </span>
              </span>
            </a>

            {/* social icon circles — outlined, matching the reference */}
            <ul className="mt-[1.7rem] flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-line text-[1.15rem]
                               text-ink-soft transition-colors duration-250 ease-brand
                               hover:border-white hover:text-white"
                  >
                    <s.Icon />
                  </a>
                </li>
              ))}
            </ul>

            <address className="mt-[1.9rem] text-[1.05rem] font-normal not-italic leading-relaxed text-ink-soft">
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <div className="mt-[1.5rem] flex flex-col gap-[0.7rem] text-[1.05rem] font-normal">
              <a
                href={`mailto:${contact.email}`}
                className="w-fit text-ink transition-colors duration-250 ease-brand hover:text-blue-ink"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.tollFreeRaw}`}
                className="w-fit text-ink transition-colors duration-250 ease-brand hover:text-blue-ink"
              >
                ({contact.tollFree})
              </a>
            </div>
          </div>

          {/* `contents` dissolves this box so the columns become direct items
              of the grid above, while the nav still provides the landmark. */}
          <nav className="contents" aria-label="Footer">
            {footer.columns.map((col) => (
              <div key={col.title}>
                {/* heading: a touch larger than the links, regular weight */}
                <h4 className="mb-[1.1rem] font-sans text-[1.05rem] font-normal tracking-[0.06em] uppercase text-white">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-[0.7rem]">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className={colLink}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* divider line with the Get Started pill sitting on its right end */}
        <div className="mt-[clamp(2rem,3.5vw,3rem)] flex items-center gap-[clamp(1.4rem,3vw,2.5rem)]">
          <div className="h-px flex-1 bg-line" aria-hidden="true" />
          <a
            href="#packages"
            className="shrink-0 rounded-full bg-white px-[1.7rem] py-[0.72rem] text-[0.98rem] font-normal
                       text-[#0e2149] transition-[transform,background] duration-250 ease-brand
                       hover:-translate-y-0.5 hover:bg-white/90"
          >
            Get Started
          </a>
        </div>

        {/* bottom bar: description on the left, legal links on the right */}
        <div className="mt-[clamp(1.6rem,2.8vw,2.3rem)] flex flex-col gap-6 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
          <p className="max-w-[44ch] text-[0.95rem] font-normal leading-relaxed text-ink-faint">
            The official holidays arm of Indian Railways — packages, heritage trains and
            pilgrimage circuits across every state, planned and booked end to end.
          </p>
          <div className="flex flex-wrap items-center gap-x-[1.8rem] gap-y-3 text-[0.9rem] uppercase tracking-[0.06em]">
            <button onClick={openPartPayment} className={legalLink}>
              Part Payment
            </button>
            <a href="#top" className={legalLink}>
              Terms &amp; Conditions
            </a>
            <a href="#top" className={legalLink}>
              Privacy Policy
            </a>
          </div>
        </div>

        <p className="mt-[clamp(1.4rem,2.2vw,1.9rem)] text-[0.82rem] font-normal text-ink-faint">
          © 2026 IRCTC · All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
