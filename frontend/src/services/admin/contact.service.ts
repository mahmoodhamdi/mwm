/**
 * Contact/Messages Admin Service
 * خدمة إدارة الرسائل
 */

import { api, extractData } from '@/lib/api';

// Types
export type ContactStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam';
export type ContactPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  subject: string;
  message: string;
  service?: string;
  budget?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
  status: ContactStatus;
  priority: ContactPriority;
  isStarred: boolean;
  labels: string[];
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  replies?: Array<{
    message: string;
    sentAt: string;
    sentBy: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
  notes?: string;
  attachments?: string[];
  ip?: string;
  userAgent?: string;
  readAt?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: ContactStatus;
  priority?: ContactPriority;
  isStarred?: boolean;
  search?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
}

export interface ContactsResponse {
  messages: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ContactStats {
  total: number;
  byStatus: Record<ContactStatus, number>;
  byPriority: Record<ContactPriority, number>;
  unread: number;
  starred: number;
  todayCount: number;
  weekCount: number;
}

export interface ReplyData {
  message: string;
  sendEmail?: boolean;
}

export interface BulkActionData {
  ids: string[];
  action: 'archive' | 'spam' | 'delete' | 'read' | 'unread' | 'star' | 'unstar';
}

// Admin Service Functions

/**
 * Get all messages (admin)
 */
export async function getAllMessages(filters: ContactFilters = {}): Promise<ContactsResponse> {
  const response = await api.get('/contact/messages', { params: filters });
  return extractData<ContactsResponse>(response);
}

/**
 * Get message by ID
 */
export async function getMessageById(id: string): Promise<ContactMessage> {
  const response = await api.get(`/contact/messages/${id}`);
  return extractData<{ message: ContactMessage }>(response).message;
}

/**
 * Update message
 */
export async function updateMessage(
  id: string,
  data: { status?: ContactStatus; priority?: ContactPriority; notes?: string }
): Promise<ContactMessage> {
  const response = await api.put(`/contact/messages/${id}`, data);
  return extractData<{ message: ContactMessage }>(response).message;
}

/**
 * Mark message as spam
 */
export async function markAsSpam(id: string): Promise<ContactMessage> {
  const response = await api.put(`/contact/messages/${id}/spam`);
  return extractData<{ message: ContactMessage }>(response).message;
}

/**
 * Archive message
 */
export async function archiveMessage(id: string): Promise<ContactMessage> {
  const response = await api.put(`/contact/messages/${id}/archive`);
  return extractData<{ message: ContactMessage }>(response).message;
}

/**
 * Reply to message
 */
export async function replyToMessage(id: string, data: ReplyData): Promise<ContactMessage> {
  const response = await api.post(`/contact/messages/${id}/reply`, data);
  return extractData<{ message: ContactMessage }>(response).message;
}

/**
 * Toggle star status
 */
export async function toggleStar(id: string): Promise<ContactMessage> {
  const response = await api.put(`/contact/messages/${id}/star`);
  return extractData<{ message: ContactMessage }>(response).message;
}

/**
 * Delete message
 */
export async function deleteMessage(id: string): Promise<void> {
  await api.delete(`/contact/messages/${id}`);
}

/**
 * Bulk action on messages
 */
export async function bulkAction(data: BulkActionData): Promise<{ affected: number }> {
  const response = await api.post('/contact/messages/bulk', data);
  return extractData<{ affected: number }>(response);
}

/**
 * Get contact stats
 */
export async function getStats(): Promise<ContactStats> {
  const response = await api.get('/contact/messages/statistics');
  return extractData<ContactStats>(response);
}

/**
 * Get unread count
 */
export async function getUnreadCount(): Promise<{ count: number }> {
  const response = await api.get('/contact/messages/unread-count');
  return extractData<{ count: number }>(response);
}

// Service object
export const contactAdminService = {
  getAllMessages,
  getMessageById,
  updateMessage,
  markAsSpam,
  archiveMessage,
  replyToMessage,
  toggleStar,
  deleteMessage,
  bulkAction,
  getStats,
  getUnreadCount,
};

export default contactAdminService;
