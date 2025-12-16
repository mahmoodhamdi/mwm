# P1 Features Implementation Plan

**Date:** December 16, 2025
**Status:** In Progress

---

## Overview

This document outlines the implementation plan for P1 priority features.

---

## FEAT-001: Blog Comments System

### Backend Implementation

1. **Create Comment Model** (`backend/src/models/Comment.ts`)
   - Fields: content, author (name, email), blogPost (ref), parentComment (ref for replies), status (pending/approved/spam), likes, createdAt
   - Support nested replies (max 2 levels)
   - Moderation status for spam prevention

2. **Create Comment Controller** (`backend/src/controllers/comment.controller.ts`)
   - `createComment` - Public (with rate limiting)
   - `getCommentsByPost` - Public (approved only)
   - `getAllComments` - Admin (all statuses)
   - `updateCommentStatus` - Admin (approve/reject/spam)
   - `deleteComment` - Admin
   - `likeComment` - Public

3. **Create Comment Routes** (`backend/src/routes/comment.routes.ts`)
   - POST `/api/v1/blog/:postId/comments` - Add comment
   - GET `/api/v1/blog/:postId/comments` - Get post comments
   - GET `/api/v1/comments` - Admin: all comments
   - PUT `/api/v1/comments/:id/status` - Admin: update status
   - DELETE `/api/v1/comments/:id` - Admin: delete

4. **Create Comment Validation** (`backend/src/validations/comment.validation.ts`)

### Frontend Implementation

1. **Create Comment Components**
   - `CommentSection` - Main container
   - `CommentForm` - Add new comment
   - `CommentList` - Display comments
   - `CommentItem` - Single comment with replies
   - `ReplyForm` - Reply to comment

2. **Add Comment Service** (`frontend/src/services/public/comments.ts`)

3. **Update Blog Post Page** - Integrate comments section

4. **Admin Comments Management** - Add to admin dashboard

---

## FEAT-002: Resume File Upload

### Current State

- Multer middleware exists (`backend/src/utils/upload.ts`)
- Resume upload endpoint exists (`/api/v1/careers/upload-resume`)
- Need to verify frontend integration

### Implementation

1. Verify backend upload handler
2. Create/update frontend upload component
3. Integrate with job application form
4. Add file validation (PDF, DOC, DOCX, max 5MB)

---

## ADMIN-001: Team Management Page

### Current State

- Backend API exists (`/api/v1/team`)
- Frontend page exists but may be UI-only

### Implementation

1. Check existing API endpoints
2. Connect frontend CRUD operations to API
3. Add loading states and error handling

---

## ADMIN-002: Messages Inbox Page

### Current State

- Backend API exists (`/api/v1/contact/messages`)
- Frontend page exists but may be UI-only

### Implementation

1. Connect to contact messages API
2. Implement inbox features (read/unread, reply, archive)
3. Add real-time updates (optional)

---

## ADMIN-003: Users Management Page

### Current State

- Backend API may exist (`/api/v1/users`)
- Frontend page exists but may be UI-only

### Implementation

1. Check/create users API endpoints
2. Connect frontend to API
3. Implement user CRUD with role management

---

## Testing Requirements

Each feature must have:

- Backend unit tests
- Backend integration tests
- Frontend component tests

---

## Execution Order

1. FEAT-001: Blog Comments (most complex)
2. FEAT-002: Resume Upload (quick win)
3. ADMIN-001: Team Management
4. ADMIN-002: Messages Inbox
5. ADMIN-003: Users Management
