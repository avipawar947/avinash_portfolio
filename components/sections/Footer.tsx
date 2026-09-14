import { Fragment } from "react";
import Image from "next/image";
import SocialIcon from "@/components/ui/SocialIcon";
import type { FooterContent, NavbarContent } from "@/types/content";

/**
 * 4px dot separator — matches the small Ellipse elements in Figma.
 * role-tag dots are white; bottom-row dot is #D9D9D9.
 */
function Dot({ color = "#ffffff" }: { color?: string }) {
  return (
    <span
      className="shrink-0 rounded-full"
      aria-hidden
      style={{
        width: "max(0.25rem, calc(4 * var(--fig)))",
        height: "max(0.25rem, calc(4 * var(--fig)))",
        backgroundColor: color,
      }}
    />
  );
}

// Figma-fixed display order (left→right): LinkedIn (x=1620), Gmail (x=1693), Behance (x=1766)
const SOCIAL_ORDER: FooterContent["socialLinks"][number]["platform"][] = [
  "linkedin",
  "gmail",
  "behance",
];

export default function Footer({
  footer,
  navbar,
}: {
  footer: FooterContent;
  navbar: NavbarContent;
}) {
  const orderedSocials = SOCIAL_ORDER.map((platform) =>
    footer.socialLinks.find((s) => s.platform === platform),
  ).filter((s): s is FooterContent["socialLinks"][number] => Boolean(s));

  return (
    <footer
      className="relative w-full bg-[#181818]"
      style={{
        paddingTop: "max(2rem, calc(43 * var(--fig)))",
        paddingBottom: "max(2rem, calc(43 * var(--fig)))",
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "max(1.5rem, calc(100 * var(--fig)))",
        }}
      >
        {/* ── Top area: left column (logo + role tags) | right column (social icons) ── */}
        <div className="flex justify-between items-start">
          {/* Left column: logo row then role tags */}
          <div
            className="flex flex-col"
            style={{
              gap: "max(0.75rem, calc(16 * var(--fig)))",
            }}
          >
            {/* Logo + wordmark — Figma Frame 95630 */}
            <div
              className="flex items-center"
              style={{
                gap: "max(0.25rem, calc(4 * var(--fig)))",
              }}
            >
              {navbar.logoImageUrl && (
                <Image
                  src={navbar.logoImageUrl}
                  alt="logo"
                  width={48}
                  height={40}
                  style={{
                    width: "max(1.75rem, calc(48 * var(--fig)))",
                    height: "auto",
                  }}
                />
              )}
              <span
                className="font-display font-bold uppercase text-white"
                style={{
                  fontSize: "max(0.75rem, calc(16 * var(--fig)))",
                  lineHeight: "max(0.875rem, calc(20 * var(--fig)))",
                  letterSpacing: "0.02em",
                }}
              >
                Avinash
                <br />
                Pawar
              </span>
            </div>

            {/* Role tags — Figma top=99, gap from logo bottom = 16 */}
            <div
              className="flex flex-wrap items-center"
              style={{
                gap: "max(0.375rem, calc(8 * var(--fig)))",
                fontSize: "max(0.75rem, calc(16 * var(--fig)))",
                lineHeight: "max(0.875rem, calc(20 * var(--fig)))",
                color: "#ffffff",
              }}
            >
              {footer.roleTags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && <Dot />}
                  <span>{tag}</span>
                </Fragment>
              ))}
              <Dot />
              <span>{footer.location}</span>
            </div>
          </div>

          {/* Right column: social icons — Figma top=65, margin-top = 22px from logo top */}
          <div
            className="hidden items-center md:flex"
            style={{
              marginTop: "max(1rem, calc(22 * var(--fig)))",
              gap: "max(0.5rem, calc(18.78 * var(--fig)))",
            }}
          >
            {orderedSocials.map((s) => (
              <SocialIcon
                key={s.platform}
                platform={s.platform}
                url={s.url}
                variant="ghost"
                iconUrl={s.iconUrl}
              />
            ))}
          </div>
        </div>

        {/* Mobile-only social icons row */}
        <div
          className="flex items-center md:hidden"
          style={{
            marginTop: "max(1rem, calc(22 * var(--fig)))",
            gap: "max(0.5rem, calc(18.78 * var(--fig)))",
          }}
        >
          {orderedSocials.map((s) => (
            <SocialIcon
              key={s.platform}
              platform={s.platform}
              url={s.url}
              variant="ghost"
              iconUrl={s.iconUrl}
            />
          ))}
        </div>

        {/* ── Divider — Figma top=159, 40px below role tags bottom (119) ── */}
        <div
          className="border-t border-dashed border-white/20"
          style={{
            marginTop: "max(1.5rem, calc(40 * var(--fig)))",
          }}
        />

        {/* ── Bottom row — Figma top=200, 40px below divider bottom (160) ── */}
        <div
          className="flex flex-col items-center justify-between md:flex-row"
          style={{
            marginTop: "max(1.5rem, calc(40 * var(--fig)))",
            gap: "max(0.75rem, calc(16 * var(--fig)))",
          }}
        >
          <p
            className="text-white"
            style={{
              fontSize: "max(0.75rem, calc(14 * var(--fig)))",
              lineHeight: "max(0.875rem, calc(20 * var(--fig)))",
            }}
          >
            {footer.copyrightText}
          </p>
          <div
            className="flex items-center"
            style={{
              gap: "max(0.75rem, calc(16 * var(--fig)))",
              fontSize: "max(0.75rem, calc(14 * var(--fig)))",
              lineHeight: "max(0.875rem, calc(20 * var(--fig)))",
            }}
          >
            <a href="/privacy-policy">Privacy Policy</a>
            <Dot color="#D9D9D9" />
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
