'use client';

/**
 * Translation Editor Page
 * صفحة تحرير الترجمات
 */

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Save,
  Search,
  Download,
  Plus,
  Trash2,
  Globe,
  Languages,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';

// Translation item type
interface TranslationItem {
  id: string;
  key: string;
  namespace: string;
  translations: {
    ar: string;
    en: string;
  };
  isSystem: boolean;
  description?: string;
}

// Mock translation data
const mockTranslations: TranslationItem[] = [
  // Navigation namespace
  {
    id: '1',
    key: 'navigation.home',
    namespace: 'common',
    translations: { ar: 'الرئيسية', en: 'Home' },
    isSystem: true,
  },
  {
    id: '2',
    key: 'navigation.about',
    namespace: 'common',
    translations: { ar: 'من نحن', en: 'About' },
    isSystem: true,
  },
  {
    id: '3',
    key: 'navigation.services',
    namespace: 'common',
    translations: { ar: 'خدماتنا', en: 'Services' },
    isSystem: true,
  },
  {
    id: '4',
    key: 'navigation.portfolio',
    namespace: 'common',
    translations: { ar: 'أعمالنا', en: 'Portfolio' },
    isSystem: true,
  },
  {
    id: '5',
    key: 'navigation.team',
    namespace: 'common',
    translations: { ar: 'فريقنا', en: 'Team' },
    isSystem: true,
  },
  {
    id: '6',
    key: 'navigation.contact',
    namespace: 'common',
    translations: { ar: 'تواصل معنا', en: 'Contact' },
    isSystem: true,
  },
  // Buttons namespace
  {
    id: '7',
    key: 'buttons.submit',
    namespace: 'common',
    translations: { ar: 'إرسال', en: 'Submit' },
    isSystem: true,
  },
  {
    id: '8',
    key: 'buttons.cancel',
    namespace: 'common',
    translations: { ar: 'إلغاء', en: 'Cancel' },
    isSystem: true,
  },
  {
    id: '9',
    key: 'buttons.save',
    namespace: 'common',
    translations: { ar: 'حفظ', en: 'Save' },
    isSystem: true,
  },
  {
    id: '10',
    key: 'buttons.delete',
    namespace: 'common',
    translations: { ar: 'حذف', en: 'Delete' },
    isSystem: true,
  },
  // Forms namespace
  {
    id: '11',
    key: 'forms.name',
    namespace: 'common',
    translations: { ar: 'الاسم', en: 'Name' },
    isSystem: true,
  },
  {
    id: '12',
    key: 'forms.email',
    namespace: 'common',
    translations: { ar: 'البريد الإلكتروني', en: 'Email' },
    isSystem: true,
  },
  {
    id: '13',
    key: 'forms.message',
    namespace: 'common',
    translations: { ar: 'الرسالة', en: 'Message' },
    isSystem: true,
  },
  {
    id: '14',
    key: 'forms.required',
    namespace: 'common',
    translations: { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
    isSystem: true,
  },
  // Home namespace
  {
    id: '15',
    key: 'hero.title',
    namespace: 'home',
    translations: {
      ar: 'نحول أفكارك إلى واقع رقمي',
      en: 'We Turn Your Ideas Into Digital Reality',
    },
    isSystem: false,
  },
  {
    id: '16',
    key: 'hero.cta',
    namespace: 'home',
    translations: { ar: 'ابدأ مشروعك', en: 'Start Your Project' },
    isSystem: false,
  },
  // Contact namespace
  {
    id: '17',
    key: 'form.title',
    namespace: 'contact',
    translations: { ar: 'راسلنا', en: 'Send us a message' },
    isSystem: false,
  },
  {
    id: '18',
    key: 'form.success',
    namespace: 'contact',
    translations: { ar: 'تم إرسال رسالتك بنجاح', en: 'Your message has been sent successfully' },
    isSystem: false,
  },
];

// Namespace configuration
const namespaces = [
  { id: 'common', labelAr: 'عام', labelEn: 'Common', color: 'bg-blue-500' },
  { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', color: 'bg-green-500' },
  { id: 'about', labelAr: 'من نحن', labelEn: 'About', color: 'bg-purple-500' },
  { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', color: 'bg-yellow-500' },
  { id: 'contact', labelAr: 'التواصل', labelEn: 'Contact', color: 'bg-red-500' },
];

export default function TranslationsPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [translations, setTranslations] = useState<TranslationItem[]>(mockTranslations);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);
  const [expandedNamespaces, setExpandedNamespaces] = useState<Set<string>>(new Set(['common']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New translation form state
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    namespace: 'common',
    ar: '',
    en: '',
    description: '',
  });

  // Toggle namespace expansion
  const toggleNamespace = (namespaceId: string) => {
    const newExpanded = new Set(expandedNamespaces);
    if (newExpanded.has(namespaceId)) {
      newExpanded.delete(namespaceId);
    } else {
      newExpanded.add(namespaceId);
    }
    setExpandedNamespaces(newExpanded);
  };

  // Group translations by namespace
  const groupedTranslations = translations.reduce(
    (acc, item) => {
      if (!acc[item.namespace]) {
        acc[item.namespace] = [];
      }
      acc[item.namespace].push(item);
      return acc;
    },
    {} as Record<string, TranslationItem[]>
  );

  // Filter translations
  const filteredNamespaces = namespaces.filter(ns => {
    const nsTranslations = groupedTranslations[ns.id] || [];
    if (selectedNamespace && ns.id !== selectedNamespace) return false;
    if (!searchQuery) return true;
    return nsTranslations.some(
      item =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translations.ar.includes(searchQuery) ||
        item.translations.en.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Update translation
  const updateTranslation = (id: string, field: 'ar' | 'en', value: string) => {
    setTranslations(prev =>
      prev.map(item =>
        item.id === id ? { ...item, translations: { ...item.translations, [field]: value } } : item
      )
    );
    setHasChanges(true);
  };

  // Add new translation
  const addTranslation = () => {
    if (!newTranslation.key || !newTranslation.ar || !newTranslation.en) return;

    const newItem: TranslationItem = {
      id: Date.now().toString(),
      key: newTranslation.key,
      namespace: newTranslation.namespace,
      translations: {
        ar: newTranslation.ar,
        en: newTranslation.en,
      },
      isSystem: false,
      description: newTranslation.description,
    };

    setTranslations(prev => [...prev, newItem]);
    setNewTranslation({ key: '', namespace: 'common', ar: '', en: '', description: '' });
    setShowAddModal(false);
    setHasChanges(true);
  };

  // Delete translation
  const deleteTranslation = (id: string) => {
    const item = translations.find(t => t.id === id);
    if (item?.isSystem) return;

    if (
      confirm(
        isArabic
          ? 'هل أنت متأكد من حذف هذه الترجمة؟'
          : 'Are you sure you want to delete this translation?'
      )
    ) {
      setTranslations(prev => prev.filter(t => t.id !== id));
      setHasChanges(true);
    }
  };

  // Save changes
  const saveChanges = () => {
    console.log('Saving translations:', translations);
    setHasChanges(false);
  };

  // Export translations
  const exportTranslations = () => {
    const exportData = {
      ar: translations.reduce(
        (acc, t) => {
          acc[t.key] = t.translations.ar;
          return acc;
        },
        {} as Record<string, string>
      ),
      en: translations.reduce(
        (acc, t) => {
          acc[t.key] = t.translations.en;
          return acc;
        },
        {} as Record<string, string>
      ),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.json';
    a.click();
  };

  // Check for missing translations
  const getMissingCount = () => {
    return translations.filter(t => !t.translations.ar || !t.translations.en).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isArabic ? 'محرر الترجمات' : 'Translation Editor'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? 'إدارة وتحرير جميع ترجمات الموقع'
              : 'Manage and edit all website translations'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          >
            <Plus className="size-4" />
            <span>{isArabic ? 'إضافة' : 'Add'}</span>
          </button>
          <button
            onClick={exportTranslations}
            className="hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          >
            <Download className="size-4" />
            <span>{isArabic ? 'تصدير' : 'Export'}</span>
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasChanges}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>{isArabic ? 'حفظ' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Languages className="text-primary size-5" />
            <span className="text-2xl font-bold">{translations.length}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {isArabic ? 'إجمالي الترجمات' : 'Total Translations'}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-green-500" />
            <span className="text-2xl font-bold">2</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{isArabic ? 'اللغات' : 'Languages'}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <AlertCircle
              className={`size-5 ${getMissingCount() > 0 ? 'text-yellow-500' : 'text-green-500'}`}
            />
            <span className="text-2xl font-bold">{getMissingCount()}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {isArabic ? 'ترجمات ناقصة' : 'Missing Translations'}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isArabic ? 'البحث في الترجمات...' : 'Search translations...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-background focus:ring-primary w-full rounded-lg border py-2 pe-4 ps-10 focus:outline-none focus:ring-2"
          />
        </div>
        <select
          value={selectedNamespace || ''}
          onChange={e => setSelectedNamespace(e.target.value || null)}
          className="bg-background focus:ring-primary rounded-lg border px-4 py-2 focus:outline-none focus:ring-2"
        >
          <option value="">{isArabic ? 'جميع المساحات' : 'All Namespaces'}</option>
          {namespaces.map(ns => (
            <option key={ns.id} value={ns.id}>
              {isArabic ? ns.labelAr : ns.labelEn}
            </option>
          ))}
        </select>
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

      {/* Translations List */}
      <div className="space-y-4">
        {filteredNamespaces.map(ns => {
          const nsTranslations = groupedTranslations[ns.id] || [];
          const isExpanded = expandedNamespaces.has(ns.id);

          // Filter by search
          const filteredTranslations = searchQuery
            ? nsTranslations.filter(
                item =>
                  item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.translations.ar.includes(searchQuery) ||
                  item.translations.en.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : nsTranslations;

          if (filteredTranslations.length === 0) return null;

          return (
            <div key={ns.id} className="bg-card overflow-hidden rounded-lg border">
              {/* Namespace Header */}
              <button
                onClick={() => toggleNamespace(ns.id)}
                className="hover:bg-muted/50 flex w-full items-center justify-between p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                  <span className={`size-2 rounded-full ${ns.color}`} />
                  <span className="font-medium">{isArabic ? ns.labelAr : ns.labelEn}</span>
                  <span className="text-muted-foreground text-xs">
                    ({filteredTranslations.length})
                  </span>
                </div>
              </button>

              {/* Translations Table */}
              {isExpanded && (
                <div className="border-t">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 text-sm">
                        <th className="w-1/4 p-3 text-start font-medium">
                          {isArabic ? 'المفتاح' : 'Key'}
                        </th>
                        <th className="w-1/3 p-3 text-start font-medium">
                          <span className="flex items-center gap-1">
                            <span className="bg-muted-foreground/20 flex size-4 items-center justify-center rounded text-[10px]">
                              ع
                            </span>
                            {isArabic ? 'العربية' : 'Arabic'}
                          </span>
                        </th>
                        <th className="w-1/3 p-3 text-start font-medium">
                          <span className="flex items-center gap-1">
                            <span className="bg-muted-foreground/20 flex size-4 items-center justify-center rounded text-[10px]">
                              En
                            </span>
                            {isArabic ? 'الإنجليزية' : 'English'}
                          </span>
                        </th>
                        <th className="w-16 p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTranslations.map(item => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                                {item.key}
                              </code>
                              {item.isSystem && (
                                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-600 dark:text-blue-400">
                                  {isArabic ? 'نظام' : 'System'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {editingId === item.id ? (
                              <input
                                type="text"
                                value={item.translations.ar}
                                onChange={e => updateTranslation(item.id, 'ar', e.target.value)}
                                dir="rtl"
                                className="bg-background focus:ring-primary w-full rounded border p-1.5 text-sm focus:outline-none focus:ring-2"
                              />
                            ) : (
                              <span
                                dir="rtl"
                                className="hover:bg-muted/50 block cursor-pointer rounded px-1.5 py-0.5 text-sm"
                                onClick={() => setEditingId(item.id)}
                              >
                                {item.translations.ar || (
                                  <span className="text-muted-foreground italic">
                                    {isArabic ? 'فارغ' : 'Empty'}
                                  </span>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {editingId === item.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item.translations.en}
                                  onChange={e => updateTranslation(item.id, 'en', e.target.value)}
                                  className="bg-background focus:ring-primary flex-1 rounded border p-1.5 text-sm focus:outline-none focus:ring-2"
                                />
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="bg-primary text-primary-foreground rounded p-1.5"
                                >
                                  <Check className="size-4" />
                                </button>
                              </div>
                            ) : (
                              <span
                                className="hover:bg-muted/50 block cursor-pointer rounded px-1.5 py-0.5 text-sm"
                                onClick={() => setEditingId(item.id)}
                              >
                                {item.translations.en || (
                                  <span className="text-muted-foreground italic">Empty</span>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {!item.isSystem && (
                              <button
                                onClick={() => deleteTranslation(item.id)}
                                className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Translation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-md rounded-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">
                {isArabic ? 'إضافة ترجمة جديدة' : 'Add New Translation'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'المساحة' : 'Namespace'}
                </label>
                <select
                  value={newTranslation.namespace}
                  onChange={e =>
                    setNewTranslation({ ...newTranslation, namespace: e.target.value })
                  }
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                >
                  {namespaces.map(ns => (
                    <option key={ns.id} value={ns.id}>
                      {isArabic ? ns.labelAr : ns.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'المفتاح' : 'Key'}
                </label>
                <input
                  type="text"
                  value={newTranslation.key}
                  onChange={e => setNewTranslation({ ...newTranslation, key: e.target.value })}
                  placeholder="e.g., buttons.newButton"
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'النص العربي' : 'Arabic Text'}
                </label>
                <input
                  type="text"
                  value={newTranslation.ar}
                  onChange={e => setNewTranslation({ ...newTranslation, ar: e.target.value })}
                  dir="rtl"
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'النص الإنجليزي' : 'English Text'}
                </label>
                <input
                  type="text"
                  value={newTranslation.en}
                  onChange={e => setNewTranslation({ ...newTranslation, en: e.target.value })}
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'الوصف (اختياري)' : 'Description (optional)'}
                </label>
                <input
                  type="text"
                  value={newTranslation.description}
                  onChange={e =>
                    setNewTranslation({ ...newTranslation, description: e.target.value })
                  }
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="hover:bg-muted rounded-lg border px-4 py-2 transition-colors"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={addTranslation}
                  disabled={!newTranslation.key || !newTranslation.ar || !newTranslation.en}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  {isArabic ? 'إضافة' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
