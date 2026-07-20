import './PackageCard.css'
import type { Package } from '../data/content.ts'
import { ArrowUpRight } from './Icons.tsx'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="pcard reveal">
      <div className="pcard__media">
        <img src={pkg.img} alt={`${pkg.place}, India`} className="pcard__img" loading="lazy" />
      </div>

      <div className="pcard__body">
        <div className="pcard__meta">
          <span>{pkg.place}</span>
          <span>{pkg.nights}N · {pkg.days}D</span>
        </div>
        <h3 className="pcard__title">{pkg.title}</h3>
        <p className="pcard__price">from {inr(pkg.price)}</p>

        <div className="pcard__reveal">
          <p className="pcard__desc">{pkg.desc}</p>
        </div>

        <a href="#packages" className="pcard__more">
          View details
          <ArrowUpRight />
        </a>
      </div>
    </article>
  )
}
