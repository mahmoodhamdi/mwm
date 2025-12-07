# MWM - Integrated Software Solutions

A comprehensive bilingual (Arabic/English) corporate website platform with full content management capabilities.

## Project Structure

```
mwm/
├── backend/          # Express.js API server
├── frontend/         # Next.js 14 application
├── packages/
│   └── shared/       # Shared types and utilities
└── docs/             # Documentation
```

## Features

- **Bilingual Support**: Full Arabic (RTL) and English support
- **Admin Dashboard**: Complete CMS for managing content
- **Services Management**: Showcase company services with categories
- **Portfolio/Projects**: Display completed projects and case studies
- **Team Management**: Manage team member profiles
- **Contact Form**: Receive and manage customer inquiries
- **Newsletter**: Email subscription management
- **Analytics**: Track visitor metrics and engagement
- **SEO Optimized**: Schema.org markup, sitemap, meta tags

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- next-intl (i18n)

### Backend

- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Redis (caching)

### Infrastructure

- Docker
- PM2
- Nginx

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis 7+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/mwm.git
cd mwm
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

4. Start development servers:

```bash
# Start all services
npm run dev

# Or individually
cd backend && npm run dev
cd frontend && npm run dev
```

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mwm
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## API Documentation

After starting the backend server, access the API documentation at:

- Swagger UI: `http://localhost:5000/api/docs`
- OpenAPI JSON: `http://localhost:5000/api/docs.json`

## Scripts

### Root

- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint all packages

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests

## Testing

```bash
# Run all tests
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only
cd frontend && npm test

# With coverage
npm run test:coverage
```

## Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## Admin Guide

See [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md) for admin panel usage guide.

## Project Status

### Completed Phases

- **Phase 1**: Project Setup & Core Infrastructure
- **Phase 2**: Authentication & Authorization
- **Phase 3**: Public Pages (Home, About, Services, Portfolio, Contact)
- **Phase 4**: Admin Dashboard (Content Management, Analytics)
- **Phase 5**: Performance, SEO, Security, Documentation

## License

Private - All rights reserved

## Contact

- Website: https://mwm.com
- Email: support@mwm.com
