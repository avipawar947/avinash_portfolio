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
 * Everything scales with --fig (floored on small screens) and the columns are
 * flow-laid-out so text and buttons never overlap at any viewport.
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
      style={{
        paddingTop: "var(--section-pad)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      <div className="mx-auto w-full max-w-[calc(1720*var(--fig))] px-[max(1rem,calc(20*var(--fig)))]">
        <div
          className="relative w-full overflow-hidden rounded-[16px] border border-[rgba(107,102,102,0.15)] bg-[#0d0d0d]"
          style={{
            padding:
              "max(2.25rem, calc(72 * var(--fig))) max(1.5rem, calc(80 * var(--fig)))",
          }}
        >
          <Image
            src="/images/Lets_Talk_Background_Image.webp"
            alt=""
            fill
            className="absolute inset-0 rounded-[16px] object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="relative flex flex-col gap-[max(3rem,calc(64*var(--fig)))] lg:flex-row lg:items-center lg:gap-[calc(80*var(--fig))]">
            {/* --- Left copy column (Frame 95624) ------------------ */}
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
              <span
                className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
                style={{
                  padding: "calc(10 * var(--fig))",
                  fontSize: "max(0.75rem, calc(16 * var(--fig)))",
                }}
              >
                Get In Touch
              </span>

              <h2
                id="contact-heading"
                className="m-0 font-display font-medium text-[var(--color-text)]"
                style={{
                  marginTop: "max(1.25rem, calc(32 * var(--fig)))",
                  fontSize: "max(2.5rem, calc(120 * var(--fig)))",
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                  fontWeight: 510,
                }}
              >
                Let&rsquo;s Talk
              </h2>

              <p
                className="m-0 font-semibold capitalize"
                style={{
                  marginTop: "max(1.25rem, calc(32 * var(--fig)))",
                  fontSize: "max(1.125rem, calc(28 * var(--fig)))",
                  lineHeight: "max(1.75rem, calc(40 * var(--fig)))",
                  letterSpacing: "0.02em",
                  width: "min(100%, calc(822 * var(--fig)))",
                  fontWeight: 590,
                }}
              >
                <GradientText className="block lg:whitespace-nowrap">
                  Looking for a full-time UI/UX and product design role.
                </GradientText>
                <span
                  className="block text-[#b0b0b0] lg:whitespace-nowrap"
                  style={{ opacity: 0.3 }}
                >
                  Open to freelance alongside it.
                </span>
              </p>

              {/* --- CTA button row (Frame 95628) ------------------ */}
              <div
                className="flex items-center justify-center gap-[max(1rem,calc(16*var(--fig)))] lg:justify-start"
                style={{ marginTop: "max(2.5rem, calc(56 * var(--fig)))" }}
              >
                <a
                  href="#"
                  className="inline-flex shrink-0 items-center justify-center rounded-[100px] border border-white/10 bg-btn-gradient text-[#010101] glow-shadow transition-transform hover:scale-[1.02] active:scale-95"
                  style={{
                    fontFamily:
                      "'Inter', -apple-system, Helvetica, Arial, sans-serif",
                    fontSize: "max(0.75rem, calc(18 * var(--fig)))",
                    lineHeight: "max(1rem, calc(22 * var(--fig)))",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    padding:
                      "max(0.6rem, calc(10 * var(--fig))) max(1.25rem, calc(32 * var(--fig)))",
                  }}
                >
                  Contact Us
                </a>
                {linkedin && (
                  <SocialIcon
                    platform="linkedin"
                    url={linkedin.url}
                    className="!h-10 !w-10"
                  />
                )}
              </div>
            </div>

            {/* --- Right device tabs + mockup ---------------------- */}
            <div className="flex w-full flex-1 items-center justify-center">
              <ContactTabs tabs={content.tabs ?? []} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
