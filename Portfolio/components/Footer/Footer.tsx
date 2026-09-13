import Image from "next/image";

import { Logo } from "@/components/ui";
import { NAV_LINKS, SITE, SECTION_IDS, isConfigured } from "@/lib/constants";

/**
 * Footer and contact destination — Figma node 1:703.
 *
 * **The design's footer frame is empty.** 1920 x 263 with no children,
 * and there is no contact section anywhere in the file even though the
 * navbar (1:36) links to one.
 *
 * Rather than invent a section, this is assembled entirely from elements
 * the design already contains — the monogram and wordmark (1:46, 1:35),
 * the nav links (1:36), the LinkedIn mark (1:44) and the resume CTA
 * (1:42) — arranged inside the 263px band the design specifies. The
 * arrangement is mine; every part of it is the designer's.
 *
 * Contact links render only when configured in `site.ts`. Until then
 * the footer is the brand, the nav and a copyright line, and no dead or
 * fabricated link ships.
 */
export function Footer() {
  const hasLinkedIn = isConfigured(SITE.linkedIn);
  const hasEmail = isConfigured(SITE.email);
  const hasResume = isConfigured(SITE.resumeHref);

  return (
    <footer
      id={SECTION_IDS.contact}
      className="relative w-full border-t border-[var(--color-border-nav)] bg-[var(--color-bg)]"
      style={{ paddingBlock: "max(2.5rem, calc(56 * var(--fig)))" }}
    >
      <div
        className="mx-auto flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-6"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        {/* Brand — the navbar's mark and wordmark (1:46 + 1:35) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 lg:gap-[calc(4*var(--fig))]">
            <Logo
              widthVar="var(--logo-w)"
              className="[--logo-w:2.5rem] lg:[--logo-w:calc(48*var(--fig))]"
            />
            <span className="font-[family-name:var(--font-display)] text-[0.8125rem] leading-[1.15] font-bold tracking-[0.02em] text-[var(--color-text)] uppercase lg:text-[calc(16*var(--fig))] lg:leading-[calc(20*var(--fig))] lg:tracking-[calc(0.32*var(--fig))]">
              Avinash
              <br />
              Pawar
            </span>
          </div>
          <p className="m-0 text-[0.8125rem] text-[#b0b0b0] opacity-60 lg:text-[max(0.8125rem,calc(14*var(--fig)))]">
            {SITE.role}
          </p>
        </div>

        {/* Same links as the navbar (1:36) */}
        <nav aria-label="Footer">
          <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-cursor="link"
                  className="text-[0.9375rem] text-[var(--color-text)] opacity-70 transition-opacity duration-300 hover:opacity-100 lg:text-[max(0.875rem,calc(16*var(--fig)))]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact — each link appears only once it has a real value */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          {(hasEmail || hasLinkedIn) && (
            <ul className="m-0 flex list-none flex-col items-start gap-2 p-0 lg:items-end">
              {hasEmail && (
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    data-cursor="link"
                    className="text-[0.9375rem] text-[var(--color-text)] underline-offset-4 transition-opacity duration-300 hover:underline lg:text-[max(0.875rem,calc(16*var(--fig)))]"
                  >
                    {SITE.email}
                  </a>
                </li>
              )}
              {hasLinkedIn && (
                <li>
                  <a
                    href={SITE.linkedIn}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="link"
                    aria-label="LinkedIn profile"
                    className="inline-flex items-center gap-2 text-[0.9375rem] text-[var(--color-text)] opacity-80 transition-opacity duration-300 hover:opacity-100"
                  >
                    <Image
                      src="/icons/linkedin.svg"
                      alt=""
                      width={48}
                      height={48}
                      className="size-6"
                    />
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          )}

          {hasResume && (
            <a
              href={SITE.resumeHref}
              download
              data-cursor="cta"
              className="grid h-11 place-items-center rounded-[var(--radius-pill)] px-6 text-[0.9375rem] font-medium text-[var(--color-text-inverse)] shadow-[var(--shadow-glow)]"
              style={{ backgroundImage: "var(--gradient-cta)" }}
            >
              Download Resume
            </a>
          )}
        </div>
      </div>

      <div
        className="mx-auto mt-10 w-full border-t border-[var(--color-border-subtle)] pt-6"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--gutter)",
        }}
      >
        <p className="m-0 text-[0.75rem] text-[#b0b0b0] opacity-50">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
