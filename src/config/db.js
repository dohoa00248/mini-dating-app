import connectMongoDB from './mongoose.js';

const connectDB = async () => {
  try {
    const connections = [connectMongoDB()];

    await Promise.all(connections);

    console.log('All databases connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

export default connectDB;
