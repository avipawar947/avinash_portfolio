import { SECTION_IDS, SITE } from "@/lib/constants";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroDesktop } from "./HeroDesktop";
import { HeroMobile } from "./HeroMobile";

/**
 * Hero — Figma node 1:3.
 *
 * One frame, three parts: a shared backdrop (texture, portrait, fade)
 * and two foregrounds that swap at 1024px. The desktop foreground is the
 * design's absolute 1920 x 1148 arrangement scaled through `--fig`;
 * below that it is replaced by a portrait stack, because scaling the
 * desktop layout down would render the pill labels at ~3px.
 *
 * The frame height is the design's own; `100svh` is the floor, which is
 * what governs on a phone where 1148 Figma px scales to ~230.
 */
export function Hero() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative w-full overflow-hidden bg-[var(--color-surface)]"
      style={{ height: "calc(1148 * var(--fig))", minHeight: "100svh" }}
    >
      {/* The page's single <h1>.
          Both foregrounds are in the DOM at all times with one hidden,
          so making each one's display type an <h1> would put two in the
          document. The visible name in each is therefore decorative, and
          the real heading lives here once. */}
      <h1 className="sr-only">
        {SITE.name} — {SITE.role}
      </h1>

      <HeroBackdrop />
      <HeroDesktop />
      <HeroMobile />
    </section>
  );
}
