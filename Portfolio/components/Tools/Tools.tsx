import Image from "next/image";

import { Eyebrow, GradientText, Logo } from "@/components/ui";
import { SECTION_IDS, TOOLS } from "@/lib/constants";
import { ToolTile } from "./ToolTile";

/**
 * "Tools" — Figma node 1:337 (1910 x 1162).
 *
 * Measured from the design:
 *   eyebrow   y=140, centred
 *   heading   "Tools" 160px, centred, y=205
 *   subtitle  two 32px lines at y=389 and y=437
 *   plot      1416 x 485 at y=537, holding ten 94px tiles, two 491x340
 *             curves at (94,51) and (830,51), and a 244px emblem at
 *             (586,106) built from three nested rounded rectangles
 *
 * The constellation is absolutely composed, so below 1024px it becomes a
 * plain grid of the same tiles — the scatter carries no information the
 * grid loses.
 */
export function Tools() {
  return (
    <section
      id={SECTION_IDS.tools}
      aria-labelledby="tools-heading"
      className="relative w-full overflow-hidden rounded-[16px] bg-[var(--color-bg)]"
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
        <Eyebrow>What I Work With</Eyebrow>

        <h2
          id="tools-heading"
          className="m-0 text-center font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.1,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          Tools
        </h2>

        <p
          className="m-0 text-center"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(1rem, calc(32 * var(--fig)))",
            lineHeight: 1.75,
            letterSpacing: "calc(0.64 * var(--fig))",
          }}
        >
          <GradientText className="font-semibold capitalize">
            From Research to wireframes to developer handoff
          </GradientText>
          <br />
          <span className="font-semibold capitalize text-[#b0b0b0] opacity-30">
            the tools behind every project.
          </span>
        </p>

        {/* Constellation (1:343) */}
        <div
          className="relative mt-[calc(60*var(--fig))] hidden lg:block"
          style={{
            width: "calc(1416 * var(--fig))",
            height: "calc(485 * var(--fig))",
          }}
        >
          {/* Connector curves (1:393, 1:394) */}
          <Image
            src="/svg/tools-curve-left.svg"
            alt=""
            aria-hidden="true"
            width={491}
            height={340}
            className="absolute"
            style={{
              left: "calc(94 * var(--fig))",
              top: "calc(51 * var(--fig))",
              width: "calc(491 * var(--fig))",
              height: "calc(340 * var(--fig))",
            }}
          />
          <Image
            src="/svg/tools-curve-right.svg"
            alt=""
            aria-hidden="true"
            width={491}
            height={340}
            // The design mirrors this copy horizontally.
            className="absolute scale-x-[-1]"
            style={{
              left: "calc(830 * var(--fig))",
              top: "calc(51 * var(--fig))",
              width: "calc(491 * var(--fig))",
              height: "calc(340 * var(--fig))",
            }}
          />

          {/* Emblem (1:388) — three nested rounded rectangles, each a
              1px rgba(255,255,255,0.04) stroke, the innermost opaque. */}
          <div
            aria-hidden="true"
            className="absolute grid place-items-center"
            style={{
              left: "calc(586 * var(--fig))",
              top: "calc(106 * var(--fig))",
              width: "calc(244 * var(--fig))",
              height: "calc(244 * var(--fig))",
            }}
          >
            <div
              className="absolute rounded-[16px] border border-[rgba(255,255,255,0.04)]"
              style={{
                width: "calc(244 * var(--fig))",
                height: "calc(244 * var(--fig))",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(19,19,19,0.2) 0%, rgba(44,44,44,0.2) 100%)",
              }}
            />
            <div
              className="absolute rounded-[16px] border border-[rgba(255,255,255,0.04)]"
              style={{
                width: "calc(204 * var(--fig))",
                height: "calc(208 * var(--fig))",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(19,19,19,0.2) 0%, rgba(44,44,44,0.2) 100%)",
              }}
            />
            <div
              className="absolute grid place-items-center rounded-[16px] border border-[rgba(255,255,255,0.04)]"
              style={{
                width: "calc(168 * var(--fig))",
                height: "calc(172 * var(--fig))",
                backgroundImage:
                  "linear-gradient(to bottom, #131313 0%, #2c2c2c 100%)",
              }}
            >
              {/* 1:392 — the same monogram as the navbar, at 118x98. */}
              <Logo widthVar="calc(118 * var(--fig))" />
            </div>
          </div>

          <ul className="m-0 list-none p-0">
            {TOOLS.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </ul>
        </div>

        {/* Narrow-screen grid */}
        <ul className="mt-10 grid w-full max-w-md grid-cols-4 gap-3 p-0 sm:grid-cols-5 lg:hidden">
          {TOOLS.map((tool) => (
            <ToolTile key={tool.name} tool={tool} positioned={false} />
          ))}
        </ul>
      </div>
    </section>
  );
}
