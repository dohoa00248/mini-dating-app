import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/mini_dating_app';

const client = new MongoClient(uri);

const connectMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connection established to the database');
  } catch (error) {
    console.error(error);
  }
};

connectMongoDB();
export default connectMongoDB;
