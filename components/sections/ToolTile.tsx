import Image from 'next/image';
import type { ToolItem } from '@/types/content';

export const TOOL_TILE = 94;

export default function ToolTile({
  tool,
  positioned = true,
}: {
  tool: ToolItem;
  positioned?: boolean;
}) {
  const sizeRatio = ((tool.iconSize || 60) / TOOL_TILE) * 100;
  const leftRatio = ((tool.iconLeft || 17) / TOOL_TILE) * 100;
  const topRatio = ((tool.iconTop || 17) / TOOL_TILE) * 100;

  const tileStyle: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 100%)',
  };

  if (positioned) {
    tileStyle.position = 'absolute';
    tileStyle.left = `calc(${tool.left} * var(--fig))`;
    tileStyle.top = `calc(${tool.top} * var(--fig))`;
    tileStyle.width = `calc(${TOOL_TILE} * var(--fig))`;
    tileStyle.height = `calc(${TOOL_TILE} * var(--fig))`;
  } else {
    tileStyle.position = 'relative';
    tileStyle.aspectRatio = '1';
    tileStyle.width = '100%';
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
