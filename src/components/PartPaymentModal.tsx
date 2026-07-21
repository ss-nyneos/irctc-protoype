import Modal from './Modal.tsx'
import { useUI } from '../context/UI.tsx'
import { partPayment } from '../data/content.ts'

export default function PartPaymentModal() {
  const { close } = useUI()
  return (
    <Modal title={partPayment.title} eyebrow="Book now, pay later" onClose={close} wide>
      <p className="mb-[1.6rem] max-w-[54ch] leading-relaxed text-ink-soft">{partPayment.intro}</p>
      <ul className="flex flex-col gap-[0.9rem]">
        {partPayment.rules.map((r, i) => (
          <li
            key={i}
            className="flex items-start gap-[0.9rem] border-b border-line pb-[0.9rem] leading-[1.55]
                       text-ink last:border-b-0 last:pb-0"
          >
            <span className="flex-none pt-[0.05rem] font-sans text-base font-semibold tabular-nums text-blue-ink">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <div className="mt-[1.6rem] rounded-sm bg-paper-2 px-[1.2rem] py-4 text-[0.92rem] text-ink-soft">
        For escalations, write to{' '}
        <a
          className="font-semibold text-blue-ink hover:underline"
          href={`mailto:${partPayment.escalation}`}
        >
          {partPayment.escalation}
        </a>
        .
      </div>
    </Modal>
  )
}
