import { cn } from "@/lib/utils";

/**
 * The left-to-right fading text treatment used for the case-study
 * subtitle (1:147) and every project title (1:149, 1:152, 1:155, 1:158).
 *
 * Figma: linear-gradient to right, #FFFFFF at 11.735% →
 * rgba(176,176,176,0.1) at 119.96%, clipped to the glyphs.
 *
 * `background-clip: text` leaves the text transparent, so a UA that
 * cannot paint it would render nothing. The fallback colour below keeps
 * the copy legible in that case; browsers that support the clip paint
 * over it.
 */
export function GradientText({
  as: Tag = "span",
  children,
  className,
  style,
}: {
  as?: "span" | "p" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      className={cn("bg-clip-text text-[#e8e8e8]", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, #ffffff 11.735%, rgba(176,176,176,0.1) 119.96%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
