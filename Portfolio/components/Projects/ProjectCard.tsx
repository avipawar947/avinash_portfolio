"use client";

import Image from "next/image";
import { useRef } from "react";

import { GradientText } from "@/components/ui";
import { gsap, ScrollTrigger } from "@/lib/animations";
import type { Project } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * A single case study — Figma nodes 1:150/1:151 and siblings.
 *
 * Card    754 x 484, 1px rgba(208,208,208,0.2), radius 8, clipped
 * Image   738 x 468 inset 7px, radius 8, cropped per `project.crop`
 * Title   24px SF Pro Semibold below the card, gradient-clipped
 *
 * The design has no hover or scroll states, so the reveal and the hover
 * lift are this project's own. Both stay inside the design's vocabulary:
 * a mask wipe rather than a slide, and a scale small enough that the 1px
 * border does not visibly thicken.
 */
export function ProjectCard({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Reveal: the card uncovers from the bottom as it enters.
      gsap.from(el, {
        clipPath: "inset(12% 0% 0% 0%)",
        opacity: 0,
        y: 48,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      // Parallax: the image drifts slower than the card it sits in.
      gsap.to(el.querySelector("[data-card-image]"), {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
      // Positions measured before this card animated are now stale.
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  return (
    <article ref={root} className="group w-full">
      <div
        data-cursor="project"
        className="relative w-full overflow-hidden rounded-[8px] border border-[rgba(208,208,208,0.2)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.01]"
        style={{
          aspectRatio: "754 / 484",
          padding: "calc(7 * var(--fig))",
        }}
      >
        <div className="relative size-full overflow-hidden rounded-[8px]">
          <Image
            data-card-image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(max-width: 1023px) 100vw, 39vw"
            className="absolute left-0 max-w-none transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
            style={{
              width: "100%",
              // The design scales each fill taller than its frame and
              // nudges it up; these are that crop, per card.
              height: `${project.crop.heightPct}%`,
              top: `${project.crop.topPct}%`,
            }}
          />
          {/* 1:151 alone carries this wash over the image. */}
          {project.wash && (
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[8px]"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.2) 30.638%, rgba(102,102,102,0.2) 100%)",
              }}
            />
          )}
        </div>
      </div>

      <GradientText
        as="h3"
        className="m-0 font-semibold capitalize"
        style={{
          marginTop: "calc(24 * var(--fig))",
          fontSize: "max(1.125rem, calc(24 * var(--fig)))",
          lineHeight: 1.6,
          letterSpacing: "calc(0.48 * var(--fig))",
        }}
      >
        {project.title}
      </GradientText>
    </article>
  );
}
