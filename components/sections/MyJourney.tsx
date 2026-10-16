import GradientText from "@/components/ui/GradientText";
import type { JourneyContent } from "@/types/content";

/**
 * "My Journey" — Figma node 1:395 / 1:396 (1920 x 1041) desktop,
 * and the 393 x 1260 mobile frame supplied alongside it.
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
 * paragraph instead — sized by the mobile frame (20px/40px pitch, 64px
 * heading, the bottom fade) via `#about` in globals.css.
 *
 * All sizing lives in globals.css rather than inline styles so that
 * narrow-layout media query can override it without `!important`.
 */
export default function MyJourney({ content }: { content: JourneyContent }) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
    >
      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <span className="about-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
          About
        </span>

        <h2
          id="about-heading"
          className="about-heading m-0 font-display text-center font-medium text-[var(--color-text)]"
        >
          {content.heading}
        </h2>

        <p className="about-copy m-0 text-center font-semibold capitalize">
          {content.lines.map((line) =>
            line.opacity === undefined || line.opacity === null ? (
              // First line carries the gradient fill rather than an opacity.
              <GradientText
                key={`${line.text}-gradient`}
                className="about-line about-line-gradient block lg:whitespace-nowrap"
              >
                {line.text}{" "}
              </GradientText>
            ) : (
              <span
                key={`${line.text}-muted`}
                className="about-line about-line-muted block text-[#b0b0b0] lg:whitespace-nowrap"
                style={{ opacity: line.opacity }}
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
