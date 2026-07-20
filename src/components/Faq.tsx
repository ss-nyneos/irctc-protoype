import './Faq.css'
import { useState } from 'react'
import { faqs } from '../data/content.ts'
import { Plus, Close, Compass, Star, Globe, Bed, Key, Train, Ticket } from './Icons.tsx'

const categories = [
  { label: 'Tour Packages', Icon: Compass },
  { label: 'Experiences', Icon: Star },
  { label: 'Destinations', Icon: Globe },
  { label: 'Hotels', Icon: Bed },
  { label: 'Retiring Rooms', Icon: Key },
  { label: 'Heritage Trains', Icon: Train },
  { label: 'Ticketing', Icon: Ticket },
]

export default function Faq() {
  const [open, setOpen] = useState(0)
  const [cat, setCat] = useState(0)

  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <div className="faq__head">
          <h2 className="faq__title">
            Frequently Asked <span>Questions</span>
          </h2>
          <p className="faq__sub">Everything worth knowing before you board.</p>
        </div>

        <div className="faq__cats" role="tablist" aria-label="Help topics">
          {categories.map((c, i) => (
            <button
              key={c.label}
              role="tab"
              aria-selected={cat === i}
              className={`faq-cat ${cat === i ? 'is-active' : ''}`}
              onClick={() => setCat(i)}
            >
              <c.Icon />
              {c.label}
            </button>
          ))}
        </div>

        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                key={f.q}
              >
                {isOpen && (
                  <div className="faq-item__bg" aria-hidden="true">
                    <img src={f.img} alt="" className="img-cover" loading="lazy" />
                    <div className="faq-item__tint" />
                  </div>
                )}
                <button
                  className="faq-item__row"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-item__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq-item__content">
                    <span className="faq-item__q">{f.q}</span>
                    {isOpen && <span className="faq-item__a">{f.a}</span>}
                  </span>
                  <span className="faq-item__btn">{isOpen ? <Close /> : <Plus />}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
