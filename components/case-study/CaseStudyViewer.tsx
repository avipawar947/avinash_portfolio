"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { ProjectItem } from "@/types/content";
import CaseStudyNav from "./CaseStudyNav";
import { PanelContent, buildPanels } from "./CaseStudySections";
import { navItems } from "./helpers";

/**
 * The 1920x1570 case-study stage (Figma 1116:2848):
 *   Cards 1591x922 at (164, 452) = 252 nav + 1337 panel
 *   ArtBoard 1281x864 inset 28px inside the panel
 * The 11 slides are stacked in the ArtBoard and crossfade; the nav switches
 * the active one and the URL hash mirrors it (deep-linkable, no scrolling).
 */
export default function CaseStudyViewer({
  project,
  logoUrl,
  projectTitle,
}: {
  project: ProjectItem;
  logoUrl?: string;
  projectTitle: string;
}) {
  const panels = useMemo(() => buildPanels(project), [project]);
  const items = useMemo(() => navItems(project), [project]);
  const [active, setActive] = useState<string>(panels[0]?.id ?? "overview");

  const select = useCallback((id: string) => {
    setActive(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  useEffect(() => {
    const read = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && panels.some((p) => p.id === id)) setActive(id);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [panels]);

  return (
    <section id="case-study" aria-label="Case study sections" className="cs-stage">
      <div className="cs-stage-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="cs-stage-fade cs-stage-fade--top pointer-events-none absolute inset-x-0" aria-hidden />
      <div className="cs-stage-fade cs-stage-fade--bottom pointer-events-none absolute inset-x-0" aria-hidden />

      <div className="cs-cards">
        <CaseStudyNav logoUrl={logoUrl} projectTitle={projectTitle} items={items} active={active} onSelect={select} />

        <div className="cs-panel-frame">
          <div className="cs-artboard">
            <div className="cs-artboard-dots pointer-events-none absolute inset-0" aria-hidden />
            {panels.map((panel) => (
              <div
                key={panel.id}
                className={clsx("cs-panel", active === panel.id && "is-active")}
                aria-hidden={active !== panel.id}
              >
                <PanelContent panel={panel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
