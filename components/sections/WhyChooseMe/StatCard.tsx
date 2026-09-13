import GradientText from "@/components/ui/GradientText";
import type { StatItem } from "@/types/content";
import StatValue from "./StatValue";

/**
 * A single figure card — Figma nodes 1:295, 1:299, 1:303, 1:307.
 *
 * 530 x 296, radius 8, filled with a vertical
 * rgba(19,19,19,0.8) → rgba(44,44,44,0.8) gradient. The label sits 24px
 * in from the left edge; the figure and its suffix share a baseline.
 */
export default function StatCard({ stat }: { stat: StatItem }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[8px]"
      style={{
        aspectRatio: "530 / 296",
        minHeight: "11rem",
        paddingInline: "calc(24 * var(--fig))",
        paddingTop: "calc(24 * var(--fig))",
        backgroundImage:
          "linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 100%)",
      }}
    >
      <GradientText
        as="p"
        className="m-0 font-semibold capitalize"
        style={{
          fontSize: "max(0.9375rem, calc(24 * var(--fig)))",
          lineHeight: 1.35,
          letterSpacing: "calc(0.48 * var(--fig))",
        }}
      >
        {stat.label}
      </GradientText>

      {/* 1:311 leaves the gradient behind: flat #B0B0B0 at 30%. */}
      {stat.labelMuted && (
        <p
          className="m-0 font-semibold capitalize text-[#b0b0b0] opacity-30"
          style={{
            fontSize: "max(0.9375rem, calc(24 * var(--fig)))",
            lineHeight: 1.35,
            letterSpacing: "calc(0.48 * var(--fig))",
          }}
        >
          {stat.labelMuted}
        </p>
      )}

      <StatValue value={stat.value} suffix={stat.suffix} />
    </div>
  );
}