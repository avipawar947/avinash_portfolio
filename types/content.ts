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

export interface ProjectItem {
  _id: string;
  title: string;
  tag: string;
  imageUrl: string;
  imagePublicId?: string;
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
  order: number;
}

export interface SocialLink {
  platform: 'linkedin' | 'behance' | 'gmail' | 'twitter';
  url: string;
}

export interface FooterContent {
  copyrightText: string;
  roleTags: string[];
  location: string;
  socialLinks: SocialLink[];
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
  footer: FooterContent;
  settings: SettingsContent;
}
