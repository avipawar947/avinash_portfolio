'use client';

import { motion } from 'framer-motion';
import { variants, type VariantName } from './variants';

/**
 * Wrap any section (or piece of a section) in this to get scroll-triggered
 * animation. `variant` picks a preset from variants.ts; `delay` staggers
 * siblings without touching variants.ts.
 *
 * <AnimatedSection variant="fadeUp" delay={0.1}> ... </AnimatedSection>
 */
export default function AnimatedSection({
  children,
  variant = 'fadeUp',
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  variant?: VariantName;
  delay?: number;
  className?: string;
  as?: any;
}) {
  const MotionTag = motion(Tag as any);
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants[variant]}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
