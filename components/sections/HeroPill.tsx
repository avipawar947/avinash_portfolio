"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * The two floating pills that flank the name — Figma nodes 1:27 and 1:29.
 *
 * Shared geometry: 40px tall, radius 100, fill #010101, 1px
 * rgba(255,255,255,0.1) stroke, glow shadow `1px 1px 40px 1px
 * rgba(255,255,255,0.2)`. They differ in stroke style ("Hello" is solid,
 * "Open to Work" dashed), width, label font and rotation.
 *
 * Placement mirrors Figma: an absolute wrapper positioned at the node's
 * measured centre (centerX/centerY in 1920x1148 frame coords), and a
 * rotated child inside it — keeping the centring transform in CSS, out of
 * Framer's hands (Framer writes `transform` inline, so a Tailwind
 * `-translate-x-1/2` on the same element would be overwritten).
 *
 * The gentle float is this project's own motion (the file carries no
 * prototype), kept small enough to read as buoyancy.
 */
export default function HeroPill({
  label,
  rotate,
  variant,
  withStatusDot = false,
  delay = 0,
  centerX,
  centerY,
  widthPx,
  responsive = false,
}: {
  label: string;
  rotate: number;
  variant: "solid" | "dashed";
  withStatusDot?: boolean;
  delay?: number;
  centerX?: number;
  centerY?: number;
  widthPx?: number;
  responsive?: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const pill = (
    <motion.div
      data-hero-pill
      style={{ rotate }}
      // Reduced motion gets the pill at its final state with no entrance
      // and, more importantly, no perpetual float — an endlessly repeating
      // animation is exactly what the preference is asking us not to run.
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
        className={clsx(
          "relative grid place-items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] glow-shadow",
          variant === "dashed" ? "border-dashed" : "border-solid",
          responsive && "h-9 px-4",
          responsive && withStatusDot && "pl-8",
        )}
        style={
          responsive
            ? undefined
            : {
                width: `calc(${widthPx} * var(--fig))`,
                height: "calc(40 * var(--fig))",
                paddingLeft: withStatusDot ? "calc(20 * var(--fig))" : undefined,
              }
        }
      >
        {withStatusDot && (
          <Image
            src="/icons/status-dot.svg"
            alt=""
            width={14}
            height={14}
            className={clsx("absolute", responsive && "left-3 size-3.5")}
            style={
              responsive
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
          className={clsx(
            "text-center whitespace-nowrap text-[var(--color-text)]",
            // 1:28 is SF Pro Bold 14; 1:30 is Inter Medium 16.
            variant === "solid" ? "font-display font-bold" : "font-medium",
            responsive && "text-[0.8125rem] tracking-[0.02em]",
          )}
          style={
            responsive
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

  if (responsive) return pill;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        marginLeft: `calc(${centerX! - 960} * var(--fig))`,
        marginTop: `calc(${centerY! - 574} * var(--fig))`,
      }}
    >
      {pill}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}