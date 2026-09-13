import { deleteFromCloudinary } from './cloudinary';

/**
 * Cloudinary lifecycle helpers for the CMS.
 *
 * Every model that can hold an uploaded asset stores it as `<name>Url`
 * plus a companion `<name>PublicId` field. These helpers keep Cloudinary
 * in sync with MongoDB:
 *   - replacing an asset  -> old public id is deleted
 *   - clearing an asset   -> old public id is deleted
 *   - deleting a document -> every asset it referenced is deleted
 *
 * Deletions are best-effort and never throw, so a failed Cloudinary
 * delete (e.g. id already gone) can't break a database save.
 */

const PUBLIC_ID_SUFFIX = 'PublicId';

/** True when `key` is a stored Cloudinary public-id field and it has a value. */
function isPublicIdField(key: string, value: unknown): value is string {
  return key.endsWith(PUBLIC_ID_SUFFIX) && typeof value === 'string' && value.length > 0;
}

/** Every non-empty `*PublicId` value referenced by a document. */
export function publicIdsOf(doc: Record<string, unknown> | null | undefined): string[] {
  if (!doc) return [];
  return Object.entries(doc).reduce<string[]>((ids, [key, value]) => {
    if (isPublicIdField(key, value)) ids.push(value);
    return ids;
  }, []);
}

/** Delete a set of public ids from Cloudinary (idempotent, errors swallowed). */
export async function deleteAssets(publicIds: string[]): Promise<void> {
  const unique = [...new Set(publicIds.filter(Boolean))];
  await Promise.all(
    unique.map((id) =>
      deleteFromCloudinary(id).catch((err) =>
        console.warn(`[cloudinary] Could not delete "${id}":`, (err as Error).message)
      )
    )
  );
}

/** DELETE-time: remove every Cloudinary asset a document references. */
export async function cleanupDocAssets(doc: Record<string, unknown> | null | undefined): Promise<void> {
  await deleteAssets(publicIdsOf(doc));
}

/**
 * PUT-time: given the previous document and the incoming (possibly partial)
 * body, delete any old asset that is being replaced or cleared.
 *
 * An asset is considered stale when:
 *  - its publicId was changed to a new one            (replaced via upload)
 *  - its publicId was cleared to '' / null            (removed)
 *  - its URL field changed but no publicId was sent   (replaced, id not tracked)
 *  - its URL field was cleared                        (removed by url)
 */
export async function cleanupReplacedAssets(
  prev: Record<string, unknown> | null | undefined,
  body: Record<string, unknown>
): Promise<void> {
  if (!prev) return;

  const stale: string[] = [];

  for (const [key, value] of Object.entries(prev)) {
    if (!isPublicIdField(key, value)) continue;

    const urlField = key.slice(0, -PUBLIC_ID_SUFFIX.length) + 'Url';
    const next = body[key];
    const nextUrl = body[urlField];

    const replaced = typeof next === 'string' && next !== '' && next !== value;
    const cleared = next === '' || next === null;
    const urlReplacedWithoutId =
      next === undefined &&
      typeof nextUrl === 'string' && nextUrl !== '' &&
      typeof prev[urlField] === 'string' && prev[urlField] !== '' &&
      prev[urlField] !== nextUrl;
    const urlCleared =
      next === undefined &&
      (nextUrl === '' || nextUrl === null) &&
      typeof prev[urlField] === 'string' && prev[urlField] !== '';

    if (replaced || cleared || urlReplacedWithoutId || urlCleared) {
      stale.push(value);
    }
  }

  await deleteAssets(stale);
}