import mongoose from 'mongoose';

let isConnected = false; // track the connection

const dbConnect = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "expiry_reminder"
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export default dbConnect;