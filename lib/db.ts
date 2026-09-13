import mongoose from 'mongoose';

// Cache the connection across hot-reloads in dev and across
// serverless invocations in production.
type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('[db] MONGODB_URI is not set — add it to .env.local');
  }
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
