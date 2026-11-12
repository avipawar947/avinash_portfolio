import type { CaseStudyPanel, CaseStudyPanelType, ProjectCaseStudy } from '@/types/content';

/** Section templates offered by the admin "Add section" menu (Figma order). */
export const PANEL_PRESETS: { preset: string; label: string; type: CaseStudyPanelType }[] = [
  { preset: 'overview', label: 'Overview', type: 'text' },
  { preset: 'challenges', label: 'The Challenges', type: 'text' },
  { preset: 'solutions', label: 'The Solutions', type: 'text' },
  { preset: 'info-arch', label: 'Information Architecture', type: 'zoom-image' },
  { preset: 'user-journey', label: 'User Journey', type: 'zoom-image' },
  { preset: 'user-flow', label: 'User Flow', type: 'zoom-image' },
  { preset: 'design-system', label: 'Design System', type: 'design-system' },
  { preset: 'wireframe', label: 'Wireframe', type: 'image-link' },
  { preset: 'visual-design', label: 'Visual Design', type: 'image-link' },
  { preset: 'impact', label: 'Impact', type: 'image-link' },
  { preset: 'conclusion', label: 'Conclusion', type: 'text' },
];

/** Generic (non-Figma-named) sections, one per type. */
export const CUSTOM_TYPES: { type: CaseStudyPanelType; label: string }[] = [
  { type: 'text', label: 'Custom — title + paragraph' },
  { type: 'zoom-image', label: 'Custom — title + paragraph + drag & zoom image' },
  { type: 'image-link', label: 'Custom — title + image (+ optional button)' },
  { type: 'stats', label: 'Custom — stat cards' },
  { type: 'design-system', label: 'Custom — design system' },
];

/** Slide geometry used when a panel has no (known) preset. */
export const DEFAULT_PRESET_FOR_TYPE: Record<CaseStudyPanelType, string> = {
  text: 'overview',
  'zoom-image': 'info-arch',
  'design-system': 'design-system',
  'image-link': 'wireframe',
  stats: 'impact-stats',
};

export const TYPE_LABEL: Record<CaseStudyPanelType, string> = {
  text: 'Title + paragraph',
  'zoom-image': 'Image with drag & zoom',
  'design-system': 'Design system',
  'image-link': 'Image + button',
  stats: 'Stat cards',
};

export const COMMON_FONTS = [
  'Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'DM Sans', 'Manrope',
  'Nunito', 'Plus Jakarta Sans', 'Work Sans', 'Raleway', 'Playfair Display', 'Merriweather',
  'Space Grotesk', 'IBM Plex Sans', 'Outfit', 'Sora', 'Urbanist', 'Rubik',
];

export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Google Fonts stylesheet URL for a set of font samples (legacy css API: it
 * tolerates weights a family doesn't ship, unlike css2 which 400s the request).
 */
export function googleFontsHref(fonts: { family?: string; weight?: number }[] | undefined): string {
  const byFamily = new Map<string, Set<number>>();
  (fonts ?? []).forEach((f) => {
    const fam = f.family?.trim();
    if (!fam) return;
    if (!byFamily.has(fam)) byFamily.set(fam, new Set());
    byFamily.get(fam)!.add(Number(f.weight) || 400);
  });
  if (!byFamily.size) return '';
  const parts = [...byFamily.entries()].map(
    ([fam, ws]) => `${encodeURIComponent(fam).replace(/%20/g, '+')}:${[...ws].sort((a, b) => a - b).join(',')}`
  );
  return `https://fonts.googleapis.com/css?family=${parts.join('|')}&display=swap`;
}

export function newPanel(type: CaseStudyPanelType, preset?: string, label = ''): CaseStudyPanel {
  const base: CaseStudyPanel = { uid: uid(), type, preset: preset ?? DEFAULT_PRESET_FOR_TYPE[type], label, title: label, body: '' };
  if (type === 'zoom-image' || type === 'image-link') base.imageUrl = '';
  if (type === 'image-link') {
    base.link = '';
    base.linkLabel = '';
  }
  if (type === 'design-system') Object.assign(base, { icons: [], fonts: [], colors: [], components: [] });
  if (type === 'stats') base.stats = [];
  return base;
}

export function panelFromPreset(preset: string): CaseStudyPanel {
  const p = PANEL_PRESETS.find((x) => x.preset === preset);
  return p ? newPanel(p.type, p.preset, p.label) : newPanel('text');
}

/**
 * Convert the older fixed-field case study (overview / challenges / infoArch /
 * ...) into the dynamic panels array, so existing content is not lost the first
 * time a project is opened in the new builder.
 */
export function panelsFromLegacy(cs: ProjectCaseStudy | null | undefined): CaseStudyPanel[] {
  if (!cs) return [];
  const out: CaseStudyPanel[] = [];
  const text = (preset: string, label: string, s?: { heading?: string; body?: string }) => {
    if (!s || !(s.body?.trim() || s.heading?.trim())) return;
    const p = panelFromPreset(preset);
    p.title = s.heading?.trim() || label;
    p.label = p.title;
    p.body = s.body ?? '';
    out.push(p);
  };
  const withImage = (preset: string, label: string, s?: any) => {
    if (!s || !(s.body?.trim() || s.imageUrl || s.heading?.trim())) return;
    const p = panelFromPreset(preset);
    p.title = s.heading?.trim() || label;
    p.label = p.title;
    p.body = s.body ?? '';
    p.imageUrl = s.imageUrl ?? '';
    p.imagePublicId = s.imagePublicId ?? '';
    if (p.type === 'image-link') {
      p.link = s.link ?? '';
      p.linkLabel = p.link ? 'Visit Wireframe' : '';
    }
    out.push(p);
  };
  text('overview', 'Overview', cs.overview);
  text('challenges', 'The Challenges', cs.challenges);
  text('solutions', 'The Solutions', cs.solutions);
  withImage('info-arch', 'Information Architecture', cs.infoArch);
  withImage('user-journey', 'User Journey', cs.userJourney);
  withImage('user-flow', 'User Flow', cs.userFlow);

  const ds = cs.designSystem;
  if (ds && (ds.icons?.length || ds.fonts?.length || ds.colors?.length || ds.components?.length || ds.body)) {
    const p = panelFromPreset('design-system');
    p.title = ds.heading?.trim() || 'Design System';
    p.label = p.title;
    p.body = ds.body ?? '';
    p.icons = (ds.icons ?? []).filter((i) => i.svgUrl).map((i) => ({ label: i.label, svgUrl: i.svgUrl as string }));
    p.fonts = (ds.fonts ?? []).map((f) => ({ family: f.family ?? '', weight: f.weight ?? 400, text: f.text ?? '', size: f.size ?? 32 }));
    p.colors = (ds.colors ?? []).map((hex) => ({ hex }));
    p.components = ds.components ?? [];
    out.push(p);
  }

  withImage('wireframe', 'Wireframe', cs.wireframe);
  withImage('visual-design', 'Visual Design', cs.visual);

  if (cs.impact?.stats?.length) {
    const p = newPanel('stats', 'impact-stats', 'Impact');
    p.title = cs.impact.heading?.trim() || 'Impact';
    p.label = p.title;
    p.stats = cs.impact.stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label, desc: s.desc }));
    out.push(p);
  }
  text('conclusion', 'Conclusion', cs.conclusion);
  return out;
}

const PRESET_BY_RICH_KEY: Record<string, string> = {
  overview: 'overview',
  challenges: 'challenges',
  solutions: 'solutions',
  'information-architecture': 'info-arch',
  'user-journey': 'user-journey',
  'user-flow': 'user-flow',
  'design-system': 'design-system',
  wireframe: 'wireframe',
  'visual-design': 'visual-design',
  impact: 'impact',
  conclusion: 'conclusion',
};

/**
 * Convert the oldest CMS shape (`sections[].blocks[]`) into panels so those
 * projects keep rendering through the one panel pipeline.
 */
export function panelsFromRich(sections: any[] | undefined | null): CaseStudyPanel[] {
  if (!Array.isArray(sections)) return [];
  /** Presets whose slide is an uploaded / zoomable diagram. */
  const zoomPresets = new Set(['info-arch', 'user-journey', 'user-flow']);
  /** Presets whose slide is an uploaded image with an optional link. */
  const imagePresets = new Set(['wireframe', 'visual-design', 'impact']);
  return [...sections]
    .filter((s) => s && s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s): CaseStudyPanel => {
      const blocks: any[] = Array.isArray(s.blocks) ? s.blocks : [];
      const has = (t: string) => blocks.find((b) => b?.type === t);
      const title = s.title || s.label || s.key || '';
      const body =
        blocks.filter((b) => b?.type === 'paragraph').map((b) => b.text).filter(Boolean).join('\n') || s.intro || '';
      const preset = PRESET_BY_RICH_KEY[s.key ?? ''];
      const tokens = has('tokens');
      const stats = has('stats');
      const embed = has('embed');
      const image = has('sitemap')?.imageUrl || has('journey')?.imageUrl || has('flow')?.imageUrl || '';

      let p: CaseStudyPanel;
      if (tokens) {
        p = newPanel('design-system', preset);
        const groups: any[] = tokens.groups ?? [];
        const kind = (k: string) => groups.find((g) => g.kind === k);
        p.icons = (kind('icons')?.icons ?? []).filter((i: any) => i.svgUrl).map((i: any) => ({ label: i.label, svgUrl: i.svgUrl }));
        p.fonts = (kind('type')?.samples ?? []).map((f: any) => ({
          family: f.family ?? '',
          weight: f.weight ?? 400,
          text: f.text ?? '',
          size: f.size ?? 32,
        }));
        p.colors = (kind('colors')?.colors ?? []).map((c: any) => ({ hex: c.hex, label: c.label }));
        p.components = (kind('components')?.components ?? []).flatMap((c: any) => c.items ?? [c.label]).filter(Boolean);
      } else if (stats) {
        p = newPanel('stats', 'impact-stats');
        p.stats = (stats.items ?? []).map((i: any) => ({ value: i.value ?? '', suffix: i.suffix ?? '', label: i.group ?? '', desc: i.label ?? '' }));
      } else if (embed) {
        p = newPanel('image-link', preset);
        p.imageUrl = embed.posterUrl || (embed.url && embed.url !== '#' ? embed.url : '') || '';
        p.link = embed.url && embed.url !== '#' && !String(embed.url).startsWith('#') ? embed.url : '';
        p.linkLabel = p.link ? embed.label || 'Visit Wireframe' : '';
      } else if (image) {
        p = newPanel('zoom-image', preset);
        p.imageUrl = image;
      } else if (preset && zoomPresets.has(preset)) {
        // Information Architecture / User Journey / User Flow exist in the old
        // `sections` shape without an image. Keep them as image-capable panels
        // so the admin can upload a diagram and have it persist as `panels`.
        p = newPanel('zoom-image', preset);
      } else if (preset && imagePresets.has(preset)) {
        p = newPanel('image-link', preset);
      } else {
        p = newPanel('text', preset);
      }
      p.label = s.label || title;
      p.title = title;
      p.body = body;
      return p;
    });
}

/**
 * The panels a project actually renders: the dynamic `panels` array when the
 * admin has built one, otherwise the older fixed fields / rich sections
 * converted on the fly.
 */
export function resolvePanels(cs: ProjectCaseStudy | null | undefined): CaseStudyPanel[] {
  if (!cs) return [];
  if (Array.isArray(cs.panels) && cs.panels.length) return cs.panels;

  const rich = panelsFromRich(cs.sections as any[]);
  if (rich.length) {
    // Older content lives in `sections`, but the previous admin also stored a
    // few slide images on flat fields (infoArch, userJourney, …). Merge those
    // in so an image uploaded through the old UI still renders.
    const flatImages: Record<string, { imageUrl?: string; imagePublicId?: string } | undefined> = {
      'info-arch': cs.infoArch,
      'user-journey': cs.userJourney,
      'user-flow': cs.userFlow,
      wireframe: cs.wireframe,
      'visual-design': cs.visual,
    };
    return rich.map((panel) => {
      const flat = panel.preset ? flatImages[panel.preset] : undefined;
      if (!flat?.imageUrl || panel.imageUrl) return panel;
      return { ...panel, imageUrl: flat.imageUrl, imagePublicId: flat.imagePublicId };
    });
  }

  return panelsFromLegacy(cs);
}
