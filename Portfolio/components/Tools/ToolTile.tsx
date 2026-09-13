import Image from "next/image";

import type { Tool } from "@/lib/constants";
import { TOOL_TILE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * One tool tile — Figma nodes 1:344, 1:348, 1:351 and siblings.
 *
 * 94 x 94, radius 8, vertical rgba(19,19,19,0.8) → rgba(44,44,44,0.8)
 * fill. The glyph keeps its own box: most sit at 60x60 inset 17px, but
 * Claude, Magnific and LottieFiles are smaller and offset differently,
 * so the size and offset travel with the tool rather than being applied
 * globally.
 *
 * `positioned` places the tile at its constellation coordinates; without
 * it the tile flows, for the narrow-screen grid.
 */
export function ToolTile({
  tool,
  positioned = true,
}: {
  tool: Tool;
  positioned?: boolean;
}) {
  // The glyph's share of the tile, preserved when the tile is resized.
  const iconRatio = (tool.icon.size / TOOL_TILE) * 100;
  const leftRatio = (tool.icon.left / TOOL_TILE) * 100;
  const topRatio = (tool.icon.top / TOOL_TILE) * 100;

  return (
    <li
      className={cn(
        "overflow-hidden rounded-[8px]",
        // Never emit `relative` and `absolute` together — Tailwind puts
        // both in the same layer, so which one wins depends on their
        // order in the generated stylesheet, not on the order here.
        positioned ? "absolute" : "relative aspect-square w-full",
      )}
      style={{
        ...(positioned
          ? {
              left: `calc(${tool.left} * var(--fig))`,
              top: `calc(${tool.top} * var(--fig))`,
              width: `calc(${TOOL_TILE} * var(--fig))`,
              height: `calc(${TOOL_TILE} * var(--fig))`,
            }
          : {}),
        backgroundImage:
          "linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 100%)",
      }}
    >
      <Image
        src={tool.src}
        alt={tool.name}
        width={tool.icon.size}
        height={tool.icon.size}
        className="absolute"
        style={{
          width: `${iconRatio}%`,
          height: `${iconRatio}%`,
          left: `${leftRatio}%`,
          top: `${topRatio}%`,
        }}
      />
    </li>
  );
}
