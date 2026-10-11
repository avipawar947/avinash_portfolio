'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { gsap, ScrollTrigger } from '@/lib/animations';
import { useIsomorphicLayoutEffect } from '@/lib/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import type { GalleryImageItem } from '@/types/content';

const TILE_WIDTH = 287;

/**
 * The mobile/tablet counterpart of `GalleryArc` — the same arced strip scaled
 * down and centred, but driven by the design's fixed tile width (`--gal-u`).
 *
 * Like the desktop arc it drifts horizontally as the section scrolls past:
 * the full-width mover is scrubbed from +6% to -6%, which shifts the strip by
 * the same fraction of the viewport the desktop arc travels.
 */
export default function GalleryArcMobile({ items }: { items: GalleryImageItem[] }) {
  const mover = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const minLeft = items.length ? Math.min(...items.map((t) => t.left)) : 0;
  const minTop = items.length ? Math.min(...items.map((t) => t.top)) : 0;
  const stripWidth = items.length
    ? Math.max(...items.map((t) => t.left + TILE_WIDTH)) - minLeft
    : TILE_WIDTH;
  const stripHeight = items.length
    ? Math.max(...items.map((t) => t.top + t.height)) - minTop
    : 0;
  /* Every tile dimension is the 287px tile re-expressed as a ratio, so
     `--gal-u` (one tile wide) alone drives the whole composition. */
  const ratio = (n: number) => (n / TILE_WIDTH).toFixed(5);

  useIsomorphicLayoutEffect(() => {
    const el = mover.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: '6%' },
        {
          x: '-6%',
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, mover);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrap}
      className="gallery-arc"
      style={{ height: `calc(${ratio(stripHeight)} * var(--gal-u))` }}
    >
      <div ref={mover} className="gallery-arc-mover">
        <div
          className="gallery-arc-track"
          style={{
            left: `calc(50% - ${ratio(stripWidth / 2)} * var(--gal-u))`,
            width: `calc(${ratio(stripWidth)} * var(--gal-u))`,
          }}
        >
          {items.map((tile, index) => (
            <div
              key={tile._id}
              className="gallery-arc-tile"
              style={{
                left: `calc(${ratio(tile.left - minLeft)} * var(--gal-u))`,
                top: `calc(${ratio(tile.top - minTop)} * var(--gal-u))`,
                width: 'var(--gal-u)',
                height: `calc(${ratio(tile.height)} * var(--gal-u))`,
              }}
            >
              {tile.imageUrl ? (
                <Image
                  src={tile.imageUrl}
                  alt={tile.caption || `Creative work sample ${index + 1}`}
                  fill
                  sizes="(max-width: 1023px) 42vw, 15vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#131313]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
