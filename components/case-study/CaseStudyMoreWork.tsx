import ProjectCard from "@/components/sections/ProjectCard";
import type { ProjectItem } from "@/types/content";

/**
 * "More Work" — Figma 857:30990 (misnamed "How I Work Screenshot"):
 * eyebrow 228x41 at y140, "More Work" 160px at y208, two 754x548 cards at
 * y428 with an 82px gap. Mobile 1265:24727 (393x614): eyebrow at y80,
 * title at y140, a horizontal track of 269x238 cards at y260 (24px gap)
 * and a 28x16 scroll indicator at y518.
 */
export default function CaseStudyMoreWork({ related }: { related: ProjectItem[] }) {
  const picks = related.slice(0, 2);
  if (!picks.length) return null;
  return (
    <section id="more-work" aria-label="More work" className="more-work">
      <div className="more-work-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="more-work-fade more-work-fade--top pointer-events-none absolute inset-x-0" aria-hidden />
      <div className="more-work-fade more-work-fade--bottom pointer-events-none absolute inset-x-0" aria-hidden />

      <div className="more-work-inner relative mx-auto flex w-full flex-col items-center">
        <span className="more-work-eyebrow inline-flex items-center justify-center font-semibold">
          More Design Case Studies
        </span>
        <h2 className="more-work-title m-0 text-center font-medium">More Work</h2>

        <div className="more-work-track">
          {picks.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>

        <div className="more-work-scroll" aria-hidden>
          <span className="more-work-scroll-dot" />
          <span className="more-work-scroll-dot is-current" />
          <span className="more-work-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
