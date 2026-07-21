import { useUI } from '../context/UI.tsx'
import LoginModal from './LoginModal.tsx'
import PartPaymentModal from './PartPaymentModal.tsx'
import AskDisha from './AskDisha.tsx'

export default function ModalRoot() {
  const { modal } = useUI()
  if (modal === 'login') return <LoginModal />
  if (modal === 'part-payment') return <PartPaymentModal />
  if (modal === 'disha') return <AskDisha />
  return null
}
