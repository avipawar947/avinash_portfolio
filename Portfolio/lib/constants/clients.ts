/**
 * Client / organisation logos — Figma node 1:47 "Marquee".
 *
 * Widths are the Figma frame widths at a shared 60px height, in the
 * design's own order. The strip is laid out with a 140px gap.
 *
 * Three layers carry uninformative names in the file — `image 95`,
 * `image 77` and `magnific_give-me-high-res-image_...`. Rendering them
 * identified all three: HRX, awfis and Fabled respectively. The files
 * are named for the brand rather than the Figma layer.
 */
export type ClientLogo = {
  /** Path under /public/images/clients. */
  src: string;
  /** Accessible name; empty string marks the logo decorative. */
  alt: string;
  /** Figma frame width at 60px tall. */
  width: number;
  /** 1:76 carries mix-blend-mode: luminosity in the design. */
  luminosity?: boolean;
};

export const CLIENT_LOGOS: readonly ClientLogo[] = [
  { src: "/images/clients/icici.svg", alt: "ICICI Bank", width: 299 },
  { src: "/images/clients/fabled.webp", alt: "Fabled", width: 136 },
  { src: "/images/clients/tata.svg", alt: "Tata", width: 65 },
  {
    src: "/images/clients/met-college.webp",
    alt: "MET Bhujbal Knowledge City, Mumbai",
    width: 142,
  },
  { src: "/images/clients/hrx.webp", alt: "HRX", width: 126, luminosity: true },
  { src: "/images/clients/zango.webp", alt: "ZanGO", width: 156 },
  { src: "/images/clients/quistonpe.webp", alt: "Quistonpe", width: 60 },
  { src: "/images/clients/awfis.webp", alt: "awfis", width: 176 },
  { src: "/images/clients/mswipe.svg", alt: "Mswipe Technologies", width: 190 },
  {
    src: "/images/clients/bharat-billpay.svg",
    alt: "Bharat BillPay",
    width: 168,
  },
  { src: "/images/clients/akruti-luxe.webp", alt: "Akruti Luxe", width: 325 },
];
