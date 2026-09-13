import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

// Enforced upload limits (configurable via .env.local if needed).
const MAX_IMAGE_BYTES = Number(process.env.CLOUDINARY_MAX_IMAGE_MB || 10) * 1024 * 1024; // 10 MB
const MAX_PDF_BYTES = Number(process.env.CLOUDINARY_MAX_PDF_MB || 15) * 1024 * 1024; // 15 MB

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);
const PDF_TYPE = 'application/pdf';

function humanSize(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

/**
 * Accepts a multipart form with:
 *   - "file"        (image OR the resume PDF)             -> uploaded to Cloudinary
 *   - "oldPublicId" (optional)                            -> deleted after a successful
 *                                                             upload so replaced assets
 *                                                             never stay orphaned
 * Returns { url, publicId }. The caller (admin form) then saves those onto the
 * relevant MongoDB document.
 */
export const POST = withAdmin(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const isPdf = file.type === PDF_TYPE;
  const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;

  if (!isPdf && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported file type: "${file.type || 'unknown'}". Allowed: images (jpg, png, webp, gif, svg, avif) or a PDF resume.`,
      },
      { status: 400 }
    );
  }

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: `File too large (${humanSize(file.size)}). Maximum ${humanSize(maxBytes)}${isPdf ? ' for resumes' : ' for images'}.`,
      },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  const { url, publicId } = await uploadToCloudinary(dataUrl);

  // Delete-on-replace: the admin form sends the publicId of the asset this
  // upload is replacing, so the old one is removed from Cloudinary right away.
  // destroy() is idempotent, so deleting a stale id is harmless.
  const oldPublicId = formData.get('oldPublicId');
  if (typeof oldPublicId === 'string' && oldPublicId.length > 0 && oldPublicId !== publicId) {
    await deleteFromCloudinary(oldPublicId).catch((err) =>
      console.warn('[cloudinary] Could not delete replaced asset:', (err as Error).message)
    );
  }

  return NextResponse.json({ url, publicId });
});