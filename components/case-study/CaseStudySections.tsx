import Image from "next/image";
import type { CSSProperties } from "react";
import type { CaseStudyPanel, ProjectItem } from "@/types/content";
import { DEFAULT_PRESET_FOR_TYPE, googleFontsHref, resolvePanels, slugify } from "@/lib/case-study-panels";
import { PANEL_META, type PanelLayout } from "./helpers";
import ZoomImage from "./ZoomPanViewer";

/**
 * Case-study slides. The page is fully data-driven: every entry of
 * `caseStudy.panels` (built in the admin) becomes one nav item + one slide, in
 * the order the admin arranged them. Each slide is laid out with the Figma
 * 1281x864 ArtBoard geometry of its preset (see PANEL_META); this module only
 * builds the panel view-models and renders their bodies. The frame / nav live
 * in CaseStudyViewer.
 */

export type Panel = {
  id: string;
  /** Nav label. */
  label: string;
  heading: string;
  body: string;
  data: CaseStudyPanel;
  layout: PanelLayout;
  /** Desktop copy block, raw Figma px inside the 1281x864 ArtBoard. */
  left: number;
  top: number;
  copy: number;
  /** Desktop media block (top layout only). */
  mediaLeft: number;
  mediaTop: number;
  mediaWidth: number;
  mediaHeight: number;
  buttonLeft: number;
  buttonTop: number;
  /** Mobile offsets inside the 335x646 ArtBoard. */
  mobileTop: number;
  mobileGap: number;
};

const BUTTON_W = 176;

function geometry(panel: CaseStudyPanel) {
  const isText = panel.type === "text";
  let meta = panel.preset ? PANEL_META[panel.preset] : undefined;
  // A preset whose shape doesn't fit the panel type falls back to the type's default slide.
  if (!meta || (isText ? meta.layout !== "center" : meta.layout === "center")) {
    meta = PANEL_META[DEFAULT_PRESET_FOR_TYPE[panel.type]] ?? PANEL_META.overview;
  }
  return meta;
}

function makePanel(data: CaseStudyPanel, id: string): Panel {
  const meta = geometry(data);
  const mediaWidth = meta.mediaWidth ?? meta.width;
  const mediaHeight = meta.mediaHeight ?? 0;
  return {
    id,
    label: data.label?.trim() || data.title?.trim() || "Untitled",
    heading: data.title?.trim() || data.label?.trim() || "",
    body: data.body?.trim() || "",
    data,
    layout: meta.layout,
    left: meta.left,
    top: meta.top,
    copy: meta.width,
    mediaLeft: meta.mediaLeft ?? meta.left,
    mediaTop: meta.mediaTop ?? 0,
    mediaWidth,
    mediaHeight,
    buttonLeft: meta.buttonLeft ?? Math.round((mediaWidth - BUTTON_W) / 2),
    buttonTop: meta.buttonTop ?? mediaHeight + 40,
    mobileTop: meta.mobileTop ?? 24,
    mobileGap: meta.mobileGap ?? 32,
  };
}

/** Build the slides for a project from its (admin-defined) panels. */
export function buildPanels(project: ProjectItem): Panel[] {
  const used = new Set<string>();
  return resolvePanels(project.caseStudy).map((data, i) => {
    const base = slugify(data.label || data.title || "") || `section-${i + 1}`;
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return makePanel(data, id);
  });
}

/* ----------------------------- slide bodies ------------------------------ */

/** Wireframe / Visual Design always show the "Visit Wireframe" pill;
 *  other image sections (Impact, custom) show a button only when a link is set. */
const ALWAYS_BUTTON = new Set(["wireframe", "visual-design"]);

function ImageFrame({ panel }: { panel: Panel }) {
  const d = panel.data;
  if (!d.imageUrl) return null;
  const link = d.link?.trim() || "";
  const showButton = Boolean(link) || ALWAYS_BUTTON.has(d.preset ?? "");
  const href = link || `#${panel.id}`;
  const ext = link ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <div className="cs-embed">
      <a href={href} {...ext} className="cs-frame-link relative block overflow-hidden">
        <span className="cs-frame-media relative block h-full w-full overflow-hidden">
          <Image src={d.imageUrl} alt={panel.heading} fill sizes="80vw" className="absolute inset-0 object-cover" />
        </span>
      </a>
      {showButton && (
        <a href={href} {...ext} className="cs-embed-btn inline-flex items-center justify-center font-normal">
          {d.linkLabel?.trim() || "Visit Wireframe"}
        </a>
      )}
    </div>
  );
}

function DesignSystem({ panel }: { panel: Panel }) {
  const d = panel.data;
  const icons = (d.icons ?? []).filter((i) => i.svgUrl);
  const fonts = (d.fonts ?? []).filter((f) => f.family?.trim());
  const colors = (d.colors ?? []).filter((c) => c.hex?.trim());
  const components = (d.components ?? []).filter((c) => c?.trim());
  const cols = [icons.length, fonts.length, colors.length].filter(Boolean).length;
  const fontsHref = googleFontsHref(fonts);

  if (!icons.length && !fonts.length && !colors.length && !components.length) return null;

  return (
    <div className="cs-ds">
      {fontsHref ? (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={fontsHref} />
      ) : null}
      {cols > 0 && (
        <div className="cs-ds-top" style={{ "--cols": cols } as CSSProperties}>
          {icons.length > 0 && (
            <div className="cs-ds-block">
              <h3 className="cs-ds-h3 m-0 font-semibold">Icons</h3>
              <div className="cs-ds-icons-frame">
                {icons.map((ic, i) => (
                  <span key={`${ic.svgUrl}-${i}`} className="cs-ds-icon">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ic.svgUrl} alt={ic.label || "icon"} className="cs-ds-icon-img" />
                  </span>
                ))}
              </div>
            </div>
          )}
          {fonts.length > 0 && (
            <div className="cs-ds-block">
              <h3 className="cs-ds-h3 m-0 font-semibold">Typography</h3>
              <div className="cs-ds-type">
                {fonts.map((f, i) => (
                  <span key={i} className="cs-type-item">
                    <span
                      className="cs-type-sample"
                      style={{
                        fontFamily: `"${f.family}", sans-serif`,
                        fontWeight: f.weight || 400,
                        fontSize: `calc(${Math.min(f.size || 32, 64)} * var(--u))`,
                      }}
                    >
                      {f.text || f.family}
                    </span>
                    <span className="cs-type-meta">
                      {f.family} · {f.weight || 400}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {colors.length > 0 && (
            <div className="cs-ds-block">
              <h3 className="cs-ds-h3 m-0 font-semibold">Colors</h3>
              <div className="cs-ds-colors grid">
                {colors.map((c, i) => (
                  <span key={`${c.hex}-${i}`} className="cs-swatch">
                    <span className="cs-swatch-box block" style={{ background: c.hex }} aria-hidden />
                    <span className="cs-swatch-label block">
                      {c.hex}
                      {c.label ? ` · ${c.label}` : ""}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {components.length > 0 && (
        <div className="cs-ds-block">
          <h3 className="cs-ds-h3 m-0 font-semibold">Components</h3>
          <div className="cs-ds-components flex flex-wrap justify-center">
            {components.map((c, i) => (
              <span key={`${c}-${i}`} className="cs-chip">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stats({ panel }: { panel: Panel }) {
  const stats = panel.data.stats ?? [];
  if (!stats.length) return null;
  return (
    <div className="cs-stats grid">
      {stats.map((s, i) => (
        <div key={i} className="cs-stat">
          <div className="cs-stat-head">
            <span className="cs-stat-dot" aria-hidden />
            {s.label && <p className="cs-stat-group m-0">{s.label}</p>}
          </div>
          <p className="cs-stat-num m-0 font-medium">
            {s.value}
            {s.suffix && <span className="cs-stat-suffix">{s.suffix}</span>}
          </p>
          {s.desc && <p className="cs-stat-desc m-0 font-normal">{s.desc}</p>}
        </div>
      ))}
    </div>
  );
}

function PanelMedia({ panel }: { panel: Panel }) {
  const d = panel.data;
  switch (d.type) {
    case "zoom-image":
      return d.imageUrl ? <ZoomImage src={d.imageUrl} alt={panel.heading} /> : null;
    case "image-link":
      return <ImageFrame panel={panel} />;
    case "design-system":
      return <DesignSystem panel={panel} />;
    case "stats":
      return <Stats panel={panel} />;
    default:
      return null;
  }
}

function hasMedia(d: CaseStudyPanel) {
  switch (d.type) {
    case "zoom-image":
    case "image-link":
      return Boolean(d.imageUrl);
    case "design-system":
      return Boolean(d.icons?.length || d.fonts?.length || d.colors?.length || d.components?.length);
    case "stats":
      return Boolean(d.stats?.length);
    default:
      return false;
  }
}

/** The body of one ArtBoard panel (heading + copy + media). */
export function PanelContent({ panel }: { panel: Panel }) {
  const style = {
    "--copy-left": panel.left,
    "--copy-top": panel.top,
    "--copy-w": panel.copy,
    "--media-left": panel.mediaLeft,
    "--media-top": panel.mediaTop,
    "--media-w": panel.mediaWidth,
    "--media-h": panel.mediaHeight,
    "--button-left": panel.buttonLeft,
    "--button-top": panel.buttonTop,
    "--m-top": panel.mobileTop,
    "--m-gap": panel.mobileGap,
  } as CSSProperties;

  return (
    <div className="cs-panel-inner" data-layout={panel.layout} style={style}>
      <div className="cs-panel-copy">
        {panel.heading && <h2 className="cs-h2 m-0 font-semibold">{panel.heading}</h2>}
        {panel.body && <p className="cs-body m-0 font-semibold">{panel.body}</p>}
      </div>
      {hasMedia(panel.data) && (
        <div className="cs-panel-media">
          <PanelMedia panel={panel} />
        </div>
      )}
    </div>
  );
}
