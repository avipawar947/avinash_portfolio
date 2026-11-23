import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/LifeBehindTextItem';
import { withAdmin } from '@/lib/api-helpers';
import { cleanupReplacedAssets, cleanupDocAssets } from '@/lib/assets';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await connectDB();
  const item = await Model.findById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export const PUT = withAdmin(async (req: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const prev = await Model.findById(id);
  if (!prev) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const item = await Model.findByIdAndUpdate(id, body, { new: true });
  await cleanupReplacedAssets(prev?.toObject(), body);
  return NextResponse.json(item);
});

export const DELETE = withAdmin(async (_req: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  await connectDB();
  const prev = await Model.findById(id);
  await Model.findByIdAndDelete(id);
  await cleanupDocAssets(prev?.toObject());
  return NextResponse.json({ ok: true });
});
