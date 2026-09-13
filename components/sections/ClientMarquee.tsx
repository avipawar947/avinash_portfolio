'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { clsx } from 'clsx';
import { gsap } from '@/lib/animations';
import { useIsomorphicLayoutEffect } from '@/lib/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import type { ClientLogoItem } from '@/types/content';

/**
 * Client logo marquee — Figma node 1:47.
 *
 * The design draws one 3136px strip of logos, each 60px tall with a
 * 140px gap, overhanging both edges of the 1920 frame. That overhang is
 * the design telling us it scrolls, so the strip is rendered twice and
 * translated by exactly half its width — at which point copy two is
 * where copy one began and the loop is seamless.
 *
 * Everything is scaled by `--fig`, so the strip, gaps and speeds hold
 * on any viewport the same way the reference does. Duration is derived
 * from width rather than fixed, so logos travel at a constant speed
 * regardless of how many there are. Logos themselves come from the CMS.
 */
export default function ClientMarquee({
  logos,
}: {
  logos: ClientLogoItem[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Half the track is one full copy of the strip.
      const distance = el.scrollWidth / 2;
      const SPEED = 60; // px per second

      gsap.to(el, {
        x: -distance,
        duration: distance / SPEED,
        ease: 'none',
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const items = logos.filter((logo) => logo.logoUrl);
  if (!items.length) return null;

  const LogoStrip = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <ul
      aria-hidden={ariaHidden}
      className="m-0 flex shrink-0 list-none items-center p-0"
      style={{
        gap: 'calc(140 * var(--fig))',
        // Keep the gap before the next copy identical to the internal one.
        paddingRight: 'calc(140 * var(--fig))',
      }}
    >
      {items.map((logo) => {
        // CMS logos may predate the width field; fall back to a sensible
        // 140 so the strip keeps a consistent rhythm.
        const width = logo.width > 0 ? logo.width : 140;
        return (
          <li
            key={logo._id}
            className="relative shrink-0"
            style={{
              width: `calc(${width} * var(--fig))`,
              height: 'calc(60 * var(--fig))',
            }}
          >
            <Image
              src={logo.logoUrl}
              alt={ariaHidden ? '' : logo.name}
              fill
              sizes={`${width}px`}
              className={clsx(
                'object-contain',
                logo.luminosity && 'mix-blend-luminosity',
              )}
            />
          </li>
        );
      })}
    </ul>
  );

  return (
    <section
      id="clients"
      aria-label="Clients and organisations I have worked with"
      className="relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{ paddingBlock: 'max(2.5rem, calc(100 * var(--fig)))' }}
    >
      <div ref={track} className="flex w-max items-center">
        <LogoStrip />
        {/* Second copy exists only to make the loop seamless. */}
        <LogoStrip ariaHidden />
      </div>
    </section>
  );
}