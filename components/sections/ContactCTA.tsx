import Button from '@/components/ui/Button';
import SocialIcon from '@/components/ui/SocialIcon';
import AnimatedSection from '@/components/motion/AnimatedSection';
import SectionTag from '@/components/ui/SectionTag';
import GradientText from '@/components/ui/GradientText';
import type { FooterContent } from '@/types/content';

export default function ContactCTA({ footer }: { footer: FooterContent }) {
  const linkedin = footer.socialLinks.find((s) => s.platform === 'linkedin');
  return (
    <section className="relative w-full bg-bg px-6 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-canvas">
        <AnimatedSection variant="fadeIn">
          <SectionTag>Get In Touch</SectionTag>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" delay={0.1} className="mt-6">
          <h2 className="font-display text-[14vw] font-medium leading-none tracking-wide text-heading md:text-h1">
            Let&rsquo;s Talk
          </h2>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" delay={0.2} className="mt-6 max-w-2xl">
          <p className="text-h2Mobile md:text-h2">
            <GradientText>Looking for a full-time UI/UX and product design role.</GradientText>
            <br />
            <span className="text-body/30">Open to freelance alongside it.</span>
          </p>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" delay={0.3} className="mt-10 flex items-center gap-4">
          <Button variant="primary">Contact Us</Button>
          {linkedin && <SocialIcon platform="linkedin" url={linkedin.url} />}
        </AnimatedSection>
      </div>
    </section>
  );
}
