import './TopBar.css'
import { Phone, Mail } from './Icons.tsx'
import { contact } from '../data/content.ts'
import { useUI } from '../context/UI.tsx'

export default function TopBar() {
  const { openPartPayment, openLogin } = useUI()
  return (
    <div className="topbar">
      <div className="wrap-wide topbar__inner">
        <div className="topbar__contact">
          <a href={`tel:${contact.tollFreeRaw}`} className="topbar__item">
            <Phone />
            <span>{contact.tollFree}</span>
          </a>
          <span className="topbar__sep" aria-hidden="true" />
          <a href={`mailto:${contact.email}`} className="topbar__item topbar__item--mail">
            <Mail />
            <span>{contact.email}</span>
          </a>
        </div>
        <div className="topbar__actions">
          <button className="topbar__link" onClick={openPartPayment}>
            Part Payment
          </button>
          <span className="topbar__sep" aria-hidden="true" />
          <button className="topbar__link topbar__link--login" onClick={openLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
