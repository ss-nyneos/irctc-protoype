import type { ReactNode, SVGProps } from 'react'

/* Consistent 24x24 line icons, 1.6 stroke. No emoji anywhere. */
const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

type IconProps = SVGProps<SVGSVGElement>

const wrap = (children: ReactNode, props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" {...props}>
    <g {...S}>{children}</g>
  </svg>
)

export const Arrow = (p: IconProps) =>
  wrap(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>, p)
export const ArrowUpRight = (p: IconProps) =>
  wrap(<><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>, p)
export const Search = (p: IconProps) =>
  wrap(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>, p)
export const Plus = (p: IconProps) => wrap(<><path d="M12 5v14" /><path d="M5 12h14" /></>, p)
export const Minus = (p: IconProps) => wrap(<path d="M5 12h14" />, p)
export const Close = (p: IconProps) =>
  wrap(<><path d="M6 6 18 18" /><path d="M18 6 6 18" /></>, p)
export const Menu = (p: IconProps) =>
  wrap(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>, p)
export const ChevronL = (p: IconProps) => wrap(<path d="m14 6-6 6 6 6" />, p)
export const ChevronR = (p: IconProps) => wrap(<path d="m10 6 6 6-6 6" />, p)
export const Phone = (p: IconProps) =>
  wrap(
    <path d="M6.5 4h3l1.2 3.6-1.8 1.4a11 11 0 0 0 4.6 4.6l1.4-1.8L18 13v3a1.6 1.6 0 0 1-1.7 1.6A13 13 0 0 1 4.4 5.7 1.6 1.6 0 0 1 6 4Z" />,
    p,
  )
export const Mail = (p: IconProps) =>
  wrap(
    <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
    p,
  )
export const Star = (p: IconProps) =>
  wrap(
    <path
      d="M12 4.5 14 9l4.8.5-3.6 3.3 1 4.7L12 15.6 7.8 17.5l1-4.7L5.2 9.5 10 9Z"
      fill="currentColor"
      stroke="none"
    />,
    p,
  )
export const Pin = (p: IconProps) =>
  wrap(
    <>
      <path d="M12 21c4.5-4.2 6.5-7.4 6.5-10.5a6.5 6.5 0 0 0-13 0C5.5 13.6 7.5 16.8 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </>,
    p,
  )
export const Moon = (p: IconProps) =>
  wrap(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />, p)
export const Calendar = (p: IconProps) =>
  wrap(
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.2v3.4" />
      <path d="M16 3.2v3.4" />
    </>,
    p,
  )
export const Users = (p: IconProps) =>
  wrap(
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.8 19c0-3 2.3-5 5.2-5s5.2 2 5.2 5" />
      <path d="M16 5.6a3 3 0 0 1 0 5.8" />
      <path d="M17.5 14.2c2 .5 3.5 2.3 3.5 4.8" />
    </>,
    p,
  )
export const Globe = (p: IconProps) =>
  wrap(
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.8c2.4 2.3 3.6 5.1 3.6 8.2s-1.2 5.9-3.6 8.2c-2.4-2.3-3.6-5.1-3.6-8.2S9.6 6.1 12 3.8Z" />
    </>,
    p,
  )
export const Train = (p: IconProps) =>
  wrap(
    <>
      <rect x="5" y="3.5" width="14" height="13" rx="3" />
      <path d="M5 10h14" />
      <path d="M9 3.5v6" />
      <path d="M15 3.5v6" />
      <circle cx="9" cy="13.2" r="0.7" fill="currentColor" />
      <circle cx="15" cy="13.2" r="0.7" fill="currentColor" />
      <path d="m7.5 17-2 3.5" />
      <path d="m16.5 17 2 3.5" />
    </>,
    p,
  )
export const Ticket = (p: IconProps) =>
  wrap(
    <>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" />
      <path d="M14 6.5v11" strokeDasharray="1.6 1.8" />
    </>,
    p,
  )
export const Quote = (p: IconProps) =>
  wrap(
    <path
      d="M9 6H5.5A2.5 2.5 0 0 0 3 8.5V13h4V8.5H9Zm11 0h-3.5A2.5 2.5 0 0 0 14 8.5V13h4V8.5H20Z"
      fill="currentColor"
      stroke="none"
    />,
    p,
  )

/* ---- Quick-service glyphs ---- */
export const Plane = (p: IconProps) =>
  wrap(<path d="M10.5 13 4 15v-2l5-3.2V4.2a1.3 1.3 0 0 1 2.6 0v5.6L20 13v2l-6.5-2-.6 3.7 2 1.4v1.4l-3.4-1-3.4 1v-1.4l2-1.4Z" />, p)
export const Bed = (p: IconProps) =>
  wrap(<><path d="M3 17v-4a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v3" /><path d="M3 17h18" /><path d="M3 13V7" /><path d="M7 11V9.5A1.5 1.5 0 0 1 8.5 8H12" /></>, p)
export const Bus = (p: IconProps) =>
  wrap(<><rect x="4" y="4" width="16" height="13" rx="2" /><path d="M4 11h16" /><path d="M7 20v-3" /><path d="M17 20v-3" /><circle cx="8" cy="14" r="0.6" fill="currentColor" /><circle cx="16" cy="14" r="0.6" fill="currentColor" /></>, p)
export const Key = (p: IconProps) =>
  wrap(<><circle cx="8" cy="12" r="3.5" /><path d="M11.2 11h9" /><path d="M17 11v3" /><path d="M20 11v2.4" /></>, p)
export const Sofa = (p: IconProps) =>
  wrap(<><path d="M4 13v-2a2 2 0 0 1 2-2h1V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v2" /><path d="M4 13a2 2 0 0 1 2 2v1h12v-1a2 2 0 0 1 2-2v3H4Z" /><path d="M7 18v1.5" /><path d="M17 18v1.5" /></>, p)
export const Compass = (p: IconProps) =>
  wrap(<><circle cx="12" cy="12" r="8" /><path d="m14.8 9.2-1.6 4-4 1.6 1.6-4Z" /></>, p)
export const Heli = (p: IconProps) =>
  wrap(<><path d="M4 6h16" /><path d="M12 6v3" /><path d="M8 12a3 3 0 0 1 3-3h2l4 3v2H9a2 2 0 0 1-2-2Z" /><path d="M10 16h6" /><path d="M17 14v3" /></>, p)
export const Ferry = (p: IconProps) =>
  wrap(<><path d="M4 15h16l-2 4H6Z" /><path d="M6 15V9h9l3 6" /><path d="M11 9V5.5" /><path d="M9 5.5h4" /></>, p)
export const Mountain = (p: IconProps) =>
  wrap(
    <>
      <path d="M2.5 19h19L14.5 6.5 10.4 13.4 8 10Z" />
      <path d="m10.4 13.4 2.1 2.2" />
    </>,
    p,
  )
export const Temple = (p: IconProps) =>
  wrap(
    <>
      <path d="M12 2.6v2.6" />
      <path d="M8.4 8.4 12 5.2l3.6 3.2" />
      <path d="M6.6 12 12 8.2l5.4 3.8" />
      <path d="M5 20.5v-6.2L12 10l7 4.3v6.2" />
      <path d="M3.4 20.5h17.2" />
      <path d="M10.4 20.5v-3.4a1.6 1.6 0 0 1 3.2 0v3.4" />
    </>,
    p,
  )

export const Hotel = (p: IconProps) =>
  wrap(
    <>
      <path d="M5 20.5V4.6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v15.9" />
      <path d="M3.4 20.5h17.2" />
      <path d="M8.4 7.2h2.2M13.4 7.2h2.2" />
      <path d="M8.4 10.7h2.2M13.4 10.7h2.2" />
      <path d="M8.4 14.2h2.2M13.4 14.2h2.2" />
      <path d="M10 20.5v-3h4v3" />
    </>,
    p,
  )
export const Stupa = (p: IconProps) =>
  wrap(
    <>
      <path d="M4 20.5h16" />
      <path d="M6.5 20.5v-2.2h11v2.2" />
      <path d="M7.7 18.3a4.3 4.3 0 0 1 8.6 0" />
      <path d="M12 14V9.1" />
      <path d="M9.8 11.4h4.4" />
      <path d="M10.9 9.1h2.2" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </>,
    p,
  )
export const Trekker = (p: IconProps) =>
  wrap(
    <>
      <circle cx="11" cy="4.6" r="1.7" />
      <path d="M11.4 6.6 9.8 11l-2.3 4.2" />
      <path d="m9.8 11 3.2 1.3 1.1 6.4" />
      <path d="m10.6 8 3.4 1.5" />
      <path d="M15.2 5 13.4 19" />
    </>,
    p,
  )
export const TrainFront = (p: IconProps) =>
  wrap(
    <>
      <path d="M7 18.5V8.5a5 5 0 0 1 10 0v10" />
      <path d="M7 18.5h10" />
      <rect x="8.6" y="7" width="2.9" height="2.6" rx="0.5" />
      <rect x="12.5" y="7" width="2.9" height="2.6" rx="0.5" />
      <circle cx="12" cy="13.2" r="1" />
      <path d="m8.5 21 1.3-2.5" />
      <path d="m15.5 21-1.3-2.5" />
    </>,
    p,
  )
export const Wheel = (p: IconProps) =>
  wrap(
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="1.7" />
      <path d="M12 3.6v3M12 17.4v3M3.6 12h3M17.4 12h3" />
      <path d="m6.05 6.05 2.12 2.12M15.83 15.83l2.12 2.12M17.95 6.05l-2.12 2.12M8.17 15.83l-2.12 2.12" />
    </>,
    p,
  )

export const iconMap: Record<string, (p: IconProps) => ReactNode> = {
  plane: Plane,
  bed: Bed,
  bus: Bus,
  key: Key,
  sofa: Sofa,
  compass: Compass,
  heli: Heli,
  ferry: Ferry,
}
