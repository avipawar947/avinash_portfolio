import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Tags the container is allowed to render as.
 *
 * Deliberately a narrow union of intrinsic elements rather than
 * `ElementType`: the latter includes arbitrary component types, so TS
 * intersects their props and collapses `className`/`style` to `never`.
 */
type ContainerTag =
  | "div"
  | "section"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "article";

/**
 * The single owner of the page's horizontal gutter.
 *
 * Sections must not add their own side padding — that is how the
 * gutter drifts between sections and how mobile ends up with content
 * touching the screen edge. Anything that needs to break out of the
 * container (a full-bleed image, a horizontal scroller) sits outside it.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ContainerTag;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn("mx-auto w-full", className)}
      style={{
        maxWidth: "var(--container-max)",
        paddingInline: "var(--gutter)",
      }}
    >
      {children}
    </Tag>
  );
}
