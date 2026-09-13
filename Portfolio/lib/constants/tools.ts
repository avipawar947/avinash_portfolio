/**
 * "Tools" — Figma node 1:337.
 *
 * Ten 94x94 tiles scattered around a central emblem inside a 1416 x 485
 * plot, with two swooping curves threading between them.
 *
 * `left` / `top` are the tile's position in that plot. `icon` is the
 * glyph's own box inside the tile — most are 60x60 inset 17px, but three
 * differ, so each tile carries its own size and offset rather than
 * inheriting one global rule that would stretch the exceptions.
 */
export type Tool = {
  name: string;
  src: string;
  left: number;
  top: number;
  /** Glyph box inside the 94x94 tile. */
  icon: { size: number; left: number; top: number };
};

export const TOOL_TILE = 94;

const standard = { size: 60, left: 17, top: 17 };

export const TOOLS: readonly Tool[] = [
  {
    name: "Adobe XD",
    src: "/icons/tools/xd.svg",
    left: 0,
    top: 5,
    icon: standard,
  },
  {
    name: "Adobe Photoshop",
    src: "/icons/tools/photoshop.svg",
    left: 4,
    top: 326,
    icon: standard,
  },
  {
    // Figma names this layer "lf_Logo"; the mark is LottieFiles.
    name: "LottieFiles",
    src: "/icons/tools/lottiefiles.svg",
    left: 67,
    top: 179,
    icon: { size: 43, left: 24, top: 25 },
  },
  {
    name: "Figma",
    src: "/icons/tools/figma.svg",
    left: 302,
    top: 0,
    icon: standard,
  },
  {
    name: "Adobe Illustrator",
    src: "/icons/tools/illustrator.svg",
    left: 367,
    top: 391,
    icon: standard,
  },
  {
    name: "Notion",
    src: "/icons/tools/notion.svg",
    left: 965,
    top: 391,
    icon: standard,
  },
  {
    name: "Claude",
    src: "/icons/tools/claude.svg",
    left: 1020,
    top: 0,
    icon: { size: 45, left: 24, top: 25 },
  },
  {
    name: "Magnific",
    src: "/icons/tools/magnific.svg",
    left: 1255,
    top: 179,
    icon: { size: 45, left: 25, top: 24 },
  },
  {
    name: "Slack",
    src: "/icons/tools/slack.svg",
    left: 1316,
    top: 325,
    icon: standard,
  },
  {
    name: "OpenAI",
    src: "/icons/tools/openai.svg",
    left: 1322,
    top: 5,
    icon: standard,
  },
];
