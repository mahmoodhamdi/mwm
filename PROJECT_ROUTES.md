# MWM Project Routes & Testing Guide

## Frontend Pages (Next.js)

### Public Pages (Arabic - Default)

| Page           | URL                                      | Description     |
| -------------- | ---------------------------------------- | --------------- |
| Home           | http://localhost:3001/ar                 | الصفحة الرئيسية |
| About          | http://localhost:3001/ar/about           | من نحن          |
| Services       | http://localhost:3001/ar/services        | الخدمات         |
| Service Detail | http://localhost:3001/ar/services/[slug] | تفاصيل الخدمة   |
| Projects       | http://localhost:3001/ar/projects        | المشاريع        |
| Team           | http://localhost:3001/ar/team            | فريق العمل      |
| Blog           | http://localhost:3001/ar/blog            | المدونة         |
| Blog Post      | http://localhost:3001/ar/blog/[slug]     | تفاصيل المقال   |
| Careers        | http://localhost:3001/ar/careers         | الوظائف         |
| Career Detail  | http://localhost:3001/ar/careers/[slug]  | تفاصيل الوظيفة  |
| Contact        | http://localhost:3001/ar/contact         | اتصل بنا        |

### Public Pages (English)

| Page           | URL                                      | Description     |
| -------------- | ---------------------------------------- | --------------- |
| Home           | http://localhost:3001/en                 | Home Page       |
| About          | http://localhost:3001/en/about           | About Us        |
| Services       | http://localhost:3001/en/services        | Services        |
| Service Detail | http://localhost:3001/en/services/[slug] | Service Details |
| Projects       | http://localhost:3001/en/projects        | Projects        |
| Team           | http://localhost:3001/en/team            | Team            |
| Blog           | http://localhost:3001/en/blog            | Blog            |
| Blog Post      | http://localhost:3001/en/blog/[slug]     | Blog Post       |
| Careers        | http://localhost:3001/en/careers         | Careers         |
| Career Detail  | http://localhost:3001/en/careers/[slug]  | Career Details  |
| Contact        | http://localhost:3001/en/contact         | Contact Us      |

### Admin Dashboard Pages

| Page          | URL                                          | Description      |
| ------------- | -------------------------------------------- | ---------------- |
| Dashboard     | http://localhost:3001/ar/admin               | لوحة التحكم      |
| Services      | http://localhost:3001/ar/admin/services      | إدارة الخدمات    |
| Projects      | http://localhost:3001/ar/admin/projects      | إدارة المشاريع   |
| Team          | http://localhost:3001/ar/admin/team          | إدارة الفريق     |
| Blog          | http://localhost:3001/ar/admin/blog          | إدارة المدونة    |
| Careers       | http://localhost:3001/ar/admin/careers       | إدارة الوظائف    |
| Messages      | http://localhost:3001/ar/admin/messages      | الرسائل          |
| Newsletter    | http://localhost:3001/ar/admin/newsletter    | النشرة البريدية  |
| Analytics     | http://localhost:3001/ar/admin/analytics     | التحليلات        |
| Notifications | http://localhost:3001/ar/admin/notifications | الإشعارات        |
| Users         | http://localhost:3001/ar/admin/users         | إدارة المستخدمين |
| Activity      | http://localhost:3001/ar/admin/activity      | سجل النشاط       |
| Content       | http://localhost:3001/ar/admin/content       | إدارة المحتوى    |
| Translations  | http://localhost:3001/ar/admin/translations  | الترجمات         |
| Menus         | http://localhost:3001/ar/admin/menus         | القوائم          |
| Settings      | http://localhost:3001/ar/admin/settings      | الإعدادات        |

---

## Backend API Routes

### Base URL

```
http://localhost:5000/api/v1
```

### Health Check

| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| GET    | /health  | Health check endpoint |

### Authentication

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /auth/register        | Register new user      |
| POST   | /auth/login           | User login             |
| POST   | /auth/refresh         | Refresh access token   |
| POST   | /auth/logout          | User logout            |
| POST   | /auth/forgot-password | Request password reset |
| POST   | /auth/reset-password  | Reset password         |
| GET    | /auth/me              | Get current user       |

### Services

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | /services            | Get all services       |
| GET    | /services/:id        | Get service by ID      |
| GET    | /services/slug/:slug | Get service by slug    |
| POST   | /services            | Create service (Admin) |
| PUT    | /services/:id        | Update service (Admin) |
| DELETE | /services/:id        | Delete service (Admin) |
| GET    | /services/categories | Get service categories |

### Projects

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | /projects            | Get all projects       |
| GET    | /projects/:id        | Get project by ID      |
| GET    | /projects/slug/:slug | Get project by slug    |
| POST   | /projects            | Create project (Admin) |
| PUT    | /projects/:id        | Update project (Admin) |
| DELETE | /projects/:id        | Delete project (Admin) |
| GET    | /projects/categories | Get project categories |

### Team

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | /team             | Get all team members       |
| GET    | /team/:id         | Get member by ID           |
| GET    | /team/slug/:slug  | Get member by slug         |
| POST   | /team             | Create team member (Admin) |
| PUT    | /team/:id         | Update team member (Admin) |
| DELETE | /team/:id         | Delete team member (Admin) |
| GET    | /team/departments | Get departments            |

### Contact

| Method | Endpoint     | Description                   |
| ------ | ------------ | ----------------------------- |
| GET    | /contact     | Get all messages (Admin)      |
| GET    | /contact/:id | Get message by ID (Admin)     |
| POST   | /contact     | Submit contact form           |
| PUT    | /contact/:id | Update message status (Admin) |
| DELETE | /contact/:id | Delete message (Admin)        |

### Content (CMS)

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | /content      | Get all content        |
| GET    | /content/:key | Get content by key     |
| POST   | /content      | Create content (Admin) |
| PUT    | /content/:key | Update content (Admin) |
| DELETE | /content/:key | Delete content (Admin) |

### Translations

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | /translations            | Get all translations          |
| GET    | /translations/:namespace | Get translations by namespace |
| POST   | /translations            | Create translation (Admin)    |
| PUT    | /translations/:id        | Update translation (Admin)    |
| DELETE | /translations/:id        | Delete translation (Admin)    |

### Menus

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | /menus                    | Get all menus        |
| GET    | /menus/:slug              | Get menu by slug     |
| GET    | /menus/location/:location | Get menu by location |
| POST   | /menus                    | Create menu (Admin)  |
| PUT    | /menus/:id                | Update menu (Admin)  |
| DELETE | /menus/:id                | Delete menu (Admin)  |

### Settings

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| GET    | /settings | Get site settings       |
| PUT    | /settings | Update settings (Admin) |

---

## API Documentation

- Swagger UI: http://localhost:5000/api/docs
- OpenAPI JSON: http://localhost:5000/api/docs.json

---

## Testing Checklist

### Frontend Pages Test

- [ ] Home Page (AR/EN)
- [ ] About Page (AR/EN)
- [ ] Services List Page (AR/EN)
- [ ] Service Detail Page (AR/EN)
- [ ] Projects List Page (AR/EN)
- [ ] Team Page (AR/EN)
- [ ] Blog List Page (AR/EN)
- [ ] Blog Post Page (AR/EN)
- [ ] Careers List Page (AR/EN)
- [ ] Career Detail Page (AR/EN)
- [ ] Contact Page (AR/EN)
- [ ] Language Switcher Works
- [ ] Dark Mode Toggle Works
- [ ] Mobile Responsive

### Admin Dashboard Test

- [ ] Admin Login
- [ ] Dashboard Stats
- [ ] Services CRUD
- [ ] Projects CRUD
- [ ] Team Members CRUD
- [ ] Blog Posts CRUD
- [ ] Careers CRUD
- [ ] Messages Management
- [ ] Newsletter Subscribers
- [ ] Content Management
- [ ] Translations Management
- [ ] Menu Management
- [ ] Settings Management

### API Endpoints Test

- [ ] Health Check Returns 200
- [ ] Auth Endpoints Work
- [ ] Services CRUD Works
- [ ] Projects CRUD Works
- [ ] Team CRUD Works
- [ ] Contact Form Submission
- [ ] Content Management
- [ ] Translations API
- [ ] Menus API
- [ ] Settings API
