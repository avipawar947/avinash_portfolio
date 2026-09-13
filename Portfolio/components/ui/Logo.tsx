import { cn } from "@/lib/utils";

/**
 * The "AP" monogram — Figma nodes 1:46 (navbar) and 1:392 (Tools emblem).
 *
 * The source is a 750x500 contact sheet holding two variants: a white
 * mark on black in the left half (measured bbox 113,195 → 261,304), and
 * a black mark on white in the right. Figma crops the frame to the left
 * variant, laying the image in at 412.5% x 330% offset -56.23% /
 * -116.16%; that crop is reproduced exactly here.
 *
 * Three things this deliberately does NOT do:
 *
 *  - Use the node's own PNG export. Figma flattens that onto white, so
 *    it comes back fully opaque with the mark embossed at luminance 253
 *    — a white box on the dark navbar.
 *  - Route an 8 KB two-tone mark through next/image. The crop is a
 *    background, not content, and the optimizer buys nothing here.
 *  - Leave the crop's black ground visible. `screen` blending drops it:
 *    black contributes nothing, so only the white mark survives over any
 *    dark surface.
 *
 * `widthVar` is any CSS length; the 48:40 frame ratio follows from it.
 */
export function Logo({
  widthVar = "calc(48 * var(--fig))",
  className,
}: {
  widthVar?: string;
  className?: string;
}) {
  const height = `calc(${widthVar} * (40 / 48))`;

  return (
    <span
      aria-hidden="true"
      className={cn("block shrink-0", className)}
      style={{
        width: widthVar,
        height,
        backgroundImage: "url(/images/ap-logo-sheet.png)",
        backgroundRepeat: "no-repeat",
        // 412.5% x 330% of the frame, offset to the left-hand variant.
        backgroundSize: `calc(${widthVar} * 4.125) calc(${height} * 3.3)`,
        backgroundPosition: `calc(${widthVar} * -0.5623) calc(${height} * -1.1616)`,
        mixBlendMode: "screen",
      }}
    />
  );
}
