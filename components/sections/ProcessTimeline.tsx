"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";

import GradientText from "@/components/ui/GradientText";
import type { ProcessStepItem, ProcessIntroContent } from "@/types/content";
import ProcessPill from "./ProcessPill";
import {
  pillListVariants,
  pillVariants,
  phaseVariants,
  tableVariants,
} from "./process-motion";

/**
 * "Our Process" — Figma node 1:163 (1920 x 1366).
 *
 * Desktop table: 1640 x 645 at (140, 581), 1px rgba(208,208,208,0.2)
 * border, a solid vertical rule at x=252, dashed rules at y=217 and y=435.
 * Each phase labels its column; its steps cascade rightward as pills.
 * Narrow screens show a flat stacked list instead.
 *
 * The table is the scroll trigger: each phase (Discover / Define / Deliver)
 * fades up in sequence, and the pills inside a phase follow with a small
 * stagger. The mobile stack uses the same variants so both compositions
 * animate identically.
 */

export default function ProcessTimeline({
  items,
  intro,
}: {
  items: ProcessStepItem[];
  intro: ProcessIntroContent;
}) {
  const phases = ['Discover', 'Define', 'Deliver'] as const;
  const grouped = phases.map((p) => ({
    name: p,
    steps: items.filter((s) => s.phase === p).sort((a, b) => a.order - b.order),
  }));

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      {/* Guide grid — same Figma grid as "Why Choose Me", faded at both
          seams so the rules dissolve into the section background. */}
      <div
        aria-hidden="true"
        className="process-grid-bg pointer-events-none absolute inset-0"
      />

      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="process-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
              How I Work
            </span>
            <h2
              id="process-heading"
              className="process-heading m-0 font-display font-medium text-[var(--color-text)]"
            >
              Our
              <span className="block lg:w-[calc(576*var(--fig))] lg:text-right">
                Process
              </span>
            </h2>
          </div>

          {/* The mobile frame omits the intro copy, so it only shows beside
              the heading on desktop. */}
          <div
            className="hidden lg:block lg:shrink-0 lg:self-end"
            style={{
              marginTop: "clamp(2rem, calc(120 * var(--fig)), calc(120 * var(--fig)))",
              width: "min(100%, calc(531 * var(--fig)))",
            }}
          >
            <GradientText
              as="h3"
              className="m-0 font-semibold capitalize"
              style={{
                fontSize: "max(1.25rem, calc(32 * var(--fig)))",
                lineHeight: 1.75,
                letterSpacing: "calc(0.64 * var(--fig))",
              }}
            >
              {intro.heading}
            </GradientText>
            <p
              className="m-0 capitalize"
              style={{
                marginTop: "calc(12 * var(--fig))",
                fontSize: "max(0.875rem, calc(20 * var(--fig)))",
                lineHeight: 1.6,
                letterSpacing: "calc(0.4 * var(--fig))",
              }}
            >
              <GradientText>{intro.lead}</GradientText>{" "}
              <span className="text-[rgba(176,176,176,0.3)]">
                {intro.rest.join(" ")}
              </span>
            </p>
          </div>
        </div>

        {/* Desktop table (1:185). Opaque fill keeps the guide grid from
            showing through the table, as in the design. */}
        <motion.div
          className="relative hidden border border-[rgba(208,208,208,0.2)] bg-[var(--color-bg)] lg:block"
          style={{
            marginTop: "calc(40 * var(--fig))",
            height: "calc(645 * var(--fig))",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={tableVariants}
        >
          {/* Solid rule separating labels from steps (1:186) */}
          <div
            aria-hidden="true"
            className="absolute top-0 h-full"
            style={{
              left: "calc(252 * var(--fig))",
              width: "1px",
              backgroundColor: "rgba(208,208,208,0.2)",
            }}
          />
          {/* Dashed phase separators (1:187, 1:188) */}
          {[217, 435].map((top) => (
            <div
              key={top}
              aria-hidden="true"
              className="absolute left-0 w-full"
              style={{
                top: `calc(${top} * var(--fig))`,
                height: "1px",
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(208,208,208,0.4) 0 2px, transparent 2px 4px)",
              }}
            />
          ))}

          {grouped.map((phase) => {
            // Phase label centres vertically on the first pill: pill top + 21px (half of 42).
            const phaseLabelTop = phase.steps.length
              ? Math.min(...phase.steps.map((s) => s.top)) + 21
              : 50;
            return (
              <motion.div key={phase.name} variants={phaseVariants}>
                <GradientText
                  as="h3"
                  className="absolute m-0 font-semibold capitalize"
                  style={{
                    left: "calc(30 * var(--fig))",
                    top: `calc(${phaseLabelTop} * var(--fig))`,
                    transform: "translateY(-50%)",
                    fontSize: "calc(32 * var(--fig))",
                    lineHeight: 1.75,
                    letterSpacing: "calc(0.64 * var(--fig))",
                  }}
                >
                  {phase.name}
                </GradientText>
                <motion.ul
                  className="m-0 list-none p-0"
                  variants={pillListVariants}
                >
                  {phase.steps.map((step) => (
                    <ProcessPill key={step._id} step={step} />
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Phone + tablet composition (< lg) — the design's 393px "How I
            Work" frame: one bordered card holding the three phases, each with
            its label, a full-bleed dashed rule and a cascading set of step
            pills that step rightward one indent per row. */}
        <motion.div
          className="process-mobile lg:hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={tableVariants}
        >
          <div className="process-mobile-box">
            {grouped.map((phase, phaseIndex) => (
              <Fragment key={phase.name}>
                <motion.div
                  className="process-mobile-phase"
                  variants={phaseVariants}
                >
                  <GradientText as="h3" className="process-mobile-label">
                    {phase.name}
                  </GradientText>

                  <span className="process-mobile-dash" aria-hidden="true" />

                  <motion.ul
                    className="process-mobile-list"
                    variants={pillListVariants}
                  >
                    {phase.steps.map((step, stepIndex) => (
                      <motion.li
                        key={step._id}
                        className="process-mobile-pill"
                        style={{ marginLeft: `calc(${stepIndex} * 1.75rem)` }}
                        variants={pillVariants}
                      >
                        <GradientText className="process-mobile-pill-label">
                          {step.label}
                        </GradientText>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

                {phaseIndex < grouped.length - 1 && (
                  <span className="process-mobile-sep" aria-hidden="true" />
                )}
              </Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
