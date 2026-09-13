/**
 * "Our Process" — Figma node 1:163.
 *
 * Three phases in a 1640 x 645 table. Each step is a 42px pill with a
 * 4px radius, and the pills cascade to the right as the phase advances —
 * `left` and `width` are the design's own values inside the table, so
 * the cascade is preserved rather than approximated.
 *
 * `from` is the pill gradient's white stop. Figma varies it per pill so
 * that the fade lands consistently in absolute terms despite the pills
 * being different widths.
 */
export type ProcessStep = {
  label: string;
  /** Offset from the table's left edge, in Figma px. */
  left: number;
  /** Offset from the table's top edge, in Figma px. */
  top: number;
  width: number;
  /** Gradient white-stop percentage. */
  from: number;
};

export type ProcessPhase = {
  name: string;
  /** Label's vertical centre inside the table, in Figma px. */
  top: number;
  steps: readonly ProcessStep[];
};

export const PROCESS: readonly ProcessPhase[] = [
  {
    name: "Discover",
    top: 50,
    steps: [
      {
        label: "Stakeholder interviews & briefing",
        left: 295,
        top: 29,
        width: 360,
        from: 55.234,
      },
      {
        label: "User & market research",
        left: 335,
        top: 87,
        width: 420,
        from: 36.104,
      },
      {
        label: "UX Audit Of The Existing Product",
        left: 375,
        top: 145,
        width: 480,
        from: 61.249,
      },
    ],
  },
  {
    name: "Define",
    top: 268,
    steps: [
      {
        label: "Defining Concept and Strategy",
        left: 515,
        top: 247,
        width: 540,
        from: 57.643,
      },
      {
        label: "Information Architecture",
        left: 555,
        top: 305,
        width: 600,
        from: 48.838,
      },
      {
        label: "User Journeys & Flows",
        left: 595,
        top: 363,
        width: 660,
        from: 61.249,
      },
    ],
  },
  {
    name: "Deliver",
    top: 486,
    steps: [
      {
        label: "Visual Experience Design, Wireframing & Design Systems",
        left: 735,
        top: 465,
        width: 660,
        from: 11.735,
      },
      {
        label: "Usability Testing, Feedback & Iteration",
        left: 775,
        top: 523,
        width: 720,
        from: 47.09,
      },
      {
        label: "Handoff & Developer QA",
        left: 875,
        top: 581,
        width: 720,
        from: 47.09,
      },
    ],
  },
];

/** Right-hand copy block — nodes 1:210 to 1:213. */
export const PROCESS_INTRO = {
  heading: "A Thoughtful Process.",
  /** 1:211 is gradient-filled; the two that follow are flat and muted. */
  lead: "We combine research, strategic thinking, and visual",
  rest: [
    "execution into a streamlined workflow that keeps",
    "every decision aligned with business goals.",
  ],
} as const;
