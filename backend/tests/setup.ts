/**
 * Jest Test Setup
 * إعداد اختبارات Jest
 */

// Import all models to register schemas before tests run
import '../src/models';

// Configure MongoMemoryServer to skip MD5 check (fixes corrupted binary issues)
process.env['MONGOMS_MD5_CHECK'] = '0';
process.env['MONGOMS_SKIP_MD5_CHECK'] = '1';

// Configure MongoMemoryServer to bind to localhost (fixes EACCES on Windows)
process.env['MONGOMS_IP'] = '127.0.0.1';

// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';
process.env['JWT_EXPIRES_IN'] = '15m';
process.env['JWT_REFRESH_EXPIRES_IN'] = '7d';
process.env['CORS_ORIGIN'] = 'http://localhost:3000';
process.env['CLIENT_URL'] = 'http://localhost:3000';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';

// Global test timeout - 120s to allow MongoDB binary download on slow connections
jest.setTimeout(120000);

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
