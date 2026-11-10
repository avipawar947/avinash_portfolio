/**
 * Dummy full case-study content for every project (same 11 sections).
 * Run: npm run dummy  (requires MONGODB_URI in .env.local)
 * NOTE: does NOT delete — it upserts `caseStudy.sections` etc.
 */
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import Project from '../models/Project';

function makeDummy(title: string, slug: string) {
  const t = title;
  const para = (text: string) => ({ type: 'paragraph', text });
  return {
    tagline: [
      `${t} makes the complex workflow feel simple — one place to start, apply, track and finish.`,
      `Guided steps, clear status at every stage, and nothing left halfway.`,
      `Designed to be used with confidence from the first screen to the last.`,
    ],
    logoUrl: `/images/case-study/${slug === 'hrx' ? 'hrx/card' : slug === 'synclature' ? 'synclature/card' : 'qistonpe/logo'}.webp`,
    coverImageUrl: `/images/case-study/${slug === 'hrx' ? 'hrx/card' : slug === 'synclature' ? 'synclature/card' : 'qistonpe/hero-main'}.webp`,
    meta: [
      { label: 'Client', value: t },
      { label: 'Category', value: 'Mobile App + Web App' },
      { label: 'Type', value: 'Product · B2B' },
      { label: 'Duration', value: '01 Mar 2026 to 20 May 2026' },
    ],
    websiteUrl: 'https://example.com',
    wireframeUrl: 'https://example.com/wireframe',
    sections: [
      { key: 'overview', label: 'Overview', title: 'Overview', visible: true, order: 0, blocks: [para(`${t} is a product platform that brings the whole journey into one place — start, details, review and tracking, all with clarity. A guided flow keeps users moving without losing their place, and every step shows what is needed next. The experience stays consistent across screens, so the work feels simple and organised from day one.`)] },
      { key: 'challenges', label: 'The Challenges', title: 'The Challenges', visible: true, order: 1, blocks: [para(`The challenge was turning a long, data-heavy process into something people could finish in one sitting. The flow had to handle different user types, collect details with supporting documents, and complete verification without breaking progress. It also had to support multiple items with detailed costs, make comparison simple, and keep track across statuses with a clear path to fix and resubmit.`)] },
      { key: 'solutions', label: 'The Solutions', title: 'The Solutions', visible: true, order: 2, blocks: [para(`We designed ${t} as a guided flow that takes users from first details to submission without losing their place. Each area gets its own focused step, with forms that adapt to the user, and verification happening inline. Before anything is sent, a review screen lets the user check everything, and a list with options and eligibility makes choosing the best path easy. Once submitted, one place tracks everything by status, with clear edit-and-resubmit paths.`)] },
      { key: 'information-architecture', label: 'Information Architecture', title: 'Information Architecture', visible: true, order: 3, blocks: [
        para(`I structured ${t} around the user's workflow: a dashboard, a step-by-step apply flow, selection, and one place to track and finish.`),
        { type: 'sitemap', brand: t, nodes: [
          { label: 'Login', sub: 'Entry', children: [{ label: 'Mobile No' }, { label: 'OTP' }] },
          { label: 'Dashboard', sub: 'Overview', children: [{ label: 'Stats' }, { label: 'Recent' }] },
          { label: 'Application', sub: '3-Step Wizard', children: [{ label: 'Details' }, { label: 'Review' }] },
          { label: 'Listing', sub: 'Track Status', children: [{ label: 'Stats' }] },
        ] },
      ] },
      { key: 'user-journey', label: 'User Journey', title: 'User Journey', intro: `This journey follows a user through ${t}, from signing in to finishing. Each stage shows what they do, which screens they use, and how the design supports them.`, visible: true, order: 4, blocks: [
        { type: 'journey', columns: ['What the user does', 'Screens', 'How the design helps'], rows: [
          ['Enters mobile number and verifies the OTP.', 'Login, OTP', 'Timer, resend and edit options.'],
          ['Checks the dashboard and starts a new application.', 'Dashboard, guide', 'Stats set expectations up front.'],
          ['Adds details and costs.', 'Details, Invoice', 'Grouped clearly per item.'],
          ['Verifies identity and uploads documents.', 'Verification', 'Fields adapt, verification inline.'],
          ['Reviews everything and submits.', 'Review, Submit', 'Full review before sending.'],
          ['Tracks status and resubmits if needed.', 'Listing, Resubmit', 'Guided edit paths.'],
        ] },
      ] },
      { key: 'user-flow', label: 'User Flow', title: 'User Flow', intro: `The flow shows how a user moves through ${t}, from signing in to submitting — then the path depends on status.`, visible: true, order: 5, blocks: [
        { type: 'flow', groups: [
          { title: 'Sign in', nodes: [{ label: 'Login', sub: 'Mobile Number' }, { label: 'OTP Verify', sub: 'Enter 4-digit OTP' }] },
          { title: 'Apply', nodes: [{ label: 'Details', sub: 'Identity, Docs' }, { label: 'Review', sub: 'All details' }, { label: 'Submit', sub: 'Confirmation' }] },
          { title: 'Finish', nodes: [{ label: 'Listing', sub: 'All applications' }, { label: 'Status', sub: 'Approved / Hold' }] },
        ] },
      ] },
      { key: 'design-system', label: 'Design System', title: 'Design System', visible: true, order: 6, blocks: [
        { type: 'tokens', groups: [
          { kind: 'type', title: 'Typography', description: 'Montserrat with Poppins secondary, for high legibility.', samples: [{ family: 'Montserrat', weight: 700, text: 'Ag', size: 120 }, { family: 'Poppins', weight: 300, text: 'Ag', size: 80 }] },
          { kind: 'colors', title: 'Colors', description: 'Midnight Blue builds trust, status colours show progress at a glance.', colors: [{ hex: '#1B1464', label: 'Midnight Blue' }, { hex: '#004C8F', label: 'Blue' }, { hex: '#0B80C6', label: 'Info' }, { hex: '#00731D', label: 'Success' }, { hex: '#FF2D55', label: 'Error' }, { hex: '#FF9500', label: 'Warning' }] },
          { kind: 'components', title: 'Components', description: 'Form controls, buttons and badges share one compact system.', components: [{ label: 'Inputs', items: ['Type here..', 'Search here'] }, { label: 'Buttons', items: ['Primary', 'Secondary'] }] },
        ] },
      ] },
      { key: 'wireframe', label: 'Wireframe', title: 'Wireframe', visible: true, order: 7, blocks: [{ type: 'embed', url: 'https://example.com/wireframe', label: 'Visit Wireframe', posterUrl: `/images/case-study/${slug === 'hrx' ? 'hrx/card' : slug === 'synclature' ? 'synclature/card' : 'qistonpe/hero-main'}.webp` }] },
      { key: 'visual-design', label: 'Visual Design', title: 'Visual Design', visible: true, order: 8, blocks: [{ type: 'embed', url: 'https://example.com', label: 'Visit Wireframe', posterUrl: `/images/case-study/${slug === 'hrx' ? 'hrx/card' : slug === 'synclature' ? 'synclature/card' : 'qistonpe/hero-main'}.webp` }] },
      { key: 'impact', label: 'Impact', title: 'Impact', intro: 'What Changed, Three Ways.', visible: true, order: 9, blocks: [
        { type: 'stats', items: [
          { value: '85', suffix: '%', group: 'For the Stakeholder', label: 'Of users are satisfied with the guided flow and one-place tracking.' },
          { value: '40', suffix: '+', group: 'For The Business', label: 'Applications completed in just one month.' },
          { value: '50', suffix: '+', group: 'For The Platform', label: 'Screens designed as one consistent system.' },
        ] },
      ] },
      { key: 'conclusion', label: 'Conclusion', title: 'Conclusion', visible: true, order: 10, blocks: [para(`${t} brings the entire journey into one platform, so teams can move from first details to the finish with clarity. A clear tracking system and a consistent design system make a complex process feel simple and organised — something people can use with confidence.`)] },
    ],
    sectionIcons: [],
    iconSvgUrl: '',
  };
}

async function main() {
  await connectDB();
  const docs = await Project.find({ slug: { $ne: '' } });
  console.log('projects with slug:', docs.map((d: any) => d.slug));
  for (const d of docs as any[]) {
    if (d.slug === 'qistonpe') continue; // keep rich QistonPe content
    const dummy = makeDummy(d.title, d.slug);
    // Keep existing hero fields if present, else fill
    d.caseStudy = { ...(d.caseStudy?.toObject?.() ?? d.caseStudy ?? {}), ...dummy };
    d.pagePublished = true;
    await d.save();
    console.log('dummy filled:', d.slug, d.title);
  }
  // non-slug Synclature duplicate: give it a slug + dummy
  const dup = await Project.findOne({ slug: '' });
  if (dup) {
    (dup as any).slug = 'synclature-2';
    (dup as any).caseStudy = { ...((dup as any).caseStudy ?? {}), ...makeDummy((dup as any).title, 'synclature') };
    await (dup as any).save();
    console.log('dummy filled: synclature-2');
  }
  console.log('done');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
