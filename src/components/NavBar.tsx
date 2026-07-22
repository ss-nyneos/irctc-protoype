import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePrefs } from '../context/Prefs.tsx'
import { useUI } from '../context/UI.tsx'
import { useRouter } from '@/router/RouterContext'
import logo from '../assets/irctc-emblem.png'
import accessIcon from '../assets/graphic/log-in.png'
import {
  ChevronR,
  Close,
  Menu,
  ArrowUpRight,
  Arrow,
  Moon,
  Globe,
  Users,
  Compass,
  Star,
  Train,
  Pin,
  Translate,
  TextPlus,
  TextMinus,
  Highlight,
  Senior,
} from './Icons.tsx'

type MenuKind = 'packages' | 'access' | 'space' | null

/* `to` routes to a page; `href` jumps to a section on the current page */
const packageLinks: {
  label: string
  to?: string
  href?: string
  Icon: typeof Compass
}[] = [
  { label: 'All Tour Packages', to: '/packages', Icon: Compass },
  { label: 'Destinations', href: '#destinations', Icon: Pin },
  { label: 'Experiences', href: '#experiences', Icon: Star },
  { label: 'Heritage Trains', href: '#trains', Icon: Train },
  { label: 'Pilgrimage Circuits', href: '#pilgrimage', Icon: Globe },
]

export default function NavBar() {
  const navigate = useNavigate()
  const { go } = useRouter()
  const {
    t,
    theme,
    toggleTheme,
    lang,
    toggleLang,
    incScale,
    decScale,
    canGrow,
    canShrink,
    highlightLinks,
    seniorMode,
    toggleHighlightLinks,
    toggleSeniorMode,
  } = usePrefs()
  const { user, openLogin, openDisha, openPartPayment, signOut } = useUI()
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

  /* leaving for another page: close the menu and start at the top,
     same as the hero's Explore button */
  const goToPage = () => {
    setMenu(null)
    setMobile(false)
    window.scrollTo({ top: 0 })
  }

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
            <button className="nav__disha" onClick={openDisha}>
              {t('nav.disha')}
            </button>

            <button
              className={`nav__icon ${menu === 'access' ? 'is-open' : ''}`}
              onClick={() => toggle('access')}
              aria-expanded={menu === 'access'}
              aria-label={t('nav.access')}
              title={t('nav.access')}
            >
              <img className="nav__icon-img" src={accessIcon} alt="" aria-hidden="true" />
            </button>

            <button
              className="nav__item nav__space"
              type="button"
              onClick={() => {
                setMenu(null)
                setMobile(false)
                go({ name: 'madeforyou' })
                navigate('/personal')
              }}
              aria-label={t('nav.myspace')}
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
            <Link to="/packages" className="panel__lead" onClick={goToPage}>
              <span>Explore the Packages</span>
              <span className="panel__lead-arrow"><Arrow /></span>
            </Link>
            <ul className="panel__rows">
              {packageLinks.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} onClick={goToPage}>
                      <l.Icon />
                      <span>{l.label}</span>
                      <ArrowUpRight className="panel__row-arrow" />
                    </Link>
                  ) : (
                    <a href={l.href} onClick={() => setMenu(null)}>
                      <l.Icon />
                      <span>{l.label}</span>
                      <ArrowUpRight className="panel__row-arrow" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- Accessibility panel ---------- */}
        {menu === 'access' && (
          <div className="panel panel--access">
            <div className="a11y__head">
              <h3 className="a11y__title">Accessibility Controls</h3>
              <button
                className="a11y__close"
                onClick={() => setMenu(null)}
                aria-label="Close accessibility controls"
              >
                <Close />
              </button>
            </div>

            <div className="a11y__grid">
              <button
                className={`a11y__tile${theme === 'dark' ? ' is-on' : ''}`}
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
              >
                <Moon />
                <span>Dark Theme</span>
              </button>

              <button
                className={`a11y__tile${lang === 'hi' ? ' is-on' : ''}`}
                onClick={toggleLang}
                aria-pressed={lang === 'hi'}
              >
                <Translate />
                <span>{lang === 'en' ? 'English' : 'हिंदी'}</span>
              </button>

              <button className="a11y__tile" onClick={incScale} disabled={!canGrow}>
                <TextPlus />
                <span>Text Size Increase</span>
              </button>

              <button className="a11y__tile" onClick={decScale} disabled={!canShrink}>
                <TextMinus />
                <span>Text Size Decrease</span>
              </button>

              <button
                className={`a11y__tile${highlightLinks ? ' is-on' : ''}`}
                onClick={toggleHighlightLinks}
                aria-pressed={highlightLinks}
              >
                <Highlight />
                <span>Highlight Links</span>
              </button>

              <button
                className={`a11y__tile${seniorMode ? ' is-on' : ''}`}
                onClick={toggleSeniorMode}
                aria-pressed={seniorMode}
              >
                <Senior />
                <span>Senior Citizen Mode</span>
              </button>
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
            <button
              type="button"
              onClick={() => {
                setMobile(false)
                go({ name: 'madeforyou' })
                navigate('/personal')
              }}
            >
              {t('nav.myspace')}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
