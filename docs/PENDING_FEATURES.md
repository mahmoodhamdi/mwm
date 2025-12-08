# Pending Features & Implementation Steps

This document outlines all incomplete features, known issues, and the steps required to complete them.

---

## Table of Contents

1. [High Priority - Blocking Production](#high-priority---blocking-production)
2. [Medium Priority - Feature Completion](#medium-priority---feature-completion)
3. [Low Priority - Enhancements](#low-priority---enhancements)
4. [Known TODOs in Codebase](#known-todos-in-codebase)
5. [Production Deployment Checklist](#production-deployment-checklist)

---

## High Priority - Blocking Production

### 1. Contact Form Backend Enhancements

**Status:** COMPLETED

**Location:** `backend/src/controllers/contact.controller.ts`

**Completed Items:**

1. **reCAPTCHA verification** - Implemented in `backend/src/services/recaptcha.service.ts`
2. **Admin email notification** - Implemented via FCM push notifications (`notifyNewContact`)
3. **Email reply to contact** - Implemented in `backend/src/services/email.service.ts` (`sendContactReply`)

---

### 2. E2E Test Coverage Expansion

**Status:** Partial coverage

**Location:** `frontend/e2e/`

**Missing Tests:**

1. Admin CRUD operations (create, update, delete)
2. Form submissions with validation errors
3. Dark mode toggle
4. Newsletter subscription flow
5. Admin permission-based access
6. File uploads
7. Email verification flow

**Steps to Complete:**

```bash
# Step 1: Create admin CRUD tests for services
```

**File:** `frontend/e2e/admin/services.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Services Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/en/admin/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/en/admin');
  });

  test('should create a new service', async ({ page }) => {
    await page.goto('/en/admin/services');
    await page.click('[data-testid="add-service-btn"]');

    // Fill form
    await page.fill('[name="title.en"]', 'Test Service');
    await page.fill('[name="title.ar"]', 'خدمة اختبار');
    await page.fill('[name="shortDescription.en"]', 'Test description');
    await page.fill('[name="shortDescription.ar"]', 'وصف اختباري');

    await page.click('button[type="submit"]');

    // Verify creation
    await expect(page.locator('text=Test Service')).toBeVisible();
  });

  test('should update a service', async ({ page }) => {
    await page.goto('/en/admin/services');
    await page.click('[data-testid="edit-btn"]:first-child');

    await page.fill('[name="title.en"]', 'Updated Service');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Updated Service')).toBeVisible();
  });

  test('should delete a service', async ({ page }) => {
    await page.goto('/en/admin/services');
    const serviceName = await page
      .locator('[data-testid="service-name"]:first-child')
      .textContent();

    await page.click('[data-testid="delete-btn"]:first-child');
    await page.click('[data-testid="confirm-delete"]');

    await expect(page.locator(`text=${serviceName}`)).not.toBeVisible();
  });
});
```

```bash
# Step 2: Create form validation tests
```

**File:** `frontend/e2e/forms/validation.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test('contact form shows validation errors', async ({ page }) => {
    await page.goto('/en/contact');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Message is required')).toBeVisible();
  });

  test('email validation works', async ({ page }) => {
    await page.goto('/en/contact');

    await page.fill('[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email')).toBeVisible();
  });
});
```

```bash
# Step 3: Create dark mode tests
```

**File:** `frontend/e2e/theme.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/en');

    // Get initial state
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    // Click dark mode toggle
    await page.click('[data-testid="theme-toggle"]');

    // Verify class changed
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);

    // Verify dark mode persists on reload
    await page.reload();
    const persistedClass = await html.getAttribute('class');
    expect(persistedClass).toBe(newClass);
  });
});
```

```bash
# Step 4: Create newsletter subscription tests
```

**File:** `frontend/e2e/newsletter.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscription', () => {
  test('should subscribe successfully', async ({ page }) => {
    await page.goto('/en');

    await page.fill('[data-testid="newsletter-email"]', 'test@example.com');
    await page.click('[data-testid="newsletter-submit"]');

    await expect(page.locator('text=Successfully subscribed')).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/en');

    await page.fill('[data-testid="newsletter-email"]', 'invalid');
    await page.click('[data-testid="newsletter-submit"]');

    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('should show error for duplicate subscription', async ({ page }) => {
    await page.goto('/en');

    // Subscribe first time
    await page.fill('[data-testid="newsletter-email"]', 'existing@example.com');
    await page.click('[data-testid="newsletter-submit"]');

    // Try to subscribe again
    await page.fill('[data-testid="newsletter-email"]', 'existing@example.com');
    await page.click('[data-testid="newsletter-submit"]');

    await expect(page.locator('text=Already subscribed')).toBeVisible();
  });
});
```

**Running E2E Tests:**

```bash
cd frontend

# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test admin/services.spec.ts

# Run in UI mode for debugging
npx playwright test --ui

# Generate report
npx playwright show-report
```

---

## Medium Priority - Feature Completion

### 3. Admin Dashboard - Connect to Real APIs

**Status:** COMPLETED

**Location:** `frontend/src/app/[locale]/admin/`

**Completed Pages:**

| Page       | Status    | Service File            |
| ---------- | --------- | ----------------------- |
| Dashboard  | CONNECTED | `dashboard.service.ts`  |
| Blog       | CONNECTED | `blog.service.ts`       |
| Careers    | CONNECTED | `careers.service.ts`    |
| Newsletter | CONNECTED | `newsletter.service.ts` |
| Messages   | CONNECTED | API ready               |
| Services   | CONNECTED | API ready               |
| Projects   | CONNECTED | API ready               |
| Team       | CONNECTED | API ready               |

---

### 4. Admin Dashboard Aggregation Endpoint

**Status:** COMPLETED

**Location:** `backend/src/controllers/dashboard.controller.ts`, `backend/src/routes/dashboard.routes.ts`

**Implemented Endpoints:**

- `GET /api/v1/dashboard/stats` - Get all statistics
- `GET /api/v1/dashboard/activity` - Get recent activity
- `GET /api/v1/dashboard/charts` - Get charts data
- `GET /api/v1/dashboard/quick-stats` - Get quick stats for header

---

### 5. Analytics Admin Page

**Status:** UI only, no functionality

**Location:** `frontend/src/app/[locale]/admin/analytics/page.tsx`

**Steps:**

```bash
# Step 1: Decide on analytics implementation
```

**Options:**

1. **Google Analytics Integration**
   - Use GA4 API to fetch data
   - Display in admin dashboard
   - Requires GA4 property setup

2. **Custom Analytics**
   - Track page views in database
   - Track user interactions
   - Build custom reports

3. **Third-party Service**
   - Integrate Plausible, Fathom, or similar
   - Privacy-focused alternative

```bash
# Step 2: For Google Analytics integration
```

**File:** `backend/src/services/analytics.service.ts` (NEW)

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY,
  },
});

export async function getPageViews(startDate: string, endDate: string) {
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
  });

  return response.rows?.map(row => ({
    page: row.dimensionValues?.[0].value,
    views: parseInt(row.metricValues?.[0].value || '0'),
  }));
}
```

---

### 6. Activity Log Admin Page

**Status:** COMPLETED

**Location:** `backend/src/models/ActivityLog.ts`, `backend/src/controllers/activity.controller.ts`

**Implemented Features:**

- ActivityLog model with comprehensive tracking
- Activity controller with CRUD operations
- Activity statistics endpoint
- User-based and resource-based log filtering
- Automatic cleanup of old logs
- Frontend service: `frontend/src/services/admin/activity.service.ts`

---

### 7. Notifications System

**Status:** COMPLETED

**Location:** `backend/src/services/notification.service.ts`, `backend/src/controllers/notification.controller.ts`

**Implemented Features:**

- Notification model with bilingual support
- DeviceToken model for FCM token storage
- Full CRUD operations for notifications
- FCM push notifications integration
- Device token registration
- Topic subscription/unsubscription
- Admin broadcast notifications
- Frontend components: `NotificationBell.tsx`, `useNotifications.ts`
- Firebase service worker for background notifications

---

## Low Priority - Enhancements

### 8. Real-time Notifications with WebSockets

**Status:** Not implemented

**Steps:**

```bash
# Step 1: Setup Socket.io (already in dependencies)
```

**File:** `backend/src/config/socket.ts` (NEW)

```typescript
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '@services/auth.service';

let io: Server;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(','),
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.id;
    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`);
    });
  });

  return io;
}

export function emitNotification(userId: string, notification: unknown) {
  io?.to(`user:${userId}`).emit('notification', notification);
}

export function emitToAdmins(event: string, data: unknown) {
  io?.to('admins').emit(event, data);
}
```

---

### 9. Image Upload to Cloudinary

**Status:** Configured but not fully integrated

**Steps:**

```bash
# Step 1: Create upload service
```

**File:** `backend/src/services/upload.service.ts` (NEW)

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `mwm/${folder}`,
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              url: result!.secure_url,
              publicId: result!.public_id,
            });
        }
      )
      .end(file.buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
```

```bash
# Step 2: Create upload routes
```

**File:** `backend/src/routes/upload.routes.ts` (NEW)

```typescript
import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '@middlewares/auth';
import { uploadImage, deleteImage } from '@services/upload.service';
import { sendSuccess, sendError } from '@utils/response';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/:folder', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No file uploaded');
    }
    const result = await uploadImage(req.file, req.params.folder);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 500, 'Upload failed');
  }
});

router.delete('/:publicId', authenticate, async (req, res) => {
  try {
    await deleteImage(req.params.publicId);
    sendSuccess(res, { message: 'Image deleted' });
  } catch (error) {
    sendError(res, 500, 'Delete failed');
  }
});

export default router;
```

---

## Known TODOs in Codebase

| Location                                        | Line | Description                                | Status    |
| ----------------------------------------------- | ---- | ------------------------------------------ | --------- |
| `backend/src/controllers/contact.controller.ts` | 44   | Verify reCAPTCHA token                     | COMPLETED |
| `backend/src/controllers/contact.controller.ts` | 74   | Send email notification to admin           | COMPLETED |
| `backend/src/controllers/contact.controller.ts` | 213  | Send email to contact if sendEmail is true | COMPLETED |

---

## Production Deployment Checklist

### Pre-Deployment

- [ ] All E2E tests passing
- [ ] Contact form TODOs completed
- [ ] Admin pages connected to APIs
- [ ] Environment variables configured
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Database backup strategy in place

### Server Setup

```bash
# Step 1: Server requirements
- Ubuntu 22.04 LTS
- Node.js 20.x
- MongoDB 7.x
- Redis 7.x
- Nginx
- PM2

# Step 2: Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# Step 3: Install MongoDB
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# Step 4: Install Redis
sudo apt install redis-server

# Step 5: Configure Nginx (see docs/DEPLOYMENT.md)

# Step 6: Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Step 7: Deploy application
git clone https://github.com/your-org/mwm.git
cd mwm
npm ci
npm run build

# Step 8: Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Post-Deployment

- [ ] Verify all pages load correctly
- [ ] Test contact form submission
- [ ] Test admin login
- [ ] Verify bilingual support
- [ ] Check SEO meta tags
- [ ] Monitor error logs
- [ ] Setup monitoring alerts

---

## Summary

| Category         | Items    | Status                                                                                                                          |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| High Priority    | 2        | Contact TODOs (COMPLETED), E2E Tests (Partial)                                                                                  |
| Medium Priority  | 5        | Admin API (COMPLETED), Dashboard endpoint (COMPLETED), Analytics (Pending), Activity Log (COMPLETED), Notifications (COMPLETED) |
| Low Priority     | 2        | WebSockets (Pending), Image Upload (Pending)                                                                                    |
| Production Tasks | Multiple | Server setup, SSL, monitoring                                                                                                   |

**Completed in this Update:**

- reCAPTCHA verification for contact form
- Admin email notifications via FCM
- Contact reply emails
- Dashboard aggregation endpoint
- Activity logging system
- Push notifications with FCM (Backend + Frontend)
- Admin services connected to real APIs

**Remaining:**

- E2E Test Coverage Expansion
- Analytics Admin Page (Google Analytics integration)
- Real-time WebSocket notifications
- Image Upload to Cloudinary
- Production deployment

---

_Last Updated: 2025-12-08_
