import { useNavigate } from 'react-router-dom'
import { useRouter } from '@/router/RouterContext'

/* Slim CTA band that sits straight after the hero, before Services.
   - The inner row carries [data-parallax], so Design1Layout's generic parallax
     drifts it as you scroll down out of the hero into this strip.
   - Copy and button each float gently (animate-floaty) inside that drift —
     the button is held in the opposite phase (negative delay) so the two
     don't bob in lockstep.
   - The button routes to the same trip-builder as the "Book Now" CTA in the
     Ready-to-Explore section. */
export default function TripGenieStrip() {
  const navigate = useNavigate()
  const { go } = useRouter()

  const openGenie = () => {
    go({ name: 'customise' })
    navigate('/customise')
  }

  return (
    <section className="relative overflow-hidden bg-paper py-[clamp(2rem,4.5vw,3.2rem)]">
      {/* very light wash — a whisper of grey lift plus a faint blue hint, far
          lighter than a solid grey band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(58%_120%_at_50%_50%,rgba(36,117,238,0.06)_0%,transparent_68%),radial-gradient(85%_140%_at_50%_50%,rgba(23,25,31,0.028)_0%,transparent_78%)]"
      />
      <div
        data-parallax="20"
        className="wrap relative flex flex-col items-center justify-center gap-[clamp(1rem,2.4vw,1.8rem)] text-center min-[681px]:flex-row min-[681px]:gap-[clamp(1.4rem,3vw,2.6rem)]"
      >
        <p className="animate-floaty motion-reduce:animate-none font-sans text-[clamp(1.9rem,1.1rem+2.6vw,42px)] font-semibold leading-tight tracking-[-0.02em] text-ink-black">
          Can’t decide where to go <span className="text-blue">next?</span>
        </p>

        <button
          type="button"
          onClick={openGenie}
          style={{ animationDelay: '-3s' }} /* opposite float phase to the copy */
          className="animate-floaty motion-reduce:animate-none
                     inline-flex flex-none items-center rounded-full bg-blue
                     px-[clamp(1.5rem,2.2vw,1.9rem)] py-[0.9rem] text-[1.02rem] font-semibold text-white
                     shadow-[0_10px_24px_-14px_rgba(36,117,238,0.7)]
                     transition-[background] duration-250 ease-brand hover:bg-blue-deep"
        >
          Try our Trip Genie
        </button>
      </div>
    </section>
  )
}
