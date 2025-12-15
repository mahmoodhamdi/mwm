# MWM Project - Credentials & Environment Variables Guide

This document lists all credentials and environment variables needed for:

1. Local development
2. GitHub Secrets for CI/CD
3. Production deployment

---

## Backend Environment Variables (.env)

Create `backend/.env` file with these variables:

```bash
# ============ REQUIRED ============

# Application
NODE_ENV=development
PORT=5000

# Database (MongoDB)
MONGODB_URI=mongodb://admin:password@localhost:27017/mwm?authSource=admin

# Redis
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000

# ============ FIREBASE (for Push Notifications & Google Auth) ============

FIREBASE_PROJECT_ID=mwmintegratedsoftwaresolutions
FIREBASE_PRIVATE_KEY_ID=5e1ddd1634cdfde0bdc8acc2664f75bdeb5aee14
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mwmintegratedsoftwaresolutions.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=111615860378198876202
FIREBASE_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mwmintegratedsoftwaresolutions.iam.gserviceaccount.com

# ============ OPTIONAL (Recommended for Production) ============

# Cloudinary (Image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP (Email service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mwm.softwars.solutions@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="MWM <mwm.softwars.solutions@gmail.com>"

# reCAPTCHA (Form protection)
RECAPTCHA_SECRET_KEY=

# GitHub OAuth (for GitHub Sign-in)
GITHUB_CLIENT_ID=Ov23likxc956Bu4pjDNt
GITHUB_CLIENT_SECRET=7134678552de97be598d9951675837f8e12361c2

# Sentry (Error tracking)
SENTRY_DSN=
```

---

## Frontend Environment Variables (.env.local)

Create `frontend/.env.local` file with these variables:

```bash
# ============ REQUIRED ============

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============ FIREBASE (Get from Firebase Console > Project Settings > General > Your apps) ============

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBB3DLoOOTFNPazc2Dw6cb5gabKgYFVL9k
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mwmintegratedsoftwaresolutions.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mwmintegratedsoftwaresolutions
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mwmintegratedsoftwaresolutions.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=325449130166
NEXT_PUBLIC_FIREBASE_APP_ID=1:325449130166:web:5b327be2242ca5bc700617
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XBL3PT6EFX

# Firebase Cloud Messaging VAPID Key
# Get from: Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# ============ OPTIONAL ============

# reCAPTCHA Site Key (from Google reCAPTCHA admin console)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# GitHub OAuth (for GitHub Sign-in)
NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23likxc956Bu4pjDNt
```

---

## GitHub Secrets for CI/CD

Add these secrets in: **GitHub Repository > Settings > Secrets and variables > Actions**

### Required Secrets

| Secret Name          | Description                       | Example Value                                      |
| -------------------- | --------------------------------- | -------------------------------------------------- |
| `MONGODB_URI`        | MongoDB connection string         | `mongodb+srv://user:pass@cluster.mongodb.net/mwm`  |
| `REDIS_URL`          | Redis connection string           | `redis://default:password@redis-host:6379`         |
| `JWT_SECRET`         | JWT signing secret (min 32 chars) | `your-super-secret-jwt-key-min-32-characters-long` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret          | `your-refresh-secret-key-min-32-characters-long`   |

### Firebase Secrets

| Secret Name               | Description                        |
| ------------------------- | ---------------------------------- |
| `FIREBASE_PROJECT_ID`     | `mwmintegratedsoftwaresolutions`   |
| `FIREBASE_PRIVATE_KEY_ID` | From Firebase Admin SDK JSON       |
| `FIREBASE_PRIVATE_KEY`    | Full private key with `\n` escapes |
| `FIREBASE_CLIENT_EMAIL`   | Service account email              |
| `FIREBASE_CLIENT_ID`      | Service account client ID          |
| `FIREBASE_CERT_URL`       | Certificate URL                    |

### GitHub OAuth Secrets

| Secret Name                    | Description               | Value                                      |
| ------------------------------ | ------------------------- | ------------------------------------------ |
| `GITHUB_CLIENT_ID`             | GitHub OAuth Client ID    | `Ov23likxc956Bu4pjDNt`                     |
| `GITHUB_CLIENT_SECRET`         | GitHub OAuth Secret       | `7134678552de97be598d9951675837f8e12361c2` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | Frontend GitHub Client ID | `Ov23likxc956Bu4pjDNt`                     |

### Frontend Public Variables

| Secret Name                                | Description                    |
| ------------------------------------------ | ------------------------------ |
| `NEXT_PUBLIC_API_URL`                      | Backend API URL (production)   |
| `NEXT_PUBLIC_SITE_URL`                     | Frontend site URL (production) |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase Web API Key           |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain           |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase Project ID            |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket        |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID                  |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase App ID                |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY`           | FCM VAPID Key                  |

### Optional Secrets (Production)

| Secret Name                      | Description                |
| -------------------------------- | -------------------------- |
| `CLOUDINARY_CLOUD_NAME`          | Cloudinary cloud name      |
| `CLOUDINARY_API_KEY`             | Cloudinary API key         |
| `CLOUDINARY_API_SECRET`          | Cloudinary API secret      |
| `SMTP_HOST`                      | SMTP server host           |
| `SMTP_PORT`                      | SMTP server port           |
| `SMTP_USER`                      | SMTP username              |
| `SMTP_PASS`                      | SMTP password/app password |
| `EMAIL_FROM`                     | Email sender address       |
| `RECAPTCHA_SECRET_KEY`           | reCAPTCHA secret key       |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key         |
| `SENTRY_DSN`                     | Sentry error tracking DSN  |

---

## Firebase Console Setup

### 1. Get Web SDK Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `mwmintegratedsoftwaresolutions`
3. Click gear icon > **Project settings**
4. Scroll to **Your apps** section
5. Click **Add app** > Web app (if not exists)
6. Copy the config values for frontend `.env.local`

### 2. Enable Google Authentication

1. Go to **Build > Authentication**
2. Click **Sign-in method**
3. Enable **Google** provider
4. Add authorized domains (your production domain)

### 3. Get VAPID Key for FCM

1. Go to **Project settings > Cloud Messaging**
2. Scroll to **Web Push certificates**
3. Click **Generate key pair** (if not exists)
4. Copy the **Key pair** value for `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

### 4. Update Service Worker

After getting Firebase Web config, update `frontend/public/firebase-messaging-sw.js`:

```javascript
firebase.initializeApp({
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'mwmintegratedsoftwaresolutions.firebaseapp.com',
  projectId: 'mwmintegratedsoftwaresolutions',
  storageBucket: 'mwmintegratedsoftwaresolutions.firebasestorage.app',
  messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'YOUR_FIREBASE_APP_ID',
});
```

---

## CI/CD Workflow Configuration

The GitHub Actions workflow (`/.github/workflows/ci.yml`) should use these secrets:

```yaml
env:
  # Backend
  NODE_ENV: test
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
  REDIS_URL: ${{ secrets.REDIS_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  JWT_REFRESH_SECRET: ${{ secrets.JWT_REFRESH_SECRET }}

  # Firebase
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
  FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
  FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}

  # GitHub OAuth
  GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
  GITHUB_CLIENT_SECRET: ${{ secrets.GITHUB_CLIENT_SECRET }}

  # Frontend
  NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
  NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
  NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
  NEXT_PUBLIC_GITHUB_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GITHUB_CLIENT_ID }}
```

---

## Security Notes

1. **Never commit secrets** - All `.env` files are in `.gitignore`
2. **Rotate secrets regularly** - Change JWT secrets and API keys periodically
3. **Use strong secrets** - JWT secrets should be at least 32 characters
4. **Firebase Private Key** - When adding to GitHub Secrets, include the full key with `\n` characters
5. **Service Worker** - The Firebase config in service worker is public (it's client-side code)

---

## Quick Setup Checklist

### Local Development

- [ ] Copy `backend/.env.example` to `backend/.env` and fill values
- [ ] Copy `frontend/.env.example` to `frontend/.env.local` and fill values
- [ ] Update `frontend/public/firebase-messaging-sw.js` with Firebase config
- [ ] Start MongoDB and Redis (via Docker or locally)
- [ ] Run `npm run dev` from root

### GitHub Secrets

- [ ] Add all required secrets listed above
- [ ] Test CI/CD pipeline with a PR

### Firebase

- [ ] Enable Google Auth in Firebase Console
- [ ] Generate VAPID key for FCM
- [ ] Add production domain to authorized domains

---

**Last Updated:** December 15, 2025
