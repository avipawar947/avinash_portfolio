import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GradientText from '@/components/ui/GradientText';
import GridOverlay from '@/components/ui/GridOverlay';
import type { JourneyContent } from '@/types/content';

export default function MyJourney({ content }: { content: JourneyContent }) {
  return (
    <section className="relative w-full bg-bg px-6 py-24 text-center md:px-12 md:py-40">
      <GridOverlay />
      <div className="relative mx-auto max-w-canvas">
        <AnimatedSection variant="fadeIn" className="flex justify-center">
          <SectionTag>About</SectionTag>
        </AnimatedSection>
        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6">
          <h2 className="font-display text-[12vw] font-medium leading-none tracking-wide text-heading md:text-h1">
            {content.heading}
          </h2>
        </AnimatedSection>

        <div className="mx-auto mt-16 max-w-4xl space-y-2 md:mt-24">
          {content.lines.map((line, i) => (
            <AnimatedSection key={i} variant="fadeUp" delay={0.04 * i}>
              <p
                className="text-h2Mobile leading-relaxed md:text-h2"
                style={{ opacity: line.opacity }}
              >
                <GradientText>{line.text}</GradientText>
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
