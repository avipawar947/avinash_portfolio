import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/Project';
import { withAdmin } from '@/lib/api-helpers';
import { cleanupReplacedAssets, cleanupDocAssets } from '@/lib/assets';

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
  return NextResponse.json(item);
});

export const DELETE = withAdmin(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB();
  const prev = await Model.findById(params.id);
  await Model.findByIdAndDelete(params.id);
  await cleanupDocAssets(prev?.toObject());
  return NextResponse.json({ ok: true });
});
