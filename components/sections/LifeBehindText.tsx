"use client";

import { useRef } from "react";
import { gsap } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import type { LifeBehindTextItemContent } from "@/types/content";

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
 *
 * Below `lg` the section switches to the supplied 393 × 840 mobile frame:
 * a 148 × 40 pill at y=160, the heading hand-broken into its three 64px
 * rows, six 224 × 210 cards on a 24px gap at y=508, and the frame's grid
 * behind them washed by its three fades. Sizing lives in `#life-behind`
 * (app/globals.css) so the narrow layout can override it; at ≥1024px every
 * rule there is exactly the inline style it replaced.
 */
export default function LifeBehindText({
  items,
}: {
  items: LifeBehindTextItemContent[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const photos = (items ?? []).filter((it) => it.imageUrl);

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
    >
      {/* ── Phone + tablet backdrop ─────────────────────────────────────
          The 393px frame's 100px grid (verticals at x=100, horizontals
          from y=80) and its three fades, Rectangle 6/7/9. Desktop has no
          backdrop, so the whole layer is dropped at `lg`. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="life-grid" />
        <div className="life-fade life-fade-top" />
        <div className="life-fade life-fade-mid" />
        <div className="life-fade life-fade-bottom" />
      </div>

      <div
        className="life-inner relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        {/* Eyebrow */}
        <span className="life-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
          Beyond the Pixels
        </span>

        {/* Heading */}
        <h2
          id="life-heading"
          className="life-heading m-0 text-center font-display font-medium text-balance text-[var(--color-text)]"
        >
          The Person Behind the Work
        </h2>
      </div>

      {/* Film-strip track — two copies for seamless loop */}
      {photos.length > 0 && (
        <div ref={track} className="life-track relative flex w-max">
          <FilmStrip photos={photos} />
          <FilmStrip photos={photos} aria-hidden />
        </div>
      )}
    </section>
  );
}

/* ── FilmStrip sub-component ──────────────────────────────── */

function FilmStrip({
  photos,
  "aria-hidden": ariaHidden = false,
}: {
  photos: { imageUrl: string }[];
  "aria-hidden"?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="life-strip m-0 flex shrink-0 list-none p-0"
    >
      {photos.map((photo, idx) => (
        <li
          key={idx}
          className="life-card relative shrink-0 overflow-hidden rounded-[4px]"
        >
          {/* Photo inset — 332×356 at (24, 8), expressed as percentages */}
          <div className="life-photo absolute overflow-hidden">
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
              className="life-sprocket absolute top-0 h-full"
              style={{
                [side]: 0,
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
