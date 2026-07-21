import { useId } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import indiaGeo from "@/maps/india.json";
import { INDIA_VIEW } from "@/maps/projection";

const { width: WIDTH, height: HEIGHT, scale: SCALE, center: CENTER } = INDIA_VIEW;

/**
 * States get a hue by region, not at random. Neighbouring states reading as one
 * colour family is what makes the outline scan as a map of India rather than a
 * bag of shapes, and it stays stable across renders.
 */
const REGION_HUE: Record<string, string> = {
  // North
  "Jammu and Kashmir": "#F4C58A",
  "Himachal Pradesh": "#F4C58A",
  Punjab: "#F4C58A",
  Haryana: "#F4C58A",
  Uttarakhand: "#F4C58A",
  Delhi: "#F4C58A",
  Chandigarh: "#F4C58A",
  "Uttar Pradesh": "#F0B98D",
  // West
  Rajasthan: "#8FD3D6",
  Gujarat: "#8FD3D6",
  Maharashtra: "#8FD3D6",
  Goa: "#8FD3D6",
  "Dadra and Nagar Haveli": "#8FD3D6",
  "Daman and Diu": "#8FD3D6",
  // Central
  "Madhya Pradesh": "#A9CFA4",
  Chhattisgarh: "#A9CFA4",
  // East
  Bihar: "#F2A98E",
  Jharkhand: "#F2A98E",
  "West Bengal": "#F2A98E",
  Odisha: "#F2A98E",
  Sikkim: "#F2A98E",
  // North-east
  "Arunachal Pradesh": "#EE8FB6",
  Assam: "#EE8FB6",
  Nagaland: "#EE8FB6",
  Manipur: "#EE8FB6",
  Mizoram: "#EE8FB6",
  Tripura: "#EE8FB6",
  Meghalaya: "#EE8FB6",
  // South
  Telangana: "#A8A6E6",
  "Andhra Pradesh": "#A8A6E6",
  Karnataka: "#A8A6E6",
  "Tamil Nadu": "#A8A6E6",
  Kerala: "#A8A6E6",
  Puducherry: "#A8A6E6",
  "Andaman and Nicobar": "#A8A6E6",
};

const DEFAULT_HUE = "#B9C4D6";

/**
 * India, drawn as a clean outline map. Deliberately quiet: it is a backdrop for
 * pins and route lines, so it carries colour only in the borders and leaves the
 * interior almost blank for whatever gets layered on top.
 *
 * Reusable anywhere — it fills its container's width and keeps its aspect ratio.
 *
 * There are two layers to draw into. `children` sit *with* the outline, inside
 * the pan/zoom transform, so they move and scale with the land. `overlay` sits
 * above it in fixed frame coordinates — for anything that should stay put and
 * stay legible however far the map is zoomed, like a column of labels.
 */
export function IndiaMap({
  className = "",
  transform,
  zoom = 1,
  containerRef,
  containerProps,
  children,
  overlay,
}: {
  className?: string;
  /** SVG transform applied to the outline and `children`. */
  transform?: string;
  /** Current scale, used to hold stroke weights at a constant apparent width. */
  zoom?: number;
  /** The framing div — pan/zoom listeners attach here, not to the SVG. */
  containerRef?: React.Ref<HTMLDivElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
}) {
  // Scoped so several maps on one page don't share a filter definition.
  const glowId = useId();

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} {...containerProps}>
      <ComposableMap
        projection="geoMercator"
        width={WIDTH}
        height={HEIGHT}
        projectionConfig={{ scale: SCALE, center: CENTER }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.18" />
          </filter>
        </defs>

        <g transform={transform}>
          <Geographies geography={indiaGeo as unknown as Record<string, unknown>}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = String(geo.properties?.name ?? "");
                const stroke = REGION_HUE[name] ?? DEFAULT_HUE;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#FFFFFF"
                    stroke={stroke}
                    strokeWidth={1.1 / zoom}
                    strokeLinejoin="round"
                    style={{
                      default: { outline: "none", transition: "fill .2s ease" },
                      hover: { outline: "none", fill: "#F4F7FE" },
                      pressed: { outline: "none", fill: "#F4F7FE" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {children}
        </g>

        {overlay}
      </ComposableMap>
    </div>
  );
}
