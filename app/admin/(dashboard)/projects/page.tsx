'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import ImageUploader from '@/components/admin/ImageUploader';
import FormField from '@/components/admin/FormField';
import type { ProjectItem } from '@/types/content';

const EMPTY: Omit<ProjectItem, '_id'> = {
  title: '',
  tag: 'Case Study',
  imageUrl: '',
  imagePublicId: '',
  link: '',
  order: 0,
};

export default function ProjectsAdminPage() {
  const { data: items } = useSWR<ProjectItem[]>('/api/projects', fetcher);
  const [draft, setDraft] = useState(EMPTY);
  const [adding, setAdding] = useState(false);

  async function addProject() {
    setAdding(true);
    try {
      await apiRequest('/api/projects', 'POST', { ...draft, order: items?.length ?? 0 });
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

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    await apiRequest(`/api/projects/${id}`, 'DELETE');
    mutate('/api/projects');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Projects</h1>

      <div className="space-y-4">
        {items?.map((p) => (
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
                value={p.link}
                onChange={(e) => updateProject(p._id, { link: e.target.value })}
                placeholder="Project link"
              />
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <ImageUploader
                label="Cover image"
                value={p.imageUrl}
                oldPublicId={p.imagePublicId ?? ''}
                onChange={(url, publicId) =>
                  updateProject(p._id, { imageUrl: url, imagePublicId: publicId ?? '' })
                }
              />
              <button onClick={() => deleteProject(p._id)} className="text-sm text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-white/20 p-5">
        <p className="mb-3 text-sm font-medium text-white/70">Add a new project</p>
        <FormField label="Title">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </FormField>
        <button
          onClick={addProject}
          disabled={adding || !draft.title}
          className="mt-3 rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add project'}
        </button>
      </div>
    </div>
  );
}
