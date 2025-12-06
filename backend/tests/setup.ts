/**
 * Jest Test Setup
 * إعداد اختبارات Jest
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';
process.env['JWT_EXPIRES_IN'] = '15m';
process.env['JWT_REFRESH_EXPIRES_IN'] = '7d';
process.env['CORS_ORIGIN'] = 'http://localhost:3000';
process.env['CLIENT_URL'] = 'http://localhost:3000';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';

let mongoServer: MongoMemoryServer | null = null;
let isMongoConnected = false;

// Setup before all tests
beforeAll(async () => {
  try {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env['MONGODB_URI'] = mongoUri;

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
  } catch (error) {
    // If MongoMemoryServer fails (e.g., port permission issues on Windows),
    // set a flag to skip MongoDB-dependent tests
    console.warn('MongoMemoryServer could not start. MongoDB-dependent tests will be skipped.');
    console.warn('Error:', error instanceof Error ? error.message : error);
    isMongoConnected = false;
  }
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections only if connected
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (collection) {
        await collection.deleteMany({});
      }
    }
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Disconnect and stop the in-memory server only if it was started
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Export helper to check if MongoDB is available
export const isMongoAvailable = (): boolean => isMongoConnected;

// Global test timeout
jest.setTimeout(30000);

// Mock Redis
jest.mock('ioredis', () => {
  const Redis = jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    status: 'ready',
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    setex: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
    exists: jest.fn().mockResolvedValue(0),
    on: jest.fn(),
  }));
  return Redis;
});
