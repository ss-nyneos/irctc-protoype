import './Packages.css'
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
    <main className="pkgpage">
      <div className="wrap-wide">
        <Link to="/" className="pkgpage__back">
          <Arrow />
          Back to home
        </Link>

        <header className="pkgpage__head">
          <h1 className="h2 pkgpage__title">
            Tour <span>Packages</span>
          </h1>
          <p className="pkgpage__count">
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
          <div className="pkgpage__grid">
            {results.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="pkgpage__empty">
            <h2>No journeys matched that search.</h2>
            <p>Try a destination like Kerala, Ladakh or Rajasthan.</p>
            <Link to="/packages" className="btn btn--primary">
              Show all packages
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
