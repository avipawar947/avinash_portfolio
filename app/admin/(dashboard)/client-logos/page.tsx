'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import ImageUploader from '@/components/admin/ImageUploader';
import FormField from '@/components/admin/FormField';
import type { ClientLogoItem } from '@/types/content';

const EMPTY: Omit<ClientLogoItem, '_id'> = { name: '', logoUrl: '', logoPublicId: '', order: 0 };

export default function ClientLogosAdminPage() {
  const { data: items } = useSWR<ClientLogoItem[]>('/api/clientlogos', fetcher);
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);

  async function addLogo() {
    setAdding(true);
    try {
      await apiRequest('/api/clientlogos', 'POST', {
        ...draft,
        logoUrl: draft.logoUrl || '/brand/ap-logo.png',
        order: items?.length ?? 0,
      });
      setDraft(EMPTY);
      mutate('/api/clientlogos');
    } finally {
      setAdding(false);
    }
  }

  async function updateLogo(id: string, patch: Partial<ClientLogoItem>) {
    await apiRequest(`/api/clientlogos/${id}`, 'PUT', patch);
    mutate('/api/clientlogos');
  }

  async function deleteLogo(id: string) {
    if (!confirm('Delete this client logo?')) return;
    await apiRequest(`/api/clientlogos/${id}`, 'DELETE');
    mutate('/api/clientlogos');
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const [a, b] = [items[index], items[target]];
    await Promise.all([
      apiRequest(`/api/clientlogos/${a._id}`, 'PUT', { order: b.order }),
      apiRequest(`/api/clientlogos/${b._id}`, 'PUT', { order: a.order }),
    ]);
    mutate('/api/clientlogos');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-semibold">Client Logos (Marquee)</h1>
      <p className="mb-6 text-sm text-white/50">
        Shown as a scrolling strip on the homepage. Order = left-to-right.
      </p>

      <div className="space-y-4">
        {items?.map((logo, i) => (
          <div key={logo._id} className="rounded-xl border border-white/10 bg-[#0D0D0D] p-5">
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
                  value={logo.name}
                  onChange={(e) => updateLogo(logo._id, { name: e.target.value })}
                  placeholder="Client name"
                />
                <div className="flex items-end justify-between gap-4">
                  <ImageUploader
                    label="Logo"
                    value={logo.logoUrl || ''}
                    oldPublicId={logo.logoPublicId ?? ''}
                    onChange={(url, publicId) =>
                      updateLogo(logo._id, { logoUrl: url, logoPublicId: publicId ?? '' })
                    }
                  />
                  <button
                    onClick={() => deleteLogo(logo._id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-white/20 p-5">
        <p className="mb-3 text-sm font-medium text-white/70">Add a new client logo</p>
        <FormField label="Client name">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </FormField>
        <div className="mt-3">
          <ImageUploader
            label="Logo file"
            value={draft.logoUrl || ''}
            onChange={(url, publicId) => setDraft({ ...draft, logoUrl: url, logoPublicId: publicId ?? '' })}
          />
        </div>
        <button
          onClick={addLogo}
          disabled={adding || !draft.name}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add client'}
        </button>
      </div>
    </div>
  );
}