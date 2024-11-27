import mongoose from 'mongoose';
import { MongoClient, Db } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type MongoConnection = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoDb: MongoConnection | null;
}

// Initialize global.mongoDb if needed
if (!global.mongoDb) {
  global.mongoDb = {
    client: null,
    promise: null,
  };
}

export async function connectToMongoDB(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    }
    
    const client = await connectToDatabase();
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function connectToDatabase(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  if (global.mongoDb?.client) {
    if (!global.mongoDb.client) {
      throw new Error('MongoDB client is null');
    }
    return global.mongoDb.client;
  }

  if (!global.mongoDb?.promise) {
    const connection: MongoConnection = {
      client: null,
      promise: MongoClient.connect(process.env.MONGODB_URI)
    };
    global.mongoDb = connection;
  }

  try {
    if (!global.mongoDb?.promise) {
      throw new Error('MongoDB connection promise is null');
    }
    const client = await global.mongoDb.promise;
    global.mongoDb.client = client;
    return client;
  } catch (error) {
    if (global.mongoDb) {
      global.mongoDb.promise = null;
    }
    throw error;
  }
}

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Please define the Supabase environment variables inside .env');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
