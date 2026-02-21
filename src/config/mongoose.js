import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const { DB_MONGODB_URI } = process.env;

    if (!DB_MONGODB_URI) {
      throw new Error('DB_MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(DB_MONGODB_URI, {
      autoIndex: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export default connectMongoDB;
