"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/animations";
import { GALLERY_TILES, GALLERY_TILE_WIDTH } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * The arc of tiles — Figma nodes 1:235 to 1:242.
 *
 * Positions are the design's own. The row is authored wider than the
 * frame on both sides, so it drifts horizontally as the section passes
 * through the viewport: at rest it sits exactly where Figma places it,
 * and the overhang on either side is what gets revealed.
 *
 * The drift is scrubbed to scroll rather than run on a timer, so the
 * design's composition is what you see when the section is centred.
 *
 * These tiles are the section's content, not decoration, so they carry
 * alt text. The design names none of them, so the text is positional —
 * replace it with real titles when they exist.
 */
export function GalleryArc() {
  const root = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: "6%" },
        {
          x: "-6%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  return (
    <ul
      ref={root}
      className="pointer-events-none absolute inset-0 m-0 hidden list-none p-0 lg:block"
    >
      {GALLERY_TILES.map((tile, index) => (
        <li
          key={tile.src}
          className="absolute overflow-hidden"
          style={{
            left: `calc(${tile.left} * var(--fig))`,
            top: `calc(${tile.top} * var(--fig))`,
            width: `calc(${GALLERY_TILE_WIDTH} * var(--fig))`,
            height: `calc(${tile.height} * var(--fig))`,
          }}
        >
          <Image
            src={tile.src}
            alt={`Creative work sample ${index + 1}`}
            fill
            sizes="(max-width: 1023px) 62vw, 15vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
