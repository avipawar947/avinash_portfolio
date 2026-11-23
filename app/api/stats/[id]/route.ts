import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/Stat';
import { withAdmin } from '@/lib/api-helpers';

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
  const item = await Model.findByIdAndUpdate(id, body, { new: true });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

export const DELETE = withAdmin(async (_req: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  await connectDB();
  await Model.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
});
