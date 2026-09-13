import { Eyebrow, GradientText, GridOverlay } from "@/components/ui";
import { PROCESS, PROCESS_INTRO, SECTION_IDS } from "@/lib/constants";
import { ProcessPill } from "./ProcessPill";

/**
 * "Our Process" — Figma node 1:163 (1920 x 1366).
 *
 * Measured from the design:
 *   eyebrow   x=140, y=140
 *   heading   "Our" / "Process" at 160px, both inside x=140..716,
 *             the second line right-aligned to x=716
 *   copy      right column at x=1249, one gradient line over two muted
 *   table     1640 x 645 at (140, 581), 1px rgba(208,208,208,0.2) border,
 *             a solid vertical rule at x=252 and dashed rules at y=217
 *             and y=435
 *
 * Both rules are drawn in CSS rather than from the exported SVGs: they
 * are a solid hairline and an exact 2-2 dash, which CSS reproduces
 * precisely and renders more crisply at arbitrary scale.
 *
 * The table is absolutely composed, so below 1024px it is replaced by a
 * stacked list of the same phases and steps.
 */
export function Process() {
  return (
    <section
      id={SECTION_IDS.process}
      aria-labelledby="process-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      <GridOverlay />

      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Eyebrow>How I Work</Eyebrow>
            <h2
              id="process-heading"
              className="m-0 font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]"
              style={{
                marginTop: "var(--heading-gap)",
                fontSize: "max(2.5rem, calc(160 * var(--fig)))",
                lineHeight: 1.1,
                letterSpacing: "calc(3.2 * var(--fig))",
              }}
            >
              Our
              {/* The design right-aligns "Process" to the same x=716 edge
                  that "Our" starts from, so the two lines bracket a block
                  rather than stacking flush left. */}
              <span className="block lg:w-[calc(576*var(--fig))] lg:text-right">
                Process
              </span>
            </h2>
          </div>

          <div
            className="lg:shrink-0"
            style={{
              marginTop: "clamp(2rem, calc(120 * var(--fig)), calc(120 * var(--fig)))",
              width: "min(100%, calc(531 * var(--fig)))",
            }}
          >
            <GradientText
              as="h3"
              className="m-0 font-semibold capitalize"
              style={{
                fontSize: "max(1.25rem, calc(32 * var(--fig)))",
                lineHeight: 1.75,
                letterSpacing: "calc(0.64 * var(--fig))",
              }}
            >
              {PROCESS_INTRO.heading}
            </GradientText>
            <p
              className="m-0 capitalize"
              style={{
                marginTop: "calc(12 * var(--fig))",
                fontSize: "max(0.875rem, calc(20 * var(--fig)))",
                lineHeight: 1.6,
                letterSpacing: "calc(0.4 * var(--fig))",
              }}
            >
              <GradientText>{PROCESS_INTRO.lead}</GradientText>{" "}
              {/* 1:212 and 1:213 drop the gradient for flat muted grey. */}
              <span className="text-[rgba(176,176,176,0.3)]">
                {PROCESS_INTRO.rest.join(" ")}
              </span>
            </p>
          </div>
        </div>

        {/* Desktop table (1:185) */}
        <div
          className="relative hidden border border-[rgba(208,208,208,0.2)] lg:block"
          style={{
            marginTop: "calc(40 * var(--fig))",
            height: "calc(645 * var(--fig))",
          }}
        >
          {/* Solid rule separating labels from steps (1:186) */}
          <div
            aria-hidden="true"
            className="absolute top-0 h-full"
            style={{
              left: "calc(252 * var(--fig))",
              width: "1px",
              backgroundColor: "rgba(208,208,208,0.2)",
            }}
          />
          {/* Dashed phase separators (1:187, 1:188) — exact 2-2 dash */}
          {[217, 435].map((top) => (
            <div
              key={top}
              aria-hidden="true"
              className="absolute left-0 w-full"
              style={{
                top: `calc(${top} * var(--fig))`,
                height: "1px",
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(208,208,208,0.4) 0 2px, transparent 2px 4px)",
              }}
            />
          ))}

          {PROCESS.map((phase) => (
            <div key={phase.name}>
              <GradientText
                as="h3"
                className="absolute m-0 font-semibold capitalize"
                style={{
                  left: "calc(30 * var(--fig))",
                  top: `calc(${phase.top} * var(--fig))`,
                  transform: "translateY(-50%)",
                  fontSize: "calc(32 * var(--fig))",
                  lineHeight: 1.75,
                  letterSpacing: "calc(0.64 * var(--fig))",
                }}
              >
                {phase.name}
              </GradientText>
              <ul className="m-0 list-none p-0">
                {phase.steps.map((step) => (
                  <ProcessPill key={step.label} step={step} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Narrow-screen stack — same phases and steps, no cascade */}
        <div className="mt-10 flex flex-col gap-8 lg:hidden">
          {PROCESS.map((phase) => (
            <div
              key={phase.name}
              className="border-t border-[rgba(208,208,208,0.2)] pt-5"
            >
              <GradientText
                as="h3"
                className="m-0 mb-3 text-[1.375rem] font-semibold capitalize"
              >
                {phase.name}
              </GradientText>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {phase.steps.map((step) => (
                  <ProcessPill key={step.label} step={step} positioned={false} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
