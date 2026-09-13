import Image from "next/image";
import AnimatedSection from "@/components/motion/AnimatedSection";
import Pill from "@/components/ui/Pill";
import GridOverlay from "@/components/ui/GridOverlay";
import type { HeroContent } from "@/types/content";

export default function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden bg-white md:h-[90vh]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url(/seed/hero-bg.jpg)" }}
      />
      <GridOverlay />

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <AnimatedSection variant="fadeIn">
          <p className="select-none font-display text-[15vw] font-bold uppercase leading-none tracking-wide text-white/20 md:text-[100px]">
            {content.taglineTop}&nbsp;&nbsp;&nbsp;{content.taglineBottom}
          </p>
        </AnimatedSection>

        {content.characterImageUrl && (
          <div className="pointer-events-none absolute bottom-0 h-[70%] w-full">
            <Image
              src={content.characterImageUrl}
              alt={content.name}
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        )}

        <AnimatedSection
          variant="fadeUp"
          delay={0.2}
          className="relative z-10 mt-4"
        >
          <h1 className="font-display text-[13vw] font-bold leading-none tracking-wide text-white md:text-[120px]">
            {content.name}
          </h1>
        </AnimatedSection>

        <div className="absolute left-[12%] top-[38%] hidden rotate-[13deg] md:block">
          <Pill>{content.badgeText}</Pill>
        </div>
        {content.statusActive && (
          <div className="absolute right-[14%] top-[42%] hidden rotate-[17deg] md:block">
            <Pill dashed>
              <span className="h-2 w-2 rounded-full border border-[#33CE0D] bg-[#33CE0D]" />
              {content.statusText}
            </Pill>
          </div>
        )}
      </div>

      {/* fade into next section */}
      <div className="pointer-events-none absolute bottom-0 h-1/3 w-full bg-gradient-to-b from-transparent to-bg" />
    </section>
  );
}
