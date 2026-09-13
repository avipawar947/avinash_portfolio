import { GridOverlay } from "@/components/ui";
import { HeroPill } from "./HeroPill";
import { HeroReveal } from "./HeroReveal";

/**
 * Desktop hero foreground — Figma node 1:3 (1920 x 1148).
 *
 * Layer order, back to front, as authored:
 *   1:5   Grid                     1920 x 1150 guide overlay
 *   1:22  "PRODUCT"                100px, 20% opacity, centre (604, 700)
 *   1:23  "DESIGNER"               100px, 20% opacity, centre (1393, 700)
 *   1:26  "Avinash Pawar"          200px, centre (967, 893)
 *   1:27  "Hello, My Name Is"      pill, 13.22deg
 *   1:29  "Open to Work"           pill, 17.33deg
 *
 * The texture, portrait and fade behind all of this live in
 * `HeroBackdrop`, shared with the mobile composition so neither set of
 * images is fetched twice.
 *
 * A server component: only the entrance and the floating pills are
 * client islands.
 */
export function HeroDesktop() {
  return (
    <div className="absolute inset-0 hidden lg:block">
      {/* 1:5 — guide grid */}
      <GridOverlay />

      {/* 1:22 / 1:23 — ghost type behind the portrait */}
      <GhostWord word="PRODUCT" centerX={604} widthPx={486} />
      <GhostWord word="DESIGNER" centerX={1393} widthPx={504} />

      <HeroReveal>
        {/* The centring transform stays on this wrapper so GSAP can own
            the inner element's transform outright. */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "calc(1390 * var(--fig))",
            marginTop: "calc(319 * var(--fig))",
            marginLeft: "calc(7 * var(--fig))",
          }}
        >
          <p
            aria-hidden="true"
            data-hero-name
            className="m-0 text-center font-[family-name:var(--font-display)] font-bold text-[var(--color-text)]"
            style={{
              fontSize: "calc(200 * var(--fig))",
              lineHeight: 1.1,
              letterSpacing: "calc(4 * var(--fig))",
            }}
          >
            Avinash Pawar
          </p>
        </div>

        {/* 1:27 */}
        <HeroPill
          label="Hello, My Name Is"
          centerX={438.48}
          centerY={825.54}
          widthPx={158}
          rotate={13.22}
          variant="solid"
          delay={0.5}
        />

        {/* 1:29 */}
        <HeroPill
          label="Open to Work"
          centerX={1226.28}
          centerY={824.22}
          widthPx={162}
          rotate={17.33}
          variant="dashed"
          withStatusDot
          delay={0.65}
        />
      </HeroReveal>
    </div>
  );
}

/**
 * 1:22 / 1:23 — "PRODUCT" and "DESIGNER".
 *
 * 100px SF Pro Bold, +2 tracking, rgba(224,224,224,0.8) at 20% layer
 * opacity, vertically centred at y=700 in the 1148 frame.
 */
function GhostWord({
  word,
  centerX,
  widthPx,
}: {
  word: string;
  centerX: number;
  widthPx: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center font-[family-name:var(--font-display)] font-bold whitespace-nowrap opacity-20"
      style={{
        left: `calc(${centerX} * var(--fig))`,
        marginTop: "calc(126 * var(--fig))",
        width: `calc(${widthPx} * var(--fig))`,
        height: "calc(106 * var(--fig))",
        fontSize: "calc(100 * var(--fig))",
        letterSpacing: "calc(2 * var(--fig))",
        color: "var(--color-text-ghost)",
      }}
    >
      {word}
    </span>
  );
}
