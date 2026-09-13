import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GradientText from '@/components/ui/GradientText';
import GridOverlay from '@/components/ui/GridOverlay';
import type { ProcessStepItem } from '@/types/content';

const phases: ProcessStepItem['phase'][] = ['Discover', 'Define', 'Deliver'];

export default function ProcessTimeline({ items }: { items: ProcessStepItem[] }) {
  return (
    <section className="relative w-full bg-bg px-6 py-24 md:px-12 md:py-40">
      <GridOverlay />
      <div className="relative mx-auto max-w-canvas">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <AnimatedSection variant="fadeIn">
              <SectionTag>How I Work</SectionTag>
            </AnimatedSection>
            <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6">
              <h2 className="font-display text-[14vw] font-medium leading-none tracking-wide text-heading md:text-h1">
                Our
                <br />
                Process
              </h2>
            </AnimatedSection>
          </div>

          <AnimatedSection variant="fadeUp" delay={0.15} className="max-w-md md:pt-10 md:text-right">
            <GradientText as="h3" className="text-h2Mobile md:text-h2">
              A Thoughtful Process.
            </GradientText>
            <p className="mt-2 text-h3 text-body">
              We combine research, strategic thinking, and visual execution into a
              streamlined workflow that keeps every decision aligned with business goals.
            </p>
          </AnimatedSection>
        </div>

        <div className="mt-16 divide-y divide-dashed divide-lineStrong rounded-card border border-lineStrong md:mt-24">
          {phases.map((phase, i) => (
            <div key={phase} className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3 md:p-12">
              <GradientText as="h4" className="text-h2Mobile md:text-h2">
                {phase}
              </GradientText>
              <div className="col-span-2 flex flex-wrap gap-x-8 gap-y-4">
                {items
                  .filter((s) => s.phase === phase)
                  .map((step) => (
                    <AnimatedSection key={step._id} variant="fadeUp" delay={0.05 * i}>
                      <span className="border-l border-white/10 pl-4 text-h3 text-body">
                        {step.label}
                      </span>
                    </AnimatedSection>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
