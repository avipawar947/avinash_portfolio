'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import ImageUploader from '@/components/admin/ImageUploader';
import type { ToolItem } from '@/types/content';

const TILE = 94;

const EMPTY: Omit<ToolItem, '_id'> = {
  name: '',
  iconKey: '',
  iconUrl: '',
  iconPublicId: '',
  left: 0,
  top: 0,
  iconSize: 60,
  iconLeft: 17,
  iconTop: 17,
  order: 0,
};

export default function ToolsAdminPage() {
  const { data: items, mutate: mutateItems } = useSWR<ToolItem[]>(
    '/api/tools',
    fetcher,
  );
  const [draft, setDraft] = useState({ ...EMPTY });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<ToolItem>>({});
  const [saving, setSaving] = useState(false);

  async function addItem() {
    setAdding(true);
    try {
      await apiRequest('/api/tools', 'POST', {
        ...draft,
        order: items?.length ?? 0,
      });
      setDraft({ ...EMPTY });
      mutate('/api/tools');
    } finally {
      setAdding(false);
    }
  }

  async function updateItem(id: string, patch: Partial<ToolItem>) {
    await apiRequest(`/api/tools/${id}`, 'PUT', patch);
    mutate('/api/tools');
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this tool?')) return;
    await apiRequest(`/api/tools/${id}`, 'DELETE');
    mutate('/api/tools');
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const [a, b] = [items[index], items[target]];
    await Promise.all([
      apiRequest(`/api/tools/${a._id}`, 'PUT', { order: b.order }),
      apiRequest(`/api/tools/${b._id}`, 'PUT', { order: a.order }),
    ]);
    mutate('/api/tools');
  }

  function startEdit(item: ToolItem) {
    setEditId(item._id);
    setEditDraft({
      name: item.name,
      iconKey: item.iconKey,
      iconUrl: item.iconUrl,
      iconPublicId: item.iconPublicId,
      left: item.left,
      top: item.top,
      iconSize: item.iconSize,
      iconLeft: item.iconLeft,
      iconTop: item.iconTop,
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
      <h1 className="text-2xl font-semibold capitalize">Tools</h1>
      <p className="max-w-lg text-sm text-white/50">
        10 tiles in a constellation plot (1416 x 485). Each tile is{' '}
        {TILE}px. Set the icon image, constellation position (left/top)
        and glyph box (iconSize / iconLeft / iconTop) from the Figma
        design.
      </p>

      {/* Existing items */}
      {items?.map((item, i) => (
        <div
          key={item._id}
          className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-white/80">
              {i + 1}. {item.name}
              <span className="ml-2 text-xs text-white/30">
                ({item.iconKey})
              </span>
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
                onClick={() =>
                  editId === item._id ? setEditId(null) : startEdit(item)
                }
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
              <FormField label="Name">
                <input
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.name ?? ''}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, name: e.target.value }))
                  }
                />
              </FormField>
              <FormField label="Icon Key (local SVG slug)">
                <input
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.iconKey ?? ''}
                  placeholder="figma"
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, iconKey: e.target.value }))
                  }
                />
              </FormField>
              <ImageUploader
                value={editDraft.iconUrl ?? ''}
                oldPublicId={item.iconPublicId ?? ''}
                label="Icon Image (overrides key)"
                onChange={(url, publicId) =>
                  setEditDraft((d) => ({
                    ...d,
                    iconUrl: url,
                    iconPublicId: publicId,
                  }))
                }
              />
              <FormField label="Left (Figma px in 1416 plot)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.left ?? 0}
                  onChange={(e) =>
                    setEditDraft((d) => ({
                      ...d,
                      left: Number(e.target.value),
                    }))
                  }
                />
              </FormField>
              <FormField label="Top (Figma px)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.top ?? 0}
                  onChange={(e) =>
                    setEditDraft((d) => ({
                      ...d,
                      top: Number(e.target.value),
                    }))
                  }
                />
              </FormField>
              <FormField label="Icon size (px in tile)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.iconSize ?? 60}
                  onChange={(e) =>
                    setEditDraft((d) => ({
                      ...d,
                      iconSize: Number(e.target.value),
                    }))
                  }
                />
              </FormField>
              <FormField label="Icon left offset (px)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.iconLeft ?? 17}
                  onChange={(e) =>
                    setEditDraft((d) => ({
                      ...d,
                      iconLeft: Number(e.target.value),
                    }))
                  }
                />
              </FormField>
              <FormField label="Icon top offset (px)">
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={editDraft.iconTop ?? 17}
                  onChange={(e) =>
                    setEditDraft((d) => ({
                      ...d,
                      iconTop: Number(e.target.value),
                    }))
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
              {item.iconUrl || item.iconKey ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.iconUrl || `/icons/tools/${item.iconKey}.svg`}
                  alt={item.name}
                  className="h-16 w-16 rounded object-cover bg-white/5"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-white/10 text-xs text-white/30">
                  No icon
                </div>
              )}
              <span className="text-xs text-white/40">
                left={item.left} top={item.top} icon={item.iconSize}×
                {item.iconSize}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Add new */}
      <div className="rounded-lg border border-dashed border-white/20 p-4 space-y-4">
        <h2 className="text-lg font-medium text-white/80">Add Tool</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Name">
            <input
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
            />
          </FormField>
          <FormField label="Icon Key (local SVG slug)">
            <input
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.iconKey}
              placeholder="figma"
              onChange={(e) =>
                setDraft((d) => ({ ...d, iconKey: e.target.value }))
              }
            />
          </FormField>
          <ImageUploader
            value={draft.iconUrl}
            onChange={(url, publicId) =>
              setDraft((d) => ({
                ...d,
                iconUrl: url,
                iconPublicId: publicId,
              }))
            }
            label="Icon Image (overrides key)"
          />
          <FormField label="Left (Figma px in 1416 plot)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.left}
              onChange={(e) =>
                setDraft((d) => ({ ...d, left: Number(e.target.value) }))
              }
            />
          </FormField>
          <FormField label="Top (Figma px)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.top}
              onChange={(e) =>
                setDraft((d) => ({ ...d, top: Number(e.target.value) }))
              }
            />
          </FormField>
          <FormField label="Icon size (px in tile)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.iconSize}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  iconSize: Number(e.target.value),
                }))
              }
            />
          </FormField>
          <FormField label="Icon left offset (px)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.iconLeft}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  iconLeft: Number(e.target.value),
                }))
              }
            />
          </FormField>
          <FormField label="Icon top offset (px)">
            <input
              type="number"
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              value={draft.iconTop}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  iconTop: Number(e.target.value),
                }))
              }
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
