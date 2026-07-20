import './Footer.css'
import { footer, contact } from '../data/content.ts'
import { useUI } from '../context/UI.tsx'
import { Phone, Mail, ArrowUpRight } from './Icons.tsx'

const strip = [
  '/img/taj-dawn.jpg',
  '/img/kerala-backwaters.jpg',
  '/img/ladakh.jpg',
  '/img/dancer.jpg',
  '/img/goa.jpg',
  '/img/hawa-mahal.jpg',
  '/img/andaman.jpg',
]

export default function Footer() {
  const { openPartPayment } = useUI()
  return (
    <footer className="footer">
      <div className="wrap-wide">
        <div className="footer__main">
          <div className="footer__brand">
            <a href="#top" className="footer__logo">
              <span className="footer__logo-mark" aria-hidden="true">
                <svg viewBox="0 0 40 40" width="34" height="34">
                  <path d="M9 30V18c0-6.1 4.9-11 11-11s11 4.9 11 11v12" fill="none" stroke="var(--blue)" strokeWidth="2.6" strokeLinecap="round" />
                  <circle cx="20" cy="18" r="2.4" fill="var(--navy)" />
                  <rect x="7.5" y="30" width="25" height="2.6" rx="1.3" fill="var(--navy)" />
                </svg>
              </span>
              <span>
                <span className="footer__logo-name">IRCTC Tourism</span>
                <span className="footer__logo-hindi">आईआरसीटीसी पर्यटन</span>
              </span>
            </a>
            <p className="footer__blurb">
              The official holidays arm of Indian Railways — packages, heritage trains
              and pilgrimage circuits across every state.
            </p>
            <div className="footer__contact">
              <a href={`tel:${contact.tollFreeRaw}`}><Phone />{contact.tollFree}</a>
              <a href={`tel:${contact.landline.replace(/\s/g, '')}`}><Phone />{contact.landline}</a>
              <a href={`mailto:${contact.email}`}><Mail />{contact.email}</a>
            </div>
            <ul className="footer__social">
              {footer.social.map((s) => (
                <li key={s}>
                  <a href="#top">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__cols" aria-label="Footer">
            {footer.columns.map((col) => (
              <div className="footer__col" key={col.title}>
                <h4 className="footer__col-title">{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#top">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__partners">
          <span className="footer__partners-label">In association with</span>
          <div className="footer__partners-list">
            {footer.partners.map((p) => (
              <span key={p} className="footer__partner">{p}</span>
            ))}
          </div>
        </div>

        <div className="footer__bar">
          <p className="footer__copy">© 2026 IRCTC · All Rights Reserved.</p>
          <div className="footer__legal">
            <button className="footer__legal-link" onClick={openPartPayment}>
              Part Payment
            </button>
            <a href="#top" className="footer__legal-link">Privacy Policy</a>
            <a href="#top" className="footer__legal-link">Terms &amp; Conditions</a>
            <a href="#top" className="footer__top-link">
              Back to top
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__strip" aria-hidden="true">
        {strip.map((src, i) => (
          <div className="footer__strip-cell" key={i}>
            <img src={src} alt="" className="img-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </footer>
  )
}
