import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Model from '@/models/Project';
import { seedContent } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    await connectDB();
    const bySlug = await Model.findOne({ slug }).lean();
    const item = bySlug ?? (await Model.findById(slug).lean().catch(() => null));
    if (!item) {
      const seedHit = seedContent.projects.find((p: any) => p.slug === slug || p._id === slug);
      if (!seedHit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(seedHit);
    }
    return NextResponse.json(item);
  } catch {
    const seedHit = seedContent.projects.find((p: any) => p.slug === slug || p._id === slug);
    if (!seedHit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(seedHit);
  }
}
