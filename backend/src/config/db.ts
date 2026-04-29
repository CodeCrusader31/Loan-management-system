import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
    } else {
      console.error('❌ An unknown error occurred during MongoDB connection');
    }
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});
