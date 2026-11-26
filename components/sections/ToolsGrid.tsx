'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';

import GradientText from '@/components/ui/GradientText';
import ToolEmblem from './ToolEmblem';
import ToolTile from './ToolTile';
import type { ToolItem } from '@/types/content';

/* ── Animation settings ─────────────────────────────────────────────── */
const DRAW_SPEED = 0.5;   // px per ms  (lines drawing out of the emblem)
const ZAP_SPEED = 0.22;   // px per ms  (lightning, lower = slower)
const ZAP_LEN = 140;      // px length of the lightning streak
const ZAP_GAP = 2400;     // ms pause between lightning loops
const START = 900;        // ms, lines start after the emblem appears

const css = `
.tg-net:not([data-ready]) > :not(svg):not(ul){opacity:0}
.tg-net:not([data-ready]) > ul > *{opacity:0}
`;

type Box = { m: number; c: number; hm: number; hc: number };
type Pt = [number, number];

/* Builds the connector lines from the real DOM positions of the emblem and
   tiles, draws them out of the emblem, pops the tiles in, then loops a slow
   lightning along every line. */
function useNetwork(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const svg = root.querySelector(':scope > svg') as SVGSVGElement | null;
    const ul = root.querySelector(':scope > ul') as HTMLElement | null;
    const emb = [...root.children].find((el) => el !== svg && el !== ul) as HTMLElement | undefined;
    if (!svg || !ul || !emb) return;

    const NS = 'http://www.w3.org/2000/svg';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let anims: Animation[] = [];
    let started = false;

    const build = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
      svg.replaceChildren();

      const R = root.getBoundingClientRect();
      if (!R.width || !R.height) return;
      svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);

      // wide = left/right layout (desktop); tall = top/bottom layout (mobile)
      const vert = R.height > R.width;
      const P = (m: number, c: number): Pt => (vert ? [c, m] : [m, c]);
      const measure = (el: Element): Box => {
        const r = el.getBoundingClientRect();
        const cx = r.left - R.left + r.width / 2;
        const cy = r.top - R.top + r.height / 2;
        return vert
          ? { m: cy, c: cx, hm: r.height / 2, hc: r.width / 2 }
          : { m: cx, c: cy, hm: r.width / 2, hc: r.height / 2 };
      };

      const E = measure(emb);
      const tiles = [...ul.children].map((el) => ({ el: el as HTMLElement, ...measure(el) }));

      /* ── Route every tile ─────────────────────────────────────────── */
      const routes: { el: HTMLElement; pts: Pt[] }[] = [];
      ([-1, 1] as const).forEach((s) => {
        const side = tiles.filter((t) => Math.sign(t.m - E.m) === s);
        const startM = E.m + s * E.hm;
        const edge = (t: Box) => t.m - s * t.hm;

        const straight = side.filter((t) => Math.abs(t.c - E.c) < t.hc * 0.6);
        straight.forEach((t) =>
          routes.push({ el: (t as any).el, pts: [[startM, E.c], [edge(t), E.c]] }),
        );

        ([-1, 1] as const).forEach((cs) => {
          const g = side
            .filter((t) => !straight.includes(t) && Math.sign(t.c - E.c) === cs)
            .sort((a, b) => Math.abs(a.m - E.m) - Math.abs(b.m - E.m));
          if (!g.length) return;

          const near = g[0];
          routes.push({
            el: (near as any).el,
            pts: [[startM, E.c], [near.m, E.c], [near.m, near.c - cs * near.hc]],
          });

          g.slice(1).forEach((f) => {
            let pts: Pt[];
            if (cs < 0) {
              const yj = E.c + cs * Math.abs(f.c - E.c) * 0.38;
              const xb = (near.m + edge(f)) / 2;
              pts = [[startM, E.c], [near.m, E.c], [near.m, yj], [xb, yj], [xb, f.c], [edge(f), f.c]];
            } else {
              const xa = near.m * 0.6 + edge(f) * 0.4;
              pts = [[startM, E.c], [xa, E.c], [xa, f.c], [edge(f), f.c]];
            }
            routes.push({ el: (f as any).el, pts });
          });
        });
      });

      /* ── Draw the SVG paths ───────────────────────────────────────── */
      const mk = (d: string, attrs: Record<string, string>) => {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('fill', 'none');
        Object.entries(attrs).forEach(([k, v]) => p.setAttribute(k, v));
        svg.appendChild(p);
        return p;
      };

      const rows = routes.map((r) => {
        const d = r.pts.map(([m, c], i) => (i ? 'L' : 'M') + P(m, c).join(' ')).join(' ');
        const wire = mk(d, { stroke: '#3a3a3a', 'stroke-width': '1.2' });
        const zap = mk(d, { stroke: '#fff', 'stroke-width': '2.2', 'stroke-linecap': 'round' });
        zap.style.opacity = '0';
        zap.style.filter = 'drop-shadow(0 0 4px #9fd4ff) drop-shadow(0 0 9px #9fd4ff)';
        return { ...r, wire, zap, L: wire.getTotalLength() };
      });

      if (reduce) {
        root.dataset.ready = '1';
        return;
      }

      /* ── Emblem: fade in + breathing glow ─────────────────────────── */
      anims.push(
        emb.animate([{ opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }], {
          duration: 900, fill: 'both', easing: 'ease',
        }),
        emb.animate(
          [
            { filter: 'drop-shadow(0 0 14px rgba(255,255,255,.10))' },
            { filter: 'drop-shadow(0 0 34px rgba(255,255,255,.35))' },
            { filter: 'drop-shadow(0 0 14px rgba(255,255,255,.10))' },
          ],
          { duration: 3200, delay: START, iterations: Infinity, easing: 'ease-in-out' },
        ),
      );

      /* ── Lines draw out, tiles pop in ─────────────────────────────── */
      let built = 0;
      rows.forEach((r) => {
        const dur = r.L / DRAW_SPEED;
        r.wire.style.strokeDasharray = String(r.L);
        anims.push(
          r.wire.animate([{ strokeDashoffset: r.L }, { strokeDashoffset: 0 }], {
            duration: dur, delay: START, fill: 'both', easing: 'cubic-bezier(.4,0,.2,1)',
          }),
          r.el.animate(
            [{ opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 }],
            { duration: 450, delay: START + dur - 120, fill: 'both', easing: 'cubic-bezier(.2,1.4,.4,1)' },
          ),
        );
        built = Math.max(built, START + dur + 330);
      });

      /* ── Lightning (only after everything is built) ───────────────── */
      const off = 'drop-shadow(0 0 0 rgba(159,212,255,0))';
      const hit = 'drop-shadow(0 0 16px rgba(159,212,255,.85))';
      rows.forEach((r, i) => {
        const travel = r.L / ZAP_SPEED;
        const cyc = travel + ZAP_GAP;
        const f = travel / cyc;
        const fa = (f * r.L) / (r.L + ZAP_LEN);
        const delay = built + i * 380;

        r.zap.style.strokeDasharray = `${ZAP_LEN} ${r.L * 2}`;
        anims.push(
          r.zap.animate(
            [
              { strokeDashoffset: ZAP_LEN, opacity: 1, offset: 0, easing: 'cubic-bezier(.37,0,.63,1)' },
              { strokeDashoffset: -r.L, opacity: 1, offset: f },
              { strokeDashoffset: -r.L, opacity: 0, offset: Math.min(f + 0.001, 1) },
              { strokeDashoffset: -r.L, opacity: 0, offset: 1 },
            ],
            { duration: cyc, delay, iterations: Infinity, fill: 'backwards' },
          ),
          r.el.animate(
            [
              { filter: off, offset: 0 },
              { filter: off, offset: Math.max(fa - 0.01, 0) },
              { filter: hit, offset: fa },
              { filter: off, offset: Math.min(fa + 0.12, 1) },
              { filter: off, offset: 1 },
            ],
            { duration: cyc, delay, iterations: Infinity },
          ),
        );
      });

      root.dataset.ready = '1';
    };

    // start once when the section scrolls into view; rebuild on resize
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          build();
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    const ro = new ResizeObserver(() => started && build());
    ro.observe(root);

    return () => {
      io.disconnect();
      ro.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, [ref]);
}

function Network({
  className = '',
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useNetwork(ref);
  return (
    <div ref={ref} className={`tg-net relative ${className}`} style={style}>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      />
      {children}
    </div>
  );
}

export default function ToolsGrid({ items }: { items: ToolItem[] }) {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="relative w-full overflow-hidden rounded-[16px] bg-[var(--color-bg)]"
    >
      <style>{css}</style>

      {/* ── Desktop backdrop ───────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="tools-grid-desktop" />
      </div>

      {/* ── Mobile / tablet backdrop ───────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="tools-grid tools-grid-top" />
        <div className="tools-grid tools-grid-bottom" />
        <div className="tools-fade tools-fade-top" />
        <div className="tools-fade tools-fade-mid" />
        <div className="tools-fade tools-fade-bottom" />
      </div>

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: 'var(--container-max)',
          paddingInline: 'var(--gutter)',
        }}
      >
        {/* Eyebrow */}
        <span className="tools-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
          What I Work With
        </span>

        {/* Heading */}
        <h2
          id="tools-heading"
          className="tools-heading m-0 font-display text-center font-medium text-[var(--color-text)]"
        >
          Tools
        </h2>

        {/* Subtitle — desktop */}
        <p className="tools-copy m-0 hidden text-center lg:block">
          <GradientText className="font-semibold capitalize">
            From Research to wireframes to developer handoff
          </GradientText>
          <br />
          <span className="font-semibold capitalize text-[#b0b0b0] opacity-30">
            the tools behind every project.
          </span>
        </p>

        {/* Subtitle — mobile */}
        <p className="tools-copy tools-copy-mobile m-0 text-center lg:hidden">
          <GradientText className="tools-mobile-line font-semibold capitalize">
            From Research to wireframes
          </GradientText>
          <span className="tools-mobile-line font-semibold capitalize text-[#b0b0b0] opacity-25">
            to developer handoff the tools
          </span>
          <span className="tools-mobile-line font-semibold capitalize text-[#b0b0b0] opacity-25">
            behind every project.
          </span>
        </p>

        {/* ── Constellation (desktop) ───────────────────────────────────── */}
        <Network
          className="mt-[calc(60*var(--fig))] hidden lg:block"
          style={{
            width: 'calc(1416 * var(--fig))',
            height: 'calc(485 * var(--fig))',
          }}
        >
          <ToolEmblem
            unit="--fig"
            style={{
              left: 'calc(586 * var(--fig))',
              top: 'calc(106 * var(--fig))',
            }}
          />
          <ul className="m-0 list-none p-0">
            {items.map((tool) => (
              <ToolTile key={tool._id} tool={tool} />
            ))}
          </ul>
        </Network>

        {/* ── Constellation (phone + tablet) ────────────────────────────── */}
        <Network className="tools-network-mobile lg:hidden">
          <ToolEmblem
            unit="--tools-u"
            scale={0.7109276}
            className="tools-hub-mobile"
          />
          <ul className="m-0 list-none p-0">
            {items.map((tool) => (
              <ToolTile key={tool._id} tool={tool} variant="mobile" />
            ))}
          </ul>
        </Network>
      </div>
    </section>
  );
}