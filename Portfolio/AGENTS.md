<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

# Portfolio — Avinash Pawar

Implementation of a Figma design. **Figma is the single source of truth.**
Do not invent design values. When Figma and an implementation instinct
conflict, Figma wins.

## The design

`https://www.figma.com/design/9xrwqBcDya9fKHm00hb9Tw/Port?node-id=1-2`

Frame `1:2` "Homepage", **1920 x 11835**. Readable over MCP.

> An earlier, different file (`VsMhESAmZkJUfXgnKhY81q`) could not be read —
> the account holds only a View seat on the Starter team that owns it.
> That file is not this project's design and is no longer relevant.

The file defines **no Figma variables**, so every token is read from raw
node fills, strokes, effects and text properties.

### Section map

| Node | Name | Status |
| --- | --- | --- |
| 1:34 | Navbar | built |
| 1:3 | Hero | built |
| 1:47 | Marquee (client logos) | built |
| 1:127 | Projects / Case Study | built |
| 1:273 | My Journey (stats) | built |
| 1:163 | Our Process | built |
| 1:214 | Gallery | built |
| 1:396 | About — My Journey copy | built |
| 1:337 | Tools | built |
| 1:410 | Life Behind the Text | built |
| 1:703 | Footer | built — **frame is empty in the design** |

## The `--fig` unit

The design is absolutely composed at 1920px wide. `--fig` in
`app/globals.css` converts one Figma pixel to a viewport-proportional
length, so measurements are written verbatim:

```css
left: calc(604 * var(--fig));
```

Every number stays directly auditable against the Figma inspector.

`--fig` tracks the viewport at **every** width, including mobile. It was
briefly frozen at `1px` below 1024px and that was a bug worth
remembering: since type sizes are written as `calc(N * var(--fig))`, a
frozen unit made section headings resolve to a literal 160px on a 390px
screen, where the body's `overflow-x: hidden` silently clipped them.

The consequences of the unit scaling everywhere:

- **Small type needs a floor.** 20 Figma px is ~4px on a phone, so body
  copy is written `max(<readable minimum>, calc(N * var(--fig)))`.
- **Vertical rhythm needs a floor**, via `--section-pad` and
  `--heading-gap` in `globals.css`.
- A component that positions absolutely with `--fig` **must** provide a
  separate narrow-screen composition (`Hero`, `Process`, `Tools`,
  `Gallery`); flow-based sections (`Projects`, `Journey`) reflow on
  their own.
- Only `--navbar-h` and `--gutter` are overridden below 1024px — the bar
  would otherwise shrink to 16px, and the gutter wants a fixed minimum.

## Known substitutions

- **SF Pro** is Apple-proprietary and cannot be embedded. `--font-display`
  resolves to the system SF on Apple platforms and falls back to Inter,
  which is metrically compatible and already used for body copy in the
  same design.
- The file carries **no prototype interactions**, so all motion (easings,
  durations, scroll reveals, hover states) is this project's own. Keep it
  restrained and inside the design's vocabulary.
- The design gives case studies **image + title only** — no descriptions,
  stacks, years or links. `Project` supports those fields; they are left
  unset rather than invented.
- There is **no mobile frame** in the file. Narrow-screen compositions are
  built from the design's own vocabulary, not scaled down from desktop.
- The **footer frame is empty** and there is **no contact section**, though
  the navbar links to one. `components/Footer` is assembled from elements
  the design does contain; a real contact section needs designing first.
- The design binds **no URLs** to the LinkedIn mark or the resume CTA, and
  carries no domain or email. Those live under `FILL THESE IN` in
  `lib/constants/site.ts`; an empty value means *not configured*, and the
  UI omits or disables the link rather than pointing somewhere wrong.
  Never substitute a plausible-looking guess.

## Conventions

- `Container` owns the horizontal gutter; sections never add side padding.
- Reuse `Eyebrow`, `GradientText`, `GridOverlay`, `Logo` — each maps to a
  repeated Figma pattern and is cited by node id in its own doc comment.
- Import GSAP from `@/lib/animations`, never from `gsap` directly — that
  module is the single plugin-registration point.
- All WebGL goes through `lib/webgl/WebGLCanvas.tsx`, which owns the DPR
  cap, antialias policy and the reduced-motion bail-out.
- `"use client"` only where interactivity requires it. The client boundary
  is `components/providers/AppProviders.tsx`.
- GSAP + ScrollTrigger for scroll choreography; Framer Motion for
  component-level interaction. **Never both on the same element** — each
  writes `transform` inline and they will fight. For the same reason, do
  not put a Tailwind `-translate-x-1/2` on an element either library
  animates; put the centring on a wrapper.
- Every animation must respect `prefers-reduced-motion`, including
  indefinitely repeating ones (floats, marquees).
- Use the exact Figma asset for every icon, image, logo and texture.
  Never emoji, never a stand-in from the internet.
- **Node exports are not always the right asset.** `download_assets` on a
  node gives what Figma renders — which is usually what you want
  (`Gallery`'s figure) but sometimes flattened onto white (`Logo`, which
  came back as an opaque white rectangle with the mark embossed at
  luminance 253) or empty when the node is clipped by its parent
  (`Life`'s last two cards, 149 bytes). Check the bytes before trusting
  an export; `scripts/pngprobe.mjs` reports alpha and mark bounding
  boxes.
- **Do not route two-tone marks through `next/image`.** The optimizer
  mangled the grayscale logo sheet; it is a CSS background instead.

## Verifying a section

`scripts/shot.mjs` drives Chrome over CDP and emulates
`prefers-reduced-motion: reduce`, which pins every animation to its final
state. Chrome's `--screenshot` flag starves rAF under
`--virtual-time-budget` and captures animations part-way through, so
captures taken that way do not reproduce.

```bash
node scripts/shot.mjs --url=http://localhost:3000 --out=x.png \
     --w=1920 --h=1148 [--clip=x,y,w,h] [--dsf=2]
```

Compare against `get_screenshot` on the same Figma node.

`scripts/audit.mjs` runs the whole page across six viewports and reports
horizontal overflow (naming the offending element), console errors, page
errors, failed requests, broken images and heading/alt-text basics. It
parks on `about:blank` between viewports — without that, each navigation
cancels the previous page's in-flight images and those aborts get
misattributed to the next viewport.

<!-- END:project-rules -->
