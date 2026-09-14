'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { fetcher, apiRequest } from '@/lib/fetcher';
import FormField from '@/components/admin/FormField';
import SaveBar from '@/components/admin/SaveBar';
import ImageUploader from '@/components/admin/ImageUploader';
import type { FooterContent, SocialLink } from '@/types/content';

const PLATFORM_PRESETS: SocialLink[] = [
  { platform: 'linkedin', url: '#' },
  { platform: 'behance', url: '#' },
  { platform: 'gmail', url: 'mailto:hello@example.com' },
];

export default function FooterAdminPage() {
  const { data, isLoading } = useSWR<FooterContent>('/api/footer', fetcher);
  const [form, setForm] = useState<FooterContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await apiRequest('/api/footer', 'PUT', form);
      setMessage('Saved — live site updated.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  // Ensure the three Figma slots exist so uploaders are always visible.
  const socialLinks = form?.socialLinks ?? [];
  const slots: SocialLink[] = PLATFORM_PRESETS.map((preset) => {
    const existing = socialLinks.find((s) => s.platform === preset.platform);
    return existing ? { ...preset, ...existing } : preset;
  });

  function updateSlot(index: number, patch: Partial<SocialLink>) {
    if (!form) return;
    const next = [...slots];
    next[index] = { ...next[index], ...patch };
    setForm({ ...form, socialLinks: next });
  }

  if (isLoading || !form) return <p className="text-white/50">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Footer Section</h1>
      <div className="space-y-5">
        <FormField label="Copyright text">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            value={form.copyrightText}
            onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
          />
        </FormField>

        <FormField label="Location (e.g. 'Mumbai, India')">
          <input
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </FormField>

        <FormField label="Role tags (one per line, shown with dots)">
          <textarea
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
            rows={3}
            value={form.roleTags.join('\n')}
            onChange={(e) =>
              setForm({
                ...form,
                roleTags: e.target.value.split('\n').filter(Boolean),
              })
            }
          />
        </FormField>

        <div className="space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm font-medium text-white/70">Social icons</p>
          {slots.map((slot, i) => (
            <div key={slot.platform} className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                {slot.platform}
              </p>
              <FormField label="Icon image (replaces built-in SVG glyph)">
                <ImageUploader
                  value={slot.iconUrl ?? ''}
                  oldPublicId={slot.iconPublicId ?? ''}
                  onChange={(url, publicId) =>
                    updateSlot(i, { iconUrl: url, iconPublicId: publicId })
                  }
                />
              </FormField>
              <FormField label="Link URL">
                <input
                  className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm"
                  value={slot.url}
                  onChange={(e) => updateSlot(i, { url: e.target.value })}
                />
              </FormField>
            </div>
          ))}
        </div>
      </div>
      <SaveBar saving={saving} onSave={handleSave} message={message} />
    </div>
  );
}