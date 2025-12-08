# MWM - Integrated Software Solutions

A comprehensive bilingual (Arabic/English) corporate website platform with full content management capabilities.

## Contact Information

| Channel | Contact                          |
| ------- | -------------------------------- |
| Email   | mwm.softwars.solutions@gmail.com |
| Email   | hmdy7486@gmail.com               |
| Phone   | +201019793768                    |

## Project Structure

```
mwm/
├── backend/          # Express.js API server
├── frontend/         # Next.js 14 application
├── packages/
│   └── shared/       # Shared types and utilities (@mwm/shared)
└── docs/             # Documentation & Screenshots
    └── screenshots/  # App page screenshots
```

## Features

### Public Website

- **Bilingual Support**: Full Arabic (RTL) and English with dynamic switching
- **Services Showcase**: Service listings with categories and detailed pages
- **Portfolio/Projects**: Project gallery with technologies and case studies
- **Team Profiles**: Team member pages with departments
- **Contact Form**: Customer inquiry submission with reCAPTCHA
- **Blog System**: Full blog with categories and posts
- **Careers Portal**: Job listings and application system
- **Newsletter**: Email subscription with campaigns

### Admin Dashboard

- **Content Management**: Edit all site content in Arabic/English
- **Services/Projects/Team CRUD**: Full management capabilities
- **Messages Inbox**: View and manage contact submissions
- **Newsletter Management**: Subscriber management and campaigns
- **Menu Builder**: Dynamic navigation management
- **Settings**: Site configuration, SEO, social links
- **User Management**: Roles and permissions system
- **Activity Logging**: Track all admin actions
- **Push Notifications**: FCM integration for real-time alerts

## Screenshots

### Public Pages

| Arabic                                           | English                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Home AR](./docs/screenshots/home-ar.png)       | ![Home EN](./docs/screenshots/home-en.png)       |
| ![About AR](./docs/screenshots/about-ar.png)     | ![About EN](./docs/screenshots/about-en.png)     |
| ![Contact AR](./docs/screenshots/contact-ar.png) | ![Contact EN](./docs/screenshots/contact-en.png) |
| ![Blog AR](./docs/screenshots/blog-ar.png)       | ![Blog EN](./docs/screenshots/blog-en.png)       |
| ![Careers AR](./docs/screenshots/careers-ar.png) | ![Careers EN](./docs/screenshots/careers-en.png) |
| ![Team AR](./docs/screenshots/team-ar.png)       | ![Team EN](./docs/screenshots/team-en.png)       |

### Mobile Views

| Home Mobile AR                                      | Home Mobile EN                                      | Contact Mobile                                    |
| --------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| ![Mobile AR](./docs/screenshots/home-mobile-ar.png) | ![Mobile EN](./docs/screenshots/home-mobile-en.png) | ![Contact](./docs/screenshots/contact-mobile.png) |

### Admin Dashboard

| Dashboard                                            | Services                                           | Projects                                           |
| ---------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| ![Dashboard](./docs/screenshots/admin-dashboard.png) | ![Services](./docs/screenshots/admin-services.png) | ![Projects](./docs/screenshots/admin-projects.png) |

| Blog                                       | Careers                                          | Newsletter                                             |
| ------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------ |
| ![Blog](./docs/screenshots/admin-blog.png) | ![Careers](./docs/screenshots/admin-careers.png) | ![Newsletter](./docs/screenshots/admin-newsletter.png) |

| Settings                                           | Login                                        |
| -------------------------------------------------- | -------------------------------------------- |
| ![Settings](./docs/screenshots/admin-settings.png) | ![Login](./docs/screenshots/admin-login.png) |

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS 3 with RTL support
- next-intl (i18n)
- TanStack Query + Zustand
- react-hook-form + Zod
- Playwright (E2E Testing)

### Backend

- Express.js 4
- TypeScript 5
- MongoDB 7 + Mongoose 8
- Redis 7 (caching)
- JWT Authentication
- Firebase Cloud Messaging (Push Notifications)

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
git clone https://github.com/mahmoodhamdi/mwm.git
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

### E2E Testing

```bash
cd frontend

# Run all E2E tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test e2e/screenshots.spec.ts
```

## API Documentation

- **Swagger UI**: http://localhost:5000/api/docs
- **OpenAPI JSON**: http://localhost:5000/api/docs.json

## Documentation

| Document                                          | Description                     |
| ------------------------------------------------- | ------------------------------- |
| [DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md) | Development roadmap and status  |
| [PROJECT_ROUTES.md](./docs/PROJECT_ROUTES.md)     | Frontend pages and API routes   |
| [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md)           | Admin panel user guide          |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md)             | Production deployment guide     |
| [PENDING_FEATURES.md](./docs/PENDING_FEATURES.md) | Remaining features to implement |

## Project Status

### Completed

- Foundation & Setup (monorepo, TypeScript, Docker)
- Backend API (15+ route modules, 19 models)
- Frontend (13 public pages, 16 admin pages)
- Authentication (JWT with refresh tokens)
- i18n (Arabic/English with RTL)
- Testing (unit, integration & E2E)
- SEO (meta tags, sitemap, robots.txt)
- Blog System (full implementation)
- Careers System (jobs & applications)
- Newsletter System (subscribers & campaigns)
- Push Notifications (FCM integration)
- Activity Logging System
- Dashboard Analytics

### In Progress

- Production deployment
- Analytics integration (Google Analytics)

### Planned

- Real-time WebSocket notifications
- Image upload to Cloudinary

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mwm
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_URL=redis://localhost:6379
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## License

Private - All rights reserved

## Contact

For inquiries or support:

- Email: mwm.softwars.solutions@gmail.com
- Email: hmdy7486@gmail.com
- Phone: +201019793768
