/**
 * Canonical section ids — in-page anchor targets and ScrollTrigger
 * scoping keys, so they must stay stable.
 */
export const SECTION_IDS = {
  hero: "hero",
  clients: "clients",
  work: "work",
  journey: "journey",
  process: "process",
  gallery: "gallery",
  about: "about",
  tools: "tools",
  life: "life",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/**
 * Navbar links — Figma node 1:36.
 *
 * The link row is a 496px pill at x=712. `centerX` is each label's
 * centre *within* that pill, read from nodes 1:37-1:40, so the labels
 * land on the design's own positions rather than on whatever a flex gap
 * happens to produce.
 *
 * "Home" is the active item in the design (Bold, with the 24x2 rule at
 * 1:41 centred beneath it).
 */
export const NAV_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  centerX: number;
}> = [
  { label: "Home", href: `#${SECTION_IDS.hero}`, centerX: 56 },
  { label: "Work", href: `#${SECTION_IDS.work}`, centerX: 180 },
  { label: "About", href: `#${SECTION_IDS.about}`, centerX: 304 },
  { label: "Contact", href: `#${SECTION_IDS.contact}`, centerX: 436 },
];
