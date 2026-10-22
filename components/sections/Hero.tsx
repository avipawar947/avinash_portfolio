import Image from "next/image";
import HeroPill from "@/components/sections/HeroPill";
import type { HeroContent } from "@/types/content";

/**
 * Hero — Figma node 1:3 (desktop, 1920 x 1148) and the 393 x 780 mobile frame.
 *
 * Two completely separate compositions, swapped at 1024px:
 *
 *  - Desktop (>= lg): unchanged — absolute layers scaled through `--fig`.
 *  - Mobile + tablet (< lg): the Figma mobile frame, rebuilt layer by layer
 *    with the `.hero-m-*` / `.hero-character` classes from globals.css.
 *    Every size/position there is `calc(<figma px> * var(--hero-u))`, so a
 *    phone renders the frame 1:1 and a tablet gets the same composition,
 *    scaled and centred.
 *
 * Mobile layer order (back to front) = Figma order:
 *   bg -> grey-gradient-abstract -> Grid -> PRODUCT / DESIGNER ghost type ->
 *   Character -> Rectangle 6 fade -> "Avinash" / "Pawar" -> pills.
 */
export default function Hero({ content }: { content: HeroContent }) {
  const name = content.name || "Avinash Pawar";
  const characterSrc = content.characterImageUrl || "/images/character.png";
  const ghost = `${content.taglineTop} ${content.taglineBottom}`.trim();

  // Mobile shows the name on two lines: "Avinash" / "Pawar".
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <section
      id="home"
      className="hero-root relative w-full overflow-hidden bg-[var(--color-surface)]"
    >
      {/* The page's single <h1>; both visible names are decorative. */}
      <h1 className="sr-only">
        {name} — {ghost || "Portfolio"}
      </h1>

      {/* ================================================================
          MOBILE + TABLET (< 1024px) — Figma 393 x 780 frame
          ================================================================ */}
      <div aria-hidden="true" className="absolute inset-0 lg:hidden">
        {/* Frame fill + grey-gradient-abstract 1 */}
        <div className="hero-m-bg" />
        <div className="hero-m-abstract" />

        {/* Grid — 100px cells, 1px rgba(208,208,208,0.05) */}
        <div className="hero-m-grid" />

        {/* PRODUCT / DESIGNER ghost type — behind the character */}
        {content.taglineTop && (
          <span className="hero-m-ghost hero-m-ghost--product">
            {content.taglineTop}
          </span>
        )}
        {content.taglineBottom && (
          <span className="hero-m-ghost hero-m-ghost--designer">
            {content.taglineBottom}
          </span>
        )}

        {/* Character — 799.26 x 428.35 */}
        <div className="hero-character absolute">
          <Image
            src={characterSrc}
            alt=""
            fill
            priority
            sizes="800px"
            className="pointer-events-none max-w-none object-contain object-center grayscale"
          />
        </div>

        {/* Rectangle 6 — fade that grounds the character into the page */}
        <div className="hero-m-fade" />

        {/* "Avinash" / "Pawar" — in front of the fade */}
        <p className="hero-m-name hero-m-name--first">{firstName}</p>
        {lastName && (
          <p className="hero-m-name hero-m-name--last">{lastName}</p>
        )}

        {/* "Hello, My Name Is" — dashed pill, rotated 15deg */}
        <div
          className="hero-m-pill hero-m-pill--hello"
          style={{ transform: "rotate(15deg)" }}
        >
          <div className="hero-m-pill-body">
            <span className="hero-m-pill-label">
              {content.badgeText || "Hello, My Name Is"}
            </span>
          </div>
        </div>

        {/* "Open to Work" — dashed pill + green status dot, rotated 17deg */}
        {content.statusActive && (
          <div
            className="hero-m-pill hero-m-pill--status"
            style={{ transform: "rotate(17deg)" }}
          >
            <div className="hero-m-pill-body hero-m-pill-body--status">
              <span className="hero-m-dot-wrap">
                <span className="hero-m-dot-ring" />
                <span className="hero-m-dot" />
              </span>
              <span className="hero-m-pill-label">
                {content.statusText || "Open to Work"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================
          DESKTOP (>= 1024px) — 1920 x 1148 frame, unchanged
          ================================================================ */}
      <div className="absolute inset-0 hidden lg:block">
        {/* 1:4 — dark radial ground */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0"
          style={{
            width: "calc(1920 * var(--fig))",
            height: "calc(1124 * var(--fig))",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#FFFFFF",
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(102,102,102,0.02) 100%), radial-gradient(50% 50% at 50% 50%, rgba(20,20,20,0.8) 0%, #010101 100%)",
            }}
          />
        </div>

        {/* 1:5 — guide grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0"
          style={{
            width: "calc(1920 * var(--fig))",
            height: "calc(1150 * var(--fig))",
            backgroundImage: "url(/svg/hero-grid.svg)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* 1:22 / 1:23 — ghost type */}
        {content.taglineTop && (
          <GhostWord word={content.taglineTop} centerX={604} widthPx={486} />
        )}
        {content.taglineBottom && (
          <GhostWord
            word={content.taglineBottom}
            centerX={1393}
            widthPx={504}
          />
        )}

        {/* 1:24 — character */}
        <div className="absolute left-0 bottom-[calc(69*var(--fig))] h-[calc(1029*var(--fig))] w-[calc(1920*var(--fig))] -translate-x-[calc(82*var(--fig))]">
          <Image
            src={characterSrc}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="pointer-events-none max-w-none object-contain object-bottom grayscale"
          />
        </div>

        {/* 1:25 — fade grounding the portrait */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "calc(-2 * var(--fig))",
            width: "calc(1920 * var(--fig))",
            height: "calc(880 * var(--fig))",
            backgroundImage:
              "linear-gradient(180.32deg, rgba(11,11,11,0) 59.327%, rgb(11,11,11) 84.595%)",
          }}
        />

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
          centerX={435}
          centerY={826}
          widthPx={158}
          rotate={13.22}
          variant="solid"
          delay={0.5}
        />
        {content.statusActive && (
          <HeroPill
            label={content.statusText || "Open to Work"}
            centerX={1222}
            centerY={823}
            widthPx={162}
            rotate={17.33}
            variant="dashed"
            withStatusDot
            delay={0.65}
          />
        )}
      </div>
    </section>
  );
}

/**
 * 1:22 / 1:23 — "PRODUCT" and "DESIGNER" (desktop only).
 * 100px SF Pro Bold, +2 tracking, rgba(224,224,224,0.8) at 20% opacity.
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
