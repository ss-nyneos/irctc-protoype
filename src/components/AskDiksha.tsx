import './AskDiksha.css'
import { useState, type FormEvent } from 'react'
import Modal from './Modal.tsx'
import { useUI } from '../context/UI.tsx'
import { usePrefs } from '../context/Prefs.tsx'
import { packages, type Package } from '../data/content.ts'
import { Arrow, Star } from './Icons.tsx'

/* ------------------------------------------------------------------
   Diksha is a transparent, rules-based recommender: it scores the real
   package catalogue against the traveller's words and chips. No model
   call — every result is explainable, which is why we show "why this".
   ------------------------------------------------------------------ */

interface Trait {
  id: string
  label: string
  words: string[]
  matches: (p: Package) => boolean
  reason: string
}

const TRAITS: Trait[] = [
  {
    id: 'mountains',
    label: 'Mountains',
    words: ['mountain', 'hill', 'snow', 'cold', 'cool', 'himalaya', 'trek', 'altitude'],
    matches: (p) => ['Hill Escape', 'High Altitude', 'Hill Railway'].includes(p.tag),
    reason: 'high country and cool air',
  },
  {
    id: 'beaches',
    label: 'Beaches',
    words: ['beach', 'sea', 'coast', 'sand', 'sun', 'swim'],
    matches: (p) => ['Beaches', 'Islands'].includes(p.tag),
    reason: 'sand and coastline',
  },
  {
    id: 'islands',
    label: 'Islands',
    words: ['island', 'coral', 'scuba', 'snorkel', 'diving'],
    matches: (p) => p.tag === 'Islands',
    reason: 'island and reef time',
  },
  {
    id: 'backwaters',
    label: 'Backwaters',
    words: ['backwater', 'houseboat', 'green', 'lush', 'kerala', 'boat'],
    matches: (p) => p.tag === 'Backwaters',
    reason: 'green water and slow boats',
  },
  {
    id: 'heritage',
    label: 'Heritage',
    words: ['heritage', 'fort', 'palace', 'history', 'historic', 'culture', 'monument', 'taj'],
    matches: (p) => ['Heritage', 'Classic India'].includes(p.tag),
    reason: 'forts, palaces and monuments',
  },
  {
    id: 'rail',
    label: 'Iconic rail',
    words: ['train', 'rail', 'railway', 'toy train'],
    matches: (p) => p.tag === 'Hill Railway',
    reason: 'a legendary railway line',
  },
  {
    id: 'family',
    label: 'Family trip',
    words: ['family', 'kids', 'children', 'parents'],
    matches: (p) => p.days <= 6,
    reason: 'an easy pace for a family',
  },
  {
    id: 'short',
    label: 'Short break',
    words: ['short', 'weekend', 'quick', 'few days'],
    matches: (p) => p.days <= 5,
    reason: 'short enough for a quick break',
  },
]

interface Scored {
  pkg: Package
  score: number
  reasons: string[]
}

const parseBudget = (q: string): number | null => {
  const cleaned = q.toLowerCase().replace(/,/g, '')
  const m =
    cleaned.match(/(?:under|below|less than|upto|up to|within|budget of|max)\s*₹?\s*(\d+)\s*(k|thousand|lakh)?/) ||
    cleaned.match(/₹\s*(\d+)\s*(k|thousand|lakh)?/)
  if (!m) return null
  let n = parseInt(m[1], 10)
  if (m[2] === 'k' || m[2] === 'thousand') n *= 1000
  if (m[2] === 'lakh') n *= 100000
  return n > 0 ? n : null
}

function recommend(query: string, chosen: string[]): Scored[] {
  const q = query.toLowerCase()
  const budget = parseBudget(q)

  const active = TRAITS.filter(
    (tr) => chosen.includes(tr.id) || tr.words.some((w) => q.includes(w)),
  )

  const scored: Scored[] = packages.map((pkg) => {
    let score = 0
    const reasons: string[] = []

    for (const tr of active) {
      if (tr.matches(pkg)) {
        score += 5
        reasons.push(tr.reason)
      }
    }

    // direct mentions of a place always win
    const place = pkg.place.toLowerCase()
    if (q && (q.includes(place) || place.split(' ').some((w) => w.length > 4 && q.includes(w)))) {
      score += 8
      reasons.unshift(`you named ${pkg.place}`)
    }

    if (budget !== null) {
      if (pkg.price <= budget) {
        score += 4
        reasons.push(`fits under ₹${budget.toLocaleString('en-IN')}`)
      } else {
        score -= 6
      }
    }

    if (chosen.includes('budget')) {
      score += pkg.price <= 25000 ? 4 : -2
      if (pkg.price <= 25000) reasons.push('gentle on the wallet')
    }
    if (chosen.includes('luxury')) {
      score += pkg.price >= 30000 ? 4 : -1
      if (pkg.price >= 30000) reasons.push('a more indulgent trip')
    }

    return { pkg, score, reasons: [...new Set(reasons)] }
  })

  return scored.sort((a, b) => b.score - a.score || a.pkg.price - b.pkg.price).slice(0, 3)
}

const CHIPS = [
  ...TRAITS.map((t) => ({ id: t.id, label: t.label })),
  { id: 'budget', label: 'Budget-friendly' },
  { id: 'luxury', label: 'Something special' },
]

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function AskDiksha() {
  const { close } = useUI()
  const { t } = usePrefs()
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState<string[]>([])
  const [results, setResults] = useState<Scored[] | null>(null)

  const toggleChip = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setResults(recommend(query, chosen))
  }

  const reset = () => {
    setResults(null)
    setQuery('')
    setChosen([])
  }

  const anyMatch = results?.some((r) => r.score > 0)

  return (
    <Modal title={t('diksha.title')} eyebrow="AI trip recommender" onClose={close} wide>
      {!results ? (
        <form className="diksha" onSubmit={onSubmit}>
          <p className="diksha__sub">{t('diksha.sub')}</p>

          <textarea
            className="diksha__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('diksha.placeholder')}
            rows={3}
          />

          <div className="diksha__chips">
            {CHIPS.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`diksha__chip ${chosen.includes(c.id) ? 'is-on' : ''}`}
                onClick={() => toggleChip(c.id)}
                aria-pressed={chosen.includes(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button type="submit" className="diksha__go">
            <Star />
            {t('diksha.go')}
          </button>
        </form>
      ) : (
        <div className="diksha">
          <div className="diksha__resulthead">
            <h3>{anyMatch ? t('diksha.results') : t('diksha.none')}</h3>
            <button className="diksha__again" onClick={reset}>
              {t('diksha.again')}
            </button>
          </div>

          <ul className="diksha__list">
            {results.map(({ pkg, reasons }) => (
              <li key={pkg.id} className="drec">
                <img src={pkg.img} alt={pkg.place} className="drec__img" />
                <div className="drec__body">
                  <span className="drec__place">{pkg.place}</span>
                  <h4 className="drec__title">{pkg.title}</h4>
                  <p className="drec__route">
                    {pkg.nights}N · {pkg.days}D — {pkg.route}
                  </p>
                  {reasons.length > 0 && (
                    <p className="drec__why">
                      <strong>{t('diksha.why')}:</strong> {reasons.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
                <div className="drec__end">
                  <span className="drec__price">{inr(pkg.price)}</span>
                  <a href="#packages" className="drec__cta" onClick={close}>
                    <Arrow />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  )
}
