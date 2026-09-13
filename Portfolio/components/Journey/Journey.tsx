import { Eyebrow, GridOverlay } from "@/components/ui";
import { SECTION_IDS, STATS } from "@/lib/constants";
import { DomainsCard } from "./DomainsCard";
import { ProjectMixCard } from "./ProjectMixCard";
import { StatCard } from "./StatCard";

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
export function Journey() {
  const columnOne = STATS.filter((stat) => stat.column === 1);
  const columnThree = STATS.filter((stat) => stat.column === 3);

  return (
    <section
      id={SECTION_IDS.journey}
      aria-labelledby="journey-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      <GridOverlay />

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <Eyebrow>Why Choose Me</Eyebrow>

        <h2
          id="journey-heading"
          className="m-0 text-center font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.13,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          Beyond The
          <br />
          Numbers.
        </h2>

        <div
          className="grid w-full grid-cols-1 lg:grid-cols-3"
          style={{
            marginTop: "calc(60 * var(--fig))",
            gap: "clamp(1rem, calc(25 * var(--fig)), calc(25 * var(--fig)))",
          }}
        >
          <div
            className="flex flex-col"
            style={{
              gap: "clamp(1rem, calc(24 * var(--fig)), calc(24 * var(--fig)))",
            }}
          >
            {columnOne.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div
            className="flex flex-col"
            style={{
              gap: "clamp(1rem, calc(25 * var(--fig)), calc(25 * var(--fig)))",
            }}
          >
            <ProjectMixCard />
            <DomainsCard />
          </div>

          <div
            className="flex flex-col"
            style={{
              gap: "clamp(1rem, calc(24 * var(--fig)), calc(24 * var(--fig)))",
            }}
          >
            {columnThree.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
