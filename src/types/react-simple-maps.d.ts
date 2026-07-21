declare module "react-simple-maps" {
  import type { CSSProperties, FC, MouseEvent, ReactNode } from "react";

  export interface ComposableMapProps {
    projection?: string | ((...args: unknown[]) => unknown);
    projectionConfig?: unknown;
    width?: number;
    height?: number;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    [key: string]: unknown;
  }
  export const ComposableMap: FC<ComposableMapProps>;

  export const Geographies: FC<{
    geography?: string | Record<string, unknown> | string[];
    children?: (data: {
      geographies: Array<{ rsmKey: string; properties?: Record<string, unknown> }>;
    }) => ReactNode;
  }>;

  export const Geography: FC<{
    geography?: unknown;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    [key: string]: unknown;
  }>;

  export const ZoomableGroup: FC<{
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }>;

  export const Marker: FC<{
    coordinates: [number, number];
    children?: ReactNode;
    onClick?: (e: MouseEvent) => void;
    [key: string]: unknown;
  }>;

  export interface LineProps {
    from?: [number, number];
    to?: [number, number];
    coordinates?: [number, number][];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeOpacity?: number;
    [key: string]: unknown;
  }
  export const Line: FC<LineProps>;
}
