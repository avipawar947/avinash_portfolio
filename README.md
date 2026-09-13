# Avinash Pawar Portfolio — Next.js + Tailwind + MongoDB CMS

Full-stack Next.js app: public site, JSON API (backend), and a password-protected
admin CMS, all in this one repo. See `architecture-plan.md` (shared separately)
for the full reasoning; this README is just "how do I run it."

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in:
- `MONGODB_URI` — a MongoDB Atlas (free tier) connection string, or a local Mongo URI.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your CMS login.
- `JWT_SECRET` — any long random string (used to sign the admin session cookie).
- `CLOUDINARY_*` — from your free Cloudinary dashboard (needed for image/resume uploads via the admin panel; the site itself runs fine without them until you upload something).

## 3. (Optional) Seed the database

Populates MongoDB with the same placeholder content currently baked into the
app as a fallback, so you have real editable documents right away:

```bash
npm run seed
```

If you skip this, the site still renders using `lib/seed-data.ts` as an
in-memory fallback — nothing will be blank, but changes in `/admin` won't have
anything to "start from" until a document exists.

## 4. Run it

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin CMS: http://localhost:3000/admin/login

## Where things live

- `app/page.tsx` — assembles every homepage section in order, fetching content server-side via `lib/content.ts`.
- `components/sections/*` — one file per Figma section, purely presentational (props in, JSX out).
- `components/ui/*` — reusable primitives (Button, Pill, Card, GradientText, Marquee, Loader...).
- `components/motion/*` — animation presets + the `<AnimatedSection>` wrapper. Tell me how you want each section to animate and this is the only place that changes.
- `models/*` — one Mongoose schema per content type.
- `app/api/*` — CRUD routes backing every section (`GET` public, `POST`/`PUT`/`DELETE` require an admin session).
- `app/admin/(dashboard)/*` — the CMS forms. **Hero** and **Projects** are fully built and are the reference pattern (singleton vs. array sections); the rest are stubs with a comment pointing at that pattern — say the word and I'll finish them the same way.
- `lib/tokens.ts` + `tailwind.config.ts` — every color/font-size/gradient from your design system, defined once.

## What's still pending (by design, waiting on you)

1. **Real assets** — logos, project screenshots, gallery/life-behind-text photos, tool icons, device mockups. Drop them in and I'll wire the URLs (or upload flow) in.
2. **Loader animation details** — built to match `Loader.png`/`Loader_2.png` visually; tell me the exact color-cycle/motion you want and I'll tune `components/ui/Loader.tsx`.
3. **Per-section scroll animations** — sections currently use a sensible default (`fadeUp`/`scaleIn`); tell me per section and I'll set the right `variant`/timing.
4. **Remaining admin editors** (navbar, process, gallery, stats, journey, tools, footer, settings) — same pattern as Hero/Projects, not yet filled in.
5. **Cloudinary keys** — once added to `.env.local`, image/resume uploads in the admin panel work end-to-end.
