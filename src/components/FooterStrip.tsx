import './FooterStrip.css'
import stripImg from '../assets/footer-strip.png'

export default function FooterStrip() {
  return (
    <div className="footer-strip" aria-hidden="true">
      <img src={stripImg} alt="" className="footer-strip__img" loading="lazy" />
    </div>
  )
}
