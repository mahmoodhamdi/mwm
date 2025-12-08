# Newsletter Campaigns Implementation Plan

## Overview

This document outlines the implementation plan for the Newsletter campaigns feature in the MWM platform. The feature will allow managing newsletter subscribers and sending email campaigns.

---

## Current State

### What Exists

- **Frontend Admin Page**: Complete UI with mock data (`frontend/src/app/[locale]/admin/newsletter/page.tsx`)
- **Public Newsletter Component**: Subscription form with TODO for API (`frontend/src/components/common/Newsletter.tsx`)
- **Frontend Service Stubs**: `subscribeNewsletter()` and `unsubscribeNewsletter()` in contact.service.ts
- **Email Service**: Fully implemented Nodemailer service (`backend/src/services/email.service.ts`)
- **Settings Model**: Has newsletter feature toggle and email template structure
- **Translations**: Partial i18n support for newsletter

### What's Missing

- Backend Subscriber model
- Backend Newsletter/Campaign model
- Backend API routes and controllers
- Backend validation schemas
- Frontend admin service layer
- API integration in admin page
- Public subscription endpoint connection

---

## Implementation Plan

### Phase 1: Backend Models

#### 1.1 Subscriber Model (`backend/src/models/Subscriber.ts`)

```typescript
interface ISubscriber {
  email: string; // unique, indexed
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  source: 'website' | 'import' | 'manual' | 'api';
  tags: string[];
  locale: 'ar' | 'en';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  verificationToken?: string;
  unsubscribeToken: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Static Methods:**

- `getAll(filters, pagination)` - List subscribers with filtering
- `getByEmail(email)` - Find by email
- `getActiveCount()` - Count active subscribers
- `getByTags(tags)` - Get subscribers by tags
- `bulkUpdateStatus(ids, status)` - Bulk status update
- `getAllTags()` - Get unique tags list

#### 1.2 Newsletter Campaign Model (`backend/src/models/Newsletter.ts`)

```typescript
interface INewsletter {
  subject: { ar: string; en: string };
  content: { ar: string; en: string };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  recipientType: 'all' | 'tags' | 'specific';
  recipientTags?: string[];
  recipientIds?: ObjectId[];
  scheduledAt?: Date;
  sentAt?: Date;
  metrics: {
    recipientCount: number;
    sentCount: number;
    openCount: number;
    clickCount: number;
    bounceCount: number;
  };
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Static Methods:**

- `getAll(filters, pagination)` - List campaigns
- `getById(id)` - Get campaign details
- `updateMetrics(id, metrics)` - Update campaign metrics
- `getStats()` - Get overall campaign statistics

---

### Phase 2: Backend Validation Schemas

#### 2.1 Newsletter Validation (`backend/src/validations/newsletter.validation.ts`)

**Schemas:**

- `subscribeSchema` - Email validation for public subscription
- `createSubscriberSchema` - Admin manual subscriber creation
- `updateSubscriberSchema` - Subscriber updates
- `bulkActionSchema` - Bulk operations validation
- `createCampaignSchema` - Campaign creation
- `updateCampaignSchema` - Campaign updates
- `scheduleCampaignSchema` - Schedule validation
- `querySubscribersSchema` - List filtering
- `queryCampaignsSchema` - Campaign list filtering

---

### Phase 3: Backend Routes & Controllers

#### 3.1 Newsletter Routes (`backend/src/routes/newsletter.routes.ts`)

**Public Routes:**

```
POST   /api/v1/newsletter/subscribe      - Subscribe to newsletter
POST   /api/v1/newsletter/unsubscribe    - Unsubscribe with token
GET    /api/v1/newsletter/verify/:token  - Verify email subscription
```

**Admin Routes (Protected):**

```
# Subscribers
GET    /api/v1/newsletter/subscribers           - List subscribers
POST   /api/v1/newsletter/subscribers           - Add subscriber
GET    /api/v1/newsletter/subscribers/stats     - Subscriber statistics
GET    /api/v1/newsletter/subscribers/tags      - Get all tags
POST   /api/v1/newsletter/subscribers/import    - Import CSV
GET    /api/v1/newsletter/subscribers/export    - Export CSV
PUT    /api/v1/newsletter/subscribers/:id       - Update subscriber
DELETE /api/v1/newsletter/subscribers/:id       - Delete subscriber
POST   /api/v1/newsletter/subscribers/bulk      - Bulk actions

# Campaigns
GET    /api/v1/newsletter/campaigns             - List campaigns
POST   /api/v1/newsletter/campaigns             - Create campaign
GET    /api/v1/newsletter/campaigns/stats       - Campaign statistics
GET    /api/v1/newsletter/campaigns/:id         - Get campaign
PUT    /api/v1/newsletter/campaigns/:id         - Update campaign
DELETE /api/v1/newsletter/campaigns/:id         - Delete campaign
POST   /api/v1/newsletter/campaigns/:id/send    - Send campaign
POST   /api/v1/newsletter/campaigns/:id/schedule - Schedule campaign
POST   /api/v1/newsletter/campaigns/:id/cancel  - Cancel scheduled
POST   /api/v1/newsletter/campaigns/:id/duplicate - Duplicate campaign
```

#### 3.2 Newsletter Controller (`backend/src/controllers/newsletter.controller.ts`)

**Methods:**

- `subscribe` - Handle public subscription
- `unsubscribe` - Handle unsubscription
- `verifyEmail` - Verify subscriber email
- `getSubscribers` - List subscribers (admin)
- `createSubscriber` - Add subscriber (admin)
- `updateSubscriber` - Update subscriber (admin)
- `deleteSubscriber` - Delete subscriber (admin)
- `bulkSubscriberAction` - Bulk operations (admin)
- `importSubscribers` - CSV import (admin)
- `exportSubscribers` - CSV export (admin)
- `getSubscriberStats` - Statistics (admin)
- `getSubscriberTags` - Tags list (admin)
- `getCampaigns` - List campaigns (admin)
- `createCampaign` - Create campaign (admin)
- `getCampaign` - Get campaign (admin)
- `updateCampaign` - Update campaign (admin)
- `deleteCampaign` - Delete campaign (admin)
- `sendCampaign` - Send immediately (admin)
- `scheduleCampaign` - Schedule send (admin)
- `cancelCampaign` - Cancel scheduled (admin)
- `duplicateCampaign` - Duplicate campaign (admin)
- `getCampaignStats` - Statistics (admin)

---

### Phase 4: Backend Services

#### 4.1 Newsletter Service (`backend/src/services/newsletter.service.ts`)

**Methods:**

- `addSubscriber(data)` - Add new subscriber with verification
- `removeSubscriber(email, token)` - Process unsubscription
- `verifySubscriber(token)` - Verify email address
- `sendCampaign(campaignId)` - Send campaign to recipients
- `scheduleCampaign(campaignId, scheduledAt)` - Schedule campaign
- `generateUnsubscribeToken(email)` - Create unsubscribe token
- `generateVerificationToken(email)` - Create verification token
- `processImport(csvData)` - Process CSV import
- `generateExport(filters)` - Generate CSV export

---

### Phase 5: Frontend Admin Service

#### 5.1 Newsletter Admin Service (`frontend/src/services/admin/newsletter.service.ts`)

**Functions:**

```typescript
// Subscribers
getSubscribers(filters);
createSubscriber(data);
updateSubscriber(id, data);
deleteSubscriber(id);
bulkSubscriberAction(action, ids);
importSubscribers(file);
exportSubscribers(filters);
getSubscriberStats();
getSubscriberTags();

// Campaigns
getCampaigns(filters);
createCampaign(data);
getCampaign(id);
updateCampaign(id, data);
deleteCampaign(id);
sendCampaign(id);
scheduleCampaign(id, scheduledAt);
cancelCampaign(id);
duplicateCampaign(id);
getCampaignStats();
```

---

### Phase 6: Frontend Integration

#### 6.1 Connect Admin Newsletter Page

- Replace mock data with API calls
- Add loading states
- Add error handling
- Implement CSV import/export
- Connect campaign send/schedule

#### 6.2 Connect Public Newsletter Form

- Implement API call in Newsletter.tsx
- Handle success/error responses
- Add email verification flow

---

## Implementation Order

1. **Backend Models** (Subscriber, Newsletter)
2. **Backend Validations** (newsletter.validation.ts)
3. **Backend Routes & Controller** (newsletter.routes.ts, newsletter.controller.ts)
4. **Backend Service** (newsletter.service.ts)
5. **Register Routes** (app.ts)
6. **Backend Tests** (unit + integration)
7. **Frontend Admin Service** (newsletter.service.ts)
8. **Frontend Admin Page Integration**
9. **Frontend Public Form Integration**
10. **Frontend Tests**

---

## Testing Strategy

### Backend Tests

- Model tests: Subscriber validation, Newsletter validation, static methods
- Controller tests: All endpoint handlers
- Service tests: Business logic, email generation
- Integration tests: Full API flow

### Frontend Tests

- Service tests: API calls mocking
- Component tests: Admin page with mocked service
- Public form tests: Subscription flow

---

## File Structure After Implementation

```
backend/src/
├── models/
│   ├── Subscriber.ts          (NEW)
│   └── Newsletter.ts          (NEW)
├── controllers/
│   └── newsletter.controller.ts (NEW)
├── routes/
│   └── newsletter.routes.ts   (NEW)
├── services/
│   └── newsletter.service.ts  (NEW)
├── validations/
│   └── newsletter.validation.ts (NEW)
└── app.ts                     (MODIFY - register routes)

frontend/src/
├── services/
│   ├── admin/
│   │   └── newsletter.service.ts (NEW)
│   └── public/
│       └── contact.service.ts (MODIFY - update subscription)
├── app/[locale]/admin/newsletter/
│   └── page.tsx               (MODIFY - connect to API)
└── components/common/
    └── Newsletter.tsx         (MODIFY - connect to API)
```

---

## API Response Formats

### Subscriber List Response

```json
{
  "success": true,
  "data": {
    "subscribers": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### Campaign Response

```json
{
  "success": true,
  "data": {
    "campaign": {
      "_id": "...",
      "subject": { "ar": "...", "en": "..." },
      "content": { "ar": "...", "en": "..." },
      "status": "draft",
      "metrics": {
        "recipientCount": 0,
        "sentCount": 0,
        "openCount": 0,
        "clickCount": 0,
        "bounceCount": 0
      }
    }
  }
}
```

---

## Notes

- Email verification is optional but recommended for quality subscribers
- CSV import should validate emails and skip duplicates
- Campaign sending will use the existing email.service.ts
- For MVP, campaigns are sent immediately (no queue system)
- Future enhancement: Add job queue for async sending of large campaigns

---

_Created: 2024-12-08_
