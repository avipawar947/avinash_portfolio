import Image from 'next/image';

import GridOverlay from '@/components/ui/GridOverlay';
import GalleryArc from './GalleryArc';
import type { GalleryImageItem } from '@/types/content';

/**
 * "Gallery" — Figma node 1:214 (1920 x 1099).
 *
 * Eight 287px tiles on a 299px pitch forming an arc, plus the hero
 * portrait mirrored at the foot of the section.
 *
 * Below 1024px the arc is replaced by a horizontal scroll strip.
 */
const TILE_WIDTH = 287;
const FIGURE_WIDTH = 1154;
const FIGURE_HEIGHT = 539;

export default function Gallery({ items }: { items: GalleryImageItem[] }) {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: 'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        minHeight: 'calc(1099 * var(--fig))',
      }}
    >
      <GridOverlay />
      <GalleryArc items={items} />

      {/* Hero portrait mirrored, anchored to the foot of the section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 lg:block"
        style={{
          bottom: 'calc(-15 * var(--fig))',
          width: `calc(${FIGURE_WIDTH} * var(--fig))`,
          height: `calc(${FIGURE_HEIGHT} * var(--fig))`,
        }}
      >
        <Image
          src="/images/gallery/figure.webp"
          alt=""
          width={FIGURE_WIDTH * 2}
          height={FIGURE_HEIGHT * 2}
          sizes="60vw"
          className="absolute left-0 top-0 h-full w-full max-w-none object-cover object-bottom"
        />
        {/* Fade that grounds the portrait into the page. */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: 'calc(325 * var(--fig))',
            backgroundImage:
              'linear-gradient(to bottom, rgba(11,11,11,0) 11.377%, rgba(11,11,11,0.6) 55.552%, #0b0b0b 100%)',
          }}
        />
      </div>

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: 'var(--container-max)',
          paddingInline: 'var(--gutter)',
        }}
      >
        <span
          className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
          style={{
            padding: "calc(10 * var(--fig))",
            fontSize: "max(0.75rem, calc(16 * var(--fig)))",
          }}
        >
          Creative Showcase
        </span>

        <h2
          id="gallery-heading"
          className="m-0 font-display text-center font-medium text-[var(--color-text)]"
          style={{
            marginTop: 'var(--heading-gap)',
            fontSize: 'max(2.5rem, calc(160 * var(--fig)))',
            lineHeight: 1.1,
            letterSpacing: 'calc(3.2 * var(--fig))',
          }}
        >
          Gallery
        </h2>
      </div>

      {/* Narrow-screen strip */}
      <ul
        className="relative m-0 mt-10 flex list-none gap-3 overflow-x-auto px-5 pb-4 lg:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((tile, index) => (
          <li
            key={tile._id}
            className="relative shrink-0 overflow-hidden rounded-[4px]"
            style={{
              width: 'min(62vw, 16rem)',
              aspectRatio: `${TILE_WIDTH} / 240`,
              scrollSnapAlign: 'center',
            }}
          >
            {tile.imageUrl ? (
              <Image
                src={tile.imageUrl}
                alt={tile.caption || `Creative work sample ${index + 1}`}
                width={TILE_WIDTH * 2}
                height={240 * 2}
                sizes="(max-width: 1023px) 62vw, 15vw"
                className="absolute left-0 top-0 h-full w-full max-w-none object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[#131313]" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
