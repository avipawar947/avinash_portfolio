'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import SaveBar from '@/components/admin/SaveBar';
import ImageUploader from '@/components/admin/ImageUploader';
import type { HeroContent } from '@/types/content';

export default function HeroAdminPage() {
  const { data, isLoading } = useSWR<HeroContent>('/api/hero', fetcher);
  const [form, setForm] = useState<HeroContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await apiRequest('/api/hero', 'PUT', form);
      setMessage('Saved — live site updated.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (isLoading || !form) return <p className="text-white/50">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Hero Section</h1>
      <div className="space-y-5">
        <FormField label="Name">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tagline (top word)">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
              value={form.taglineTop}
              onChange={(e) => setForm({ ...form, taglineTop: e.target.value })}
            />
          </FormField>
          <FormField label="Tagline (bottom word)">
            <input
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
              value={form.taglineBottom}
              onChange={(e) => setForm({ ...form, taglineBottom: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Badge text (e.g. 'Hello, My Name Is')">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            value={form.badgeText}
            onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
          />
        </FormField>

        <FormField label="Status text (e.g. 'Open to Work')">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            value={form.statusText}
            onChange={(e) => setForm({ ...form, statusText: e.target.value })}
          />
        </FormField>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.statusActive}
            onChange={(e) => setForm({ ...form, statusActive: e.target.checked })}
          />
          Show status badge
        </label>

        <ImageUploader
          label="Character cutout image"
          value={form.characterImageUrl}
          oldPublicId={form.characterImagePublicId ?? ''}
          onChange={(url, publicId) =>
            setForm({ ...form, characterImageUrl: url, characterImagePublicId: publicId ?? '' })
          }
        />
      </div>
      <SaveBar saving={saving} onSave={handleSave} message={message} />
    </div>
  );
}
