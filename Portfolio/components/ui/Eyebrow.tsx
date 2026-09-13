import { cn } from "@/lib/utils";

/**
 * The small labelled pill that heads every section — Figma nodes 1:161
 * "Recent Work", 1:181 "How I Work", 1:232 "Creative Showcase", 1:291
 * "Why Choose Me", 1:338 "What I Work With", 1:397 "About" and 1:411
 * "Beyond the Pixels".
 *
 * Geometry is identical across all seven: 41px tall, 10px padding inside
 * a 1px rgba(224,224,224,0.1) stroke, 8px radius, #0D0D0D fill, label at
 * 16px SF Pro Semibold.
 *
 * Presentational only — the heading that follows carries the section's
 * accessible name, so this is not itself a heading.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]",
        className,
      )}
      style={{
        padding: "calc(10 * var(--fig))",
        fontSize: "max(0.75rem, calc(16 * var(--fig)))",
      }}
    >
      {children}
    </span>
  );
}
