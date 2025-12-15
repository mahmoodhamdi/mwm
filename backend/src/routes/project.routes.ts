/**
 * Project Routes
 * مسارات المشاريع
 */

import { Router } from 'express';
import { projectController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// ============================================
// Admin Routes - Categories (MUST come before /:slug)
// مسارات المسؤول - الفئات
// ============================================

// GET /api/v1/projects/admin/categories - Get all categories (Admin)
router.get(
  '/admin/categories',
  authenticate,
  authorize('projects:read'),
  projectController.getAllCategories
);

// POST /api/v1/projects/admin/categories - Create category
router.post(
  '/admin/categories',
  authenticate,
  authorize('projects:create'),
  projectController.createCategory
);

// PUT /api/v1/projects/admin/categories/:id - Update category
router.put(
  '/admin/categories/:id',
  authenticate,
  authorize('projects:update'),
  projectController.updateCategory
);

// DELETE /api/v1/projects/admin/categories/:id - Delete category
router.delete(
  '/admin/categories/:id',
  authenticate,
  authorize('projects:delete'),
  projectController.deleteCategory
);

// ============================================
// Admin Routes - Projects (MUST come before /:slug)
// مسارات المسؤول - المشاريع
// ============================================

// GET /api/v1/projects/admin - Get all projects (Admin)
router.get('/admin', authenticate, authorize('projects:read'), projectController.getAllProjects);

// PUT /api/v1/projects/admin/reorder - Reorder projects (MUST come before /admin/:id)
router.put(
  '/admin/reorder',
  authenticate,
  authorize('projects:update'),
  projectController.reorderProjects
);

// GET /api/v1/projects/admin/:id - Get project by ID (Admin)
router.get(
  '/admin/:id',
  authenticate,
  authorize('projects:read'),
  projectController.getProjectById
);

// POST /api/v1/projects/admin - Create project
router.post('/admin', authenticate, authorize('projects:create'), projectController.createProject);

// PUT /api/v1/projects/admin/:id/publish - Toggle publish status
router.put(
  '/admin/:id/publish',
  authenticate,
  authorize('projects:update'),
  projectController.togglePublishStatus
);

// PUT /api/v1/projects/admin/:id/featured - Toggle featured status
router.put(
  '/admin/:id/featured',
  authenticate,
  authorize('projects:update'),
  projectController.toggleFeaturedStatus
);

// PUT /api/v1/projects/admin/:id - Update project
router.put(
  '/admin/:id',
  authenticate,
  authorize('projects:update'),
  projectController.updateProject
);

// DELETE /api/v1/projects/admin/:id - Delete project
router.delete(
  '/admin/:id',
  authenticate,
  authorize('projects:delete'),
  projectController.deleteProject
);

// ============================================
// Public Routes - Categories
// المسارات العامة - الفئات
// ============================================

// GET /api/v1/projects/categories - Get all active categories
router.get('/categories', projectController.getCategories);

// GET /api/v1/projects/categories/:slug - Get category by slug
router.get('/categories/:slug', projectController.getCategoryBySlug);

// ============================================
// Public Routes - Projects
// المسارات العامة - المشاريع
// ============================================

// GET /api/v1/projects/featured - Get featured projects
router.get('/featured', projectController.getFeaturedProjects);

// GET /api/v1/projects - Get all published projects
router.get('/', projectController.getProjects);

// GET /api/v1/projects/:slug - Get project by slug (MUST be LAST - catches all remaining paths)
router.get('/:slug', projectController.getProjectBySlug);

export default router;
