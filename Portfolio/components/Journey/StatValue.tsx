"use client";

import { useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/lib/animations";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * The figure and its suffix — Figma nodes 1:297/1:298 and siblings.
 *
 * 160px for the number, 100px for the suffix, sharing a bottom edge 24px
 * from the card's lower-left corner.
 *
 * The count-up is this project's motion, not the design's. It preserves
 * the rendered digit count ("04" stays two digits) so the type does not
 * reflow as it counts, and it is skipped entirely under reduced motion —
 * where the final figure is what renders from the first frame.
 */
export function StatValue({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const target = Number(value);
    // Non-numeric figures have nothing to count; leave them alone.
    if (!Number.isFinite(target)) return;

    const pad = value.length;
    const counter = { n: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () =>
          setDisplay(String(Math.round(counter.n)).padStart(pad, "0")),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, ref);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
      setDisplay(value);
    };
  }, [value, prefersReducedMotion]);

  return (
    <span
      className="absolute flex items-end font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]"
      style={{
        left: "calc(24 * var(--fig))",
        bottom: "calc(24 * var(--fig))",
        // The design places each suffix at its own x, which works out to
        // roughly 12px of air after the figure on every card.
        gap: "calc(12 * var(--fig))",
      }}
    >
      <span
        ref={ref}
        // The live figure changes during the count; announcing every
        // intermediate value would be noise, so only the end state is
        // exposed via the aria-label on the wrapper.
        aria-hidden="true"
        style={{
          fontSize: "max(3rem, calc(160 * var(--fig)))",
          lineHeight: 0.875,
          letterSpacing: "calc(3.2 * var(--fig))",
        }}
      >
        {display}
      </span>
      <span
        aria-hidden="true"
        style={{
          fontSize: "max(1.875rem, calc(100 * var(--fig)))",
          lineHeight: 1,
          letterSpacing: "calc(2 * var(--fig))",
        }}
      >
        {suffix}
      </span>
      <span className="sr-only">{`${value}${suffix}`}</span>
    </span>
  );
}
