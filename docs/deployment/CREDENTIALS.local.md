# MWM Credentials Template

This file contains all required credentials for MWM deployment.
**DO NOT commit this file with actual values to version control!**

---

## Backend Environment Variables

### Database

```env
MONGODB_URI=mongodb://localhost:27017/mwm
MONGODB_DB_NAME=mwm
```

### Redis

```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
```

### JWT Authentication

```env
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Email (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=MWM <noreply@mwm.com>
```

### Cloudinary (Image Upload)

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Firebase Admin SDK (Push Notifications)

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### reCAPTCHA

```env
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Server

```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://mwm.com,https://www.mwm.com
```

---

## Frontend Environment Variables

### API Configuration

```env
NEXT_PUBLIC_API_URL=https://api.mwm.com/api/v1
NEXT_PUBLIC_SITE_URL=https://mwm.com
```

### Firebase Web SDK (Push Notifications)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### reCAPTCHA

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Analytics (Optional)

```env
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] MongoDB instance running and accessible
- [ ] Redis instance running and accessible
- [ ] SMTP credentials tested
- [ ] Cloudinary account configured
- [ ] Firebase project set up
- [ ] reCAPTCHA keys obtained
- [ ] SSL certificates configured
- [ ] Domain DNS configured

### Database Setup

```bash
# Seed initial data
cd backend && npm run seed
```

### Production Build

```bash
# Build shared package
cd packages/shared && npm run build

# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

### Health Check Endpoints

- Backend: `GET /api/v1/health`
- Frontend: `GET /api/health` (Next.js built-in)

---

## Service Accounts

### MongoDB Atlas (if using cloud)

- **Cluster:** mwm-production
- **Database User:** mwm_app
- **IP Whitelist:** Add production server IP

### Cloudinary

- **Account:** Your Cloudinary account
- **Upload Preset:** mwm-uploads
- **Folder Structure:**
  - `/mwm/services` - Service images
  - `/mwm/projects` - Project images
  - `/mwm/team` - Team member photos
  - `/mwm/blog` - Blog post images

### Firebase

- **Project:** Your Firebase project
- **Services Enabled:**
  - Cloud Messaging (FCM)
  - Authentication (optional)

### Google reCAPTCHA

- **Type:** reCAPTCHA v3
- **Domains:** Add production domain

---

## Security Notes

1. **Never commit** this file with actual credentials
2. Use **secrets management** in production (AWS Secrets Manager, HashiCorp Vault, etc.)
3. **Rotate credentials** regularly
4. Use **strong passwords** (32+ characters for JWT secrets)
5. **Restrict IP access** where possible
6. Enable **2FA** on all service accounts
7. Use **least privilege** principle for service accounts

---

## Contacts

### Owner

- **Name:** [Your Name]
- **Email:** hmdy7486@gmail.com / mwm.softwars.solutions@gmail.com
- **Phone:** +201019793768

### DevOps

- **Contact:** [DevOps Contact]

### Emergency

- **On-call:** [On-call Contact]

---

**Last Updated:** December 15, 2025
**Template Version:** 1.0
