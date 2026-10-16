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
 *
 * Sizing lives in `#contact` (app/globals.css) rather than inline so the
 * mobile frame's tabs — three 100px cells on a 6px pitch filling the 313px
 * column, a 2px indicator 4px under the row, and a full-bleed mockup — can
 * override it below `lg`. At ≥1024px every rule below is the inline style
 * it replaced.
 */
export default function ContactTabs({ tabs }: { tabs: ContactCTATab[] }) {
  const safe = tabs.length ? tabs : FALLBACK_TABS;
  const [active, setActive] = useState(0);
  const current = safe[active] ?? safe[0];

  return (
    <div className="flex w-full flex-col items-center">
      {/* Tabs + mockup share one content-width wrapper so the image never
          spills wider than the tab section */}
      <div className="contact-tabs-wrap flex flex-col items-center">
        {/* --- Tab bar (Frame 95623) ------------------------------ */}
        <div className="contact-tabs-bar flex flex-wrap items-center justify-center">
          {safe.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className="contact-tab relative flex items-center justify-center outline-none"
                style={{
                  fontWeight: isActive ? 700 : 500,
                  color: "#FFFFFF",
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <span className="whitespace-nowrap">{t.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="contact-tab-indicator"
                    className="contact-tab-indicator absolute left-0 right-0 rounded-[3.23px] bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Radial divider line under the indicator */}
        <div className="contact-tab-divider relative w-full">
          <div className="contact-tab-line absolute inset-x-0" />
        </div>

        {/* --- Device mockup (Frame 95624 right) -------------------- */}
        <div className="contact-mockup-wrap relative mt-6 w-full lg:mt-[calc(40*var(--fig))]">
          <div
            className="contact-mockup relative w-full overflow-hidden rounded-[16px]"
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
