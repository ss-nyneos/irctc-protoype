import type { SVGProps } from "react";

/**
 * Hand-drawn line-icon set matching the reference "Our Services" board: navy
 * outline strokes with a repeated amber accent (stars, ribbon, flag, backpack…)
 * so every tile reads as one consistent family instead of a mixed icon pack.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const AMBER = "#eea23a";

function Icon({ size = 32, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...base} {...rest}>
      {children}
    </svg>
  );
}

export function FlightsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M27 6 8 22.5l9.2 2.4M27 6 20.6 27l-3.4-2.6M27 6 17.2 24.4M27 6l14.5 20-9-1.8" />
      <path d="M17.2 24.4 14 34l3.6-1.2 1.4-3.6" />
    </Icon>
  );
}

export function HotelsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <g stroke="none" fill={AMBER}>
        <path d="M14.4 8.6 15.4 11 17.8 11.3 16 12.9 16.5 15.3 14.4 14.1 12.3 15.3 12.8 12.9 11 11.3 13.4 11Z" />
        <path d="M20.8 6.6 21.8 9 24.2 9.3 22.4 10.9 22.9 13.3 20.8 12.1 18.7 13.3 19.2 10.9 17.4 9.3 19.8 9Z" />
        <path d="M27.2 6.6 28.2 9 30.6 9.3 28.8 10.9 29.3 13.3 27.2 12.1 25.1 13.3 25.6 10.9 23.8 9.3 26.2 9Z" />
        <path d="M33.6 8.6 34.6 11 37 11.3 35.2 12.9 35.7 15.3 33.6 14.1 31.5 15.3 32 12.9 30.2 11.3 32.6 11Z" />
      </g>
      <path d="M9 41V19h30v22M9 41h30M13 41v-6h6v6M29 41v-6h6v6" />
      <path d="M16 24h4M22 24h4M28 24h4M16 30h4M22 30h4M28 30h4" />
    </Icon>
  );
}

export function BusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 30V15a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v15" />
      <path d="M8 30h26M9 30v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4M29 30v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" />
      <rect x="11" y="15" width="8" height="6" rx="1" />
      <rect x="21" y="15" width="8" height="6" rx="1" />
      <circle cx="14" cy="34" r="2.4" />
      <circle cx="28" cy="34" r="2.4" />
    </Icon>
  );
}

export function RetiringRoomIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 36V13M7 36h34M41 36v-9a4 4 0 0 0-4-4H20v13" />
      <rect x="9" y="21" width="9" height="6" rx="2" fill={AMBER} stroke={AMBER} />
      <path d="M9 27h28" />
    </Icon>
  );
}

export function LoungeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 26v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
      <path d="M8 26h18v6a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-6Z" />
      <path d="M9 34v-2M25 34v-2" />
      <path d="M34 12v22M34 34h-4M34 34h4" />
      <path d="M27 12h14l-4 7H31Z" fill={AMBER} stroke={AMBER} />
    </Icon>
  );
}

export function TourPackagesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 18 24 11l15 7-15 7Z" />
      <path d="M9 18v14l15 7 15-7V18M24 25v13" />
      <path d="M17 14.5 32 21.5" stroke={AMBER} />
      <path d="M35 8 39 12M39 8 35 12" stroke={AMBER} />
    </Icon>
  );
}

export function BharatGauravIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="10" y="10" width="28" height="21" rx="6" />
      <path d="M10 20h28" />
      <circle cx="17" cy="15" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="31" cy="15" r="1.6" fill="currentColor" stroke="none" />
      <path d="M15 37 18 31M33 37 30 31" />
      <path d="M16 41h16" stroke={AMBER} />
    </Icon>
  );
}

export function BuddhistTrainIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 17 24 7l16 10" />
      <path d="M9 17v20h30V17" />
      <path d="M14 37V21M20 37V21M28 37V21M34 37V21" />
      <circle cx="24" cy="14" r="2" fill={AMBER} stroke={AMBER} />
      <path d="M8 41h32" />
    </Icon>
  );
}

export function MaharajasIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 34 6 17l9 7 9-14 9 14 9-7-2 17Z" />
      <path d="M8 34h32v4H8Z" />
      <circle cx="24" cy="26" r="2.4" fill={AMBER} stroke={AMBER} />
    </Icon>
  );
}

export function GoldenChariotIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 12c-4 2-6 6-6 10 0 6 4 11 10 11h12c6 0 10-5 10-11 0-4-2-8-6-10" />
      <path d="M13 12c-2-3-1-7 2-8M35 12c2-3 1-7-2-8" />
      <ellipse cx="24" cy="24" rx="7" ry="8" />
      <path d="M18 22c-2 0-3.5-2-3-4M30 22c2 0 3.5-2 3-4" />
      <circle cx="24" cy="27" r="1.7" fill={AMBER} stroke={AMBER} />
      <path d="M20 12.5 18.5 8M28 12.5 29.5 8" stroke={AMBER} />
    </Icon>
  );
}

export function FerryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M24 8v14M24 8l6 4-6 3Z" fill={AMBER} stroke={AMBER} />
      <path d="M13 22h22l3 5-6 4H16l-6-4Z" />
      <path d="M10 31c2 3 4.5 3 6.5 1.5S21 30 24 31.5s5.5 2 7.5.5 4.5-1.5 6.5 1.5" />
      <path d="M14 22v-3h20v3" />
    </Icon>
  );
}

export function HeliYatraIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="33.5" cy="12.5" r="4.5" fill={AMBER} stroke={AMBER} />
      <path d="M6 34 16 18l6 8 5-7 15 15Z" />
      <path d="M6 34h36" />
    </Icon>
  );
}

export function TAGIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M24 13c-3-3-9-4-14-2v22c5-2 11-1 14 2 3-3 9-4 14-2V11c-5-2-11-1-14 2Z" />
      <path d="M24 13v22" />
      <path d="M12 15c2.5-1 6-1.4 8.5-.2M12 20.5c2.5-1 6-1.4 8.5-.2M12 26c2.5-1 6-1.4 8.5-.2" />
      <path d="M27.5 14.8c2.5-1.2 6-.8 8.5.2M27.5 20.3c2.5-1.2 6-.8 8.5.2M27.5 25.8c2.5-1.2 6-.8 8.5.2" />
    </Icon>
  );
}

export function TrekIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="24" cy="9" r="3" />
      <path d="M24 12v10M24 15l-7 6 3 2M24 20l6 3-2 9M24 22l-4 4-4 12M15 34l-3 8" />
      <rect x="26" y="12" width="7" height="10" rx="2.5" fill={AMBER} stroke={AMBER} />
    </Icon>
  );
}
