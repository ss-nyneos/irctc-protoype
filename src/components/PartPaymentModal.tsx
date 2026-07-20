import './PartPaymentModal.css'
import Modal from './Modal.tsx'
import { useUI } from '../context/UI.tsx'
import { partPayment } from '../data/content.ts'

export default function PartPaymentModal() {
  const { close } = useUI()
  return (
    <Modal title={partPayment.title} eyebrow="Book now, pay later" onClose={close} wide>
      <p className="pp__intro">{partPayment.intro}</p>
      <ul className="pp__rules">
        {partPayment.rules.map((r, i) => (
          <li key={i} className="pp__rule">
            <span className="pp__num">{String(i + 1).padStart(2, '0')}</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <div className="pp__foot">
        For escalations, write to{' '}
        <a href={`mailto:${partPayment.escalation}`}>{partPayment.escalation}</a>.
      </div>
    </Modal>
  )
}
