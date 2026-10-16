import Image from 'next/image';
import type { ToolItem } from '@/types/content';

export const TOOL_TILE = 94;

/** The same tile on the 393px mobile frame — 94 x 0.710928. */
const TOOL_TILE_MOBILE = 66.8271866;

/**
 * Figma's mobile constellation offsets (node 1:396, the 345 x 1005 plot),
 * keyed by `iconKey`. The mobile frame stands the desktop plot upright and
 * re-lays the tiles, so these are read from the file rather than derived.
 * A CMS tool with no entry falls back to its desktop offset squeezed into
 * the mobile box, so it still lands on the canvas.
 */
const MOBILE_POSITIONS: Record<string, { left: number; top: number }> = {
  xd: { left: 46.41, top: 2.84 },
  photoshop: { left: 278.17, top: 214.7 },
  lottiefiles: { left: 150.92, top: 47.63 },
  figma: { left: 274.62, top: 0 },
  illustrator: { left: 0.2, top: 260.91 },
  notion: { left: 274.62, top: 938.42 },
  claude: { left: 278.17, top: 723.72 },
  magnific: { left: 150.92, top: 890.79 },
  slack: { left: 47.12, top: 934.16 },
  openai: { left: 0.2, top: 684.62 },
};

export default function ToolTile({
  tool,
  variant = 'desktop',
}: {
  tool: ToolItem;
  variant?: 'desktop' | 'mobile';
}) {
  const sizeRatio = ((tool.iconSize || 60) / TOOL_TILE) * 100;
  const leftRatio = ((tool.iconLeft || 17) / TOOL_TILE) * 100;
  const topRatio = ((tool.iconTop || 17) / TOOL_TILE) * 100;

  const tileStyle: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 100%)',
  };

  if (variant === 'mobile') {
    const position = MOBILE_POSITIONS[tool.iconKey] ?? {
      left: tool.left * (345 / 1416),
      top: tool.top * (1005 / 485),
    };
    tileStyle.position = 'absolute';
    tileStyle.left = `calc(${position.left} * var(--tools-u))`;
    tileStyle.top = `calc(${position.top} * var(--tools-u))`;
    tileStyle.width = `calc(${TOOL_TILE_MOBILE} * var(--tools-u))`;
    tileStyle.height = `calc(${TOOL_TILE_MOBILE} * var(--tools-u))`;
    tileStyle.borderRadius = `calc(5.68742 * var(--tools-u))`;
  } else {
    tileStyle.position = 'absolute';
    tileStyle.left = `calc(${tool.left} * var(--fig))`;
    tileStyle.top = `calc(${tool.top} * var(--fig))`;
    tileStyle.width = `calc(${TOOL_TILE} * var(--fig))`;
    tileStyle.height = `calc(${TOOL_TILE} * var(--fig))`;
  }

  return (
    <li className="overflow-hidden rounded-[8px]" style={tileStyle}>
      {tool.iconUrl ? (
        <Image
          src={tool.iconUrl}
          alt={tool.name}
          width={tool.iconSize || 60}
          height={tool.iconSize || 60}
          className="absolute"
          style={{
            width: `${sizeRatio}%`,
            height: `${sizeRatio}%`,
            left: `${leftRatio}%`,
            top: `${topRatio}%`,
          }}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-center text-xs text-body">
          {tool.name}
        </span>
      )}
    </li>
  );
}
