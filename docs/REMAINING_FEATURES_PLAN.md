# Remaining Features Implementation Plan

## Overview

This document outlines the implementation plan for the remaining features in the MWM project.

---

## Completed Features

The following features have been fully implemented:

- [x] **Blog System Backend** - BlogPost, BlogCategory models with full CRUD API
- [x] **Careers System Backend** - Job, JobApplication models with full CRUD API
- [x] **Blog Frontend (Public)** - Connected to backend API via `@/services/public/blog.service.ts`
- [x] **Careers Frontend (Public)** - Connected to backend API via `@/services/public/careers.service.ts`
- [x] **Newsletter Campaigns** - Backend API + Admin UI connected
- [x] **Admin Blog Page** - Connected to backend API via `@/services/admin/blog.service.ts` (35 tests)
- [x] **Admin Careers Page** - Connected to backend API via `@/services/admin/careers.service.ts` (35 tests)

---

## Feature 1: E2E Tests with Playwright

### Tasks

1. Configure Playwright for the frontend
2. Write tests for public page navigation
3. Write tests for admin CRUD operations
4. Write tests for form submissions
5. Write tests for language switching
6. Write tests for dark mode toggle

### Test Scenarios

| Category   | Tests                                                         |
| ---------- | ------------------------------------------------------------- |
| Navigation | Home, About, Services, Projects, Team, Blog, Careers, Contact |
| Admin CRUD | Services, Projects, Team, Blog, Careers                       |
| Forms      | Contact form, Job application form                            |
| i18n       | Language switcher, RTL/LTR                                    |
| Theme      | Dark mode toggle, persistence                                 |

---

## Feature 2: Production Deployment

### Tasks

1. Configure SSL certificates
2. Setup domain and DNS
3. Configure CDN for static assets
4. Setup monitoring and logging
5. Configure backup and disaster recovery

---

## Implementation Order

1. ~~**Admin Blog API Integration** (Priority 1)~~ ✅
   - Service, page update, tests

2. ~~**Admin Careers API Integration** (Priority 2)~~ ✅
   - Service, page update, tests

3. **E2E Tests** (Priority 1 - Next)
   - Playwright configuration and tests

4. **Production Deployment** (Priority 2)
   - Infrastructure setup

---

## Testing Strategy

Each feature will include:

- Unit tests for services
- Integration tests for API calls
- E2E tests for user flows
- Test coverage > 80% for backend, > 70% for frontend

All tests must pass before committing.

---

_Last Updated: 2025-12-08_
