'use client';

import useSWR, { mutate } from 'swr';
import { useState, useEffect } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import type { ProcessStepItem, ProcessIntroContent } from '@/types/content';

const PHASES = ['Discover', 'Define', 'Deliver'] as const;

const EMPTY: Omit<ProcessStepItem, '_id'> = {
  phase: 'Discover',
  label: '',
  left: 0,
  top: 0,
  width: 420,
  from: 55,
  order: 0,
};

export default function ProcessAdminPage() {
  const { data: items } = useSWR<ProcessStepItem[]>('/api/process', fetcher);
  const { data: intro, mutate: mutateIntro } = useSWR<ProcessIntroContent>(
    '/api/process-intro',
    fetcher,
  );
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [introForm, setIntroForm] = useState<ProcessIntroContent | null>(null);
  const [introSaving, setIntroSaving] = useState(false);
  const [introMsg, setIntroMsg] = useState('');

  useEffect(() => {
    if (intro) setIntroForm(intro);
  }, [intro]);

  // --- Steps ---

  async function addStep() {
    setAdding(true);
    try {
      const samePhase = items?.filter((s) => s.phase === draft.phase) ?? [];
      await apiRequest('/api/process', 'POST', {
        ...draft,
        order: samePhase.length,
      });
      setDraft(EMPTY);
      mutate('/api/process');
    } finally {
      setAdding(false);
    }
  }

  async function updateStep(id: string, patch: Partial<ProcessStepItem>) {
    await apiRequest(`/api/process/${id}`, 'PUT', patch);
    mutate('/api/process');
  }

  async function deleteStep(id: string) {
    if (!confirm('Delete this step?')) return;
    await apiRequest(`/api/process/${id}`, 'DELETE');
    mutate('/api/process');
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const [a, b] = [items[index], items[target]];
    await Promise.all([
      apiRequest(`/api/process/${a._id}`, 'PUT', { order: b.order }),
      apiRequest(`/api/process/${b._id}`, 'PUT', { order: a.order }),
    ]);
    mutate('/api/process');
  }

  // --- Intro ---

  async function saveIntro() {
    if (!introForm) return;
    setIntroSaving(true);
    try {
      await apiRequest('/api/process-intro', 'PUT', introForm);
      mutateIntro(introForm, false);
      setIntroMsg('Saved');
    } catch (e) {
      setIntroMsg((e as Error).message);
    } finally {
      setIntroSaving(false);
      setTimeout(() => setIntroMsg(''), 3000);
    }
  }

  const grouped = PHASES.map((p) => ({
    phase: p,
    steps: (items ?? [])
      .filter((s) => s.phase === p)
      .sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-2xl font-semibold">Process — How I Work</h1>
      <p className="mb-6 text-sm text-white/50">
        Desktop pills are positioned absolutely inside a fixed-size table. Left / top / width are Figma px
        from the table's top-left corner (1640 × 645). The gradient white-stop (%) keeps the fade land consistent.
      </p>

      {/* Intro copy */}
      <h2 className="mb-2 text-lg font-semibold">Intro copy</h2>
      <div className="mb-8 rounded-xl border border-white/10 bg-[#0D0D0D] p-5">
        <FormField label="Heading (gradient)">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
            value={introForm?.heading ?? ''}
            onChange={(e) => setIntroForm((f) => f && { ...f, heading: e.target.value })}
          />
        </FormField>
        <div className="mt-3">
          <FormField label="Lead (gradient)">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
              value={introForm?.lead ?? ''}
              onChange={(e) => setIntroForm((f) => f && { ...f, lead: e.target.value })}
            />
          </FormField>
        </div>
        <div className="mt-3">
          <FormField label="Muted lines (one per line)">
            {(introForm?.rest ?? []).map((line, i) => (
              <input
                key={i}
                className="mb-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={line}
                onChange={(e) => {
                  if (!introForm) return;
                  const rest = [...introForm.rest];
                  rest[i] = e.target.value;
                  setIntroForm({ ...introForm, rest });
                }}
              />
            ))}
            <button
              onClick={() =>
                setIntroForm((f) => f && { ...f, rest: [...f.rest, ''] })
              }
              className="mt-1 rounded border border-white/15 px-3 py-1 text-xs text-white/60 hover:text-white"
            >
              + Add line
            </button>
          </FormField>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={saveIntro}
            disabled={introSaving || !introForm}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {introSaving ? 'Saving…' : 'Save intro'}
          </button>
          {introMsg && <span className="text-sm text-green-400">{introMsg}</span>}
        </div>
      </div>

      {/* Steps by phase */}
      {grouped.map(({ phase, steps }) => (
        <div key={phase} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">{phase}</h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={step._id}
                className="rounded-xl border border-white/10 bg-[#0D0D0D] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        const globalIndex = items?.findIndex((s) => s._id === step._id) ?? -1;
                        move(globalIndex, -1);
                      }}
                      disabled={i === 0 && phase === 'Discover'}
                      aria-label="Move up"
                      className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-white/60 hover:text-white disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => {
                        const globalIndex = items?.findIndex((s) => s._id === step._id) ?? -1;
                        move(globalIndex, 1);
                      }}
                      disabled={!items || (i === steps.length - 1 && phase === 'Deliver')}
                      aria-label="Move down"
                      className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-white/60 hover:text-white disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                      value={step.label}
                      onChange={(e) => updateStep(step._id, { label: e.target.value })}
                      placeholder="Step label"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      <label className="flex flex-col gap-1 text-xs text-white/60">
                        Left
                        <input
                          type="number"
                          className="rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm"
                          value={step.left}
                          onChange={(e) => updateStep(step._id, { left: Number(e.target.value) })}
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-white/60">
                        Top
                        <input
                          type="number"
                          className="rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm"
                          value={step.top}
                          onChange={(e) => updateStep(step._id, { top: Number(e.target.value) })}
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-white/60">
                        Width
                        <input
                          type="number"
                          className="rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm"
                          value={step.width}
                          onChange={(e) => updateStep(step._id, { width: Number(e.target.value) })}
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-white/60">
                        From %
                        <input
                          type="number"
                          step="0.01"
                          className="rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm"
                          value={step.from}
                          onChange={(e) => updateStep(step._id, { from: Number(e.target.value) })}
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteStep(step._id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 rounded-xl border border-dashed border-white/20 p-5">
        <p className="mb-3 text-sm font-medium text-white/70">Add a new step</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phase">
            <select
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
              value={draft.phase}
              onChange={(e) => setDraft({ ...draft, phase: e.target.value as ProcessStepItem['phase'] })}
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Label">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </FormField>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          <FormField label="Left (px)">
            <input type="number" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.left} onChange={(e) => setDraft({ ...draft, left: Number(e.target.value) })} />
          </FormField>
          <FormField label="Top (px)">
            <input type="number" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.top} onChange={(e) => setDraft({ ...draft, top: Number(e.target.value) })} />
          </FormField>
          <FormField label="Width (px)">
            <input type="number" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.width} onChange={(e) => setDraft({ ...draft, width: Number(e.target.value) })} />
          </FormField>
          <FormField label="Gradient from %">
            <input type="number" step="0.01" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm" value={draft.from} onChange={(e) => setDraft({ ...draft, from: Number(e.target.value) })} />
          </FormField>
        </div>
        <button
          onClick={addStep}
          disabled={adding || !draft.label}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add step'}
        </button>
      </div>
    </div>
  );
}