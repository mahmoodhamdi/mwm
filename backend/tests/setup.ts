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

// Mock Redis - use plain functions (not jest.fn()) so resetMocks: true doesn't clear implementations
jest.mock('ioredis', () => {
  const mockRedis = {
    connect: () => Promise.resolve(undefined),
    quit: () => Promise.resolve(undefined),
    status: 'ready',
    get: () => Promise.resolve(null),
    set: () => Promise.resolve('OK'),
    setex: () => Promise.resolve('OK'),
    del: () => Promise.resolve(1),
    keys: () => Promise.resolve([]),
    exists: () => Promise.resolve(0),
    on: () => mockRedis,
    subscribe: () => Promise.resolve(undefined),
    unsubscribe: () => Promise.resolve(undefined),
    publish: () => Promise.resolve(0),
  };
  return jest.fn(() => mockRedis);
});
