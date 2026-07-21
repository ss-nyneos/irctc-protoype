import { useState, type FormEvent } from 'react'
import Modal from './Modal.tsx'
import { useUI } from '../context/UI.tsx'
import { usePrefs } from '../context/Prefs.tsx'
import { packages, type Package } from '../data/content.ts'
import { Arrow, Star } from './Icons.tsx'

/* ------------------------------------------------------------------
   Disha is a transparent, rules-based recommender: it scores the real
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

const stack = 'flex flex-col gap-[1.1rem]'
const chipBase =
  'rounded-full border px-4 py-[0.55rem] text-[0.9rem] font-semibold transition-all duration-200 ease-brand'
const chipOn = 'border-blue bg-blue text-white'
const chipOff = 'border-line bg-card text-ink-soft hover:border-blue hover:text-black'

export default function AskDisha() {
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
    <Modal title={t('disha.title')} eyebrow="AI trip recommender" onClose={close} wide>
      {!results ? (
        <form className={stack} onSubmit={onSubmit}>
          <p className="-mt-[0.4rem] leading-[1.55] text-ink-soft">{t('disha.sub')}</p>

          <textarea
            className="w-full resize-y rounded-md border-[1.5px] border-line bg-paper px-[1.1rem] py-4
                       font-sans text-base leading-normal text-ink transition-[border-color,box-shadow]
                       duration-250 ease-brand placeholder:text-ink-faint
                       focus:border-blue focus:shadow-[0_0_0_3px_rgba(36,117,238,0.16)] focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('disha.placeholder')}
            rows={3}
          />

          <div className="flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`${chipBase} ${chosen.includes(c.id) ? chipOn : chipOff}`}
                onClick={() => toggleChip(c.id)}
                aria-pressed={chosen.includes(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-[0.55rem] rounded-full bg-blue
                       px-[1.4rem] py-4 text-base font-bold text-white
                       transition-[background,transform] duration-250 ease-brand
                       hover:-translate-y-px hover:bg-blue-deep"
          >
            <Star />
            {t('disha.go')}
          </button>
        </form>
      ) : (
        <div className={stack}>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[1.15rem] font-bold text-black">
              {anyMatch ? t('disha.results') : t('disha.none')}
            </h3>
            <button
              className="text-[0.9rem] font-bold text-blue hover:underline"
              onClick={reset}
            >
              {t('disha.again')}
            </button>
          </div>

          <ul className="flex flex-col gap-[0.7rem]">
            {results.map(({ pkg, reasons }) => (
              <li
                key={pkg.id}
                className="flex flex-wrap items-center gap-4 rounded-md border border-line bg-card
                           p-[0.7rem] transition-[border-color,box-shadow] duration-250 ease-brand
                           hover:border-transparent hover:shadow-md min-[561px]:flex-nowrap"
              >
                <img
                  src={pkg.img}
                  alt={pkg.place}
                  className="size-16 flex-none rounded-sm object-cover min-[561px]:size-[84px]"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[0.78rem] font-bold tracking-[0.04em] uppercase text-blue-ink">
                    {pkg.place}
                  </span>
                  <h4 className="mt-[0.1rem] text-[1.12rem] leading-[1.15] font-bold text-black">
                    {pkg.title}
                  </h4>
                  <p className="mt-[0.2rem] text-[0.86rem] text-ink-soft">
                    {pkg.nights}N · {pkg.days}D — {pkg.route}
                  </p>
                  {reasons.length > 0 && (
                    <p className="mt-[0.35rem] text-[0.84rem] leading-[1.45] text-ink-soft [&_strong]:text-blue-ink">
                      <strong>{t('disha.why')}:</strong> {reasons.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex flex-none flex-col items-end gap-2">
                  <span className="font-bold tabular-nums text-black">{inr(pkg.price)}</span>
                  <a
                    href="#packages"
                    onClick={close}
                    className="grid size-[38px] place-items-center rounded-full bg-blue text-[1.05rem]
                               text-white transition-transform duration-300 ease-brand hover:translate-x-[3px]"
                  >
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
