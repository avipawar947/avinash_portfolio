import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GradientText from '@/components/ui/GradientText';
import Card from '@/components/ui/Card';
import type { StatItem } from '@/types/content';

export default function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <section className="relative w-full bg-bg px-6 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-canvas">
        <AnimatedSection variant="fadeIn" className="flex justify-center">
          <SectionTag>Why Choose Me</SectionTag>
        </AnimatedSection>
        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6 text-center">
          <h2 className="font-display text-[10vw] font-medium leading-none tracking-wide text-heading md:text-h1">
            Beyond The Numbers.
          </h2>
        </AnimatedSection>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-3">
          {items.map((stat, i) => (
            <AnimatedSection key={stat._id} variant="scaleIn" delay={0.08 * i}>
              <Card className="flex h-full flex-col justify-between p-8 md:p-10">
                <GradientText as="p" className="text-h2Mobile md:text-h2">
                  {stat.label}
                </GradientText>
                <p className="mt-6 font-display text-[80px] font-medium leading-none tracking-wide text-heading md:text-[120px]">
                  {stat.value}
                  <span className="text-[60px] md:text-[80px]">{stat.suffix}</span>
                </p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
