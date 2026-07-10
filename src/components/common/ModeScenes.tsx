interface SceneProps {
  className?: string;
}

/** Small teardrop location pin with a white centre. */
function Pin({ x, y, className }: { x: number; y: number; className: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0c-6 0-11 5-11 11 0 8 11 20 11 20s11-12 11-20c0-6-5-11-11-11Z" className={className} />
      <circle cx="0" cy="11" r="4" className="fill-white" />
    </g>
  );
}

/**
 * Flat travel illustrations for the "three ways" cards. Cohesive line-and-fill
 * style: navy linework, brand/azure surfaces, warm amber & coral accents.
 * Landscape 240×150 viewBox, sized by the parent card's header band.
 */

/** Explore & compare — a globe under a magnifier, orbited by a plane. */
export function WorldScene({ className = "" }: SceneProps) {
  return (
    <svg viewBox="0 0 240 150" fill="none" className={className} aria-hidden="true">
      <ellipse cx="116" cy="82" rx="90" ry="42" transform="rotate(-15 116 82)" className="stroke-azure/50" strokeWidth="2" strokeDasharray="2 8" />
      <circle cx="108" cy="84" r="46" className="fill-azure/15 stroke-navy" strokeWidth="2.4" />
      <path d="M84 58c9-4 21-2 23 5s-7 12-3 18-14 10-23 4-6-22 3-27Z" className="fill-brand" />
      <path d="M118 96c6-2 17 0 19 6s-9 12-17 10-8-14-2-16Z" className="fill-brand/75" />
      <ellipse cx="108" cy="84" rx="46" ry="16" fill="none" className="stroke-navy/40" strokeWidth="1.3" />
      <ellipse cx="108" cy="84" rx="17" ry="46" fill="none" className="stroke-navy/40" strokeWidth="1.3" />
      <Pin x={94} y={40} className="fill-amber-400" />
      <Pin x={138} y={60} className="fill-rose-400" />
      <g transform="rotate(30 196 44)">
        <path d="M188 44l18-6-5 6 5 6-18-6Z" className="fill-navy" />
      </g>
      <g transform="translate(150 106)">
        <circle cx="0" cy="0" r="21" className="fill-white stroke-navy" strokeWidth="2.6" />
        <circle cx="0" cy="0" r="21" className="fill-brand/10" />
        <path d="M-9 -1a9 9 0 0 1 9-8" className="stroke-white" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <line x1="15" y1="15" x2="31" y2="31" className="stroke-navy" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <path d="M28 38c0-6 6-10 11-8 2-5 11-5 13 0 6-1 10 3 9 8Z" className="fill-white" />
    </svg>
  );
}

/** Built around your trip — a folded map with a plotted route and a little train. */
export function CustomScene({ className = "" }: SceneProps) {
  return (
    <svg viewBox="0 0 240 150" fill="none" className={className} aria-hidden="true">
      <g transform="rotate(-3 120 78)">
        <rect x="42" y="28" width="158" height="98" rx="11" className="fill-white stroke-navy" strokeWidth="2.4" />
        <path d="M54 96c16-11 30-6 42 2s26 6 42-3v34H54Z" className="fill-emerald-300/40" />
        <path d="M60 58c11-5 19 2 31 0s20-8 31-2" className="stroke-azure/60" strokeWidth="3" fill="none" strokeLinecap="round" />
        <line x1="95" y1="28" x2="95" y2="126" className="stroke-navy/10" strokeWidth="1.6" />
        <line x1="148" y1="28" x2="148" y2="126" className="stroke-navy/10" strokeWidth="1.6" />
        <path d="M68 106 Q88 66 122 80 T178 54" className="stroke-brand" strokeWidth="2.8" strokeDasharray="1 7" strokeLinecap="round" fill="none" />
        <circle cx="68" cy="106" r="4.5" className="fill-navy" />
        <circle cx="68" cy="106" r="9.5" fill="none" className="stroke-navy/30" strokeWidth="2" />
        <g transform="translate(114 72) rotate(-9)">
          <rect x="-17" y="-10" width="34" height="20" rx="6" className="fill-brand" />
          <rect x="-13" y="-6" width="10" height="9" rx="2" className="fill-white" />
          <rect x="1" y="-6" width="10" height="9" rx="2" className="fill-white" />
          <circle cx="-9" cy="12" r="2.8" className="fill-navy" />
          <circle cx="9" cy="12" r="2.8" className="fill-navy" />
        </g>
      </g>
      <Pin x={182} y={40} className="fill-rose-400" />
      <path d="M208 74l3 7.5 7.5 3-7.5 3-3 7.5-3-7.5-7.5-3 7.5-3 3-7.5Z" className="fill-amber-400" />
      <path d="M198 98l1.7 4.2 4.2 1.7-4.2 1.7-1.7 4.2-1.7-4.2-4.2-1.7 4.2-1.7 1.7-4.2Z" className="fill-amber-400" />
    </svg>
  );
}

/** Personalized — a profile card with a fanned photo diary and a favourite heart. */
export function PersonalScene({ className = "" }: SceneProps) {
  return (
    <svg viewBox="0 0 240 150" fill="none" className={className} aria-hidden="true">
      <g transform="rotate(-14 80 84)">
        <rect x="52" y="52" width="60" height="60" rx="8" className="fill-white stroke-navy" strokeWidth="2" />
        <rect x="58" y="58" width="48" height="34" rx="3" className="fill-azure/40" />
        <path d="M58 92l15-15 10 8 8-6 15 13v0H58Z" className="fill-emerald-300/70" />
        <circle cx="95" cy="70" r="5" className="fill-amber-400" />
      </g>
      <g transform="rotate(11 152 76)">
        <rect x="122" y="46" width="60" height="60" rx="8" className="fill-white stroke-navy" strokeWidth="2" />
        <rect x="128" y="52" width="48" height="34" rx="3" className="fill-brand/25" />
        <path d="M128 86l13-13 9 7 21-17 5 4v19H128Z" className="fill-emerald-300/70" />
      </g>
      <rect x="84" y="70" width="74" height="58" rx="10" className="fill-white stroke-navy" strokeWidth="2.4" />
      <circle cx="105" cy="93" r="13" className="fill-azure/20 stroke-navy" strokeWidth="1.8" />
      <circle cx="105" cy="90" r="5.5" className="fill-amber-300" />
      <path d="M97 101c1.5-5.5 14.5-5.5 16 0Z" className="fill-brand" />
      <rect x="126" y="86" width="26" height="5.5" rx="2.75" className="fill-navy/70" />
      <rect x="126" y="96" width="18" height="4.5" rx="2.25" className="fill-navy/25" />
      <circle cx="99" cy="118" r="4" className="fill-brand" />
      <circle cx="112" cy="118" r="4" className="fill-azure" />
      <circle cx="125" cy="118" r="4" className="fill-amber-400" />
      <g transform="translate(150 64)">
        <circle cx="0" cy="0" r="12.5" className="fill-white stroke-navy" strokeWidth="2" />
        <path d="M0 6.5c-5.5-3.7-8.5-6.3-8.5-9.4a4.2 4.2 0 0 1 8.5-1 4.2 4.2 0 0 1 8.5 1c0 3.1-3 5.7-8.5 9.4Z" className="fill-rose-400" />
      </g>
      <path d="M70 42l2.2 5.4 5.4 2.2-5.4 2.2-2.2 5.4-2.2-5.4-5.4-2.2 5.4-2.2 2.2-5.4Z" className="fill-amber-400" />
    </svg>
  );
}
