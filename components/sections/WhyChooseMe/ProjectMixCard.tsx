import Image from "next/image";

import GradientText from "@/components/ui/GradientText";

/**
 * "On Average Projects" — Figma node 1:312.
 *
 * 530 x 424, radius 8. A 470 x 276 plot area at (34, 80) holds four bars
 * over a vertical rule, with a horizontal axis at y=356 labelled 0 and 100.
 *
 * Bar widths arrive from the CMS in the plot's 470px space and are written
 * as a percentage of it, so the chart keeps its shape at any card width.
 * The surrounding lengths are `cqw` of the card (app/globals.css).
 */
export default function ProjectMixCard({
  bars,
}: {
  bars: { label: string; width: number }[];
}) {
  return (
    <div className="why-card why-card-chart">
      <GradientText as="p" className="why-chart-title">
        On Average Projects
      </GradientText>

      {/* Plot area (1:318) */}
      <div className="why-plot">
        <div className="why-plot-rule" aria-hidden="true" />

        {bars.map((bar, index) => (
          <div
            key={bar.label}
            className="why-bar"
            style={{
              top: `${((24 + index * 62) / 276) * 100}%`,
              width: `${(bar.width / 470) * 100}%`,
            }}
          >
            <GradientText className="why-bar-label">{bar.label}</GradientText>
          </div>
        ))}
      </div>

      {/* Horizontal axis (1:317) */}
      <Image
        src="/svg/axis-horizontal.svg"
        alt=""
        aria-hidden="true"
        width={448}
        height={8}
        className="why-axis"
      />

      {/* Axis bounds (1:314, 1:316) */}
      <span aria-hidden="true" className="why-axis-bound why-axis-bound-min">
        0
      </span>
      <span aria-hidden="true" className="why-axis-bound why-axis-bound-max">
        100
      </span>
    </div>
  );
}
