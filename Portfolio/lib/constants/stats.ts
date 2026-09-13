/**
 * "Beyond The Numbers" — Figma node 1:273.
 *
 * Five cards on a three-column grid. Copy, figures and bar widths are
 * read from the design; nothing here is estimated.
 */

export type Stat = {
  /** Nodes 1:296, 1:300, 1:304, 1:310. */
  label: string;
  /** Second label line, flat #B0B0B0 at 30% rather than gradient (1:311). */
  labelMuted?: string;
  /** Nodes 1:297, 1:301, 1:305, 1:308. */
  value: string;
  /** Nodes 1:298, 1:302, 1:306, 1:309 — set at 100px, bottom-aligned. */
  suffix: string;
  column: 1 | 3;
};

export const STATS: readonly Stat[] = [
  { label: "Years of Experience", value: "04", suffix: "+", column: 1 },
  { label: "Clients Satisfaction", value: "90", suffix: "%", column: 1 },
  { label: "Consistent on all screen", value: "95", suffix: "%", column: 3 },
  {
    label: "Successful projects delivered across",
    labelMuted: "digital products.",
    value: "80",
    suffix: "+",
    column: 3,
  },
];

/**
 * "On Average Projects" bar chart — node 1:318.
 *
 * `width` is the bar's Figma width inside the 470px plot area, against a
 * 447px axis labelled 0 to 100. Kept as the design's own pixel widths
 * rather than converted to percentages, so they stay checkable.
 */
export const PROJECT_MIX: readonly { label: string; width: number }[] = [
  { label: "Mobile App", width: 138 },
  { label: "Web App", width: 299 },
  { label: "Websites", width: 370 },
  { label: "landing Pages", width: 244 },
];

/** "domains worked across" — nodes 1:329 to 1:332. */
export const DOMAINS: readonly string[] = [
  "FinTech",
  "Insurance",
  "Healthcare",
  "E-Com",
];
