import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/Hero';
import { withAdmin } from '@/lib/api-helpers';
import { cleanupReplacedAssets } from '@/lib/assets';

export const dynamic = 'force-dynamic';

// Singleton section: one document total. GET creates it with defaults if missing.
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
    const prev = doc.toObject();
    Object.assign(doc, body);
    await doc.save();
    await cleanupReplacedAssets(prev, body);
  }
  return NextResponse.json(doc);
});
