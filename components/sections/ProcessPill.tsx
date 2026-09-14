import GradientText from "@/components/ui/GradientText";
import type { ProcessStepItem } from "@/types/content";

/**
 * A single process step pill — Figma nodes 1:192, 1:194, 1:196.
 *
 * 42px tall, 4px radius, left-to-right fade from rgba(255,255,255,0.1)
 * to rgba(176,176,176,0.01), label inset 20px at 18px Regular.
 *
 * `positioned` switches between the desktop table layout (absolute,
 * positioned by Figma coordinates) and the narrow-screen stack.
 */
export default function ProcessPill({
  step,
  positioned = true,
}: {
  step: ProcessStepItem;
  positioned?: boolean;
}) {
  return (
    <li
      className={
        positioned
          ? "absolute flex items-center overflow-hidden rounded-[4px]"
          : "flex w-full items-center overflow-hidden rounded-[4px]"
      }
      style={{
        ...(positioned
          ? {
              left: `calc(${step.left} * var(--fig))`,
              top: `calc(${step.top} * var(--fig))`,
              width: `calc(${step.width} * var(--fig))`,
            }
          : {}),
        height: positioned ? "calc(42 * var(--fig))" : "2.625rem",
        paddingLeft: positioned ? "calc(20 * var(--fig))" : "1.25rem",
        paddingRight: positioned ? undefined : "0.75rem",
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) ${step.from}%, rgba(176,176,176,0.01) 114.86%)`,
      }}
    >
      <GradientText
        className="truncate capitalize"
        style={{
          fontSize: positioned ? "calc(18 * var(--fig))" : "0.8125rem",
          lineHeight: 1.78,
          letterSpacing: "calc(0.36 * var(--fig))",
        }}
      >
        {step.label}
      </GradientText>
    </li>
  );
}