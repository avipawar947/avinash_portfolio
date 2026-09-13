import { clsx } from "clsx";

/** Floating "Hello" / "Open to Work" style badges in the Hero. */
export default function Pill({
  children,
  rotate = 0,
  dashed = false,
  className,
}: {
  children: React.ReactNode;
  rotate?: number;
  dashed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-pill bg-[#010101] px-4 py-2.5 text-label text-heading shadow-glow",
        dashed
          ? "border border-dashed border-white/10"
          : "border border-white/10",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}
