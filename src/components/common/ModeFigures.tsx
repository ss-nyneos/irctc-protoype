interface FigureProps {
  size?: number;
  className?: string;
}

function Bust({ shirtClass }: { shirtClass: string }) {
  return (
    <>
      <path d="M28 100c0-18 14-30 32-30s32 12 32 30v6H28v-6Z" className={shirtClass} />
      <circle cx="60" cy="42" r="18" className="fill-amber-200" />
      <path
        d="M42 40a18 18 0 0 1 36 0c0-1 0-2-1-3-3-9-12-15-17-15s-14 6-17 15c-1 1-1 2-1 3Z"
        className="fill-stone-800"
      />
    </>
  );
}

/** A traveller beside a globe with a magnifying glass — browsing the existing IRCTC catalog. */
export function WorldFigure({ size = 96, className = "" }: FigureProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="56" className="fill-azure/10" />
      <Bust shirtClass="fill-azure" />

      <rect x="16" y="90" width="22" height="15" rx="3" className="fill-amber-400" />
      <path d="M23 90v-3a4 4 0 0 1 8 0v3" className="stroke-amber-800" strokeWidth="2" fill="none" />

      <circle cx="86" cy="42" r="17" className="fill-white stroke-navy" strokeWidth="2" />
      <ellipse cx="86" cy="42" rx="6.5" ry="17" fill="none" className="stroke-navy" strokeWidth="1.4" />
      <path d="M69 42h34" className="stroke-navy" strokeWidth="1.4" />
      <path d="M71.5 32c3 3 27 3 29 0" fill="none" className="stroke-navy" strokeWidth="1.4" />
      <path d="M71.5 52c3-3 27-3 29 0" fill="none" className="stroke-navy" strokeWidth="1.4" />

      <g transform="translate(5 -4)">
        <circle cx="97" cy="24" r="7" className="fill-white stroke-royal" strokeWidth="2.5" />
        <line x1="102" y1="29" x2="108" y2="35" className="stroke-royal" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A traveller with a route card — pinning a start & end point, AI sparkle above. */
export function CustomizedFigure({ size = 96, className = "" }: FigureProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="56" className="fill-royal/10" />
      <Bust shirtClass="fill-royal" />

      <rect x="76" y="58" width="36" height="32" rx="5" className="fill-white stroke-navy" strokeWidth="2" />
      <path
        d="M84 84 96 70"
        className="stroke-royal"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="1 5"
      />
      <circle cx="84" cy="84" r="3.2" className="fill-navy" />
      <circle cx="104" cy="66" r="3.6" className="fill-rose-500" />
      <path d="M104 62.5c2 0 3.6 1.6 3.6 3.5 0 2.4-3.6 6-3.6 6s-3.6-3.6-3.6-6c0-1.9 1.6-3.5 3.6-3.5Z" className="fill-rose-500" />

      <path
        d="M92 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"
        className="fill-amber-400"
      />
      <path d="M104 34l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" className="fill-amber-400" />
    </svg>
  );
}

/** A traveller framed like a profile portrait, with a fanned stack of trip photos. */
export function PersonalizedFigure({ size = 96, className = "" }: FigureProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="56" className="fill-rose-400/10" />
      <circle cx="60" cy="58" r="38" fill="none" className="stroke-royal" strokeWidth="2" strokeDasharray="2 6" />
      <Bust shirtClass="fill-rose-400" />

      <g transform="rotate(-10 88 84)">
        <rect x="78" y="74" width="20" height="20" rx="2.5" className="fill-white stroke-navy" strokeWidth="1.6" />
        <rect x="81" y="77" width="14" height="10" rx="1" className="fill-azure/40" />
      </g>
      <g transform="rotate(8 100 76)">
        <rect x="92" y="66" width="18" height="18" rx="2.5" className="fill-white stroke-navy" strokeWidth="1.6" />
        <rect x="94.5" y="68.5" width="13" height="9" rx="1" className="fill-amber-400/50" />
      </g>

      <path
        d="M88 30c1.6-3 6.4-3 8 0 1.6-3 6.4-3 8 0 1.6 3 0 6-8 11-8-5-9.6-8-8-11Z"
        className="fill-rose-500"
      />
    </svg>
  );
}
