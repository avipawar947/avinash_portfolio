import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { CSSProperties } from "react";
import type { ProjectItem } from "@/types/content";
import { legacySections, PANEL_META, sectionBody, sectionHeading, type PanelLayout } from "./helpers";
import { MaterialIcon, type IconDef } from "./CaseStudyIcons";

/**
 * The 11 Figma section slides:
 *   1308:54164 Overview | 1308:26285 The Challenges | 1308:29030 The Solutions
 *   1308:31777 Information Architecture | 1308:34588 User Journey
 *   1308:37394 User Flow | 1308:40238 Design System | 1308:43179 Wireframe
 *   1308:45919 Visual Design | 1308:48659 Impact | 1308:51421 Conclusion
 *
 * They are design variants of the same 1281x864 ArtBoard, so the page shows one
 * at a time and the left nav switches between them. This module only builds the
 * panel data + panel body; the frame/nav live in CaseStudyViewer.
 */

export type Panel = {
  id: string;
  heading: string;
  body: string;
  blocks: any[];
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

/**
 * Fallback icon grid for the Design System / Icons slide (Figma 1308:42976).
 * `row`/`col` are 0-based indices into the 8-col x 4-row Material icon grid
 * measured on the slide (columns pitch 44, rows pitch 40, content inset 16).
 */
const DEFAULT_ICONS: { name: string; row: number; col: number }[] = [
  { name: "chevron-down", row: 0, col: 0 },
  { name: "chevron-down", row: 0, col: 1 },
  { name: "search", row: 0, col: 2 },
  { name: "search", row: 0, col: 3 },
  { name: "headset_mic", row: 0, col: 4 },
  { name: "add", row: 0, col: 5 },
  { name: "description", row: 0, col: 6 },
  { name: "person", row: 0, col: 7 },
  { name: "menu", row: 1, col: 0 },
  { name: "location_on", row: 1, col: 1 },
  { name: "attachment", row: 1, col: 2 },
  { name: "info", row: 1, col: 3 },
  { name: "add_circle", row: 1, col: 4 },
  { name: "verified", row: 1, col: 5 },
  { name: "delete", row: 1, col: 6 },
  { name: "edit", row: 1, col: 7 },
  { name: "share", row: 2, col: 0 },
  { name: "print", row: 2, col: 1 },
  { name: "download", row: 2, col: 2 },
  { name: "visibility", row: 2, col: 3 },
  { name: "remove", row: 2, col: 4 },
  { name: "directions_car", row: 2, col: 5 },
  { name: "back_hand", row: 2, col: 6 },
  { name: "payments", row: 2, col: 7 },
  { name: "directions_bus", row: 3, col: 0 },
  { name: "receipt_long", row: 3, col: 1 },
  { name: "done", row: 3, col: 2 },
  { name: "done", row: 3, col: 3 },
  { name: "more_vert", row: 3, col: 4 },
  { name: "notifications", row: 3, col: 5 },
];

const FLOW_NODES: { title: string; sub: string }[] = [
  { title: "Login", sub: "Mobile Number" },
  { title: "OTP Verify", sub: "Enter 4-digit OTP" },
  { title: "Borrowers Details", sub: "ID, Address, Docs" },
  { title: "Loan Application", sub: "3-Step Process" },
  { title: "Vehicle Details", sub: "Brand, Model, Body" },
  { title: "Proforma Invoice Details", sub: "Costs And Invoice" },
  { title: "Dashboard", sub: "Stats, Prev Policies" },
  { title: "Submit Application", sub: "Confirmation" },
  { title: "Lenders", sub: "Select lenders" },
  { title: "Preview", sub: "Review All Details" },
  { title: "Listing", sub: "All Applications" },
  { title: "Disbursement", sub: "Amounts, Receipt" },
];

const INFO_NODES: { title: string; sub?: string; accent?: boolean }[] = [
  { title: "QistonPe", accent: true },
  { title: "Login", sub: "Entry" },
  { title: "Dashboard", sub: "Overview" },
  { title: "Listing", sub: "Track Status" },
  { title: "Disbursement", sub: "After Approval" },
  { title: "Application", sub: "3-Step Wizard" },
];

/** Fallback type samples for the Design System / Typography slide (Figma
 *  1308:40238) — replaced by CMS `designSystem.fonts` whenever the backend
 *  provides the real font stack. */
const DEFAULT_FONTS: { family: string; weight: number; text: string; size: number }[] = [
  { family: "Montserrat", weight: 590, text: "QistonPe", size: 56 },
  { family: "Poppins", weight: 400, text: "QistonPe", size: 32 },
];

/** Fallback journey column headers (Figma User Journey slide). */
const DEFAULT_JOURNEY_COLUMNS = ["What the dealership does", "Screens", "How the design helps"];

/**
 * Full-screen zoom overlay for the Information Architecture slide — the
 * Figma "Zoom In" button opens the CMS-provided diagram here, supports drag
 * panning and wheel-free zoom controls.
 */
function ZoomOverlay({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const zoomBy = (f: number) =>
    setView((v) => ({ ...v, scale: Math.min(Math.max(v.scale * f, 0.5), 8) }));

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX, y: e.clientY, px: view.x, py: view.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    setView((v) => ({ ...v, x: d.px - (e.clientX - d.x), y: d.py - (e.clientY - d.y) }));
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div
      className="cs-zoom-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed information architecture"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="cs-zoom-bar" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoomBy(0.8)} aria-label="Zoom out">−</button>
        <button type="button" onClick={() => setView({ x: 0, y: 0, scale: 1 })} aria-label="Reset zoom">Reset</button>
        <button type="button" onClick={onClose} aria-label="Close zoom">Close</button>
      </div>
      <div
        className="cs-zoom-stage"
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} draggable={false} />
      </div>
    </div>
  );
}

/**
 * User Flow diagram — CMS node chain (or CMS artwork), the CTA button and a
 * sequential "cursor" that travels across the nodes (Figma user flow cursor).
 */
function FlowDiagram({ block }: { block: any }) {
  const nodes: any[] = block.imageUrl
    ? []
    : (block.groups ?? []).flatMap((g: any) => g.nodes ?? []);
  const nodeKey = nodes.map((n: any) => `${n.label}-${n.sub ?? ""}`).join("|");
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!nodes.length) return;
    const track = trackRef.current;
    if (!track) return;
    const els = Array.from(track.querySelectorAll<HTMLElement>(".cs-node"));
    if (!els.length) return;
    const tRect = track.getBoundingClientRect();
    const toLocal = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - tRect.left, y: r.top - tRect.top, w: r.width, h: r.height };
    };
    const rects = els.map(toLocal);
    setCursor({ x: rects[0].x + rects[0].w / 2, y: rects[0].y + rects[0].h / 2 });
    let i = 0;
    const timer = window.setInterval(() => {
      i = (i + 1) % rects.length;
      const r = rects[i];
      setCursor({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
    }, 1500);
    return () => window.clearInterval(timer);
  }, [nodeKey]);

  if (block.imageUrl) {
    // CMS-provided flow artwork replaces the node chain.
    return (
      <div className="cs-journey-media">
        <Image src={block.imageUrl} alt="User flow" fill sizes="80vw" className="object-contain" />
      </div>
    );
  }

  return (
    <div className="cs-flowgroups flex flex-col" ref={trackRef}>
      {(block.groups ?? []).map((g: any) => (
        <div key={g.title} className="cs-flowgroup">
          <h3 className="cs-ds-h3 m-0 font-semibold">{g.title}</h3>
          <div className="cs-flow flex flex-wrap justify-center">
            {(g.nodes ?? []).map((n: any) => (
              <div key={n.label} className="cs-node" data-tone={n.tone || ""}>
                <span className="cs-node-title block font-bold">{n.label}</span>
                {n.sub && <span className="cs-node-sub block font-medium">{n.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {block.buttonLabel ? (
        <div className="cs-flow-cta">
          <span className="cs-embed-btn">{block.buttonLabel}</span>
        </div>
      ) : null}
      {nodes.length ? (
        <div className="cs-flow-cursor" style={{ transform: `translate(${cursor?.x ?? 0}px, ${cursor?.y ?? 0}px)` }} aria-hidden />
      ) : null}
    </div>
  );
}

/** Render one CMS rich block (paragraph / sitemap / journey / flow / tokens / embed / stats). */
function Block({ block, sectionKey }: { block: any; sectionKey: string }) {
  const t = block?.type;
  // Keep hook order stable across every block type (Rules of Hooks).
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  if (t === "paragraph") {
    return block.text ? <p className="cs-body cs-body--block m-0">{block.text}</p> : null;
  }
  if (t === "sitemap") {
    const nodes = block.nodes ?? [];
    return (
      <>
        <div className="cs-flow flex flex-wrap justify-center">
          {block.brand && (
            <div className="cs-node" data-accent="true">
              <span className="cs-node-title block font-bold">{block.brand}</span>
            </div>
          )}
          {nodes.map((n: any) => (
            <div key={n.label} className="cs-node">
              <span className="cs-node-title block font-bold">{n.label}</span>
              {n.sub && <span className="cs-node-sub block font-medium">{n.sub}</span>}
              {Array.isArray(n.children) && n.children.length > 0 && (
                <span className="cs-node-sub block font-normal">{n.children.map((c: any) => c.label).join(" · ")}</span>
              )}
            </div>
          ))}
        </div>
        {block.imageUrl ? (
          <div className="cs-sitemap-media">
            <div className="cs-sitemap-frame">
              <Image src={block.imageUrl} alt={block.brand || "Information architecture"} fill sizes="80vw" className="object-contain" />
            </div>
            <button type="button" className="cs-zoom-btn" onClick={() => setZoomSrc(block.imageUrl)}>
              Zoom In
            </button>
          </div>
        ) : null}
        {zoomSrc ? <ZoomOverlay src={zoomSrc} alt={block.brand || "Information architecture"} onClose={() => setZoomSrc(null)} /> : null}
      </>
    );
  }
  if (t === "journey") {
    const rows: string[][] = block.rows ?? [];
    const cols: string[] = block.columns ?? DEFAULT_JOURNEY_COLUMNS;
    const stages: string[] = block.stages?.length
      ? block.stages
      : [
          "Sign in",
          "Start application",
          "Add vehicles and costs",
          "Collect borrower details",
          "Choose lenders and submit",
          "Track and resolve",
          "Request disbursement",
        ];
    if (block.imageUrl) {
      // CMS-provided journey artwork replaces the tabular view.
      return (
        <div className="cs-journey-media">
          <Image src={block.imageUrl} alt="User journey" fill sizes="80vw" className="object-contain" />
        </div>
      );
    }
    return (
      <div className="cs-tablewrap overflow-x-auto">
        <table className="cs-table w-full border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="font-semibold">Stage</th>
              {cols.map((c: string) => (
                <th key={c} scope="col" className="font-semibold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: string[], i: number) => (
              <tr key={i}>
                <td className="font-semibold">{stages[i] ?? ""}</td>
                {r.map((c: string, j: number) => (
                  <td key={j} className="font-normal">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (t === "flow") {
    return <FlowDiagram block={block} />;
  }
  if (t === "tokens") {
    const groups: any[] = block.groups ?? [];
    const byKind = (k: string) => groups.find((g: any) => g.kind === k);
    const icons = byKind("icons");
    const type = byKind("type");
    const colors = byKind("colors");
    const components = byKind("components");
    const rest = groups.filter(
      (g: any) => g.kind !== "icons" && g.kind !== "type" && g.kind !== "colors" && g.kind !== "components"
    );

    const groupView = (g: any) => (
      <div className="cs-ds-block" key={`${g.kind}-${g.title}`}>
        <h3 className="cs-ds-h3 m-0 font-semibold">{g.title}</h3>
        {g.description && <p className="cs-ds-desc m-0">{g.description}</p>}
        {g.kind === "colors" && (
          <div className="cs-ds-colors grid">
            {(g.colors ?? []).map((c: any) => (
              <span key={c.hex} className="cs-swatch">
                <span className="cs-swatch-box block" style={{ background: c.hex }} aria-hidden />
                <span className="cs-swatch-label block">{c.hex}{c.label ? ` · ${c.label}` : ""}</span>
              </span>
            ))}
          </div>
        )}
        {g.kind === "type" && (
          <div className="cs-ds-type flex flex-wrap">
            {(g.samples ?? []).map((s: any, i: number) => (
              <span key={i} className="cs-type-sample" style={{ fontFamily: s.family || "inherit", fontWeight: s.weight || 400, fontSize: Math.min((s.size || 80) / 4, 48) }}>
                {s.text || "Ag"}
              </span>
            ))}
          </div>
        )}
        {g.kind === "components" && (
          <div className="cs-ds-components flex flex-wrap">
            {(g.components ?? []).flatMap((c: any) => c.items ?? [c.label]).filter(Boolean).map((c: string) => (
              <span key={c} className="cs-chip">{c}</span>
            ))}
          </div>
        )}
        {g.kind === "icons" && (
          <div className="cs-ds-icons">
            <div className="cs-ds-icons-frame">
              {(g.icons ?? DEFAULT_ICONS).map((ic: any, i: number) => {
                if (ic.svgUrl) {
                  return (
                    <span key={i} className="cs-ds-icon" style={{ gridRow: ic.row ?? 1, gridColumn: ic.col ?? 1 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ic.svgUrl} alt={ic.label || "design-system icon"} className="cs-ds-icon-img" />
                    </span>
                  );
                }
                return (
                  <span key={i} className="cs-ds-icon" style={{ gridRow: ic.row, gridColumn: ic.col }}>
                    <MaterialIcon name={ic.name} size={24} />
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="cs-ds">
        <div className="cs-ds-top">
          {groupView(icons ?? { kind: "icons", title: "Icons", icons: DEFAULT_ICONS })}
          {type ? groupView(type) : null}
          {colors ? groupView(colors) : null}
        </div>
        {components ? groupView(components) : null}
        {rest.map((g: any) => groupView(g))}
      </div>
    );
  }
  if (t === "embed") {
    const poster = block.posterUrl || block.url;
    if (!poster || poster === "#") return null;
    const href = block.url && block.url !== "#" ? block.url : `#${sectionKey}`;
    return (
      <div className="cs-embed">
        <a href={href} className="cs-frame-link relative block overflow-hidden">
          <span className="cs-frame-media relative block h-full w-full overflow-hidden">
            <Image src={poster} alt={block.label || sectionKey} fill sizes="80vw" className="absolute inset-0 object-cover" />
          </span>
        </a>
        <a href={href} className="cs-embed-btn inline-flex items-center justify-center font-normal">
          {block.label || "Visit Wireframe"}
        </a>
      </div>
    );
  }
  if (t === "stats") {
    return (
      <div className="cs-stats grid">
        {(block.items ?? []).map((s: any, i: number) => (
          <div key={i} className="cs-stat">
            <span className="cs-stat-dot" aria-hidden />
            {s.group && <p className="cs-stat-group m-0">{s.group}</p>}
            <p className="cs-stat-num m-0 font-medium">
              {s.value}
              {s.suffix && <span className="cs-stat-suffix">{s.suffix}</span>}
            </p>
            {s.label && <p className="cs-stat-desc m-0 font-normal">{s.label}</p>}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function panelMeta(id: string) {
  return PANEL_META[id] ?? { layout: "center" as PanelLayout, left: 180, top: 302, width: 920 };
}

function makePanel(id: string, heading: string, body: string, blocks: any[]): Panel {
  const meta = panelMeta(id);
  return {
    id,
    heading,
    body,
    blocks,
    layout: meta.layout,
    left: meta.left,
    top: meta.top,
    copy: meta.width,
    mediaLeft: meta.mediaLeft ?? meta.left,
    mediaTop: meta.mediaTop ?? 0,
    mediaWidth: meta.mediaWidth ?? meta.width,
    mediaHeight: meta.mediaHeight ?? 0,
    buttonLeft: meta.buttonLeft ?? 0,
    buttonTop: meta.buttonTop ?? 0,
    mobileTop: meta.mobileTop ?? 24,
    mobileGap: meta.mobileGap ?? 32,
  };
}

/** Build the same 11 panels for every project, from either CMS content shape. */
export function buildPanels(project: ProjectItem): Panel[] {
  const rich = legacySections(project);
  if (rich?.length) {
    return rich.map((s) => {
      const paras = s.blocks.filter((b: any) => b.type === "paragraph").map((b: any) => b.text).filter(Boolean);
      const rest = s.blocks.filter((b: any) => b.type !== "paragraph" && b.type);
      const body = paras.join("\n") || s.intro || "";
      return makePanel(s.id, s.title || s.label, body, rest);
    });
  }

  const cs = project.caseStudy ?? {};
  return [
    makePanel("overview", sectionHeading(cs.overview, "Overview"), sectionBody(cs.overview, ""), []),
    makePanel("challenges", sectionHeading(cs.challenges, "The Challenges"), sectionBody(cs.challenges, ""), []),
    makePanel("solutions", sectionHeading(cs.solutions, "The Solutions"), sectionBody(cs.solutions, ""), []),
    makePanel("info-arch", sectionHeading(cs.infoArch, "Information Architecture"), sectionBody(cs.infoArch, ""), [
      { type: "sitemap", brand: project.title, nodes: (cs.infoArch?.nodes?.length ? cs.infoArch.nodes.map((n: any) => ({ label: n.label, sub: n.sub, children: n.children })) : INFO_NODES), imageUrl: cs.infoArch?.imageUrl },
    ]),
    makePanel("user-journey", sectionHeading(cs.userJourney, "User Journey"), sectionBody(cs.userJourney, ""), [
      {
        type: "journey",
        stages: (cs.userJourney?.rows ?? []).map((r) => r.stage),
        rows: (cs.userJourney?.rows ?? []).map((r) => [r.does, r.screens, r.helps]),
        columns: cs.userJourney?.columns?.length ? cs.userJourney.columns : undefined,
        imageUrl: cs.userJourney?.imageUrl,
      },
    ]),
    makePanel("user-flow", sectionHeading(cs.userFlow, "User Flow"), sectionBody(cs.userFlow, ""), [
      {
        type: "flow",
        groups: [
          {
            title: "Flow",
            nodes: cs.userFlow?.nodes?.length
              ? cs.userFlow.nodes.map((n: any) => ({ label: n.title, sub: n.sub }))
              : FLOW_NODES.map((n) => ({ label: n.title, sub: n.sub })),
          },
        ],
        imageUrl: cs.userFlow?.imageUrl,
        buttonLabel: cs.userFlow?.buttonLabel,
      },
    ]),
    makePanel("design-system", sectionHeading(cs.designSystem, "Design System"), sectionBody(cs.designSystem, ""), [
      {
        type: "tokens",
        groups: [
          { kind: "colors", title: "Colors", colors: (cs.designSystem?.colors ?? []).map((hex) => ({ hex })) },
          { kind: "components", title: "Components", components: [{ label: "Components", items: cs.designSystem?.components ?? [] }] },
          { kind: "icons", title: "Icons", icons: (cs.designSystem?.icons ?? []).map((i) => ({ svgUrl: i.svgUrl, label: i.label })) },
          {
            kind: "type",
            title: "Typography",
            samples: (cs.designSystem?.fonts ?? DEFAULT_FONTS).map((f: any) => ({
              family: f.family,
              weight: f.weight,
              text: f.text,
              size: f.size,
            })),
          },
        ],
      },
    ]),
    makePanel("wireframe", sectionHeading(cs.wireframe, "Wireframe"), sectionBody(cs.wireframe, ""), [
      { type: "embed", url: cs.wireframe?.link || "#wireframe", label: "Visit Wireframe", posterUrl: cs.wireframe?.imageUrl },
    ]),
    makePanel("visual-design", sectionHeading(cs.visual, "Visual Design"), sectionBody(cs.visual, ""), [
      { type: "embed", url: cs.visual?.link || "#visual-design", label: "Visit Wireframe", posterUrl: cs.visual?.imageUrl },
    ]),
    makePanel("impact", sectionHeading(cs.impact, "Impact"), sectionBody(cs.impact, "What Changed, Three Ways."), [
      { type: "stats", items: (cs.impact?.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix, group: s.label, label: s.desc })) },
    ]),
    makePanel("conclusion", sectionHeading(cs.conclusion, "Conclusion"), sectionBody(cs.conclusion, ""), []),
  ];
}

/** The body of one ArtBoard panel (heading + copy + diagram/media blocks). */
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
        <h2 className="cs-h2 m-0 font-semibold">{panel.heading}</h2>
        {panel.body && <p className="cs-body m-0 font-semibold">{panel.body}</p>}
      </div>
      {panel.blocks.length > 0 && (
        <div className="cs-panel-media">
          {panel.blocks.map((b: any, i: number) => (
            <Block key={i} block={b} sectionKey={panel.id} />
          ))}
        </div>
      )}
    </div>
  );
}
