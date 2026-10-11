import Image from "next/image";

import GridOverlay from "@/components/ui/GridOverlay";
import GalleryArc from "./GalleryArc";
import GalleryArcMobile from "./GalleryArcMobile";
import type { GalleryImageItem } from "@/types/content";

/**
 * "Gallery" — Figma node 1:214 (1920 x 1099).
 *
 * Eight 287px tiles on a 299px pitch forming an arc, plus the hero
 * portrait at the foot of the section.
 *
 * Below 1024px the same arc is re-derived at the design's smaller mobile
 * scale and centred, with the portrait scaled up behind it.
 */
const FIGURE_WIDTH = 1154;
const FIGURE_HEIGHT = 539;

export default function Gallery({ items }: { items: GalleryImageItem[] }) {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="gallery-section relative w-full overflow-hidden bg-[var(--color-bg)]"
    >
      <GridOverlay />
      <GalleryArc items={items} />

      {/* Hero portrait mirrored, anchored to the foot of the section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 lg:block"
        style={{
          bottom: "calc(-15 * var(--fig))",
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
            height: "calc(325 * var(--fig))",
            backgroundImage:
              "linear-gradient(to bottom, rgba(11,11,11,0) 11.377%, rgba(11,11,11,0.6) 55.552%, #0b0b0b 100%)",
          }}
        />
      </div>

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <span className="gallery-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
          Creative Showcase
        </span>

        <h2
          id="gallery-heading"
          className="gallery-heading m-0 font-display text-center font-medium text-[var(--color-text)]"
        >
          Gallery
        </h2>
      </div>

      {/* Phone + tablet composition (< lg) — the design's 393px "Creative
          Showcase" frame: the same arced strip scaled down and centred, with
          the portrait fading into the foot of the section. */}
      <div className="gallery-mobile lg:hidden">
        <GalleryArcMobile items={items} />

        {/* Hero portrait anchored to the foot of the section. */}
        <div className="gallery-figure" aria-hidden="true">
          <Image
            src="/images/gallery/figure.webp"
            alt=""
            width={FIGURE_WIDTH * 2}
            height={FIGURE_HEIGHT * 2}
            sizes="(max-width: 1023px) 143vw, 60vw"
            className="gallery-figure-img"
          />
          <div className="gallery-figure-fade" />
        </div>
      </div>
    </section>
  );
}
