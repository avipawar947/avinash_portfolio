import type { MutableRefObject } from 'react';

import { useIsomorphicLayoutEffect } from '@/lib/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import type { GalleryImageItem } from '@/types/content';

const CARD_W = 287;
const GAP = 12;
/** Design px travelled per second. Positive = cards move left. */
const SPEED = 60;

export interface GalleryMarqueeConfig {
  /** Design-space y of the strip centreline, from the stage's top edge. */
  centerY: number;
  /** Screen px per design px, derived from the measured stage width. */
  scale: (stageWidth: number) => number;
}

/** Desktop: the 1920px Figma canvas (`--fig`). */
export const desktopMarquee: GalleryMarqueeConfig = {
  centerY: 0,
  scale: (width) => width / 1920,
};

/** Mobile: one tile is `--gal-u` = clamp(8rem, 41.12vw, 10.1rem). */
export const mobileMarquee: GalleryMarqueeConfig = {
  centerY: 0,
  scale: (width) => Math.min(Math.max(128, width * 0.4112), 161.6) / CARD_W,
};

/**
 * Continuous curved gallery, adapted from the supplied `matrix3d` logic.
 *
 * Every card is placed at `x = (i * pitch - offset)` around the stage centre.
 * Its left and right edges get their heights from a parabola fitted to our DB
 * heights (shortest in the middle, tallest at the ends). A perspective matrix
 * maps those two edge heights onto one card — so the card bends onto the arc
 * and visibly rotates as it travels, instead of sliding flat.
 *
 * The tile set repeats enough times to cover the viewport, and `offset`
 * wraps by the full strip width, so the loop is seamless. Hover never pauses
 * it; reduced-motion users get a single static frame.
 */
export function useGalleryMarquee(
  items: GalleryImageItem[],
  stage: MutableRefObject<HTMLElement | null>,
  cards: MutableRefObject<Array<HTMLElement | null>>,
  config: GalleryMarqueeConfig,
) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = stage.current;
    if (!el || !items.length) return;

    const base = items.length;
    const count = base * Math.ceil(10 / base);
    const pitch = CARD_W + GAP;
    const total = count * pitch;

    /* Fit the curve to the actual tile data: centre tiles are the shortest,
       outer tiles the tallest, all sharing the same vertical centreline. */
    const tops = items.map((i) => i.top);
    const heights = items.map((i) => i.height);
    const minTop = Math.min(...tops);
    const centreH = Math.min(...heights);
    const edgeH = Math.max(...heights);
    const curve = edgeH - centreH;
    const arcCenter =
      (Math.min(...items.map((i) => i.left)) +
        Math.max(...items.map((i) => i.left + CARD_W))) /
      2;
    const edgeX =
      Math.max(
        ...items.map((i) => Math.abs(i.left + CARD_W / 2 - arcCenter)),
      ) || pitch;
    const centreY = config.centerY || minTop + edgeH / 2;

    let offset = 0;
    let last: number | null = null;
    let raf = 0;

    const draw = () => {
      const k = config.scale(el.clientWidth);
      const w = CARD_W * k;
      const H = centreH * k;
      const heightAt = (x: number) =>
        (centreH + curve * (x / edgeX) ** 2) * k;

      cards.current.forEach((card, i) => {
        if (!card) return;

        const pos = ((((i * pitch - offset) % total) + total) % total) - total / 2;
        const L = pos * k;
        const R = L + w;
        const hl = heightAt(pos);
        const hr = heightAt(pos + CARD_W);

        /* Map the card's two vertical edges onto the curve. The perspective
           divide (`g`) makes the right edge land at R with height hr while
           the left edge stays at L with height hl. */
        const q = hl / hr - 1;
        const g = q / w;
        const a = (R * (1 + q) - L) / w;

        card.style.width = `${w}px`;
        card.style.height = `${H}px`;
        card.style.marginTop = `${-H / 2}px`;
        card.style.borderRadius = `${8 * k}px`;
        card.style.top = `${centreY * k}px`;
        card.style.transform = `matrix3d(${a},0,0,${g}, 0,${hl / H},0,0, 0,0,1,0, ${L},0,0,1)`;
      });
    };

    draw();
    if (prefersReducedMotion) return;

    const tick = (now: number) => {
      if (last !== null) {
        offset = (offset + (SPEED * Math.min(now - last, 50)) / 1000) % total;
      }
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items, stage, cards, config, prefersReducedMotion]);
}
