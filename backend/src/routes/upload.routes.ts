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

/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: File upload management
 */

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
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload a single image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Cloudinary folder (default 'images')
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *         description: Max width
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: Max height
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [fill, fit, scale, thumb, limit]
 *         description: Crop mode
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No image provided
 *       429:
 *         description: Too many requests
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
 * @swagger
 * /upload/images:
 *   post:
 *     summary: Upload multiple images (max 10)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Cloudinary folder
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [fill, fit, scale, thumb, limit]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: No images provided
 *       429:
 *         description: Too many requests
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
 * @swagger
 * /upload/image/{publicId}:
 *   delete:
 *     summary: Delete an image by public ID
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary public ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
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
