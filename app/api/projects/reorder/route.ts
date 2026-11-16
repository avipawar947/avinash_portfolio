import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Model from '@/models/Project';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * Persist a new card sequence.
 *
 * The admin sends the full list of project ids in the order it should appear
 * on the homepage. Orders are re-numbered contiguously (0, 1, 2, …) so there
 * are never ties to shuffle between, then `/` is revalidated so the home grid
 * reflects the new positions immediately.
 */
export const POST = withAdmin(async (req: NextRequest) => {
  await connectDB();

  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: 'A non-empty ids array is required' }, { status: 400 });
  }

  await Model.bulkWrite(
    ids.map((id, order) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    })),
    { ordered: false }
  );

  revalidatePath('/');
  return NextResponse.json({ ok: true, ids });
});
