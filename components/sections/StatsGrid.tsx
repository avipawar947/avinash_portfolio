import GradientText from "@/components/ui/GradientText";
import type { StatItem, WhyChooseMeContent } from "@/types/content";
import StatCard from "./WhyChooseMe/StatCard";
import ProjectMixCard from "./WhyChooseMe/ProjectMixCard";
import DomainsCard from "./WhyChooseMe/DomainsCard";

/**
 * "Beyond The Numbers" — Figma node 1:273 (1920 x 1375).
 *
 * Measured from the design:
 *   eyebrow      y=140, centred
 *   heading      two 160px lines at y=205 and y=387
 *   grid         three 530px columns at x=140, 695, 1249 with ~25px gaps
 *                — col 1 and 3 hold two 296px figure cards each, col 2
 *                holds the 424px chart above the 167px domains card
 *
 * Expressed as a three-column grid so it collapses to one column below
 * the desktop breakpoint without a second composition.
 */
export default function StatsGrid({
  items,
  config,
}: {
  items: StatItem[];
  config: WhyChooseMeContent;
}) {
  const columnOne = items.filter((s) => s.column === 1);
  const columnThree = items.filter((s) => s.column === 3);

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      {/* the guide grid, offset exactly as in the design (node 1:274) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
        style={{
          width: "calc(1920 * var(--fig))",
          height: "calc(1190 * var(--fig))",
          backgroundImage: "url(/svg/hero-grid.svg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <span className="why-pill inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
          Why Choose Me
        </span>

        <h2
          id="journey-heading"
          className="why-heading m-0 text-center font-display font-medium text-[var(--color-text)]"
        >
          Beyond The
          <br />
          Numbers.
        </h2>

        <div className="why-grid grid w-full grid-cols-1 lg:grid-cols-3">
          <div className="why-col flex flex-col">
            {columnOne.map((stat) => (
              <StatCard key={stat._id} stat={stat} />
            ))}
          </div>

          <div className="why-col flex flex-col">
            <ProjectMixCard bars={config.projectMix} />
            <DomainsCard domains={config.domains} />
          </div>

          <div className="why-col flex flex-col">
            {columnThree.map((stat) => (
              <StatCard key={stat._id} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}