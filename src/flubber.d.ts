declare module "flubber" {
  /**
   * Returns an interpolator function that morphs from `fromPath` to `toPath`.
   * Call the returned function with a value between 0 and 1 to get the
   * intermediate SVG path string.
   */
  export function interpolate(
    fromPath: string,
    toPath: string,
    options?: { maxSegmentLength?: number }
  ): (t: number) => string;

  export function separate(
    fromPath: string,
    toPaths: string[],
    options?: { maxSegmentLength?: number }
  ): Array<(t: number) => string>;

  export function combine(
    fromPaths: string[],
    toPath: string,
    options?: { maxSegmentLength?: number }
  ): Array<(t: number) => string>;
}
