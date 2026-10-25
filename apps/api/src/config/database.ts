import mongoose from 'mongoose';
import { env } from './env.js';
import { isNeonConfigured, initNeonDatabase, closeNeonDatabase } from './neonDatabase.js';

let mongodInstance: any = null;

export async function connectDatabase(): Promise<string> {
  if (isNeonConfigured()) {
    await initNeonDatabase();
    console.log('[Database] Connected to Neon Serverless Postgres via DATABASE_URL');
    return env.DATABASE_URL;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.host;
  }

  try {
    // Attempt connecting to the configured MONGODB_URI with a 3-second timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to external MongoDB at ${env.MONGODB_URI}`);
    return env.MONGODB_URI;
  } catch (err: any) {
    console.warn(`[Database] Could not connect to external MongoDB: ${err?.message}`);
    console.log('[Database] Falling back to in-memory MongoDB server (mongodb-memory-server)...');

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log(`[Database] Connected to in-memory MongoDB at ${uri}`);
    return uri;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isNeonConfigured()) {
    await closeNeonDatabase();
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
}
