import ProjectCard from "@/components/sections/ProjectCard";
import type { ProjectItem } from "@/types/content";

/**
 * Case studies — Figma node 1:127 (1920 x 2028).
 *
 * Measured from the design:
 *   eyebrow       y=142, 122x41, centred
 *   "Case Study"  160px SF Pro Medium, +3.2 tracking, y=203
 *   subtitle      two 32px lines at y=395 and y=443
 *   cards         754x484, left column x=140, right column x=1026 and
 *                 dropped 120px; 121px between cards within a column
 *
 * Laid out in flow rather than absolutely: the composition is a centred
 * header over a two-column stagger, which expressed as flex collapses to
 * a single column on narrow screens without a second composition.
 * Cards come from the CMS; each one's column, crop and wash are read
 * straight off the document.
 *
 * Both canvases (1920 desktop, 393 mobile), the supplied grid artwork and
 * every length live in the `#work` block in app/globals.css — this file is
 * structure plus the CMS wiring.
 */
export default function Projects({ items }: { items: ProjectItem[] }) {
  const left = items.filter((p) => (p.column ?? "left") === "left");
  const right = items.filter((p) => (p.column ?? "left") !== "left");

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
    >
      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{ maxWidth: "var(--container-max)", paddingInline: "var(--gutter)" }}
      >
        <div className="section-heading flex w-full flex-col items-center">
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
            {/* The mobile sheet re-breaks the same sentence, so the second
                line is not orphaned. */}
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

        <div className="projects flex w-full">
          <Column projects={left} />
          <Column projects={right} />
        </div>
      </div>
    </section>
  );
}

function Column({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="project-column">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}