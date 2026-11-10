"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/animations";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
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
 * The card is one hit target: an overlay link over the whole card, so the
 * caption can keep its heading role. It opens the case-study detail page
 * (/case-study/[slug]); the media can be an image or a video (CMS mediaType).
 */
export default function ProjectCard({ project }: { project: ProjectItem }) {
  const root = useRef<HTMLElement>(null);
  const captionId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  const slug = project.slug || project._id;
  const href = `/case-study/${slug}`;
  const isVideo = project.mediaType === "video" && !!project.videoUrl;

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

  return (
    <article ref={root} className="project group">
      <span className="project-image" data-cursor="project">
        <span className="project-media" data-card-media>
          {isVideo ? (
            <video
              src={project.videoUrl}
              poster={project.videoPosterUrl || undefined}
              autoPlay
              muted
              loop
              playsInline
              aria-label={project.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : project.imageUrl ? (
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

      <Link
        href={href}
        className="absolute inset-0"
        aria-labelledby={captionId}
        aria-label={`${project.title} — view case study`}
      />
    </article>
  );
}