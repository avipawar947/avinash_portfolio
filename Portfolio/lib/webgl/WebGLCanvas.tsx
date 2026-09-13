"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { type ReactNode } from "react";

import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type WebGLCanvasProps = {
  children: ReactNode;
  /**
   * Rendered instead of the canvas when WebGL is suppressed (reduced
   * motion). This should carry the section's visual identity, not be
   * blank — the design still has to read correctly without the canvas.
   */
  fallback?: ReactNode;
  className?: string;
} & Omit<CanvasProps, "children" | "className">;

/**
 * Shared wrapper for every WebGL surface in the project.
 *
 * Centralises the decisions that must hold everywhere:
 *  - `frameloop="demand"` by default, so a static scene costs nothing
 *    per frame; scenes that genuinely animate opt in with "always".
 *  - Device pixel ratio capped at 2, and at 1.5 on touch devices, which
 *    is where the fill-rate cost actually bites.
 *  - Antialiasing off on touch — the MSAA buffer is the single most
 *    expensive default on mobile GPUs.
 *  - Reduced-motion users get the fallback and no GL context at all.
 *
 * R3F disposes geometries, materials and textures it created when the
 * tree unmounts; anything constructed manually inside a scene still has
 * to dispose itself.
 */
export function WebGLCanvas({
  children,
  fallback = null,
  className,
  frameloop = "demand",
  ...props
}: WebGLCanvasProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  if (prefersReducedMotion) return <>{fallback}</>;

  return (
    <Canvas
      className={className}
      frameloop={frameloop}
      dpr={isTouch ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: !isTouch,
        alpha: true,
        powerPreference: "high-performance",
        // The default depth+stencil buffer is wasted on the fullscreen
        // quads these scenes use.
        stencil: false,
      }}
      // R3F already handles resize via ResizeObserver on the parent;
      // the parent must therefore have a resolved size.
      resize={{ scroll: false, debounce: { scroll: 0, resize: 100 } }}
      {...props}
    >
      {children}
    </Canvas>
  );
}
