import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

// Enforced upload limits (configurable via .env.local if needed).
const MAX_IMAGE_BYTES = Number(process.env.CLOUDINARY_MAX_IMAGE_MB || 10) * 1024 * 1024; // 10 MB
const MAX_PDF_BYTES = Number(process.env.CLOUDINARY_MAX_PDF_MB || 15) * 1024 * 1024; // 15 MB
const MAX_VIDEO_BYTES = Number(process.env.CLOUDINARY_MAX_VIDEO_MB || 100) * 1024 * 1024; // 100 MB

// Resume uploads are strictly capped at 5 MB (PDF or raster image).
const MAX_RESUME_BYTES =
  Number(process.env.CLOUDINARY_MAX_RESUME_MB || 5) * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);
/** Raster image types accepted as a resume (SVG is excluded — not a resume format). */
const RESUME_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const PDF_TYPE = 'application/pdf';
const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
]);

function humanSize(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

/** File signatures used to confirm the bytes really are what the MIME says. */
const SIGNATURES: { type: string; bytes: number[] }[] = [
  { type: PDF_TYPE, bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { type: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { type: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
  { type: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF (WebP has WEBP at byte 8)
];

/** Returns the real type from the file header, or null when unrecognised. */
function sniffType(buffer: Uint8Array, declared: string): string | null {
  if (declared === 'image/svg+xml') {
    // SVG is XML — check the opening bytes for an <svg tag (after optional BOM/whitespace).
    const head = new TextDecoder().decode(buffer.slice(0, 512)).trimStart();
    return head.startsWith('<svg') || head.startsWith('<?xml') ? 'image/svg+xml' : null;
  }
  for (const { type, bytes } of SIGNATURES) {
    if (bytes.every((b, i) => buffer[i] === b)) {
      if (type === 'image/webp') {
        // RIFF container — confirm the WEBP marker at offset 8.
        const marker = String.fromCharCode(...buffer.slice(8, 12));
        if (marker !== 'WEBP') continue;
      }
      return type;
    }
  }
  return null;
}

/**
 * Accepts a multipart form with:
 *   - "file"        (image OR the resume PDF) -> uploaded to Cloudinary
 *   - "kind"        "resume" enables strict resume validation (PDF/image, 5 MB)
 *   - "oldPublicId" (optional)                 -> deleted after a successful
 *                                                  upload so replaced assets
 *                                                  never stay orphaned
 * Returns { url, publicId }. The caller (admin form) then saves those onto the
 * relevant MongoDB document. Uploads always go through Cloudinary, so the
 * returned URL is a Cloudinary URL.
 */
export const POST = withAdmin(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const isResume = formData.get('kind') === 'resume';
  const isPdf = file.type === PDF_TYPE;
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);
  const maxBytes = isResume
    ? MAX_RESUME_BYTES
    : isPdf
      ? MAX_PDF_BYTES
      : isVideo
        ? MAX_VIDEO_BYTES
        : MAX_IMAGE_BYTES;

  // 1) MIME allow-list. Resume = PDF or raster image only.
  if (isResume) {
    if (!isPdf && !RESUME_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            'Resume must be a PDF or an image (JPG, PNG, WEBP, GIF, AVIF).',
        },
        { status: 400 }
      );
    }
  } else if (!isPdf && !isVideo && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported file type: "${file.type || 'unknown'}". Allowed: images (jpg, png, webp, gif, svg, avif), video (mp4, webm, mov) or a PDF resume.`,
      },
      { status: 400 }
    );
  }

  // 2) Size check — 5 MB for resumes.
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: `File too large (${humanSize(file.size)}). Maximum ${humanSize(maxBytes)}${isResume ? ' for a resume' : isPdf ? ' for resumes' : isVideo ? ' for videos' : ' for images'}.`,
      },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const header = new Uint8Array(bytes.slice(0, 512));

  // 3) Filename extension must agree with the declared type.
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const expectedExt: Record<string, string[]> = {
    'application/pdf': ['pdf'],
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/gif': ['gif'],
    'image/avif': ['avif'],
    'image/svg+xml': ['svg'],
  };
  if (expectedExt[file.type] && !expectedExt[file.type].includes(ext)) {
    return NextResponse.json(
      { error: `File extension ".${ext}" does not match its type (${file.type}).` },
      { status: 400 }
    );
  }

  // 4) Magic-byte validation — reject files whose bytes are not really a
  //    PDF/image even if the browser reported a valid MIME type.
  const sniffed = sniffType(header, file.type);
  if (!sniffed) {
    return NextResponse.json(
      { error: 'Invalid file: content does not match a valid PDF or image.' },
      { status: 400 }
    );
  }
  if (isResume && sniffed !== file.type) {
    return NextResponse.json(
      { error: 'Invalid resume: file content does not match its detected type.' },
      { status: 400 }
    );
  }

  const base64 = Buffer.from(bytes).toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  const { url, publicId } = await uploadToCloudinary(dataUrl);

  // Delete-on-replace: the admin form sends the publicId of the asset this
  // upload is replacing, so the old one is removed from Cloudinary right away.
  // destroy() is idempotent, so deleting a stale id is harmless.
  const oldPublicId = formData.get('oldPublicId');
  if (
    typeof oldPublicId === 'string' &&
    oldPublicId.length > 0 &&
    oldPublicId !== publicId
  ) {
    await deleteFromCloudinary(oldPublicId).catch((err) =>
      console.warn(
        '[cloudinary] Could not delete replaced asset:',
        (err as Error).message
      )
    );
  }

  return NextResponse.json({ url, publicId });
});
