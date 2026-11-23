"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * The chart sits well below the fold, so the bars grow in only once the plot
 * scrolls into view — otherwise the animation would finish off-screen and the
 * reader would just see static bars. Each bar is staggered slightly for a
 * smooth, deliberate reveal; the labels stay put and never stretch.
 */
export default function ProjectMixCard({
  bars,
}: {
  bars: { label: string; width: number }[];
}) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;

    // Fallback for browsers without IntersectionObserver: show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="why-card why-card-chart">
      <GradientText as="p" className="why-chart-title">
        On Average Projects
      </GradientText>

      {/* Plot area (1:318) */}
      <div ref={plotRef} className={`why-plot${visible ? " why-plot--visible" : ""}`}>
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
            <span
              className="why-bar-fill"
              aria-hidden="true"
              style={{ animationDelay: `${index * 140}ms` }}
            />
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
