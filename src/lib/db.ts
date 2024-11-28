import mongoose, { ConnectOptions } from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

const options: ConnectOptions = {
  bufferCommands: true,
  autoIndex: true,
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 60000,
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 90000,
  connectTimeoutMS: 60000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  writeConcern: { w: 'majority' },
  readPreference: 'primaryPreferred',
} as ConnectOptions;

// Return type that matches the actual MongoDB connection object
export interface DatabaseConnection {
  connection: {
    db: mongoose.mongo.Db;
  };
}

export async function connectToDatabase(): Promise<DatabaseConnection> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    if (!mongoose.connection.db) {
      throw new Error('MongoDB connection exists but database is not initialized');
    }
    return {
      connection: {
        db: mongoose.connection.db,
      },
    };
  }

  if (!cached.promise) {
    const opts = { ...options };
    console.log('MongoDB connection options:', JSON.stringify(opts, null, 2));

    // Clear any existing connection
    if (cached.conn) {
      console.log('Closing existing MongoDB connection');
      await mongoose.connection.close();
      cached.conn = null;
    }

    console.log('Creating new MongoDB connection...');
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        console.log('Connection state:', mongoose.connection.readyState);
        if (!mongoose.connection.db) {
          throw new Error('MongoDB connection successful but database is not initialized');
        }
        console.log('Connection host:', mongoose.connection.host);
        return mongoose;
      })
      .catch(async (error) => {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        cached.promise = null;
        throw error;
      });
  }

  try {
    console.log('Waiting for MongoDB connection...');
    cached.conn = await cached.promise;
    if (!cached.conn.connection.db) {
      throw new Error('MongoDB connection successful but database is not initialized');
    }
    console.log('MongoDB connection established successfully');
    return {
      connection: {
        db: cached.conn.connection.db,
      },
    };
  } catch (e) {
    console.error('Failed to establish MongoDB connection:', e);
    cached.promise = null;
    throw e;
  }
}

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
  cached.conn = null;
  cached.promise = null;
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
