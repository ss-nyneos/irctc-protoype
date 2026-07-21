import { useUI } from '../context/UI.tsx'
import { usePrefs } from '../context/Prefs.tsx'
import { Lady } from './Icons.tsx'

/* Bottom-right launcher for the Disha 2.0 trip recommender. */
export default function DishaFab() {
  const { openDisha } = useUI()
  const { t } = usePrefs()

  return (
    <button
      onClick={openDisha}
      aria-label={t('nav.disha')}
      className="fixed right-4 bottom-4 z-[150] inline-flex items-center gap-2.5 rounded-full
                 border border-line py-2.5 pr-2.5 pl-2.5 text-[0.95rem] font-semibold whitespace-nowrap
                 text-ink shadow-[0_14px_38px_-14px_rgba(10,15,25,0.45)]
                 backdrop-blur-[18px] backdrop-saturate-[1.3]
                 [background:color-mix(in_srgb,var(--card)_92%,transparent)]
                 transition-[transform,box-shadow,background] duration-300 ease-brand
                 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-16px_rgba(10,15,25,0.5)]
                 motion-reduce:transition-none motion-reduce:hover:translate-y-0
                 sm:right-[2.4vw] sm:bottom-[2.4vw] min-[621px]:pr-[1.1rem]"
    >
      <span
        aria-hidden="true"
        className="grid size-[42px] flex-none place-items-center rounded-full bg-blue text-[1.45rem] text-white"
      >
        <Lady />
      </span>
      <span className="hidden flex-col items-start leading-[1.1] min-[621px]:flex">
        <span>{t('nav.disha')}</span>
        <small className="mt-0.5 text-[0.74rem] font-medium text-ink-soft">{t('disha.fab')}</small>
      </span>
    </button>
  )
}
