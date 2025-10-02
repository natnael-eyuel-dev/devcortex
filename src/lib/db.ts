import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

// load env variables
config({ path: resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// mongoose cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as { mongoose?: MongooseCache }).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = (global as { mongoose?: MongooseCache }).mongoose = { conn: null, promise: null };
}

// connect to database
export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
} 