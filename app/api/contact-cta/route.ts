import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/ContactCTA';
import { seedContent } from '@/lib/seed-data';
import { withAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  let doc = await Model.findOne();
  if (!doc) {
    doc = await Model.create({});
  } else {
    // Backfill the case-study contact fields on documents created before
    // they existed, so the admin form always shows what the site renders.
    const defaults = seedContent.contactCTA;
    let changed = false;
    if (!doc.phone) {
      doc.phone = defaults.phone;
      changed = true;
    }
    if (!doc.email) {
      doc.email = defaults.email;
      changed = true;
    }
    if (!doc.linkedinUrl) {
      doc.linkedinUrl = defaults.linkedinUrl;
      changed = true;
    }
    if (changed) await doc.save();
  }
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
