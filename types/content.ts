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
  order: number;
}

export interface ProjectItem {
  _id: string;
  title: string;
  tag: string;
  imageUrl: string;
  imagePublicId?: string;
  link: string;
  order: number;
}

export interface ProcessStepItem {
  _id: string;
  phase: 'Discover' | 'Define' | 'Deliver';
  label: string;
  order: number;
}

export interface GalleryImageItem {
  _id: string;
  imageUrl: string;
  imagePublicId?: string;
  caption: string;
  order: number;
}

export interface StatItem {
  _id: string;
  label: string;
  value: string;
  suffix: string;
  order: number;
}

export interface JourneyLine {
  text: string;
  opacity: number;
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
  gallery: GalleryImageItem[];
  stats: StatItem[];
  journey: JourneyContent;
  lifeBehindText: LifeBehindTextItemContent[];
  tools: ToolItem[];
  footer: FooterContent;
  settings: SettingsContent;
}
