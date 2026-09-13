"use client";

import { useRef, type ReactNode } from "react";

import { gsap } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";

/**
 * Entrance choreography for the hero's foreground layer.
 *
 * The Figma file carries no prototype, so the timing is this project's
 * own. It is deliberately restrained: the name rises under a clip-path
 * mask, which is the one moment in the page that earns a scripted
 * entrance. The pills animate themselves in Framer Motion — GSAP must
 * not also write their transform, or the two libraries fight over it.
 *
 * `gsap.context` scopes the selectors to this subtree and reverts every
 * tween and inline style on unmount.
 */
export function HeroReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    // Under reduced motion the markup is already in its final state, so
    // there is nothing to do and nothing to clean up.
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-name]", {
        yPercent: 40,
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        ease: "expo.out",
        duration: 1.2,
      });
    }, scope);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
