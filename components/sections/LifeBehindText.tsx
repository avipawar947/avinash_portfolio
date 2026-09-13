import Image from 'next/image';
import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import type { LifeBehindTextItemContent } from '@/types/content';

export default function LifeBehindText({ items }: { items: LifeBehindTextItemContent[] }) {
  return (
    <section className="relative w-full bg-bg px-6 py-24 text-center md:px-12 md:py-40">
      <div className="mx-auto max-w-canvas">
        <AnimatedSection variant="fadeIn" className="flex justify-center">
          <SectionTag>Beyond the Pixels</SectionTag>
        </AnimatedSection>
        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6">
          <h2 className="font-display text-[9vw] font-medium leading-none tracking-wide text-heading md:text-[80px]">
            The Person Behind the Work
          </h2>
        </AnimatedSection>
      </div>

      <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:mt-24 md:px-12">
        {items.map((item, i) => (
          <AnimatedSection
            key={item._id}
            variant="scaleIn"
            delay={0.05 * i}
            className="relative h-[280px] w-[240px] shrink-0 snap-center overflow-hidden rounded-card bg-card-gradient p-2 md:h-[372px] md:w-[380px]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-card">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt="life behind the text" fill className="object-cover" />
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
