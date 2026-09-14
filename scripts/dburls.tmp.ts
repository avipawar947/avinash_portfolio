import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(process.cwd(), '.env.local') });
import { connectDB } from '../lib/db';
import HeroModel from '../models/Hero';
async function main() {
  await connectDB();
  const h = await HeroModel.findOne().lean();
  console.log('hero:', JSON.stringify((h as any)?.characterImageUrl || '').slice(0, 140));
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
