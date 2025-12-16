/**
 * Admin Services Index
 * فهرس خدمات الإدارة
 */

// Settings service
export type {
  BilingualText,
  Settings,
  GeneralSettings,
  ContactSettings,
  SocialSettings,
  SEOSettings,
  FeatureSettings,
  ThemeSettings,
} from './settings.service';

export { getSettings, updateSettings, updateSettingsSection } from './settings.service';

export { settingsService } from './settings.service';

// Content service
export type {
  ContentItem,
  ContentType,
  ContentFilters,
  CreateContentData,
  UpdateContentData,
} from './content.service';

export {
  getAllContent,
  getContentByKey,
  createContent,
  updateContent,
  deleteContent,
  bulkUpsertContent,
} from './content.service';

export { contentService } from './content.service';

// Translations service
export type {
  TranslationItem,
  TranslationFilters,
  CreateTranslationData,
  UpdateTranslationData,
} from './translations.service';

export {
  getAllTranslations,
  getTranslation,
  getByNamespace,
  getAllByLocale,
  getNamespaces,
  searchTranslations,
  createTranslation,
  updateTranslation,
  upsertTranslation,
  bulkUpsertTranslations,
  deleteTranslation,
} from './translations.service';

export { translationsService } from './translations.service';

// Menus service
export type {
  MenuItem,
  Menu,
  MenuLocation,
  MenuItemType,
  MenuItemTarget,
  MenuFilters,
  CreateMenuData,
  UpdateMenuData,
  CreateMenuItemData,
} from './menus.service';

export {
  getMenuByLocation,
  getMenuBySlug,
  getAllMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
  reorderMenuItems,
} from './menus.service';

export { menusService } from './menus.service';

// Blog service
export type {
  BilingualText as BlogBilingualText,
  BlogSEO,
  BlogCategory,
  CategoryFilters,
  CategoriesResponse,
  CreateCategoryData,
  UpdateCategoryData,
  BlogAuthor,
  BlogPost,
  PostStatus,
  PostFilters,
  PostsPagination,
  PostsResponse,
  CreatePostData,
  UpdatePostData,
  BulkUpdateData,
} from './blog.service';

export {
  getCategories as getBlogCategories,
  getCategoryById as getBlogCategoryById,
  createCategory as createBlogCategory,
  updateCategory as updateBlogCategory,
  deleteCategory as deleteBlogCategory,
  getPosts as getBlogPosts,
  getPostById as getBlogPostById,
  createPost as createBlogPost,
  updatePost as updateBlogPost,
  deletePost as deleteBlogPost,
  bulkUpdatePostsStatus,
  getPostStats,
} from './blog.service';

export { blogAdminService } from './blog.service';

// Newsletter service
export type {
  BilingualText as NewsletterBilingualText,
  Subscriber,
  SubscriberStatus,
  SubscriberSource,
  SubscriberFilters,
  SubscriberStats,
  CreateSubscriberData,
  UpdateSubscriberData,
  BulkAction,
  BulkActionData,
  ImportResult,
  Campaign,
  CampaignStatus,
  RecipientType,
  CampaignMetrics,
  CampaignFilters,
  CampaignStats,
  CreateCampaignData,
  UpdateCampaignData,
} from './newsletter.service';

export {
  getSubscribers,
  getSubscriberStats,
  getSubscriberTags,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  bulkSubscriberAction,
  importSubscribers,
  exportSubscribers,
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
} from './newsletter.service';

export { newsletterService } from './newsletter.service';

// Careers service
export type {
  BilingualText as CareersBilingualText,
  Department,
  JobType,
  ExperienceLevel,
  JobStatus,
  SalaryRange,
  Job,
  JobFilters,
  JobsPagination,
  JobsResponse,
  CreateJobData,
  UpdateJobData,
  BulkJobUpdateData,
  ApplicationStatus,
  JobApplication,
  ApplicationFilters,
  ApplicationsResponse,
  UpdateApplicationData,
  BulkApplicationUpdateData,
  ApplicationStats,
} from './careers.service';

export {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  bulkUpdateJobsStatus,
  getApplications,
  getApplicationById,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
  bulkUpdateApplicationsStatus,
  getApplicationStats,
} from './careers.service';

export { careersAdminService } from './careers.service';

// Dashboard service
export type {
  DashboardStats,
  RecentContact,
  RecentPost,
  RecentApplication,
  RecentSubscriber,
  ActivityLogEntry as DashboardActivityLog,
  RecentActivityResponse,
  TimeSeriesData,
  ChartsDataResponse,
  QuickStatsResponse,
} from './dashboard.service';

export { getStats, getRecentActivity, getChartsData, getQuickStats } from './dashboard.service';

export { dashboardService } from './dashboard.service';

// Activity service
export type {
  ActivityLogEntry,
  ActivityLogsResponse,
  ActivityStatistics,
  GetLogsParams,
} from './activity.service';

export {
  getLogs,
  getLogsByUser,
  getLogsByResource,
  getRecentLogs,
  getStatistics as getActivityStatistics,
  getMyActivity,
  deleteOldLogs,
} from './activity.service';

export { activityService } from './activity.service';

// Notifications service
export type {
  Notification,
  NotificationsResponse,
  DeviceToken,
  SendNotificationInput,
  BroadcastNotificationInput,
} from './notifications.service';

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  registerDeviceToken,
  removeDeviceToken,
  getDeviceTokens,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendNotification,
  broadcastNotification,
} from './notifications.service';

export { notificationsService } from './notifications.service';

// Users service
export type {
  User,
  UserRole,
  UserStatus,
  UsersFilters,
  UsersResponse,
  UserStats,
  CreateUserData,
  UpdateUserData,
  BulkActionData as UserBulkActionData,
} from './users.service';

export {
  getAllUsers,
  getUserById,
  getUserStats,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus,
  unlockUser,
  bulkAction as userBulkAction,
} from './users.service';

export { usersAdminService } from './users.service';

// Upload service
export type { UploadedImage, UploadOptions } from './upload.service';

export { uploadImage, uploadImages, deleteImage } from './upload.service';

export { uploadService } from './upload.service';
