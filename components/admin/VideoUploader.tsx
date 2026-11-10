'use client';

import { useState } from 'react';

export default function VideoUploader({
  value,
  onChange,
  label = 'Video',
  oldPublicId = '',
}: {
  value: string;
  onChange: (url: string, publicId: string) => void;
  label?: string;
  oldPublicId?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (oldPublicId) fd.append('oldPublicId', oldPublicId);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) onChange(data.url, data.publicId);
      else alert(data.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      {value && (
        <video
          src={value}
          controls
          muted
          playsInline
          className="mb-2 h-36 w-full max-w-sm rounded-lg bg-black object-contain"
        />
      )}
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleFile}
        disabled={uploading}
        className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white"
      />
      {uploading && <p className="mt-1 text-xs text-white/40">Uploading to Cloudinary…</p>}
    </div>
  );
}
