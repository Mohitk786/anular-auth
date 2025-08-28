import mongoose from 'mongoose';

export const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/angular-auth");
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection failed:', error);
    process.exit(1);
  }
};
