/**
 * Upload Routes
 * مسارات رفع الملفات
 */

import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authenticate, authorize, csrfValidation } from '../middlewares';
import { imageUpload } from '../utils';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for uploads (20 per hour)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_UPLOADS',
      message:
        'Too many upload requests, please try again later | طلبات رفع كثيرة جداً، يرجى المحاولة لاحقاً',
    },
  },
});

// All upload routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/upload/image
 * @desc    Upload a single image
 * @access  Private (authenticated users with upload permission)
 * @query   folder - Cloudinary folder (default: 'images')
 * @query   width - Optional max width
 * @query   height - Optional max height
 * @query   crop - Optional crop mode (fill, fit, scale, thumb, limit)
 */
router.post(
  '/image',
  uploadLimiter,
  csrfValidation,
  authorize([
    'services:update',
    'projects:update',
    'team:update',
    'blog:update',
    'settings:update',
  ]),
  imageUpload.single('image'),
  uploadController.uploadImage
);

/**
 * @route   POST /api/v1/upload/images
 * @desc    Upload multiple images (max 10)
 * @access  Private (authenticated users with upload permission)
 * @query   folder - Cloudinary folder (default: 'images')
 * @query   width - Optional max width
 * @query   height - Optional max height
 * @query   crop - Optional crop mode
 */
router.post(
  '/images',
  uploadLimiter,
  csrfValidation,
  authorize([
    'services:update',
    'projects:update',
    'team:update',
    'blog:update',
    'settings:update',
  ]),
  imageUpload.array('images', 10),
  uploadController.uploadImages
);

/**
 * @route   DELETE /api/v1/upload/image/:publicId
 * @desc    Delete an image by public ID
 * @access  Private (authenticated users with upload permission)
 */
router.delete(
  '/image/:publicId',
  csrfValidation,
  authorize([
    'services:update',
    'projects:update',
    'team:update',
    'blog:update',
    'settings:update',
  ]),
  uploadController.deleteImage
);

export default router;
