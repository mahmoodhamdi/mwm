# Completed Features Documentation

This document provides a comprehensive overview of all completed features in the MWM platform.

---

## Table of Contents

1. [Backend Features](#backend-features)
2. [Frontend Features](#frontend-features)
3. [Shared Package](#shared-package)
4. [Testing](#testing)
5. [DevOps & Infrastructure](#devops--infrastructure)

---

## Backend Features

### 1. Authentication System

**Status:** COMPLETE

**Location:** `backend/src/controllers/auth.controller.ts`, `backend/src/models/User.ts`

**Functionality:**

- User registration with email verification token generation
- Login with account lock protection (5 failed attempts = 2-hour lock)
- JWT access tokens (15-minute expiry) + refresh tokens (7-day expiry)
- Password reset flow with email tokens
- Email verification flow
- Logout with token invalidation
- Device tracking for refresh tokens

**API Endpoints:**

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/v1/auth/register`        | Register new user      |
| POST   | `/api/v1/auth/login`           | User login             |
| POST   | `/api/v1/auth/refresh-token`   | Refresh JWT            |
| POST   | `/api/v1/auth/forgot-password` | Request password reset |
| POST   | `/api/v1/auth/reset-password`  | Reset password         |
| POST   | `/api/v1/auth/verify-email`    | Verify email           |
| POST   | `/api/v1/auth/logout`          | Logout                 |

**User Model Fields:**

- Basic: name, email, password (bcrypt hashed), avatar, role
- Verification: isEmailVerified, emailVerificationToken, emailVerificationExpires
- Security: twoFactorEnabled, twoFactorSecret, loginAttempts, lockUntil
- Tokens: refreshTokens[] (with device tracking), passwordResetToken
- Audit: lastLogin, passwordChangedAt, createdAt, updatedAt

---

### 2. Services Management

**Status:** COMPLETE

**Location:** `backend/src/controllers/service.controller.ts`, `backend/src/models/Service.ts`

**Functionality:**

- Full CRUD operations for services and categories
- Bilingual content (Arabic/English) for all text fields
- Service features, pricing plans, FAQs, process steps
- Technology stack and related services
- SEO metadata (metaTitle, metaDescription, keywords)
- View count tracking
- Redis caching (30-min TTL) for public endpoints
- Featured services support

**API Endpoints:**

| Method | Endpoint                                | Auth     | Description          |
| ------ | --------------------------------------- | -------- | -------------------- |
| GET    | `/api/v1/services`                      | Public   | List services        |
| GET    | `/api/v1/services/:slug`                | Public   | Get service by slug  |
| GET    | `/api/v1/services/featured`             | Public   | Featured services    |
| GET    | `/api/v1/services/categories`           | Public   | List categories      |
| GET    | `/api/v1/services/admin`                | Required | All services (admin) |
| POST   | `/api/v1/services/admin`                | Required | Create service       |
| PUT    | `/api/v1/services/admin/:id`            | Required | Update service       |
| DELETE | `/api/v1/services/admin/:id`            | Required | Delete service       |
| POST   | `/api/v1/services/admin/categories`     | Required | Create category      |
| PUT    | `/api/v1/services/admin/categories/:id` | Required | Update category      |
| DELETE | `/api/v1/services/admin/categories/:id` | Required | Delete category      |

**Service Model Structure:**

```typescript
{
  title: LocalizedString,
  slug: string,
  shortDescription: LocalizedString,
  description: LocalizedString,
  category: ObjectId,
  features: [{title, description, icon}],
  pricing: [{name, price, currency, period, features[], isPopular}],
  faqs: [{question, answer}],
  processSteps: [{title, description, icon, order}],
  technologies: string[],
  relatedServices: ObjectId[],
  seo: {metaTitle, metaDescription, keywords},
  isFeatured: boolean,
  isActive: boolean,
  viewCount: number
}
```

---

### 3. Projects/Portfolio Management

**Status:** COMPLETE

**Location:** `backend/src/controllers/project.controller.ts`, `backend/src/models/Project.ts`

**Functionality:**

- Full CRUD with publish workflow (draft → published)
- Project gallery with thumbnail, images array, and video support
- Client information and testimonials
- Technology stack with category classification
- Live URL and GitHub repository links
- View tracking with increment method
- Category-based organization
- Featured projects support

**API Endpoints:**

| Method | Endpoint                             | Auth     | Description             |
| ------ | ------------------------------------ | -------- | ----------------------- |
| GET    | `/api/v1/projects`                   | Public   | List published projects |
| GET    | `/api/v1/projects/:slug`             | Public   | Get project by slug     |
| GET    | `/api/v1/projects/featured`          | Public   | Featured projects       |
| GET    | `/api/v1/projects/admin`             | Required | All projects (admin)    |
| POST   | `/api/v1/projects/admin`             | Required | Create project          |
| PUT    | `/api/v1/projects/admin/:id`         | Required | Update project          |
| DELETE | `/api/v1/projects/admin/:id`         | Required | Delete project          |
| PATCH  | `/api/v1/projects/admin/:id/publish` | Required | Publish project         |

**Project Model Structure:**

```typescript
{
  title: LocalizedString,
  slug: string,
  shortDescription: LocalizedString,
  description: LocalizedString,
  challenge: LocalizedString,
  solution: LocalizedString,
  results: LocalizedString,
  thumbnail: string,
  images: string[],
  video: string,
  category: ObjectId,
  client: {name, logo, website},
  testimonial: {text, author, position, photo},
  technologies: [{name, icon, category: 'frontend'|'backend'|'database'|'devops'|'mobile'|'other'}],
  liveUrl: string,
  githubUrl: string,
  duration: string,
  completedAt: Date,
  seo: {title, description, keywords, ogImage},
  isFeatured: boolean,
  isPublished: boolean,
  views: number
}
```

---

### 4. Team Management

**Status:** COMPLETE

**Location:** `backend/src/controllers/team.controller.ts`, `backend/src/models/TeamMember.ts`

**Functionality:**

- Team member profiles with skills visualization
- Department organization
- Skills with proficiency levels (1-100 scale)
- Education and certifications tracking
- Social media links (LinkedIn, Twitter, GitHub, etc.)
- Role classification (leaders, featured, standard)
- Project associations

**API Endpoints:**

| Method | Endpoint                             | Auth     | Description         |
| ------ | ------------------------------------ | -------- | ------------------- |
| GET    | `/api/v1/team/members`               | Public   | List team members   |
| GET    | `/api/v1/team/members/:slug`         | Public   | Get member by slug  |
| GET    | `/api/v1/team/leaders`               | Public   | Get team leaders    |
| GET    | `/api/v1/team/featured`              | Public   | Featured members    |
| GET    | `/api/v1/team/departments`           | Public   | List departments    |
| GET    | `/api/v1/team/admin/members`         | Required | All members (admin) |
| POST   | `/api/v1/team/admin/members`         | Required | Create member       |
| PUT    | `/api/v1/team/admin/members/:id`     | Required | Update member       |
| DELETE | `/api/v1/team/admin/members/:id`     | Required | Delete member       |
| POST   | `/api/v1/team/admin/departments`     | Required | Create department   |
| PUT    | `/api/v1/team/admin/departments/:id` | Required | Update department   |
| DELETE | `/api/v1/team/admin/departments/:id` | Required | Delete department   |

**TeamMember Model Structure:**

```typescript
{
  name: LocalizedString,
  slug: string,
  position: LocalizedString,
  bio: LocalizedString,
  shortBio: LocalizedString,
  department: ObjectId,
  avatar: string,
  coverImage: string,
  skills: [{name: LocalizedString, level: 1-100, category}],
  social: {linkedin, twitter, github, website, email},
  experience: number,
  education: {degree, institution, year},
  certifications: [{name, issuer, year, url}],
  projects: ObjectId[],
  seo: {metaTitle, metaDescription, keywords},
  isLeader: boolean,
  isFeatured: boolean,
  isActive: boolean,
  joinedAt: Date
}
```

---

### 5. Blog System

**Status:** COMPLETE

**Location:** `backend/src/controllers/blog.controller.ts`, `backend/src/models/BlogPost.ts`

**Functionality:**

- Blog posts with draft/published/scheduled/archived states
- Category hierarchy support (parent categories)
- Tags system with bilingual support
- Auto-calculated reading time (200 words/minute)
- View tracking
- Featured posts
- Related posts by category
- Redis caching for public endpoints
- Full-text search capability

**API Endpoints:**

| Method | Endpoint                            | Auth     | Description          |
| ------ | ----------------------------------- | -------- | -------------------- |
| GET    | `/api/v1/blog/categories`           | Public   | List categories      |
| GET    | `/api/v1/blog/categories/:slug`     | Public   | Get category         |
| GET    | `/api/v1/blog/tags`                 | Public   | List all tags        |
| GET    | `/api/v1/blog/featured`             | Public   | Featured posts       |
| GET    | `/api/v1/blog/posts`                | Public   | List published posts |
| GET    | `/api/v1/blog/posts/:slug`          | Public   | Get post by slug     |
| GET    | `/api/v1/blog/posts/:slug/related`  | Public   | Related posts        |
| GET    | `/api/v1/blog/admin/categories`     | Required | All categories       |
| POST   | `/api/v1/blog/admin/categories`     | Required | Create category      |
| PUT    | `/api/v1/blog/admin/categories/:id` | Required | Update category      |
| DELETE | `/api/v1/blog/admin/categories/:id` | Required | Delete category      |
| GET    | `/api/v1/blog/admin/posts`          | Required | All posts (admin)    |
| POST   | `/api/v1/blog/admin/posts`          | Required | Create post          |
| PUT    | `/api/v1/blog/admin/posts/:id`      | Required | Update post          |
| DELETE | `/api/v1/blog/admin/posts/:id`      | Required | Delete post          |

**BlogPost Model Structure:**

```typescript
{
  title: LocalizedString,
  slug: string,
  excerpt: LocalizedString,
  content: LocalizedString,
  featuredImage: string,
  images: string[],
  category: ObjectId,
  tags: LocalizedString[],
  author: ObjectId,
  status: 'draft' | 'published' | 'scheduled' | 'archived',
  publishedAt: Date,
  scheduledAt: Date,
  isFeatured: boolean,
  views: number,
  readingTime: number, // Auto-calculated
  seo: {metaTitle, metaDescription, metaKeywords, ogImage}
}
```

---

### 6. Careers/Jobs System

**Status:** COMPLETE

**Location:** `backend/src/controllers/careers.controller.ts`, `backend/src/models/Job.ts`

**Functionality:**

- Job listings with multiple employment types
- Application tracking system (ATS)
- Salary ranges with public/private visibility
- Application status workflow (8 states)
- Duplicate application prevention
- Application statistics by status
- Department-based organization
- Featured jobs support

**API Endpoints:**

| Method | Endpoint                                        | Auth     | Description         |
| ------ | ----------------------------------------------- | -------- | ------------------- |
| GET    | `/api/v1/careers/jobs`                          | Public   | List open jobs      |
| GET    | `/api/v1/careers/jobs/:slug`                    | Public   | Get job by slug     |
| GET    | `/api/v1/careers/featured`                      | Public   | Featured jobs       |
| POST   | `/api/v1/careers/jobs/:slug/apply`              | Public   | Submit application  |
| GET    | `/api/v1/careers/admin/jobs`                    | Required | All jobs (admin)    |
| POST   | `/api/v1/careers/admin/jobs`                    | Required | Create job          |
| PUT    | `/api/v1/careers/admin/jobs/:id`                | Required | Update job          |
| DELETE | `/api/v1/careers/admin/jobs/:id`                | Required | Delete job          |
| GET    | `/api/v1/careers/admin/jobs/:id/applications`   | Required | List applications   |
| GET    | `/api/v1/careers/admin/applications/:id`        | Required | Application details |
| PATCH  | `/api/v1/careers/admin/applications/:id/status` | Required | Update app status   |
| GET    | `/api/v1/careers/admin/applications/:id/stats`  | Required | Application stats   |

**Job Model Structure:**

```typescript
{
  title: LocalizedString,
  slug: string,
  description: LocalizedString,
  requirements: LocalizedArray,
  responsibilities: LocalizedArray,
  benefits: LocalizedArray,
  department: ObjectId,
  location: LocalizedString,
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote',
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive',
  salary: {min, max, currency, period, isPublic},
  skills: string[],
  status: 'draft' | 'open' | 'closed' | 'filled',
  applicationDeadline: Date,
  applicationsCount: number,
  isFeatured: boolean
}
```

**JobApplication Status Workflow:**

```
pending → reviewing → shortlisted → interviewed → offered → hired
                   ↘                           ↘
                    rejected                    withdrawn
```

---

### 7. Newsletter System

**Status:** COMPLETE

**Location:** `backend/src/controllers/newsletter.controller.ts`, `backend/src/models/Newsletter.ts`

**Functionality:**

- Subscriber management with tags
- Double opt-in with verification tokens
- Unsubscribe with unique tokens
- Campaign creation and scheduling
- Campaign metrics (sent, opened, clicked, bounced, unsubscribed)
- Recipient segmentation (all, by tags, specific subscribers)
- Bulk import capability
- Subscriber statistics

**API Endpoints:**

| Method | Endpoint                                           | Auth     | Description       |
| ------ | -------------------------------------------------- | -------- | ----------------- |
| POST   | `/api/v1/newsletter/subscribe`                     | Public   | Subscribe         |
| POST   | `/api/v1/newsletter/unsubscribe`                   | Public   | Unsubscribe       |
| GET    | `/api/v1/newsletter/admin/subscribers`             | Required | List subscribers  |
| POST   | `/api/v1/newsletter/admin/subscribers`             | Required | Create subscriber |
| PUT    | `/api/v1/newsletter/admin/subscribers/:id`         | Required | Update subscriber |
| POST   | `/api/v1/newsletter/admin/subscribers/bulk-action` | Required | Bulk update       |
| GET    | `/api/v1/newsletter/admin/subscribers/tags`        | Required | Get all tags      |
| GET    | `/api/v1/newsletter/admin/subscribers/stats`       | Required | Subscriber stats  |
| GET    | `/api/v1/newsletter/admin/campaigns`               | Required | List campaigns    |
| POST   | `/api/v1/newsletter/admin/campaigns`               | Required | Create campaign   |
| PUT    | `/api/v1/newsletter/admin/campaigns/:id`           | Required | Update campaign   |
| DELETE | `/api/v1/newsletter/admin/campaigns/:id`           | Required | Delete campaign   |
| POST   | `/api/v1/newsletter/admin/campaigns/:id/schedule`  | Required | Schedule campaign |
| POST   | `/api/v1/newsletter/admin/campaigns/:id/send`      | Required | Send campaign     |
| GET    | `/api/v1/newsletter/admin/campaigns/:id/stats`     | Required | Campaign stats    |

**Subscriber Model:**

```typescript
{
  email: string,
  name: string,
  locale: 'ar' | 'en',
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending',
  source: 'website' | 'import' | 'manual' | 'api',
  tags: string[],
  verificationToken: string, // Auto-generated
  unsubscribeToken: string,  // Auto-generated
  metadata: {ip, userAgent, referrer},
  subscribedAt: Date,
  unsubscribedAt: Date
}
```

**Newsletter Campaign Model:**

```typescript
{
  subject: LocalizedString,
  preheader: LocalizedString,
  content: LocalizedString,
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled',
  recipientType: 'all' | 'tags' | 'specific',
  recipientTags: string[],
  recipientIds: ObjectId[],
  scheduledAt: Date,
  sentAt: Date,
  metrics: {
    recipientCount, sentCount, openCount,
    clickCount, bounceCount, unsubscribeCount
  }
}
```

---

### 8. Contact Form System

**Status:** COMPLETE

**Location:** `backend/src/controllers/contact.controller.ts`, `backend/src/models/Contact.ts`

**Functionality:**

- Contact form submissions
- Priority levels (low, normal, high, urgent)
- Status workflow (new, read, replied, archived, spam)
- Message labeling and starring
- Assignment to team members
- Reply tracking with timestamps
- File attachments support
- Budget range tracking
- Contact preference selection
- reCAPTCHA integration ready
- Statistics dashboard

**API Endpoints:**

| Method | Endpoint                            | Auth     | Description         |
| ------ | ----------------------------------- | -------- | ------------------- |
| POST   | `/api/v1/contact`                   | Public   | Submit contact form |
| GET    | `/api/v1/contact/admin`             | Required | List messages       |
| GET    | `/api/v1/contact/admin/:id`         | Required | Message details     |
| PATCH  | `/api/v1/contact/admin/:id/read`    | Required | Mark as read        |
| PATCH  | `/api/v1/contact/admin/:id/spam`    | Required | Mark as spam        |
| PATCH  | `/api/v1/contact/admin/:id/archive` | Required | Archive message     |
| POST   | `/api/v1/contact/admin/:id/reply`   | Required | Reply to message    |
| GET    | `/api/v1/contact/admin/stats`       | Required | Statistics          |

---

### 9. CMS - Site Content Management

**Status:** COMPLETE

**Location:** `backend/src/controllers/content.controller.ts`, `backend/src/models/SiteContent.ts`

**Functionality:**

- Dynamic content management by key
- Multiple content types: text, html, image, video, array, object, number, boolean
- Section-based organization
- Metadata support (alt text, links, CSS classes)
- Upsert and bulk update operations
- System vs. custom content flags

**API Endpoints:**

| Method | Endpoint                            | Auth     | Description         |
| ------ | ----------------------------------- | -------- | ------------------- |
| GET    | `/api/v1/content/sections/:section` | Required | Get section content |
| GET    | `/api/v1/content/keys/:key`         | Required | Get by key          |
| PUT    | `/api/v1/content/keys/:key`         | Required | Update content      |
| POST   | `/api/v1/content/bulk`              | Required | Bulk update         |
| DELETE | `/api/v1/content/:id`               | Required | Delete content      |

---

### 10. Menu Management

**Status:** COMPLETE

**Location:** `backend/src/controllers/menu.controller.ts`, `backend/src/models/Menu.ts`

**Functionality:**

- Location-based menus (header, footer, sidebar, mobile)
- Unlimited nested menu items
- Internal/external link types
- Icon support
- Item reordering
- Bilingual labels
- Target attributes (\_self, \_blank)

**API Endpoints:**

| Method | Endpoint                                | Auth     | Description      |
| ------ | --------------------------------------- | -------- | ---------------- |
| GET    | `/api/v1/menus/locations/:location`     | Public   | Get by location  |
| GET    | `/api/v1/menus/slugs/:slug`             | Public   | Get by slug      |
| GET    | `/api/v1/menus/admin`                   | Required | List all menus   |
| POST   | `/api/v1/menus/admin`                   | Required | Create menu      |
| PUT    | `/api/v1/menus/admin/:id`               | Required | Update menu      |
| POST   | `/api/v1/menus/admin/:id/items`         | Required | Add menu item    |
| PUT    | `/api/v1/menus/admin/:id/items/:itemId` | Required | Update menu item |
| DELETE | `/api/v1/menus/admin/:id/items/:itemId` | Required | Delete menu item |
| PATCH  | `/api/v1/menus/admin/:id/reorder`       | Required | Reorder items    |

---

### 11. Site Settings

**Status:** COMPLETE

**Location:** `backend/src/controllers/settings.controller.ts`, `backend/src/models/Settings.ts`

**Functionality:**

- Single document pattern (ensures one settings document)
- General: site name, tagline, logo (light/dark), favicon, maintenance mode
- Contact: email, phone, WhatsApp, address (bilingual), coordinates, working hours
- Social: 10 platform links (Facebook, Twitter, Instagram, LinkedIn, GitHub, YouTube, TikTok, Behance, Dribbble)
- SEO: default title/description/keywords, OG image, analytics IDs
- Features: 9 toggles (blog, careers, newsletter, testimonials, dark mode, etc.)
- Homepage: section toggles and order configuration
- Theme: colors, fonts, border radius, button style
- Email: SMTP configuration

**API Endpoints:**

| Method | Endpoint           | Auth     | Description     |
| ------ | ------------------ | -------- | --------------- |
| GET    | `/api/v1/settings` | Required | Get settings    |
| PUT    | `/api/v1/settings` | Required | Update settings |

---

### 12. Translation Management

**Status:** COMPLETE

**Location:** `backend/src/controllers/translation.controller.ts`, `backend/src/models/Translation.ts`

**Functionality:**

- Multi-language support (Arabic/English + extensible)
- 13 namespaces: common, home, about, services, portfolio, team, blog, contact, careers, admin, auth, errors, validation
- Translation search
- Bulk operations
- System vs. custom translation flags

**API Endpoints:**

| Method | Endpoint                                     | Auth     | Description         |
| ------ | -------------------------------------------- | -------- | ------------------- |
| GET    | `/api/v1/translations/namespaces/:namespace` | Required | Get by namespace    |
| GET    | `/api/v1/translations`                       | Required | Get all             |
| POST   | `/api/v1/translations`                       | Required | Create translation  |
| PUT    | `/api/v1/translations/:id`                   | Required | Update translation  |
| POST   | `/api/v1/translations/bulk`                  | Required | Bulk create         |
| GET    | `/api/v1/translations/search`                | Required | Search translations |

---

### 13. Health Check

**Status:** COMPLETE

**Location:** `backend/src/routes/health.routes.ts`

**Functionality:**

- Basic health check endpoint
- Database connection status
- Redis connection status

**API Endpoints:**

| Method | Endpoint         | Auth   | Description   |
| ------ | ---------------- | ------ | ------------- |
| GET    | `/api/v1/health` | Public | Health status |

---

### 14. Dashboard Aggregation System

**Status:** COMPLETE

**Location:** `backend/src/controllers/dashboard.controller.ts`, `backend/src/routes/dashboard.routes.ts`

**Functionality:**

- Centralized dashboard statistics
- Recent activity aggregation (contacts, posts, applications, subscribers)
- Charts data with time series and distributions
- Quick stats for header notifications

**API Endpoints:**

| Method | Endpoint                        | Auth     | Description     |
| ------ | ------------------------------- | -------- | --------------- |
| GET    | `/api/v1/dashboard/stats`       | Required | Get all stats   |
| GET    | `/api/v1/dashboard/activity`    | Required | Recent activity |
| GET    | `/api/v1/dashboard/charts`      | Required | Charts data     |
| GET    | `/api/v1/dashboard/quick-stats` | Required | Quick stats     |

**Stats Response Structure:**

```typescript
{
  contacts: { total: number; unread: number },
  projects: { total: number; published: number },
  services: { total: number; active: number },
  posts: { total: number; published: number },
  jobs: { total: number; open: number },
  applications: { total: number; pending: number },
  subscribers: { total: number; active: number },
  team: { total: number; active: number }
}
```

---

### 15. Activity Logging System

**Status:** COMPLETE

**Location:** `backend/src/models/ActivityLog.ts`, `backend/src/controllers/activity.controller.ts`

**Functionality:**

- Comprehensive activity tracking (create, update, delete, login, logout, view, export, import, publish, unpublish)
- User-based activity logs
- Resource-based activity logs
- Change tracking with old/new values
- IP and user agent logging
- Activity statistics
- Automatic cleanup of old logs

**API Endpoints:**

| Method | Endpoint                              | Auth     | Description         |
| ------ | ------------------------------------- | -------- | ------------------- |
| GET    | `/api/v1/activity`                    | Required | List activity logs  |
| GET    | `/api/v1/activity/user/:userId`       | Required | Logs by user        |
| GET    | `/api/v1/activity/resource/:resource` | Required | Logs by resource    |
| GET    | `/api/v1/activity/recent`             | Required | Recent logs         |
| GET    | `/api/v1/activity/stats`              | Required | Activity statistics |
| GET    | `/api/v1/activity/me`                 | Required | My activity         |
| DELETE | `/api/v1/activity/old`                | Admin    | Delete old logs     |

**ActivityLog Model:**

```typescript
{
  user: ObjectId,
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view' | 'export' | 'import' | 'publish' | 'unpublish',
  resource: string,
  resourceId?: ObjectId,
  resourceTitle?: string,
  details?: Record<string, unknown>,
  changes?: [{ field: string, oldValue: unknown, newValue: unknown }],
  ip?: string,
  userAgent?: string,
  createdAt: Date
}
```

---

### 16. Push Notifications System (FCM)

**Status:** COMPLETE

**Location:** `backend/src/services/notification.service.ts`, `backend/src/controllers/notification.controller.ts`

**Functionality:**

- Firebase Cloud Messaging (FCM) integration
- In-app notifications with bilingual support
- Push notifications to web browsers
- Device token registration and management
- Topic-based notifications
- Notification for various events:
  - New contact messages
  - New job applications
  - New newsletter subscribers
- Admin broadcast notifications
- Mark as read / Mark all as read
- Delete read notifications

**API Endpoints:**

| Method | Endpoint                                          | Auth     | Description         |
| ------ | ------------------------------------------------- | -------- | ------------------- |
| GET    | `/api/v1/notifications`                           | Required | Get notifications   |
| GET    | `/api/v1/notifications/unread-count`              | Required | Unread count        |
| PUT    | `/api/v1/notifications/:id/read`                  | Required | Mark as read        |
| PUT    | `/api/v1/notifications/read-all`                  | Required | Mark all as read    |
| DELETE | `/api/v1/notifications/:id`                       | Required | Delete notification |
| DELETE | `/api/v1/notifications/read`                      | Required | Delete read ones    |
| POST   | `/api/v1/notifications/device-token`              | Required | Register device     |
| DELETE | `/api/v1/notifications/device-token`              | Required | Remove device token |
| GET    | `/api/v1/notifications/device-tokens`             | Required | Get user's tokens   |
| POST   | `/api/v1/notifications/topics/:topic/subscribe`   | Required | Subscribe to topic  |
| POST   | `/api/v1/notifications/topics/:topic/unsubscribe` | Required | Unsubscribe         |
| POST   | `/api/v1/notifications/admin/send`                | Admin    | Send notification   |
| POST   | `/api/v1/notifications/admin/broadcast`           | Admin    | Broadcast to all    |

**Notification Model:**

```typescript
{
  user: ObjectId,
  type: 'info' | 'success' | 'warning' | 'error',
  title: { ar: string, en: string },
  body: { ar: string, en: string },
  link?: string,
  data?: Record<string, string>,
  isRead: boolean,
  readAt?: Date,
  createdAt: Date
}
```

**DeviceToken Model:**

```typescript
{
  user: ObjectId,
  token: string,
  deviceType: 'web' | 'android' | 'ios',
  deviceId?: string,
  deviceName?: string,
  browser?: string,
  os?: string,
  isActive: boolean,
  lastUsedAt: Date
}
```

---

### 17. reCAPTCHA Integration

**Status:** COMPLETE

**Location:** `backend/src/services/recaptcha.service.ts`

**Functionality:**

- Google reCAPTCHA v3 verification
- Score-based spam detection
- Configurable score threshold
- Contact form protection

**Usage:**

```typescript
const result = await verifyRecaptcha(token);
if (!result.success || result.score < 0.5) {
  // Block request - likely spam
}
```

---

## Frontend Features

### 1. Public Pages

**Status:** COMPLETE

| Page           | Route                       | API Connected | Features                             |
| -------------- | --------------------------- | ------------- | ------------------------------------ |
| Home           | `/[locale]`                 | Partial       | Hero, stats, services showcase, CTA  |
| About          | `/[locale]/about`           | Static        | Mission, vision, values, team stats  |
| Services List  | `/[locale]/services`        | YES           | Category filtering, service cards    |
| Service Detail | `/[locale]/services/[slug]` | YES           | Full service info, pricing, FAQs     |
| Projects List  | `/[locale]/projects`        | YES           | Category filtering, project grid     |
| Project Detail | `/[locale]/projects/[slug]` | YES           | Gallery, tech stack, testimonials    |
| Team List      | `/[locale]/team`            | YES           | Department filtering, team grid      |
| Team Member    | `/[locale]/team/[slug]`     | YES           | Profile, skills, education           |
| Blog List      | `/[locale]/blog`            | YES           | Search, categories, tags, pagination |
| Blog Post      | `/[locale]/blog/[slug]`     | YES           | Full content, related posts, share   |
| Careers List   | `/[locale]/careers`         | YES           | Type/department filtering, benefits  |
| Career Detail  | `/[locale]/careers/[slug]`  | YES           | Job details, application form        |
| Contact        | `/[locale]/contact`         | YES           | Contact form, info, map              |

---

### 2. Admin Dashboard Pages

**Status:** MOSTLY COMPLETE (some using mock data)

| Page          | Route                           | API Connected | Features                                   |
| ------------- | ------------------------------- | ------------- | ------------------------------------------ |
| Dashboard     | `/[locale]/admin`               | Mock          | Stats, charts, recent activity             |
| Services      | `/[locale]/admin/services`      | Mock          | CRUD, search, bulk actions, reorder        |
| Projects      | `/[locale]/admin/projects`      | Mock          | CRUD, status filters, featured toggle      |
| Team          | `/[locale]/admin/team`          | Mock          | CRUD, department management, reorder       |
| Blog          | `/[locale]/admin/blog`          | YES           | Posts & categories CRUD, status management |
| Careers       | `/[locale]/admin/careers`       | YES           | Jobs CRUD, application tracking            |
| Newsletter    | `/[locale]/admin/newsletter`    | YES           | Subscribers, campaigns, import/export      |
| Messages      | `/[locale]/admin/messages`      | Mock          | Inbox, status, priority, reply             |
| Content       | `/[locale]/admin/content`       | Mock          | CMS content management                     |
| Settings      | `/[locale]/admin/settings`      | Partial       | General, SEO, theme, features              |
| Translations  | `/[locale]/admin/translations`  | YES           | Namespace-based translation management     |
| Menus         | `/[locale]/admin/menus`         | YES           | Menu builder with drag-drop                |
| Users         | `/[locale]/admin/users`         | YES           | User management, roles                     |
| Analytics     | `/[locale]/admin/analytics`     | UI Only       | Dashboard analytics                        |
| Activity      | `/[locale]/admin/activity`      | UI Only       | Activity log                               |
| Notifications | `/[locale]/admin/notifications` | UI Only       | System notifications                       |

---

### 3. Frontend Services Layer

**Status:** COMPLETE

**Public Services** (`frontend/src/services/public/`):

- `services.service.ts` - Service listings, categories
- `projects.service.ts` - Project listings, categories
- `team.service.ts` - Team members, departments
- `blog.service.ts` - Blog posts, categories, tags
- `careers.service.ts` - Job listings, applications
- `contact.service.ts` - Contact form, newsletter subscription

**Admin Services** (`frontend/src/services/admin/`):

- `content.service.ts` - CMS content CRUD
- `menus.service.ts` - Menu management
- `settings.service.ts` - Site settings
- `translations.service.ts` - Translation management
- `blog.service.ts` - Blog admin operations
- `careers.service.ts` - Careers admin operations
- `newsletter.service.ts` - Newsletter management
- `dashboard.service.ts` - Dashboard stats and activity
- `activity.service.ts` - Activity log management
- `notifications.service.ts` - Notifications management

---

### 4. Push Notifications (Frontend)

**Status:** COMPLETE

**Location:** `frontend/src/lib/firebase.ts`, `frontend/src/hooks/useNotifications.ts`

**Components:**

- `NotificationBell.tsx` - Notification bell with dropdown
- Firebase service worker for background notifications

**Functionality:**

- Firebase Cloud Messaging client integration
- Push notification permission request
- Foreground message handling
- Background message handling via service worker
- Notification bell with unread count
- Mark as read functionality
- Real-time notification updates

**Hooks:**

```typescript
const {
  notifications,
  unreadCount,
  isLoading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  refetch,
} = useNotifications();
```

---

### 4. Components

**Status:** COMPLETE (all with tests)

**UI Components:** Button, Card, Container, Input, Modal, Spinner, Skeleton, LazyImage

**Layout Components:** Header, Footer, AdminLayout, AdminHeader, AdminSidebar

**Domain Components:**

- Services: ServiceCard, FAQAccordion, PricingCard, ProcessSteps
- Projects: ProjectCard, ProjectGrid, Gallery, TechStack
- Team: TeamCard, TeamGrid, SkillsChart
- Contact: ContactForm, ContactInfo
- Admin: DataTable, StatsCard, DashboardCharts, RecentActivity

**Common Components:** Newsletter, LanguageSwitcher

**SEO Components:** MetaTags, JsonLd

---

### 5. Custom Hooks

**Status:** COMPLETE (all with tests)

| Hook                      | Purpose                         |
| ------------------------- | ------------------------------- |
| `useLocalStorage`         | Persist data to browser storage |
| `useDebounce`             | Debounce values                 |
| `useDebouncedCallback`    | Debounce callback functions     |
| `useMediaQuery`           | Responsive design queries       |
| `useIsMobile`             | Mobile viewport detection       |
| `useIsTablet`             | Tablet viewport detection       |
| `useIsDesktop`            | Desktop viewport detection      |
| `usePrefersDarkMode`      | Dark mode preference            |
| `usePrefersReducedMotion` | Reduced motion accessibility    |
| `useClickOutside`         | Click outside detection         |
| `useIntersectionObserver` | Intersection Observer API       |
| `useLazyLoad`             | Lazy loading                    |

---

### 6. Internationalization (i18n)

**Status:** COMPLETE

- Library: next-intl
- Locales: Arabic (ar) - default, English (en)
- Direction: RTL for Arabic, LTR for English
- Fonts: Cairo for Arabic, Inter for English
- Translation files: `frontend/src/messages/ar.json`, `en.json`
- Namespaces: common, nav, home, about, services, projects, blog, contact, careers

---

## Shared Package

**Location:** `packages/shared/`

### Types Exported

- `Locale`, `Direction`, `LocalizedString`, `LocalizedArray`
- `ApiResponse<T>`, `ApiError`, `ResponseMeta`, `PaginationMeta`
- `PaginationParams`, `SortParams`, `FilterParams`, `QueryParams`
- `UserRole`, `IUser`
- `SeoMeta`, `PublishStatus`, `ContactStatus`
- `BaseEntity`, `PublishableEntity`

### Constants Exported

- Localization: `LOCALES`, `DEFAULT_LOCALE`, `LOCALE_CONFIG`
- Pagination: `DEFAULT_PAGE`, `DEFAULT_LIMIT`, `MAX_LIMIT`
- User roles: `USER_ROLES`, `PERMISSIONS`, `ROLE_PERMISSIONS`
- Error codes: 24 error code constants
- HTTP status codes
- Regex patterns for validation
- File upload limits and types

### Utilities Exported (18 functions)

- `getLocalizedValue`, `createLocalizedString`
- `generateSlug`, `calculatePagination`, `calculateSkip`, `parseSortString`
- `sanitizeObject`, `delay`
- `formatDate`, `formatNumber`, `formatCurrency`
- `calculateReadingTime`, `truncateText`
- `isEmpty`, `deepClone`, `pick`, `omit`

---

## Testing

### Backend Tests (27 files)

**Unit Tests (18 model tests):**
All models have dedicated test files covering:

- Schema validation
- Static methods
- Instance methods
- Virtual fields
- Indexes

**Integration Tests:**

- `auth.test.ts` - Authentication flow
- `database.test.ts` - MongoDB connection
- `health.test.ts` - Health endpoint
- `docker-health.test.ts` - Docker environment

**Middleware/Utility Tests:**

- `validate.test.ts`, `ApiError.test.ts`, `response.test.ts`, `helpers.test.ts`, `env.test.ts`

### Frontend Tests (42 files)

**Component Tests (26):** All UI, domain, and admin components tested

**Hook Tests (4):** Core hooks tested

**Service Tests (2):** Blog and careers services with 35+ tests each

### E2E Tests (14 files)

- `home.spec.ts` - Home page, language switching, performance
- `navigation.spec.ts` - Public page navigation
- `contact.spec.ts` - Contact form
- `blog.spec.ts` - Blog functionality
- `careers.spec.ts` - Job listings and applications
- `projects.spec.ts` - Portfolio
- `team.spec.ts` - Team pages
- `services.spec.ts` - Services pages
- `forms.spec.ts` - Form submissions
- `comprehensive.spec.ts` - Full user journeys
- `screenshots.spec.ts` - Screenshot generation
- `admin/auth.spec.ts` - Admin authentication
- `admin/dashboard.spec.ts` - Admin dashboard
- `admin/comprehensive.spec.ts` - Admin CRUD operations

---

## DevOps & Infrastructure

### Docker Configuration

**Status:** COMPLETE

- `docker/docker-compose.dev.yml` - Development environment
- `docker/docker-compose.prod.yml` - Production environment
- `backend/Dockerfile.prod` - Backend production image
- `frontend/Dockerfile.prod` - Frontend production image

### CI/CD Pipeline

**Status:** COMPLETE

**GitHub Actions Workflows:**

1. **CI Pipeline** (`.github/workflows/ci.yml`):
   - Lint (ESLint + Prettier)
   - Backend tests with MongoDB/Redis services
   - Frontend tests
   - Build all packages
   - Docker image build verification

2. **CD Pipeline** (`.github/workflows/cd.yml`):
   - Production deployment configuration

3. **Security Scan** (`.github/workflows/security-scan.yml`):
   - Dependency vulnerability scanning

### Git Hooks

**Status:** COMPLETE

- Husky for pre-commit hooks
- lint-staged for staged file linting
- Commitlint with conventional commits

### Documentation

**Status:** COMPLETE

- `CLAUDE.md` - Developer guidance
- `README.md` - Project overview
- `docs/DEVELOPMENT_PLAN.md` - Roadmap
- `docs/ADMIN_GUIDE.md` - Admin user guide
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/PROJECT_ROUTES.md` - Routes reference

---

## Summary Statistics

| Category              | Count |
| --------------------- | ----- |
| Backend Models        | 22    |
| Backend Controllers   | 14    |
| Backend Routes        | 16    |
| API Endpoints         | 130+  |
| Frontend Public Pages | 13    |
| Frontend Admin Pages  | 16    |
| Frontend Components   | 42+   |
| Frontend Services     | 17    |
| Custom Hooks          | 13    |
| Shared Types          | 24    |
| Shared Utilities      | 18    |
| Backend Test Files    | 27    |
| Frontend Test Files   | 42    |
| E2E Test Files        | 14    |

---

_Last Updated: 2025-12-16_
