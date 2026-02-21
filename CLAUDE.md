# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MWM is a bilingual (Arabic/English) corporate website platform with CMS capabilities. It's a monorepo using npm workspaces with three packages: `backend`, `frontend`, and `packages/shared`.

**Requirements:** Node.js 20+, npm 10+, MongoDB 6+, Redis 7+

## Common Commands

```bash
# Development (from root)
npm run dev                    # Start both backend and frontend
npm run dev:backend            # Start backend only (tsx watch, port 5000)
npm run dev:frontend           # Start frontend only (next dev, port 3000)

# Testing
npm test                       # Run all tests across workspaces
npm run test:backend           # Backend tests only
npm run test:frontend          # Frontend tests only (--passWithNoTests)
cd backend && npm run test:watch  # Watch mode for backend
cd frontend && npm run test:watch # Watch mode for frontend
cd packages/shared && npm test    # Shared package tests

# Run a single test file
cd backend && npx jest src/path/to/file.test.ts
cd frontend && npx jest src/path/to/file.test.tsx

# E2E tests (Playwright - frontend)
cd frontend && npm run test:e2e              # All E2E (5 browsers)
cd frontend && npx playwright test --ui      # Interactive UI mode
cd frontend && npx playwright test file.spec.ts  # Run specific test

# Type checking
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit

# Linting & Formatting
npm run lint                   # Lint all workspaces
npm run lint:fix               # Auto-fix lint issues
npm run format                 # Format all files with Prettier
npm run format:check           # Check formatting (CI uses this)

# Building (order matters: shared → backend → frontend)
npm run build                  # Build all packages
npm run build:backend          # Build backend only
npm run build:frontend         # Build frontend only

# CRITICAL: Shared package must be rebuilt when types change
# Failing to rebuild causes "module not found" or type mismatch errors
cd packages/shared && npm run build
cd packages/shared && npm run dev  # Watch mode for shared during development

# Seeding & Cleanup
cd backend && npm run seed     # Seed database with initial data
npm run clean                  # Remove all node_modules (troubleshooting)

# Docker
npm run docker:dev             # Dev: MongoDB + Redis + admin UIs (uses docker/docker-compose.dev.yml)
npm run docker:prod            # Prod: full stack with Nginx (uses docker/docker-compose.prod.yml)
npm run docker:down            # Stop Docker services
npm run docker:logs            # View Docker container logs
```

**Docker compose files:** `docker-compose.yml` (root) is production full-stack (backend + frontend + nginx + databases). `docker/docker-compose.dev.yml` is databases-only for local dev. `docker/docker-compose.test.yml` exists for CI (MongoDB :27018, Redis :6380 on tmpfs).

## Architecture

### Monorepo Structure

- **backend/**: Express.js API server (TypeScript, MongoDB, Redis) - `@mwm/backend`
- **frontend/**: Next.js 14 App Router application (TypeScript, Tailwind CSS) - `@mwm/frontend`
- **packages/shared/**: Shared types, constants, and utilities - `@mwm/shared`
- **docs/**: Project documentation (development plan, deployment guide, admin guide, routes reference)

### Backend Architecture (backend/src/)

- `app.ts` - Express app setup with middleware chain
- `server.ts` - Server entry point (startup: connectDB → connectRedis → initFirebase → createApp → initSocket → listen)
- `controllers/` - Route handlers (auth, content, menu, service, project, team, contact, blog, careers, newsletter, activity, dashboard, notification, upload, user, health, settings, translation)
- `models/` - Mongoose schemas
- `routes/` - API route definitions (versioned at `/api/v1/`)
- `repositories/` - Data access layer with `BaseRepository` pattern
- `middlewares/` - Auth, validation, error handling, asyncHandler, activityLogger, CSRF, notFoundHandler
- `validations/` - Joi validation schemas (one per domain)
- `services/` - Business logic (auth, email, newsletter, notification, recaptcha)
- `config/` - Environment, database, Redis, logging (winston), swagger, Firebase, socket
- `utils/` - `ApiError` (custom error class), `response` (standardized responses), `pagination`, `security`, `cookies`, `helpers`, `upload`
- `docs/` - Swagger/OpenAPI YAML files per route module

**Middleware chain order in `app.ts`:** trust proxy → request ID (x-request-id UUID) → helmet (HSTS, CSP in prod only) → CORS → rate limiter (100 req/15 min on `/api/`) → body parsers (10mb limit) → cookie-parser → CSRF token generator → compression → express-mongo-sanitize → hpp → morgan (skipped in test env).

### Frontend Architecture (frontend/src/)

- `app/[locale]/` - Next.js App Router pages with locale prefix
- `app/[locale]/admin/` - 16 admin sections
- `components/` - UI components organized by domain (admin, services, projects, team, contact)
- `services/` - API service layer (organized by `admin/` and `public/` subdirectories)
- `messages/` - i18n translation files (`ar.json`, `en.json`)
- `i18n/` - next-intl configuration (`localePrefix: 'always'` — locale always in URL)
- `providers/` - React context providers (Theme via next-themes, Auth, Socket)
- `hooks/` - Custom React hooks (useDebounce, useLocalStorage, useMediaQuery, useClickOutside, useNotifications, useIntersectionObserver)
- `lib/` - API client (`api.ts`), utilities (`utils.ts`), `accessibility.ts`, `sanitize.ts` (XSS-safe HTML via sanitize-html), `seo.ts` (JSON-LD schema generators), `socket.ts`, `github.ts` (OAuth flow)

### Shared Package (packages/shared/src/)

Exports types used across both packages. Import via `@mwm/shared`:

- `LocalizedString` - `{ ar: string, en: string }` for bilingual content
- `LocalizedArray` - `{ ar: string[], en: string[] }` for bilingual arrays
- `ApiResponse<T>` - Standard API response wrapper
- `UserRole` - `'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'`
- `Locale`, `Direction` - `'ar' | 'en'` and `'rtl' | 'ltr'`
- `PaginationMeta`, `QueryParams` - Pagination and filtering types
- Status enums: `PublishStatus`, `ContactStatus`, `BlogPostStatus`, `JobType`, `ExperienceLevel`, `JobStatus`, `ApplicationStatus`, `CampaignStatus`, `SubscriberStatus`

Sub-exports: `@mwm/shared/types`, `@mwm/shared/constants`, `@mwm/shared/utils`

Constants include: `LOCALES`, `DEFAULT_LOCALE`, `USER_ROLES`, `PERMISSIONS`, `ROLE_PERMISSIONS`, `ERROR_CODES`, `HTTP_STATUS`, `REGEX` (email, password, slug, phone, URL patterns), `UPLOAD` (max sizes, allowed types), `LOCALE_CONFIG`, pagination defaults (`DEFAULT_PAGE=1`, `DEFAULT_LIMIT=10`, `MAX_LIMIT=100`).

Utils include: `getLocalizedValue`, `createLocalizedString`, `generateSlug`, `calculatePagination`, `sanitizeObject`, `formatDate`, `formatNumber`, `formatCurrency`, `truncateText`, `calculateReadingTime`, `isEmpty`, `deepClone`, `pick`, `omit`, `parseSortString`, `delay`.

Build: Uses `tsup` for dual ESM/CJS output with 4 entry points (index, types, constants, utils). Always rebuild after type changes.

## Key Patterns

### Authentication & Security

**Auth uses HttpOnly cookies (not localStorage).** Cookie names:

- `accessToken` (15 min, HttpOnly, Secure in prod, SameSite: strict/lax)
- `refreshToken` (7 days, HttpOnly)
- `csrfToken` (24h, NOT HttpOnly — readable by JavaScript)

Auth middleware checks cookies first, then falls back to `Authorization: Bearer` header. The `authorizeAny()` middleware grants access if the user has ANY of the specified permissions (vs `authorize()` which requires ALL).

**CSRF flow:** Backend generates a `csrfToken` cookie on all requests. Frontend `api.ts` reads this cookie and sends it as `X-CSRF-Token` header on POST/PUT/DELETE/PATCH. CSRF validation is skipped when `NODE_ENV === 'test'`. Endpoint: `GET /api/v1/csrf-token`.

**Frontend API client (`lib/api.ts`):** On 401, automatically calls `POST /auth/refresh-token` (cookies sent via `withCredentials: true`). Uses a subscriber queue to prevent concurrent refresh calls. Sends `Accept-Language` header from `localStorage.getItem('locale') || 'ar'`. Timeout: 30s.

### Bilingual Content

All user-facing content uses `LocalizedString` type with `ar` and `en` keys. Arabic is the default locale and uses RTL direction.

### API Routes

Backend routes are versioned under `/api/v1/`. API documentation at `/api/docs` (Swagger UI), OpenAPI spec at `/api/docs.json`. Default ports: Backend `5000`, Frontend `3000`.

### Error Handling

- `ApiError` class with convenience factory `Errors` object: `Errors.NOT_FOUND('User')`, `Errors.UNAUTHORIZED(msg)`, `Errors.FORBIDDEN(msg)` etc.
- Error handler reads `Accept-Language` header to return Arabic error messages for Arabic clients
- `validate()` middleware: strips unknown keys (`stripUnknown: true`), returns all errors at once (`abortEarly: false`), replaces `req.body`/`req.query`/`req.params` with sanitized data
- Response utilities: `sendSuccess()`, `sendCreated()` (201), `sendNoContent()` (204), `sendPaginated()`, `paginatedResponse()` (calculates totalPages/hasNext/hasPrev)

### BaseRepository Pattern

`BaseRepository<T>` wraps Mongoose with typed methods: `findById`, `findOne`, `findAll`, `findPaginated` (returns `{ data, pagination }`, default sort `createdAt: -1`), `create`, `createMany`, `updateById`, `updateOne`, `updateMany`, `deleteById`, `deleteOne`, `deleteMany`, `count`, `exists`, `aggregate`, `distinct`. All updates use `{ new: true, runValidators: true }`.

### Redis Caching

Cache helpers in `config/redis.ts`: `setCache(key, value, ttl=300)`, `getCache<T>(key)`, `deleteCache(key)`, `deleteCacheByPattern(pattern)`, `cacheExists(key)`. Redis uses `lazyConnect: true` with exponential backoff retry (max 2000ms).

### Socket.io (Real-time)

Server utilities in `config/socket.ts`: `emitToUser(userId, event, data)`, `emitToAdmins(event, data)`, `broadcast(event, data)`, `getConnectedCount()`, `isUserOnline(userId)`. Admins auto-join `'admins'` room; users join `user:{userId}` room. Auth via `socket.handshake.auth.token` or `Authorization` header.

Frontend socket URL: derived from `NEXT_PUBLIC_API_URL` by stripping `/api/v1`.

### File Uploads

Uses **Cloudinary** (not local disk). `utils/upload.ts` provides `imageUpload` (JPG/PNG/GIF/WebP/SVG, max 10MB) and `resumeUpload` (PDF/DOC/DOCX, max 5MB) multer instances with memory storage, plus `uploadToCloudinary()`, `uploadImageToCloudinary()` (with resize/crop optimization), and `deleteFromCloudinary()`.

### i18n in Frontend

- Uses `next-intl` with `[locale]` dynamic route segment
- Translations in `frontend/src/messages/{ar,en}.json`
- Default locale is Arabic (`ar`)
- Translation keys are nested by section (common, nav, home, about, services, etc.)

### Testing

**Backend:**

- Jest with `mongodb-memory-server` for integration tests
- Redis is fully mocked via `jest.mock('ioredis')` in `tests/setup.ts`
- Test roots: both `src/` (colocated) and `tests/` (unit/ and integration/ subdirectories)
- `maxWorkers: 1` to prevent port binding issues
- `clearMocks`, `resetMocks`, `restoreMocks` all true — mocks auto-reset between tests
- Global timeout: 120 seconds (set in `tests/setup.ts` via `jest.setTimeout`)
- `forceExit: true` prevents hanging processes
- `@mwm/shared` is mapped directly to TypeScript source (not compiled dist) in jest.config.js
- Setup pre-sets env vars: `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CORS_ORIGIN`, `CLIENT_URL`, `MONGODB_URI`, `REDIS_URL`
- Coverage threshold: 80%. Excludes `server.ts` and `types/`

**Frontend:**

- Jest with React Testing Library (jsdom environment)
- Setup file: `jest.setup.ts` mocks `matchMedia`, `localStorage`, `ResizeObserver`, `IntersectionObserver`
- `transformIgnorePatterns` excludes `@headlessui` and `lucide-react` (ESM packages that need transformation)
- Jest uses `moduleResolution: 'node'` (overridden from Next.js's `bundler`) for test execution
- Coverage threshold: 70%. Excludes `src/app/**` (page components) and `src/**/index.ts`
- Only `@/*` path alias is mapped in jest (not `@components/*` etc.)

**E2E (Playwright):**

- Tests in `frontend/e2e/`, with admin tests in `frontend/e2e/admin/`
- 5 browser projects: Chromium, Firefox, WebKit, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- Base URL configurable via `PLAYWRIGHT_BASE_URL` env var (default: `http://localhost:3000`)
- `retries: 2` on CI, `0` locally; `workers: 1` on CI; `fullyParallel: true`
- 30s per-test timeout, 10s expect timeout; traces/video on first retry, screenshots on failure
- Auto-starts dev server via `webServer.command: 'npm run dev'` with `reuseExistingServer: true`

### Frontend Services Pattern

Frontend API services are organized by access level:

- `services/public/` - Public-facing API calls (services, projects, team, blog, careers, contact)
- `services/admin/` - Admin dashboard API calls (content, menus, settings, translations, newsletter, activity, dashboard, notifications, upload, users)
- `services/index.ts` - Unified re-exports with types

Each service module exports type definitions, individual API functions, and a service object grouping all functions.

### Path Aliases

Backend (configured in both jest.config.js and tsconfig.json):

- `@/` → `src/`
- `@config/`, `@models/`, `@controllers/`, `@services/`, `@repositories/`, `@routes/`, `@middlewares/`, `@utils/`, `@validations/`, `@types/`, `@constants/`

Frontend (configured in tsconfig.json, but only `@/*` works in jest):

- `@/` → `src/`
- `@components/*`, `@hooks/*`, `@lib/*`, `@store/*`, `@types/*`, `@utils/*`

### State Management (Frontend)

- Server state: TanStack Query (React Query)
- Client state: Zustand
- Forms: react-hook-form with Zod validation
- CSS class merging: `cn()` from `lib/utils.ts` (clsx + tailwind-merge)
- Animations: framer-motion
- Carousels: Swiper

### Next.js Configuration

- `output: 'standalone'` (Docker-optimized build)
- Image optimization: allows `res.cloudinary.com` and `images.unsplash.com`; formats avif + webp; cache 30 days
- Security headers on all routes: `X-DNS-Prefetch-Control`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
- Redirects: `/[locale]/admin` → `/[locale]/admin/dashboard`; `/admin` → `/ar/admin/dashboard`
- `experimental.optimizePackageImports` for lucide-react, framer-motion, date-fns, @headlessui/react, recharts

### Tailwind Configuration

- `darkMode: 'class'` (class-based, matches next-themes)
- `tailwindcss-rtl` plugin for RTL support
- Custom palette: `primary` (sky blue), `secondary` (purple), `accent` (orange)
- Fonts: `font-sans` uses Inter + Cairo; `font-cairo`/`font-arabic` for Arabic text
- Custom animations: fade-in/out, slide-up/down/left/right, scale-in, float, typewriter

### TypeScript Configuration

- `tsconfig.base.json` at root: target ES2022, moduleResolution NodeNext, strict mode with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`
- Backend extends base but relaxes: `noPropertyAccessFromIndexSignature`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` set to false
- Frontend does NOT extend base — standalone config with `module: esnext`, `moduleResolution: bundler` (Next.js style)

## Code Style

- **Prettier:** singleQuote, trailingComma es5, printWidth 100, endOfLine lf, arrowParens avoid, `prettier-plugin-tailwindcss` active (auto-sorts Tailwind classes)
- **ESLint:** `no-explicit-any` → warn, `no-unused-vars` → warn (ignores `_` prefix), `prefer-const` and `no-var` enforced. Backend allows `console.warn/error/info`; frontend allows only `console.warn/error`. Backend `ignorePatterns` includes `tests/`
- **Frontend ESLint:** extends `next/core-web-vitals`, includes `plugin:tailwindcss/recommended` with callees `cn`, `clsx`, `cva`; `tailwindcss/no-custom-classname: 'off'`
- **Husky:** pre-commit runs lint-staged (eslint --fix + prettier --write per workspace); commit-msg runs commitlint
- **Lint-staged scopes:** `backend/src/**/*.ts`, `frontend/src/**/*.{ts,tsx}`, `packages/shared/src/**/*.ts` (eslint+prettier); `*.{js,jsx,json,md}` (prettier only)

## Environment Setup

Backend `.env` (copy from `backend/.env.example`):

- `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN` (default: 15m), `JWT_REFRESH_EXPIRES_IN` (default: 7d)
- `CLIENT_URL` (default: `http://localhost:3000`), `COOKIE_DOMAIN` (optional)
- SMTP config (`EMAIL_FROM`), Cloudinary, Firebase Admin SDK, reCAPTCHA
- Optional: `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` (OAuth), `SENTRY_DSN`

Frontend `.env.local` (copy from `frontend/.env.example`):

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000/api/v1`)
- `NEXT_PUBLIC_SITE_URL` (default: `http://localhost:3000`)
- Firebase Web SDK keys (`NEXT_PUBLIC_FIREBASE_*` including `VAPID_KEY` for Web Push)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- Optional: `NEXT_PUBLIC_GITHUB_CLIENT_ID` (OAuth)

## Commit Conventions

Uses Conventional Commits with commitlint. Header max 100 characters. Subject case rules disabled for Arabic support.

```
feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert: description
```

## CI/CD

- **CI** (`ci.yml`) - Runs on push to `main`/`develop` and all PRs. Uses `npm ci` for reproducible installs. Build order: Shared → Backend → Frontend. Backend tests use real MongoDB 7 + Redis 7 services (not mocked). Coverage uploaded to Codecov. Build artifacts retained 7 days. Includes Docker build test (build only, no push).
- **CD** (`cd.yml`) - Triggers on push to `main`, releases, or manual dispatch (staging/production). Deploys to Docker Hub (`mwmsoftware/mwm-backend`, `mwmsoftware/mwm-frontend`) tagged with latest/SHA/semver, then SSH deploys to `/opt/mwm` with post-deploy health checks.
- **Security** (`security-scan.yml`) - Weekly + on push/PR: npm audit, Trivy (CRITICAL/HIGH with SARIF upload), CodeQL (JS/TS), Gitleaks.

## Workflow Notes

- When modifying any feature, update related translation files (`frontend/src/messages/{ar,en}.json`) and tests
- Run tests before pushing: all tests must pass
- When adding new shared types, rebuild the shared package: `cd packages/shared && npm run build`
- Husky pre-commit hooks run lint-staged on modified files
- `docker:dev` starts databases only — run the app natively with `npm run dev`
- Production logging: Winston writes to `logs/error.log` and `logs/combined.log` (10MB max, 5 rotated files)
- Graceful shutdown on SIGTERM/SIGINT with 30-second force-exit timeout
