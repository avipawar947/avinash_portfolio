import { HeroPill } from "./HeroPill";
import { HeroReveal } from "./HeroReveal";

/**
 * Mobile hero foreground (< 1024px).
 *
 * The Figma file contains only the 1920 desktop frame, so there is no
 * mobile composition to reproduce. Rather than scale the desktop layout
 * down — which would put the pill labels at ~3px — this rebuilds the
 * same idea as a portrait stack, using only the design's own vocabulary.
 *
 * The texture, portrait and fade come from `HeroBackdrop`, shared with
 * the desktop composition so neither set of images is fetched twice.
 *
 * The ghost "PRODUCT / DESIGNER" pair becomes a single line beneath the
 * name: at this width the two words cannot sit either side of the
 * portrait without colliding with it, and the design gives no guidance
 * for stacking them.
 */
export function HeroMobile() {
  return (
    <div className="relative flex h-full min-h-[100svh] flex-col justify-end lg:hidden">
      <HeroReveal>
        <div className="relative z-10 flex flex-col items-center gap-5 px-5 pb-[max(3rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <HeroPill
              label="Hello, My Name Is"
              variant="solid"
              rotate={-3}
              delay={0.45}
              responsive
            />
            <HeroPill
              label="Open to Work"
              variant="dashed"
              rotate={3}
              withStatusDot
              delay={0.6}
              responsive
            />
          </div>

          <p
            aria-hidden="true"
            data-hero-name
            className="m-0 text-center font-[family-name:var(--font-display)] font-bold text-balance text-[var(--color-text)]"
            style={{
              fontSize: "clamp(2.75rem, 13vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "0.01em",
            }}
          >
            Avinash Pawar
          </p>

          <p
            aria-hidden="true"
            className="m-0 text-center font-[family-name:var(--font-display)] font-bold tracking-[0.12em] opacity-20"
            style={{
              fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
              color: "var(--color-text-ghost)",
            }}
          >
            PRODUCT DESIGNER
          </p>
        </div>
      </HeroReveal>
    </div>
  );
}
