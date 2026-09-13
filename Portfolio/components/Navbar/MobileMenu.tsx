"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { NAV_LINKS, SITE, isConfigured } from "@/lib/constants";
import { useLenis } from "@/components/providers";

/**
 * Full-screen mobile menu.
 *
 * The Figma file contains only the 1920 desktop frame, so there is no
 * mobile navigation to reproduce. This is composed from the design's own
 * vocabulary — surface #010101, pill radius, the white gradient CTA —
 * rather than invented from scratch or scaled down from desktop.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lenis = useLenis();

  // Lock scrolling behind the overlay, and close on Escape.
  useEffect(() => {
    if (!open) return;

    // Capture the instance: the cleanup must resume the very same Lenis
    // it paused, not whatever the ref happens to hold on unmount.
    const instance = lenis.current;

    instance?.stop();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      instance?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, lenis]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const target = document.querySelector(href);
    onClose();
    if (target && lenis.current) {
      event.preventDefault();
      // Wait for the overlay to release the scroll lock before easing.
      requestAnimationFrame(() =>
        lenis.current?.scrollTo(target as HTMLElement),
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
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
            className="flex h-full flex-col justify-center gap-2 px-5"
          >
            <ul className="m-0 list-none p-0">
              {NAV_LINKS.map((link, index) => (
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
                    onClick={(event) => handleNavClick(event, link.href)}
                    className="block py-3 font-[family-name:var(--font-display)] text-[clamp(2.5rem,12vw,4rem)] leading-[1.1] font-bold text-[var(--color-text)]"
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
              className="mt-8 flex flex-col gap-3"
            >
              {isConfigured(SITE.resumeHref) && (
              <a
                href={SITE.resumeHref}
                download
                className="grid h-12 place-items-center rounded-[var(--radius-pill)] text-base font-medium text-[var(--color-text-inverse)] shadow-[var(--shadow-glow)]"
                style={{
                  backgroundImage: "var(--gradient-cta)",
                }}
              >
                Download Resume
              </a>
              )}
              {isConfigured(SITE.linkedIn) && (
              <a
                href={SITE.linkedIn}
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-12 place-items-center rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] text-base text-[var(--color-text)]"
              >
                LinkedIn
              </a>
              )}
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
