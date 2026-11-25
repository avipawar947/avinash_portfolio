'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';

import type { GalleryImageItem } from '@/types/content';
import { mobileMarquee, useGalleryMarquee } from './use-gallery-marquee';

/** Mobile/tablet counterpart of `GalleryArc` — same curved loop, scaled to
 *  the design's `--gal-u` tile width and centred in the mobile frame. */
export default function GalleryArcMobile({ items }: { items: GalleryImageItem[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLDivElement | null>>([]);

  const config = useMemo(
    () => ({
      ...mobileMarquee,
      /* The mobile strip is normalised to its topmost tile, so the shared
         centreline sits half an edge-tile height from the container top. */
      centerY: items.length
        ? Math.max(...items.map((i) => i.height)) / 2
        : 0,
    }),
    [items],
  );
  useGalleryMarquee(items, stage, cards, config);

  if (!items.length) return null;
  const base = items.length;
  const count = base * Math.ceil(10 / base);
  const minTop = Math.min(...items.map((i) => i.top));
  const maxBottom = Math.max(...items.map((i) => i.top + i.height));
  const stripHeight = maxBottom - minTop + 24;

  return (
    <div
      ref={stage}
      className="gallery-arc"
      style={{ height: `calc(${stripHeight} * var(--gal-u) / 287)` }}
    >
      {Array.from({ length: count }, (_, index) => {
        const tile = items[index % base];
        return (
          <div
            key={`${tile._id}-${index}`}
            ref={(el) => {
              cards.current[index] = el;
            }}
            className="gal-marquee-card"
          >
            {tile.imageUrl ? (
              <Image
                src={tile.imageUrl}
                alt={tile.caption || `Creative work sample ${(index % base) + 1}`}
                fill
                sizes="42vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[#131313]" />
            )}
            {tile.link ? (
              <a
                href={tile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-tile-link"
                aria-label={tile.caption || `Open live site ${(index % base) + 1}`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
