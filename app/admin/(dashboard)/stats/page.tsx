'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import type { StatItem, WhyChooseMeContent } from '@/types/content';

const EMPTY: Omit<StatItem, '_id'> = {
  label: '',
  value: '0',
  suffix: '+',
  column: 1,
  order: 0,
};

export default function StatsAdminPage() {
  const { data: items } = useSWR<StatItem[]>('/api/stats', fetcher);
  const { data: config, mutate: mutateConfig } = useSWR<WhyChooseMeContent>(
    '/api/why-choose-me',
    fetcher,
  );
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  async function addStat() {
    setAdding(true);
    try {
      await apiRequest('/api/stats', 'POST', {
        ...draft,
        order: items?.length ?? 0,
      });
      setDraft(EMPTY);
      mutate('/api/stats');
    } finally {
      setAdding(false);
    }
  }

  async function updateStat(id: string, patch: Partial<StatItem>) {
    await apiRequest(`/api/stats/${id}`, 'PUT', patch);
    mutate('/api/stats');
  }

  async function deleteStat(id: string) {
    if (!confirm('Delete this stat card?')) return;
    await apiRequest(`/api/stats/${id}`, 'DELETE');
    mutate('/api/stats');
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const [a, b] = [items[index], items[target]];
    await Promise.all([
      apiRequest(`/api/stats/${a._id}`, 'PUT', { order: b.order }),
      apiRequest(`/api/stats/${b._id}`, 'PUT', { order: a.order }),
    ]);
    mutate('/api/stats');
  }

  async function saveConfig(next: WhyChooseMeContent) {
    const body = { ...config, ...next };
    await apiRequest('/api/why-choose-me', 'PUT', body);
    mutateConfig(body, false);
  }

  async function addBar() {
    const projectMix = [...(config?.projectMix ?? []), { label: 'New bar', width: 200 }];
    await saveConfig({ ...(config ?? { domains: [] }), projectMix });
  }

  async function updateBar(index: number, patch: Partial<{ label: string; width: number }>) {
    const projectMix = [...(config?.projectMix ?? [])];
    projectMix[index] = { ...projectMix[index], ...patch };
    await saveConfig({ ...(config ?? { domains: [] }), projectMix });
  }

  async function deleteBar(index: number) {
    const projectMix = [...(config?.projectMix ?? [])];
    projectMix.splice(index, 1);
    await saveConfig({ ...(config ?? { domains: [] }), projectMix });
  }

  async function addDomain() {
    const value = newDomain.trim();
    if (!value) return;
    const domains = [...(config?.domains ?? []), value];
    await saveConfig({ ...(config ?? { projectMix: [] }), domains });
    setNewDomain('');
  }

  async function updateDomain(index: number, value: string) {
    const domains = [...(config?.domains ?? [])];
    domains[index] = value;
    await saveConfig({ ...(config ?? { projectMix: [] }), domains });
  }

  async function deleteDomain(index: number) {
    const domains = [...(config?.domains ?? [])];
    domains.splice(index, 1);
    await saveConfig({ ...(config ?? { projectMix: [] }), domains });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-semibold">Stats — Why Choose Me</h1>
      <p className="mb-6 text-sm text-white/50">
        Left and right columns are chosen per card; the middle column holds the bar chart and
        domains. Order = column top-to-bottom.
      </p>

      {/* Figure cards */}
      <h2 className="mb-3 text-lg font-semibold">Figure cards</h2>
      <div className="space-y-4">
        {items?.map((stat, i) => (
          <div key={stat._id} className="rounded-xl border border-white/10 bg-[#0D0D0D] p-5">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-white/60 hover:text-white disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={!items || i === items.length - 1}
                  aria-label="Move down"
                  className="rounded border border-white/15 px-1.5 py-0.5 text-xs text-white/60 hover:text-white disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1 space-y-3">
                <input
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                  value={stat.label}
                  onChange={(e) => updateStat(stat._id, { label: e.target.value })}
                  placeholder="Label"
                />
                <input
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                  value={stat.labelMuted ?? ''}
                  onChange={(e) => updateStat(stat._id, { labelMuted: e.target.value })}
                  placeholder="Second label line (flat, muted) — optional"
                />
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex flex-col gap-1 text-xs text-white/60">
                    Value
                    <input
                      className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                      value={stat.value}
                      onChange={(e) => updateStat(stat._id, { value: e.target.value })}
                      placeholder="04"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-white/60">
                    Suffix
                    <input
                      className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                      value={stat.suffix}
                      onChange={(e) => updateStat(stat._id, { suffix: e.target.value })}
                      placeholder="+"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-white/60">
                    Column
                    <select
                      className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                      value={stat.column ?? 1}
                      onChange={(e) =>
                        updateStat(stat._id, { column: Number(e.target.value) as 1 | 3 })
                      }
                    >
                      <option value={1}>1 (left)</option>
                      <option value={3}>3 (right)</option>
                    </select>
                  </label>
                </div>
              </div>

              <button
                onClick={() => deleteStat(stat._id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-white/20 p-5">
        <p className="mb-3 text-sm font-medium text-white/70">Add a new stat card</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Label">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </FormField>
          <FormField label="Second line (flat, muted) — optional">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
              value={draft.labelMuted ?? ''}
              onChange={(e) => setDraft({ ...draft, labelMuted: e.target.value })}
            />
          </FormField>
          <FormField label="Value">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
              value={draft.value}
              onChange={(e) => setDraft({ ...draft, value: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Suffix">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={draft.suffix}
                onChange={(e) => setDraft({ ...draft, suffix: e.target.value })}
              />
            </FormField>
            <FormField label="Column">
              <select
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={draft.column}
                onChange={(e) => setDraft({ ...draft, column: Number(e.target.value) as 1 | 3 })}
              >
                <option value={1}>1 (left)</option>
                <option value={3}>3 (right)</option>
              </select>
            </FormField>
          </div>
        </div>
        <button
          onClick={addStat}
          disabled={adding || !draft.label}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add stat card'}
        </button>
      </div>

      {/* Bar chart */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">On Average Projects (bar chart)</h2>
          <button
            onClick={addBar}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/70 hover:text-white"
          >
            + Add bar
          </button>
        </div>
        <p className="mb-3 mt-1 text-sm text-white/50">
          Width is the bar's pixel width against a 447px axis labelled 0–100.
        </p>
        <div className="space-y-2">
          {(config?.projectMix ?? []).map((bar, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] p-3"
            >
              <input
                className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={bar.label}
                onChange={(e) => updateBar(i, { label: e.target.value })}
                placeholder="Bar label"
              />
              <label className="flex items-center gap-1 text-xs text-white/60">
                Width
                <input
                  type="number"
                  min={0}
                  className="w-20 rounded-lg border border-white/10 bg-black px-2 py-1.5 text-sm"
                  value={bar.width}
                  onChange={(e) => updateBar(i, { width: Number(e.target.value) })}
                />
              </label>
              <button
                onClick={() => deleteBar(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Domains */}
      <div className="mt-10">
        <h2 className="mb-1 text-lg font-semibold">Domains worked across</h2>
        <p className="mb-3 text-sm text-white/50">
          Shown as gradient labels on one row, separated by dots.
        </p>
        <div className="space-y-2">
          {(config?.domains ?? []).map((domain, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] p-3"
            >
              <input
                className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                value={domain}
                onChange={(e) => updateDomain(i, e.target.value)}
              />
              <button
                onClick={() => deleteDomain(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDomain()}
            placeholder="Add a domain, e.g. FinTech"
          />
          <button
            onClick={addDomain}
            disabled={!newDomain.trim()}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}