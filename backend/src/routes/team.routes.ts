/**
 * Team Routes
 * مسارات الفريق
 */

import { Router } from 'express';
import { teamController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// ============================================
// Public Routes - Departments
// المسارات العامة - الأقسام
// ============================================

// GET /api/v1/team/departments - Get all active departments
router.get('/departments', teamController.getDepartments);

// GET /api/v1/team/departments/:slug - Get department by slug
router.get('/departments/:slug', teamController.getDepartmentBySlug);

// ============================================
// Public Routes - Team Members
// المسارات العامة - أعضاء الفريق
// ============================================

// GET /api/v1/team/featured - Get featured team members
router.get('/featured', teamController.getFeaturedMembers);

// GET /api/v1/team/leaders - Get team leaders
router.get('/leaders', teamController.getLeaders);

// GET /api/v1/team/:slug - Get team member by slug
router.get('/:slug', teamController.getMemberBySlug);

// GET /api/v1/team - Get all active team members
router.get('/', teamController.getTeamMembers);

// ============================================
// Admin Routes - Departments
// مسارات المسؤول - الأقسام
// ============================================

// GET /api/v1/team/admin/departments - Get all departments (Admin)
router.get(
  '/admin/departments',
  authenticate,
  authorize('team:read'),
  teamController.getAllDepartments
);

// POST /api/v1/team/admin/departments - Create department
router.post(
  '/admin/departments',
  authenticate,
  authorize('team:create'),
  teamController.createDepartment
);

// PUT /api/v1/team/admin/departments/:id - Update department
router.put(
  '/admin/departments/:id',
  authenticate,
  authorize('team:update'),
  teamController.updateDepartment
);

// DELETE /api/v1/team/admin/departments/:id - Delete department
router.delete(
  '/admin/departments/:id',
  authenticate,
  authorize('team:delete'),
  teamController.deleteDepartment
);

// ============================================
// Admin Routes - Team Members
// مسارات المسؤول - أعضاء الفريق
// ============================================

// GET /api/v1/team/admin - Get all team members (Admin)
router.get('/admin', authenticate, authorize('team:read'), teamController.getAllMembers);

// GET /api/v1/team/admin/:id - Get team member by ID (Admin)
router.get('/admin/:id', authenticate, authorize('team:read'), teamController.getMemberById);

// POST /api/v1/team/admin - Create team member
router.post('/admin', authenticate, authorize('team:create'), teamController.createMember);

// PUT /api/v1/team/admin/reorder - Reorder team members
router.put('/admin/reorder', authenticate, authorize('team:update'), teamController.reorderMembers);

// PUT /api/v1/team/admin/:id/active - Toggle active status
router.put(
  '/admin/:id/active',
  authenticate,
  authorize('team:update'),
  teamController.toggleActiveStatus
);

// PUT /api/v1/team/admin/:id/featured - Toggle featured status
router.put(
  '/admin/:id/featured',
  authenticate,
  authorize('team:update'),
  teamController.toggleFeaturedStatus
);

// PUT /api/v1/team/admin/:id/leader - Toggle leader status
router.put(
  '/admin/:id/leader',
  authenticate,
  authorize('team:update'),
  teamController.toggleLeaderStatus
);

// PUT /api/v1/team/admin/:id - Update team member
router.put('/admin/:id', authenticate, authorize('team:update'), teamController.updateMember);

// DELETE /api/v1/team/admin/:id - Delete team member
router.delete('/admin/:id', authenticate, authorize('team:delete'), teamController.deleteMember);

export default router;
