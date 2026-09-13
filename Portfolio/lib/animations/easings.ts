/**
 * Shared easing curves.
 *
 * TODO(figma): these are placeholders. Replace each value with the
 * easing defined on the corresponding Figma prototype interaction once
 * the file is readable. Do not ship these as-is.
 */
export const EASE = {
  /** Default UI transition. */
  out: "power3.out",
  /** Entrances that travel a long distance. */
  expoOut: "expo.out",
  /** Two-way transitions (open/close, enter/leave). */
  inOut: "power2.inOut",
} as const;

/** Framer Motion cubic-bezier equivalents of the curves above. */
export const BEZIER = {
  out: [0.16, 1, 0.3, 1],
  expoOut: [0.19, 1, 0.22, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/**
 * TODO(figma): replace with the durations read off the Figma prototype.
 */
export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
} as const;
