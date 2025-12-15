# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MWM is a bilingual (Arabic/English) corporate website platform with CMS capabilities. It's a monorepo using npm workspaces with three packages: `backend`, `frontend`, and `packages/shared`.

**Requirements:** Node.js 20+, npm 10+, MongoDB 6+, Redis 7+

## Common Commands

```bash
# Development (from root)
npm run dev                    # Start both backend and frontend
npm run dev:backend            # Start backend only (runs tsx watch)
npm run dev:frontend           # Start frontend only (runs next dev)

# Testing
npm test                       # Run all tests across workspaces
npm run test:backend           # Backend tests only
npm run test:frontend          # Frontend tests only
cd backend && npm run test:watch  # Watch mode for backend
cd frontend && npm run test:watch # Watch mode for frontend
cd packages/shared && npm test    # Shared package tests

# Run a single test file
cd backend && npx jest src/path/to/file.test.ts
cd frontend && npx jest src/path/to/file.test.tsx

# E2E tests (Playwright - frontend)
cd frontend && npm run test:e2e              # Run all E2E tests
cd frontend && npx playwright test --ui      # Interactive UI mode
cd frontend && npx playwright test file.spec.ts  # Run specific test

# Type checking
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit

# Linting & Formatting
npm run lint                   # Lint all workspaces
npm run lint:fix               # Auto-fix lint issues
npm run format:check           # Check formatting (CI uses this)

# Building
npm run build                  # Build all packages
npm run build:backend          # Build backend only
npm run build:frontend         # Build frontend only

# CRITICAL: Shared package must be rebuilt when types change
# Failing to rebuild causes "module not found" or type mismatch errors
cd packages/shared && npm run build

# Seeding & Cleanup
cd backend && npm run seed     # Seed database with initial data
npm run clean                  # Remove all node_modules (troubleshooting)

# Docker
npm run docker:dev             # Start dev environment with Docker
npm run docker:down            # Stop Docker services
npm run docker:logs            # View Docker container logs
```

## Architecture

### Monorepo Structure

- **backend/**: Express.js API server (TypeScript, MongoDB, Redis)
- **frontend/**: Next.js 14 App Router application (TypeScript, Tailwind CSS)
- **packages/shared/**: Shared types, constants, and utilities (`@mwm/shared`)

### Backend Architecture (backend/src/)

- `app.ts` - Express app setup with middleware chain (security, CORS, rate limiting)
- `server.ts` - Server entry point with database connection
- `controllers/` - Route handlers (auth, content, menu, service, project, team, contact, blog, careers, newsletter)
- `models/` - Mongoose schemas (19 models: User, Service, ServiceCategory, Project, ProjectCategory, TeamMember, Department, BlogPost, BlogCategory, Job, JobApplication, Newsletter, Subscriber, Contact, SiteContent, Menu, Translation, Settings)
- `routes/` - API route definitions (versioned at `/api/v1/`)
- `middlewares/` - Auth, validation, error handling, asyncHandler
- `validations/` - Joi validation schemas (one per domain)
- `services/` - Business logic (auth, email)
- `config/` - Environment, database, Redis, logging, swagger
- `utils/` - Utilities: `ApiError` (custom error class), `response` (standardized responses), `pagination` (query helpers), `security` (sanitization)

### Frontend Architecture (frontend/src/)

- `app/[locale]/` - Next.js App Router pages with locale prefix
- `app/[locale]/admin/` - Admin dashboard pages (content, services, projects, team, etc.)
- `components/` - UI components organized by domain (admin, services, projects, team, contact)
- `services/` - API service layer (organized by `admin/` and `public/` subdirectories)
- `messages/` - i18n translation files (`ar.json`, `en.json`)
- `i18n/` - next-intl configuration
- `providers/` - React context providers (Theme, etc.)
- `hooks/` - Custom React hooks (useDebounce, useLocalStorage, useMediaQuery, etc.)
- `lib/` - Utility functions and API client (`api.ts` with axios interceptors)

### Shared Package (packages/shared/src/)

Exports types used across both packages. Import via `@mwm/shared`:

- `LocalizedString` - `{ ar: string, en: string }` for bilingual content
- `LocalizedArray` - `{ ar: string[], en: string[] }` for bilingual arrays
- `ApiResponse<T>` - Standard API response wrapper
- `UserRole` - `'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'`
- `Locale`, `Direction` - `'ar' | 'en'` and `'rtl' | 'ltr'`
- `PaginationMeta`, `QueryParams` - Pagination and filtering types
- `PublishStatus`, `ContactStatus` - Entity status enums
- `BaseEntity`, `PublishableEntity` - Common entity interfaces

Sub-exports available: `@mwm/shared/types`, `@mwm/shared/constants`, `@mwm/shared/utils`

Build: Uses `tsup` for dual ESM/CJS output. Always rebuild after type changes: `cd packages/shared && npm run build`

## Key Patterns

### Bilingual Content

All user-facing content uses `LocalizedString` type with `ar` and `en` keys. Arabic is the default locale and uses RTL direction.

### API Routes

Backend routes are versioned under `/api/v1/`. API documentation available at `/api/docs` (Swagger UI).

Default ports: Backend runs on `5000`, Frontend on `3000`.

Current endpoints:

- `/api/v1/auth` - Authentication (login, register, refresh)
- `/api/v1/services` - Services management
- `/api/v1/projects` - Projects/portfolio
- `/api/v1/team` - Team members and departments
- `/api/v1/contact` - Contact form submissions
- `/api/v1/content` - Site content management
- `/api/v1/menus` - Navigation menus
- `/api/v1/translations` - Translation management
- `/api/v1/settings` - Site settings
- `/api/v1/blog` - Blog posts and categories
- `/api/v1/careers` - Job listings and applications
- `/api/v1/newsletter` - Newsletter subscribers and campaigns
- `/api/v1/health` - Health check endpoint

### i18n in Frontend

- Uses `next-intl` with `[locale]` dynamic route segment
- Translations in `frontend/src/messages/{ar,en}.json`
- Default locale is Arabic (`ar`)
- Translation keys are nested by section (common, nav, home, about, services, etc.)

### Testing

- Backend: Jest with `mongodb-memory-server` for integration tests (Redis is mocked in tests/setup.ts)
- Frontend: Jest with React Testing Library (jsdom environment)
- Test files colocated in `__tests__/` directories or as `*.test.{ts,tsx}`
- E2E: Playwright (`npm run test:e2e` in frontend) - tests in `frontend/e2e/` directory
- Backend coverage threshold: 80% | Frontend coverage threshold: 70%
- Backend tests run with `maxWorkers: 1` to prevent port binding issues on Windows

### Frontend Services Pattern

Frontend API services are organized by access level:

- `services/public/` - Public-facing API calls (services, projects, team, blog, careers, contact)
- `services/admin/` - Admin dashboard API calls (content, menus, settings, translations, newsletter)
- `services/index.ts` - Unified re-exports with types

Each service module exports:

- Type definitions for request/response data
- Individual API functions (e.g., `getServices`, `createService`)
- A service object grouping all functions (e.g., `servicesService`)

### Path Aliases

Backend uses path aliases (configured in jest.config.js and tsconfig.json):

- `@/` → `src/`
- `@config/`, `@models/`, `@controllers/`, `@services/`, `@repositories/`, `@routes/`, `@middlewares/`, `@utils/`, `@validations/`, `@types/`, `@constants/`

Frontend uses:

- `@/` → `src/`

### State Management (Frontend)

- Server state: TanStack Query (React Query)
- Client state: Zustand
- Forms: react-hook-form with Zod validation

### Push Notifications

- Backend: Firebase Admin SDK (`firebase-admin`) for sending FCM notifications
- Frontend: Firebase Web SDK for receiving push notifications in browser
- Service worker handles background notification delivery

## Environment Setup

Backend requires `.env` file (copy from `.env.example`):

- MongoDB connection (`MONGODB_URI`)
- JWT secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
- Redis URL (`REDIS_URL`)
- SMTP config for emails
- Cloudinary for image uploads
- Firebase Admin SDK (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`)
- reCAPTCHA (`RECAPTCHA_SECRET_KEY`)

Frontend requires `.env.local`:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:5000/api/v1`)
- `NEXT_PUBLIC_SITE_URL` - Frontend URL (default: `http://localhost:3000`)
- Firebase Web SDK (`NEXT_PUBLIC_FIREBASE_*` keys for push notifications)
- reCAPTCHA (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`)

## Commit Conventions

Uses [Conventional Commits](https://www.conventionalcommits.org/) with commitlint:

```
feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert: description
```

Header max length: 100 characters. Subject case rules are relaxed for Arabic support.

## CI/CD

GitHub Actions runs on push to `main`/`develop` and all PRs:

1. **Lint** - ESLint + Prettier format check
2. **Test Backend** - Jest with MongoDB/Redis services
3. **Test Frontend** - Jest with jsdom
4. **Build** - Shared → Backend → Frontend (order matters)
5. **Docker** - Build test for production images

## Workflow Notes

- When modifying any feature, update related translation files (`frontend/src/messages/{ar,en}.json`) and tests
- Run tests before pushing: all tests must pass
- When adding new shared types, rebuild the shared package: `cd packages/shared && npm run build`
- Husky pre-commit hooks run lint-staged on modified files
