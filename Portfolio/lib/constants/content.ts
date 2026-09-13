/**
 * Portfolio content read from the Figma design.
 *
 * The design presents each case study as image + title only — it carries
 * no descriptions, tech stacks, categories, years or links. Those fields
 * exist on the type and are rendered when present, but are deliberately
 * left unset rather than invented: fabricating project write-ups would
 * put words in the designer's mouth.
 */

export type Project = {
  /** Stable key and future route segment. */
  slug: string;
  /** Figma nodes 1:149, 1:152, 1:155, 1:158. */
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  /**
   * Vertical crop the design applies to the image inside its 738x468
   * frame, as (height%, top%) — Figma scales the fill taller than the
   * frame and offsets it upward.
   */
  crop: { heightPct: number; topPct: number };
  /** 1:151 alone carries an extra black-to-grey wash over the image. */
  wash?: boolean;
  description?: string;
  category?: string;
  year?: string;
  stack?: readonly string[];
  liveUrl?: string;
  repoUrl?: string;
};

/**
 * Order and placement come from the design: a two-column stagger with
 * the right column dropped 120px. `column` records which side a card
 * sits on so the layout does not have to infer it from array index.
 */
export const PROJECTS: readonly (Project & { column: "left" | "right" })[] = [
  {
    slug: "hrx",
    title: "HRX",
    column: "left",
    image: {
      src: "/images/projects/hrx.webp",
      alt: "HRX case study",
      width: 1024,
      height: 767,
    },
    crop: { heightPct: 118.12, topPct: -8.95 },
    wash: true,
  },
  {
    slug: "nsl-luxe",
    title: "NSL Luxe",
    column: "right",
    image: {
      src: "/images/projects/nsl-luxe.webp",
      alt: "NSL Luxe case study",
      width: 579,
      height: 388,
    },
    crop: { heightPct: 105.67, topPct: -2.73 },
  },
  {
    // The design labels both of the lower cards "Synclature" (1:155 and
    // 1:158). Reproduced as authored; slugs disambiguate them in code.
    slug: "synclature-brand",
    title: "Synclature",
    column: "left",
    image: {
      src: "/images/projects/synclature-1.webp",
      alt: "Synclature case study",
      width: 588,
      height: 390,
    },
    crop: { heightPct: 104.59, topPct: -2.19 },
  },
  {
    slug: "synclature-product",
    title: "Synclature",
    column: "right",
    image: {
      src: "/images/projects/synclature-2.webp",
      alt: "Synclature case study",
      width: 1024,
      height: 683,
    },
    crop: { heightPct: 105.18, topPct: -2.48 },
  },
];

export type ExperienceEntry = {
  company: string;
  role: string;
  duration: string;
  responsibilities: readonly string[];
  technologies: readonly string[];
};

export type Skill = {
  name: string;
  /** Path under /public/icons — the exact Figma asset. */
  icon: string;
};

export const EXPERIENCE: readonly ExperienceEntry[] = [];
export const SKILLS: readonly Skill[] = [];
