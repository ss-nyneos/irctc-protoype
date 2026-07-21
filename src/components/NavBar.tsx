import './NavBar.css'
import { useEffect, useRef, useState } from 'react'
import { usePrefs } from '../context/Prefs.tsx'
import { useUI } from '../context/UI.tsx'
import logo from '../assets/irctc-logo-full.png'
import {
  ChevronR,
  Close,
  Menu,
  ArrowUpRight,
  Arrow,
  Plus,
  Minus,
  Moon,
  Globe,
  Users,
  Compass,
  Star,
  Train,
  Pin,
} from './Icons.tsx'

type MenuKind = 'packages' | 'access' | 'space' | null

const packageLinks = [
  { label: 'All Tour Packages', href: '#packages', Icon: Compass },
  { label: 'Destinations', href: '#destinations', Icon: Pin },
  { label: 'Experiences', href: '#experiences', Icon: Star },
  { label: 'Heritage Trains', href: '#trains', Icon: Train },
  { label: 'Pilgrimage Circuits', href: '#pilgrimage', Icon: Globe },
]

export default function NavBar() {
  const { t, theme, setTheme, lang, setLang, incScale, decScale, resetScale, scale, canGrow, canShrink } =
    usePrefs()
  const { user, openLogin, openDiksha, openPartPayment, signOut } = useUI()
  const [menu, setMenu] = useState<MenuKind>(null)
  const [mobile, setMobile] = useState(false)
  const [hidden, setHidden] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  // close menus on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(null)
        setMobile(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // hide the pill on scroll down, reveal it on scroll up
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY
        // always show near the top; ignore tiny jitters
        if (y < 80) {
          setHidden(false)
        } else if (Math.abs(delta) > 6) {
          setHidden(delta > 0)
        }
        lastY = y
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // keep the nav visible whenever a menu/sheet is open
  useEffect(() => {
    if (menu || mobile) setHidden(false)
  }, [menu, mobile])

  const toggle = (k: Exclude<MenuKind, null>) => setMenu((m) => (m === k ? null : k))

  return (
    <header className={`nav${hidden ? ' nav--hidden' : ''}`} ref={rootRef}>
      <div className="nav__shell">
        <div className="nav__pill">
          <a href="#top" className="nav__brand" aria-label="IRCTC Tourism home">
            <span className="nav__badge">
              <img src={logo} alt="" />
            </span>
            <span className="nav__word">
              <span className="nav__word-top">
                <em>IRCTC</em> <b>Tourism</b>
              </span>
              <span className="nav__word-sub">भारतीय रेल · Ministry of Railways</span>
            </span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            <button
              className={`nav__item ${menu === 'packages' ? 'is-open' : ''}`}
              onClick={() => toggle('packages')}
              aria-expanded={menu === 'packages'}
            >
              {t('nav.packages')}
              <ChevronR className="nav__chev" />
            </button>
            <a href="#destinations" className="nav__item" onClick={() => setMenu(null)}>
              {t('nav.destinations')}
            </a>
            <a href="#trains" className="nav__item" onClick={() => setMenu(null)}>
              {t('nav.trains')}
            </a>
          </nav>

          <div className="nav__right">
            <button className="nav__diksha" onClick={openDiksha}>
              <span className="nav__diksha-dot" aria-hidden="true" />
              {t('nav.diksha')}
            </button>

            <button
              className={`nav__icon ${menu === 'access' ? 'is-open' : ''}`}
              onClick={() => toggle('access')}
              aria-expanded={menu === 'access'}
              aria-label={t('nav.access')}
              title={t('nav.access')}
            >
              <AccessGlyph />
            </button>

            <button
              className={`nav__item nav__space ${menu === 'space' ? 'is-open' : ''}`}
              onClick={() => toggle('space')}
              aria-expanded={menu === 'space'}
            >
              <Users />
              <span className="nav__space-label">{t('nav.myspace')}</span>
            </button>

            <button
              className="nav__burger"
              onClick={() => setMobile((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobile}
            >
              {mobile ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        {/* ---------- Packages mega panel ---------- */}
        {menu === 'packages' && (
          <div className="panel panel--mega">
            <a href="#packages" className="panel__lead" onClick={() => setMenu(null)}>
              <span>Explore the Packages</span>
              <span className="panel__lead-arrow"><Arrow /></span>
            </a>
            <ul className="panel__rows">
              {packageLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={() => setMenu(null)}>
                    <l.Icon />
                    <span>{l.label}</span>
                    <ArrowUpRight className="panel__row-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- Accessibility panel ---------- */}
        {menu === 'access' && (
          <div className="panel panel--access">
            <div className="a11y__group">
              <span className="a11y__label"><Moon /> {t('a11y.theme')}</span>
              <div className="a11y__seg">
                <button
                  className={theme === 'light' ? 'is-on' : ''}
                  onClick={() => setTheme('light')}
                >
                  {t('a11y.light')}
                </button>
                <button
                  className={theme === 'dark' ? 'is-on' : ''}
                  onClick={() => setTheme('dark')}
                >
                  {t('a11y.dark')}
                </button>
              </div>
            </div>

            <div className="a11y__group">
              <span className="a11y__label"><Globe /> {t('a11y.language')}</span>
              <div className="a11y__seg">
                <button className={lang === 'en' ? 'is-on' : ''} onClick={() => setLang('en')}>
                  English
                </button>
                <button className={lang === 'hi' ? 'is-on' : ''} onClick={() => setLang('hi')}>
                  हिंदी
                </button>
              </div>
            </div>

            <div className="a11y__group">
              <span className="a11y__label">Aa {t('a11y.textsize')}</span>
              <div className="a11y__size">
                <button onClick={decScale} disabled={!canShrink} aria-label={t('a11y.smaller')}>
                  <Minus />
                </button>
                <button className="a11y__size-val" onClick={resetScale} title={t('a11y.reset')}>
                  {Math.round(scale * 100)}%
                </button>
                <button onClick={incScale} disabled={!canGrow} aria-label={t('a11y.larger')}>
                  <Plus />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- My Space panel ---------- */}
        {menu === 'space' && (
          <div className="panel panel--space">
            {user ? (
              <>
                <div className="space__head">
                  <span className="space__avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span>
                    <strong>{t('space.greeting')}, {user.name.split(' ')[0]}</strong>
                    <small>IRCTC member</small>
                  </span>
                </div>
                <ul className="space__list">
                  <li><a href="#top" onClick={() => setMenu(null)}>{t('space.bookings')}<ArrowUpRight /></a></li>
                  <li><a href="#top" onClick={() => setMenu(null)}>{t('space.saved')}<ArrowUpRight /></a></li>
                  <li>
                    <button onClick={() => { setMenu(null); openPartPayment() }}>
                      {t('space.payments')}<ArrowUpRight />
                    </button>
                  </li>
                  <li><a href="#top" onClick={() => setMenu(null)}>{t('space.profile')}<ArrowUpRight /></a></li>
                </ul>
                <button className="space__signout" onClick={() => { signOut(); setMenu(null) }}>
                  {t('space.signout')}
                </button>
              </>
            ) : (
              <>
                <div className="space__head">
                  <span className="space__avatar space__avatar--anon"><Users /></span>
                  <span>
                    <strong>{t('space.title')}</strong>
                    <small>{t('space.signedout')}</small>
                  </span>
                </div>
                <button
                  className="space__cta"
                  onClick={() => { setMenu(null); openLogin() }}
                >
                  {t('space.signin')}
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- Mobile sheet ---------- */}
        {mobile && (
          <div className="panel panel--mobile">
            <a href="#packages" onClick={() => setMobile(false)}>{t('nav.packages')}</a>
            <a href="#destinations" onClick={() => setMobile(false)}>{t('nav.destinations')}</a>
            <a href="#experiences" onClick={() => setMobile(false)}>{t('nav.experiences')}</a>
            <a href="#trains" onClick={() => setMobile(false)}>{t('nav.trains')}</a>
            <a href="#pilgrimage" onClick={() => setMobile(false)}>{t('nav.pilgrimage')}</a>
          </div>
        )}
      </div>
    </header>
  )
}

/* Universal accessibility glyph (person in a circle) */
function AccessGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="7.6" r="1.5" fill="currentColor" />
      <path
        d="M7.4 10.4h9.2M12 10.8v4.2m0 0-2.1 3.6M12 15l2.1 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
