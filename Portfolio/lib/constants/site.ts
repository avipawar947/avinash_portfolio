/**
 * Site identity and contact details.
 *
 * `name` and `role` are read from the Figma design (nodes 1:26, 1:22).
 * Everything under FILL THESE IN is **not in the design** — the file
 * shows a LinkedIn icon and a "Download Resume" button but binds no URL
 * to either, and carries no domain, email or contact details anywhere.
 *
 * Each is an empty string rather than a plausible-looking guess. The UI
 * treats empty as "not configured" and simply omits that link, so an
 * unfinished value can never ship as a wrong one — a link to the wrong
 * LinkedIn profile is worse than no link at all.
 */

/** Read from Figma. */
export const SITE = {
  name: "Avinash Pawar",
  role: "Product Designer",
  description:
    "Product designer working across research, strategy and visual execution — turning questions into interfaces for startups, growing teams and large organisations.",
  locale: "en_US",
  ogImage: "/images/character.png",

  // ─────────────────── FILL THESE IN ───────────────────
  /** Deployment origin, e.g. "https://avinashpawar.com". Used by
   *  metadata, Open Graph, sitemap.xml and robots.txt. */
  url: "",
  /** Full LinkedIn profile URL. Shown in the navbar, mobile menu, footer. */
  linkedIn: "",
  /** Public email address. Shown in the footer when set. */
  email: "",
  /** Path to the CV in /public, e.g. "/avinash-pawar-cv.pdf". */
  resumeHref: "",
  // ─────────────────────────────────────────────────────
} as const;

/**
 * Origin used for absolute URLs at build time.
 *
 * `metadataBase`, `sitemap` and `robots` need a real origin, so this
 * falls back to a placeholder when `SITE.url` is unset. That keeps the
 * build working while leaving the value obviously unconfigured.
 */
export const SITE_ORIGIN = SITE.url || "https://example.com";

/** True when a FILL THESE IN value has been supplied. */
export const isConfigured = (value: string): boolean => value.trim().length > 0;
