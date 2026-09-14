"use client";

import { useRef } from "react";
import { gsap } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import type { LifeBehindTextItemContent } from "@/types/content";

const CARD = { width: 380, height: 372, pitch: 416 } as const;

const PHOTO_INSET = {
  left: 24,
  top: 8,
  width: 332,
  height: 356,
} as const;

const SPROCKET_WIDTH = 16;

/**
 * "Beyond the Pixels" — Figma node 1:410 (1920 × 1157).
 *
 * Measured from the design:
 *   eyebrow   y=140, centred
 *   heading   "The Person Behind the Work" 160px over two lines, y=205
 *   strip     six 380×372 film-frame cards on a 416px pitch at (145,645)
 *
 * The strip is rendered twice and translated by half its width so the
 * loop is seamless — the same construction as the client marquee.
 *
 * Images come from the backend (LifeBehindTextItem collection).
 */
export default function LifeBehindText({
  items,
}: {
  items: LifeBehindTextItemContent[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const photos = (items ?? []).filter((it) => it.imageUrl);
  const gap = CARD.pitch - CARD.width;

  useIsomorphicLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion || photos.length === 0) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <section
      id="life-behind"
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
        {/* Eyebrow */}
        <span
          className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
          style={{
            padding: "calc(10 * var(--fig))",
            fontSize: "max(0.75rem, calc(16 * var(--fig)))",
          }}
        >
          Beyond the Pixels
        </span>

        {/* Heading */}
        <h2
          id="life-heading"
          className="m-0 text-center font-display font-medium text-balance text-[var(--color-text)]"
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

      {/* Film-strip track — two copies for seamless loop */}
      {photos.length > 0 && (
        <div
          ref={track}
          className="flex w-max"
          style={{ marginTop: "calc(60 * var(--fig))" }}
        >
          <FilmStrip photos={photos} gap={gap} />
          <FilmStrip photos={photos} gap={gap} aria-hidden />
        </div>
      )}
    </section>
  );
}

/* ── FilmStrip sub-component ──────────────────────────────── */

function FilmStrip({
  photos,
  gap,
  "aria-hidden": ariaHidden = false,
}: {
  photos: { imageUrl: string }[];
  gap: number;
  "aria-hidden"?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="m-0 flex shrink-0 list-none p-0"
      style={{
        gap: `calc(${gap} * var(--fig))`,
        paddingRight: `calc(${gap} * var(--fig))`,
      }}
    >
      {photos.map((photo, idx) => (
        <li
          key={idx}
          className="relative shrink-0 overflow-hidden rounded-[4px]"
          style={{
            width: `max(13rem, calc(${CARD.width} * var(--fig)))`,
            aspectRatio: `${CARD.width} / ${CARD.height}`,
            backgroundImage:
              "linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 50.79%, rgba(19,19,19,0.8) 96.159%)",
          }}
        >
          {/* Photo inset — 332×356 at (24, 8), expressed as percentages */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${(PHOTO_INSET.left / CARD.width) * 100}%`,
              top: `${(PHOTO_INSET.top / CARD.height) * 100}%`,
              width: `${(PHOTO_INSET.width / CARD.width) * 100}%`,
              height: `${(PHOTO_INSET.height / CARD.height) * 100}%`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              style={{ mixBlendMode: "luminosity" }}
              loading="lazy"
            />
          </div>

          {/* Sprocket strips — 16px down each edge */}
          {(["left", "right"] as const).map((side) => (
            <span
              key={side}
              aria-hidden="true"
              className="absolute top-0 h-full"
              style={{
                [side]: 0,
                width: `${(SPROCKET_WIDTH / CARD.width) * 100}%`,
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
