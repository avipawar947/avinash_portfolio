'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { gsap, ScrollTrigger } from '@/lib/animations';
import { useIsomorphicLayoutEffect } from '@/lib/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import type { GalleryImageItem } from '@/types/content';

const TILE_WIDTH = 287;

export default function GalleryArc({ items }: { items: GalleryImageItem[] }) {
  const root = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: '6%' },
        {
          x: '-6%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [prefersReducedMotion]);

  return (
    <ul
      ref={root}
      className="pointer-events-none absolute inset-0 m-0 hidden list-none p-0 lg:block"
    >
      {items.map((tile, index) => (
        <li
          key={tile._id}
          className="absolute overflow-hidden"
          style={{
            left: `calc(${tile.left} * var(--fig))`,
            top: `calc(${tile.top} * var(--fig))`,
            width: `calc(${TILE_WIDTH} * var(--fig))`,
            height: `calc(${tile.height} * var(--fig))`,
          }}
        >
          {tile.imageUrl ? (
            <Image
              src={tile.imageUrl}
              alt={tile.caption || `Creative work sample ${index + 1}`}
              width={TILE_WIDTH * 2}
              height={tile.height * 2}
              sizes="(max-width: 1023px) 62vw, 15vw"
              className="absolute left-0 top-0 h-full w-full max-w-none object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#131313]" />
          )}
        </li>
      ))}
    </ul>
  );
}
