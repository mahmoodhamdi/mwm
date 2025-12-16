/**
 * File Upload Utility
 * أداة رفع الملفات
 */

import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request } from 'express';
import { env } from '../config';
import { ApiError } from './ApiError';

// Configure Cloudinary
if (env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

// Allowed file types for resumes
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Allowed file types for images
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Max file sizes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for resumes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images

/**
 * Multer storage configuration for memory storage
 * We use memory storage and then upload to Cloudinary
 */
const memoryStorage = multer.memoryStorage();

/**
 * File filter for resumes
 */
const resumeFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

  if (
    ALLOWED_RESUME_TYPES.includes(file.mimetype) &&
    ALLOWED_RESUME_EXTENSIONS.includes(extension)
  ) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        'INVALID_FILE_TYPE',
        'Only PDF and Word documents are allowed | يُسمح فقط بملفات PDF و Word'
      )
    );
  }
};

/**
 * Multer upload configuration for resumes
 */
export const resumeUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: resumeFileFilter,
});

/**
 * File filter for images
 */
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype) && ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        'INVALID_FILE_TYPE',
        'Only image files (JPG, PNG, GIF, WebP, SVG) are allowed | يُسمح فقط بملفات الصور'
      )
    );
  }
};

/**
 * Multer upload configuration for images
 */
export const imageUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: imageFileFilter,
});

/**
 * Upload file to Cloudinary
 * رفع الملف إلى Cloudinary
 */
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'resumes'
): Promise<UploadApiResponse> => {
  // Check if Cloudinary is configured
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new ApiError(500, 'CLOUDINARY_NOT_CONFIGURED', 'File upload service is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `mwm/${folder}`,
        resource_type: 'auto',
        allowed_formats: ['pdf', 'doc', 'docx'],
        transformation: [
          { flags: 'attachment' }, // Force download when accessed
        ],
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, 'UPLOAD_FAILED', 'Failed to upload file | فشل في رفع الملف'));
        } else if (result) {
          resolve(result);
        } else {
          reject(new ApiError(500, 'UPLOAD_FAILED', 'Failed to upload file | فشل في رفع الملف'));
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

/**
 * Upload image to Cloudinary with optimizations
 * رفع الصورة إلى Cloudinary مع التحسينات
 */
export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'images',
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit';
    quality?: number | 'auto';
  }
): Promise<UploadApiResponse> => {
  // Check if Cloudinary is configured
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new ApiError(500, 'CLOUDINARY_NOT_CONFIGURED', 'File upload service is not configured');
  }

  const transformations: Record<string, unknown>[] = [];

  // Add resize transformation if specified
  if (options?.width || options?.height) {
    transformations.push({
      width: options.width,
      height: options.height,
      crop: options.crop || 'limit',
    });
  }

  // Add quality optimization
  transformations.push({
    quality: options?.quality || 'auto',
    fetch_format: 'auto',
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `mwm/${folder}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: transformations.length > 0 ? transformations : undefined,
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, 'UPLOAD_FAILED', 'Failed to upload image | فشل في رفع الصورة'));
        } else if (result) {
          resolve(result);
        } else {
          reject(new ApiError(500, 'UPLOAD_FAILED', 'Failed to upload image | فشل في رفع الصورة'));
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

/**
 * Delete file from Cloudinary
 * حذف الملف من Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'raw' | 'video' = 'raw'
): Promise<void> => {
  // Check if Cloudinary is configured
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new ApiError(500, 'CLOUDINARY_NOT_CONFIGURED', 'File upload service is not configured');
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export const uploadUtils = {
  resumeUpload,
  imageUpload,
  uploadToCloudinary,
  uploadImageToCloudinary,
  deleteFromCloudinary,
  ALLOWED_RESUME_TYPES,
  ALLOWED_RESUME_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
};

export default uploadUtils;
