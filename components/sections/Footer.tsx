import { Fragment } from "react";
import Image from "next/image";
import SocialIcon from "@/components/ui/SocialIcon";
import { clsx } from "clsx";
import type { FooterContent, NavbarContent } from "@/types/content";

/**
 * 4px dot separator — matches the small Ellipse elements in Figma.
 * role-tag dots are white; bottom-row dot is #D9D9D9.
 */
function Dot({ color = "#ffffff", className }: { color?: string; className?: string }) {
  return (
    <span
      className={clsx("footer-dot shrink-0 rounded-full", className)}
      aria-hidden
      style={{ backgroundColor: color }}
    />
  );
}

// Figma-fixed display order (left→right): LinkedIn (x=1620), Gmail (x=1693), Behance (x=1766)
const SOCIAL_ORDER: FooterContent["socialLinks"][number]["platform"][] = [
  "linkedin",
  "gmail",
  "behance",
];

/**
 * Sizing/spacing for this section lives in the `.footer-root` block of
 * app/globals.css: the desktop canvas at ≥1024px and the supplied 393 × 530
 * mobile frame (re-based for tablets) below it. Nothing here is inline so
 * the narrow layout can override it.
 */
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

  const Socials = ({ className }: { className: string }) => (
    <div className={className}>
      {orderedSocials.map((s) => (
        <SocialIcon
          key={s.platform}
          className={clsx("footer-social", `footer-social--${s.platform}`)}
          platform={s.platform}
          url={s.url}
          variant="ghost"
          iconUrl={s.iconUrl}
        />
      ))}
    </div>
  );

  return (
    <footer className="footer-root relative w-full bg-[#181818]">
      <div className="footer-inner mx-auto w-full">
        {/* ── Top area: left column (logo + role tags) | right column (social icons) ── */}
        <div className="footer-top flex justify-between items-start">
          {/* Left column: logo row then role tags */}
          <div className="footer-col flex flex-col">
            {/* Logo + wordmark — Figma Frame 95630 */}
            <div className="footer-brand flex items-center">
              {navbar.logoImageUrl && (
                <Image
                  src={navbar.logoImageUrl}
                  alt="logo"
                  width={48}
                  height={40}
                  className="footer-logo"
                />
              )}
              <span className="footer-wordmark font-display font-bold uppercase text-white">
                Avinash
                <br />
                Pawar
              </span>
            </div>

            {/* Role tags — Figma top=99, gap from logo bottom = 16 */}
            <div className="footer-tags flex flex-wrap items-center">
              {footer.roleTags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && <Dot />}
                  <span>{tag}</span>
                </Fragment>
              ))}
              <Dot className="footer-loc-dot" />
              <span className="footer-loc">{footer.location}</span>
            </div>
          </div>

          {/* Social icons (desktop row) — Figma top=65 */}
          <Socials className="footer-socials footer-socials--desktop" />
        </div>

        {/* Mobile/tablet-only social icons row */}
        <Socials className="footer-socials footer-socials--mobile" />

        {/* ── Bottom links — mobile frame puts them above the rule ── */}
        <div className="footer-links flex items-center">
          <a href="/privacy-policy">Privacy Policy</a>
          <Dot color="#D9D9D9" />
          <a href="/cookies">Cookies</a>
        </div>

        {/* ── Divider — Figma top=159 (desktop) / top=429 (mobile) ── */}
        <div className="footer-divider" />

        <p className="footer-copy text-white">{footer.copyrightText}</p>
      </div>
    </footer>
  );
}
