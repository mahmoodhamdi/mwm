/**
 * Service Routes
 * مسارات الخدمات
 */

import { Router } from 'express';
import { serviceController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// ============================================
// Public Routes - Categories
// المسارات العامة - الفئات
// ============================================

// GET /api/v1/services/categories - Get all active categories
router.get('/categories', serviceController.getCategories);

// GET /api/v1/services/categories/:slug - Get category by slug
router.get('/categories/:slug', serviceController.getCategoryBySlug);

// ============================================
// Public Routes - Services
// المسارات العامة - الخدمات
// ============================================

// GET /api/v1/services/featured - Get featured services
router.get('/featured', serviceController.getFeaturedServices);

// GET /api/v1/services/:slug - Get service by slug
router.get('/:slug', serviceController.getServiceBySlug);

// GET /api/v1/services - Get all active services
router.get('/', serviceController.getServices);

// ============================================
// Admin Routes - Categories
// مسارات المسؤول - الفئات
// ============================================

// GET /api/v1/services/admin/categories - Get all categories (Admin)
router.get(
  '/admin/categories',
  authenticate,
  authorize('services:read'),
  serviceController.getAllCategories
);

// POST /api/v1/services/admin/categories - Create category
router.post(
  '/admin/categories',
  authenticate,
  authorize('services:create'),
  serviceController.createCategory
);

// PUT /api/v1/services/admin/categories/:id - Update category
router.put(
  '/admin/categories/:id',
  authenticate,
  authorize('services:update'),
  serviceController.updateCategory
);

// DELETE /api/v1/services/admin/categories/:id - Delete category
router.delete(
  '/admin/categories/:id',
  authenticate,
  authorize('services:delete'),
  serviceController.deleteCategory
);

// ============================================
// Admin Routes - Services
// مسارات المسؤول - الخدمات
// ============================================

// GET /api/v1/services/admin - Get all services (Admin)
router.get('/admin', authenticate, authorize('services:read'), serviceController.getAllServices);

// GET /api/v1/services/admin/:id - Get service by ID (Admin)
router.get(
  '/admin/:id',
  authenticate,
  authorize('services:read'),
  serviceController.getServiceById
);

// POST /api/v1/services/admin - Create service
router.post('/admin', authenticate, authorize('services:create'), serviceController.createService);

// PUT /api/v1/services/admin/reorder - Reorder services
router.put(
  '/admin/reorder',
  authenticate,
  authorize('services:update'),
  serviceController.reorderServices
);

// PUT /api/v1/services/admin/:id - Update service
router.put(
  '/admin/:id',
  authenticate,
  authorize('services:update'),
  serviceController.updateService
);

// DELETE /api/v1/services/admin/:id - Delete service
router.delete(
  '/admin/:id',
  authenticate,
  authorize('services:delete'),
  serviceController.deleteService
);

export default router;
