'use client';

import Image from 'next/image';

import { clsx } from 'clsx';
import type { ClientLogoItem } from '@/types/content';

/**
 * Client logo marquee — the logo band between the hero and the work grid.
 *
 * The strip is drawn twice and translated by exactly one copy's width
 * (`--mq-shift`, below), which is where copy two begins — so the loop is
 * seamless. The design overhangs both edges of the 1920 frame; that
 * overhang is the design telling us it scrolls.
 *
 * Every dimension is written in design pixels multiplied by `--mq` (see
 * globals.css), which is one design pixel on whichever canvas is active:
 * 1920px with 60px-tall logos on a 140px pitch, re-based onto 393px with
 * 40px-tall logos on a 72px pitch below 600px. Because the browser owns
 * the arithmetic, a resize re-derives the strip and the scroll offset with
 * it — the loop can never desync, which is what a measured-in-JS marquee
 * does the moment the window changes width. Duration comes from the same
 * distance via `--mq-secs-per-px`, so the logos travel at the speed the
 * design travels at however many of them the CMS holds.
 *
 * Logos themselves come from the CMS; `width` is the logo's own width at
 * the shared 60px cap height, which is what keeps every logo at a true
 * 60px tall instead of being stretched into a fixed box.
 */
export default function ClientMarquee({
  logos,
}: {
  logos: ClientLogoItem[];
}) {
  const items = logos.filter((logo) => logo.logoUrl);
  if (!items.length) return null;

  // CMS logos may predate the width field; fall back to a sensible 140 so
  // the strip keeps a consistent rhythm.
  const widths = items.map((logo) => (logo.width > 0 ? logo.width : 140));
  const widthsTotal = widths.reduce((total, width) => total + width, 0);

  const LogoStrip = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <ul
      aria-hidden={ariaHidden}
      className="m-0 flex shrink-0 list-none items-center p-0"
      style={{
        gap: 'calc(var(--mq-gap) * var(--mq))',
        // Keep the gap before the next copy identical to the internal one.
        paddingRight: 'calc(var(--mq-gap) * var(--mq))',
      }}
    >
      {items.map((logo, index) => {
        const width = widths[index];
        return (
          <li
            key={logo._id}
            className="relative shrink-0"
            style={{
              width: `calc(${width} * var(--mq-logo-scale) * var(--mq))`,
              height: 'calc(var(--mq-logo-h) * var(--mq))',
            }}
          >
            <Image
              src={logo.logoUrl}
              alt={ariaHidden ? '' : logo.name}
              fill
              // Below 600px the strip re-bases onto the 393px canvas, where
              // a logo is widest (its cap height is still 40px, but `--mq`
              // is nearly 5x larger), so that case is sized for the top of
              // that range rather than its floor.
              sizes={`(max-width: 600px) ${Math.ceil(width * 1.02)}px, ${width}px`}
              quality={90}
              // The duplicate is the same URLs again, so it resolves from
              // cache as it scrolls in — no need to queue it behind the
              // visible copy.
              loading={ariaHidden ? 'lazy' : 'eager'}
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
      tabIndex={0}
      className="marquee-strip relative w-full overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: 'calc(var(--mq-pad-top) * var(--mq))',
        paddingBottom: 'calc(var(--mq-pad-bottom) * var(--mq))',
      }}
    >
      <div
        className="marquee-track flex w-max items-center"
        style={
          {
            // One copy of the strip: the logos plus the trailing gap that
            // separates it from the copy after it.
            '--mq-shift': `calc(${widthsTotal} * var(--mq-logo-scale) + ${items.length} * var(--mq-gap))`,
          } as React.CSSProperties
        }
      >
        <LogoStrip />
        {/* Second copy exists only to make the loop seamless. */}
        <LogoStrip ariaHidden />
      </div>
    </section>
  );
}
