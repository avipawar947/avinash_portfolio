import Image from "next/image";
import type { ProjectItem } from "@/types/content";
import { heroImage, heroTitle, metaItems, subtitleLines, websiteUrl, wireframeLink } from "./helpers";

/**
 * Case-study hero — Figma 857:30934 (Hero, 1920x1124) + 857:30971
 * (Main Frame, 1135x972).
 *
 * The background is a fixed 1124px-tall frame (the Figma hero), but the
 * content is a normal flow column: every gap between the eyebrow, title,
 * subtitle, media frame, meta and buttons is the exact Figma gap. Because
 * the image/meta/buttons come after the text in flow, they shift down when
 * the copy runs to more lines — the gap itself never changes, on desktop,
 * tablet or mobile.
 *
 * Background reproduces the homepage hero glow exactly: the same linear +
 * radial "grey-gradient-abstract" over a white base (desktop) or the
 * 954x954 mobile abstract over #0b0b0b, plus hero-grid.svg.
 * Mobile is the 393x880 frame (1181:476) with the same layer order.
 */
export default function CaseStudyHero({ project }: { project: ProjectItem }) {
  const title = heroTitle(project);
  const subtitle = subtitleLines(project);
  const heroImg = heroImage(project);
  const cs: any = project.caseStudy ?? {};
  const site = websiteUrl(project);
  const wire = wireframeLink(project);
  const meta = metaItems(project);
  const hasButtons = (site && site !== "#") || (wire && wire !== "#");

  return (
    <section className="cs-hero" aria-label={title}>
      <div className="cs-hero-bg" aria-hidden>
        <div className="cs-hero-ground pointer-events-none absolute inset-0" />
        <div className="cs-hero-grid pointer-events-none absolute inset-0" />
        <div className="cs-hero-fade pointer-events-none absolute inset-x-0" />
      </div>

      <div className="cs-hero-flow">
        <span className="cs-eyebrow cs-hero-eyebrow inline-flex items-center justify-center font-semibold">
          {cs.heroEyebrow?.trim() || "Case Study"}
        </span>

        <h1 className="cs-hero-title m-0 font-medium">{title}</h1>

        <p className="cs-hero-subtitle m-0 font-semibold">
          {/* Desktop keeps the exact Figma line breaks; below 1024px the copy
              flows as one paragraph so it wraps naturally at the 393 frame. */}
          <span className="cs-hero-subtitle-stack">
            {subtitle.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </span>
          <span className="cs-hero-subtitle-flow">{subtitle.join(" ")}</span>
        </p>

        <div className="cs-main-frame">
          <div className="cs-main-media relative block h-full w-full overflow-hidden">
            {heroImg ? (
              <Image
                src={heroImg}
                alt={title}
                fill
                sizes="(max-width: 1023px) calc(100vw - 40px), 60vw"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 block bg-[#141414]" aria-hidden />
            )}
          </div>
        </div>

        {meta.length > 0 && (
          <dl className="cs-meta m-0">
            {meta.map((m) => (
              <div key={m.label} className="cs-meta-cell">
                <dt className="cs-meta-label m-0 font-bold">{m.label}</dt>
                <dd className="cs-meta-value m-0">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {hasButtons && (
          <div className="cs-hero-actions">
            {site && site !== "#" && (
              <a
                href={site}
                target="_blank"
                rel="noreferrer"
                className="cs-btn-white inline-flex items-center justify-center font-medium"
              >
                Visit Website
              </a>
            )}
            {wire && wire !== "#" && (
              <a
                href={wire}
                target="_blank"
                rel="noreferrer"
                className="cs-btn-ghost inline-flex items-center justify-center font-normal"
              >
                Visit Wireframe
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
