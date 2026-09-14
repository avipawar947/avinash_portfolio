import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/ContactCTA';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  let doc = await Model.findOne();
  if (!doc) doc = await Model.create({});
  return NextResponse.json(doc);
}

export const PUT = withAdmin(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  let doc = await Model.findOne();
  if (!doc) {
    doc = await Model.create(body);
  } else {
    Object.assign(doc, body);
    await doc.save();
  }
  return NextResponse.json(doc);
});
