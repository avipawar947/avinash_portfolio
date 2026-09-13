/**
 * Populates MongoDB with the same starter content used as the in-app
 * fallback (lib/seed-data.ts), so the CMS has real, editable documents
 * from the start instead of relying on the fallback forever.
 *
 * Run: npm run seed   (requires MONGODB_URI in .env.local)
 */
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(process.cwd(), '.env.local') });
import { connectDB } from '../lib/db';
import { seedContent } from '../lib/seed-data';
import Hero from '../models/Hero';
import Navbar from '../models/Navbar';
import ClientLogo from '../models/ClientLogo';
import Project from '../models/Project';
import ProcessStep from '../models/ProcessStep';
import GalleryImage from '../models/GalleryImage';
import Stat from '../models/Stat';
import Journey from '../models/Journey';
import LifeBehindTextItem from '../models/LifeBehindTextItem';
import Tool from '../models/Tool';
import Footer from '../models/Footer';
import Settings from '../models/Settings';

async function seed() {
  await connectDB();

  await Hero.deleteMany({});
  await Hero.create(seedContent.hero);

  await Navbar.deleteMany({});
  await Navbar.create(seedContent.navbar);

  await ClientLogo.deleteMany({});
  await ClientLogo.insertMany(seedContent.clientLogos);

  await Project.deleteMany({});
  await Project.insertMany(seedContent.projects);

  await ProcessStep.deleteMany({});
  await ProcessStep.insertMany(seedContent.process);

  await GalleryImage.deleteMany({});
  await GalleryImage.insertMany(seedContent.gallery);

  await Stat.deleteMany({});
  await Stat.insertMany(seedContent.stats);

  await Journey.deleteMany({});
  await Journey.create(seedContent.journey);

  await LifeBehindTextItem.deleteMany({});
  await LifeBehindTextItem.insertMany(seedContent.lifeBehindText);

  await Tool.deleteMany({});
  await Tool.insertMany(seedContent.tools);

  await Footer.deleteMany({});
  await Footer.create(seedContent.footer);

  await Settings.deleteMany({});
  await Settings.create(seedContent.settings);

  console.log('✅ Database seeded.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
