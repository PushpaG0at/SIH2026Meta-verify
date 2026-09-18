import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env directly
let rawUri = '';
for (const envPath of [path.join(__dirname, '../.env'), path.join(__dirname, '../../.env')]) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const l of lines) {
      if (l.includes('atlas_URL') || l.includes('MONGODB_URI')) {
        const val = l.substring(l.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
        if (val) rawUri = val;
      }
    }
  }
}
if (!rawUri) {
  rawUri = 'mongodb+srv://singhpushpendra95734_db_user:47zE6uF7MkA4K7WH@metraaveri.kixllni.mongodb.net/metra_verify?appName=MetraaVeri';
}

// Ensure /metra_verify database is specified in URI
let uri = rawUri.trim().replace(/^['"]|['"]$/g, '');
if (!uri.includes('.mongodb.net/metra_verify') && uri.includes('.mongodb.net')) {
  uri = uri.replace('.mongodb.net/?', '.mongodb.net/metra_verify?');
  if (!uri.includes('/metra_verify')) {
    uri = uri.replace('.mongodb.net', '.mongodb.net/metra_verify');
  }
}

let client = null;
let db = null;

export async function connectMongo() {
  if (db) return db;

  try {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    await client.connect();
    db = client.db('metra_verify');
    console.log(`🌿 Connected successfully to MongoDB Atlas database: [${db.databaseName}]`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectMongo() first.');
  }
  return db;
}

export async function getCollection(name) {
  const database = await connectMongo();
  return database.collection(name);
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export default {
  connectMongo,
  getDb,
  getCollection,
  closeMongo
};
