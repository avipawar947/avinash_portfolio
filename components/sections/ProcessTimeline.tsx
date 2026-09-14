import GradientText from "@/components/ui/GradientText";
import type { ProcessStepItem, ProcessIntroContent } from "@/types/content";
import ProcessPill from "./ProcessPill";

/**
 * "Our Process" — Figma node 1:163 (1920 x 1366).
 *
 * Desktop table: 1640 x 645 at (140, 581), 1px rgba(208,208,208,0.2)
 * border, a solid vertical rule at x=252, dashed rules at y=217 and y=435.
 * Each phase labels its column; its steps cascade rightward as pills.
 * Narrow screens show a flat stacked list instead.
 */
export default function ProcessTimeline({
  items,
  intro,
}: {
  items: ProcessStepItem[];
  intro: ProcessIntroContent;
}) {
  const phases = ['Discover', 'Define', 'Deliver'] as const;
  const grouped = phases.map((p) => ({
    name: p,
    steps: items.filter((s) => s.phase === p).sort((a, b) => a.order - b.order),
  }));

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span
              className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
              style={{
                padding: "calc(10 * var(--fig))",
                fontSize: "max(0.75rem, calc(16 * var(--fig)))",
              }}
            >
              How I Work
            </span>
            <h2
              id="process-heading"
              className="m-0 font-display font-medium text-[var(--color-text)]"
              style={{
                marginTop: "var(--heading-gap)",
                fontSize: "max(2.5rem, calc(160 * var(--fig)))",
                lineHeight: 1.1,
                letterSpacing: "calc(3.2 * var(--fig))",
              }}
            >
              Our
              <span className="block lg:w-[calc(576*var(--fig))] lg:text-right">
                Process
              </span>
            </h2>
          </div>

          <div
            className="lg:shrink-0 lg:self-end"
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
              {intro.heading}
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
              <GradientText>{intro.lead}</GradientText>{" "}
              <span className="text-[rgba(176,176,176,0.3)]">
                {intro.rest.join(" ")}
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
          {/* Dashed phase separators (1:187, 1:188) */}
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

          {grouped.map((phase) => {
            // Phase label centres vertically on the first pill: pill top + 21px (half of 42).
            const phaseLabelTop = phase.steps.length
              ? Math.min(...phase.steps.map((s) => s.top)) + 21
              : 50;
            return (
              <div key={phase.name}>
                <GradientText
                  as="h3"
                  className="absolute m-0 font-semibold capitalize"
                  style={{
                    left: "calc(30 * var(--fig))",
                    top: `calc(${phaseLabelTop} * var(--fig))`,
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
                    <ProcessPill key={step._id} step={step} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Narrow-screen stack */}
        <div className="mt-10 flex flex-col gap-8 lg:hidden">
          {grouped.map((phase) => (
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
                  <ProcessPill key={step._id} step={step} positioned={false} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}