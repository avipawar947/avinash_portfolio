/**
 * "Gallery" — Figma node 1:214.
 *
 * Eight 287px-wide tiles on a 299px pitch, their heights and tops
 * forming a symmetric arc that peaks at the edges: 341, 284, 240, 208,
 * 208, 240, 284, 341. The row runs from x=-231 to x=2149 inside a 1920
 * frame, so the outermost tile on each side is half off-canvas — the
 * same overhang the client marquee uses to signal that a row scrolls.
 */
export type GalleryTile = {
  src: string;
  /** Figma left offset within the 1920 frame. */
  left: number;
  /** Figma top offset within the 1099-tall frame. */
  top: number;
  height: number;
};

export const GALLERY_TILE_WIDTH = 287;

export const GALLERY_TILES: readonly GalleryTile[] = [
  { src: "/images/gallery/tile-1.webp", left: -231, top: 408, height: 341 },
  { src: "/images/gallery/tile-2.webp", left: 68, top: 437, height: 284 },
  { src: "/images/gallery/tile-3.webp", left: 367, top: 459, height: 240 },
  { src: "/images/gallery/tile-4.webp", left: 666, top: 475, height: 208 },
  { src: "/images/gallery/tile-5.webp", left: 965, top: 475, height: 208 },
  { src: "/images/gallery/tile-6.webp", left: 1264, top: 459, height: 240 },
  { src: "/images/gallery/tile-7.webp", left: 1563, top: 437, height: 284 },
  { src: "/images/gallery/tile-8.webp", left: 1862, top: 408, height: 341 },
];
