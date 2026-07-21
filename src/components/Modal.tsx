import { useEffect, useRef, type ReactNode } from 'react'
import { Close } from './Icons.tsx'

interface ModalProps {
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export default function Modal({ title, eyebrow, onClose, children, wide }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center p-[1.2rem]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        className="absolute inset-0 animate-modal-fade bg-[rgba(7,18,40,0.55)] backdrop-blur-[6px] motion-reduce:animate-none"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative max-h-[90dvh] animate-modal-rise overflow-y-auto rounded-xl bg-card
                    p-[clamp(1.6rem,3vw,2.4rem)] shadow-float focus:outline-none
                    motion-reduce:animate-none ${wide ? 'w-[min(620px,100%)]' : 'w-[min(480px,100%)]'}`}
      >
        <button
          className="absolute top-[1.1rem] right-[1.1rem] grid size-10 place-items-center rounded-full
                     bg-paper-2 text-[1.2rem] text-ink transition-all duration-250 ease-brand
                     hover:bg-ink hover:text-paper"
          aria-label="Close"
          onClick={onClose}
        >
          <Close />
        </button>
        <div className="mb-6 pr-10">
          {eyebrow && (
            <span className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-blue-ink">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-[0.4rem] font-sans text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] leading-[1.05] font-medium text-ink">
            {title}
          </h2>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
