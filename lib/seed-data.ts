import type { HomeContent } from '@/types/content';

/**
 * Fallback content shown when a collection is empty (e.g. fresh DB, or DB
 * unreachable in local dev before MONGODB_URI is set). Everything here is
 * exactly what gets edited from /admin once the CMS is wired to real data —
 * this is just so `npm run dev` shows a real-looking page on first run.
 */
export const seedContent: HomeContent = {
  navbar: {
    logoText: 'AVINASH PAWAR',
    logoImageUrl: '/brand/ap-logo.png',
    links: [
      { label: 'Home', href: '/', order: 0 },
      { label: 'Work', href: '#work', order: 1 },
      { label: 'About', href: '#about', order: 2 },
      { label: 'Contact', href: '#contact', order: 3 },
    ],
    resumeUrl: '#',
  },
  hero: {
    name: 'Avinash Pawar',
    taglineTop: 'PRODUCT',
    taglineBottom: 'DESIGNER',
    badgeText: 'Hello, My Name Is',
    statusText: 'Open to Work',
    statusActive: true,
    characterImageUrl: '',
  },
  clientLogos: [
    { _id: 'c1', name: 'Fabled', logoUrl: '', width: 136, order: 0 },
    { _id: 'c2', name: 'Tata', logoUrl: '', width: 65, order: 1 },
    { _id: 'c3', name: 'MET', logoUrl: '', width: 142, order: 2 },
    { _id: 'c4', name: 'HRX', logoUrl: '', width: 126, luminosity: true, order: 3 },
    { _id: 'c5', name: 'Zango', logoUrl: '', width: 156, order: 4 },
    { _id: 'c6', name: 'Awfis', logoUrl: '', width: 176, order: 5 },
  ],
  projects: [
    { _id: 'p1', title: 'HRX', tag: 'Case Study', imageUrl: '', column: 'left', cropHeight: 118.12, cropTop: -8.95, wash: true, link: '#', order: 0 },
    { _id: 'p2', title: 'NSL Luxe', tag: 'Case Study', imageUrl: '', column: 'right', cropHeight: 105.67, cropTop: -2.73, link: '#', order: 1 },
    { _id: 'p3', title: 'Synclature', tag: 'Case Study', imageUrl: '', column: 'left', cropHeight: 104.59, cropTop: -2.19, link: '#', order: 2 },
    { _id: 'p4', title: 'Synclature', tag: 'Case Study', imageUrl: '', column: 'right', cropHeight: 105.18, cropTop: -2.48, link: '#', order: 3 },
  ],
  process: [
    { _id: 'd1', phase: 'Discover', label: 'Stakeholder interviews & briefing', left: 295, top: 29, width: 360, from: 55.234, order: 0 },
    { _id: 'd2', phase: 'Discover', label: 'User & market research', left: 335, top: 87, width: 420, from: 36.104, order: 1 },
    { _id: 'd3', phase: 'Discover', label: 'UX Audit Of The Existing Product', left: 375, top: 145, width: 480, from: 61.249, order: 2 },
    { _id: 'f1', phase: 'Define', label: 'Defining Concept and Strategy', left: 515, top: 247, width: 540, from: 57.643, order: 0 },
    { _id: 'f2', phase: 'Define', label: 'Information Architecture', left: 555, top: 305, width: 600, from: 48.838, order: 1 },
    { _id: 'f3', phase: 'Define', label: 'User Journeys & Flows', left: 595, top: 363, width: 660, from: 61.249, order: 2 },
    { _id: 'v1', phase: 'Deliver', label: 'Visual Experience Design, Wireframing & Design Systems', left: 735, top: 465, width: 660, from: 11.735, order: 0 },
    { _id: 'v2', phase: 'Deliver', label: 'Usability Testing, Feedback & Iteration', left: 775, top: 523, width: 720, from: 47.09, order: 1 },
    { _id: 'v3', phase: 'Deliver', label: 'Handoff & Developer QA', left: 875, top: 581, width: 720, from: 47.09, order: 2 },
  ],
  processIntro: {
    heading: 'A Thoughtful Process.',
    lead: 'We combine research, strategic thinking, and visual',
    rest: [
      'execution into a streamlined workflow that keeps',
      'every decision aligned with business goals.',
    ],
  },
  gallery: [
    { _id: 'g0', imageUrl: '', caption: '', left: -231, top: 408, height: 341, order: 0 },
    { _id: 'g1', imageUrl: '', caption: '', left: 68, top: 437, height: 284, order: 1 },
    { _id: 'g2', imageUrl: '', caption: '', left: 367, top: 459, height: 240, order: 2 },
    { _id: 'g3', imageUrl: '', caption: '', left: 666, top: 475, height: 208, order: 3 },
    { _id: 'g4', imageUrl: '', caption: '', left: 965, top: 475, height: 208, order: 4 },
    { _id: 'g5', imageUrl: '', caption: '', left: 1264, top: 459, height: 240, order: 5 },
    { _id: 'g6', imageUrl: '', caption: '', left: 1563, top: 437, height: 284, order: 6 },
    { _id: 'g7', imageUrl: '', caption: '', left: 1862, top: 408, height: 341, order: 7 },
  ],
  stats: [
    { _id: 's1', label: 'Years of Experience', value: '04', suffix: '+', column: 1, order: 0 },
    { _id: 's2', label: 'Clients Satisfaction', value: '90', suffix: '%', column: 1, order: 1 },
    { _id: 's3', label: 'Consistent on all screens', value: '95', suffix: '%', column: 3, order: 2 },
    { _id: 's4', label: 'Successful projects delivered', labelMuted: 'digital products.', value: '80', suffix: '+', column: 3, order: 3 },
  ],
  whyChooseMe: {
    projectMix: [
      { label: 'Mobile App', width: 138 },
      { label: 'Web App', width: 299 },
      { label: 'Websites', width: 370 },
      { label: 'landing Pages', width: 244 },
    ],
    domains: ['FinTech', 'Insurance', 'Healthcare', 'E-Com'],
  },
  journey: {
    heading: 'My Journey',
    lines: [
      { text: 'The journey started with a strong foundation in technology through BCA and MCA,' },
      { text: 'where I learned to think logically and solve problems. I became more curious about', opacity: 0.25 },
      { text: 'how they think, what they need, and why something that looks simple can still feel', opacity: 0.2 },
      { text: 'difficult to use. That curiosity led me into UI/UX, where problem-solving', opacity: 0.2 },
      { text: 'and creativity started to come together. Over the years, I\u2019ve worked across startups,', opacity: 0.1 },
      { text: 'growing teams, and larger organizations, learning something new at every stage.', opacity: 0.1 },
      { text: 'From early client projects to leading design teams and building complex digital products.', opacity: 0.1 },
      { text: 'every experience has shaped the way. And this journey is still evolving \u2014 one problem, one', opacity: 0.05 },
      { text: 'idea, and one meaningful experience at a time.', opacity: 0.05 },
    ],
  },
  lifeBehindText: Array.from({ length: 5 }).map((_, i) => ({
    _id: `l${i}`,
    imageUrl: '',
    order: i,
  })),
  tools: [
    { _id: 't1', name: 'Photoshop', iconKey: 'photoshop', iconUrl: '', order: 0 },
    { _id: 't2', name: 'Illustrator', iconKey: 'illustrator', iconUrl: '', order: 1 },
    { _id: 't3', name: 'XD', iconKey: 'xd', iconUrl: '', order: 2 },
    { _id: 't4', name: 'Figma', iconKey: 'figma', iconUrl: '', order: 3 },
    { _id: 't5', name: 'Notion', iconKey: 'notion', iconUrl: '', order: 4 },
    { _id: 't6', name: 'Slack', iconKey: 'slack', iconUrl: '', order: 5 },
    { _id: 't7', name: 'Claude', iconKey: 'claude', iconUrl: '', order: 6 },
    { _id: 't8', name: 'OpenAI', iconKey: 'openai', iconUrl: '', order: 7 },
    { _id: 't9', name: 'Magnific', iconKey: 'magnific', iconUrl: '', order: 8 },
  ],
  footer: {
    copyrightText: '\u00A9 2026 Avinash M. Pawar. All rights reserved.',
    roleTags: ['UI/UX Designer', 'Product Designer'],
    location: 'Mumbai, India',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'behance', url: '#' },
      { platform: 'gmail', url: 'mailto:hello@example.com' },
    ],
  },
  settings: {
    resumePdfUrl: '',
    seoTitle: 'Avinash Pawar — Product Designer',
    seoDescription: 'UI/UX & Product Designer portfolio.',
  },
};
