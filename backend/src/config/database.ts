import mongoose from 'mongoose';
import Logger from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anyware-challenge';
    
    await mongoose.connect(mongoURI);
    
    Logger.info('✅ MongoDB connected successfully', {
      uri: mongoURI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials in logs
      database: mongoURI.split('/').pop(),
    });
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      Logger.error('❌ MongoDB connection error', {
        error: err.message,
        stack: err.stack,
      });
    });
    
    mongoose.connection.on('disconnected', () => {
      Logger.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      Logger.info('🔄 MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      Logger.info('🔄 Shutting down gracefully...');
      await mongoose.connection.close();
      Logger.info('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    Logger.error('❌ MongoDB connection failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}; 