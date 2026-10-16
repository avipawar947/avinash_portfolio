import SocialIcon from "@/components/ui/SocialIcon";
import GradientText from "@/components/ui/GradientText";
import ContactTabs from "@/components/sections/ContactTabs";
import type { ContactCTAContent, FooterContent } from "@/types/content";
import Image from "next/image";

/**
 * "Let's Talk" CTA — Figma nodes 1:43 / 95621.
 *
 * 1720x656 framed card (1px border rgba(107,102,102,0.15), radius 16). Left
 * column holds the copy ("Get In Touch" pill, Let's Talk heading, gradient +
 * muted subtitle, Contact Us pill + LinkedIn circle); right column holds the
 * backend-driven device tabs (Desktop/Mobile/Tablet) above the mockup.
 *
 * Sizing lives in `#contact` (app/globals.css) rather than inline so the
 * phone/tablet composition — the supplied 353px card: 8px radius, 20/80
 * padding, 64px/80px heading, a three-row 20px subtitle and the button row
 * left-flushed to the 20px gutter — can override it below `lg`. At ≥1024px
 * every rule below is exactly the inline style it replaced.
 */
export default function ContactCTA({
  content,
  footer,
}: {
  content: ContactCTAContent;
  footer: FooterContent;
}) {
  const linkedin = footer.socialLinks.find((s) => s.platform === "linkedin");

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
    >
      <div className="contact-inner mx-auto w-full">
        <div className="contact-card relative w-full overflow-hidden">
          <Image
            src="/images/Lets_Talk_Background_Image.webp"
            alt=""
            fill
            className="absolute inset-0 object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="contact-body relative flex flex-col lg:flex-row lg:items-center lg:gap-[calc(80*var(--fig))]">
            {/* --- Left copy column (Frame 95624) ------------------ */}
            <div className="contact-copy-col flex flex-1 flex-col items-start text-left">
              <span className="contact-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
                Get In Touch
              </span>

              <h2
                id="contact-heading"
                className="contact-heading m-0 font-display text-[var(--color-text)]"
              >
                Let&rsquo;s Talk
              </h2>

              {/* Subtitle — desktop split (gradient through "role."). */}
              <p className="contact-copy m-0 font-semibold capitalize hidden lg:block">
                <GradientText className="block lg:whitespace-nowrap">
                  Looking for a full-time UI/UX and product design role.
                </GradientText>
                <span className="contact-line-muted block text-[#b0b0b0] lg:whitespace-nowrap">
                  Open to freelance alongside it.
                </span>
              </p>

              {/* Subtitle — the mobile frame re-splits the same copy into
                  three 20px rows: the fade ends after "UI/UX", the two tails
                  are the flat #B0B0B0 at 25%. */}
              <p className="contact-copy contact-copy-mobile m-0 font-semibold capitalize lg:hidden">
                <GradientText className="contact-mline">
                  Looking for a full-time UI/UX
                </GradientText>
                <span className="contact-mline contact-line-muted text-[#b0b0b0]">
                  and product design role.
                </span>
                <span className="contact-mline contact-line-muted text-[#b0b0b0]">
                  Open to freelance alongside it.
                </span>
              </p>

              {/* --- CTA button row (Frame 95628) ------------------ */}
              <div className="contact-actions flex items-center justify-start">
                <a
                  href="#"
                  className="contact-cta inline-flex shrink-0 items-center justify-center rounded-[100px] border border-white/10 bg-btn-gradient text-[#010101] glow-shadow transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Contact Us
                </a>
                {linkedin && (
                  <SocialIcon
                    platform="linkedin"
                    url={linkedin.url}
                    className="contact-linkedin"
                  />
                )}
              </div>
            </div>

            {/* --- Right device tabs + mockup ---------------------- */}
            <div className="contact-right flex w-full flex-1 items-center justify-center">
              <ContactTabs tabs={content.tabs ?? []} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
