/**
 * Faint background grid lines used behind the Gallery section.
 * Purely decorative — sits absolutely inside a `relative` parent section.
 *
 * Desktop (`≥ lg`) divides the section into `cols` × `rows` cells, which is
 * how the 1920 design is laid out. Below `lg` the section is taller and much
 * narrower, so that same division would squash the cells into slivers; the
 * mobile frame instead uses a fixed ~100px square cell (25.45vw at 393px),
 * which is the grid the design shows on small screens.
 */
export default function GridOverlay({ rows = 5, cols = 9 }: { rows?: number; cols?: number }) {
  const line = 'rgba(208,208,208,0.05)';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-100" aria-hidden>
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            `repeating-linear-gradient(90deg, ${line} 0px, ${line} 1px, transparent 1px, transparent calc(100% / ${cols})),` +
            `repeating-linear-gradient(0deg, ${line} 0px, ${line} 1px, transparent 1px, transparent calc(100% / ${rows}))`,
        }}
      />
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          backgroundImage:
            `repeating-linear-gradient(90deg, ${line} 0px, ${line} 1px, transparent 1px, transparent var(--grid-cell)),` +
            `repeating-linear-gradient(0deg, ${line} 0px, ${line} 1px, transparent 1px, transparent var(--grid-cell))`,
        }}
      />
    </div>
  );
}
