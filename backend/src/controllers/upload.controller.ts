/**
 * Upload Controller
 * متحكم رفع الملفات
 */

import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares';
import { sendCreated, uploadImageToCloudinary, deleteFromCloudinary, ApiError } from '../utils';

/**
 * Upload a single image
 * رفع صورة واحدة
 */
export const uploadImage = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      throw new ApiError(400, 'NO_FILE', 'No file provided | لم يتم توفير ملف');
    }

    // Get folder from query or default to 'images'
    const folder = (req.query.folder as string) || 'images';

    // Get optional resize parameters
    const width = req.query.width ? parseInt(req.query.width as string) : undefined;
    const height = req.query.height ? parseInt(req.query.height as string) : undefined;
    const crop = req.query.crop as 'fill' | 'fit' | 'scale' | 'thumb' | 'limit' | undefined;

    const result = await uploadImageToCloudinary(req.file, folder, {
      width,
      height,
      crop,
      quality: 'auto',
    });

    sendCreated(
      res,
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
      'Image uploaded successfully | تم رفع الصورة بنجاح'
    );
  }
);

/**
 * Upload multiple images
 * رفع صور متعددة
 */
export const uploadImages = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ApiError(400, 'NO_FILES', 'No files provided | لم يتم توفير ملفات');
    }

    // Get folder from query or default to 'images'
    const folder = (req.query.folder as string) || 'images';

    // Get optional resize parameters
    const width = req.query.width ? parseInt(req.query.width as string) : undefined;
    const height = req.query.height ? parseInt(req.query.height as string) : undefined;
    const crop = req.query.crop as 'fill' | 'fit' | 'scale' | 'thumb' | 'limit' | undefined;

    const uploadPromises = files.map(file =>
      uploadImageToCloudinary(file, folder, {
        width,
        height,
        crop,
        quality: 'auto',
      })
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }));

    sendCreated(
      res,
      { images },
      `${images.length} images uploaded successfully | تم رفع ${images.length} صور بنجاح`
    );
  }
);

/**
 * Delete an image
 * حذف صورة
 */
export const deleteImage = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { publicId } = req.params;

    if (!publicId) {
      throw new ApiError(400, 'NO_PUBLIC_ID', 'Public ID is required | معرف الصورة مطلوب');
    }

    // Decode the publicId (it may be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    await deleteFromCloudinary(decodedPublicId, 'image');

    sendCreated(res, null, 'Image deleted successfully | تم حذف الصورة بنجاح');
  }
);

export const uploadController = {
  uploadImage,
  uploadImages,
  deleteImage,
};

export default uploadController;
