import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

type ModalKind = 'login' | 'part-payment' | 'diksha' | null

export interface User {
  name: string
}

interface UIContextValue {
  modal: ModalKind
  user: User | null
  openLogin: () => void
  openPartPayment: () => void
  openDiksha: () => void
  close: () => void
  signIn: (name: string) => void
  signOut: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalKind>(null)
  const [user, setUser] = useState<User | null>(null)

  const openLogin = useCallback(() => setModal('login'), [])
  const openPartPayment = useCallback(() => setModal('part-payment'), [])
  const openDiksha = useCallback(() => setModal('diksha'), [])
  const close = useCallback(() => setModal(null), [])
  const signIn = useCallback((name: string) => {
    setUser({ name })
    setModal(null)
  }, [])
  const signOut = useCallback(() => setUser(null), [])

  return (
    <UIContext.Provider
      value={{ modal, user, openLogin, openPartPayment, openDiksha, close, signIn, signOut }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
