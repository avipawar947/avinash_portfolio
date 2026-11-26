"use client"; // hooks + refs ke liye ab client component hai

import { useRef } from "react";

import ProjectCard from "@/components/sections/ProjectCard";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { ProjectItem } from "@/types/content";

/**
 * Case studies — sticky heading + cards scrolling OVER it.
 *
 * The heading sticks at ~24vh from the viewport top. The card grid sits
 * later in the DOM with a higher z-index, so it paints over the heading
 * as it scrolls. A scrubbed GSAP timeline blurs/dims the heading while
 * the cards cross it and un-blurs it after they leave — matching the
 * supplied video.
 *
 * NOTE: the section must NOT have `overflow-hidden` — any overflow
 * ancestor between a sticky element and the scroll container breaks
 * `position: sticky`. The card drift is already clipped by each card's
 * own `.project-clip`, so it is safe to remove.
 */
export default function Projects({ items }: { items: ProjectItem[] }) {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const projects = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useIsomorphicLayoutEffect(() => {
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!heading || !grid || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // blur in → hold while cards cross → blur out. Durations are
      // proportions of the scrubbed range, not seconds.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top bottom",   // cards enter the viewport
          end: "bottom top",     // last card has left
          scrub: true,
        },
      });

      tl.fromTo(
        heading,
        { filter: "blur(0px)", opacity: 1 },
        { filter: "blur(12px)", opacity: 0.35, ease: "power1.in", duration: 0.35 }
      )
        .to(heading, { duration: 0.3 }) // hold the blur while cards cover it
        .to(heading, {
          filter: "blur(0px)",
          opacity: 1,
          ease: "power1.out",
          duration: 0.35,
        });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative w-full bg-[var(--color-bg)]" // overflow-hidden REMOVED
    >
      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{ maxWidth: "var(--container-max)", paddingInline: "var(--gutter)" }}
      >
        <div
          ref={headingRef}
          className="section-heading sticky z-[1] flex w-full flex-col items-center"
          style={{ top: "24vh", willChange: "filter, opacity" }}
        >
          <span className="eyebrow inline-flex items-center justify-center font-semibold text-[var(--color-text)]">
            Recent Work
          </span>

          <h2
            id="work-heading"
            className="m-0 text-center font-display font-medium text-[var(--color-text)]"
          >
            Case Study
          </h2>

          <p className="m-0 text-center font-display">
            <span className="work-copy-desktop">
              <span className="case-study-intro">
                Every Screen Here Started As A Question,
              </span>
              <span className="case-study-outro">Not A Layout.</span>
            </span>
            <span className="work-copy-mobile">
              <span className="case-study-mobile-intro">
                Every Screen Here Started As
              </span>
              <span className="case-study-mobile-outro">
                A Question, Not A Layout.
              </span>
            </span>
          </p>
        </div>

        <div ref={gridRef} className="projects relative z-[2] w-full">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}