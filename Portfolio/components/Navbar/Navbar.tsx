"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useLenis } from "@/components/providers";
import { Logo } from "@/components/ui";
import { NAV_LINKS, SITE, isConfigured } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

/**
 * Navbar — Figma node 1:34.
 *
 * Measured from the 1920 frame:
 *   bar        1920 x 80, bottom rule 1px #3A3A3A
 *   AP logo    48 x 40 at (140, 20)
 *   wordmark   16/20 SF Pro Bold, +0.32 tracking, at x=192
 *   link pill  496 x 48, centred, radius 100
 *   links      16px Inter, +0.32 tracking; active = Bold + 24x2 rule
 *   LinkedIn   48 x 48 at x=1536
 *   CTA        188 x 48 at x=1592, radius 100, white radial gradient
 *
 * Below 1024px the design has no counterpart, so the bar collapses to
 * brand + menu trigger and the links move into `MobileMenu`.
 */
export function Navbar() {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState<string>(NAV_LINKS[0].href.slice(1));
  const [menuOpen, setMenuOpen] = useState(false);

  // Reflect the section in view. IntersectionObserver rather than a
  // scroll handler, so it costs nothing per frame under Lenis.
  useEffect(() => {
    const targets = NAV_LINKS.map((link) =>
      document.getElementById(link.href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.5, 1] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const target = document.querySelector(href);
      // Let Lenis own the scroll when it is running so the jump uses the
      // page's easing; otherwise fall through to the native anchor.
      if (target && lenis.current) {
        event.preventDefault();
        lenis.current.scrollTo(target as HTMLElement);
      }
    },
    [lenis],
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full border-b border-[var(--color-border-nav)]",
          "bg-[color-mix(in_srgb,var(--color-surface)_60%,transparent)] backdrop-blur-md",
        )}
        style={{ height: "var(--navbar-h)", zIndex: "var(--z-navbar)" }}
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-full items-center justify-between px-5 lg:justify-normal lg:px-0"
          style={{ maxWidth: "var(--container-max)" }}
        >
          {/* Brand (1:46 + 1:35) */}
          <a
            href={NAV_LINKS[0].href}
            onClick={(event) => handleNavClick(event, NAV_LINKS[0].href)}
            aria-label={`${SITE.name} - home`}
            className="flex items-center gap-2 lg:absolute lg:gap-[calc(4*var(--fig))]"
            style={{ left: "calc(140 * var(--fig))" }}
          >
            <Logo
              widthVar="var(--logo-w)"
              className="[--logo-w:2.5rem] lg:[--logo-w:calc(48*var(--fig))]"
            />
            <span className="font-[family-name:var(--font-display)] text-[0.8125rem] leading-[1.15] font-bold tracking-[0.02em] text-[var(--color-text)] uppercase lg:text-[calc(16*var(--fig))] lg:leading-[calc(20*var(--fig))] lg:tracking-[calc(0.32*var(--fig))]">
              Avinash
              <br />
              Pawar
            </span>
          </a>

          {/* Desktop links (1:36) — 496px pill at x=712, labels placed on
              their Figma centres rather than distributed by a flex gap. */}
          <ul
            className="absolute m-0 hidden list-none p-0 lg:block"
            style={{
              left: "calc(712 * var(--fig))",
              width: "calc(496 * var(--fig))",
              height: "calc(48 * var(--fig))",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <li
                  key={link.href}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `calc(${link.centerX} * var(--fig))` }}
                >
                  <a
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    aria-current={isActive ? "page" : undefined}
                    data-cursor="link"
                    className={cn(
                      "relative block text-center whitespace-nowrap text-[var(--color-text)] transition-opacity duration-300",
                      isActive
                        ? "font-bold"
                        : "font-normal opacity-70 hover:opacity-100",
                    )}
                    style={{
                      fontSize: "calc(16 * var(--fig))",
                      letterSpacing: "calc(0.32 * var(--fig))",
                      paddingBlock: "calc(12 * var(--fig))",
                    }}
                  >
                    {link.label}
                    {/* Active rule (1:41): 24 x 2, radius 100 */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-1/2 -translate-x-1/2 rounded-[var(--radius-pill)] bg-[var(--color-text)]"
                        style={{
                          bottom: 0,
                          width: "calc(24 * var(--fig))",
                          height: "calc(2 * var(--fig))",
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* LinkedIn (1:44).
              The design binds no URL to this. Until one is set in
              site.ts the mark still renders — dropping it would deviate
              from Figma — but carries no href, so it is neither
              focusable nor clickable rather than linking nowhere. */}
          <a
            {...(isConfigured(SITE.linkedIn)
              ? {
                  href: SITE.linkedIn,
                  target: "_blank",
                  rel: "noreferrer noopener",
                }
              : { "aria-disabled": true })}
            data-cursor="link"
            aria-label="LinkedIn profile"
            className="absolute hidden place-items-center transition-opacity duration-300 hover:opacity-80 lg:grid"
            style={{
              left: "calc(1536 * var(--fig))",
              width: "calc(48 * var(--fig))",
              height: "calc(48 * var(--fig))",
            }}
          >
            <Image
              src="/icons/linkedin.svg"
              alt=""
              width={48}
              height={48}
              className="w-[calc(48*var(--fig))]"
            />
          </a>

          {/* CTA (1:42 / 1:43). Same treatment as the LinkedIn mark:
              visible per the design, inert until a CV path is set. */}
          <motion.a
            {...(isConfigured(SITE.resumeHref)
              ? { href: SITE.resumeHref, download: true }
              : { "aria-disabled": true })}
            data-cursor="cta"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute hidden place-items-center rounded-[var(--radius-pill)] text-center font-medium text-[var(--color-text-inverse)] shadow-[var(--shadow-glow)] lg:grid"
            style={{
              left: "calc(1592 * var(--fig))",
              width: "calc(188 * var(--fig))",
              height: "calc(48 * var(--fig))",
              fontSize: "calc(16 * var(--fig))",
              letterSpacing: "calc(0.32 * var(--fig))",
              backgroundImage: "var(--gradient-cta)",
            }}
          >
            Download Resume
          </motion.a>

          {/* Mobile trigger — no Figma counterpart; see MobileMenu. */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative grid size-10 place-items-center lg:hidden"
            style={{ zIndex: "calc(var(--z-menu) + 1)" }}
          >
            <span aria-hidden className="relative block h-4 w-6">
              <motion.span
                className="absolute left-0 block h-px w-full bg-[var(--color-text)]"
                animate={
                  menuOpen ? { top: 8, rotate: 45 } : { top: 2, rotate: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute left-0 block h-px w-full bg-[var(--color-text)]"
                animate={
                  menuOpen ? { top: 8, rotate: -45 } : { top: 13, rotate: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </button>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
