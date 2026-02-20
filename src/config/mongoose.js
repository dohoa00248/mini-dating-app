import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGODB_URI);
    console.log('Connection established to the database by mongoose');
  } catch (error) {
    console.error(error);
  }
};

export default connectMongoDB;
