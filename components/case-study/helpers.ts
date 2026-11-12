import type { ProjectItem } from "@/types/content";
import { resolvePanels } from "@/lib/case-study-panels";

export function heroTitle(project: ProjectItem, mobile = false): string {
  const t = project.caseStudy?.heroTitle?.trim() || project.title;
  // Figma: desktop hero/nav brand reads "Qiston Pe", the mobile frame reads "QistonPe".
  if (mobile) return t.replace(/\s+/g, "");
  return t;
}

/** Left-nav project name: its own CMS field first, then the hero title (no spaces on mobile). */
export function navTitle(project: ProjectItem): string {
  const own = project.caseStudy?.navTitle?.trim();
  return own || heroTitle(project, true);
}

export function heroSubtitle(project: ProjectItem): string {
  const cs = project.caseStudy ?? {};
  if (cs.heroSubtitle?.trim()) return cs.heroSubtitle.trim();
  if (Array.isArray(cs.tagline) && cs.tagline.length) return cs.tagline.join(" ");
  const overview = resolvePanels(cs).find((p) => p.preset === "overview" || /overview/i.test(p.label || ""));
  return overview?.body?.trim() || `${project.title} — full product design case study.`;
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
  // Impact is an uploaded image (same frame as Wireframe / Visual Design, no button).
  impact: {
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
  // Stat-card variant of the Impact slide (legacy / custom "stat cards" section).
  "impact-stats": {
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
