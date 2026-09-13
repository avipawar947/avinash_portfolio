"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type CommonProps = {
  label: string;
  rotate: number;
  variant: "solid" | "dashed";
  withStatusDot?: boolean;
  delay?: number;
};

type PlacedProps = CommonProps & {
  /** Centre point in Figma coordinates within the 1920 x 1148 frame. */
  centerX: number;
  centerY: number;
  widthPx: number;
  responsive?: false;
};

type ResponsiveProps = CommonProps & {
  /** Flow-positioned and rem-sized, for the mobile composition. */
  responsive: true;
  centerX?: never;
  centerY?: never;
  widthPx?: never;
};

type HeroPillProps = PlacedProps | ResponsiveProps;

/**
 * The two floating pills that flank the name — Figma nodes 1:27 and 1:29.
 *
 * Shared geometry: 40px tall, radius 100, fill #010101, 1px
 * rgba(255,255,255,0.1) stroke, glow shadow 1px 1px 40px 1px
 * rgba(255,255,255,0.2). They differ in stroke style, width, label type
 * and rotation, so those are props rather than two near-identical
 * components.
 *
 * The nesting mirrors Figma's own: an outer frame that positions, and a
 * rotated child inside it. That split is also what keeps the centring
 * transform in CSS and out of Framer's hands — Framer writes `transform`
 * inline, so a Tailwind `-translate-x-1/2` on the same element would be
 * silently overwritten.
 *
 * The idle float is this project's own motion (the file carries no
 * prototype), kept small so it reads as buoyancy rather than decoration.
 */
export function HeroPill({
  label,
  rotate,
  variant,
  withStatusDot = false,
  delay = 0,
  ...placement
}: HeroPillProps) {
  const isResponsive = placement.responsive === true;
  const prefersReducedMotion = usePrefersReducedMotion();

  const pill = (
    <motion.div
      data-hero-pill
      style={{ rotate }}
      // Reduced motion gets the pill in its final state with no
      // entrance and, more importantly, no perpetual float — an
      // indefinitely repeating animation is exactly what the preference
      // is asking us not to run.
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={
        prefersReducedMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: ["0%", "-6%", "0%"] }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 5, delay, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      <div
        className={cn(
          "relative grid place-items-center overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-surface)] shadow-[var(--shadow-glow)]",
          "border border-[var(--color-border-subtle)]",
          variant === "dashed" ? "border-dashed" : "border-solid",
          isResponsive && "h-9 px-4",
          isResponsive && withStatusDot && "pl-8",
        )}
        style={
          isResponsive
            ? undefined
            : {
                width: `calc(${placement.widthPx} * var(--fig))`,
                height: "calc(40 * var(--fig))",
                paddingLeft: withStatusDot
                  ? "calc(20 * var(--fig))"
                  : undefined,
              }
        }
      >
        {withStatusDot && (
          <Image
            src="/icons/status-dot.svg"
            alt=""
            width={14}
            height={14}
            className={cn("absolute", isResponsive && "left-3 size-3.5")}
            style={
              isResponsive
                ? undefined
                : {
                    left: "calc(15 * var(--fig))",
                    top: "calc(12 * var(--fig))",
                    width: "calc(14 * var(--fig))",
                    height: "calc(14 * var(--fig))",
                  }
            }
          />
        )}
        <span
          className={cn(
            "text-center whitespace-nowrap text-[var(--color-text)]",
            // 1:28 is SF Pro Bold 14; 1:30 is Inter Medium 16.
            variant === "solid"
              ? "font-[family-name:var(--font-display)] font-bold"
              : "font-medium",
            isResponsive && "text-[0.8125rem] tracking-[0.02em]",
          )}
          style={
            isResponsive
              ? undefined
              : {
                  fontSize:
                    variant === "solid"
                      ? "calc(14 * var(--fig))"
                      : "calc(16 * var(--fig))",
                  letterSpacing:
                    variant === "solid"
                      ? "calc(0.28 * var(--fig))"
                      : "calc(0.32 * var(--fig))",
                }
          }
        >
          {label}
        </span>
      </div>
    </motion.div>
  );

  if (isResponsive) return pill;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        // centreY is measured from the top of the 1148 frame; the element
        // is positioned from the frame's vertical middle (574).
        marginLeft: `calc(${placement.centerX! - 960} * var(--fig))`,
        marginTop: `calc(${placement.centerY! - 574} * var(--fig))`,
      }}
    >
      {pill}
    </div>
  );
}
