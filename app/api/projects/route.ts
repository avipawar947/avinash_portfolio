import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Model from '@/models/Project';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const items = await Model.find().sort('order');
  return NextResponse.json(items);
}

export const POST = withAdmin(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  const item = await Model.create(body);
  if (item.slug) revalidatePath(`/case-study/${item.slug}`);
  return NextResponse.json(item, { status: 201 });
});
