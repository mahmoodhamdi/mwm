# MWM Production Readiness Plan

**Date:** December 16, 2025
**Status:** Planning Phase
**Last Updated:** December 16, 2025

---

## Executive Summary

This document outlines the remaining work required to make the MWM project production-ready. Based on comprehensive code review and exploration, the following areas need attention:

### Priority Overview

| Priority      | Category     | Items                               |
| ------------- | ------------ | ----------------------------------- |
| P0 (Critical) | Security     | CSRF Protection, httpOnly Cookies   |
| P1 (High)     | Features     | Resume File Upload, Comments System |
| P2 (Medium)   | Features     | Save/Bookmark Posts, Rate Limiting  |
| P3 (Low)      | Enhancements | CSP Headers, Additional Tests       |

---

## Phase 1: Security Hardening (P0 - Critical)

### 1.1 Migrate JWT to httpOnly Cookies

**Current State:** JWT tokens stored in localStorage (XSS vulnerable)
**Target State:** Tokens stored in httpOnly cookies

**Files to Modify:**

- `backend/src/controllers/auth.controller.ts` - Set cookies on login/refresh
- `backend/src/middlewares/auth.middleware.ts` - Read tokens from cookies
- `backend/src/app.ts` - Configure cookie parser
- `frontend/src/lib/api.ts` - Remove localStorage token handling
- `frontend/src/providers/AuthProvider.tsx` - Update auth state management

**Implementation Steps:**

1. Install `cookie-parser` in backend
2. Configure cookie options (httpOnly, secure, sameSite, maxAge)
3. Update login/register/refresh to set cookies
4. Update auth middleware to read from cookies
5. Update logout to clear cookies
6. Update frontend to rely on cookies (withCredentials: true)
7. Remove localStorage token storage

### 1.2 Implement CSRF Protection

**Current State:** No CSRF protection on forms
**Target State:** All state-changing requests validated with CSRF tokens

**Files to Modify:**

- `backend/src/app.ts` - Add CSRF middleware
- `backend/src/controllers/auth.controller.ts` - Include CSRF token in responses
- `frontend/src/lib/api.ts` - Include CSRF token in headers
- All frontend forms - Include CSRF token

**Implementation Steps:**

1. Install `csurf` or implement custom CSRF tokens
2. Generate CSRF tokens on session start
3. Send CSRF token in response header or meta tag
4. Include CSRF token in all POST/PUT/DELETE requests
5. Validate CSRF tokens on server

---

## Phase 2: Core Feature Completion (P1 - High)

### 2.1 Resume File Upload for Job Applications

**Current State:** Resume field accepts URL only (Google Drive/Dropbox links)
**Target State:** Direct file upload with cloud storage

**Files to Modify:**

- `backend/src/models/JobApplication.ts` - Update schema for file metadata
- `backend/src/controllers/careers.controller.ts` - Handle file upload
- `backend/src/routes/careers.routes.ts` - Add multer middleware
- `frontend/src/app/[locale]/careers/[slug]/page.tsx` - File input component

**Implementation Steps:**

1. Configure Cloudinary/S3 for file storage
2. Add multer middleware for multipart form handling
3. Create file upload endpoint with validation (PDF, DOC, max 5MB)
4. Update frontend form to use file input
5. Store file URL and metadata in database
6. Add file preview/download functionality

### 2.2 Blog Comments System

**Current State:** UI placeholder only, no backend
**Target State:** Full commenting system with moderation

**Files to Create:**

- `backend/src/models/Comment.ts` - Comment schema
- `backend/src/controllers/comment.controller.ts` - CRUD operations
- `backend/src/routes/comment.routes.ts` - API endpoints
- `backend/src/validations/comment.validation.ts` - Input validation
- `frontend/src/components/blog/CommentSection.tsx` - Comment UI
- `frontend/src/services/public/comment.service.ts` - API client

**Comment Model Schema:**

```typescript
{
  post: ObjectId (ref: BlogPost),
  author: { name, email, website? },
  content: string,
  status: 'pending' | 'approved' | 'rejected' | 'spam',
  parentComment?: ObjectId (for replies),
  likes: number,
  isEdited: boolean,
  createdAt, updatedAt
}
```

**Implementation Steps:**

1. Create Comment model with moderation status
2. Create comment controller with CRUD + moderation
3. Add routes with validation
4. Create admin comment management page
5. Build frontend comment section component
6. Add email notifications for new comments
7. Implement spam detection (optional)

---

## Phase 3: Enhanced Features (P2 - Medium)

### 3.1 Save/Bookmark Posts Feature

**Current State:** UI button exists, no functionality
**Target State:** Users can save posts for later reading

**Files to Modify:**

- `backend/src/models/User.ts` - Add savedPosts array
- `backend/src/controllers/blog.controller.ts` - Add save/unsave endpoints
- `backend/src/routes/blog.routes.ts` - Add save routes
- `frontend/src/app/[locale]/blog/[slug]/page.tsx` - Connect save button
- `frontend/src/services/public/blog.service.ts` - Add save API calls

**Implementation Steps:**

1. Add `savedPosts: [ObjectId]` to User model
2. Create POST `/blog/:slug/save` endpoint
3. Create DELETE `/blog/:slug/save` endpoint
4. Create GET `/users/me/saved-posts` endpoint
5. Update frontend to toggle save state
6. Add "My Saved Posts" page

### 3.2 Rate Limiting on Sensitive Endpoints

**Current State:** Basic rate limiting via express-rate-limit
**Target State:** Granular rate limiting per endpoint type

**Files to Modify:**

- `backend/src/middlewares/rateLimit.middleware.ts` - Create rate limiters
- `backend/src/routes/*.routes.ts` - Apply appropriate limiters

**Rate Limit Configuration:**

```typescript
const rateLimiters = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 }, // Login: 5 per 15 min
  register: { windowMs: 60 * 60 * 1000, max: 3 }, // Register: 3 per hour
  contact: { windowMs: 60 * 60 * 1000, max: 5 }, // Contact: 5 per hour
  api: { windowMs: 60 * 1000, max: 100 }, // General: 100 per minute
};
```

---

## Phase 4: Security Enhancements (P3 - Low)

### 4.1 Content Security Policy (CSP) Headers

**Files to Modify:**

- `backend/src/app.ts` - Add CSP middleware
- `frontend/next.config.js` - Add CSP headers

**CSP Policy:**

```javascript
{
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://www.google.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https://res.cloudinary.com"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://api.example.com"],
  'frame-src': ["https://www.youtube.com", "https://player.vimeo.com"],
}
```

### 4.2 Fix Skipped Test Suite

**File:** `frontend/src/components/admin/__tests__/Careers.test.tsx`
**Issue:** Test suite is skipped due to mock/async rendering issues
**Action:** Refactor tests to use proper mocks

---

## Implementation Timeline

### Week 1: Security (Phase 1)

- [ ] Day 1-2: Implement httpOnly cookies for JWT
- [ ] Day 3-4: Implement CSRF protection
- [ ] Day 5: Testing and bug fixes

### Week 2: Core Features (Phase 2)

- [ ] Day 1-2: Resume file upload
- [ ] Day 3-5: Comments system (backend + frontend)

### Week 3: Enhancements (Phase 3-4)

- [ ] Day 1: Save/bookmark posts
- [ ] Day 2: Rate limiting
- [ ] Day 3: CSP headers
- [ ] Day 4-5: Testing and documentation

---

## Testing Requirements

### Unit Tests

- [ ] Auth service - cookie handling
- [ ] CSRF middleware
- [ ] Comment controller
- [ ] File upload validation

### Integration Tests

- [ ] Full auth flow with cookies
- [ ] Comment creation and moderation
- [ ] File upload end-to-end

### E2E Tests

- [ ] Login/logout with cookies
- [ ] Job application with resume upload
- [ ] Blog post commenting

---

## Deployment Checklist

- [ ] Environment variables configured for production
- [ ] CORS origins updated for production domains
- [ ] Cookie domain configured
- [ ] SSL certificates installed
- [ ] Database indexes created
- [ ] Redis configured for session/cache
- [ ] CDN configured for static assets
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] CI/CD pipeline passing

---

## Notes

- All security changes should be implemented together to avoid breaking auth
- Test thoroughly in staging before production deployment
- Consider feature flags for gradual rollout of new features
- Monitor error rates after each deployment

---

**Plan prepared by:** Claude Code
**Approved by:** [Pending]
**Target Completion:** [TBD]
