import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { SectionId } from "@/lib/constants";

/**
 * Semantic section wrapper. Owns the vertical rhythm (via
 * `--section-gap`) and the anchor id; horizontal insets stay with
 * `Container`.
 */
export function Section({
  id,
  className,
  children,
  labelledBy,
}: {
  id: SectionId;
  className?: string;
  children: ReactNode;
  /** id of the heading that names this section, for screen readers. */
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative w-full", className)}
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      {children}
    </section>
  );
}
