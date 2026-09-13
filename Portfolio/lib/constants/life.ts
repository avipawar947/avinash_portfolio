/**
 * "Life Behind The Text" — Figma node 1:410.
 *
 * Six 380 x 372 film-frame cards on a 416px pitch inside a 1628px
 * frame, so the last two sit entirely outside it — the same overhang
 * the client marquee and the gallery arc use to say the row scrolls.
 *
 * Each card is a vertical gradient with a 16px sprocket strip down both
 * edges and a 332 x 356 photo inset at (24, 8).
 */
export const LIFE_CARD = { width: 380, height: 372, pitch: 416 } as const;

export const LIFE_PHOTOS: readonly { src: string; alt: string }[] = [
  { src: "/images/life/photo-1.webp", alt: "" },
  { src: "/images/life/photo-2.webp", alt: "" },
  { src: "/images/life/photo-3.webp", alt: "" },
  { src: "/images/life/photo-4.webp", alt: "" },
  { src: "/images/life/photo-5.webp", alt: "" },
  { src: "/images/life/photo-6.webp", alt: "" },
];
