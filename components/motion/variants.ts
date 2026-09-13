import type { Variants } from 'framer-motion';

/**
 * Central animation presets. Reference these by name from AnimatedSection
 * or any component. When you say "animate section X like this," this file
 * is the only place that needs a new entry / tweak.
 */
export const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  },
  staggerContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  },
};

export type VariantName = keyof typeof variants;
