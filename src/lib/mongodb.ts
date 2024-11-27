import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    mongodb: { 
      conn: MongoClient | null; 
      promise: Promise<MongoClient> | null;
    };
  };

  if (!globalWithMongo.mongodb) {
    globalWithMongo.mongodb = {
      conn: null,
      promise: null
    };
  }

  if (!globalWithMongo.mongodb.promise) {
    client = new MongoClient(uri, options);
    globalWithMongo.mongodb.promise = client.connect();
  }
  clientPromise = globalWithMongo.mongodb.promise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to database');
  }
}

// Export a promise that resolves to the MongoDB client
export default clientPromise;
