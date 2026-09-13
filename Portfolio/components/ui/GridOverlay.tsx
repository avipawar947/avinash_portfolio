import { cn } from "@/lib/utils";

/**
 * The guide grid that sits behind every section of the design
 * (nodes 1:5, 1:128, 1:164, 1:215, 1:274).
 *
 * It is the exact Figma export: a 1920x1190 SVG of 1px lines at
 * #D0D0D0 / 5% opacity, columns every 200px from x=160 and rows every
 * 184px from y=80. Rendered at the design's own proportions via
 * `--fig`, so it scales with the rest of the composition instead of
 * being stretched out of register.
 *
 * Decorative: hidden from assistive tech.
 */
export function GridOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-0 top-0", className)}
      style={{
        width: "calc(1920 * var(--fig))",
        height: "calc(1190 * var(--fig))",
        backgroundImage: "url(/svg/hero-grid.svg)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
