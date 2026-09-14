'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import ImageUploader from '@/components/admin/ImageUploader';
import type { LifeBehindTextItemContent } from '@/types/content';

const EMPTY: Omit<LifeBehindTextItemContent, '_id'> = {
  imageUrl: '',
  imagePublicId: '',
  order: 0,
};

export default function LifeBehindTextAdminPage() {
  const { data: items, mutate: mutateItems } = useSWR<LifeBehindTextItemContent[]>(
    '/api/life-behind-text',
    fetcher,
  );
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<LifeBehindTextItemContent>>({});
  const [saving, setSaving] = useState(false);

  async function addItem() {
    setAdding(true);
    try {
      await apiRequest('/api/life-behind-text', 'POST', {
        ...draft,
        order: items?.length ?? 0,
      });
      setDraft(EMPTY);
      mutate('/api/life-behind-text');
    } finally {
      setAdding(false);
    }
  }

  async function updateItem(id: string, patch: Partial<LifeBehindTextItemContent>) {
    await apiRequest(`/api/life-behind-text/${id}`, 'PUT', patch);
    mutate('/api/life-behind-text');
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this image?')) return;
    await apiRequest(`/api/life-behind-text/${id}`, 'DELETE');
    mutate('/api/life-behind-text');
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const [a, b] = [items[index], items[target]];
    await Promise.all([
      apiRequest(`/api/life-behind-text/${a._id}`, 'PUT', { order: b.order }),
      apiRequest(`/api/life-behind-text/${b._id}`, 'PUT', { order: a.order }),
    ]);
    mutate('/api/life-behind-text');
  }

  function startEdit(item: LifeBehindTextItemContent) {
    setEditId(item._id);
    setEditDraft({
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
      order: item.order,
    });
  }

  async function saveEdit() {
    if (!editId) return;
    setSaving(true);
    try {
      await updateItem(editId, editDraft);
      setEditId(null);
      setEditDraft({});
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold capitalize">Life Behind Text</h1>
      <p className="max-w-lg text-sm text-white/50">
        Film-strip marquee with 380×372 cards on a 416px pitch. Upload
        personal snapshots — each becomes a film-frame card with sprocket
        strips on both sides.
      </p>

      {/* Existing items */}
      {items?.map((item, i) => (
        <div
          key={item._id}
          className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-white/80">
              Card {i + 1}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items!.length - 1}
                className="rounded bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-30"
              >
                ▼
              </button>
              <button
                onClick={() => (editId === item._id ? setEditId(null) : startEdit(item))}
                className="rounded bg-white/10 px-3 py-1 text-xs text-white"
              >
                {editId === item._id ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="rounded bg-red-500/20 px-3 py-1 text-xs text-red-400"
              >
                Delete
              </button>
            </div>
          </div>

          {editId === item._id ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ImageUploader
                value={editDraft.imageUrl ?? ''}
                oldPublicId={item.imagePublicId ?? ''}
                label="Snapshot Image"
                onChange={(url, publicId) =>
                  setEditDraft((d) => ({ ...d, imageUrl: url, imagePublicId: publicId }))
                }
              />
              <FormField label="Order">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.order ?? 0}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, order: Number(e.target.value) }))
                  }
                />
              </FormField>
              <div className="flex items-end">
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="rounded bg-white/10 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-white/10 text-xs text-white/30">
                  No img
                </div>
              )}
              <span className="text-xs text-white/40">order={item.order}</span>
            </div>
          )}
        </div>
      ))}

      {/* Add new */}
      <div className="rounded-lg border border-dashed border-white/20 p-4 space-y-4">
        <h2 className="text-lg font-medium text-white/80">Add Snapshot</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ImageUploader
            value={draft.imageUrl}
            onChange={(url, publicId) =>
              setDraft((d) => ({ ...d, imageUrl: url, imagePublicId: publicId }))
            }
            label="Snapshot Image"
          />
          <FormField label="Order">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.order}
              onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}
            />
          </FormField>
          <div className="flex items-end">
            <button
              onClick={addItem}
              disabled={adding}
              className="rounded bg-white/10 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {adding ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
