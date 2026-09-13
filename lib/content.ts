import { connectDB } from "./db";
import HeroModel from "@/models/Hero";
import NavbarModel from "@/models/Navbar";
import ClientLogoModel from "@/models/ClientLogo";
import ProjectModel from "@/models/Project";
import ProcessStepModel from "@/models/ProcessStep";
import GalleryImageModel from "@/models/GalleryImage";
import StatModel from "@/models/Stat";
import WhyChooseMeModel from "@/models/WhyChooseMe";
import JourneyModel from "@/models/Journey";
import LifeBehindTextItemModel from "@/models/LifeBehindTextItem";
import ToolModel from "@/models/Tool";
import FooterModel from "@/models/Footer";
import SettingsModel from "@/models/Settings";
import { seedContent } from "./seed-data";
import type { HomeContent } from "@/types/content";

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
      gallery,
      stats,
      whyChooseMe,
      journey,
      lifeBehindText,
      tools,
      footer,
      settings,
    ] = await Promise.all([
      HeroModel.findOne().lean(),
      NavbarModel.findOne().lean(),
      ClientLogoModel.find().sort("order").lean(),
      ProjectModel.find().sort("order").lean(),
      ProcessStepModel.find().sort("order").lean(),
      GalleryImageModel.find().sort("order").lean(),
      StatModel.find().sort("order").lean(),
      WhyChooseMeModel.findOne().lean(),
      JourneyModel.findOne().lean(),
      LifeBehindTextItemModel.find().sort("order").lean(),
      ToolModel.find().sort("order").lean(),
      FooterModel.findOne().lean(),
      SettingsModel.findOne().lean(),
    ]);

    return {
      hero: (hero as any) || seedContent.hero,
      navbar: (navbar as any) || seedContent.navbar,
      clientLogos: clientLogos?.length
        ? (clientLogos as any)
        : seedContent.clientLogos,
      projects: projects?.length ? (projects as any) : seedContent.projects,
      process: process?.length ? (process as any) : seedContent.process,
      gallery: gallery?.length ? (gallery as any) : seedContent.gallery,
      stats: stats?.length ? (stats as any) : seedContent.stats,
      whyChooseMe: (whyChooseMe as any) || seedContent.whyChooseMe,
      journey: (journey as any) || seedContent.journey,
      lifeBehindText: lifeBehindText?.length
        ? (lifeBehindText as any)
        : seedContent.lifeBehindText,
      tools: tools?.length ? (tools as any) : seedContent.tools,
      footer: (footer as any) || seedContent.footer,
      settings: (settings as any) || seedContent.settings,
    };
  } catch (err) {
    console.warn(
      "[content] Falling back to seed content —",
      (err as Error).message,
    );
    return seedContent;
  }
}
