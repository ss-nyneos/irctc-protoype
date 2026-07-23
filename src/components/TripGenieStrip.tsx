import { useRouter } from '@/router/RouterContext'

/* CTA band that sits straight after the hero, before Services.
   Static presentation without float animations or heavy box shadows. */
export default function TripGenieStrip() {
  const { go } = useRouter()

  const openGenie = () => {
    go({ name: 'customise' })
  }

  return (
    <section className="relative bg-paper pt-0 pb-[clamp(2rem,4.5vw,3.2rem)]">
      <div className="wrap relative flex flex-col items-center justify-center gap-[clamp(1rem,2.4vw,1.8rem)] text-center min-[681px]:flex-row min-[681px]:gap-[clamp(1.4rem,3vw,2.6rem)]">
        <p className="font-sans text-[clamp(1.9rem,1.1rem+2.6vw,42px)] font-semibold leading-tight tracking-[-0.02em] text-ink-black">
          Can’t decide where to go <span className="text-blue">next?</span>
        </p>

        <button
          type="button"
          onClick={openGenie}
          className="inline-flex flex-none items-center rounded-full bg-blue px-[clamp(1.5rem,2.2vw,1.9rem)] py-[0.9rem] text-[1.02rem] font-semibold text-white transition-[background] duration-250 ease-brand hover:bg-blue-deep"
        >
          Try our Trip Guide
        </button>
      </div>
    </section>
  )
}
