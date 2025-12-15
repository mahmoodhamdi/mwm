/**
 * Newsletter Admin Service
 * خدمة إدارة النشرة البريدية
 */

import { apiClient, ApiResponse } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

// Subscriber Types
export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced' | 'pending';
export type SubscriberSource = 'website' | 'import' | 'manual' | 'api';

export interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  status: SubscriberStatus;
  source: SubscriberSource;
  tags: string[];
  locale: 'ar' | 'en';
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberFilters {
  page?: number;
  limit?: number;
  status?: SubscriberStatus;
  source?: SubscriberSource;
  tags?: string[];
  search?: string;
  sort?: string;
}

export interface SubscribersPagination {
  page: number;
  limit: number;
  pages: number;
}

export interface SubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  pagination: SubscribersPagination;
}

export interface SubscriberStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  pending: number;
  bySource: Record<string, number>;
  recentSubscribers: Subscriber[];
}

export interface CreateSubscriberData {
  email: string;
  name?: string;
  status?: SubscriberStatus;
  source?: SubscriberSource;
  tags?: string[];
  locale?: 'ar' | 'en';
}

export interface UpdateSubscriberData {
  name?: string;
  status?: SubscriberStatus;
  tags?: string[];
  locale?: 'ar' | 'en';
}

export type BulkAction = 'delete' | 'unsubscribe' | 'activate' | 'addTags' | 'removeTags';

export interface BulkActionData {
  ids: string[];
  action: BulkAction;
  tags?: string[];
}

export interface ImportResult {
  total: number;
  imported: number;
  duplicates: number;
  invalid: number;
  errors: string[];
}

// Campaign Types
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
export type RecipientType = 'all' | 'tags' | 'specific';

export interface CampaignMetrics {
  recipientCount: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
}

export interface Campaign {
  _id: string;
  subject: BilingualText;
  preheader?: BilingualText;
  content: BilingualText;
  status: CampaignStatus;
  recipientType: RecipientType;
  recipientTags?: string[];
  recipientIds?: string[];
  scheduledAt?: string;
  sentAt?: string;
  cancelledAt?: string;
  metrics: CampaignMetrics;
  createdBy: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilters {
  page?: number;
  limit?: number;
  status?: CampaignStatus;
  search?: string;
  sort?: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
  pagination: SubscribersPagination;
}

export interface CampaignStats {
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
  totalRecipients: number;
  totalOpens: number;
  totalClicks: number;
  averageOpenRate: number;
  averageClickRate: number;
  recentCampaigns: Campaign[];
}

export interface CreateCampaignData {
  subject: BilingualText;
  preheader?: BilingualText;
  content: BilingualText;
  recipientType?: RecipientType;
  recipientTags?: string[];
  recipientIds?: string[];
}

export interface UpdateCampaignData {
  subject?: BilingualText;
  preheader?: BilingualText;
  content?: BilingualText;
  recipientType?: RecipientType;
  recipientTags?: string[];
  recipientIds?: string[];
}

// API Endpoints
const NEWSLETTER_ENDPOINT = '/newsletter';

// ============ SUBSCRIBER FUNCTIONS ============

/**
 * Get all subscribers with filters
 */
export async function getSubscribers(
  filters: SubscriberFilters = {}
): Promise<ApiResponse<SubscribersResponse>> {
  const params: Record<string, unknown> = { ...filters };
  if (filters.tags) {
    params.tags = filters.tags.join(',');
  }
  return apiClient.get<SubscribersResponse>(`${NEWSLETTER_ENDPOINT}/subscribers`, params);
}

/**
 * Get subscriber statistics
 */
export async function getSubscriberStats(): Promise<ApiResponse<SubscriberStats>> {
  return apiClient.get<SubscriberStats>(`${NEWSLETTER_ENDPOINT}/subscribers/stats`);
}

/**
 * Get all subscriber tags
 */
export async function getSubscriberTags(): Promise<ApiResponse<{ tags: string[] }>> {
  return apiClient.get<{ tags: string[] }>(`${NEWSLETTER_ENDPOINT}/subscribers/tags`);
}

/**
 * Create subscriber
 */
export async function createSubscriber(
  data: CreateSubscriberData
): Promise<ApiResponse<{ subscriber: Subscriber }>> {
  return apiClient.post<{ subscriber: Subscriber }>(`${NEWSLETTER_ENDPOINT}/subscribers`, data);
}

/**
 * Update subscriber
 */
export async function updateSubscriber(
  id: string,
  data: UpdateSubscriberData
): Promise<ApiResponse<{ subscriber: Subscriber }>> {
  return apiClient.put<{ subscriber: Subscriber }>(
    `${NEWSLETTER_ENDPOINT}/subscribers/${id}`,
    data
  );
}

/**
 * Delete subscriber
 */
export async function deleteSubscriber(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`${NEWSLETTER_ENDPOINT}/subscribers/${id}`);
}

/**
 * Bulk subscriber action
 */
export async function bulkSubscriberAction(
  data: BulkActionData
): Promise<ApiResponse<{ message: string; count: number }>> {
  return apiClient.post<{ message: string; count: number }>(
    `${NEWSLETTER_ENDPOINT}/subscribers/bulk`,
    data
  );
}

/**
 * Import subscribers
 */
export async function importSubscribers(
  subscribers: Array<{ email: string; name?: string; tags?: string[] }>,
  options: { locale?: 'ar' | 'en'; tags?: string[] } = {}
): Promise<ApiResponse<ImportResult>> {
  return apiClient.post<ImportResult>(`${NEWSLETTER_ENDPOINT}/subscribers/import`, {
    subscribers,
    ...options,
  });
}

/**
 * Export subscribers
 */
export async function exportSubscribers(
  filters: { status?: SubscriberStatus; tags?: string[] } = {}
): Promise<
  ApiResponse<{
    subscribers: Array<{
      email: string;
      name: string;
      status: string;
      tags: string;
      subscribedAt: string;
    }>;
  }>
> {
  const params: Record<string, unknown> = {};
  if (filters.status) params.status = filters.status;
  if (filters.tags) params.tags = filters.tags.join(',');
  return apiClient.get(`${NEWSLETTER_ENDPOINT}/subscribers/export`, params);
}

// ============ CAMPAIGN FUNCTIONS ============

/**
 * Get all campaigns with filters
 */
export async function getCampaigns(
  filters: CampaignFilters = {}
): Promise<ApiResponse<CampaignsResponse>> {
  return apiClient.get<CampaignsResponse>(`${NEWSLETTER_ENDPOINT}/campaigns`, { ...filters });
}

/**
 * Get campaign statistics
 */
export async function getCampaignStats(): Promise<ApiResponse<CampaignStats>> {
  return apiClient.get<CampaignStats>(`${NEWSLETTER_ENDPOINT}/campaigns/stats`);
}

/**
 * Get campaign by ID
 */
export async function getCampaign(id: string): Promise<ApiResponse<{ campaign: Campaign }>> {
  return apiClient.get<{ campaign: Campaign }>(`${NEWSLETTER_ENDPOINT}/campaigns/${id}`);
}

/**
 * Create campaign
 */
export async function createCampaign(
  data: CreateCampaignData
): Promise<ApiResponse<{ campaign: Campaign }>> {
  return apiClient.post<{ campaign: Campaign }>(`${NEWSLETTER_ENDPOINT}/campaigns`, data);
}

/**
 * Update campaign
 */
export async function updateCampaign(
  id: string,
  data: UpdateCampaignData
): Promise<ApiResponse<{ campaign: Campaign }>> {
  return apiClient.put<{ campaign: Campaign }>(`${NEWSLETTER_ENDPOINT}/campaigns/${id}`, data);
}

/**
 * Delete campaign
 */
export async function deleteCampaign(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`${NEWSLETTER_ENDPOINT}/campaigns/${id}`);
}

/**
 * Send campaign immediately
 */
export async function sendCampaign(
  id: string
): Promise<ApiResponse<{ message: string; sentCount: number; errors: number }>> {
  return apiClient.post<{ message: string; sentCount: number; errors: number }>(
    `${NEWSLETTER_ENDPOINT}/campaigns/${id}/send`
  );
}

/**
 * Schedule campaign
 */
export async function scheduleCampaign(
  id: string,
  scheduledAt: string | Date
): Promise<ApiResponse<{ campaign: Campaign }>> {
  return apiClient.post<{ campaign: Campaign }>(`${NEWSLETTER_ENDPOINT}/campaigns/${id}/schedule`, {
    scheduledAt: typeof scheduledAt === 'string' ? scheduledAt : scheduledAt.toISOString(),
  });
}

/**
 * Cancel scheduled campaign
 */
export async function cancelCampaign(id: string): Promise<ApiResponse<{ campaign: Campaign }>> {
  return apiClient.post<{ campaign: Campaign }>(`${NEWSLETTER_ENDPOINT}/campaigns/${id}/cancel`);
}

/**
 * Duplicate campaign
 */
export async function duplicateCampaign(id: string): Promise<ApiResponse<{ campaign: Campaign }>> {
  return apiClient.post<{ campaign: Campaign }>(`${NEWSLETTER_ENDPOINT}/campaigns/${id}/duplicate`);
}

// Export service object
export const newsletterService = {
  // Subscribers
  getSubscribers,
  getSubscriberStats,
  getSubscriberTags,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  bulkSubscriberAction,
  importSubscribers,
  exportSubscribers,
  // Campaigns
  getCampaigns,
  getCampaignStats,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  scheduleCampaign,
  cancelCampaign,
  duplicateCampaign,
};

export default newsletterService;
