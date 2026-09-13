"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/animations";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * Custom cursor shell.
 *
 * STRUCTURE ONLY. The visual treatment (size, colour, blend mode, the
 * hover/label states and the magnetic behaviour) is defined by Figma and
 * is filled in once the file is readable. What is settled here is the
 * behaviour that is not a design decision: it never runs on touch
 * devices, it never runs under reduced-motion, and it tracks the pointer
 * off the React render path so it cannot cause re-renders.
 *
 * Elements opt into hover states with `data-cursor="<state>"`.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);

  const enabled = !isTouch && !prefersReducedMotion;

  useEffect(() => {
    const el = cursorRef.current;
    if (!enabled || !el) return;

    document.documentElement.classList.add("has-custom-cursor");

    // Quick-setters bypass the tween-creation cost on every mousemove.
    const setX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const setY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
      }
      setX(event.clientX);
      setY(event.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
      gsap.killTweensOf(el);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 invisible opacity-0"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      {/* TODO(figma): replace with the cursor shape, size, colour and
          blend mode defined in the Figma file. */}
      <div className="-translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-[var(--color-accent)] mix-blend-difference" />
    </div>
  );
}
