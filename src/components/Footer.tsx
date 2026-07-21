import { footer, contact } from '../data/content.ts'
import { useUI } from '../context/UI.tsx'
import { Phone, Mail, ArrowUpRight } from './Icons.tsx'

/* The footer re-maps the palette to light so every child reads on navy.
   Because tailwind.css declares the theme with `@theme inline`, utilities
   like `text-ink-soft` resolve through these same variables — so overriding
   them here re-themes the utilities too, exactly as it did the old CSS. */
const palette =
  '[--ink:#ffffff] [--ink-soft:rgba(255,255,255,0.72)] [--ink-faint:rgba(255,255,255,0.5)] ' +
  '[--black:#ffffff] [--blue:#7ba6ff] [--blue-ink:#9dc0ff] [--line:rgba(255,255,255,0.16)]'

const contactLink =
  'inline-flex w-fit items-center gap-[0.55rem] font-semibold text-ink transition-colors ' +
  'duration-250 ease-brand hover:text-blue-ink [&_svg]:text-[1.1rem] [&_svg]:text-blue'

const colLink =
  'text-[0.94rem] text-ink-soft transition-[color,padding-left] duration-250 ease-brand ' +
  'hover:pl-1 hover:text-black'

const legalLink = 'text-[0.88rem] text-ink-soft transition-colors duration-250 ease-brand hover:text-black'

export default function Footer() {
  const { openPartPayment } = useUI()
  return (
    <footer className={`bg-[#0e2149] py-0 text-ink-soft ${palette}`}>
      <div className="wrap-wide pt-[clamp(3.2rem,5.5vw,5rem)] pb-[clamp(2.4rem,4vw,3.5rem)]">
        <div className="grid grid-cols-1 gap-[clamp(2.5rem,5vw,5rem)] min-[901px]:grid-cols-[1.05fr_2fr]">
          <div>
            <a href="#top" className="inline-flex items-center gap-[0.7rem]">
              <span
                className="grid size-11 place-items-center rounded-xl border border-line bg-card"
                aria-hidden="true"
              >
                <svg viewBox="0 0 40 40" width="34" height="34">
                  <path d="M9 30V18c0-6.1 4.9-11 11-11s11 4.9 11 11v12" fill="none" stroke="var(--blue)" strokeWidth="2.6" strokeLinecap="round" />
                  <circle cx="20" cy="18" r="2.4" fill="var(--navy)" />
                  <rect x="7.5" y="30" width="25" height="2.6" rx="1.3" fill="var(--navy)" />
                </svg>
              </span>
              <span>
                <span className="block font-sans text-[1.24rem] font-bold tracking-[-0.01em] text-black">
                  IRCTC Tourism
                </span>
                <span className="mt-0.5 block font-deva text-[0.74rem] text-ink-faint">
                  आईआरसीटीसी पर्यटन
                </span>
              </span>
            </a>
            <p className="mt-[1.4rem] max-w-[38ch] leading-relaxed text-ink-soft">
              The official holidays arm of Indian Railways — packages, heritage trains
              and pilgrimage circuits across every state.
            </p>
            <div className="mt-[1.6rem] flex flex-col gap-[0.65rem]">
              <a href={`tel:${contact.tollFreeRaw}`} className={contactLink}><Phone />{contact.tollFree}</a>
              <a href={`tel:${contact.landline.replace(/\s/g, '')}`} className={contactLink}><Phone />{contact.landline}</a>
              <a href={`mailto:${contact.email}`} className={contactLink}><Mail />{contact.email}</a>
            </div>
            <ul className="mt-[1.8rem] flex flex-wrap gap-x-[1.2rem] gap-y-2">
              {footer.social.map((s) => (
                <li key={s}>
                  <a
                    href="#top"
                    className="text-[0.9rem] font-medium text-ink-soft transition-colors duration-250 ease-brand hover:text-black"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-[1.2rem] gap-y-[1.6rem] min-[561px]:grid-cols-3 min-[901px]:grid-cols-5"
            aria-label="Footer"
          >
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-[1.1rem] font-sans text-[0.76rem] font-bold tracking-[0.1em] uppercase text-blue-ink">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-[0.7rem]">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className={colLink}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-[clamp(3rem,5vw,4.5rem)] flex flex-wrap items-center gap-x-[1.6rem] gap-y-4 border-t border-line pt-8">
          <span className="text-[0.78rem] font-semibold tracking-[0.08em] uppercase text-ink-faint">
            In association with
          </span>
          <div className="flex flex-wrap gap-x-[1.4rem] gap-y-[0.8rem]">
            {footer.partners.map((p) => (
              <span key={p} className="font-sans text-base font-bold tracking-[-0.01em] text-ink">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-[2.4rem] flex flex-wrap items-center justify-between gap-4 border-t border-line pt-[1.6rem]">
          <p className="text-[0.88rem] text-ink-faint">© 2026 IRCTC · All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-[1.4rem]">
            <button className={legalLink} onClick={openPartPayment}>
              Part Payment
            </button>
            <a href="#top" className={legalLink}>Privacy Policy</a>
            <a href="#top" className={legalLink}>Terms &amp; Conditions</a>
            <a
              href="#top"
              className="inline-flex items-center gap-[0.4rem] text-[0.88rem] font-bold text-blue
                         [&_svg]:transition-transform [&_svg]:duration-[350ms] [&_svg]:ease-brand
                         hover:[&_svg]:translate-x-[3px] hover:[&_svg]:-translate-y-[3px]"
            >
              Back to top
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
