/**
 * Environment Configuration
 * إعدادات البيئة
 */

import { config } from 'dotenv';
import Joi from 'joi';

// Load environment variables
config();

// Environment validation schema
const envSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),

  // Database
  MONGODB_URI: Joi.string().required().description('MongoDB connection URI'),

  // Redis
  REDIS_URL: Joi.string().required().description('Redis connection URL'),

  // JWT
  JWT_SECRET: Joi.string().min(32).required().description('JWT secret key'),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  CLIENT_URL: Joi.string().default('http://localhost:3000'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
  CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
  CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),

  // SMTP
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().allow('').optional(),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  EMAIL_FROM: Joi.string().allow('').optional(),

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: Joi.string().allow('').optional(),

  // Sentry
  SENTRY_DSN: Joi.string().allow('').optional(),

  // Firebase
  FIREBASE_PROJECT_ID: Joi.string().allow('').optional(),
  FIREBASE_PRIVATE_KEY_ID: Joi.string().allow('').optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().allow('').optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().allow('').optional(),
  FIREBASE_CLIENT_ID: Joi.string().allow('').optional(),
  FIREBASE_CERT_URL: Joi.string().allow('').optional(),
})
  .unknown()
  .required();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  const missingVars = error.details.map(detail => detail.message).join('\n');
  throw new Error(`Environment validation error:\n${missingVars}`);
}

// Export validated environment configuration
export const env = {
  // Application
  nodeEnv: envVars.NODE_ENV as 'development' | 'production' | 'test',
  port: envVars.PORT as number,
  isDev: envVars.NODE_ENV === 'development',
  isProd: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',

  // Database
  mongodbUri: envVars.MONGODB_URI as string,

  // Redis
  redisUrl: envVars.REDIS_URL as string,

  // JWT
  jwt: {
    secret: envVars.JWT_SECRET as string,
    expiresIn: envVars.JWT_EXPIRES_IN as string,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN as string,
  },

  // CORS
  corsOrigin: envVars.CORS_ORIGIN as string,
  clientUrl: envVars.CLIENT_URL as string,

  // Cloudinary
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME as string | undefined,
    apiKey: envVars.CLOUDINARY_API_KEY as string | undefined,
    apiSecret: envVars.CLOUDINARY_API_SECRET as string | undefined,
  },

  // SMTP
  smtp: {
    host: envVars.SMTP_HOST as string | undefined,
    port: envVars.SMTP_PORT as number | undefined,
    user: envVars.SMTP_USER as string | undefined,
    pass: envVars.SMTP_PASS as string | undefined,
    from: envVars.EMAIL_FROM as string | undefined,
  },

  // reCAPTCHA
  recaptchaSecretKey: envVars.RECAPTCHA_SECRET_KEY as string | undefined,

  // Sentry
  sentryDsn: envVars.SENTRY_DSN as string | undefined,

  // Firebase
  firebase: {
    projectId: envVars.FIREBASE_PROJECT_ID as string | undefined,
    privateKeyId: envVars.FIREBASE_PRIVATE_KEY_ID as string | undefined,
    privateKey: envVars.FIREBASE_PRIVATE_KEY as string | undefined,
    clientEmail: envVars.FIREBASE_CLIENT_EMAIL as string | undefined,
    clientId: envVars.FIREBASE_CLIENT_ID as string | undefined,
    certUrl: envVars.FIREBASE_CERT_URL as string | undefined,
  },
} as const;

export type Env = typeof env;
