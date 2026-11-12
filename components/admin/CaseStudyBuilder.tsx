'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';
import SaveBar from './SaveBar';
import { apiRequest } from '@/lib/fetcher';
import type { CaseStudyPanel, ProjectCaseStudy, ProjectItem } from '@/types/content';
import {
  COMMON_FONTS,
  CUSTOM_TYPES,
  FONT_WEIGHTS,
  PANEL_PRESETS,
  TYPE_LABEL,
  googleFontsHref,
  newPanel,
  panelFromPreset,
  resolvePanels,
  uid,
} from '@/lib/case-study-panels';

const inp = 'w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm';
const btn = 'rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:border-white/40 disabled:opacity-30';

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-white/60">
      {text}
      {children}
    </label>
  );
}

/* ------------------------------ asset helpers ----------------------------- */

/** Pick several image / SVG files and upload them one by one. */
function MultiUploader({
  label,
  onUploaded,
}: {
  label: string;
  onUploaded: (items: { label: string; url: string; publicId: string }[]) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    const done: { label: string; url: string; publicId: string }[] = [];
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) done.push({ label: file.name.replace(/\.[^.]+$/, ''), url: data.url, publicId: data.publicId });
        else alert(`${file.name}: ${data.error || 'Upload failed'}`);
      }
    } finally {
      if (done.length) onUploaded(done);
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <input
        type="file"
        multiple
        accept="image/svg+xml,image/*"
        onChange={handle}
        disabled={busy}
        className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white"
      />
      {busy && <p className="mt-1 text-xs text-white/40">Uploading…</p>}
    </div>
  );
}

/* ----------------------------- design system ------------------------------ */

function DesignSystemEditor({ panel, update }: { panel: CaseStudyPanel; update: (p: Partial<CaseStudyPanel>) => void }) {
  const icons = panel.icons ?? [];
  const fonts = panel.fonts ?? [];
  const colors = panel.colors ?? [];
  const components = panel.components ?? [];
  const [chip, setChip] = useState('');
  const fontsHref = googleFontsHref(fonts);

  const addChips = (raw: string) => {
    const next = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (next.length) update({ components: [...components, ...next.filter((c) => !components.includes(c))] });
    setChip('');
  };

  return (
    <div className="grid gap-6">
      {/* Icons */}
      <section className="grid gap-3">
        <h4 className="text-sm font-semibold text-white/80">Icons</h4>
        <MultiUploader
          label="Upload icons (SVG / PNG — select many at once)"
          onUploaded={(items) =>
            update({ icons: [...icons, ...items.map((i) => ({ label: i.label, svgUrl: i.url, svgPublicId: i.publicId }))] })
          }
        />
        {icons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {icons.map((ic, i) => (
              <div key={`${ic.svgUrl}-${i}`} className="group relative flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a1a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ic.svgUrl} alt={ic.label || 'icon'} className="h-8 w-8 object-contain" />
                <button
                  type="button"
                  aria-label="Remove icon"
                  onClick={() => update({ icons: icons.filter((_, j) => j !== i) })}
                  className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 rounded-full bg-red-500 text-[11px] leading-5 text-white group-hover:block"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fonts */}
      <section className="grid gap-3">
        <h4 className="text-sm font-semibold text-white/80">Fonts</h4>
        {fontsHref && /* eslint-disable-next-line @next/next/no-page-custom-font */ <link rel="stylesheet" href={fontsHref} />}
        <datalist id="cs-font-list">
          {COMMON_FONTS.map((f) => (
            <option key={f} value={f} />
          ))}
        </datalist>
        {fonts.map((f, i) => {
          const set = (patch: Partial<(typeof fonts)[number]>) =>
            update({ fonts: fonts.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
          return (
            <div key={i} className="grid gap-2 rounded-lg border border-white/10 p-3">
              <div className="grid grid-cols-[1.4fr_1fr_1.4fr_80px_auto] items-end gap-2">
                <Label text="Font family (any Google Font)">
                  <input list="cs-font-list" className={inp} value={f.family} onChange={(e) => set({ family: e.target.value })} placeholder="Poppins" />
                </Label>
                <Label text="Weight">
                  <select className={inp} value={f.weight} onChange={(e) => set({ weight: Number(e.target.value) })}>
                    {FONT_WEIGHTS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </Label>
                <Label text="Sample text">
                  <input className={inp} value={f.text} onChange={(e) => set({ text: e.target.value })} placeholder="Aa" />
                </Label>
                <Label text="Size">
                  <input type="number" min={8} max={64} className={inp} value={f.size} onChange={(e) => set({ size: Number(e.target.value) })} />
                </Label>
                <button type="button" className="pb-2 text-sm text-red-400" onClick={() => update({ fonts: fonts.filter((_, j) => j !== i) })}>
                  Remove
                </button>
              </div>
              {f.family && (
                <p className="truncate text-white" style={{ fontFamily: `"${f.family}", sans-serif`, fontWeight: f.weight, fontSize: Math.min(f.size || 24, 40) }}>
                  {f.text || f.family}
                </p>
              )}
            </div>
          );
        })}
        <div>
          <button type="button" className={btn} onClick={() => update({ fonts: [...fonts, { family: '', weight: 400, text: 'Aa', size: 32 }] })}>
            + Add font
          </button>
        </div>
      </section>

      {/* Colors */}
      <section className="grid gap-3">
        <h4 className="text-sm font-semibold text-white/80">Color palette</h4>
        <div className="grid gap-2">
          {colors.map((c, i) => {
            const set = (patch: Partial<(typeof colors)[number]>) =>
              update({ colors: colors.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
            const picker = /^#[0-9a-fA-F]{6}$/.test(c.hex) ? c.hex : '#000000';
            return (
              <div key={i} className="grid grid-cols-[44px_1fr_1.4fr_auto] items-center gap-2">
                <input type="color" aria-label="Pick color" className="h-9 w-11 cursor-pointer rounded border border-white/10 bg-black p-0.5" value={picker} onChange={(e) => set({ hex: e.target.value.toUpperCase() })} />
                <input className={inp} value={c.hex} onChange={(e) => set({ hex: e.target.value })} placeholder="#534AB7" />
                <input className={inp} value={c.label ?? ''} onChange={(e) => set({ label: e.target.value })} placeholder="Name (optional) — Primary" />
                <button type="button" className="text-sm text-red-400" onClick={() => update({ colors: colors.filter((_, j) => j !== i) })}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <div>
          <button type="button" className={btn} onClick={() => update({ colors: [...colors, { hex: '#FFFFFF', label: '' }] })}>
            + Add color
          </button>
        </div>
      </section>

      {/* Components */}
      <section className="grid gap-3">
        <h4 className="text-sm font-semibold text-white/80">Components</h4>
        <div className="flex flex-wrap gap-2">
          {components.map((c, i) => (
            <span key={`${c}-${i}`} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#141414] px-3 py-1.5 text-sm">
              {c}
              <button type="button" aria-label={`Remove ${c}`} className="text-white/50 hover:text-red-400" onClick={() => update({ components: components.filter((_, j) => j !== i) })}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inp}
            value={chip}
            placeholder="Button, Input field, Card …  (Enter or comma to add)"
            onChange={(e) => (e.target.value.includes(',') ? addChips(e.target.value) : setChip(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addChips(chip);
              }
            }}
          />
          <button type="button" className={btn} onClick={() => addChips(chip)}>
            Add
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ panel editor ------------------------------ */

function StatsEditor({ panel, update }: { panel: CaseStudyPanel; update: (p: Partial<CaseStudyPanel>) => void }) {
  const stats = panel.stats ?? [];
  return (
    <div className="grid gap-2">
      <h4 className="text-sm font-semibold text-white/80">Stat cards</h4>
      {stats.map((s, i) => {
        const set = (patch: Partial<(typeof stats)[number]>) => update({ stats: stats.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
        return (
          <div key={i} className="grid grid-cols-[80px_60px_1fr_2fr_auto] items-center gap-2">
            <input className={inp} value={s.value} onChange={(e) => set({ value: e.target.value })} placeholder="85" />
            <input className={inp} value={s.suffix} onChange={(e) => set({ suffix: e.target.value })} placeholder="%" />
            <input className={inp} value={s.label} onChange={(e) => set({ label: e.target.value })} placeholder="For the Stakeholder" />
            <input className={inp} value={s.desc} onChange={(e) => set({ desc: e.target.value })} placeholder="Of clients are satisfied…" />
            <button type="button" className="text-sm text-red-400" onClick={() => update({ stats: stats.filter((_, j) => j !== i) })}>
              Remove
            </button>
          </div>
        );
      })}
      <div>
        <button type="button" className={btn} onClick={() => update({ stats: [...stats, { value: '', suffix: '', label: '', desc: '' }] })}>
          + Add stat
        </button>
      </div>
    </div>
  );
}

function PanelFields({ panel, update }: { panel: CaseStudyPanel; update: (p: Partial<CaseStudyPanel>) => void }) {
  const setTitle = (title: string) => {
    // Keep the nav label following the title until the admin edits it separately.
    const follow = !panel.label || panel.label === panel.title;
    update(follow ? { title, label: title } : { title });
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Label text="Title (shown on the slide)">
          <input className={inp} value={panel.title} onChange={(e) => setTitle(e.target.value)} placeholder="Overview" />
        </Label>
        <Label text="Left-nav label">
          <input className={inp} value={panel.label} onChange={(e) => update({ label: e.target.value })} placeholder="Overview" />
        </Label>
      </div>
      <Label text={panel.type === 'text' ? 'Paragraph' : 'Paragraph (optional)'}>
        <textarea rows={panel.type === 'text' ? 5 : 3} className={inp} value={panel.body} onChange={(e) => update({ body: e.target.value })} />
      </Label>

      {(panel.type === 'zoom-image' || panel.type === 'image-link') && (
        <ImageUploader
          label={panel.type === 'zoom-image' ? 'Image (visitors can drag & zoom it)' : 'Image'}
          value={panel.imageUrl ?? ''}
          oldPublicId={panel.imagePublicId ?? ''}
          onChange={(url, publicId) => update({ imageUrl: url, imagePublicId: publicId })}
        />
      )}

      {panel.type === 'image-link' && (
        <div className="grid grid-cols-2 gap-3">
          <Label text={panel.preset === 'wireframe' || panel.preset === 'visual-design' ? 'Button link (Visit Wireframe)' : 'Button link (empty = no button)'}>
            <input type="url" className={inp} value={panel.link ?? ''} onChange={(e) => update({ link: e.target.value })} placeholder="https://www.figma.com/…" />
          </Label>
          <Label text="Button label">
            <input className={inp} value={panel.linkLabel ?? ''} onChange={(e) => update({ linkLabel: e.target.value })} placeholder="Visit Wireframe" />
          </Label>
        </div>
      )}

      {panel.type === 'design-system' && <DesignSystemEditor panel={panel} update={update} />}
      {panel.type === 'stats' && <StatsEditor panel={panel} update={update} />}
    </div>
  );
}

/* --------------------------------- builder -------------------------------- */

export default function CaseStudyBuilder({ project, onSaved }: { project: ProjectItem; onSaved?: () => void }) {
  const [cs, setCs] = useState<ProjectCaseStudy>(() => ({
    ...(project.caseStudy ?? {}),
    // Existing projects (older fixed-field content) open here already converted to sections.
    panels: resolvePanels(project.caseStudy).map((p) => ({ ...p, uid: p.uid || uid() })),
  }));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [toAdd, setToAdd] = useState('preset:overview');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const panels = cs.panels ?? [];
  const patch = (p: Partial<ProjectCaseStudy>) => setCs((c) => ({ ...c, ...p }));
  const setPanels = (fn: (ps: CaseStudyPanel[]) => CaseStudyPanel[]) => setCs((c) => ({ ...c, panels: fn(c.panels ?? []) }));
  const updatePanel = (id: string, p: Partial<CaseStudyPanel>) => setPanels((ps) => ps.map((x) => (x.uid === id ? { ...x, ...p } : x)));
  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  function move(i: number, dir: -1 | 1) {
    setPanels((ps) => {
      const j = i + dir;
      if (j < 0 || j >= ps.length) return ps;
      const next = [...ps];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function addPanel() {
    const [kind, key] = toAdd.split(':');
    const panel =
      kind === 'preset'
        ? panelFromPreset(key)
        : newPanel(key as CaseStudyPanel['type'], undefined, '');
    setPanels((ps) => [...ps, panel]);
    setExpanded((e) => ({ ...e, [panel.uid]: true }));
  }

  async function save() {
    setSaving(true);
    setMsg('');
    try {
      await apiRequest(`/api/projects/${project._id}`, 'PUT', { caseStudy: cs });
      setMsg('Saved ✓');
      onSaved?.();
    } catch (err) {
      setMsg((err as Error).message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 grid gap-6 text-sm">
      {/* Hero + left-nav brand */}
      <section className="grid gap-3">
        <h3 className="text-base font-semibold text-white/90">Hero &amp; left-nav brand</h3>
        <div className="grid grid-cols-2 gap-3">
          <Label text="Hero title">
            <input className={inp} value={cs.heroTitle ?? ''} onChange={(e) => patch({ heroTitle: e.target.value })} />
          </Label>
          <Label text="Left-nav project name (empty = hero title)">
            <input className={inp} value={cs.navTitle ?? ''} onChange={(e) => patch({ navTitle: e.target.value })} placeholder="QistonPe" />
          </Label>
          <Label text="Website URL">
            <input type="url" className={inp} value={cs.websiteUrl ?? ''} onChange={(e) => patch({ websiteUrl: e.target.value })} />
          </Label>
          <Label text="Wireframe URL">
            <input type="url" className={inp} value={cs.wireframeUrl ?? ''} onChange={(e) => patch({ wireframeUrl: e.target.value })} />
          </Label>
          <Label text="Client">
            <input className={inp} value={cs.client ?? ''} onChange={(e) => patch({ client: e.target.value })} />
          </Label>
          <Label text="Category">
            <input className={inp} value={cs.category ?? ''} onChange={(e) => patch({ category: e.target.value })} />
          </Label>
          <Label text="Type">
            <input className={inp} value={cs.type ?? ''} onChange={(e) => patch({ type: e.target.value })} />
          </Label>
          <Label text="Duration">
            <input className={inp} value={cs.duration ?? ''} onChange={(e) => patch({ duration: e.target.value })} />
          </Label>
        </div>
        <Label text="Hero subtitle">
          <textarea rows={2} className={inp} value={cs.heroSubtitle ?? ''} onChange={(e) => patch({ heroSubtitle: e.target.value })} />
        </Label>
        <div className="grid grid-cols-3 gap-4">
          <ImageUploader
            label="Left-nav logo (SVG / PNG)"
            value={cs.iconSvgUrl ?? ''}
            onChange={(url, publicId) => patch({ iconSvgUrl: url, iconSvgPublicId: publicId })}
          />
          <ImageUploader
            label="Hero image (empty = card image)"
            value={cs.heroImageUrl ?? ''}
            onChange={(url, publicId) => patch({ heroImageUrl: url, heroImagePublicId: publicId })}
          />
          <ImageUploader
            label="Hero background"
            value={cs.heroBackgroundUrl ?? ''}
            onChange={(url, publicId) => patch({ heroBackgroundUrl: url, heroBackgroundPublicId: publicId })}
          />
        </div>
      </section>

      {/* Sections */}
      <section className="grid gap-3">
        <div>
          <h3 className="text-base font-semibold text-white/90">Case-study sections</h3>
          <p className="mt-1 text-xs text-white/50">
            Har section left-nav mein ek item aur right side mein ek slide banata hai — jitne chahiye utne add karo, order up/down se badlo.
          </p>
        </div>

        {panels.length === 0 && <p className="rounded-lg border border-dashed border-white/15 p-4 text-white/50">Abhi koi section nahi hai. Neeche se add karo.</p>}

        {panels.map((p, i) => {
          const isOpen = !!expanded[p.uid];
          return (
            <div key={p.uid} className="rounded-lg border border-white/10 bg-[#111]">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="w-6 text-xs text-white/40">{i + 1}</span>
                <button type="button" onClick={() => toggle(p.uid)} className="flex-1 truncate text-left font-medium text-white">
                  {p.label || p.title || 'Untitled section'}
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal text-white/60">{TYPE_LABEL[p.type]}</span>
                </button>
                <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                <button type="button" className={btn} disabled={i === panels.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                <button type="button" className={btn} onClick={() => toggle(p.uid)}>{isOpen ? 'Close' : 'Edit'}</button>
                <button
                  type="button"
                  className="px-2 text-sm text-red-400"
                  onClick={() => confirm(`Delete section "${p.label || p.title || 'Untitled'}"?`) && setPanels((ps) => ps.filter((x) => x.uid !== p.uid))}
                >
                  Delete
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-white/10 p-4">
                  <PanelFields panel={p} update={(patchP) => updatePanel(p.uid, patchP)} />
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-white/20 p-3">
          <select className={`${inp} max-w-xs`} value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
            <optgroup label="Case-study sections (Figma)">
              {PANEL_PRESETS.map((p) => (
                <option key={p.preset} value={`preset:${p.preset}`}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Custom">
              {CUSTOM_TYPES.map((t) => (
                <option key={t.type} value={`type:${t.type}`}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          </select>
          <button type="button" onClick={addPanel} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
            + Add section
          </button>
        </div>
      </section>

      <SaveBar saving={saving} onSave={save} message={msg} />
    </div>
  );
}
