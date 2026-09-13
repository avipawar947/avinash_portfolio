import Image from "next/image";

import { Eyebrow, GridOverlay } from "@/components/ui";
import { GALLERY_TILES, SECTION_IDS } from "@/lib/constants";
import { GalleryArc } from "./GalleryArc";

/**
 * "Gallery" — Figma node 1:214 (1920 x 1099).
 *
 * Measured from the design:
 *   eyebrow   y=140, centred
 *   heading   "Gallery" 160px, centred, y=205
 *   tiles     eight 287px tiles on a 299px pitch forming an arc
 *   figure    the hero portrait mirrored, 1153x539 centred at y=844,
 *             with a second 1154x325 copy fading into #0B0B0B at the
 *             section's foot
 *
 * Below 1024px the arc is replaced by a horizontal scroll strip — the
 * only element on the page allowed to scroll sideways, and it does so
 * inside its own container so the page body never does.
 */
export function Gallery() {
  return (
    <section
      id={SECTION_IDS.gallery}
      aria-labelledby="gallery-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
        minHeight: "calc(1099 * var(--fig))",
      }}
    >
      <GridOverlay />
      <GalleryArc />

      {/* 1:243 / 1:244 — the hero portrait, mirrored, anchored to the
          foot of the section and fading into the page background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 lg:block"
        style={{
          bottom: "calc(-15 * var(--fig))",
          width: "calc(1154 * var(--fig))",
          height: "calc(539 * var(--fig))",
        }}
      >
        {/* The node's own export of the composed 1154x539 frame. Figma
            applies a rotate + flip to a square source fill inside it,
            and reproducing that transform chain in CSS put the head
            outside the crop — the export already carries the result. */}
        <Image
          src="/images/gallery/figure.webp"
          alt=""
          fill
          sizes="60vw"
          className="object-cover object-bottom"
        />
        {/* 1:244 — the fade is its own 325px-tall layer at the foot of
            the figure, not a wash over the whole of it. */}
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
        <Eyebrow>Creative Showcase</Eyebrow>

        <h2
          id="gallery-heading"
          className="m-0 text-center font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]"
          style={{
            marginTop: "var(--heading-gap)",
            fontSize: "max(2.5rem, calc(160 * var(--fig)))",
            lineHeight: 1.1,
            letterSpacing: "calc(3.2 * var(--fig))",
          }}
        >
          Gallery
        </h2>
      </div>

      {/* Narrow-screen strip */}
      <ul
        className="relative m-0 mt-10 flex list-none gap-3 overflow-x-auto px-5 pb-4 lg:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {GALLERY_TILES.map((tile, index) => (
          <li
            key={tile.src}
            className="relative shrink-0 overflow-hidden rounded-[4px]"
            style={{
              width: "min(62vw, 16rem)",
              aspectRatio: "287 / 240",
              scrollSnapAlign: "center",
            }}
          >
            <Image
              src={tile.src}
              alt={`Creative work sample ${index + 1}`}
              fill
              sizes="(max-width: 1023px) 62vw, 15vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
