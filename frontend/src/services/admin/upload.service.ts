/**
 * Upload API Service
 * خدمة رفع الملفات
 */

import { apiClient } from '@/lib/api';

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit';
}

// API endpoints
const UPLOAD_ENDPOINT = '/upload';

/**
 * Upload a single image
 * رفع صورة واحدة
 */
export async function uploadImage(file: File, options: UploadOptions = {}): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('image', file);

  // Build query string
  const params = new URLSearchParams();
  if (options.folder) params.append('folder', options.folder);
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.crop) params.append('crop', options.crop);

  const queryString = params.toString();
  const url = `${UPLOAD_ENDPOINT}/image${queryString ? `?${queryString}` : ''}`;

  // Use fetch directly for FormData (apiClient doesn't handle FormData well)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      // Get CSRF token from cookie
      'x-csrf-token':
        document.cookie
          .split('; ')
          .find(row => row.startsWith('csrf_token='))
          ?.split('=')[1] || '',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Failed to upload image');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Upload multiple images
 * رفع صور متعددة
 */
export async function uploadImages(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadedImage[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  // Build query string
  const params = new URLSearchParams();
  if (options.folder) params.append('folder', options.folder);
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.crop) params.append('crop', options.crop);

  const queryString = params.toString();
  const url = `${UPLOAD_ENDPOINT}/images${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'x-csrf-token':
        document.cookie
          .split('; ')
          .find(row => row.startsWith('csrf_token='))
          ?.split('=')[1] || '',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Failed to upload images');
  }

  const data = await response.json();
  return data.data.images;
}

/**
 * Delete an image by public ID
 * حذف صورة بمعرفها
 */
export async function deleteImage(publicId: string): Promise<void> {
  const encodedId = encodeURIComponent(publicId);
  await apiClient.delete(`${UPLOAD_ENDPOINT}/image/${encodedId}`);
}

export const uploadService = {
  uploadImage,
  uploadImages,
  deleteImage,
};

export default uploadService;
