'use client';

import Image from 'next/image';
import { useRef } from 'react';

import type { GalleryImageItem } from '@/types/content';
import { desktopMarquee, useGalleryMarquee } from './use-gallery-marquee';

/**
 * The desktop Gallery arc — a continuous loop where every card bends onto
 * the design's curve via a perspective matrix as it travels left.
 */
export default function GalleryArc({ items }: { items: GalleryImageItem[] }) {
  const stage = useRef<HTMLUListElement>(null);
  const cards = useRef<Array<HTMLLIElement | null>>([]);
  useGalleryMarquee(items, stage, cards, desktopMarquee);

  if (!items.length) return null;
  const base = items.length;
  const count = base * Math.ceil(10 / base);

  return (
    <ul
      ref={stage}
      className="pointer-events-none absolute inset-0 m-0 hidden list-none p-0 lg:block"
    >
      {Array.from({ length: count }, (_, index) => {
        const tile = items[index % base];
        return (
          <li
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
                sizes="15vw"
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
          </li>
        );
      })}
    </ul>
  );
}
