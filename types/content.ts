export interface HeroContent {
  name: string;
  taglineTop: string;
  taglineBottom: string;
  badgeText: string;
  statusText: string;
  statusActive: boolean;
  characterImageUrl: string;
  characterImagePublicId?: string;
}

export interface NavLink {
  label: string;
  href: string;
  order: number;
}

export interface NavbarContent {
  logoText: string;
  logoImageUrl: string;
  links: NavLink[];
  resumeUrl: string;
}

export interface ClientLogoItem {
  _id: string;
  name: string;
  logoUrl: string;
  logoPublicId?: string;
  /** Figma frame width at the shared 60px logo height. */
  width: number;
  /** 1:76 carries mix-blend-mode: luminosity in the design. */
  luminosity?: boolean;
  order: number;
}

export interface CaseStudySection {
  heading?: string;
  body?: string;
}

export interface JourneyStage {
  stage: string;
  does: string;
  screens: string;
  helps: string;
  order: number;
}

export interface ImpactStatItem {
  value: string;
  suffix: string;
  label: string;
  desc: string;
  order: number;
}

export interface CaseStudyGalleryItem {
  imageUrl: string;
  imagePublicId?: string;
  caption: string;
  order: number;
}

export interface CaseStudyBlock {
  type?: string;
  text?: string;
  url?: string;
  label?: string;
  posterUrl?: string;
  brand?: string;
  nodes?: { label: string; sub?: string; children?: { label: string }[] }[];
  columns?: string[];
  rows?: string[][];
  groups?: { title?: string; label?: string; nodes?: { label: string; sub?: string; tone?: string }[]; kind?: string; description?: string; samples?: { family?: string; weight?: number; text?: string; size?: number }[]; colors?: { hex: string; label?: string }[]; components?: { label: string; items?: string[] }[] }[];
  items?: { value?: string; suffix?: string; group?: string; label?: string }[];
  [k: string]: unknown;
}

export interface CaseStudySectionRich {
  key?: string;
  label?: string;
  title?: string;
  intro?: string;
  visible?: boolean;
  order?: number;
  blocks?: CaseStudyBlock[];
}

export interface ProjectCaseStudy {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  tagline?: string[];
  logoUrl?: string;
  logoPublicId?: string;
  iconSvgUrl?: string;
  iconSvgPublicId?: string;
  sectionIcons?: { key: string; svgUrl?: string; svgPublicId?: string; label?: string; order?: number }[];
  coverImageUrl?: string;
  coverImagePublicId?: string;
  meta?: { label: string; value: string }[];
  sections?: CaseStudySectionRich[];
  heroBackgroundUrl?: string;
  heroBackgroundPublicId?: string;
  heroImageUrl?: string;
  heroImagePublicId?: string;
  websiteUrl?: string;
  wireframeUrl?: string;
  client?: string;
  type?: string;
  category?: string;
  duration?: string;
  role?: string;
  overview?: CaseStudySection;
  challenges?: CaseStudySection;
  solutions?: CaseStudySection;
  infoArch?: CaseStudySection & { imageUrl?: string; imagePublicId?: string; nodes?: { label?: string; sub?: string; children?: { label?: string }[] }[] };
  userJourney?: CaseStudySection & { rows?: JourneyStage[]; columns?: string[]; imageUrl?: string; imagePublicId?: string };
  userFlow?: CaseStudySection & {
    imageUrl?: string;
    imagePublicId?: string;
    nodes?: { title?: string; sub?: string }[];
    groups?: { title?: string; nodes?: { label?: string; sub?: string; tone?: string }[] }[];
    buttonLabel?: string;
  };
  designSystem?: CaseStudySection & {
    components?: string[];
    colors?: string[];
    iconsNote?: string;
    typographyNote?: string;
    colorsNote?: string;
    icons?: { label?: string; svgUrl?: string }[];
    fonts?: { family?: string; weight?: number; text?: string; size?: number }[];
  };
  wireframe?: CaseStudySection & { imageUrl?: string; imagePublicId?: string; link?: string };
  visual?: CaseStudySection & { imageUrl?: string; imagePublicId?: string; link?: string };
  impact?: { heading?: string; stats?: ImpactStatItem[] };
  conclusion?: CaseStudySection;
  gallery?: CaseStudyGalleryItem[];
}

export interface ProjectItem {
  _id: string;
  title: string;
  slug?: string;
  tag: string;
  imageUrl: string;
  imagePublicId?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  videoPublicId?: string;
  videoPosterUrl?: string;
  videoPosterPublicId?: string;
  caseStudy?: ProjectCaseStudy | null;
  /** Which side of the two-column stagger this card sits on. */
  column: 'left' | 'right';
  /** Vertical crop the design applies inside the 738x468 frame — Figma
   *  scales the fill taller than the frame and offsets it upward, so these
   *  are the same (height%, top%) values read from the file. */
  cropHeight: number;
  cropTop: number;
  /** 1:151 alone carries an extra black-to-grey wash over the image. */
  wash?: boolean;
  link: string;
  order: number;
}

export interface ProcessStepItem {
  _id: string;
  phase: 'Discover' | 'Define' | 'Deliver';
  label: string;
  /** Inside the desktop table: offset from its left edge, Figma px. */
  left: number;
  /** Offset from the table's top edge, Figma px. */
  top: number;
  width: number;
  /** Pill gradient white-stop percentage. */
  from: number;
  order: number;
}

export interface ProcessIntroContent {
  heading: string;
  /** Gradient-filled line. */
  lead: string;
  /** Flat muted lines. */
  rest: string[];
}

export interface GalleryImageItem {
  _id: string;
  imageUrl: string;
  imagePublicId?: string;
  caption: string;
  /** Figma left offset within the 1920 frame. */
  left: number;
  /** Figma top offset within the 1099-tall frame. */
  top: number;
  /** Tile height in Figma px (width is constant 287). */
  height: number;
  order: number;
}

export interface StatItem {
  _id: string;
  label: string;
  labelMuted?: string;
  value: string;
  suffix: string;
  column: 1 | 3;
  order: number;
}

export interface ProjectMixItem {
  label: string;
  width: number;
}

export interface WhyChooseMeContent {
  projectMix: ProjectMixItem[];
  domains: string[];
}

export interface JourneyLine {
  text: string;
  /** Layer opacity, 0-1. Absent/null on the first line marks the gradient fill treatment. */
  opacity?: number | null;
}

export interface JourneyContent {
  heading: string;
  lines: JourneyLine[];
}

export interface LifeBehindTextItemContent {
  _id: string;
  imageUrl: string;
  imagePublicId?: string;
  order: number;
}

export interface ToolItem {
  _id: string;
  name: string;
  iconKey: string;
  iconUrl: string;
  iconPublicId?: string;
  /** Offset of the 94px tile inside the 1416 x 485 constellation plot, Figma px. */
  left: number;
  /** Offset from the plot's top edge, Figma px. */
  top: number;
  /** The glyph box inside the 94x94 tile — most are 60x60 inset 17px. */
  iconSize: number;
  iconLeft: number;
  iconTop: number;
  order: number;
}

export interface SocialLink {
  platform: 'linkedin' | 'behance' | 'gmail' | 'twitter';
  url: string;
  /** Uploaded icon image shown in place of the built-in SVG glyph. */
  iconUrl?: string;
  iconPublicId?: string;
}

export interface FooterContent {
  copyrightText: string;
  roleTags: string[];
  location: string;
  socialLinks: SocialLink[];
}

export interface ContactCTATab {
  label: string;
  imageUrl: string;
  imagePublicId?: string;
}

export interface ContactCTAContent {
  tabs: ContactCTATab[];
  /** Case-study CTA action row — editable in admin. */
  phone?: string;
  email?: string;
  linkedinUrl?: string;
}

export interface SettingsContent {
  resumePdfUrl: string;
  resumePdfPublicId?: string;
  seoTitle: string;
  seoDescription: string;
}

/** Everything the homepage needs, fetched once on the server. */
export interface HomeContent {
  hero: HeroContent;
  navbar: NavbarContent;
  clientLogos: ClientLogoItem[];
  projects: ProjectItem[];
  process: ProcessStepItem[];
  processIntro: ProcessIntroContent;
  gallery: GalleryImageItem[];
  stats: StatItem[];
  whyChooseMe: WhyChooseMeContent;
  journey: JourneyContent;
  lifeBehindText: LifeBehindTextItemContent[];
  tools: ToolItem[];
  contactCTA: ContactCTAContent;
  footer: FooterContent;
  settings: SettingsContent;
}
