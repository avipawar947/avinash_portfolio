import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Uploads a base64/data-URL or remote URL. Works for images AND the resume PDF (resource_type: 'auto'). */
export async function uploadToCloudinary(fileDataUrl: string, folder = process.env.CLOUDINARY_FOLDER || 'avinash-portfolio') {
  const result = await cloudinary.uploader.upload(fileDataUrl, {
    folder,
    resource_type: 'auto',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Deletes an asset from Cloudinary. Uploads use resource_type 'auto' (so a PDF
 * is stored as 'raw', images as 'image'), but destroy() only accepts
 * image/raw/video — 'auto' is invalid there. We therefore destroy against every
 * type; the wrong ones return "not found" instead of throwing, so the correct
 * one always wins.
 */
export async function deleteFromCloudinary(publicId: string) {
  await Promise.all(
    ['image', 'raw', 'video'].map((resource_type) =>
      cloudinary.uploader.destroy(publicId, { resource_type: resource_type as 'image' | 'raw' | 'video', invalidate: true })
    )
  );
}

export default cloudinary;
