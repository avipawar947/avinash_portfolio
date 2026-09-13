# Avinash Pawar — Portfolio

A high-fidelity Next.js implementation of a Figma design.
**Figma is the single source of truth** — see `AGENTS.md` for the section
map, node ids and the conventions that keep it that way.

## Before this goes live

Four values are **not in the Figma file** and have to be supplied. They
live in one place, `lib/constants/site.ts`, under `FILL THESE IN`:

| Value | Used by | Until it is set |
| --- | --- | --- |
| `url` | metadata, Open Graph, `sitemap.xml`, `robots.txt` | falls back to `https://example.com` |
| `linkedIn` | navbar, mobile menu, footer | the mark renders but is inert |
| `email` | footer | omitted |
| `resumeHref` | navbar, mobile menu, footer | the button renders but is inert |

Nothing is guessed: an empty value is treated as *not configured* and the
link is omitted or made non-interactive rather than pointing somewhere
wrong. Drop the CV into `public/` and set `resumeHref` to its path.

The design's **footer frame is empty** and it contains **no contact
section**, so `components/Footer` is assembled from elements the design
does have — the monogram, the wordmark, the nav links, the LinkedIn mark
and the resume CTA. If you want a real contact section, it needs to be
designed first.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| UI motion | Framer Motion |
| Scroll choreography | GSAP + ScrollTrigger |
| 3D / WebGL | Three.js, React Three Fiber, Drei |
| Smooth scroll | Lenis |

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Verification tooling (needs Chrome; none of it ships):

```bash
node scripts/audit.mjs            # six viewports: overflow, console, a11y basics
node scripts/shot.mjs --help      # deterministic screenshots for Figma comparison
node scripts/optimize-images.mjs  # re-encode + downscale assets (--dry to preview)
node scripts/pngprobe.mjs <file>  # alpha and mark bounding boxes
```

## Structure

```
app/          routes, layout, global tokens, sitemap + robots
components/   one folder per section, plus ui/ primitives and providers/
lib/
  animations/ gsap registration, easing + duration tokens
  constants/  site config, section ids, all Figma-derived content
  hooks/      reduced-motion, touch-device, media-query
  utils/      cn, math helpers
  webgl/      shared canvas wrapper and GLSL chunks
public/       images, icons, svg, backgrounds, fonts
scripts/      verification and asset tooling
```

## Notes

- Measurements are written as `calc(N * var(--fig))`, where `--fig` is one
  Figma pixel — so every number is checkable against the Figma inspector.
  `AGENTS.md` explains the floors that keeps readable on phones.
- Lenis is driven from the GSAP ticker with `lagSmoothing(0)`, so scroll
  position and animation frames cannot drift apart.
- Smooth scroll, the custom cursor, every entrance and every looping
  animation disable themselves under `prefers-reduced-motion`.
- `body` sets `overflow-x: hidden` as a structural guarantee; the audit
  verifies no element actually relies on it.
- Assets are WebP, downscaled to 2x their largest rendered size
  (`public/` is ~1.3 MB). Re-run `optimize-images.mjs` after adding any.
