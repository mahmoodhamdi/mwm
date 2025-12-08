'use client';

/**
 * Content Management Page
 * صفحة إدارة المحتوى
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { contentService, ContentItem as ApiContentItem, ContentType } from '@/services/admin';
import { ApiError } from '@/lib/api';
import {
  Save,
  Eye,
  RefreshCw,
  FileText,
  Globe,
  ChevronDown,
  ChevronRight,
  Edit3,
  Image as ImageIcon,
  Type,
  List,
  Settings as SettingsIcon,
  Search,
  AlertCircle,
} from 'lucide-react';

// Content item type
interface ContentItem {
  id: string;
  key: string;
  type: 'text' | 'html' | 'image' | 'array' | 'object';
  section: string;
  content: {
    ar: string;
    en: string;
  };
  isActive: boolean;
  updatedAt: Date;
}

// Mock content data
const mockContent: ContentItem[] = [
  {
    id: '1',
    key: 'home.hero.title',
    type: 'text',
    section: 'home',
    content: {
      ar: 'نحول أفكارك إلى واقع رقمي',
      en: 'We Turn Your Ideas Into Digital Reality',
    },
    isActive: true,
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    key: 'home.hero.subtitle',
    type: 'text',
    section: 'home',
    content: {
      ar: 'نقدم حلول برمجية متكاملة لتطوير أعمالك',
      en: 'We provide integrated software solutions to develop your business',
    },
    isActive: true,
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '3',
    key: 'home.hero.cta',
    type: 'text',
    section: 'home',
    content: {
      ar: 'ابدأ مشروعك الآن',
      en: 'Start Your Project Now',
    },
    isActive: true,
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    key: 'home.stats.projects',
    type: 'text',
    section: 'home',
    content: {
      ar: 'مشروع منجز',
      en: 'Projects Completed',
    },
    isActive: true,
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    key: 'about.mission.title',
    type: 'text',
    section: 'about',
    content: {
      ar: 'مهمتنا',
      en: 'Our Mission',
    },
    isActive: true,
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '6',
    key: 'about.mission.description',
    type: 'html',
    section: 'about',
    content: {
      ar: '<p>نسعى لتقديم أفضل الحلول البرمجية التي تساعد عملائنا على النمو والتطور.</p>',
      en: '<p>We strive to provide the best software solutions that help our clients grow and evolve.</p>',
    },
    isActive: true,
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '7',
    key: 'services.intro.title',
    type: 'text',
    section: 'services',
    content: {
      ar: 'خدماتنا',
      en: 'Our Services',
    },
    isActive: true,
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '8',
    key: 'contact.form.title',
    type: 'text',
    section: 'contact',
    content: {
      ar: 'تواصل معنا',
      en: 'Contact Us',
    },
    isActive: true,
    updatedAt: new Date('2024-02-01'),
  },
];

// Section configuration
const sections = [
  { id: 'home', labelAr: 'الصفحة الرئيسية', labelEn: 'Home', icon: FileText },
  { id: 'about', labelAr: 'من نحن', labelEn: 'About', icon: Globe },
  { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: SettingsIcon },
  { id: 'contact', labelAr: 'التواصل', labelEn: 'Contact', icon: FileText },
];

// Type icons
const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  html: Edit3,
  image: ImageIcon,
  array: List,
  object: SettingsIcon,
};

export default function ContentPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['home']));
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Group content by section
  const groupedContent = content.reduce(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, ContentItem[]>
  );

  // Filter content by search
  const filteredSections = sections.filter(section => {
    const sectionContent = groupedContent[section.id] || [];
    if (!searchQuery) return true;
    return sectionContent.some(
      item =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.en.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Update content item
  const updateContent = (id: string, field: 'ar' | 'en', value: string) => {
    setContent(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              content: { ...item.content, [field]: value },
              updatedAt: new Date(),
            }
          : item
      )
    );
    setHasChanges(true);
  };

  // Fetch content from API
  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await contentService.getAllContent({ limit: 100 });
      if (response.data) {
        const apiContent = response.data.map((item: ApiContentItem) => ({
          id: item._id,
          key: item.key,
          type: item.type as ContentItem['type'],
          section: item.section,
          content: item.content,
          isActive: item.isActive,
          updatedAt: new Date(item.updatedAt),
        }));
        setContent(apiContent);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load content');
      console.error('Error fetching content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch content on mount
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Save all changes
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Bulk upsert all content items
      const contentsToSave = content.map(item => ({
        key: item.key,
        data: {
          key: item.key,
          type: item.type as ContentType,
          section: item.section,
          content: item.content,
          isActive: item.isActive,
        },
      }));

      await contentService.bulkUpsertContent(contentsToSave);
      setHasChanges(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  // Refresh content from server
  const refreshContent = async () => {
    await fetchContent();
    setHasChanges(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto size-8 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isArabic ? 'إدارة المحتوى' : 'Content Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? 'تحرير وإدارة محتوى الموقع بجميع اللغات'
              : 'Edit and manage website content in all languages'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshContent}
            disabled={isLoading}
            className="hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isArabic ? 'تحديث' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
              previewMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <Eye className="size-4" />
            <span>{isArabic ? 'معاينة' : 'Preview'}</span>
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasChanges || isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>{isArabic ? 'حفظ التغييرات' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="size-5" />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder={isArabic ? 'البحث في المحتوى...' : 'Search content...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-background focus:ring-primary w-full rounded-lg border py-2 pe-4 ps-10 focus:outline-none focus:ring-2"
        />
      </div>

      {/* Changes indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
          <div className="size-2 animate-pulse rounded-full bg-yellow-500" />
          <span className="text-sm text-yellow-600 dark:text-yellow-400">
            {isArabic ? 'لديك تغييرات غير محفوظة' : 'You have unsaved changes'}
          </span>
        </div>
      )}

      {/* Content Editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sections Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card space-y-2 rounded-lg border p-4">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">
              {isArabic ? 'الأقسام' : 'Sections'}
            </h3>
            {filteredSections.map(section => {
              const Icon = section.icon;
              const sectionContent = groupedContent[section.id] || [];
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSection(section.id);
                    if (!expandedSections.has(section.id)) {
                      toggleSection(section.id);
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-sm transition-colors ${
                    selectedSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{isArabic ? section.labelAr : section.labelEn}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs ${
                      selectedSection === section.id ? 'bg-primary-foreground/20' : 'bg-muted'
                    }`}
                  >
                    {sectionContent.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Items */}
        <div className="space-y-4 lg:col-span-3">
          {filteredSections.map(section => {
            const sectionContent = groupedContent[section.id] || [];
            const isExpanded = expandedSections.has(section.id);

            if (sectionContent.length === 0) return null;

            // Filter by search within section
            const filteredContent = searchQuery
              ? sectionContent.filter(
                  item =>
                    item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.content.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.content.en.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : sectionContent;

            if (filteredContent.length === 0) return null;

            return (
              <div key={section.id} className="bg-card overflow-hidden rounded-lg border">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="hover:bg-muted/50 flex w-full items-center justify-between p-4 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                    <span className="font-medium">
                      {isArabic ? section.labelAr : section.labelEn}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({filteredContent.length}{' '}
                      {isArabic ? 'عنصر' : filteredContent.length === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="divide-y border-t">
                    {filteredContent.map(item => {
                      const TypeIcon = typeIcons[item.type] || Type;
                      const isEditing = editingItem === item.id;

                      return (
                        <div key={item.id} className="space-y-3 p-4">
                          {/* Item Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="text-muted-foreground size-4" />
                              <code className="bg-muted rounded px-2 py-0.5 text-sm">
                                {item.key}
                              </code>
                              <span className="text-muted-foreground text-xs">({item.type})</span>
                            </div>
                            <button
                              onClick={() => setEditingItem(isEditing ? null : item.id)}
                              className={`rounded p-1.5 transition-colors ${
                                isEditing ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                              }`}
                            >
                              <Edit3 className="size-4" />
                            </button>
                          </div>

                          {/* Content Fields */}
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Arabic */}
                            <div className="space-y-1.5">
                              <label className="flex items-center gap-1.5 text-sm font-medium">
                                <span className="bg-muted flex size-5 items-center justify-center rounded text-xs">
                                  ع
                                </span>
                                {isArabic ? 'العربية' : 'Arabic'}
                              </label>
                              {item.type === 'html' || isEditing ? (
                                <textarea
                                  value={item.content.ar}
                                  onChange={e => updateContent(item.id, 'ar', e.target.value)}
                                  dir="rtl"
                                  rows={item.type === 'html' ? 4 : 2}
                                  className="bg-background focus:ring-primary w-full resize-none rounded-lg border p-2 text-sm focus:outline-none focus:ring-2"
                                />
                              ) : (
                                <div
                                  dir="rtl"
                                  className="bg-muted/50 min-h-10 rounded-lg p-2 text-sm"
                                >
                                  {item.content.ar}
                                </div>
                              )}
                            </div>

                            {/* English */}
                            <div className="space-y-1.5">
                              <label className="flex items-center gap-1.5 text-sm font-medium">
                                <span className="bg-muted flex size-5 items-center justify-center rounded text-xs">
                                  En
                                </span>
                                {isArabic ? 'الإنجليزية' : 'English'}
                              </label>
                              {item.type === 'html' || isEditing ? (
                                <textarea
                                  value={item.content.en}
                                  onChange={e => updateContent(item.id, 'en', e.target.value)}
                                  dir="ltr"
                                  rows={item.type === 'html' ? 4 : 2}
                                  className="bg-background focus:ring-primary w-full resize-none rounded-lg border p-2 text-sm focus:outline-none focus:ring-2"
                                />
                              ) : (
                                <div
                                  dir="ltr"
                                  className="bg-muted/50 min-h-10 rounded-lg p-2 text-sm"
                                >
                                  {item.content.en}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Last Updated */}
                          <div className="text-muted-foreground text-xs">
                            {isArabic ? 'آخر تحديث:' : 'Last updated:'}{' '}
                            {item.updatedAt.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">{isArabic ? 'معاينة المحتوى' : 'Content Preview'}</h3>
              <button
                onClick={() => setPreviewMode(false)}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[calc(90vh-4rem)] overflow-auto p-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Arabic Preview */}
                <div className="space-y-4">
                  <h4 className="text-center font-medium">العربية</h4>
                  <div dir="rtl" className="bg-muted/50 space-y-2 rounded-lg p-4">
                    {content.map(item => (
                      <div key={item.id}>
                        <span className="text-muted-foreground text-xs">{item.key}:</span>
                        <div dangerouslySetInnerHTML={{ __html: item.content.ar }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* English Preview */}
                <div className="space-y-4">
                  <h4 className="text-center font-medium">English</h4>
                  <div dir="ltr" className="bg-muted/50 space-y-2 rounded-lg p-4">
                    {content.map(item => (
                      <div key={item.id}>
                        <span className="text-muted-foreground text-xs">{item.key}:</span>
                        <div dangerouslySetInnerHTML={{ __html: item.content.en }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
