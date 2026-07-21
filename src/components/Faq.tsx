import './Faq.css'
import { useState } from 'react'
import { faqs } from '../data/content.ts'
import { Plus, Close } from './Icons.tsx'
import boat from '../assets/explore/boat.svg'
import water from '../assets/faq-water.png'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <div className="faq__head">
          <h2 className="faq__title">
            Frequently Asked <span>Questions</span>
          </h2>
          <p className="faq__sub">Everything worth knowing before you board.</p>
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
                  <div className="faq-item__water" aria-hidden="true">
                    <img src={water} alt="" className="faq-item__water-img" />
                    <img src={boat} alt="" className="faq-item__boat" />
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
