'use client';

import { useRef, useState } from 'react';

/** Client-side rules — mirrored on the server in app/api/upload/route.ts. */
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];
const ACCEPTED_EXT = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

export default function ResumeUploader({
  value,
  oldPublicId = '',
  onChange,
}: {
  /** Current Cloudinary URL. */
  value: string;
  /** Cloudinary publicId of the currently stored resume (for delete-on-replace). */
  oldPublicId?: string;
  onChange: (url: string, publicId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function validate(file: File): string | null {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ACCEPTED_MIME.includes(file.type) || !ACCEPTED_EXT.includes(ext)) {
      return 'Please choose a PDF or an image (JPG, PNG, WEBP, GIF, AVIF).';
    }
    if (file.size === 0) return 'That file is empty.';
    if (file.size > MAX_BYTES) return 'File is larger than 5 MB.';
    return null;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    if (inputRef.current) inputRef.current.value = '';
    if (!file) return;

    const problem = validate(file);
    if (problem) {
      setError(problem);
      return;
    }

    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kind', 'resume');
      if (oldPublicId) fd.append('oldPublicId', oldPublicId);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Upload failed. Please try again.');
        return;
      }
      if (!data.url || !data.publicId) {
        setError('Upload succeeded but no Cloudinary URL was returned.');
        return;
      }
      // Store the Cloudinary URL + publicId; the admin page saves these to Settings.
      onChange(data.url, data.publicId);
    } catch {
      setError('Network error while uploading. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const isPdf = value.toLowerCase().endsWith('.pdf');

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-white/70">
        Resume file (PDF or image, max 5 MB)
      </span>

      {value && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg">
            {isPdf ? '📄' : '🖼️'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white/80">
              {isPdf ? 'Resume PDF' : 'Resume image'} uploaded
            </p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-xs text-white/40 underline underline-offset-2 hover:text-white/70"
            >
              {value}
            </a>
          </div>
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            Remove
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp,image/gif,image/avif,.pdf,.jpg,.jpeg,.png,.webp,.gif,.avif"
        onChange={handleFile}
        disabled={uploading}
        className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white"
      />

      {uploading && (
        <p className="mt-1 text-xs text-white/40">Uploading to Cloudinary…</p>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
