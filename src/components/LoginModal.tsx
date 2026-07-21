import { useState, type FormEvent } from 'react'
import Modal from './Modal.tsx'
import { useUI } from '../context/UI.tsx'

type Tab = 'irctc' | 'guest'

const tabBase =
  'rounded-full px-4 py-[0.7rem] text-[0.94rem] font-semibold transition-all duration-300 ease-brand'
const tabOn = 'bg-card text-ink shadow-sm'
const tabOff = 'text-ink-soft'

/* label > span (caption), input, em (error) */
const field =
  'flex flex-col gap-[0.4rem] ' +
  '[&>span]:text-[0.82rem] [&>span]:font-semibold [&>span]:text-ink-soft ' +
  '[&>input]:rounded-sm [&>input]:border-[1.5px] [&>input]:border-line [&>input]:bg-paper ' +
  '[&>input]:px-4 [&>input]:py-[0.85rem] [&>input]:text-base ' +
  '[&>input]:transition-[border-color,box-shadow] [&>input]:duration-250 [&>input]:ease-brand ' +
  '[&>input:focus]:border-blue [&>input:focus]:outline-none ' +
  '[&>input:focus]:shadow-[0_0_0_3px_rgba(30,86,199,0.14)] ' +
  '[&>em]:text-[0.8rem] [&>em]:font-semibold [&>em]:not-italic [&>em]:text-[#cc3a2b]'
const fieldError = '[&>input]:border-[#cc3a2b]'

const foot = 'text-center text-[0.9rem] text-ink-soft [&_a]:font-semibold [&_a]:text-blue-ink [&_a]:hover:underline'

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
      <div>
        <div
          className="mb-[1.6rem] grid grid-cols-2 rounded-full bg-paper-2 p-1"
          role="tablist"
          aria-label="Login type"
        >
          <button
            role="tab"
            aria-selected={tab === 'irctc'}
            className={`${tabBase} ${tab === 'irctc' ? tabOn : tabOff}`}
            onClick={() => { setTab('irctc'); setErrors({}) }}
          >
            IRCTC Login
          </button>
          <button
            role="tab"
            aria-selected={tab === 'guest'}
            className={`${tabBase} ${tab === 'guest' ? tabOn : tabOff}`}
            onClick={() => { setTab('guest'); setErrors({}) }}
          >
            Guest User
          </button>
        </div>

        {tab === 'irctc' ? (
          <form className="flex flex-col gap-[1.1rem]" onSubmit={submit} noValidate key="irctc">
            <label className={`${field} ${errors.user ? fieldError : ''}`}>
              <span>Username</span>
              <input name="user" type="text" placeholder="Your IRCTC username" autoComplete="username" />
              {errors.user && <em>{errors.user}</em>}
            </label>
            <label className={`${field} ${errors.pass ? fieldError : ''}`}>
              <span>Password</span>
              <input name="pass" type="password" placeholder="••••••••" autoComplete="current-password" />
              {errors.pass && <em>{errors.pass}</em>}
            </label>
            <div className="-mt-[0.3rem] flex justify-end">
              <a href="#top" className="text-[0.86rem] font-semibold text-blue hover:underline">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="btn btn--primary mt-[0.3rem] justify-center py-[0.95em]">
              Login
            </button>
            <p className={foot}>
              Not a member? <a href="https://www.irctc.co.in" target="_blank" rel="noreferrer">Sign up on IRCTC</a>
            </p>
          </form>
        ) : (
          <form className="flex flex-col gap-[1.1rem]" onSubmit={submit} noValidate key="guest">
            <label className={`${field} ${errors.email ? fieldError : ''}`}>
              <span>Email</span>
              <input name="email" type="email" placeholder="you@email.com" autoComplete="email" />
              {errors.email && <em>{errors.email}</em>}
            </label>
            <label className={`${field} ${errors.mobile ? fieldError : ''}`}>
              <span>Mobile number</span>
              <input name="mobile" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
              {errors.mobile && <em>{errors.mobile}</em>}
            </label>
            <button type="submit" className="btn btn--primary mt-[0.3rem] justify-center py-[0.95em]">
              Login as guest
            </button>
            <p className={foot}>Guest bookings are tied to this email and mobile.</p>
          </form>
        )}
      </div>
    </Modal>
  )
}
