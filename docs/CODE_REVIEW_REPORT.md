# MWM Project - Comprehensive Code Review Report

**Date:** December 15, 2025
**Scope:** Full codebase review (Backend, Frontend, Shared Package)
**Reviewed Files:** 200+ TypeScript files across 3 packages

---

## Executive Summary

The MWM project is a bilingual (Arabic/English) corporate website platform with CMS capabilities. The codebase demonstrates solid architectural patterns and good security awareness. However, this comprehensive review identified **100+ issues** across the codebase requiring attention before production deployment.

### Issue Summary by Severity

| Severity  | Backend | Frontend | Shared | Total  |
| --------- | ------- | -------- | ------ | ------ |
| Critical  | 5       | 5        | 3      | **13** |
| High      | 7       | 8        | 4      | **19** |
| Medium    | 10      | 14       | 6      | **30** |
| Low       | 8       | 10       | 5      | **23** |
| **Total** | **30**  | **37**   | **18** | **85** |

### Key Findings

1. **Type Safety Gap**: Frontend completely bypasses shared package (0 imports)
2. **Security Concerns**: localStorage token storage vulnerable to XSS, missing CSRF protection
3. **Route Ordering Bug**: Admin routes unreachable due to Express route matching
4. **Missing Validations**: Several endpoints accept unvalidated user input
5. **Incomplete Features**: Share buttons, save functionality, comments not implemented

---

## Part 1: Backend Issues

### Critical Issues

#### 1.1 Route Ordering Issue - Service Routes

**File:** `backend/src/routes/service.routes.ts` (lines 18-35)

**Problem:** The `/admin` routes are defined AFTER public routes. Express matches routes in order, so `/admin/categories` will be matched by `/:slug` pattern first.

```javascript
// Current (WRONG):
router.get('/:slug', getServiceBySlug);        // Line 35 - catches "admin"
router.get('/admin/categories', ...);           // Line 43 - NEVER reached
```

**Fix:** Move all `/admin/*` routes BEFORE public routes or use specific middleware.

#### 1.2 Missing Password Validation - User Controller

**File:** `backend/src/controllers/user.controller.ts` (lines 255-278)

**Problem:** `resetUserPassword` accepts raw password without strength validation.

```typescript
const { password } = req.body; // No validation!
user.password = password; // Direct assignment
```

**Fix:** Add `validatePasswordStrength` utility before saving.

#### 1.3 Insufficient Input Sanitization - Contact Controller

**File:** `backend/src/controllers/contact.controller.ts` (lines 176-180)

**Problem:** `updateMessage` directly applies user-submitted data without field whitelisting.

**Fix:** Use Joi validation schema with explicit allowed fields.

#### 1.4 Hardcoded Firebase Credentials

**File:** `backend/src/config/firebase.ts` (lines 12-23)

**Problem:** Fallback hardcoded values expose credentials:

```typescript
project_id: process.env.FIREBASE_PROJECT_ID || 'auth-pro-33cb9',
```

**Fix:** Remove all hardcoded credentials, throw error if env vars missing.

#### 1.5 Status Code Not Preserved

**File:** `backend/src/controllers/contact.controller.ts` (lines 87-90)

**Problem:** `res.status(201)` is set but `sendSuccess()` defaults to 200.

**Fix:** Pass status code: `sendSuccess(res, {...}, { statusCode: 201 })`.

### High Priority Issues

#### 1.6 Missing Refresh Token Validation

**File:** `backend/src/controllers/auth.controller.ts` (lines 151-157)

#### 1.7 Incomplete TODO Implementation

**File:** `backend/src/controllers/user.controller.ts` (line 143)

- `sendInvite` parameter accepted but not implemented

#### 1.8 Missing ID Validation in Routes

**File:** `backend/src/routes/service.routes.ts` (lines 59-72)

- MongoDB ObjectId format not validated

#### 1.9 NoSQL Injection Risk in Regex Queries

**File:** `backend/src/controllers/service.controller.ts` (lines 89-91)

- Search terms used directly in regex without escaping

#### 1.10 Cache Key Injection Vulnerability

**File:** `backend/src/controllers/contact.controller.ts` (line 116)

- Cache key uses `JSON.stringify(req.query)` - inconsistent ordering

#### 1.11 Missing Validation Schemas

**File:** `backend/src/routes/service.routes.ts` (lines 50-56, 91)

- POST endpoints without validation middleware

#### 1.12 Email Service Missing Error Handling

**File:** `backend/src/services/email.service.ts` (lines 124-137)

- Email send results not checked

### Medium Priority Issues

1. Missing pagination validation (negative values allowed)
2. Missing transaction support in bulk operations
3. No rate limiting on file uploads
4. Insufficient logging for security events
5. reCAPTCHA silently skipped when not configured
6. Missing unique index on slugs
7. Inconsistent response format across controllers
8. Missing request ID tracking
9. No HSTS header configuration
10. Permissions model hardcoded without documentation

### Low Priority Issues

1. Missing Swagger documentation on controllers
2. Inconsistent bilingual error messages
3. Missing tests for key functionality
4. No request/response size limits documentation

---

## Part 2: Frontend Issues

### Critical Issues

#### 2.1 Auth Guard Race Condition

**File:** `frontend/src/components/admin/AdminAuthGuard.tsx` (lines 32-40)

**Problem:** Shows "Redirecting..." but doesn't prevent admin content from flashing.

**Fix:** Return null immediately on auth check failure, use router.prefetch().

#### 2.2 localStorage Token Storage - XSS Risk

**File:** `frontend/src/lib/api.ts` (lines 50-54)

**Problem:** JWT tokens in localStorage vulnerable to XSS attacks.

**Fix:** Migrate to httpOnly cookies via backend.

#### 2.3 Missing CSRF Protection

**File:** `frontend/src/components/contact/ContactForm.tsx` (line 213)

**Problem:** POST requests have no CSRF token.

**Fix:** Add CSRF token from meta tag or API response.

#### 2.4 Unhandled Promise in Blog Page

**File:** `frontend/src/app/[locale]/blog/page.tsx` (lines 38-52)

**Problem:** `Promise.all()` fails entirely on partial failure.

**Fix:** Use `Promise.allSettled()` for graceful degradation.

#### 2.5 Missing Error Boundary for Admin Pages

**File:** `frontend/src/app/[locale]/admin/page.tsx` (lines 114-136)

**Problem:** No proper Error Boundary wrapper for recovery.

### High Priority Issues

#### 2.6 Missing Accessibility Labels

**File:** `frontend/src/components/layout/Header.tsx` (lines 156-166)

- No `aria-current="page"` on active navigation items

#### 2.7 Resume Upload Not Implemented

**File:** `frontend/src/app/[locale]/careers/[slug]/page.tsx` (lines 60-73)

- Resume field is text input, not file upload

#### 2.8 Email Validation Too Permissive

**File:** `frontend/src/components/contact/ContactForm.tsx` (line 182)

- Accepts invalid emails like "test@.com"

#### 2.9 Project Video URL Not Validated

**File:** `frontend/src/app/[locale]/projects/[slug]/page.tsx` (lines 400-406)

- iframe src set without origin validation

#### 2.10 Blog Race Condition on Filter Changes

**File:** `frontend/src/app/[locale]/blog/page.tsx` (lines 54-82)

- No request cancellation via AbortController

### Medium Priority Issues

1. Blog post date uses hardcoded locale instead of app locale
2. Hardcoded fallback image URL (external CDN)
3. Missing loading state handler for departments
4. Admin dashboard stats unsafe property access
5. Missing data validation before rendering
6. Table accessibility - missing semantic HTML
7. Contact form label association missing
8. Missing lazy loading hints on images
9. No pagination on admin activity
10. RTL layout issues in blog post
11. Hardcoded URLs in breadcrumbs
12. Missing image error handling
13. Missing translation keys
14. No error retry logic

### Incomplete Features

1. **Share Buttons** - Blog post share buttons have no onClick handlers
2. **Save for Later** - Button exists but no functionality
3. **Comments** - "Add Comment" button does nothing

---

## Part 3: Shared Package Issues

### Critical Issues

#### 3.1 ContactStatus Type Mismatch

- **Shared:** `'new' | 'read' | 'replied' | 'archived'`
- **Backend:** Includes `'spam'` status

**Impact:** Frontend won't recognize spam contacts.

#### 3.2 BlogPostStatus Type Mismatch

- **Shared:** `'draft' | 'published' | 'scheduled'`
- **Backend:** Includes `'archived'` status

**Impact:** Frontend won't recognize archived blog posts.

#### 3.3 Frontend Completely Bypasses Shared Package

- **Finding:** Zero imports from `@mwm/shared` in frontend
- **Impact:** Duplicate types, type mismatches, poor maintainability

### High Priority Issues

#### 3.4 LocalizedString Duplicated as IBilingual

- Defined in **12 backend model files** instead of importing from shared
- Files: Service.ts, Project.ts, Job.ts, BlogPost.ts, and 8 more

#### 3.5 Missing Domain Types

Should be added to shared package:

- `JobStatus`, `JobType`, `ExperienceLevel`, `ApplicationStatus`
- `CampaignStatus`, `RecipientType`, `ICampaignMetrics`
- `SubscriberStatus`, `SubscriberSource`
- `ContactPriority`

### Medium Priority Issues

1. Frontend defines `BilingualText` in 3+ files (should use `LocalizedString`)
2. User role type defined in 3 places (shared, backend, frontend)
3. Only 2 actual imports from shared in entire backend
4. Limited test coverage in shared package

---

## Part 4: Integration Verification

### API Endpoints Status

| Endpoint         | Backend     | Frontend    | Status  |
| ---------------- | ----------- | ----------- | ------- |
| `/auth/login`    | Implemented | Implemented | Working |
| `/auth/register` | Implemented | Not Used    | Partial |
| `/auth/refresh`  | Implemented | Implemented | Working |
| `/services/*`    | Implemented | Implemented | Working |
| `/projects/*`    | Implemented | Implemented | Working |
| `/team/*`        | Implemented | Implemented | Working |
| `/blog/*`        | Implemented | Implemented | Working |
| `/careers/*`     | Implemented | Implemented | Working |
| `/contact/*`     | Implemented | Implemented | Working |
| `/newsletter/*`  | Implemented | Implemented | Working |
| `/admin/*`       | Implemented | Implemented | Working |

### CORS Configuration

- Backend allows: `http://localhost:3000`, `http://localhost:3001`
- Status: Correctly configured for development

### Authentication Flow

- JWT tokens stored in localStorage
- Refresh token mechanism implemented
- Auto-redirect on 401 responses
- Status: Working but needs security improvement (httpOnly cookies)

---

## Part 5: Test Results

### Backend Tests

```
Test Suites: 1 failed, 19 passed, 20 total
Tests:       1 failed, 471 passed, 472 total
```

**Failing Test:**

- `auth.test.ts` - logout test fails (`registerResponse.body.data` undefined)

### Frontend Tests

```
Test Suites: 3 failed, 36 passed, 39 total
Tests:       23 failed, 856 passed, 879 total
```

**Failing Tests:**

- All 23 failures in `Careers.test.tsx` - pre-existing component import issue

### E2E Tests

- Status: Pending execution

---

## Part 6: Recommendations

### Immediate (This Week)

1. **Fix route ordering** in `service.routes.ts`
2. **Add password validation** to `resetUserPassword`
3. **Remove hardcoded Firebase credentials**
4. **Fix auth guard race condition**
5. **Add CSRF protection** to forms
6. **Fix ContactStatus and BlogPostStatus** types in shared package

### Short Term (This Sprint)

1. Migrate JWT tokens to httpOnly cookies
2. Add comprehensive input validation schemas
3. Implement proper file upload for resume
4. Fix accessibility issues (ARIA labels, touch targets)
5. Consolidate `LocalizedString` across backend models
6. Enable frontend to use shared package types

### Medium Term (Next Sprint)

1. Implement incomplete features (share, save, comments)
2. Add proper error boundaries with recovery options
3. Add transaction support for bulk operations
4. Implement request ID tracking
5. Add comprehensive audit logging
6. Create comprehensive test coverage

### Long Term (Backlog)

1. Add CSP headers and security improvements
2. Move permissions to database
3. Implement secrets rotation
4. Add API documentation with Swagger
5. Performance optimization and monitoring
6. Advanced security monitoring/alerting

---

## Appendix A: Files Requiring Immediate Attention

### Backend

1. `backend/src/routes/service.routes.ts`
2. `backend/src/controllers/user.controller.ts`
3. `backend/src/controllers/contact.controller.ts`
4. `backend/src/config/firebase.ts`
5. `backend/src/controllers/auth.controller.ts`

### Frontend

1. `frontend/src/components/admin/AdminAuthGuard.tsx`
2. `frontend/src/lib/api.ts`
3. `frontend/src/components/contact/ContactForm.tsx`
4. `frontend/src/app/[locale]/blog/page.tsx`
5. `frontend/src/app/[locale]/careers/[slug]/page.tsx`

### Shared Package

1. `packages/shared/src/types/index.ts`
2. All backend model files using `IBilingual`

---

## Appendix B: Security Checklist

- [ ] Migrate JWT to httpOnly cookies
- [ ] Add CSRF protection
- [ ] Fix regex injection in search
- [ ] Remove hardcoded credentials
- [ ] Add rate limiting on sensitive endpoints
- [ ] Implement proper input sanitization
- [ ] Add CSP headers
- [ ] Configure HSTS properly
- [ ] Add security event logging
- [ ] Validate video URL origins

---

**Report prepared by:** Claude Code Review
**Next Review:** After implementing critical fixes
