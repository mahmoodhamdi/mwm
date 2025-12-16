# MWM Routes Reference

Quick reference for all frontend pages and backend API endpoints.

---

## Frontend Pages

### Public Pages

| Page           | Arabic URL                               | English URL                              |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| Home           | http://localhost:3000/ar                 | http://localhost:3000/en                 |
| About          | http://localhost:3000/ar/about           | http://localhost:3000/en/about           |
| Services       | http://localhost:3000/ar/services        | http://localhost:3000/en/services        |
| Service Detail | http://localhost:3000/ar/services/[slug] | http://localhost:3000/en/services/[slug] |
| Projects       | http://localhost:3000/ar/projects        | http://localhost:3000/en/projects        |
| Project Detail | http://localhost:3000/ar/projects/[slug] | http://localhost:3000/en/projects/[slug] |
| Team           | http://localhost:3000/ar/team            | http://localhost:3000/en/team            |
| Team Member    | http://localhost:3000/ar/team/[slug]     | http://localhost:3000/en/team/[slug]     |
| Blog           | http://localhost:3000/ar/blog            | http://localhost:3000/en/blog            |
| Blog Post      | http://localhost:3000/ar/blog/[slug]     | http://localhost:3000/en/blog/[slug]     |
| Careers        | http://localhost:3000/ar/careers         | http://localhost:3000/en/careers         |
| Career Detail  | http://localhost:3000/ar/careers/[slug]  | http://localhost:3000/en/careers/[slug]  |
| Contact        | http://localhost:3000/ar/contact         | http://localhost:3000/en/contact         |

### Admin Dashboard Pages

| Page          | URL                                          |
| ------------- | -------------------------------------------- |
| Dashboard     | http://localhost:3000/ar/admin               |
| Services      | http://localhost:3000/ar/admin/services      |
| Projects      | http://localhost:3000/ar/admin/projects      |
| Team          | http://localhost:3000/ar/admin/team          |
| Blog          | http://localhost:3000/ar/admin/blog          |
| Careers       | http://localhost:3000/ar/admin/careers       |
| Messages      | http://localhost:3000/ar/admin/messages      |
| Newsletter    | http://localhost:3000/ar/admin/newsletter    |
| Analytics     | http://localhost:3000/ar/admin/analytics     |
| Notifications | http://localhost:3000/ar/admin/notifications |
| Users         | http://localhost:3000/ar/admin/users         |
| Activity      | http://localhost:3000/ar/admin/activity      |
| Content       | http://localhost:3000/ar/admin/content       |
| Translations  | http://localhost:3000/ar/admin/translations  |
| Menus         | http://localhost:3000/ar/admin/menus         |
| Settings      | http://localhost:3000/ar/admin/settings      |

---

## Backend API

**Base URL:** `http://localhost:5000/api/v1`

### Health Check

| Method | Endpoint | Description  |
| ------ | -------- | ------------ |
| GET    | /health  | Health check |

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

| Method | Endpoint             | Auth   | Description            |
| ------ | -------------------- | ------ | ---------------------- |
| GET    | /services            | Public | Get all services       |
| GET    | /services/:id        | Public | Get service by ID      |
| GET    | /services/slug/:slug | Public | Get service by slug    |
| GET    | /services/categories | Public | Get service categories |
| POST   | /services            | Admin  | Create service         |
| PUT    | /services/:id        | Admin  | Update service         |
| DELETE | /services/:id        | Admin  | Delete service         |

### Projects

| Method | Endpoint             | Auth   | Description            |
| ------ | -------------------- | ------ | ---------------------- |
| GET    | /projects            | Public | Get all projects       |
| GET    | /projects/:id        | Public | Get project by ID      |
| GET    | /projects/slug/:slug | Public | Get project by slug    |
| GET    | /projects/categories | Public | Get project categories |
| POST   | /projects            | Admin  | Create project         |
| PUT    | /projects/:id        | Admin  | Update project         |
| DELETE | /projects/:id        | Admin  | Delete project         |

### Team

| Method | Endpoint          | Auth   | Description          |
| ------ | ----------------- | ------ | -------------------- |
| GET    | /team             | Public | Get all team members |
| GET    | /team/:id         | Public | Get member by ID     |
| GET    | /team/slug/:slug  | Public | Get member by slug   |
| GET    | /team/departments | Public | Get departments      |
| POST   | /team             | Admin  | Create team member   |
| PUT    | /team/:id         | Admin  | Update team member   |
| DELETE | /team/:id         | Admin  | Delete team member   |

### Contact

| Method | Endpoint     | Auth   | Description           |
| ------ | ------------ | ------ | --------------------- |
| POST   | /contact     | Public | Submit contact form   |
| GET    | /contact     | Admin  | Get all messages      |
| GET    | /contact/:id | Admin  | Get message by ID     |
| PUT    | /contact/:id | Admin  | Update message status |
| DELETE | /contact/:id | Admin  | Delete message        |

### Content (CMS)

| Method | Endpoint      | Auth   | Description        |
| ------ | ------------- | ------ | ------------------ |
| GET    | /content      | Public | Get all content    |
| GET    | /content/:key | Public | Get content by key |
| POST   | /content      | Admin  | Create content     |
| PUT    | /content/:key | Admin  | Update content     |
| DELETE | /content/:key | Admin  | Delete content     |

### Translations

| Method | Endpoint                 | Auth   | Description          |
| ------ | ------------------------ | ------ | -------------------- |
| GET    | /translations            | Public | Get all translations |
| GET    | /translations/:namespace | Public | Get by namespace     |
| POST   | /translations            | Admin  | Create translation   |
| PUT    | /translations/:id        | Admin  | Update translation   |
| DELETE | /translations/:id        | Admin  | Delete translation   |

### Menus

| Method | Endpoint                  | Auth   | Description          |
| ------ | ------------------------- | ------ | -------------------- |
| GET    | /menus                    | Public | Get all menus        |
| GET    | /menus/:slug              | Public | Get menu by slug     |
| GET    | /menus/location/:location | Public | Get menu by location |
| POST   | /menus                    | Admin  | Create menu          |
| PUT    | /menus/:id                | Admin  | Update menu          |
| DELETE | /menus/:id                | Admin  | Delete menu          |

### Settings

| Method | Endpoint  | Auth   | Description       |
| ------ | --------- | ------ | ----------------- |
| GET    | /settings | Public | Get site settings |
| PUT    | /settings | Admin  | Update settings   |

### Blog

| Method | Endpoint                  | Auth   | Description           |
| ------ | ------------------------- | ------ | --------------------- |
| GET    | /blog/posts               | Public | Get all posts         |
| GET    | /blog/posts/:slug         | Public | Get post by slug      |
| GET    | /blog/posts/:slug/related | Public | Get related posts     |
| GET    | /blog/categories          | Public | Get blog categories   |
| GET    | /blog/categories/:slug    | Public | Get category by slug  |
| GET    | /blog/tags                | Public | Get all tags          |
| GET    | /blog/featured            | Public | Get featured posts    |
| GET    | /blog/admin/posts         | Admin  | Get all posts (admin) |
| POST   | /blog/admin/posts         | Admin  | Create post           |
| PUT    | /blog/admin/posts/:id     | Admin  | Update post           |
| DELETE | /blog/admin/posts/:id     | Admin  | Delete post           |

### Careers

| Method | Endpoint                               | Auth   | Description          |
| ------ | -------------------------------------- | ------ | -------------------- |
| GET    | /careers/jobs                          | Public | Get all jobs         |
| GET    | /careers/jobs/:slug                    | Public | Get job by slug      |
| GET    | /careers/featured                      | Public | Get featured jobs    |
| POST   | /careers/jobs/:slug/apply              | Public | Submit application   |
| GET    | /careers/admin/jobs                    | Admin  | Get all jobs (admin) |
| POST   | /careers/admin/jobs                    | Admin  | Create job           |
| PUT    | /careers/admin/jobs/:id                | Admin  | Update job           |
| DELETE | /careers/admin/jobs/:id                | Admin  | Delete job           |
| GET    | /careers/admin/jobs/:id/applications   | Admin  | Get applications     |
| PATCH  | /careers/admin/applications/:id/status | Admin  | Update app status    |

### Newsletter

| Method | Endpoint                             | Auth   | Description       |
| ------ | ------------------------------------ | ------ | ----------------- |
| POST   | /newsletter/subscribe                | Public | Subscribe         |
| POST   | /newsletter/unsubscribe              | Public | Unsubscribe       |
| GET    | /newsletter/admin/subscribers        | Admin  | List subscribers  |
| POST   | /newsletter/admin/subscribers        | Admin  | Add subscriber    |
| PUT    | /newsletter/admin/subscribers/:id    | Admin  | Update subscriber |
| GET    | /newsletter/admin/subscribers/stats  | Admin  | Subscriber stats  |
| GET    | /newsletter/admin/campaigns          | Admin  | List campaigns    |
| POST   | /newsletter/admin/campaigns          | Admin  | Create campaign   |
| PUT    | /newsletter/admin/campaigns/:id      | Admin  | Update campaign   |
| POST   | /newsletter/admin/campaigns/:id/send | Admin  | Send campaign     |

### Dashboard

| Method | Endpoint               | Auth  | Description     |
| ------ | ---------------------- | ----- | --------------- |
| GET    | /dashboard/stats       | Admin | Get all stats   |
| GET    | /dashboard/activity    | Admin | Recent activity |
| GET    | /dashboard/charts      | Admin | Charts data     |
| GET    | /dashboard/quick-stats | Admin | Quick stats     |

### Activity

| Method | Endpoint                     | Auth  | Description         |
| ------ | ---------------------------- | ----- | ------------------- |
| GET    | /activity                    | Admin | List activity logs  |
| GET    | /activity/user/:userId       | Admin | Logs by user        |
| GET    | /activity/resource/:resource | Admin | Logs by resource    |
| GET    | /activity/recent             | Admin | Recent logs         |
| GET    | /activity/stats              | Admin | Activity statistics |
| GET    | /activity/me                 | Auth  | My activity         |

### Notifications

| Method | Endpoint                       | Auth  | Description         |
| ------ | ------------------------------ | ----- | ------------------- |
| GET    | /notifications                 | Auth  | Get notifications   |
| GET    | /notifications/unread-count    | Auth  | Unread count        |
| PUT    | /notifications/:id/read        | Auth  | Mark as read        |
| PUT    | /notifications/read-all        | Auth  | Mark all as read    |
| DELETE | /notifications/:id             | Auth  | Delete notification |
| POST   | /notifications/device-token    | Auth  | Register device     |
| DELETE | /notifications/device-token    | Auth  | Remove device token |
| POST   | /notifications/admin/send      | Admin | Send notification   |
| POST   | /notifications/admin/broadcast | Admin | Broadcast to all    |

### Users

| Method | Endpoint          | Auth  | Description        |
| ------ | ----------------- | ----- | ------------------ |
| GET    | /users            | Admin | List users         |
| GET    | /users/:id        | Admin | Get user by ID     |
| POST   | /users            | Admin | Create user        |
| PUT    | /users/:id        | Admin | Update user        |
| DELETE | /users/:id        | Admin | Delete user        |
| PATCH  | /users/:id/status | Admin | Toggle user status |

---

## API Documentation

- **Swagger UI:** http://localhost:5000/api/docs
- **OpenAPI JSON:** http://localhost:5000/api/docs.json

---

_Last Updated: 2025-12-16_
