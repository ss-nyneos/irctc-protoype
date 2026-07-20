import './Modal.css'
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
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal__scrim" aria-label="Close" onClick={onClose} />
      <div className={`modal__panel ${wide ? 'modal__panel--wide' : ''}`} ref={panelRef} tabIndex={-1}>
        <button className="modal__close" aria-label="Close" onClick={onClose}>
          <Close />
        </button>
        <div className="modal__head">
          {eyebrow && <span className="modal__eyebrow">{eyebrow}</span>}
          <h2 className="modal__title">{title}</h2>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
