import { connectDB } from "./db";
import HeroModel from "@/models/Hero";
import NavbarModel from "@/models/Navbar";
import ClientLogoModel from "@/models/ClientLogo";
import ProjectModel from "@/models/Project";
import ProcessStepModel from "@/models/ProcessStep";
import ProcessIntroModel from "@/models/ProcessIntro";
import GalleryImageModel from "@/models/GalleryImage";
import StatModel from "@/models/Stat";
import WhyChooseMeModel from "@/models/WhyChooseMe";
import JourneyModel from "@/models/Journey";
import LifeBehindTextItemModel from "@/models/LifeBehindTextItem";
import ToolModel from "@/models/Tool";
import ContactCTAModel from "@/models/ContactCTA";
import FooterModel from "@/models/Footer";
import SettingsModel from "@/models/Settings";
import { seedContent } from "./seed-data";
import { LINKEDIN_URL } from "./links";
import type { HomeContent, ProjectItem } from "@/types/content";

/** Replace stale/placeholder LinkedIn links with the canonical profile. */
function normalizeLinkedIn(value: unknown): string {
  const url = typeof value === "string" ? value : "";
  if (!url || url === "#" || url.toLowerCase().includes("avinashpawar")) {
    return LINKEDIN_URL;
  }
  return url;
}

/** The hero's first ghost word is now "UI/UX" (older CMS docs say "PRODUCT"). */
function normalizeTaglineTop(value: unknown): string {
  const word = typeof value === "string" ? value : "";
  return !word || word === "PRODUCT" ? "UI/UX" : word;
}

/**
 * Convert Mongoose lean documents into plain JSON-safe values before they are
 * passed from Server Components to Client Components. `.lean()` still returns
 * BSON `ObjectId` instances (which have a `toJSON` method) and `Date` objects;
 * React rejects those across the server/client boundary.
 */
function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Fetches every section's content for the homepage in one place.
 * If MongoDB isn't reachable yet (e.g. MONGODB_URI not set during
 * early setup) or a collection is still empty, falls back to seedContent
 * so the site never renders blank.
 */
export async function getHomeContent(): Promise<HomeContent> {
  try {
    await connectDB();

    const [
      hero,
      navbar,
      clientLogos,
      projects,
      process,
      processIntro,
      gallery,
      stats,
      whyChooseMe,
      journey,
      lifeBehindText,
      tools,
      contactCTA,
      footer,
      settings,
    ] = await Promise.all([
      HeroModel.findOne().lean(),
      NavbarModel.findOne().lean(),
      ClientLogoModel.find().sort("order").lean(),
      ProjectModel.find().sort({ order: 1, createdAt: 1, _id: 1 }).lean(),
      ProcessStepModel.find().sort("order").lean(),
      ProcessIntroModel.findOne().lean(),
      GalleryImageModel.find().sort("order").lean(),
      StatModel.find().sort("order").lean(),
      WhyChooseMeModel.findOne().lean(),
      JourneyModel.findOne().lean(),
      LifeBehindTextItemModel.find().sort("order").lean(),
      ToolModel.find().sort("order").lean(),
      ContactCTAModel.findOne().lean(),
      FooterModel.findOne().lean(),
      SettingsModel.findOne().lean(),
    ]);

    return toPlain({
      hero: hero
        ? {
            ...(hero as any),
            taglineTop: normalizeTaglineTop((hero as any).taglineTop),
          }
        : seedContent.hero,
      navbar: (navbar as any) || seedContent.navbar,
      clientLogos: clientLogos?.length
        ? (clientLogos as any)
        : seedContent.clientLogos,
      projects: projects?.length ? (projects as any) : seedContent.projects,
      process: process?.length ? (process as any) : seedContent.process,
      processIntro: (processIntro as any) || seedContent.processIntro,
      gallery: gallery?.length ? (gallery as any) : seedContent.gallery,
      stats: stats?.length ? (stats as any) : seedContent.stats,
      whyChooseMe: (whyChooseMe as any) || seedContent.whyChooseMe,
      journey: (journey as any) || seedContent.journey,
      lifeBehindText: lifeBehindText?.length
        ? (lifeBehindText as any)
        : seedContent.lifeBehindText,
      tools: tools?.length ? (tools as any) : seedContent.tools,
      // Merge so existing documents without the new contact fields still get
      // the seeded phone/email/LinkedIn defaults.
      contactCTA: contactCTA
        ? {
            ...seedContent.contactCTA,
            ...(contactCTA as any),
            linkedinUrl: normalizeLinkedIn((contactCTA as any).linkedinUrl),
          }
        : seedContent.contactCTA,
      footer: footer
        ? {
            ...(footer as any),
            socialLinks: ((footer as any).socialLinks || []).map(
              (link: any) =>
                link.platform === "linkedin"
                  ? { ...link, url: normalizeLinkedIn(link.url) }
                  : link
            ),
          }
        : seedContent.footer,
      settings: (settings as any) || seedContent.settings,
    });
  } catch (err) {
    console.warn(
      "[content] Falling back to seed content —",
      (err as Error).message,
    );
    return toPlain(seedContent);
  }
}

export interface CaseStudyData {
  project: ProjectItem;
  related: ProjectItem[];
  navbar: HomeContent["navbar"];
  contactCTA: HomeContent["contactCTA"];
  footer: HomeContent["footer"];
  settings: HomeContent["settings"];
}

/**
 * One case-study detail page (/case-study/[slug]).
 * Falls back to seed projects (matched by slug, or by _id for old links)
 * so the page never blanks before Mongo is seeded.
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyData | null> {
  const home = await getHomeContent();
  // Normalize: allow passing raw _id (old links) as well as slug.
  try {
    await connectDB();
    const bySlug = await ProjectModel.findOne({ slug }).lean();
    const project = bySlug
      ? (bySlug as any)
      : await ProjectModel.findById(slug).lean().catch(() => null);
    if (!project) {
      const seedHit = seedContent.projects.find((p: any) => p.slug === slug || p._id === slug);
      if (!seedHit) return null;
      return toPlain({
        project: seedHit as any,
        related: seedContent.projects.filter((p: any) => p._id !== (seedHit as any)._id) as any,
        navbar: home.navbar,
        contactCTA: home.contactCTA,
        footer: home.footer,
        settings: home.settings,
      });
    }
    const related = await ProjectModel.find({ _id: { $ne: project._id }, slug: { $ne: "" } })
      .sort({ order: 1, createdAt: 1, _id: 1 })
      .lean();
    return toPlain({
      project: project as any,
      related: (related?.length ? (related as any) : home.projects.filter((p: any) => p._id !== project._id)) ?? [],
      navbar: home.navbar,
      contactCTA: home.contactCTA,
      footer: home.footer,
      settings: home.settings,
    });
  } catch (err) {
    console.warn("[content] Case study fallback —", (err as Error).message);
    const seedHit = seedContent.projects.find((p: any) => p.slug === slug || p._id === slug);
    if (!seedHit) return null;
    return toPlain({
      project: seedHit as any,
      related: seedContent.projects.filter((p: any) => p._id !== (seedHit as any)._id) as any,
      navbar: home.navbar,
      contactCTA: home.contactCTA,
      footer: home.footer,
      settings: home.settings,
    });
  }
}
