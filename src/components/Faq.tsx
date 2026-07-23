import { useState, useEffect } from 'react'
import { faqs } from '../data/content.ts'
import { Plus, Close } from './Icons.tsx'
import boat from '../assets/explore/boat.svg'
import water from '../assets/faq-water.png'

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false
    return (
      document.documentElement.dataset.theme === 'dark' ||
      document.documentElement.classList.contains('dark')
    )
  })

  useEffect(() => {
    const update = () => {
      const dark =
        document.documentElement.dataset.theme === 'dark' ||
        document.documentElement.classList.contains('dark')
      setIsDark(dark)
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })
    return () => observer.disconnect()
  }, [])

  return isDark
}

export default function Faq() {
  const [open, setOpen] = useState(0)
  const isDark = useIsDarkTheme()

  /* Light Theme Variant (Image 2): Pure white background & card, dark text */
  if (!isDark) {
    return (
      <section className="section bg-white text-[#323232] py-16" id="faq">
        <div className="wrap">
          <div className="mb-[clamp(2.4rem,4vw,3.4rem)] text-center">
            <h2 className="font-sans text-[42px] leading-none font-bold text-[#323232] tracking-[-0.04em]">
              Frequently Asked <span className="text-[#2475EE]">Questions</span>
            </h2>
          </div>

          <div className="mx-auto flex max-w-[920px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {faqs.map((f, i) => {
              const isOpen = open === i
              const divider = !isOpen && i !== faqs.length - 1 && open !== i + 1

              return (
                <div
                  key={f.q}
                  className={`group relative transition-all duration-300 ease-brand ${
                    divider ? 'border-b border-gray-100' : ''
                  } ${isOpen ? '' : 'bg-white hover:bg-gray-50'}`}
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
                      <img
                        src={boat}
                        alt=""
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
                                  ${
                                    isOpen
                                      ? 'text-white [text-shadow:0_2px_12px_rgba(4,40,90,0.5)]'
                                      : 'text-[#323232]'
                                  }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={`flex min-w-0 flex-1 flex-col pt-[0.15rem] ${
                        isOpen ? 'max-w-full min-[701px]:max-w-[66%]' : ''
                      }`}
                    >
                      <span
                        className={`text-faq font-bold transition-colors duration-300 ease-brand
                                    ${
                                      isOpen
                                        ? 'text-white [text-shadow:0_2px_14px_rgba(4,40,90,0.5)]'
                                        : 'text-[#323232]'
                                    }`}
                      >
                        {f.q}
                      </span>
                      {isOpen && (
                        <span className="mt-[0.7rem] max-w-[60ch] text-[0.98rem] leading-relaxed text-white/95 [text-shadow:0_1px_10px_rgba(4,40,90,0.45)]">
                          {f.a}
                        </span>
                      )}
                    </span>

                    <span
                      className={`ml-auto grid size-10 flex-none place-items-center rounded-[11px]
                                  text-[1.2rem] transition-all duration-300 ease-brand
                                  ${
                                    isOpen
                                      ? 'bg-white text-[#2475EE]'
                                      : 'bg-[#2475EE] text-white hover:bg-[#1a5fd0]'
                                  }`}
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

  /* Dark Theme Variant (Image 1): Dark night-navy background & #111527 card, crisp white text */
  return (
    <section className="section bg-[#0a0d18] text-white py-16" id="faq">
      <div className="wrap">
        <div className="mb-[clamp(2.4rem,4vw,3.4rem)] text-center">
          <h2 className="font-sans text-[42px] leading-none font-bold text-white tracking-[-0.04em]">
            Frequently Asked <span className="text-[#2475EE]">Questions</span>
          </h2>
        </div>

        <div className="mx-auto flex max-w-[920px] flex-col overflow-hidden rounded-2xl border border-[#1e2538] bg-[#111527] shadow-2xl">
          {faqs.map((f, i) => {
            const isOpen = open === i
            const divider = !isOpen && i !== faqs.length - 1 && open !== i + 1

            return (
              <div
                key={f.q}
                className={`group relative transition-all duration-300 ease-brand ${
                  divider ? 'border-b border-[#1c2336]' : ''
                } ${isOpen ? '' : 'bg-[#111527] hover:bg-[#181e33]'}`}
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
                    <img
                      src={boat}
                      alt=""
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
                                ${
                                  isOpen
                                    ? 'text-white [text-shadow:0_2px_12px_rgba(4,40,90,0.5)]'
                                    : 'text-white'
                                }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className={`flex min-w-0 flex-1 flex-col pt-[0.15rem] ${
                      isOpen ? 'max-w-full min-[701px]:max-w-[66%]' : ''
                    }`}
                  >
                    <span
                      className={`text-faq font-bold transition-colors duration-300 ease-brand
                                  ${
                                    isOpen
                                      ? 'text-white [text-shadow:0_2px_14px_rgba(4,40,90,0.5)]'
                                      : 'text-white'
                                  }`}
                    >
                      {f.q}
                    </span>
                    {isOpen && (
                      <span className="mt-[0.7rem] max-w-[60ch] text-[0.98rem] leading-relaxed text-white/95 [text-shadow:0_1px_10px_rgba(4,40,90,0.45)]">
                        {f.a}
                      </span>
                    )}
                  </span>

                  <span
                    className={`ml-auto grid size-10 flex-none place-items-center rounded-[11px]
                                text-[1.2rem] transition-all duration-300 ease-brand
                                ${
                                  isOpen
                                    ? 'bg-white text-[#2475EE]'
                                    : 'bg-[#2475EE] text-white hover:bg-[#1a5fd0]'
                                }`}
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
