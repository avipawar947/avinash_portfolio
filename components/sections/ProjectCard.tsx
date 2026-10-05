"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/lib/animations";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import CaseStudyDialog from "@/components/ui/CaseStudyDialog";
import type { ProjectItem } from "@/types/content";

/**
 * A single case study — Figma nodes 1:150/1:151 and siblings.
 *
 * Card    754 x 484, hairline inside the frame, radius 8, clipped
 * Image   inset 8px, radius 7, cover-fitted, held at 1.025 on hover
 * Title   24px SF Pro Semibold below the card, with the ↗ on hover
 *
 * Every length is in the `#work` block in app/globals.css, including the
 * 393px mobile twin. The design has no hover or scroll states, so the
 * reveal and the image drift are this project's own; both stay inside the
 * design's vocabulary — a mask wipe rather than a slide, and a drift small
 * enough that the frame never appears to move.
 *
 * The card is one hit target: an overlay button over the whole card, so the
 * caption can keep its heading role. It opens the case study dialog, or
 * follows `link` once the CMS has one.
 */
export default function ProjectCard({ project }: { project: ProjectItem }) {
  const root = useRef<HTMLElement>(null);
  const captionId = useId();
  const [previewOpen, setPreviewOpen] = useState(false);
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

      // Drift: the image trails the card it sits in. It grows as it drifts,
      // which is what keeps the bottom edge covered at the far end of the
      // scrub. The drift rides the media box rather than the <img>, because
      // GSAP writes the individual `scale` property inline as it animates —
      // which would cancel the hover hold that CSS sets on the image itself.
      const image = el.querySelector<HTMLElement>("[data-card-media]");
      if (image) {
        gsap.fromTo(
          image,
          { scale: 1 },
          {
            yPercent: -2,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => {
      ctx.revert();
      // Positions measured before this card animated are now stale.
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  const href = externalHref(project.link);

  return (
    <article ref={root} className="project group">
      <span className="project-image" data-cursor="project">
        <span className="project-media" data-card-media>
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 600px) calc(100vw - 40px), 40vw"
              className="object-cover"
              style={{ objectPosition: `center ${project.cropTop ?? 0}%` }}
            />
          ) : (
            <span className="size-full bg-[#131313]" />
          )}
          {project.wash && <span aria-hidden="true" className="project-wash" />}
        </span>
      </span>

      <h3 id={captionId} className="project-caption font-display">
        {project.title}
        <span aria-hidden="true" className="project-open">
          ↗
        </span>
      </h3>

      <button
        type="button"
        className="absolute inset-0"
        aria-labelledby={captionId}
        onClick={() => {
          if (href) {
            window.open(href, "_blank", "noopener,noreferrer");
            return;
          }
          setPreviewOpen(true);
        }}
      />

      {previewOpen && (
        <CaseStudyDialog
          title={project.title}
          imageUrl={project.imageUrl}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </article>
  );
}

/** Only http(s) leaves the site; anything else is treated as no link yet. */
function externalHref(link: string): string | null {
  if (!link) return null;
  try {
    const url = new URL(link);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}