'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import ImageUploader from '@/components/admin/ImageUploader';
import VideoUploader from '@/components/admin/VideoUploader';
import FormField from '@/components/admin/FormField';
import type { ProjectItem, ProjectCaseStudy } from '@/types/content';

const EMPTY: Omit<ProjectItem, '_id'> = {
  title: '',
  slug: '',
  tag: 'Case Study',
  imageUrl: '',
  imagePublicId: '',
  mediaType: 'image',
  videoUrl: '',
  videoPublicId: '',
  videoPosterUrl: '',
  videoPosterPublicId: '',
  caseStudy: null,
  column: 'left',
  cropHeight: 100,
  cropTop: 0,
  wash: false,
  link: '',
  order: 0,
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Basic http(s) URL guard — keeps bad hrefs from entering the CMS. */
function isValidHttpUrl(v: string) {
  if (!v) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ProjectsAdminPage() {
  const { data: items } = useSWR<ProjectItem[]>('/api/projects', fetcher);
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);

  async function addProject() {
    setAdding(true);
    try {
      const payload = { ...draft, slug: draft.slug || slugify(draft.title), order: items?.length ?? 0 };
      await apiRequest('/api/projects', 'POST', payload);
      setDraft(EMPTY);
      mutate('/api/projects');
    } finally {
      setAdding(false);
    }
  }

  async function updateProject(id: string, patch: Partial<ProjectItem>) {
    await apiRequest(`/api/projects/${id}`, 'PUT', patch);
    mutate('/api/projects');
  }

  async function patchCS(p: ProjectItem, cs: Partial<ProjectCaseStudy>) {
    const prev = p.caseStudy ?? {};
    const next = { ...prev, ...cs };
    // Deep-merge nested case-study sub-objects so field-by-field edits never
    // wipe sibling keys the editor didn't touch (designSystem.fonts,
    // userJourney.rows/columns, userFlow.nodes, …).
    const merge = (a: any, b: any): any => {
      if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
      if (a && b && typeof a === 'object') {
        const out: any = { ...(a ?? {}) };
        for (const k of Object.keys(b ?? {})) out[k] = merge(out[k], (b as any)[k]);
        return out;
      }
      return b ?? a;
    };
    const merged: any = { ...next };
    const subs = ['overview', 'challenges', 'solutions', 'conclusion', 'infoArch', 'userJourney', 'userFlow', 'designSystem', 'wireframe', 'visual', 'impact'];
    for (const key of subs) {
      if ((cs as any)[key] || (prev as any)[key]) merged[key] = merge((prev as any)[key], (cs as any)[key]);
    }
    await updateProject(p._id, { caseStudy: merged as ProjectCaseStudy });
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    await apiRequest(`/api/projects/${id}`, 'DELETE');
    mutate('/api/projects');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Projects & Case Studies</h1>
      <p className="mb-6 text-sm text-white/50">
        Card click ab <code>/case-study/[slug]</code> page kholta hai (modal nahi). Media <b>image ya video</b> dono ho sakta hai — hero video hone par card + hero dono video dikhata hai.
      </p>

      <div className="space-y-4">
        {items?.map((p) => {
          const cs = p.caseStudy ?? {};
          const sec = (k: 'overview' | 'challenges' | 'solutions' | 'conclusion') => cs[k] ?? {};
          return (
            <div key={p._id} className="rounded-xl border border-white/10 bg-[#0D0D0D] p-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                  value={p.title}
                  onChange={(e) => updateProject(p._id, { title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                  value={p.slug ?? ''}
                  onChange={(e) => updateProject(p._id, { slug: slugify(e.target.value) })}
                  placeholder="slug (qistonpe)"
                />
                <input
                  className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                  value={p.link}
                  onChange={(e) => updateProject(p._id, { link: e.target.value })}
                  placeholder="Legacy external link (optional)"
                />
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Media type
                  <select
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={p.mediaType ?? 'image'}
                    onChange={(e) => updateProject(p._id, { mediaType: e.target.value as 'image' | 'video' })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </label>
              </div>

              <div className="mt-3 flex items-end justify-between gap-4">
                <ImageUploader
                  label="Card image (also hero poster)"
                  value={p.imageUrl}
                  oldPublicId={p.imagePublicId ?? ''}
                  onChange={(url, publicId) => updateProject(p._id, { imageUrl: url, imagePublicId: publicId ?? '' })}
                />
                <button onClick={() => deleteProject(p._id)} className="text-sm text-red-400 hover:text-red-300">
                  Delete
                </button>
              </div>

              {(p.mediaType ?? 'image') === 'video' && (
                <div className="mt-3 grid gap-3">
                  <VideoUploader
                    label="Card / hero video (mp4/webm, autoplay muted loop)"
                    value={p.videoUrl ?? ''}
                    oldPublicId={p.videoPublicId ?? ''}
                    onChange={(url, publicId) => updateProject(p._id, { videoUrl: url, videoPublicId: publicId ?? '' })}
                  />
                  <ImageUploader
                    label="Video poster"
                    value={p.videoPosterUrl ?? ''}
                    oldPublicId={p.videoPosterPublicId ?? ''}
                    onChange={(url, publicId) => updateProject(p._id, { videoPosterUrl: url, videoPosterPublicId: publicId ?? '' })}
                  />
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Column
                  <select
                    className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={p.column ?? 'left'}
                    onChange={(e) => updateProject(p._id, { column: e.target.value as 'left' | 'right' })}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Wash
                  <span className="flex items-center gap-2 pt-1">
                    <input type="checkbox" checked={!!p.wash} onChange={(e) => updateProject(p._id, { wash: e.target.checked })} className="h-4 w-4" />
                    Dark-to-grey wash over image
                  </span>
                </label>
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Crop height %
                  <input type="number" step="0.01" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={p.cropHeight ?? 100}
                    onChange={(e) => updateProject(p._id, { cropHeight: Number(e.target.value) })} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Crop top %
                  <input type="number" step="0.01" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={p.cropTop ?? 0}
                    onChange={(e) => updateProject(p._id, { cropTop: Number(e.target.value) })} />
                </label>
              </div>

              <details className="mt-4 rounded-lg border border-white/10 p-3">
                <summary className="cursor-pointer text-sm font-medium text-white/80">Case study content (hero + sections)</summary>
                <div className="mt-3 grid gap-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="heroTitle" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.heroTitle ?? ''}
                      onChange={(e) => patchCS(p, { heroTitle: e.target.value })} />
                    <input placeholder="websiteUrl" type="url" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.websiteUrl ?? ''}
                      onChange={(e) => patchCS(p, { websiteUrl: e.target.value })} />
                    <input placeholder="wireframeUrl" type="url" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.wireframeUrl ?? ''}
                      onChange={(e) => patchCS(p, { wireframeUrl: e.target.value })} />
                    <input placeholder="client" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.client ?? ''}
                      onChange={(e) => patchCS(p, { client: e.target.value })} />
                    <input placeholder="type" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.type ?? ''}
                      onChange={(e) => patchCS(p, { type: e.target.value })} />
                    <input placeholder="category" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.category ?? ''}
                      onChange={(e) => patchCS(p, { category: e.target.value })} />
                    <input placeholder="duration" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.duration ?? ''}
                      onChange={(e) => patchCS(p, { duration: e.target.value })} />
                    <input placeholder="role" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.role ?? ''}
                      onChange={(e) => patchCS(p, { role: e.target.value })} />
                  </div>
                  <textarea rows={2} placeholder="heroSubtitle" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.heroSubtitle ?? ''}
                    onChange={(e) => patchCS(p, { heroSubtitle: e.target.value })} />
                  <ImageUploader label="Hero image (detail main frame; empty = card image)" value={cs.heroImageUrl ?? ''} oldPublicId={cs.heroImagePublicId ?? ''}
                    onChange={(url, publicId) => patchCS(p, { heroImageUrl: url, heroImagePublicId: publicId ?? '' })} />
                  <ImageUploader label="Hero background" value={cs.heroBackgroundUrl ?? ''} oldPublicId={cs.heroBackgroundPublicId ?? ''}
                    onChange={(url, publicId) => patchCS(p, { heroBackgroundUrl: url, heroBackgroundPublicId: publicId ?? '' })} />
                  <ImageUploader label="Project icon (SVG, left-nav logo; empty = webp logo)" value={(cs as any).iconSvgUrl ?? ''} oldPublicId={(cs as any).iconSvgPublicId ?? ''}
                    onChange={(url, publicId) => patchCS(p, { iconSvgUrl: url, iconSvgPublicId: publicId ?? '' } as any)} />
                  <textarea rows={2} placeholder="Overview body" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={sec('overview').body ?? ''}
                    onChange={(e) => patchCS(p, { overview: { ...sec('overview'), heading: sec('overview').heading ?? 'Overview', body: e.target.value } })} />
                  <textarea rows={2} placeholder="Challenges body" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={sec('challenges').body ?? ''}
                    onChange={(e) => patchCS(p, { challenges: { ...sec('challenges'), heading: sec('challenges').heading ?? 'The Challenges', body: e.target.value } })} />
                  <textarea rows={2} placeholder="Solutions body" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={sec('solutions').body ?? ''}
                    onChange={(e) => patchCS(p, { solutions: { ...sec('solutions'), heading: sec('solutions').heading ?? 'The Solutions', body: e.target.value } })} />
                  <textarea rows={2} placeholder="Conclusion body" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={sec('conclusion').body ?? ''}
                    onChange={(e) => patchCS(p, { conclusion: { ...sec('conclusion'), heading: sec('conclusion').heading ?? 'Conclusion', body: e.target.value } })} />
                  <textarea rows={2} placeholder="Information Architecture body" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.infoArch?.body ?? ''}
                    onChange={(e) => patchCS(p, { infoArch: { ...(cs.infoArch ?? {}), heading: cs.infoArch?.heading ?? 'Information Architecture', body: e.target.value } })} />
                  <textarea rows={4} placeholder={"Information Architecture nodes (label | sub per line)"} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={(cs.infoArch?.nodes ?? []).map((n) => `${n.label} | ${n.sub ?? ''}`).join('\n')}
                    onChange={(e) => patchCS(p, { infoArch: { ...(cs.infoArch ?? {}), heading: cs.infoArch?.heading ?? 'Information Architecture', body: cs.infoArch?.body ?? '', nodes: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [label, sub] = l.split('|').map((s) => s.trim()); return { label, sub }; }) } })} />
                  <textarea rows={2} placeholder="User Journey intro" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.userJourney?.body ?? ''}
                    onChange={(e) => patchCS(p, { userJourney: { ...(cs.userJourney ?? {}), heading: cs.userJourney?.heading ?? 'User Journey', body: e.target.value } })} />
                  <textarea rows={2} placeholder="User Flow intro" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.userFlow?.body ?? ''}
                    onChange={(e) => patchCS(p, { userFlow: { ...(cs.userFlow ?? {}), heading: cs.userFlow?.heading ?? 'User Flow', body: e.target.value } })} />
                  <textarea rows={2} placeholder="Visual Design body" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.visual?.body ?? ''}
                    onChange={(e) => patchCS(p, { visual: { ...(cs.visual ?? {}), heading: cs.visual?.heading ?? 'Visual Design', body: e.target.value } })} />
                  <textarea rows={2} placeholder="Design-system typography note" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.designSystem?.typographyNote ?? ''}
                    onChange={(e) => patchCS(p, { designSystem: { ...(cs.designSystem ?? {}), heading: cs.designSystem?.heading ?? 'Design System', typographyNote: e.target.value } })} />
                  <textarea rows={2} placeholder="Design-system icons note" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.designSystem?.iconsNote ?? ''}
                    onChange={(e) => patchCS(p, { designSystem: { ...(cs.designSystem ?? {}), heading: cs.designSystem?.heading ?? 'Design System', iconsNote: e.target.value } })} />
                  <textarea rows={1} placeholder="Design-system components (comma separated)" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={(cs.designSystem?.components ?? []).join(', ')}
                    onChange={(e) => patchCS(p, { designSystem: { ...(cs.designSystem ?? {}), heading: cs.designSystem?.heading ?? 'Design System', components: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })} />
                  <textarea rows={1} placeholder="Design-system colors hex, comma separated" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={(cs.designSystem?.colors ?? []).join(', ')}
                    onChange={(e) => patchCS(p, { designSystem: { ...(cs.designSystem ?? {}), heading: cs.designSystem?.heading ?? 'Design System', colors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })} />
                  <textarea rows={2} placeholder="Design-system icons (comma separated svg urls)" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                    value={(cs.designSystem?.icons ?? []).map((i) => i.svgUrl).filter(Boolean).join(', ')}
                    onChange={(e) => patchCS(p, { designSystem: { ...(cs.designSystem ?? {}), heading: cs.designSystem?.heading ?? 'Design System', icons: e.target.value.split(',').map((s) => s.trim()).filter(Boolean).map((svgUrl) => ({ svgUrl })) } })} />
                  <ImageUploader label="Information Architecture diagram (upload → Zoom In)" value={cs.infoArch?.imageUrl ?? ''} oldPublicId={cs.infoArch?.imagePublicId ?? ''}
                    onChange={(url, publicId) => patchCS(p, { infoArch: { ...(cs.infoArch ?? {}), heading: cs.infoArch?.heading ?? 'Information Architecture', body: cs.infoArch?.body ?? '', imageUrl: url, imagePublicId: publicId ?? '' } })} />
                  <ImageUploader label="User Journey image (upload for slide media)" value={cs.userJourney?.imageUrl ?? ''} oldPublicId={cs.userJourney?.imagePublicId ?? ''}
                    onChange={(url, publicId) => patchCS(p, { userJourney: { ...(cs.userJourney ?? {}), heading: cs.userJourney?.heading ?? 'User Journey', body: cs.userJourney?.body ?? '', rows: cs.userJourney?.rows ?? [], columns: cs.userJourney?.columns ?? [], imageUrl: url, imagePublicId: publicId ?? '' } })} />
                  <textarea rows={6} placeholder={"Stage | Does | Screens | Helps\nSign in | Enters mobile number and verifies the OTP. | Login, OTP | Timer, resend and edit-number options."} value={(cs.userJourney?.rows ?? []).map((r) => [r.stage, r.does, r.screens, r.helps].join(' | ')).join('\n')}
                    onChange={(e) => patchCS(p, { userJourney: { ...(cs.userJourney ?? {}), heading: cs.userJourney?.heading ?? 'User Journey', body: cs.userJourney?.body ?? '', rows: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l, i) => { const [stage, does, screens, helps] = l.split('|').map((s) => s.trim()); return { stage, does, screens, helps, order: i }; }) } })} />
                  <textarea rows={1} placeholder="Journey columns (pipe separated)" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={(cs.userJourney?.columns ?? []).join(' | ')}
                    onChange={(e) => patchCS(p, { userJourney: { ...(cs.userJourney ?? {}), heading: cs.userJourney?.heading ?? 'User Journey', body: cs.userJourney?.body ?? '', columns: e.target.value.split('|').map((s) => s.trim()).filter(Boolean) } })} />
                  <ImageUploader label="User Flow image (upload for slide media)" value={cs.userFlow?.imageUrl ?? ''} oldPublicId={cs.userFlow?.imagePublicId ?? ''}
                    onChange={(url, publicId) => patchCS(p, { userFlow: { ...(cs.userFlow ?? {}), heading: cs.userFlow?.heading ?? 'User Flow', body: cs.userFlow?.body ?? '', nodes: cs.userFlow?.nodes ?? [], buttonLabel: cs.userFlow?.buttonLabel ?? '', imageUrl: url, imagePublicId: publicId ?? '' } })} />
                  <input placeholder="User Flow button label" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={cs.userFlow?.buttonLabel ?? ''}
                    onChange={(e) => patchCS(p, { userFlow: { ...(cs.userFlow ?? {}), heading: cs.userFlow?.heading ?? 'User Flow', body: cs.userFlow?.body ?? '', nodes: cs.userFlow?.nodes ?? [], buttonLabel: e.target.value } })} />
                  <textarea rows={6} placeholder={"Login | Mobile Number\nOTP Verify | Enter 4-digit OTP"} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={(cs.userFlow?.nodes ?? []).map((n) => `${n.title} | ${n.sub}`).join('\n')}
                    onChange={(e) => patchCS(p, { userFlow: { ...(cs.userFlow ?? {}), heading: cs.userFlow?.heading ?? 'User Flow', body: cs.userFlow?.body ?? '', nodes: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [title, sub] = l.split('|').map((s) => s.trim()); return { title, sub }; }), buttonLabel: cs.userFlow?.buttonLabel ?? '' } })} />
                  <textarea rows={3} placeholder={"Montserrat | 590 | QistonPe | 48\nPoppins | 400 | QistonPe | 32"} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={(cs.designSystem?.fonts ?? []).map((f) => [f.family, f.weight, f.text, f.size].join(' | ')).join('\n')}
                    onChange={(e) => patchCS(p, { designSystem: { ...(cs.designSystem ?? {}), heading: cs.designSystem?.heading ?? 'Design System', typographyNote: cs.designSystem?.typographyNote ?? '', fonts: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [family, weight, text, size] = l.split('|').map((s) => s.trim()); return { family, weight: Number(weight) || 400, text, size: Number(size) || 0 }; }) } })} />
                  <textarea rows={4} placeholder={"85 | % | For the Stakeholder | Of clients are satisfied...\n40 | + | For The Business | Loan applications disbursed through QistonPe in just one month."} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={(cs.impact?.stats ?? []).map((s) => [s.value, s.suffix, s.label, s.desc].join(' | ')).join('\n')}
                    onChange={(e) => patchCS(p, { impact: { heading: cs.impact?.heading ?? 'Impact', stats: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l, i) => { const [value, suffix, label, desc] = l.split('|').map((s) => s.trim()); return { value, suffix, label, desc, order: i }; }) } })} />
                </div>
              </details>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-white/20 p-5">
        <p className="mb-3 text-sm font-medium text-white/70">Add a new project</p>
        <FormField label="Title">
          <input className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </FormField>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <FormField label="Slug (auto from title)">
            <input className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.slug ?? ''} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} />
          </FormField>
          <FormField label="Media type">
            <select className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.mediaType ?? 'image'}
              onChange={(e) => setDraft({ ...draft, mediaType: e.target.value as 'image' | 'video' })}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </FormField>
          <FormField label="Column">
            <select className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.column} onChange={(e) => setDraft({ ...draft, column: e.target.value as 'left' | 'right' })}>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </FormField>
          <FormField label="Wash">
            <span className="flex items-center gap-2 pt-2">
              <input type="checkbox" checked={!!draft.wash} onChange={(e) => setDraft({ ...draft, wash: e.target.checked })} className="h-4 w-4" />
              Dark-to-grey wash over image
            </span>
          </FormField>
        </div>
        <button onClick={addProject} disabled={adding || !draft.title} className="mt-3 rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50">
          {adding ? 'Adding…' : 'Add project'}
        </button>
      </div>
    </div>
  );
}
