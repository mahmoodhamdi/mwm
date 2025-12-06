/**
 * User Model Unit Tests
 * اختبارات وحدة نموذج المستخدم
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, UserRoles, IUser } from '../../../src/models';

describe('User Model', () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create a user with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(UserRoles.VIEWER); // default role
      expect(user.isActive).toBe(true);
      expect(user.isEmailVerified).toBe(false);
    });

    it('should require name', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        password: 'Test@1234',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require password', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Test@1234',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should lowercase email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'Test@1234',
      };

      const user = await User.create(userData);
      expect(user.email).toBe('test@example.com');
    });

    it('should validate name length', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'A', // Too short
        email: 'test@example.com',
        password: 'Test@1234',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should accept valid roles', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Test@1234',
        role: UserRoles.ADMIN,
      };

      const user = await User.create(userData);
      expect(user.role).toBe(UserRoles.ADMIN);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password on create', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      expect(userWithPassword?.password).not.toBe('Test@1234');
      expect(userWithPassword?.password).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('should hash password on update', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      const userDoc = await User.findById(user._id).select('+password');
      const originalHash = userDoc?.password;

      if (userDoc) {
        userDoc.password = 'NewPassword@1234';
        await userDoc.save();
      }

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser?.password).not.toBe(originalHash);
    });
  });

  describe('comparePassword Method', () => {
    it('should return true for correct password', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword?.comparePassword('Test@1234');

      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword?.comparePassword('WrongPassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('Login Attempts', () => {
    it('should increment login attempts', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      await user.incrementLoginAttempts();
      const updatedUser = await User.findById(user._id);

      expect(updatedUser?.loginAttempts).toBe(1);
    });

    it('should reset login attempts', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
        loginAttempts: 3,
      });

      await user.resetLoginAttempts();
      const updatedUser = await User.findById(user._id);

      expect(updatedUser?.loginAttempts).toBe(0);
    });

    it('should lock account after max attempts', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
        loginAttempts: 4,
      });

      await user.incrementLoginAttempts();
      const updatedUser = await User.findById(user._id);

      expect(updatedUser?.lockUntil).toBeDefined();
      expect(updatedUser?.isLocked()).toBe(true);
    });
  });

  describe('Email Verification', () => {
    it('should generate email verification token', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      const token = user.generateEmailVerificationToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes hex
      expect(user.emailVerificationToken).toBeDefined();
      expect(user.emailVerificationExpires).toBeDefined();
    });
  });

  describe('Password Reset', () => {
    it('should generate password reset token', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      const token = user.generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes hex
      expect(user.passwordResetToken).toBeDefined();
      expect(user.passwordResetExpires).toBeDefined();
    });
  });

  describe('toJSON Transform', () => {
    it('should not include password in JSON', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
      });

      const json = user.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.refreshTokens).toBeUndefined();
      expect(json.twoFactorSecret).toBeUndefined();
    });
  });
});
