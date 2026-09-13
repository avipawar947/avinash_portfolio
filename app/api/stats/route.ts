import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/Stat';
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
  return NextResponse.json(item, { status: 201 });
});
