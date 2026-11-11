import type { ProjectItem } from "@/types/content";

/**
 * Figma desktop "Cards / Left Side" has 12 rows, but "Sitemaps" is placed on
 * top of "Design System" at the same y (the file kept both layers). The mobile
 * navbar has no Sitemaps row, and there is no standalone Sitemaps slide — it
 * shares the Information Architecture diagram. Dropping it gives exactly the
 * Figma row positions: 152, 196, 240 … 592 (44px pitch).
 */
export const NAV_ITEMS = [
  { label: "Overview", id: "overview" },
  { label: "The Challenges", id: "challenges" },
  { label: "The Solutions", id: "solutions" },
  { label: "Information Architecture", id: "info-arch" },
  { label: "User Journey", id: "user-journey" },
  { label: "User Flow", id: "user-flow" },
  { label: "Design System", id: "design-system" },
  { label: "Wireframe", id: "wireframe" },
  { label: "Visual Design", id: "visual-design" },
  { label: "Impact", id: "impact" },
  { label: "Conclusion", id: "conclusion" },
] as const;

const KEY_TO_ID: Record<string, string> = {
  overview: "overview",
  challenges: "challenges",
  solutions: "solutions",
  "information-architecture": "info-arch",
  "user-journey": "user-journey",
  "user-flow": "user-flow",
  "design-system": "design-system",
  wireframe: "wireframe",
  "visual-design": "visual-design",
  impact: "impact",
  conclusion: "conclusion",
};

export function legacySections(project: ProjectItem) {
  const raw = project.caseStudy?.sections;
  if (!Array.isArray(raw) || !raw.length) return null;
  const sorted = [...raw].filter((s: any) => s.visible !== false).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return sorted.map((s: any) => ({
    key: s.key ?? "",
    id: KEY_TO_ID[s.key ?? ""] ?? (s.key ?? "").replace(/\s+/g, "-").toLowerCase(),
    label: s.label ?? s.title ?? s.key ?? "",
    title: s.title ?? s.label ?? "",
    intro: s.intro ?? "",
    blocks: Array.isArray(s.blocks) ? s.blocks : [],
  }));
}

export function heroTitle(project: ProjectItem, mobile = false): string {
  const t = project.caseStudy?.heroTitle?.trim() || project.title;
  // Figma: desktop hero/nav brand reads "Qiston Pe", the mobile frame reads "QistonPe".
  if (mobile) return t.replace(/\s+/g, "");
  return t;
}

export function heroSubtitle(project: ProjectItem): string {
  const cs = project.caseStudy ?? {};
  if (cs.heroSubtitle?.trim()) return cs.heroSubtitle.trim();
  if (Array.isArray(cs.tagline) && cs.tagline.length) return cs.tagline.join(" ");
  return cs.overview?.body?.trim() || `${project.title} — full product design case study.`;
}

export function subtitleLines(project: ProjectItem): string[] {
  const cs: any = project.caseStudy ?? {};
  if (Array.isArray(cs.tagline) && cs.tagline.length >= 2) return cs.tagline;
  const clean = heroSubtitle(project).replace(/\s+/g, " ").trim();
  const lines = clean.split(/\s+(?=(Take|from|to|with|and|all|in|on)\b)/i).filter(Boolean);
  if (lines.length >= 3) return lines.slice(0, 3);
  const words = clean.split(" ");
  const cut = Math.ceil(words.length / 3);
  return [words.slice(0, cut).join(" "), words.slice(cut, cut * 2).join(" "), words.slice(cut * 2).join(" ")].filter(Boolean);
}

export function heroImage(project: ProjectItem): string {
  const cs: any = project.caseStudy ?? {};
  return cs.heroImageUrl?.trim() || cs.coverImageUrl?.trim() || project.imageUrl?.trim() || cs.gallery?.[0]?.imageUrl?.trim() || "";
}

export function heroBackground(project: ProjectItem): string {
  return (project.caseStudy as any)?.heroBackgroundUrl?.trim() || "/images/case-study/qistonpe/hero-bg.webp";
}

export function logoUrl(project: ProjectItem): string {
  const cs: any = project.caseStudy ?? {};
  // Left-nav mark comes from the CMS: "Project icon" (iconSvgUrl) first, then
  // the uploaded wordmark (logoUrl). Empty means the nav renders a placeholder.
  return cs.iconSvgUrl?.trim() || cs.logoUrl?.trim() || "";
}

export function sectionIcon(project: ProjectItem, key: string): string | undefined {
  const icons: any[] = (project.caseStudy as any)?.sectionIcons ?? [];
  const hit = icons.find((i: any) => i.key === key && i.svgUrl?.trim());
  return hit?.svgUrl?.trim() || undefined;
}

/**
 * Figma order is Client, Category, Type, Duration (desktop Main Frame and the
 * mobile 2x2 grid). Anything beyond four is dropped so every project uses the
 * same 4-column / 2x2 composition.
 */
export function metaItems(project: ProjectItem): { label: string; value: string }[] {
  const cs: any = project.caseStudy ?? {};
  const source: any[] = Array.isArray(cs.meta) && cs.meta.length ? cs.meta : [];
  const map = new Map<string, string>();
  source.forEach((m) => {
    if (m?.label && m?.value?.trim?.()) map.set(String(m.label).trim().toLowerCase(), String(m.value).trim());
  });
  const pick = (label: string, ...fallbacks: string[]) => {
    const key = label.toLowerCase();
    if (map.has(key)) return map.get(key) as string;
    for (const f of fallbacks) {
      const v = cs[f]?.trim?.();
      if (v) return v;
    }
    return "";
  };
  const items = [
    { label: "Client", value: pick("Client") || project.title },
    { label: "Category", value: pick("Category") },
    { label: "Type", value: pick("Type") },
    { label: "Duration", value: pick("Duration") },
  ];
  return items.filter((m) => m.value);
}

export function websiteUrl(project: ProjectItem): string {
  const cs: any = project.caseStudy ?? {};
  return cs.websiteUrl?.trim() || "";
}

export function wireframeLink(project: ProjectItem): string {
  const cs: any = project.caseStudy ?? {};
  return cs.wireframeUrl?.trim() || cs.wireframe?.link?.trim() || "";
}

/**
 * Nav labels are CMS-driven: each section id maps to its backend-editable
 * heading (overview, challenges, solutions, infoArch, userJourney, userFlow,
 * designSystem, wireframe, visual, impact, conclusion). Falls back to the
 * canonical design labels only when the CMS has nothing stored yet.
 */
const NAV_FIELD_BY_ID: Record<string, string> = {
  overview: "overview",
  challenges: "challenges",
  solutions: "solutions",
  "info-arch": "infoArch",
  "user-journey": "userJourney",
  "user-flow": "userFlow",
  "design-system": "designSystem",
  wireframe: "wireframe",
  "visual-design": "visual",
  impact: "impact",
  conclusion: "conclusion",
};

export function navItems(project: ProjectItem): { id: string; label: string }[] {
  return NAV_ITEMS.map((item) => {
    const cs: any = project.caseStudy ?? {};
    const field = NAV_FIELD_BY_ID[item.id] ?? item.id;
    const stored = cs[field]?.heading?.trim?.() || "";
    return { id: item.id, label: stored || item.label };
  });
}

/** Journey column headers come from the CMS, else the Figma copy. */
export function journeyColumns(project: ProjectItem): string[] {
  const cols = (project.caseStudy as any)?.userJourney?.columns;
  if (Array.isArray(cols) && cols.length) return cols.filter((c) => c?.trim()).map((c) => c.trim());
  return ["What the dealership does", "Screens", "How the design helps"];
}

export function sectionBody(s: { heading?: string; body?: string } | undefined, fallback = ""): string {
  return s?.body?.trim() || fallback;
}

export function sectionHeading(s: { heading?: string; body?: string } | undefined, fallback: string): string {
  return s?.heading?.trim() || fallback;
}

/**
 * Per-slide Figma geometry inside the 1281x864 ArtBoard (desktop) and the
 * 335x646 ArtBoard (mobile). All numbers are raw Figma px; the CSS multiplies
 * them by `--u` (`--fig` on desktop, `--cs-u` on mobile).
 *
 * Desktop slides come in two shapes:
 *  - center: heading + copy centred in the ArtBoard (Overview, Challenges,
 *    Solutions, Conclusion);
 *  - top: a copy block pinned at (left, top) with an optional media block
 *    pinned at (mediaLeft, mediaTop) (the diagram/table/token slides).
 */
export type PanelLayout = "center" | "top";

export type PanelMeta = {
  layout: PanelLayout;
  /** Desktop copy block. */
  left: number;
  top: number;
  width: number;
  /** Desktop media block (top layout only). */
  mediaLeft?: number;
  mediaTop?: number;
  mediaWidth?: number;
  mediaHeight?: number;
  /** Desktop "Visit Wireframe" button, relative to the media block. */
  buttonLeft?: number;
  buttonTop?: number;
  /** Mobile: top offset inside the 335x646 ArtBoard + copy/media gap. */
  mobileTop?: number;
  mobileGap?: number;
};

export const PANEL_META: Record<string, PanelMeta> = {
  overview: { layout: "center", left: 191, top: 302, width: 899 },
  challenges: { layout: "center", left: 180, top: 302, width: 920 },
  solutions: { layout: "center", left: 180, top: 270, width: 920 },
  "info-arch": {
    layout: "top",
    left: 166,
    top: 72,
    width: 948,
    mediaLeft: 166,
    mediaTop: 236,
    mediaWidth: 948,
    mediaHeight: 555,
    mobileTop: 32,
    mobileGap: 32,
  },
  "user-journey": {
    layout: "top",
    left: 129,
    top: 54,
    width: 1022,
    mediaLeft: 46,
    mediaTop: 218,
    mediaWidth: 1190,
    mediaHeight: 592,
    mobileTop: 24,
    mobileGap: 32,
  },
  "user-flow": {
    layout: "top",
    left: 166,
    top: 38,
    width: 948,
    mediaLeft: 46,
    mediaTop: 234,
    mediaWidth: 1190,
    mediaHeight: 592,
    mobileTop: 24,
    mobileGap: 32,
  },
  "design-system": {
    layout: "top",
    left: 166,
    top: 38,
    width: 948,
    mediaLeft: 46,
    mediaTop: 120,
    mediaWidth: 1190,
    mediaHeight: 706,
    mobileTop: 24,
    mobileGap: 24,
  },
  wireframe: {
    layout: "top",
    left: 166,
    top: 48,
    width: 948,
    mediaLeft: 137,
    mediaTop: 128,
    mediaWidth: 1008,
    mediaHeight: 598,
    buttonLeft: 416,
    buttonTop: 638,
    mobileTop: 24,
    mobileGap: 24,
  },
  "visual-design": {
    layout: "top",
    left: 166,
    top: 48,
    width: 948,
    mediaLeft: 137,
    mediaTop: 128,
    mediaWidth: 1008,
    mediaHeight: 598,
    buttonLeft: 416,
    buttonTop: 638,
    mobileTop: 24,
    mobileGap: 24,
  },
  impact: {
    layout: "top",
    left: 165,
    top: 214,
    width: 948,
    mediaLeft: 45,
    mediaTop: 354,
    mediaWidth: 1192,
    mediaHeight: 294,
    mobileTop: 24,
    mobileGap: 24,
  },
  conclusion: { layout: "center", left: 191, top: 328, width: 899 },
};
