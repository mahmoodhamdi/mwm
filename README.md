# MWM - Integrated Software Solutions

A comprehensive bilingual (Arabic/English) corporate website platform with full content management capabilities.

## Project Structure

```
mwm/
├── backend/          # Express.js API server
├── frontend/         # Next.js 14 application
├── packages/
│   └── shared/       # Shared types and utilities (@mwm/shared)
└── docs/             # Documentation
```

## Features

### Public Website

- **Bilingual Support**: Full Arabic (RTL) and English with dynamic switching
- **Services Showcase**: Service listings with categories and detailed pages
- **Portfolio/Projects**: Project gallery with technologies and case studies
- **Team Profiles**: Team member pages with departments
- **Contact Form**: Customer inquiry submission
- **Blog & Careers**: Pages ready (backend pending)

### Admin Dashboard

- **Content Management**: Edit all site content in Arabic/English
- **Services/Projects/Team CRUD**: Full management capabilities
- **Messages Inbox**: View and manage contact submissions
- **Newsletter**: Subscriber management
- **Menu Builder**: Dynamic navigation management
- **Settings**: Site configuration, SEO, social links
- **User Management**: Roles and permissions system

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS 3 with RTL support
- next-intl (i18n)
- TanStack Query + Zustand
- react-hook-form + Zod

### Backend

- Express.js 4
- TypeScript 5
- MongoDB 7 + Mongoose 8
- Redis 7 (caching)
- JWT Authentication

### Infrastructure

- Docker & Docker Compose
- PM2 process management

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 6+
- Redis 7+
- npm 10+

### Installation

```bash
# Clone and install
git clone https://github.com/your-org/mwm.git
cd mwm
npm install

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start development
npm run dev
```

## Available Scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start all development servers |
| `npm run dev:backend`  | Start backend only            |
| `npm run dev:frontend` | Start frontend only           |
| `npm run build`        | Build all packages            |
| `npm test`             | Run all tests                 |
| `npm run lint`         | Lint all packages             |
| `npm run docker:dev`   | Start with Docker Compose     |

## API Documentation

- **Swagger UI**: http://localhost:5000/api/docs
- **OpenAPI JSON**: http://localhost:5000/api/docs.json

## Documentation

| Document                                          | Description                    |
| ------------------------------------------------- | ------------------------------ |
| [DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md) | Development roadmap and status |
| [PROJECT_ROUTES.md](./docs/PROJECT_ROUTES.md)     | Frontend pages and API routes  |
| [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md)           | Admin panel user guide         |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md)             | Production deployment guide    |

## Project Status

### Completed

- Foundation & Setup (monorepo, TypeScript, Docker)
- Backend API (10 route modules, 13 models)
- Frontend (13 public pages, 16 admin pages)
- Authentication (JWT with refresh tokens)
- i18n (Arabic/English with RTL)
- Testing (unit & integration)
- SEO (meta tags, sitemap, robots.txt)

### In Progress

- Blog System (backend API)
- Careers System (backend API)

### Planned

- Newsletter campaigns
- E2E tests (Playwright)
- Production deployment

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mwm
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_URL=redis://localhost:6379
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## License

Private - All rights reserved
