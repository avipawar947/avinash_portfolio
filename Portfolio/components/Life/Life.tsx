"use client";

import Image from "next/image";
import { useRef } from "react";

import { Eyebrow } from "@/components/ui";
import { gsap } from "@/lib/animations";
import { LIFE_CARD, LIFE_PHOTOS, SECTION_IDS } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * "Life Behind The Text" — Figma node 1:410 (1920 x 1157).
 *
 * Measured from the design:
 *   eyebrow   y=140, centred
 *   heading   "The Person Behind the Work" 160px over two lines, y=205
 *   strip     six 380x372 film-frame cards on a 416px pitch at (145,645)
 *
 * The strip is rendered twice and translated by half its width so the
 * loop is seamless, the same construction as the client marquee — and
 * for the same reason: the design authors more cards than its frame can
 * show.
 *
 * The photos are personal snapshots with no captions in the design. They
 * are marked decorative rather than given invented descriptions; the
 * section heading carries the meaning.
 */
export function Life() {
  const track = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const distance = el.scrollWidth / 2;
      const SPEED = 50; // px per second
      gsap.to(el, {
        x: -distance,
        duration: distance / SPEED,
        ease: "none",
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id={SECTION_IDS.life}
      aria-labelledby="life-heading"
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
        <Eyebrow>Beyond the Pixels</Eyebrow>

        <h2
          id="life-heading"
          className="m-0 text-center font-[family-name:var(--font-display)] font-medium text-balance text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            width: "min(100%, calc(1230 * var(--fig)))",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.25,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          The Person Behind the Work
        </h2>
      </div>

      <div
        ref={track}
        className="flex w-max"
        style={{ marginTop: "calc(60 * var(--fig))" }}
      >
        <FilmStrip />
        {/* Second copy exists only to make the loop seamless. */}
        <FilmStrip aria-hidden />
      </div>
    </section>
  );
}

function FilmStrip({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean }) {
  const gap = LIFE_CARD.pitch - LIFE_CARD.width;

  return (
    <ul
      aria-hidden={ariaHidden}
      className="m-0 flex shrink-0 list-none p-0"
      style={{
        gap: `calc(${gap} * var(--fig))`,
        paddingRight: `calc(${gap} * var(--fig))`,
      }}
    >
      {LIFE_PHOTOS.map((photo) => (
        <li
          key={photo.src}
          className="relative shrink-0 overflow-hidden rounded-[4px]"
          style={{
            width: `max(13rem, calc(${LIFE_CARD.width} * var(--fig)))`,
            aspectRatio: `${LIFE_CARD.width} / ${LIFE_CARD.height}`,
            backgroundImage:
              "linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 50.79%, rgba(19,19,19,0.8) 96.159%)",
          }}
        >
          {/* Photo (1:462) — 332x356 inset at (24, 8) of a 380x372 card,
              expressed as percentages so the inset holds at any size. */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${(24 / LIFE_CARD.width) * 100}%`,
              top: `${(8 / LIFE_CARD.height) * 100}%`,
              width: `${(332 / LIFE_CARD.width) * 100}%`,
              height: `${(356 / LIFE_CARD.height) * 100}%`,
            }}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 1023px) 40vw, 20vw"
              className="object-cover"
            />
          </div>

          {/* Sprocket strips (1:416, 1:439) — 16px down each edge. */}
          {(["left", "right"] as const).map((side) => (
            <span
              key={side}
              aria-hidden="true"
              className="absolute top-0 h-full"
              style={{
                [side]: 0,
                width: `${(16 / LIFE_CARD.width) * 100}%`,
                backgroundImage: "url(/svg/film-sprocket.svg)",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
        </li>
      ))}
    </ul>
  );
}
