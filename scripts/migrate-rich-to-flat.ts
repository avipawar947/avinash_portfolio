/**
 * Migrates the rich `caseStudy.sections` (legacy CMS shape) into the flat,
 * admin-editable `caseStudy` fields so the case-study page renders from
 * backend data the admin can actually edit (and matches the Figma layout via
 * the flat rendering path).
 *
 * Run: npx tsx scripts/migrate-rich-to-flat.ts  (requires MONGODB_URI)
 */
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import Project from '../models/Project';

function paraText(s: any): string {
  const paras = (s?.blocks ?? []).filter((b: any) => b.type === 'paragraph').map((b: any) => b.text).filter(Boolean);
  return paras.join('\n') || s?.intro || '';
}

function findBlock(s: any, type: string): any {
  return (s?.blocks ?? []).find((b: any) => b.type === type);
}

async function migrate() {
  await connectDB();
  const projects = await Project.find({}).lean();
  let n = 0;
  for (const p of projects as any[]) {
    const cs = p.caseStudy;
    if (!cs || !Array.isArray(cs.sections) || !cs.sections.length) continue;
    const byKey = Object.fromEntries(cs.sections.map((s: any) => [s.key, s]));

    const next: any = { ...cs };

    for (const key of ['overview', 'challenges', 'solutions', 'conclusion']) {
      const s = byKey[key];
      if (s) next[key] = { heading: s.title || s.label, body: paraText(s) };
    }

    const ia = byKey['information-architecture'];
    if (ia) {
      const sb = findBlock(ia, 'sitemap');
      next.infoArch = {
        heading: ia.title || ia.label,
        body: paraText(ia),
        nodes: sb?.nodes ?? [],
        imageUrl: cs.infoArch?.imageUrl ?? '',
        imagePublicId: cs.infoArch?.imagePublicId ?? '',
      };
    }

    const uj = byKey['user-journey'];
    if (uj) {
      const jb = findBlock(uj, 'journey');
      const rows = (jb?.rows ?? []).map((r: any[], i: number) => ({
        stage: jb?.stages?.[i] ?? '',
        does: r?.[0] ?? '',
        screens: r?.[1] ?? '',
        helps: r?.[2] ?? '',
        order: i,
      }));
      next.userJourney = {
        heading: uj.title || uj.label,
        body: uj.intro ?? '',
        rows,
        columns: jb?.columns,
        imageUrl: cs.userJourney?.imageUrl ?? '',
        imagePublicId: cs.userJourney?.imagePublicId ?? '',
      };
    }

    const uf = byKey['user-flow'];
    if (uf) {
      const fb = findBlock(uf, 'flow');
      next.userFlow = {
        heading: uf.title || uf.label,
        body: uf.intro ?? '',
        groups: fb?.groups ?? [],
        imageUrl: cs.userFlow?.imageUrl ?? '',
        imagePublicId: cs.userFlow?.imagePublicId ?? '',
        buttonLabel: cs.userFlow?.buttonLabel ?? '',
      };
    }

    const ds = byKey['design-system'];
    if (ds) {
      const tb = findBlock(ds, 'tokens');
      const colorsGroup = tb?.groups?.find((g: any) => g.kind === 'colors');
      const componentsGroup = tb?.groups?.find((g: any) => g.kind === 'components');
      const iconsGroup = tb?.groups?.find((g: any) => g.kind === 'icons');
      const typeGroup = tb?.groups?.find((g: any) => g.kind === 'type');
      next.designSystem = {
        heading: ds.title || ds.label,
        body: paraText(ds),
        colors: colorsGroup?.colors?.map((c: any) => c.hex) ?? [],
        components: componentsGroup?.components?.flatMap((c: any) => c.items ?? [c.label]) ?? [],
        icons: iconsGroup?.icons?.map((i: any) => ({ svgUrl: i.svgUrl, label: i.label })) ?? [],
        fonts: typeGroup?.samples?.map((s: any) => ({ family: s.family, weight: s.weight, text: s.text, size: s.size })) ?? [],
        colorsNote: colorsGroup?.description ?? '',
        typographyNote: typeGroup?.description ?? '',
        iconsNote: iconsGroup?.description ?? '',
      };
    }

    const wf = byKey['wireframe'];
    if (wf) {
      const eb = findBlock(wf, 'embed');
      next.wireframe = {
        heading: wf.title || wf.label,
        body: '',
        imageUrl: eb?.posterUrl ?? '',
        imagePublicId: cs.wireframe?.imagePublicId ?? '',
        link: eb?.url && eb.url !== '#' ? eb.url : '',
      };
    }

    const vd = byKey['visual-design'];
    if (vd) {
      const eb = findBlock(vd, 'embed');
      next.visual = {
        heading: vd.title || vd.label,
        body: '',
        imageUrl: eb?.posterUrl ?? '',
        imagePublicId: cs.visual?.imagePublicId ?? '',
        link: eb?.url && eb.url !== '#' ? eb.url : '',
      };
    }

    const imp = byKey['impact'];
    if (imp) {
      const sb = findBlock(imp, 'stats');
      next.impact = {
        heading: imp.title || imp.label,
        stats: (sb?.items ?? []).map((s: any, i: number) => ({
          value: s.value,
          suffix: s.suffix,
          label: s.group,
          desc: s.label,
          order: i,
        })),
      };
    }

    await Project.updateOne({ _id: p._id }, { $set: { 'caseStudy': next } });
    n++;
    console.log('migrated', p.slug || p._id);
  }
  console.log('done', n);
  process.exit(0);
}

migrate().catch((e) => { console.error(e); process.exit(1); });
