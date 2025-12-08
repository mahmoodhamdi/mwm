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

# Run a single test file
cd backend && npx jest src/path/to/file.test.ts
cd frontend && npx jest src/path/to/file.test.tsx

# Type checking
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit

# Linting
npm run lint                   # Lint all workspaces
npm run lint:fix               # Auto-fix lint issues

# Building
npm run build                  # Build all packages
npm run build:backend          # Build backend only
npm run build:frontend         # Build frontend only

# CRITICAL: Shared package must be rebuilt when types change
# Failing to rebuild causes "module not found" or type mismatch errors
cd packages/shared && npm run build

# Seeding
cd backend && npm run seed     # Seed database with initial data

# Docker
npm run docker:dev             # Start dev environment with Docker
npm run docker:down            # Stop Docker services
```

## Architecture

### Monorepo Structure

- **backend/**: Express.js API server (TypeScript, MongoDB, Redis)
- **frontend/**: Next.js 14 App Router application (TypeScript, Tailwind CSS)
- **packages/shared/**: Shared types, constants, and utilities (`@mwm/shared`)

### Backend Architecture (backend/src/)

- `app.ts` - Express app setup with middleware chain (security, CORS, rate limiting)
- `server.ts` - Server entry point with database connection
- `controllers/` - Route handlers (auth, content, menu, service, project, team, contact)
- `models/` - Mongoose schemas (User, Service, Project, TeamMember, Contact, etc.)
- `routes/` - API route definitions (versioned at `/api/v1/`)
- `middlewares/` - Auth, validation, error handling, asyncHandler
- `validations/` - Joi validation schemas (one per domain)
- `services/` - Business logic (auth, email)
- `config/` - Environment, database, Redis, logging, swagger

### Frontend Architecture (frontend/src/)

- `app/[locale]/` - Next.js App Router pages with locale prefix
- `app/[locale]/admin/` - Admin dashboard pages (content, services, projects, team, etc.)
- `components/` - UI components organized by domain (admin, services, projects, team, contact)
- `messages/` - i18n translation files (`ar.json`, `en.json`)
- `i18n/` - next-intl configuration
- `providers/` - React context providers (Theme, etc.)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and API client

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

## Key Patterns

### Bilingual Content

All user-facing content uses `LocalizedString` type with `ar` and `en` keys. Arabic is the default locale and uses RTL direction.

### API Routes

Backend routes are versioned under `/api/v1/`. API documentation available at `/api/docs` (Swagger UI).

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

### i18n in Frontend

- Uses `next-intl` with `[locale]` dynamic route segment
- Translations in `frontend/src/messages/{ar,en}.json`
- Default locale is Arabic (`ar`)
- Translation keys are nested by section (common, nav, home, about, services, etc.)

### Testing

- Backend: Jest with `mongodb-memory-server` for integration tests (Redis is mocked in tests/setup.ts)
- Frontend: Jest with React Testing Library (jsdom environment)
- Test files colocated in `__tests__/` directories or as `*.test.{ts,tsx}`
- E2E: Playwright (`npm run test:e2e` in frontend)
- Backend coverage threshold: 80% | Frontend coverage threshold: 70%

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

## Environment Setup

Backend requires `.env` file (copy from `.env.example`):

- MongoDB connection (`MONGODB_URI`)
- JWT secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
- Redis URL (`REDIS_URL`)
- SMTP config for emails
- Cloudinary for image uploads

Frontend requires `.env.local`:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:5000/api/v1`)
- `NEXT_PUBLIC_SITE_URL` - Frontend URL (default: `http://localhost:3000`)

## Workflow Notes

- When modifying any feature, update related translation files (`frontend/src/messages/{ar,en}.json`) and tests
- Run tests before pushing: all tests must pass
- When adding new shared types, rebuild the shared package: `cd packages/shared && npm run build`
- Husky pre-commit hooks run lint-staged on modified files
