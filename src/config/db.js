import connectMongoDB from './mongoose.js';

const connectDB = async () => {
  try {
    await Promise.all[connectMongoDB()];
    console.log('Connected to DB successfully');
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
