'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import SaveBar from '@/components/admin/SaveBar';
import ImageUploader from '@/components/admin/ImageUploader';
import type { ContactCTAContent, ContactCTATab } from '@/types/content';

const DEFAULT_TABS: ContactCTATab[] = [
  { label: 'Desktop', imageUrl: '' },
  { label: 'Mobile', imageUrl: '' },
  { label: 'Tablet', imageUrl: '' },
];

export default function ContactAdminPage() {
  const { data, isLoading } = useSWR<ContactCTAContent>(
    '/api/contact-cta',
    fetcher
  );
  const [form, setForm] = useState<ContactCTAContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) {
      setForm({
        tabs:
          data.tabs?.length && data.tabs.every((t) => t.label)
            ? data.tabs
            : DEFAULT_TABS,
      });
    }
  }, [data]);

  function updateTab(index: number, patch: Partial<ContactCTATab>) {
    setForm((f) => {
      if (!f) return f;
      const tabs = f.tabs.map((t, i) => (i === index ? { ...t, ...patch } : t));
      return { ...f, tabs };
    });
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await apiRequest('/api/contact-cta', 'PUT', form);
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
      <h1 className="mb-6 text-2xl font-semibold">Contact CTA — Device Tabs</h1>
      <p className="mb-6 text-sm text-white/50">
        Each tab swaps the mockup image shown next to &ldquo;Let&rsquo;s
        Talk&rdquo;. Upload one image per device.
      </p>

      <div className="space-y-8">
        {form.tabs.map((tab, i) => (
          <div
            key={`${tab.label}-${i}`}
            className="space-y-4 rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-semibold">Tab {i + 1}</h2>
            <FormField label="Tab label">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
                value={tab.label}
                onChange={(e) => updateTab(i, { label: e.target.value })}
              />
            </FormField>
            <ImageUploader
              label={`${tab.label} mockup image`}
              value={tab.imageUrl}
              oldPublicId={tab.imagePublicId ?? ''}
              onChange={(url, publicId) =>
                updateTab(i, { imageUrl: url, imagePublicId: publicId ?? '' })
              }
            />
          </div>
        ))}
      </div>

      <SaveBar saving={saving} onSave={handleSave} message={message} />
    </div>
  );
}