import type { Variants } from "framer-motion";

/**
 * Motion presets for the "Our Process" table. Kept in one place so the
 * desktop table and the mobile stack share the exact same choreography:
 * the three phases (Discover / Define / Deliver) fade up one after another,
 * then the pills inside each phase follow with a small stagger.
 */
export const tableVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

export const phaseVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const pillListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

export const pillVariants: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};
