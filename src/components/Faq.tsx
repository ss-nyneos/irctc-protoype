import { useState } from 'react'
import { faqs } from '../data/content.ts'
import { Plus, Close } from './Icons.tsx'
import boat from '../assets/explore/boat.svg'
import water from '../assets/faq-water.png'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section bg-paper" id="faq">
      <div className="wrap">
        <div className="mb-[clamp(2.4rem,4vw,3.4rem)] text-center">
          <h2 className="h2 font-sans text-[42px] leading-none font-bold text-ink-black [&_span]:text-blue">
            Frequently Asked <span>Questions</span>
          </h2>
          {/* <p className="mt-[0.7rem] text-[1.05rem] text-ink-soft">
            Everything worth knowing before you board.
          </p> */}
        </div>

        {/* one continuous frame housing every row */}
        <div className="mx-auto flex max-w-[920px] flex-col overflow-hidden rounded-lg border border-line bg-card shadow-md">
          {faqs.map((f, i) => {
            const isOpen = open === i
            /* hairline divider between closed rows only: the open row's own
               colour acts as the divider, so neither it nor the row above
               it draws a border. (Was a `:has(+ .is-open)` rule; the open
               index is known here, so it's just arithmetic.) */
            const divider = !isOpen && i !== faqs.length - 1 && open !== i + 1

            return (
              <div
                key={f.q}
                className={`group relative transition-[background] duration-300 ease-brand
                            ${divider ? 'border-b border-line' : ''}
                            ${isOpen ? '' : 'hover:bg-paper-2'}`}
              >
                {isOpen && (
                  <div
                    className="absolute inset-0 z-0 overflow-hidden bg-[#12869b]
                               after:absolute after:inset-0 after:content-['']
                               after:bg-[linear-gradient(100deg,rgba(5,45,110,0.74)_0%,rgba(8,70,140,0.52)_42%,rgba(10,90,150,0.12)_72%,rgba(10,90,150,0)_100%)]"
                    aria-hidden="true"
                  >
                    <img
                      src={water}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    {/* pinned to the right edge and bleeding off it; the card
                        clips whatever runs past. Dropped below 700px where it
                        would collide with the copy. */}
                    <img
                      src={boat}
                      alt=""
                      /* The lateral flip lives in the keyframes, NOT in a
                         `-scale-x-100` utility: Tailwind v4's scale utilities
                         set the standalone `scale` property, which would
                         compose with the keyframes' own scaleX(-1) and cancel
                         it out. motion-reduce keeps the flip without the bob. */
                      className="absolute right-[-2%] bottom-[3%] z-[1] hidden h-[92%] w-auto
                                 animate-faq-boat-bob min-[701px]:block
                                 motion-reduce:animate-none motion-reduce:[transform:scaleX(-1)]"
                    />
                  </div>
                )}
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className={`relative z-[1] flex w-full items-start gap-[clamp(1rem,3vw,2.2rem)]
                              px-[clamp(1.2rem,2.5vw,2rem)] text-left
                              ${
                                isOpen
                                  ? 'py-[clamp(1.1rem,1.8vw,1.6rem)] min-[561px]:min-h-[clamp(200px,22vw,250px)]'
                                  : 'py-[clamp(1.15rem,2.2vw,1.7rem)]'
                              }`}
                >
                  <span
                    className={`w-auto flex-none text-[clamp(1.3rem,1rem+1vw,1.7rem)] leading-tight
                                font-bold tabular-nums transition-colors duration-300 ease-brand
                                min-[561px]:w-[2.4ch]
                                ${isOpen ? 'text-white [text-shadow:0_2px_12px_rgba(4,40,90,0.5)]' : 'text-ink-black dark:text-white'}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* keep the open row's copy clear of the boat on the right */}
                  <span
                    className={`flex min-w-0 flex-1 flex-col pt-[0.15rem] ${
                      isOpen ? 'max-w-full min-[701px]:max-w-[66%]' : ''
                    }`}
                  >
                    <span
                      className={`text-faq transition-colors duration-300 ease-brand
                                  ${isOpen ? 'text-white [text-shadow:0_2px_14px_rgba(4,40,90,0.5)]' : 'text-ink-black dark:text-white'}`}
                    >
                      {f.q}
                    </span>
                    {isOpen && (
                      <span className="mt-[0.7rem] max-w-[60ch] text-[0.98rem] leading-relaxed text-white/95 [text-shadow:0_1px_10px_rgba(4,40,90,0.45)]">
                        {f.a}
                      </span>
                    )}
                  </span>
                  {/* always pinned to the far right of the row */}
                  <span
                    className={`ml-auto grid size-10 flex-none place-items-center rounded-[11px]
                                text-[1.2rem] transition-all duration-300 ease-brand
                                ${isOpen ? 'bg-white text-blue' : 'bg-blue text-white group-hover:bg-blue-deep'}`}
                  >
                    {isOpen ? <Close /> : <Plus />}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
