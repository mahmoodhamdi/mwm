/**
 * Contact API Service
 * خدمة واجهة برمجة التواصل
 */

import { apiClient } from '@/lib/api';

// Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  subject: string;
  message: string;
  service?: string;
  budget?: 'under_5k' | '5k_10k' | '10k_25k' | '25k_50k' | '50k_100k' | 'over_100k' | 'not_sure';
  preferredContact?: 'email' | 'phone' | 'whatsapp';
  recaptchaToken?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  ticketNumber?: string;
}

export interface NewsletterData {
  email: string;
  name?: string;
  locale?: 'ar' | 'en';
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

// API endpoints
const CONTACT_ENDPOINT = '/contact';
const NEWSLETTER_ENDPOINT = '/newsletter';

/**
 * Submit contact form
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  const response = await apiClient.post<ContactResponse>(CONTACT_ENDPOINT, data);
  return {
    success: response.success,
    message: response.message || 'Message sent successfully',
    ticketNumber: response.data?.ticketNumber,
  };
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(data: NewsletterData): Promise<NewsletterResponse> {
  const response = await apiClient.post<NewsletterResponse>(
    `${NEWSLETTER_ENDPOINT}/subscribe`,
    data
  );
  return {
    success: response.success,
    message: response.message || 'Subscribed successfully',
  };
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeNewsletter(
  email: string,
  token: string
): Promise<NewsletterResponse> {
  const response = await apiClient.post<NewsletterResponse>(`${NEWSLETTER_ENDPOINT}/unsubscribe`, {
    email,
    token,
  });
  return {
    success: response.success,
    message: response.message || 'Unsubscribed successfully',
  };
}

export const contactService = {
  submitContactForm,
  subscribeNewsletter,
  unsubscribeNewsletter,
};

export default contactService;
