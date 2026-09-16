import Image from "next/image";
import HeroPill from "@/components/sections/HeroPill";
import type { HeroContent } from "@/types/content";

/**
 * Hero — Figma node 1:3, 1920 x 1148.
 *
 * One frame, three parts: a shared backdrop (abstract texture at 10%,
 * dark radial shade, portrait, ground fade) and two foregrounds that swap
 * at 1024px. The desktop foreground is the design's absolute arrangement
 * scaled through `--fig`; below that it is replaced by a portrait stack,
 * because compressing the desktop layout would put the pill labels at ~3px.
 *
 * Layer order (back to front), as authored in the file:
 *   1:4   dark radial ground (abstract texture intentionally not staged)
 *   1:24  Character portrait, bottom-anchored (bottom: 69)
 *   1:25  Rectangle 6 — fade grounding the portrait into the page
 *   1:5   Grid guide overlay
 *   1:22  "PRODUCT"   ghost type, 100px @ 20%
 *   1:23  "DESIGNER"  ghost type, 100px @ 20%
 *   1:26  "Avinash Pawar"   200px SF Pro Bold, centre (967, 893)
 *   1:27  "Hello, My Name Is" pill, 13.22deg
 *   1:29  "Open to Work"      pill, 17.33deg
 */
export default function Hero({ content }: { content: HeroContent }) {
  const name = content.name || "Avinash Pawar";
  const characterSrc = content.characterImageUrl || "/images/character.png";
  const ghost = `${content.taglineTop} ${content.taglineBottom}`.trim();

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[var(--color-surface)]"
      style={{ height: "calc(1148 * var(--fig))", minHeight: "100svh" }}
    >
      {/* The page's single <h1>. Both foregrounds are in the DOM at all
          times with one hidden via CSS, and each shows the name, so the
          visible name is decorative and the real heading lives here once. */}
      <h1 className="sr-only">
        {name} — {ghost || "Portfolio"}
      </h1>

      {/* 1:4 — dark radial ground. No texture here; it rendered as a bright
          grey band over the hero, so the Figma abstract is staged off and
          only the shade gradients remain. */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-full lg:h-[calc(1124*var(--fig))] lg:w-[calc(1920*var(--fig))]"
      >
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(102,102,102,0.02) 100%), radial-gradient(120% 70% at 50% 45%, rgba(20,20,20,0.8) 0%, rgba(11,11,11,0.9) 50%, rgba(1,1,1,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundColor: "#FFFFFF",
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(102,102,102,0.02) 100%), radial-gradient(50% 50% at 50% 50%, rgba(20,20,20,0.8) 0%, #010101 100%)",
          }}
        />
      </div>

      {/* 1:5 — guide grid (exact Figma export). Behind the portrait. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden lg:block"
        style={{
          width: "calc(1920 * var(--fig))",
          height: "calc(1150 * var(--fig))",
          backgroundImage: "url(/svg/hero-grid.svg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 1:22 / 1:23 — ghost type. Behind the portrait, as in Figma. */}
      {content.taglineTop && (
        <GhostWord word={content.taglineTop} centerX={604} widthPx={486} />
      )}
      {content.taglineBottom && (
        <GhostWord word={content.taglineBottom} centerX={1393} widthPx={504} />
      )}

      {/* 1:24 — character, bottom-anchored so the crop holds while scaling.
          Centred between the ghost words' T (PRODUCT) and D (DESIGNER) so
          the figure just touches both letters. */}
      <div className="absolute inset-x-0 top-[8%] bottom-[18%] lg:inset-x-auto lg:top-auto lg:left-0 lg:-translate-x-[calc(82*var(--fig))] lg:bottom-[calc(69*var(--fig))] lg:h-[calc(1029*var(--fig))] lg:w-[calc(1920*var(--fig))]">
        <Image
          src={characterSrc}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="pointer-events-none max-w-none object-contain object-bottom grayscale"
        />
      </div>

      {/* 1:25 — the fade that grounds the portrait into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] lg:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,11,11,0) 0%, rgb(11,11,11) 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
        style={{
          bottom: "calc(-2 * var(--fig))",
          width: "calc(1920 * var(--fig))",
          height: "calc(880 * var(--fig))",
          backgroundImage:
            "linear-gradient(180.32deg, rgba(11,11,11,0) 59.327%, rgb(11,11,11) 84.595%)",
        }}
      />

      {/* ============ Desktop foreground (lg and up) ============
           The name and pills sit *in front* of the portrait. */}
      <div className="absolute inset-0 hidden lg:block">
        {/* 1:26 — the name, centre (967, 893) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "calc(1390 * var(--fig))",
            marginLeft: "calc(7 * var(--fig))",
            marginTop: "calc(319 * var(--fig))",
          }}
        >
          <p
            aria-hidden="true"
            className="m-0 text-center font-display font-bold text-[var(--color-text)]"
            style={{
              fontSize: "calc(200 * var(--fig))",
              lineHeight: 1.1,
              letterSpacing: "calc(4 * var(--fig))",
            }}
          >
            {name}
          </p>
        </div>

        {/* 1:27 / 1:29 */}
        <HeroPill
          label={content.badgeText || "Hello, My Name Is"}
          centerX={435.5}
          centerY={830.5}
          widthPx={158}
          rotate={13.22}
          variant="solid"
          delay={0.5}
        />
        {content.statusActive && (
          <HeroPill
            label={content.statusText || "Open to Work"}
            centerX={1220}
            centerY={829}
            widthPx={162}
            rotate={17.33}
            variant="dashed"
            withStatusDot
            delay={0.65}
          />
        )}
      </div>

      {/* ============ Mobile foreground (below 1024px) ============ */}
      <div className="relative flex h-full min-h-[100svh] flex-col justify-end lg:hidden">
        <div className="relative z-10 flex flex-col items-center gap-5 px-5 pb-[max(3rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <HeroPill
              label={content.badgeText || "Hello, My Name Is"}
              variant="solid"
              rotate={-3}
              delay={0.45}
              responsive
            />
            {content.statusActive && (
              <HeroPill
                label={content.statusText || "Open to Work"}
                variant="dashed"
                rotate={3}
                withStatusDot
                delay={0.6}
                responsive
              />
            )}
          </div>

          <p
            aria-hidden="true"
            className="m-0 text-center font-display font-bold text-balance text-[var(--color-text)]"
            style={{
              fontSize: "clamp(2.75rem, 13vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "0.01em",
            }}
          >
            {name}
          </p>

          {ghost && (
            <p
              aria-hidden="true"
              className="m-0 text-center font-display font-bold tracking-[0.12em] opacity-20"
              style={{
                fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
                color: "var(--color-text-ghost)",
              }}
            >
              {ghost}
            </p>
          )}
        </div>
      </div>
    </section>
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
      className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center font-display font-bold whitespace-nowrap opacity-20"
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