import GradientText from "@/components/ui/GradientText";
import ProjectCard from "@/components/sections/ProjectCard";
import type { ProjectItem } from "@/types/content";

/**
 * Case studies — Figma node 1:127 (1920 x 2028).
 *
 * Measured from the design:
 *   eyebrow       y=142, centred
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
 */
export default function Projects({ items }: { items: ProjectItem[] }) {
  const left = items.filter((p) => (p.column ?? "left") === "left");
  const right = items.filter((p) => (p.column ?? "left") !== "left");

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      {/* the guide grid, offset exactly as in the design (node 1:128) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
        style={{
          top: "calc(-178 * var(--fig))",
          width: "calc(1920 * var(--fig))",
          height: "calc(1190 * var(--fig))",
          backgroundImage: "url(/svg/hero-grid.svg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 1:145 — the hero's fade, mirrored, carrying the seam upward */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-full"
        style={{
          top: "calc(-22 * var(--fig))",
          height: "calc(880 * var(--fig))",
          backgroundImage:
            "linear-gradient(-0.32deg, rgba(11,11,11,0) 59.327%, rgb(11,11,11) 84.595%)",
        }}
      />

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{ maxWidth: "var(--container-max)", paddingInline: "var(--gutter)" }}
      >
        <span
          className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
          style={{
            padding: "calc(10 * var(--fig))",
            fontSize: "max(0.75rem, calc(16 * var(--fig)))",
          }}
        >
          Recent Work
        </span>

        <h2
          id="work-heading"
          className="m-0 text-center font-display font-medium text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.25,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          Case Study
        </h2>

        <p
          className="m-0 text-center"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(1rem, calc(32 * var(--fig)))",
            lineHeight: 1.75,
            letterSpacing: "calc(0.64 * var(--fig))",
          }}
        >
          <GradientText className="font-semibold capitalize">
            Every screen here started as a question,
          </GradientText>
          <br />
          {/* 1:148 breaks the gradient: flat #B0B0B0 at 30% opacity. */}
          <span className="font-semibold capitalize text-[#b0b0b0] opacity-30">
            not a layout.
          </span>
        </p>

        {/* Two-column stagger on desktop, one column below it. */}
        <div
          className="flex w-full flex-col lg:flex-row lg:items-start"
          style={{
            marginTop: "calc(68 * var(--fig))",
            gap: "clamp(3rem, calc(132 * var(--fig)), calc(132 * var(--fig)))",
          }}
        >
          <Column projects={left} />
          {/* The design drops the right column by 120px. */}
          <Column
            projects={right}
            className="lg:mt-[calc(120*var(--fig))]"
          />
        </div>
      </div>
    </section>
  );
}

function Column({
  projects,
  className,
}: {
  projects: ProjectItem[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-1 flex-col ${className ?? ""}`}
      style={{
        gap: "clamp(3rem, calc(121 * var(--fig)), calc(121 * var(--fig)))",
      }}
    >
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}