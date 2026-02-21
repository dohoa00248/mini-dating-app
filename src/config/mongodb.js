import { MongoClient } from 'mongodb';

let client;
let db;

const connectMongoDB = async () => {
  try {
    const uri = process.env.DB_MONGODB_URI;

    if (!uri) {
      throw new Error('DB_MONGODB_URI is not defined');
    }

    client = new MongoClient(uri);

    await client.connect();

    db = client.db();

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export { client, db };
export default connectMongoDB;
