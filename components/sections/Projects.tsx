import Image from 'next/image';
import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GradientText from '@/components/ui/GradientText';
import GridOverlay from '@/components/ui/GridOverlay';
import type { ProjectItem } from '@/types/content';

export default function Projects({ items }: { items: ProjectItem[] }) {
  return (
    <section className="relative w-full bg-bg px-6 py-24 md:px-12 md:py-40">
      <GridOverlay />
      <div className="relative mx-auto max-w-canvas">
        <AnimatedSection variant="fadeIn" className="flex justify-center">
          <SectionTag>Recent Work</SectionTag>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6 text-center">
          <h2 className="font-display text-[12vw] font-medium leading-none tracking-wide text-heading md:text-h1">
            Case Study
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-h2Mobile md:text-h2">
            <GradientText>Every screen here started as a question,</GradientText>
            <br />
            <span className="text-body/30">not a layout.</span>
          </p>
        </AnimatedSection>

        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-2 md:gap-16">
          {items.map((project, i) => (
            <AnimatedSection
              key={project._id}
              variant={i % 2 === 0 ? 'slideRight' : 'slideLeft'}
              delay={0.1 * i}
              className={i % 2 === 1 ? 'md:mt-24' : ''}
            >
              <GradientText as="h3" className="mb-4 text-h2Mobile md:text-h2">
                {project.title}
              </GradientText>
              <div className="overflow-hidden rounded-frame border border-lineStrong p-2">
                <div className="relative aspect-[738/468] w-full overflow-hidden rounded-card">
                  {project.imageUrl && (
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
