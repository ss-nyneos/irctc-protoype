import { Phone, Mail } from './Icons.tsx'
import { contact } from '../data/content.ts'
import { useUI } from '../context/UI.tsx'

const item =
  'inline-flex items-center gap-[0.45rem] font-medium tracking-[0.01em] ' +
  'transition-colors duration-250 ease-brand hover:text-ink-black ' +
  '[&_svg]:text-base [&_svg]:text-blue'

const link =
  'font-semibold tracking-[0.01em] text-ink-soft transition-colors duration-250 ease-brand hover:text-ink-black'

const sep = 'h-3.5 w-px flex-none bg-line-strong'

export default function TopBar() {
  const { openPartPayment, openLogin } = useUI()
  return (
    <div className="border-b border-line bg-paper-2 text-[0.82rem] text-ink-soft">
      <div className="wrap-wide flex h-[38px] items-center justify-between gap-4 min-[641px]:h-10">
        <div className="flex items-center gap-[0.9rem]">
          <a href={`tel:${contact.tollFreeRaw}`} className={item}>
            <Phone />
            <span>{contact.tollFree}</span>
          </a>
          <span className={sep} aria-hidden="true" />
          <a
            href={`mailto:${contact.email}`}
            className={`${item} hidden min-[641px]:inline-flex`}
          >
            <Mail />
            <span>{contact.email}</span>
          </a>
        </div>
        <div className="flex items-center gap-[0.9rem]">
          <button className={link} onClick={openPartPayment}>
            Part Payment
          </button>
          <span className={sep} aria-hidden="true" />
          <button
            className={`${link} font-bold text-blue hover:text-blue-deep`}
            onClick={openLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
