import { geoMercator } from "d3-geo";

/**
 * The projection is pinned rather than fitted at runtime: these numbers came
 * from fitting the states file into an 800x860 box, so the outline always lands
 * in the same place and the SVG can just scale with its container.
 *
 * It lives outside the component so callers can turn lon/lat into SVG
 * coordinates themselves — needed by anything that has to *measure* the map,
 * like laying out labels without overlaps.
 */
export const INDIA_VIEW = {
  width: 800,
  height: 860,
  scale: 1505,
  center: [82.8, 21.84] as [number, number],
};

export function indiaProjection() {
  return geoMercator()
    .scale(INDIA_VIEW.scale)
    .center(INDIA_VIEW.center)
    .translate([INDIA_VIEW.width / 2, INDIA_VIEW.height / 2]);
}

/** lon/lat → [x, y] in the map's 800x860 SVG space. */
export function projectPoint(coordinates: [number, number]): [number, number] {
  const point = indiaProjection()(coordinates);
  return point ? [point[0], point[1]] : [0, 0];
}
