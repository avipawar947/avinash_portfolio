'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import SaveBar from '@/components/admin/SaveBar';
import ResumeUploader from '@/components/admin/ResumeUploader';
import type { SettingsContent } from '@/types/content';

export default function SettingsAdminPage() {
  const { data, isLoading } = useSWR<SettingsContent>('/api/settings', fetcher);
  const [form, setForm] = useState<SettingsContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await apiRequest('/api/settings', 'PUT', form);
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
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

      <div className="space-y-5 rounded-xl border border-white/10 p-5">
        <h2 className="text-lg font-semibold">Resume</h2>
        <p className="text-sm text-white/50">
          Upload the latest resume. PDF or image up to 5 MB — files are stored
          on Cloudinary and the Download Resume button uses this URL directly.
        </p>
        <ResumeUploader
          value={form.resumePdfUrl || ''}
          oldPublicId={form.resumePdfPublicId || ''}
          onChange={(url, publicId) =>
            setForm({ ...form, resumePdfUrl: url, resumePdfPublicId: publicId })
          }
        />
      </div>

      <div className="mt-8 space-y-5 rounded-xl border border-white/10 p-5">
        <h2 className="text-lg font-semibold">SEO</h2>
        <FormField label="SEO title">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            value={form.seoTitle || ''}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
          />
        </FormField>
        <FormField label="SEO description">
          <textarea
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            rows={3}
            value={form.seoDescription || ''}
            onChange={(e) =>
              setForm({ ...form, seoDescription: e.target.value })
            }
          />
        </FormField>
      </div>

      <SaveBar saving={saving} onSave={handleSave} message={message} />
    </div>
  );
}
