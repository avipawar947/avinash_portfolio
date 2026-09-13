/**
 * "My Journey" — Figma node 1:396.
 *
 * Nine separately-authored lines, each with its own opacity, producing a
 * paragraph that recedes as it goes. The line breaks are the designer's,
 * not the result of wrapping, so each line is stored verbatim and
 * rendered as its own line on desktop.
 *
 * `opacity` is the layer opacity Figma sets; the first line is not flat
 * at all but carries the white → rgba(176,176,176,0.1) gradient fill
 * used elsewhere on the page.
 */
export type AboutLine = {
  text: string;
  /** Layer opacity, 0-1. Undefined means the gradient treatment. */
  opacity?: number;
};

export const ABOUT_LINES: readonly AboutLine[] = [
  {
    text: "The journey Start with a strong foundation in technology through BCA and MCA,",
  },
  {
    text: "where I learned to think logically and solve problems. I became more curious about",
    opacity: 0.25,
  },
  {
    text: "how they think, what they need, and why something that looks simple can still feel",
    opacity: 0.2,
  },
  {
    text: "difficult to use.. That curiosity led me into UI/UX, where problem-solving",
    opacity: 0.2,
  },
  {
    text: "and creativity started to come together. Over the years, I've worked across startups,",
    opacity: 0.1,
  },
  {
    text: "growing teams, and larger organizations, learning something new at every stage.",
    opacity: 0.1,
  },
  {
    text: "From early client projects to leading design teams and building complex digital products.",
    opacity: 0.1,
  },
  {
    text: "every experience has shaped the way And this journey is still evolving—one problem, one",
    opacity: 0.05,
  },
  {
    text: "idea, and one meaningful experience at a time.",
    opacity: 0.05,
  },
];
