import { useUI } from '../context/UI.tsx'
import { usePrefs } from '../context/Prefs.tsx'
import dishaIcon from '../assets/graphic/askdisha-2.png'

/* Bottom-right launcher for the Disha 2.0 trip recommender. Icon only, so the
   accessible name has to come from aria-label. */
export default function DishaFab() {
  const { openDisha } = useUI()
  const { t } = usePrefs()

  return (
    <button
      onClick={openDisha}
      aria-label={t('nav.disha')}
      title={t('nav.disha')}
      className="fixed right-4 bottom-4 z-[150] grid size-[62px] place-items-center overflow-hidden rounded-full
                 bg-white shadow-[0_14px_38px_-14px_rgba(10,15,25,0.45)]
                 transition-[transform,box-shadow] duration-300 ease-brand
                 hover:-translate-y-0.5
                 hover:shadow-[0_20px_44px_-16px_rgba(10,15,25,0.5)]
                 motion-reduce:transition-none motion-reduce:hover:translate-y-0
                 sm:right-[2.4vw] sm:bottom-[2.4vw]"
    >
      {/* full-colour AskDISHA 2.0 badge — fills the button as its own circle */}
      <img src={dishaIcon} alt="" aria-hidden="true" className="size-full object-cover" />
    </button>
  )
}
