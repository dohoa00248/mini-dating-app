import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mini_dating_app');
    console.log('Connection established to the database by mongoose');
  } catch (error) {
    console.error(error);
  }
};
export default connectMongoDB;
