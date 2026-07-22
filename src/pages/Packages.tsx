import { useSearchParams, Link } from 'react-router-dom'
import { packages } from '../data/content.ts'
import PackageCard from '../components/PackageCard.tsx'
import { Arrow } from '../components/Icons.tsx'

export default function Packages() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim().toLowerCase()

  const results = q
    ? packages.filter((p) =>
        [p.title, p.place, p.route, p.tag, p.desc]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    : packages

  return (
    /* top padding clears the fixed floating navbar */
    <main className="min-h-dvh bg-paper pt-[clamp(7.5rem,12vw,10rem)] pb-[var(--section-y)]">
      <div className="wrap-wide">
        <Link
          to="/"
          className="mb-[1.6rem] inline-flex items-center gap-2 text-[0.94rem] font-bold text-blue
                     [&_svg]:rotate-180 [&_svg]:transition-transform [&_svg]:duration-300
                     [&_svg]:ease-brand hover:[&_svg]:-translate-x-1"
        >
          <Arrow />
          Back to home
        </Link>

        <header className="mb-[clamp(2rem,4vw,3rem)]">
          <h1 className="h2 [&_span]:text-blue">
            Tour <span>Packages</span>
          </h1>
          <p className="mt-[0.7rem] text-[1.05rem] text-ink-soft [&_strong]:text-ink-black">
            {results.length} {results.length === 1 ? 'journey' : 'journeys'}
            {q && (
              <>
                {' '}
                matching <strong>“{params.get('q')}”</strong>
              </>
            )}
          </p>
        </header>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-[clamp(1rem,1.6vw,1.6rem)] min-[461px]:grid-cols-2 min-[781px]:grid-cols-3 min-[1081px]:grid-cols-4">
            {results.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-[0.8rem] py-[clamp(2rem,5vw,4rem)]">
            <h2 className="text-[clamp(1.3rem,1rem+1vw,1.8rem)]">No journeys matched that search.</h2>
            <p className="text-ink-soft">Try a destination like Kerala, Ladakh or Rajasthan.</p>
            <Link to="/packages" className="btn btn--primary mt-[0.6rem]">
              Show all packages
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
