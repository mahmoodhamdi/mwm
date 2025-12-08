# Remaining Features Implementation Plan

## Overview

This document outlines the implementation plan for the remaining features in the MWM project.

---

## Feature 1: Blog System Backend

### Models to Create

#### 1.1 BlogCategory Model (`backend/src/models/BlogCategory.ts`)

```typescript
{
  name: LocalizedString; // { ar: string, en: string }
  slug: string; // URL-friendly identifier
  description: LocalizedString; // Optional description
  image: string; // Category image URL
  parent: ObjectId; // Parent category (for nested categories)
  order: number; // Display order
  isActive: boolean; // Active status
  postCount: number; // Virtual field - count of posts
  createdAt: Date;
  updatedAt: Date;
}
```

#### 1.2 BlogPost Model (`backend/src/models/BlogPost.ts`)

```typescript
{
  title: LocalizedString       // { ar: string, en: string }
  slug: string                 // URL-friendly identifier
  excerpt: LocalizedString     // Short summary
  content: LocalizedString     // Full HTML content
  featuredImage: string        // Main image URL
  images: string[]             // Gallery images
  category: ObjectId           // Reference to BlogCategory
  tags: LocalizedString[]      // Array of tags
  author: ObjectId             // Reference to User
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt: Date            // Publication date
  scheduledAt: Date            // Scheduled publication date
  isFeatured: boolean          // Featured on homepage
  views: number                // View count
  readingTime: number          // Estimated reading time (minutes)
  seo: {
    metaTitle: LocalizedString
    metaDescription: LocalizedString
    metaKeywords: string[]
    ogImage: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### API Endpoints

| Method | Endpoint               | Auth   | Description                         |
| ------ | ---------------------- | ------ | ----------------------------------- |
| GET    | /blog/posts            | Public | Get all published posts (paginated) |
| GET    | /blog/posts/:slug      | Public | Get post by slug                    |
| GET    | /blog/posts/featured   | Public | Get featured posts                  |
| GET    | /blog/categories       | Public | Get all categories                  |
| GET    | /blog/categories/:slug | Public | Get category with posts             |
| GET    | /blog/tags             | Public | Get all tags                        |
| POST   | /blog/posts            | Admin  | Create post                         |
| PUT    | /blog/posts/:id        | Admin  | Update post                         |
| DELETE | /blog/posts/:id        | Admin  | Delete post                         |
| POST   | /blog/categories       | Admin  | Create category                     |
| PUT    | /blog/categories/:id   | Admin  | Update category                     |
| DELETE | /blog/categories/:id   | Admin  | Delete category                     |

### Files to Create/Modify

1. `backend/src/models/BlogCategory.ts` - Category model
2. `backend/src/models/BlogPost.ts` - Post model
3. `backend/src/models/index.ts` - Export new models
4. `backend/src/validations/blog.validation.ts` - Joi schemas
5. `backend/src/controllers/blog.controller.ts` - Route handlers
6. `backend/src/routes/blog.routes.ts` - Route definitions
7. `backend/src/routes/index.ts` - Register routes
8. `backend/tests/integration/blog.test.ts` - Integration tests

---

## Feature 2: Careers System Backend

### Models to Create

#### 2.1 Job Model (`backend/src/models/Job.ts`)

```typescript
{
  title: LocalizedString       // { ar: string, en: string }
  slug: string                 // URL-friendly identifier
  description: LocalizedString // Full job description
  requirements: LocalizedString[] // List of requirements
  responsibilities: LocalizedString[] // List of responsibilities
  benefits: LocalizedString[]  // List of benefits
  department: ObjectId         // Reference to Department
  location: LocalizedString    // Job location
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  salaryRange: {
    min: number
    max: number
    currency: string
    period: 'hourly' | 'monthly' | 'yearly'
    isPublic: boolean
  }
  skills: string[]             // Required skills
  status: 'draft' | 'open' | 'closed' | 'filled'
  applicationDeadline: Date    // Application deadline
  applicationsCount: number    // Number of applications
  isFeatured: boolean          // Featured job
  createdAt: Date
  updatedAt: Date
}
```

#### 2.2 JobApplication Model (`backend/src/models/JobApplication.ts`)

```typescript
{
  job: ObjectId; // Reference to Job
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl: string; // Uploaded resume URL
  coverLetter: string; // Cover letter text
  linkedinUrl: string; // LinkedIn profile
  portfolioUrl: string; // Portfolio website
  expectedSalary: number;
  availableFrom: Date; // Start date availability
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected';
  notes: string; // Internal notes (admin only)
  rating: number; // 1-5 rating
  reviewedBy: ObjectId; // User who reviewed
  reviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Endpoints

| Method | Endpoint                  | Auth   | Description                     |
| ------ | ------------------------- | ------ | ------------------------------- |
| GET    | /careers/jobs             | Public | Get all open jobs               |
| GET    | /careers/jobs/:slug       | Public | Get job by slug                 |
| GET    | /careers/jobs/featured    | Public | Get featured jobs               |
| GET    | /careers/departments      | Public | Get departments with job counts |
| POST   | /careers/applications     | Public | Submit job application          |
| GET    | /careers/applications     | Admin  | Get all applications            |
| GET    | /careers/applications/:id | Admin  | Get application details         |
| PUT    | /careers/applications/:id | Admin  | Update application status       |
| POST   | /careers/jobs             | Admin  | Create job                      |
| PUT    | /careers/jobs/:id         | Admin  | Update job                      |
| DELETE | /careers/jobs/:id         | Admin  | Delete job                      |

### Files to Create/Modify

1. `backend/src/models/Job.ts` - Job model
2. `backend/src/models/JobApplication.ts` - Application model
3. `backend/src/models/index.ts` - Export new models
4. `backend/src/validations/careers.validation.ts` - Joi schemas
5. `backend/src/controllers/careers.controller.ts` - Route handlers
6. `backend/src/routes/careers.routes.ts` - Route definitions
7. `backend/src/routes/index.ts` - Register routes
8. `backend/tests/integration/careers.test.ts` - Integration tests

---

## Feature 3: Frontend API Integration

### Blog Frontend Services

1. `frontend/src/services/public/blog.ts` - Public blog API service
2. Update `frontend/src/app/[locale]/blog/page.tsx` - Blog listing
3. Update `frontend/src/app/[locale]/blog/[slug]/page.tsx` - Blog post
4. Update `frontend/src/services/index.ts` - Export blog service

### Careers Frontend Services

1. `frontend/src/services/public/careers.ts` - Public careers API service
2. Update `frontend/src/app/[locale]/careers/page.tsx` - Jobs listing
3. Update `frontend/src/app/[locale]/careers/[slug]/page.tsx` - Job detail
4. Update `frontend/src/services/index.ts` - Export careers service

---

## Feature 4: Newsletter Campaigns

### Model Enhancement

Update `backend/src/models/Newsletter.ts` (create if not exists):

```typescript
{
  email: string
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribedAt: Date
  unsubscribedAt: Date
  source: string              // Where they subscribed from
  campaigns: [{
    campaignId: ObjectId
    sentAt: Date
    openedAt: Date
    clickedAt: Date
  }]
}
```

Create `backend/src/models/NewsletterCampaign.ts`:

```typescript
{
  name: string;
  subject: LocalizedString;
  content: LocalizedString; // HTML email content
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledAt: Date;
  sentAt: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  }
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Implementation Order

1. **Blog System Backend** (Priority 1)
   - Models, validations, controllers, routes, tests

2. **Careers System Backend** (Priority 2)
   - Models, validations, controllers, routes, tests

3. **Frontend Integration** (Priority 3)
   - Blog services and page updates
   - Careers services and page updates

4. **Newsletter Campaigns** (Priority 4)
   - Model updates, campaign management

---

## Testing Strategy

Each feature will include:

- Unit tests for models
- Integration tests for API endpoints
- Test coverage > 80%

All tests must pass before committing.

---

_Created: 2025-12-08_
