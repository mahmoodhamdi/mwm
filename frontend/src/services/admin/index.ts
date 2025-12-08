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
