"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";

type View = { x: number; y: number; scale: number };
const MIN = 0.5;
const MAX = 8;
const clamp = (n: number) => Math.min(Math.max(n, MIN), MAX);
const HOME: View = { x: 0, y: 0, scale: 1 };

/**
 * Figma-style pan + zoom for a single stage element (the same interaction as
 * the community-card modal): drag to pan, pinch / buttons to zoom around the
 * centre, wheel to zoom around the pointer, double-click to toggle zoom.
 *
 * `wheel: "always"` is for the full-screen modal. `wheel: "modifier"` is for the
 * inline slide frame, where a bare wheel must keep scrolling the page and only
 * Ctrl / ⌘ + wheel zooms.
 */
function usePanZoom(wheel: "always" | "modifier") {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<View>(HOME);
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ x: number; y: number; vx: number; vy: number; dist: number; scale: number } | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  // Zoom keeping the point (cx, cy) — relative to the stage — fixed on screen.
  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = stageRef.current;
    const px = cx ?? (el?.clientWidth ?? 0) / 2;
    const py = cy ?? (el?.clientHeight ?? 0) / 2;
    setView((v) => {
      const scale = clamp(v.scale * factor);
      const k = scale / v.scale;
      return { scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
    });
  }, []);

  const reset = useCallback(() => setView(HOME), []);

  // Wheel must be a non-passive native listener so it can preventDefault.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (wheel === "modifier" && !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [wheel, zoomAt]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDragging(true);
    const pts = [...pointers.current.values()];
    const v = viewRef.current;
    gesture.current = {
      x: e.clientX,
      y: e.clientY,
      vx: v.x,
      vy: v.y,
      scale: v.scale,
      dist: pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];
    if (pts.length === 2 && g.dist > 0) {
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mx = (pts[0].x + pts[1].x) / 2 - r.left;
      const my = (pts[0].y + pts[1].y) / 2 - r.top;
      const scale = clamp(g.scale * (dist / g.dist));
      const k = scale / g.scale;
      setView({ scale, x: mx - (mx - g.vx) * k, y: my - (my - g.vy) * k });
      return;
    }
    setView((v) => ({ ...v, x: g.vx + (e.clientX - g.x), y: g.vy + (e.clientY - g.y) }));
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
    } else {
      // Re-anchor the remaining finger so the image doesn't jump.
      const [p] = [...pointers.current.values()];
      const v = viewRef.current;
      gesture.current = { x: p.x, y: p.y, vx: v.x, vy: v.y, scale: v.scale, dist: 0 };
    }
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (viewRef.current.scale > 1.05) reset();
    else zoomAt(2.5, e.clientX - r.left, e.clientY - r.top);
  };

  return {
    stageRef,
    view,
    dragging,
    zoomAt,
    reset,
    stageProps: { onPointerDown, onPointerMove, onPointerUp: endPointer, onPointerCancel: endPointer, onDoubleClick },
    contentStyle: { transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` },
  };
}

/**
 * Full-screen draggable + zoomable image modal: drag to pan, wheel / pinch /
 * buttons to zoom around the pointer, double-click to toggle zoom, Esc to close.
 */
export function ZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const pz = usePanZoom("always");
  const { zoomAt, reset } = pz;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomAt(1.25);
      else if (e.key === "-" || e.key === "_") zoomAt(0.8);
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, zoomAt, reset]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="cs-zoom-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cs-zoom-bar">
        <button type="button" onClick={() => zoomAt(1.25)} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoomAt(0.8)} aria-label="Zoom out">−</button>
        <span className="cs-zoom-pct" aria-live="polite">{Math.round(pz.view.scale * 100)}%</span>
        <button type="button" onClick={reset} aria-label="Reset zoom">Reset</button>
        <button type="button" onClick={onClose} aria-label="Close">Close</button>
      </div>
      <div
        ref={pz.stageRef}
        className="cs-zoom-stage"
        data-dragging={pz.dragging ? "true" : undefined}
        {...pz.stageProps}
      >
        <div className="cs-zoom-content" style={pz.contentStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} draggable={false} />
        </div>
      </div>
      <p className="cs-zoom-hint">Drag to move · scroll or pinch to zoom · double-click to zoom in · Esc to close</p>
    </div>,
    document.body
  );
}

/**
 * The in-slide image frame. It is already a pan/zoom canvas (drag, +/−,
 * double-click, Ctrl/⌘ + wheel); the "Zoom In" button opens the same view
 * full screen in {@link ZoomModal}.
 */
export default function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const pz = usePanZoom("modifier");

  return (
    <div className="cs-sitemap-media">
      <div
        ref={pz.stageRef}
        className="cs-sitemap-frame cs-sitemap-frame--pan"
        data-dragging={pz.dragging ? "true" : undefined}
        aria-label={`${alt} — drag to move, double-click to zoom`}
        {...pz.stageProps}
      >
        <div className="cs-zoom-content" style={pz.contentStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} draggable={false} />
        </div>
      </div>
      <div className="cs-zoom-inline-bar">
        <button type="button" onClick={() => pz.zoomAt(0.8)} aria-label="Zoom out">−</button>
        <span className="cs-zoom-pct" aria-live="polite">{Math.round(pz.view.scale * 100)}%</span>
        <button type="button" onClick={() => pz.zoomAt(1.25)} aria-label="Zoom in">+</button>
        <button type="button" onClick={pz.reset} aria-label="Reset zoom">Reset</button>
        <button type="button" className="cs-zoom-btn-inline" onClick={() => setOpen(true)}>
          Zoom In
        </button>
      </div>
      {open ? <ZoomModal src={src} alt={alt} onClose={close} /> : null}
    </div>
  );
}
