// Jest Setup File
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h'; // 1 hour for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/anyware-challenge-test';
process.env.LOG_LEVEL = 'error'; // Minimal logging during tests

// Load environment variables
dotenv.config();

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI!);
}, 30000);

// Clean up between tests
beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
}, 30000);

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection in tests:', err);
  process.exit(1);
});