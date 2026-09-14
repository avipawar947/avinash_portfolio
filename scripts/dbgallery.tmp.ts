import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(process.cwd(), '.env.local') });
import { connectDB } from '../lib/db';
import GalleryImageModel from '../models/GalleryImage';
async function main() {
  await connectDB();
  const items = await GalleryImageModel.find().sort('order').lean();
  console.log('count', items.length);
  for (const it of items as any[]) {
    console.log(it._id, it.order, JSON.stringify(it.imageUrl || '').slice(0, 80), '| caption:', JSON.stringify(it.caption).slice(0,40));
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
