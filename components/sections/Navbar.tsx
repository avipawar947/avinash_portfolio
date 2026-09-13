"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import SocialIcon from "@/components/ui/SocialIcon";
import type { NavbarContent } from "@/types/content";

/**
 * Navbar — Figma homepage frame, 1920 x 11835.
 *
 * Measured from the 1920 frame:
 *   bar        1920 x 80, bottom rule 1px #3A3A3A
 *   AP logo    48 x 40 at (140, 20)
 *   wordmark   SF Pro 700 16/20, +0.32px tracking, x = 192 (two lines)
 *   link pill  496 x 48 at x = 712, radius 100
 *   links      16px Inter, +0.32px tracking; active = Bold + 24x2 rule
 *   LinkedIn   48 x 48 at x = 1536, white radial gradient + glow
 *   CTA        188 x 48 at x = 1592, radius 100, white radial gradient
 *
 * Every size is written verbatim in Figma pixels against `--fig`, so the
 * whole bar scales proportionally with the viewport. Content (labels,
 * links, resume URL) still comes from the CMS via `content`. Below 1024px
 * the links collect into the full-screen `MobileMenu`.
 */
export default function Navbar({
  content,
  linkedInUrl = "",
}: {
  content: NavbarContent;
  linkedInUrl?: string;
}) {
  const [activeId, setActiveId] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [...content.links].sort((a, b) => a.order - b.order);
  const centers = linkCenters(links.length);
  const resumeConfigured =
    content.resumeUrl.trim().length > 0 && content.resumeUrl !== "#";

  // Map a nav href to the DOM section it scrolls to.
  const sectionId = sectionIdFromHref;

  // Highlight the section currently in view (IntersectionObserver — no
  // scroll listeners, cheap under smooth scroll).
  useEffect(() => {
    const targets = links
      .map((link) => document.getElementById(sectionId(link.href)))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.5, 1] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wordmark is two stacked lines in the design.
  const [first, ...rest] = content.logoText.split(" ");

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full border-b backdrop-blur-md"
        style={{
          height: "var(--navbar-h)",
          zIndex: "var(--z-navbar)",
          borderColor: "var(--color-border-nav)",
          backgroundColor:
            "color-mix(in srgb, var(--color-surface) 60%, transparent)",
        }}
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-full items-center justify-between px-5 lg:justify-normal lg:px-0"
          style={{ maxWidth: "var(--container-max)" }}
        >
          {/* Brand — AP logo + two-line wordmark, Figma node 1:46 / 1:35.
              Below lg the mark holds a fixed floor size instead of the
              viewport-proportional measurement. */}
          <a
            href={links[0]?.href || "#"}
            onClick={(e) => {
              setActiveId("home");
              handleNavClick(e, links[0]?.href || "");
            }}
            aria-label={`${content.logoText || "AVINASH"} - home`}
            className="relative flex items-center gap-2 lg:absolute lg:left-[calc(140*var(--fig))] lg:gap-[calc(4*var(--fig))]"
          >
            <span
              className="relative block shrink-0 [--logo-w:2.5rem] lg:[--logo-w:calc(48*var(--fig))]"
              style={{
                width: "var(--logo-w)",
                height: "calc(var(--logo-w) * 5 / 6)",
              }}
            >
              <Image
                src={content.logoImageUrl || "/brand/ap-logo.png"}
                alt=""
                fill
                sizes="48px"
                className="object-contain"
              />
            </span>
            <span className="font-display text-[0.8125rem] leading-[1.15] font-bold tracking-[0.02em] text-[var(--color-text)] uppercase lg:text-[calc(16*var(--fig))] lg:leading-[calc(20*var(--fig))] lg:tracking-[calc(0.32*var(--fig))]">
              {first}
              {rest.length > 0 && (
                <>
                  <br />
                  {rest.join(" ")}
                </>
              )}
            </span>
          </a>

          {/* Link pill — 496 x 48 centred, Figma node 1:36. Labels sit on
              their measured centres, not a flex gap. */}
          <ul
            className="absolute m-0 hidden list-none p-0 lg:block"
            style={{
              left: "calc(712 * var(--fig))",
              width: "calc(496 * var(--fig))",
              height: "calc(48 * var(--fig))",
            }}
          >
            {links.map((link, i) => {
              const isActive = activeId === sectionId(link.href);
              return (
                <li
                  key={link.href}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `calc(${centers[i]} * var(--fig))` }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      setActiveId(sectionId(link.href));
                      handleNavClick(e, link.href);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
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
                    {/* Active rule — 24 x 2, radius 100, Figma node 1:41 */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-1/2 ml-[calc(-12*var(--fig))] rounded-[var(--radius-pill)] bg-[var(--color-text)]"
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

          {/* LinkedIn — x=1536, 48×48. Uses the same SocialIcon component
              as ContactCTA / Footer (black SVG glyph on the gradient circle). */}
          <div
            className="absolute hidden lg:grid lg:place-items-center"
            style={{
              left: "calc(1536 * var(--fig))",
              top: "50%",
              transform: "translateY(-50%)",
              width: "calc(48 * var(--fig))",
              height: "calc(48 * var(--fig))",
            }}
          >
            <SocialIcon
              platform="linkedin"
              url={linkedInUrl || "#"}
              className="!h-[calc(48*var(--fig))] !w-[calc(48*var(--fig))]"
            />
          </div>

          {/* CTA — 188 x 48 at x=1592, node 1:42. Inert until a resume path set. */}
          <motion.a
            {...(resumeConfigured
              ? { href: content.resumeUrl, download: true }
              : { "aria-disabled": true })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute hidden place-items-center cursor-pointer text-center font-medium text-[var(--color-text-inverse)] lg:grid"
            style={{
              left: "calc(1592 * var(--fig))",
              width: "calc(188 * var(--fig))",
              height: "calc(48 * var(--fig))",
              fontSize: "calc(16 * var(--fig))",
              letterSpacing: "calc(0.32 * var(--fig))",
              borderRadius: "var(--radius-pill)",
              backgroundImage: "var(--gradient-cta)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Download Resume
          </motion.a>

          {/* Mobile trigger — below 1024px (no mobile counterpart in Figma). */}
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

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            links={links}
            resumeUrl={resumeConfigured ? content.resumeUrl : ""}
            linkedInUrl={linkedInUrl}
            onClose={() => setMenuOpen(false)}
            onNavigate={(href) => setActiveId(sectionIdFromHref(href))}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** `#hash` links smooth-scroll via CSS; `/` is a same-page link so it only
    scrolls to the top instead of triggering a full navigation. */
function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/** Map a nav href to the DOM section it scrolls to. */
function sectionIdFromHref(href: string) {
  return !href || href === "/" ? "home" : href.replace(/^#/, "");
}

/** Figma-measured label x-centres inside the 496px pill (nodes 1:37-1:40). */
function linkCenters(count: number) {
  const FIGMA_CENTERS = [56, 180, 304, 436];
  if (count === FIGMA_CENTERS.length) return FIGMA_CENTERS;
  // Fallback for a CMS with more/fewer links: distribute evenly.
  return Array.from({ length: count }, (_, i) => (496 * (i + 0.5)) / count);
}

/** Full-screen mobile menu, composed from the design's own vocabulary. */
function MobileMenu({
  links,
  resumeUrl,
  linkedInUrl,
  onClose,
  onNavigate,
}: {
  links: NavbarContent["links"];
  resumeUrl: string;
  linkedInUrl: string;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 bg-[var(--color-surface)] lg:hidden"
      style={{ zIndex: "var(--z-menu)" }}
    >
      <nav
        aria-label="Mobile"
        className="flex h-full flex-col justify-center gap-6 px-8"
      >
        <ul className="m-0 list-none p-0">
          {links.map((link, index) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.06 * index,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <a
                href={link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href);
                  onNavigate(link.href);
                  onClose();
                }}
                className="block py-3 font-display text-[clamp(2.5rem,12vw,4rem)] leading-[1.1] font-bold text-[var(--color-text)]"
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex flex-col gap-3"
        >
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              className="grid h-12 place-items-center rounded-[var(--radius-pill)] font-medium text-[var(--color-text-inverse)] glow-shadow"
              style={{ backgroundImage: "var(--gradient-cta)" }}
            >
              Download Resume
            </a>
          )}
          {linkedInUrl && (
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="grid h-12 place-items-center rounded-[var(--radius-pill)] border border-[var(--color-border-nav)] text-[var(--color-text)]"
            >
              LinkedIn
            </a>
          )}
        </motion.div>
      </nav>
    </motion.div>
  );
}
