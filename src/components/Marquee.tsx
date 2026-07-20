import './Marquee.css'
import { ecosystem } from '../data/content.ts'

export default function Marquee() {
  const items = [...ecosystem, ...ecosystem]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((label, i) => (
          <span className="marquee__item" key={i}>
            {label}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
