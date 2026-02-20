import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_MONGODB_URI;

const client = new MongoClient(uri);

const connectMongoDB = async () => {
  try {
    await client.connect(uri);
    console.log('Connection established to the database');
  } catch (error) {
    console.error(error);
  }
};

export default connectMongoDB;
