import Image from 'next/image';
import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GradientText from '@/components/ui/GradientText';
import Card from '@/components/ui/Card';
import type { ToolItem } from '@/types/content';

export default function ToolsGrid({ items }: { items: ToolItem[] }) {
  return (
    <section className="relative w-full bg-bg px-6 py-24 text-center md:px-12 md:py-40">
      <div className="mx-auto max-w-canvas">
        <AnimatedSection variant="fadeIn" className="flex justify-center">
          <SectionTag>What I Work With</SectionTag>
        </AnimatedSection>
        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6">
          <h2 className="font-display text-[10vw] font-medium leading-none tracking-wide text-heading md:text-h1">
            Tools
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-h2Mobile md:text-h2">
            <GradientText>From research to wireframes to developer handoff,</GradientText>{' '}
            <span className="text-body/30">the tools behind every project.</span>
          </p>
        </AnimatedSection>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 md:mt-24 md:grid-cols-5 md:gap-6">
          {items.map((tool, i) => (
            <AnimatedSection key={tool._id} variant="scaleIn" delay={0.04 * i}>
              <Card className="flex aspect-square items-center justify-center p-4">
                {tool.iconUrl ? (
                  <Image src={tool.iconUrl} alt={tool.name} width={45} height={45} />
                ) : (
                  <span className="text-xs text-body">{tool.name}</span>
                )}
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
