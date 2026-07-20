import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { strings, type Lang, type StringKey } from '../data/i18n.ts'

export type Theme = 'light' | 'dark'

const MIN_SCALE = 0.9
const MAX_SCALE = 1.3
const STEP = 0.1

interface PrefsValue {
  theme: Theme
  lang: Lang
  scale: number
  toggleTheme: () => void
  setTheme: (t: Theme) => void
  setLang: (l: Lang) => void
  incScale: () => void
  decScale: () => void
  resetScale: () => void
  canGrow: boolean
  canShrink: boolean
  t: (key: StringKey) => string
}

const PrefsContext = createContext<PrefsValue | null>(null)

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : (JSON.parse(v) as T)
  } catch {
    return fallback
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => read<Theme>('irctc.theme', 'light'))
  const [lang, setLangState] = useState<Lang>(() => read<Lang>('irctc.lang', 'en'))
  const [scale, setScale] = useState<number>(() => read<number>('irctc.scale', 1))

  // Apply theme + text scale to the document root
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('irctc.theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(scale * 100)}%`
    localStorage.setItem('irctc.scale', JSON.stringify(scale))
  }, [scale])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('irctc.lang', JSON.stringify(lang))
  }, [lang])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(
    () => setThemeState((v) => (v === 'light' ? 'dark' : 'light')),
    [],
  )
  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const incScale = useCallback(
    () => setScale((s) => Math.min(MAX_SCALE, +(s + STEP).toFixed(2))),
    [],
  )
  const decScale = useCallback(
    () => setScale((s) => Math.max(MIN_SCALE, +(s - STEP).toFixed(2))),
    [],
  )
  const resetScale = useCallback(() => setScale(1), [])

  const t = useCallback(
    (key: StringKey) => strings[lang][key] ?? strings.en[key] ?? key,
    [lang],
  )

  return (
    <PrefsContext.Provider
      value={{
        theme,
        lang,
        scale,
        setTheme,
        toggleTheme,
        setLang,
        incScale,
        decScale,
        resetScale,
        canGrow: scale < MAX_SCALE,
        canShrink: scale > MIN_SCALE,
        t,
      }}
    >
      {children}
    </PrefsContext.Provider>
  )
}

export function usePrefs(): PrefsValue {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}
