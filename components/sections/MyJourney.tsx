import GradientText from "@/components/ui/GradientText";
import type { JourneyContent } from "@/types/content";

/**
 * "My Journey" — Figma node 1:395 / 1:396 (1920 x 1041).
 *
 * Measured from the design:
 *   eyebrow  y=140, centred
 *   heading  "My Journey" 160px, centred, y=205
 *   copy     1365px column at x=278, 32px Semibold, 56px leading,
 *            centred, nine lines whose opacity falls from full to 5%
 *
 * The falloff is static in the design, so it stays static here.
 *
 * Line breaks are authored, not wrapped, so each line is its own element
 * and does not re-break at desktop width. Below 1024px that is no longer
 * possible at any readable size, so the lines join into a flowing
 * paragraph instead.
 */
export default function MyJourney({ content }: { content: JourneyContent }) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <span
          className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
          style={{
            padding: "calc(10 * var(--fig))",
            fontSize: "max(0.75rem, calc(16 * var(--fig)))",
          }}
        >
          About
        </span>

        <h2
          id="about-heading"
          className="m-0 font-display text-center font-medium text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.1,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          {content.heading}
        </h2>

        <p
          className="m-0 text-center font-semibold capitalize"
          style={{
            marginTop: "calc(52 * var(--fig))",
            width: "min(100%, calc(1365 * var(--fig)))",
            fontSize: "max(0.9375rem, calc(32 * var(--fig)))",
            lineHeight: 2,
            letterSpacing: "calc(0.64 * var(--fig))",
          }}
        >
          {content.lines.map((line) =>
            line.opacity === undefined || line.opacity === null ? (
              // First line carries the gradient fill rather than an opacity.
              <GradientText
                key={`${line.text}-gradient`}
                className="block lg:whitespace-nowrap"
                style={{ lineHeight: 2 }}
              >
                {line.text}{" "}
              </GradientText>
            ) : (
              <span
                key={`${line.text}-muted`}
                className="block text-[#b0b0b0] lg:whitespace-nowrap"
                style={{ opacity: line.opacity, lineHeight: 1.85 }}
              >
                {line.text}{" "}
              </span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
