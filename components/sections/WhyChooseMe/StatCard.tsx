import GradientText from "@/components/ui/GradientText";
import type { StatItem } from "@/types/content";
import StatValue from "./StatValue";

/**
 * A single figure card — Figma nodes 1:295, 1:299, 1:303, 1:307.
 *
 * 530 x 296, radius 8, filled with a vertical
 * rgba(19,19,19,0.8) → rgba(44,44,44,0.8) gradient. The label sits 24px
 * in from the left edge; the figure and its suffix share a baseline.
 *
 * Every inner length is a `cqw` of the card, so the card keeps the 1920
 * proportions at any width (see `.why-card*` in app/globals.css).
 */
export default function StatCard({ stat }: { stat: StatItem }) {
  return (
    <div className="why-card why-card-figure">
      <div className="why-card-labels">
        <GradientText as="p" className="why-card-label">
          {stat.label}
        </GradientText>

        {/* 1:311 leaves the gradient behind: flat #B0B0B0 at 30%. */}
        {stat.labelMuted && (
          <p className="why-card-label why-card-label-muted">
            {stat.labelMuted}
          </p>
        )}
      </div>

      <StatValue value={stat.value} suffix={stat.suffix} />
    </div>
  );
}
