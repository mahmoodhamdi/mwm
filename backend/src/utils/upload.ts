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

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
 * Delete file from Cloudinary
 * حذف الملف من Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Check if Cloudinary is configured
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new ApiError(500, 'CLOUDINARY_NOT_CONFIGURED', 'File upload service is not configured');
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};

export const uploadUtils = {
  resumeUpload,
  uploadToCloudinary,
  deleteFromCloudinary,
  ALLOWED_RESUME_TYPES,
  ALLOWED_RESUME_EXTENSIONS,
  MAX_FILE_SIZE,
};

export default uploadUtils;
