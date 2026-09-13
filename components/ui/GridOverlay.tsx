/**
 * Faint background grid lines used behind Hero / Projects / Our Work / Gallery etc.
 * Purely decorative — sits absolutely inside a `relative` parent section.
 */
export default function GridOverlay({ rows = 5, cols = 9 }: { rows?: number; cols?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-100" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `repeating-linear-gradient(90deg, rgba(208,208,208,0.05) 0px, rgba(208,208,208,0.05) 1px, transparent 1px, transparent calc(100% / ${cols})),` +
            `repeating-linear-gradient(0deg, rgba(208,208,208,0.05) 0px, rgba(208,208,208,0.05) 1px, transparent 1px, transparent calc(100% / ${rows}))`,
        }}
      />
    </div>
  );
}
