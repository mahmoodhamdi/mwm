/**
 * Environment Configuration Unit Tests
 * اختبارات وحدة إعدادات البيئة
 */

import Joi from 'joi';

// Environment validation schema (copied for testing)
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().required().description('MongoDB connection URI'),
  REDIS_URL: Joi.string().required().description('Redis connection URL'),
  JWT_SECRET: Joi.string().min(32).required().description('JWT secret key'),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  CLIENT_URL: Joi.string().default('http://localhost:3000'),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
  CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
  CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().allow('').optional(),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  EMAIL_FROM: Joi.string().allow('').optional(),
  RECAPTCHA_SECRET_KEY: Joi.string().allow('').optional(),
  SENTRY_DSN: Joi.string().allow('').optional(),
})
  .unknown()
  .required();

describe('Environment Configuration', () => {
  const validEnv = {
    NODE_ENV: 'development',
    PORT: '5000',
    MONGODB_URI: 'mongodb://localhost:27017/mwm',
    REDIS_URL: 'redis://localhost:6379',
    JWT_SECRET: 'this-is-a-super-secret-jwt-key-32-chars',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    CORS_ORIGIN: 'http://localhost:3000',
    CLIENT_URL: 'http://localhost:3000',
  };

  describe('Required Fields', () => {
    it('should pass validation with all required fields', () => {
      const { error, value } = envSchema.validate(validEnv, { abortEarly: false });
      expect(error).toBeUndefined();
      expect(value.MONGODB_URI).toBe(validEnv.MONGODB_URI);
      expect(value.REDIS_URL).toBe(validEnv.REDIS_URL);
      expect(value.JWT_SECRET).toBe(validEnv.JWT_SECRET);
    });

    it('should fail when MONGODB_URI is missing', () => {
      const { MONGODB_URI, ...envWithoutMongo } = validEnv;
      const { error } = envSchema.validate(envWithoutMongo, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error!.details.some(d => d.path.includes('MONGODB_URI'))).toBe(true);
    });

    it('should fail when REDIS_URL is missing', () => {
      const { REDIS_URL, ...envWithoutRedis } = validEnv;
      const { error } = envSchema.validate(envWithoutRedis, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error!.details.some(d => d.path.includes('REDIS_URL'))).toBe(true);
    });

    it('should fail when JWT_SECRET is missing', () => {
      const { JWT_SECRET, ...envWithoutJwt } = validEnv;
      const { error } = envSchema.validate(envWithoutJwt, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error!.details.some(d => d.path.includes('JWT_SECRET'))).toBe(true);
    });
  });

  describe('JWT_SECRET Validation', () => {
    it('should fail when JWT_SECRET is less than 32 characters', () => {
      const envWithShortJwt = { ...validEnv, JWT_SECRET: 'short-secret' };
      const { error } = envSchema.validate(envWithShortJwt, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error!.details.some(d => d.path.includes('JWT_SECRET'))).toBe(true);
    });

    it('should pass when JWT_SECRET is exactly 32 characters', () => {
      const envWith32CharJwt = { ...validEnv, JWT_SECRET: 'a'.repeat(32) };
      const { error } = envSchema.validate(envWith32CharJwt, { abortEarly: false });

      expect(error).toBeUndefined();
    });

    it('should pass when JWT_SECRET is more than 32 characters', () => {
      const envWithLongJwt = { ...validEnv, JWT_SECRET: 'a'.repeat(64) };
      const { error } = envSchema.validate(envWithLongJwt, { abortEarly: false });

      expect(error).toBeUndefined();
    });
  });

  describe('NODE_ENV Validation', () => {
    it('should accept development environment', () => {
      const { error, value } = envSchema.validate({ ...validEnv, NODE_ENV: 'development' });
      expect(error).toBeUndefined();
      expect(value.NODE_ENV).toBe('development');
    });

    it('should accept production environment', () => {
      const { error, value } = envSchema.validate({ ...validEnv, NODE_ENV: 'production' });
      expect(error).toBeUndefined();
      expect(value.NODE_ENV).toBe('production');
    });

    it('should accept test environment', () => {
      const { error, value } = envSchema.validate({ ...validEnv, NODE_ENV: 'test' });
      expect(error).toBeUndefined();
      expect(value.NODE_ENV).toBe('test');
    });

    it('should fail for invalid environment', () => {
      const { error } = envSchema.validate({ ...validEnv, NODE_ENV: 'invalid' });
      expect(error).toBeDefined();
      expect(error!.details.some(d => d.path.includes('NODE_ENV'))).toBe(true);
    });

    it('should default to development when not provided', () => {
      const { NODE_ENV, ...envWithoutNodeEnv } = validEnv;
      const { error, value } = envSchema.validate(envWithoutNodeEnv);

      expect(error).toBeUndefined();
      expect(value.NODE_ENV).toBe('development');
    });
  });

  describe('PORT Validation', () => {
    it('should accept valid port number', () => {
      const { error, value } = envSchema.validate({ ...validEnv, PORT: 3000 });
      expect(error).toBeUndefined();
      expect(value.PORT).toBe(3000);
    });

    it('should default to 5000 when not provided', () => {
      const { PORT, ...envWithoutPort } = validEnv;
      const { error, value } = envSchema.validate(envWithoutPort);

      expect(error).toBeUndefined();
      expect(value.PORT).toBe(5000);
    });

    it('should fail for non-numeric port', () => {
      const { error } = envSchema.validate({ ...validEnv, PORT: 'not-a-port' });
      expect(error).toBeDefined();
    });
  });

  describe('Default Values', () => {
    it('should apply default values for optional fields', () => {
      const { error, value } = envSchema.validate({
        MONGODB_URI: validEnv.MONGODB_URI,
        REDIS_URL: validEnv.REDIS_URL,
        JWT_SECRET: validEnv.JWT_SECRET,
      });

      expect(error).toBeUndefined();
      expect(value.NODE_ENV).toBe('development');
      expect(value.PORT).toBe(5000);
      expect(value.JWT_EXPIRES_IN).toBe('15m');
      expect(value.JWT_REFRESH_EXPIRES_IN).toBe('7d');
      expect(value.CORS_ORIGIN).toBe('http://localhost:3000');
      expect(value.CLIENT_URL).toBe('http://localhost:3000');
    });
  });

  describe('Optional Fields', () => {
    it('should allow empty Cloudinary configuration', () => {
      const { error } = envSchema.validate({
        ...validEnv,
        CLOUDINARY_CLOUD_NAME: '',
        CLOUDINARY_API_KEY: '',
        CLOUDINARY_API_SECRET: '',
      });
      expect(error).toBeUndefined();
    });

    it('should allow empty SMTP configuration', () => {
      const { error } = envSchema.validate({
        ...validEnv,
        SMTP_HOST: '',
        SMTP_PORT: '',
        SMTP_USER: '',
        SMTP_PASS: '',
        EMAIL_FROM: '',
      });
      expect(error).toBeUndefined();
    });

    it('should allow empty reCAPTCHA secret', () => {
      const { error } = envSchema.validate({
        ...validEnv,
        RECAPTCHA_SECRET_KEY: '',
      });
      expect(error).toBeUndefined();
    });

    it('should allow empty Sentry DSN', () => {
      const { error } = envSchema.validate({
        ...validEnv,
        SENTRY_DSN: '',
      });
      expect(error).toBeUndefined();
    });
  });

  describe('Unknown Fields', () => {
    it('should allow unknown environment variables', () => {
      const { error, value } = envSchema.validate({
        ...validEnv,
        UNKNOWN_VAR: 'some-value',
        ANOTHER_UNKNOWN: '123',
      });

      expect(error).toBeUndefined();
      expect(value.UNKNOWN_VAR).toBe('some-value');
      expect(value.ANOTHER_UNKNOWN).toBe('123');
    });
  });

  describe('Multiple Validation Errors', () => {
    it('should report all validation errors at once', () => {
      const { error } = envSchema.validate({}, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error!.details.length).toBeGreaterThan(1);

      const missingFields = error!.details.map(d => d.path[0]);
      expect(missingFields).toContain('MONGODB_URI');
      expect(missingFields).toContain('REDIS_URL');
      expect(missingFields).toContain('JWT_SECRET');
    });
  });
});
