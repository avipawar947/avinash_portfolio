"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap } from "@/lib/animations";
import { CLIENT_LOGOS, SECTION_IDS } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Client logo marquee — Figma node 1:47.
 *
 * The design draws one 3136px strip of eleven logos, each 60px tall with
 * a 140px gap, overhanging both edges of the 1920 frame. That overhang
 * is the design telling us it scrolls, so the strip is rendered twice
 * and translated by exactly half its width — at which point copy two is
 * where copy one began and the loop is seamless.
 *
 * Duration is derived from width rather than fixed, so logos travel at a
 * constant speed regardless of how many there are.
 */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Half the track is one full copy of the strip.
      const distance = el.scrollWidth / 2;
      const SPEED = 60; // px per second

      gsap.to(el, {
        x: -distance,
        duration: distance / SPEED,
        ease: "none",
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id={SECTION_IDS.clients}
      aria-label="Clients and organisations I have worked with"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{ paddingBlock: "max(2.5rem, calc(100 * var(--fig)))" }}
    >
      <div ref={track} className="flex w-max items-center">
        <LogoStrip />
        {/* Second copy exists only to make the loop seamless. */}
        <LogoStrip aria-hidden />
      </div>
    </section>
  );
}

function LogoStrip({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="m-0 flex shrink-0 list-none items-center p-0"
      style={{
        gap: "calc(140 * var(--fig))",
        // Keep the gap before the next copy identical to the internal one.
        paddingRight: "calc(140 * var(--fig))",
      }}
    >
      {CLIENT_LOGOS.map((logo) => (
        <li
          key={logo.src}
          className="relative shrink-0"
          style={{
            width: `calc(${logo.width} * var(--fig))`,
            height: "calc(60 * var(--fig))",
          }}
        >
          <Image
            src={logo.src}
            alt={ariaHidden ? "" : logo.alt}
            fill
            sizes={`${logo.width}px`}
            className={cn(
              "object-contain",
              // 1:76 alone carries mix-blend-mode: luminosity.
              logo.luminosity && "mix-blend-luminosity",
            )}
          />
        </li>
      ))}
    </ul>
  );
}
