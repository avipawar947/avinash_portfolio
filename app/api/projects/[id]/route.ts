import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Model from '@/models/Project';
import { withAdmin } from '@/lib/api-helpers';
import { cleanupReplacedAssets, cleanupDocAssets, publicIdsOf, deleteAssets } from '@/lib/assets';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const item = await Model.findById(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export const PUT = withAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB();
  const body = await req.json();
  const prev = await Model.findById(params.id);
  if (!prev) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const item = await Model.findByIdAndUpdate(params.id, body, { new: true });
  await cleanupReplacedAssets(prev?.toObject(), body);
  const still = new Set(publicIdsOf(item?.toObject()));
  await deleteAssets(publicIdsOf(prev?.toObject()).filter((id) => !still.has(id)));

  // The case-study page is statically rendered with `revalidate = 60`, so a
  // CMS save must invalidate that exact page or the frontend keeps showing the
  // previous content (including a newly uploaded Information Architecture
  // image) until the cache expires. Revalidate the old path too in case the
  // slug was edited in this request.
  if (prev?.slug) revalidatePath(`/case-study/${prev.slug}`);
  if (item?.slug) revalidatePath(`/case-study/${item.slug}`);

  return NextResponse.json(item);
});

export const DELETE = withAdmin(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB();
  const prev = await Model.findById(params.id);
  await Model.findByIdAndDelete(params.id);
  await cleanupDocAssets(prev?.toObject());
  if (prev?.slug) revalidatePath(`/case-study/${prev.slug}`);
  return NextResponse.json({ ok: true });
});
