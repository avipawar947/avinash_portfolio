import Image from 'next/image';
import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GridOverlay from '@/components/ui/GridOverlay';
import type { GalleryImageItem } from '@/types/content';

export default function Gallery({ items }: { items: GalleryImageItem[] }) {
  return (
    <section className="relative w-full overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-40">
      <GridOverlay />
      <div className="relative mx-auto max-w-canvas text-center">
        <AnimatedSection variant="fadeIn" className="flex justify-center">
          <SectionTag>Creative Showcase</SectionTag>
        </AnimatedSection>
        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6">
          <h2 className="font-display text-[12vw] font-medium leading-none tracking-wide text-heading md:text-h1">
            Gallery
          </h2>
        </AnimatedSection>
      </div>

      <div className="relative mt-16 flex justify-center gap-4 overflow-x-auto px-4 md:mt-24 md:gap-6">
        {items.map((img, i) => (
          <AnimatedSection
            key={img._id}
            variant="scaleIn"
            delay={0.05 * i}
            className="relative h-[220px] w-[180px] shrink-0 overflow-hidden rounded-frame md:h-[284px] md:w-[287px]"
          >
            {img.imageUrl && (
              <Image src={img.imageUrl} alt={img.caption || 'gallery'} fill className="object-cover" />
            )}
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
