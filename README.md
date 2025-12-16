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

---

## Screenshots

### Public Pages (Arabic - RTL)

<table>
  <tr>
    <td align="center"><strong>Home</strong></td>
    <td align="center"><strong>About</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/home-ar.png" alt="Home Arabic" width="400"/></td>
    <td><img src="./docs/screenshots/about-ar.png" alt="About Arabic" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Services</strong></td>
    <td align="center"><strong>Projects</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/services-ar.png" alt="Services Arabic" width="400"/></td>
    <td><img src="./docs/screenshots/projects-ar.png" alt="Projects Arabic" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Team</strong></td>
    <td align="center"><strong>Blog</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/team-ar.png" alt="Team Arabic" width="400"/></td>
    <td><img src="./docs/screenshots/blog-ar.png" alt="Blog Arabic" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Careers</strong></td>
    <td align="center"><strong>Contact</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/careers-ar.png" alt="Careers Arabic" width="400"/></td>
    <td><img src="./docs/screenshots/contact-ar.png" alt="Contact Arabic" width="400"/></td>
  </tr>
</table>

### Public Pages (English - LTR)

<table>
  <tr>
    <td align="center"><strong>Home</strong></td>
    <td align="center"><strong>About</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/home-en.png" alt="Home English" width="400"/></td>
    <td><img src="./docs/screenshots/about-en.png" alt="About English" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Services</strong></td>
    <td align="center"><strong>Projects</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/services-en.png" alt="Services English" width="400"/></td>
    <td><img src="./docs/screenshots/projects-en.png" alt="Projects English" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Team</strong></td>
    <td align="center"><strong>Blog</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/team-en.png" alt="Team English" width="400"/></td>
    <td><img src="./docs/screenshots/blog-en.png" alt="Blog English" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Careers</strong></td>
    <td align="center"><strong>Contact</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/careers-en.png" alt="Careers English" width="400"/></td>
    <td><img src="./docs/screenshots/contact-en.png" alt="Contact English" width="400"/></td>
  </tr>
</table>

### Mobile Views

<table>
  <tr>
    <td align="center"><strong>Home (AR)</strong></td>
    <td align="center"><strong>Home (EN)</strong></td>
    <td align="center"><strong>Services</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/home-mobile-ar.png" alt="Home Mobile Arabic" width="200"/></td>
    <td><img src="./docs/screenshots/home-mobile-en.png" alt="Home Mobile English" width="200"/></td>
    <td><img src="./docs/screenshots/services-mobile.png" alt="Services Mobile" width="200"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Blog</strong></td>
    <td align="center"><strong>Contact</strong></td>
    <td align="center"><strong>Careers</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/blog-mobile.png" alt="Blog Mobile" width="200"/></td>
    <td><img src="./docs/screenshots/contact-mobile.png" alt="Contact Mobile" width="200"/></td>
    <td><img src="./docs/screenshots/careers-mobile.png" alt="Careers Mobile" width="200"/></td>
  </tr>
</table>

### Admin Panel

<table>
  <tr>
    <td align="center"><strong>Login Page</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/admin-login.png" alt="Admin Login" width="500"/></td>
  </tr>
</table>

> **Note:** Admin dashboard screenshots require a seeded database with test users. Run `npm run seed` in the backend to create test data, then run the E2E screenshot tests.

### UI States

<table>
  <tr>
    <td align="center"><strong>Dark Mode</strong></td>
    <td align="center"><strong>404 Page</strong></td>
    <td align="center"><strong>Form Validation</strong></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/home-dark.png" alt="Dark Mode" width="300"/></td>
    <td><img src="./docs/screenshots/404-page.png" alt="404 Page" width="300"/></td>
    <td><img src="./docs/screenshots/form-validation.png" alt="Form Validation" width="300"/></td>
  </tr>
</table>

---

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

# Generate screenshots
npx playwright test screenshots.spec.ts --project=chromium
```

## API Documentation

- **Swagger UI**: http://localhost:5000/api/docs
- **OpenAPI JSON**: http://localhost:5000/api/docs.json

## Documentation

| Document                                                            | Description                    |
| ------------------------------------------------------------------- | ------------------------------ |
| [DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md)                   | Development roadmap and status |
| [PROJECT_ROUTES.md](./docs/PROJECT_ROUTES.md)                       | Frontend pages and API routes  |
| [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md)                             | Admin panel user guide         |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md)                               | Production deployment guide    |
| [CREDENTIALS.md](./docs/CREDENTIALS.md)                             | Environment setup guide        |
| [CODE_REVIEW_REPORT.md](./docs/CODE_REVIEW_REPORT.md)               | Comprehensive code review      |
| [PRODUCTION_READINESS_PLAN.md](./docs/PRODUCTION_READINESS_PLAN.md) | Production readiness checklist |

## Project Status

### Completed

- Foundation & Setup (monorepo, TypeScript, Docker)
- Backend API (15+ route modules, 19 models)
- Frontend (13 public pages, 16 admin pages)
- Authentication (JWT with refresh tokens)
- i18n (Arabic/English with RTL)
- Testing (unit, integration & E2E with 28 screenshots)
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
