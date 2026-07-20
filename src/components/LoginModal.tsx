import './LoginModal.css'
import { useState, type FormEvent } from 'react'
import Modal from './Modal.tsx'
import { useUI } from '../context/UI.tsx'

type Tab = 'irctc' | 'guest'

export default function LoginModal() {
  const { close, signIn } = useUI()
  const [tab, setTab] = useState<Tab>('irctc')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const next: Record<string, string> = {}
    if (tab === 'irctc') {
      if (!String(fd.get('user') || '').trim()) next.user = 'User Name field is required.'
      if (!String(fd.get('pass') || '').trim()) next.pass = 'Password field is required.'
    } else {
      if (!String(fd.get('email') || '').trim()) next.email = 'Email field is required.'
      if (!String(fd.get('mobile') || '').trim()) next.mobile = 'Mobile Number field is required.'
    }
    setErrors(next)

    if (Object.keys(next).length === 0) {
      const who =
        tab === 'irctc'
          ? String(fd.get('user') || '')
          : String(fd.get('email') || '').split('@')[0]
      signIn(who)
    }
  }

  return (
    <Modal title="Welcome back" eyebrow="Sign in to IRCTC" onClose={close}>
      <div className="login">
        <div className="login__tabs" role="tablist" aria-label="Login type">
          <button
            role="tab"
            aria-selected={tab === 'irctc'}
            className={`login__tab ${tab === 'irctc' ? 'is-active' : ''}`}
            onClick={() => { setTab('irctc'); setErrors({}) }}
          >
            IRCTC Login
          </button>
          <button
            role="tab"
            aria-selected={tab === 'guest'}
            className={`login__tab ${tab === 'guest' ? 'is-active' : ''}`}
            onClick={() => { setTab('guest'); setErrors({}) }}
          >
            Guest User
          </button>
        </div>

        {tab === 'irctc' ? (
          <form className="login__form" onSubmit={submit} noValidate key="irctc">
            <label className={`lfield ${errors.user ? 'has-error' : ''}`}>
              <span>Username</span>
              <input name="user" type="text" placeholder="Your IRCTC username" autoComplete="username" />
              {errors.user && <em>{errors.user}</em>}
            </label>
            <label className={`lfield ${errors.pass ? 'has-error' : ''}`}>
              <span>Password</span>
              <input name="pass" type="password" placeholder="••••••••" autoComplete="current-password" />
              {errors.pass && <em>{errors.pass}</em>}
            </label>
            <div className="login__row">
              <a href="#top" className="login__minor">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn--primary login__submit">Login</button>
            <p className="login__foot">
              Not a member? <a href="https://www.irctc.co.in" target="_blank" rel="noreferrer">Sign up on IRCTC</a>
            </p>
          </form>
        ) : (
          <form className="login__form" onSubmit={submit} noValidate key="guest">
            <label className={`lfield ${errors.email ? 'has-error' : ''}`}>
              <span>Email</span>
              <input name="email" type="email" placeholder="you@email.com" autoComplete="email" />
              {errors.email && <em>{errors.email}</em>}
            </label>
            <label className={`lfield ${errors.mobile ? 'has-error' : ''}`}>
              <span>Mobile number</span>
              <input name="mobile" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
              {errors.mobile && <em>{errors.mobile}</em>}
            </label>
            <button type="submit" className="btn btn--primary login__submit">Login as guest</button>
            <p className="login__foot">Guest bookings are tied to this email and mobile.</p>
          </form>
        )}
      </div>
    </Modal>
  )
}
