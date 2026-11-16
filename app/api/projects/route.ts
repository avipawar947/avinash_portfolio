import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Model from '@/models/Project';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const items = await Model.find().sort({ order: 1, createdAt: 1, _id: 1 });
  return NextResponse.json(items);
}

export const POST = withAdmin(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();

  // Append new projects to the end of the sequence. Using `count()` here
  // would reuse an existing order after a delete and make the home grid
  // shuffle between ties, so take the current maximum instead.
  if (typeof body.order !== 'number' || Number.isNaN(body.order)) {
    const last = await Model.findOne().sort({ order: -1 }).select('order').lean();
    body.order = ((last as { order?: number } | null)?.order ?? -1) + 1;
  }

  const item = await Model.create(body);
  revalidatePath('/');
  if (item.slug) revalidatePath(`/case-study/${item.slug}`);
  return NextResponse.json(item, { status: 201 });
});
