import { Eyebrow, GradientText } from "@/components/ui";
import { ABOUT_LINES, SECTION_IDS } from "@/lib/constants";

/**
 * "My Journey" — Figma node 1:395 / 1:396 (1920 x 1041).
 *
 * Measured from the design:
 *   eyebrow  y=140, centred
 *   heading  "My Journey" 160px, centred, y=205
 *   copy     1365px column at x=278, 32px Semibold, 56px leading,
 *            centred, nine lines whose opacity falls from full to 5%
 *
 * The falloff is static in the design, so it stays static here — a
 * scroll-driven reveal would be animating something the design already
 * expresses as a fixed gradient of attention.
 *
 * Line breaks are authored, not wrapped, so each line is its own element
 * and does not re-break at desktop width. Below 1024px that is no longer
 * possible at any readable size, so the lines join into a flowing
 * paragraph instead.
 */
export function About() {
  return (
    <section
      id={SECTION_IDS.about}
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
        <Eyebrow>About</Eyebrow>

        <h2
          id="about-heading"
          className="m-0 text-center font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.1,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          My Journey
        </h2>

        <p
          className="m-0 text-center font-semibold capitalize"
          style={{
            marginTop: "calc(52 * var(--fig))",
            width: "min(100%, calc(1365 * var(--fig)))",
            fontSize: "max(0.9375rem, calc(32 * var(--fig)))",
            lineHeight: 1.75,
            letterSpacing: "calc(0.64 * var(--fig))",
          }}
        >
          {ABOUT_LINES.map((line) =>
            line.opacity === undefined ? (
              // 1:401 carries the gradient fill rather than an opacity.
              <GradientText
                key={line.text}
                className="lg:block"
                style={{ lineHeight: 1.75 }}
              >
                {line.text}{" "}
              </GradientText>
            ) : (
              <span
                key={line.text}
                className="text-[#b0b0b0] lg:block"
                style={{ opacity: line.opacity, lineHeight: 1.75 }}
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
