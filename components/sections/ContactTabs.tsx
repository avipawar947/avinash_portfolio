"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContactCTATab } from "@/types/content";

const FALLBACK_TABS: ContactCTATab[] = [
  { label: "Desktop", imageUrl: "" },
  { label: "Mobile", imageUrl: "" },
  { label: "Tablet", imageUrl: "" },
];

/**
 * "What should I build you next?" device tabs — Figma Frame 95623.
 *
 * Three labelled tabs (Desktop/Mobile/Tablet) with a sliding white
 * indicator + radial divider line above the device mockup. Clicking a tab
 * swaps the backend image with a soft crossfade.
 *
 * Images render full-size (object-contain inside the 614:376.62 frame) so
 * uploaded desktop/mobile/tablet mockups are never cropped.
 */
export default function ContactTabs({ tabs }: { tabs: ContactCTATab[] }) {
  const safe = tabs.length ? tabs : FALLBACK_TABS;
  const [active, setActive] = useState(0);
  const current = safe[active] ?? safe[0];

  return (
    <div className="flex w-full flex-col items-center">
      {/* Tabs + mockup share one content-width wrapper so the image never
          spills wider than the tab section */}
      <div className="flex w-max max-w-full flex-col items-center">
        {/* --- Tab bar (Frame 95623) ------------------------------ */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "max(0.5rem, calc(40 * var(--fig)))" }}
        >
          {safe.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className="relative flex items-center justify-center outline-none"
                style={{
                  padding:
                    "max(5px, calc(8 * var(--fig))) max(10px, calc(40 * var(--fig)))",
                  fontSize: "max(0.75rem, calc(16.14 * var(--fig)))",
                  lineHeight: 1.2,
                  letterSpacing: "0.01em",
                  fontWeight: isActive ? 700 : 500,
                  color: "#FFFFFF",
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <span className="whitespace-nowrap">{t.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="contact-tab-indicator"
                    className="absolute left-0 right-0 rounded-[3.23px] bg-white"
                    style={{
                      bottom: "calc(-1 * max(3px, calc(5 * var(--fig))))",
                      height: "max(3px, calc(2.42 * var(--fig)))",
                      boxShadow: "0 0 12px rgba(255,255,255,0.4)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Radial divider line under the indicator */}
        <div
          className="relative w-full"
          style={{
            height: "max(3px, calc(2.42 * var(--fig)))",
            marginTop: "max(3px, calc(5 * var(--fig)))",
          }}
        >
          <div
            className="absolute inset-x-0"
            style={{
              top: "0.63px",
              height: 1,
              background:
                "radial-gradient(closest-side, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>

        {/* --- Device mockup (Frame 95624 right) -------------------- */}
        <div
          className="relative mt-6 w-full lg:mt-[calc(40*var(--fig))]"
          style={{
            width: "calc(100% + max(1.5rem, calc(80 * var(--fig))))",
            maxWidth: "100vw",
          }}
        >
          <div
            className="relative w-full overflow-hidden rounded-[16px] "
            style={{ aspectRatio: "614 / 376.62" }}
          >
            {current.imageUrl ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.label}
                  src={current.imageUrl}
                  alt={`${current.label} mockup`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-[16px] border border-white/5">
                <span className="px-4 text-center text-sm text-white/40">
                  {current.label} mockup — add via admin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
