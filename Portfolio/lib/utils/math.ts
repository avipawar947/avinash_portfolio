/** Constrain `value` to the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation between `a` and `b` at position `t` (0..1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Re-map `value` from the range [inMin, inMax] onto [outMin, outMax].
 * Used for scroll-progress -> transform mappings.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax - inMin === 0) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
