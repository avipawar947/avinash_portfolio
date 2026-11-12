"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import clsx from "clsx";

/**
 * Case-study section nav.
 *
 * Desktop — Figma "Cards / Left Side" (252x920, #1C1C1C, 1px
 * rgba(208,208,208,0.10)): logo row at (34,40), divider at y112, list at
 * (41,152) with a 44px pitch, active row bold + white gradient + 6px dot.
 *
 * Mobile — "Case Study Navbar" (351x132, #1C1C1C): logo row at y20 and a
 * scrollable row of 40px pill tabs at y72 (active = 0.5px white border,
 * inactive = 1px rgba(255,255,255,0.10)).
 */
export default function CaseStudyNav({
  logoUrl,
  projectTitle,
  items,
  active,
  onSelect,
}: {
  logoUrl?: string;
  projectTitle: string;
  items?: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const tabsRef = useRef<HTMLDivElement | null>(null);

  // Keep the active pill visible in the horizontal mobile scroller.
  useEffect(() => {
    const wrap = tabsRef.current;
    if (!wrap) return;
    const el = wrap.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!el) return;
    const left = el.offsetLeft - (wrap.clientWidth - el.clientWidth) / 2;
    wrap.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const handle = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    onSelect(id);
  };

  return (
    <>
      {/* Mobile bar: logo + pill tabs */}
      <div className="cs-mobilenav">
        <div className="cs-mobilenav-brand">
          {logoUrl ? (
            <span className="cs-mobilenav-logo relative block shrink-0 overflow-hidden">
              <Image src={logoUrl} alt="" fill sizes="40px" className="object-contain" />
            </span>
          ) : (
            <span className="cs-mobilenav-logo block shrink-0 bg-[#2c2c2c]" aria-hidden />
          )}
          <span className="cs-mobilenav-title font-bold" aria-label={projectTitle}>
            {projectTitle}
          </span>
        </div>
        <div ref={tabsRef} role="tablist" aria-label="Case study sections" className="cs-tabs">
          {(items ?? []).map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                role="tab"
                aria-selected={isActive}
                data-tab={item.id}
                data-active={isActive ? "true" : undefined}
                onClick={(e) => handle(e, item.id)}
                className="cs-tab inline-flex items-center justify-center"
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Desktop column */}
      <nav aria-label="Case study sections" className="cs-sidenav">
        <div className="cs-sidenav-brand">
          {logoUrl ? (
            <span className="cs-sidenav-logo relative block shrink-0 overflow-hidden">
              <Image src={logoUrl} alt="" fill sizes="40px" className="object-contain" />
            </span>
          ) : (
            <span className="cs-sidenav-logo block shrink-0 bg-[#2c2c2c]" aria-hidden />
          )}
          <span className="cs-sidenav-title font-bold">{projectTitle}</span>
        </div>
        <div className="cs-sidenav-divider" aria-hidden />
        <ul className="cs-sidenav-list m-0 list-none p-0">
          {(items ?? []).map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => handle(e, item.id)}
                  className={clsx("cs-navlink block", isActive ? "cs-navlink--active font-bold" : "font-normal")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
