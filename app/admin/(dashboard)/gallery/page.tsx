'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import ImageUploader from '@/components/admin/ImageUploader';
import type { GalleryImageItem } from '@/types/content';

const TILE_WIDTH = 287;

const EMPTY: Omit<GalleryImageItem, '_id'> = {
  imageUrl: '',
  imagePublicId: '',
  caption: '',
  left: 0,
  top: 0,
  height: 240,
  order: 0,
};

export default function GalleryAdminPage() {
  const { data: items, mutate: mutateItems } = useSWR<GalleryImageItem[]>('/api/gallery', fetcher);
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<GalleryImageItem>>({});
  const [saving, setSaving] = useState(false);

  async function addItem() {
    setAdding(true);
    try {
      await apiRequest('/api/gallery', 'POST', {
        ...draft,
        order: items?.length ?? 0,
      });
      setDraft(EMPTY);
      mutate('/api/gallery');
    } finally {
      setAdding(false);
    }
  }

  async function updateItem(id: string, patch: Partial<GalleryImageItem>) {
    await apiRequest(`/api/gallery/${id}`, 'PUT', patch);
    mutate('/api/gallery');
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this gallery image?')) return;
    await apiRequest(`/api/gallery/${id}`, 'DELETE');
    mutate('/api/gallery');
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const [a, b] = [items[index], items[target]];
    await Promise.all([
      apiRequest(`/api/gallery/${a._id}`, 'PUT', { order: b.order }),
      apiRequest(`/api/gallery/${b._id}`, 'PUT', { order: a.order }),
    ]);
    mutate('/api/gallery');
  }

  function startEdit(item: GalleryImageItem) {
    setEditId(item._id);
    setEditDraft({
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
      caption: item.caption,
      left: item.left,
      top: item.top,
      height: item.height,
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
      <h1 className="text-2xl font-semibold capitalize">Gallery</h1>
      <p className="max-w-lg text-sm text-white/50">
        8 tiles on a 299px pitch forming an arc. Width is constant 287px.
        Set the Cloudinary image URL + Figma left / top / height for each tile.
      </p>

      {/* Existing items */}
      {items?.map((item, i) => (
        <div
          key={item._id}
          className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-white/80">
              Tile {i + 1}
              {item.caption ? ` — ${item.caption}` : ''}
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
                label="Tile Image"
                onChange={(url, publicId) =>
                  setEditDraft((d) => ({ ...d, imageUrl: url, imagePublicId: publicId }))
                }
              />
              <FormField label="Caption">
                <input
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.caption ?? ''}
                  onChange={(e) => setEditDraft((d) => ({ ...d, caption: e.target.value }))}
                />
              </FormField>
              <FormField label="Left (Figma px)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.left ?? 0}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, left: Number(e.target.value) }))
                  }
                />
              </FormField>
              <FormField label="Top (Figma px)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.top ?? 0}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, top: Number(e.target.value) }))
                  }
                />
              </FormField>
              <FormField label={`Height (Figma px, width=${TILE_WIDTH})`}>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.height ?? 240}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, height: Number(e.target.value) }))
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
              <span className="text-xs text-white/40">
                left={item.left} top={item.top} h={item.height}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Add new */}
      <div className="rounded-lg border border-dashed border-white/20 p-4 space-y-4">
        <h2 className="text-lg font-medium text-white/80">Add Tile</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ImageUploader
            value={draft.imageUrl}
            onChange={(url, publicId) =>
              setDraft((d) => ({ ...d, imageUrl: url, imagePublicId: publicId }))
            }
            label="Tile Image"
          />
          <FormField label="Caption">
            <input
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.caption}
              onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
            />
          </FormField>
          <FormField label="Left (Figma px)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.left}
              onChange={(e) => setDraft((d) => ({ ...d, left: Number(e.target.value) }))}
            />
          </FormField>
          <FormField label="Top (Figma px)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.top}
              onChange={(e) => setDraft((d) => ({ ...d, top: Number(e.target.value) }))}
            />
          </FormField>
          <FormField label={`Height (Figma px, width=${TILE_WIDTH})`}>
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.height}
              onChange={(e) => setDraft((d) => ({ ...d, height: Number(e.target.value) }))}
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
