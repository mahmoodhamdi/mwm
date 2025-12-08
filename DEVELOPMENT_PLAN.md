# MWM Development Plan

## Overview

This document outlines the comprehensive development plan for the MWM corporate website platform, including issues found, fixes needed, and future enhancements.

---

## Current Status Summary

### Working Features

- [x] Project structure (monorepo with npm workspaces)
- [x] Backend API server running
- [x] Frontend Next.js app running
- [x] MongoDB connection
- [x] Redis connection
- [x] i18n setup (Arabic/English)
- [x] Basic page routing
- [x] Dark mode support
- [x] RTL/LTR support

### Known Issues

- [ ] Font loading fails (network issue)
- [ ] Some API endpoints may return empty data
- [ ] Admin pages need authentication
- [ ] Missing favicon

---

## Phase 1: Bug Fixes & Stability

### 1.1 Frontend Fixes

#### Issue: Font Loading Failures

- **Location**: `frontend/src/app/layout.tsx`
- **Problem**: Google fonts fail to load due to network issues
- **Solution**: Add fallback fonts and use `next/font` with local fallback
- **Priority**: Medium

#### Issue: Missing Components

- **Location**: Various pages
- **Problem**: Some imported components may not exist or have issues
- **Solution**: Audit all component imports and fix missing exports
- **Priority**: High

#### Issue: Translation Keys

- **Location**: `frontend/src/messages/{ar,en}.json`
- **Problem**: Some pages may have missing translation keys
- **Solution**: Audit all pages and add missing translations
- **Priority**: High

### 1.2 Backend Fixes

#### Issue: API Root Route

- **Location**: `backend/src/app.ts`
- **Problem**: Root route `/` returns 404
- **Solution**: Add a welcome/redirect route or leave as-is (expected behavior)
- **Priority**: Low

#### Issue: Empty API Responses

- **Location**: Various controllers
- **Problem**: Some endpoints return empty data when DB is empty
- **Solution**: Add proper empty state handling and seed data
- **Priority**: Medium

---

## Phase 2: Feature Completion

### 2.1 Public Pages (Frontend)

| Page           | Status   | Tasks                                                                                                 |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| Home           | Partial  | - Add dynamic content from API<br>- Implement featured services section<br>- Add testimonials section |
| About          | Complete | - Add team section with API data<br>- Add company history timeline                                    |
| Services       | Partial  | - Fetch services from API<br>- Add filtering by category<br>- Add search functionality                |
| Service Detail | Pending  | - Create dynamic page<br>- Add related services<br>- Add FAQ accordion                                |
| Projects       | Pending  | - Fetch projects from API<br>- Add filtering/sorting<br>- Add masonry grid layout                     |
| Team           | Pending  | - Fetch team members from API<br>- Add department filtering<br>- Add member detail modal              |
| Blog           | Pending  | - Implement blog listing<br>- Add categories/tags<br>- Add search                                     |
| Blog Post      | Pending  | - Create dynamic post page<br>- Add related posts<br>- Add comments section                           |
| Careers        | Pending  | - Implement job listings<br>- Add application form                                                    |
| Contact        | Partial  | - Connect form to API<br>- Add form validation<br>- Add success/error states                          |

### 2.2 Admin Dashboard (Frontend)

| Page          | Status  | Tasks                                                                   |
| ------------- | ------- | ----------------------------------------------------------------------- |
| Login         | Pending | - Implement auth flow<br>- Add remember me<br>- Add forgot password     |
| Dashboard     | Pending | - Add stats widgets<br>- Add recent activity<br>- Add charts            |
| Services CRUD | Pending | - List with pagination<br>- Create/Edit forms<br>- Delete confirmation  |
| Projects CRUD | Pending | - List with pagination<br>- Create/Edit forms<br>- Image gallery upload |
| Team CRUD     | Pending | - List with pagination<br>- Create/Edit forms<br>- Avatar upload        |
| Blog CRUD     | Pending | - List with pagination<br>- Rich text editor<br>- Draft/Publish toggle  |
| Careers CRUD  | Pending | - List with pagination<br>- Create/Edit forms<br>- Status management    |
| Messages      | Pending | - List inbox<br>- Read/Reply/Archive<br>- Export functionality          |
| Newsletter    | Pending | - Subscriber list<br>- Send campaigns<br>- Analytics                    |
| Content CMS   | Partial | - Edit site content<br>- Preview changes<br>- Version history           |
| Translations  | Partial | - Edit translations<br>- Import/Export<br>- Missing key indicator       |
| Menus         | Partial | - Edit navigation<br>- Drag-drop reorder<br>- Add/Remove items          |
| Settings      | Partial | - Site settings<br>- SEO settings<br>- Social links                     |
| Users         | Pending | - User management<br>- Role assignment<br>- Activity log                |

### 2.3 Backend API

| Endpoint      | Status   | Tasks                                                                       |
| ------------- | -------- | --------------------------------------------------------------------------- |
| Auth          | Partial  | - Complete forgot/reset password<br>- Add email verification<br>- Add OAuth |
| Services      | Complete | - Add caching<br>- Add full-text search                                     |
| Projects      | Complete | - Add caching<br>- Add filtering                                            |
| Team          | Complete | - Add caching<br>- Add department endpoints                                 |
| Contact       | Complete | - Add email notifications<br>- Add rate limiting                            |
| Content       | Complete | - Add versioning<br>- Add bulk operations                                   |
| Translations  | Complete | - Add import/export<br>- Add validation                                     |
| Menus         | Complete | - Add caching                                                               |
| Settings      | Partial  | - Add more settings types                                                   |
| Newsletter    | Pending  | - Create subscriber model<br>- Create campaign model<br>- Add email service |
| Blog          | Pending  | - Create post model<br>- Create category model<br>- Add comments            |
| Careers       | Pending  | - Create job model<br>- Create application model                            |
| Analytics     | Pending  | - Create visitor tracking<br>- Create dashboard stats                       |
| Notifications | Pending  | - Create notification system<br>- Add websocket support                     |

---

## Phase 3: Testing & Quality

### 3.1 Unit Tests

- [ ] Backend controllers tests
- [ ] Backend services tests
- [ ] Frontend component tests
- [ ] Frontend hooks tests

### 3.2 Integration Tests

- [ ] API endpoint tests
- [ ] Database operations tests
- [ ] Authentication flow tests

### 3.3 E2E Tests

- [ ] Public pages navigation
- [ ] Admin CRUD operations
- [ ] Form submissions
- [ ] Language switching

---

## Phase 4: Performance & SEO

### 4.1 Performance

- [ ] Image optimization
- [ ] Code splitting
- [ ] API caching (Redis)
- [ ] Database indexing
- [ ] Bundle size optimization
- [ ] Lazy loading components

### 4.2 SEO

- [ ] Meta tags on all pages
- [ ] Open Graph tags
- [ ] JSON-LD schema
- [ ] Sitemap generation
- [ ] Robots.txt
- [ ] Canonical URLs

---

## Phase 5: Deployment

### 5.1 Development Environment

- [x] Docker Compose setup
- [x] Local development scripts
- [ ] Development seed data

### 5.2 Production Deployment

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment configuration
- [ ] SSL certificates
- [ ] Domain setup
- [ ] CDN configuration
- [ ] Monitoring setup

---

## Implementation Order

### Week 1-2: Critical Fixes

1. Fix font loading issues
2. Audit and fix all component imports
3. Complete missing translation keys
4. Add seed data for development

### Week 3-4: Core Features

1. Complete Services feature (full CRUD)
2. Complete Projects feature (full CRUD)
3. Implement Contact form submission
4. Add authentication system

### Week 5-6: Additional Features

1. Complete Team management
2. Implement Blog system
3. Implement Careers system
4. Add Newsletter functionality

### Week 7-8: Admin Dashboard

1. Complete dashboard UI
2. Add all CRUD interfaces
3. Implement analytics
4. Add notification system

### Week 9-10: Testing & Polish

1. Write unit tests
2. Write integration tests
3. Performance optimization
4. SEO optimization

### Week 11-12: Deployment

1. Set up CI/CD
2. Configure production environment
3. Deploy and test
4. Documentation

---

## File Structure Reference

```
mwm/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── validations/     # Joi schemas
│   │   ├── utils/           # Utilities
│   │   ├── app.ts           # Express app
│   │   └── server.ts        # Server entry
│   └── tests/               # Test files
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   │   └── [locale]/    # Locale-prefixed pages
│   │   │       ├── admin/   # Admin pages
│   │   │       ├── about/
│   │   │       ├── contact/
│   │   │       ├── services/
│   │   │       ├── projects/
│   │   │       ├── team/
│   │   │       ├── blog/
│   │   │       ├── careers/
│   │   │       └── page.tsx # Home
│   │   ├── components/      # React components
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── contact/
│   │   │   ├── layout/
│   │   │   ├── services/
│   │   │   └── ui/
│   │   ├── hooks/           # Custom hooks
│   │   ├── i18n/            # i18n config
│   │   ├── lib/             # Utilities
│   │   ├── messages/        # Translations
│   │   ├── providers/       # React providers
│   │   └── services/        # API services
│   └── public/              # Static assets
│
└── packages/
    └── shared/              # Shared types
        └── src/
            ├── types/
            ├── constants/
            └── utils/
```

---

## Commands Quick Reference

```bash
# Development
npm run dev                    # Start all
npm run dev:backend            # Backend only
npm run dev:frontend           # Frontend only

# Testing
npm test                       # All tests
npm run test:backend           # Backend tests
npm run test:frontend          # Frontend tests

# Building
npm run build                  # Build all
cd packages/shared && npm run build  # Rebuild shared types

# Docker
npm run docker:dev             # Start databases
npm run docker:down            # Stop databases
```

---

## Notes

- Always run `npm run build` in `packages/shared` after modifying types
- Update translation files when adding new UI text
- Write tests for new features before marking complete
- Use conventional commits for git history
