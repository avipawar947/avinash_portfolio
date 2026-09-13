import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/Stat';
import { withAdmin } from '@/lib/api-helpers';

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
  const item = await Model.findByIdAndUpdate(params.id, body, { new: true });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

export const DELETE = withAdmin(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB();
  await Model.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
});
