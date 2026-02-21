'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import {
  Mail,
  Users,
  UserPlus,
  UserMinus,
  Download,
  Upload,
  Search,
  Send,
  Calendar,
  TrendingUp,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  FileText,
  X,
} from 'lucide-react';
import {
  getSubscribers,
  getSubscriberStats,
  createSubscriber,
  deleteSubscriber,
  bulkSubscriberAction,
  exportSubscribers,
  importSubscribers,
  getCampaigns,
  createCampaign,
  deleteCampaign,
  duplicateCampaign,
  type Subscriber,
  type Campaign,
  type SubscriberStats,
} from '@/services/admin/newsletter.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedRow {
  email: string;
  name: string;
  valid: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parse a raw CSV string and return a list of rows.
 * Supports an optional header row containing "email" and "name".
 * Falls back to positional (col 0 = email, col 1 = name).
 */
function parseCSV(raw: string): ParsedRow[] {
  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  // Detect header
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes('email') || firstLine.includes('name') || firstLine.includes('mail');

  const dataLines = hasHeader ? lines.slice(1) : lines;

  // Determine column positions from header (or default to 0,1)
  let emailCol = 0;
  let nameCol = 1;
  if (hasHeader) {
    const cols = lines[0].split(',').map(c => c.trim().toLowerCase());
    const eIdx = cols.findIndex(c => c === 'email' || c === 'e-mail' || c === 'mail');
    const nIdx = cols.findIndex(c => c === 'name' || c === 'full name' || c === 'fullname');
    if (eIdx !== -1) emailCol = eIdx;
    if (nIdx !== -1) nameCol = nIdx;
  }

  const seen = new Set<string>();
  const rows: ParsedRow[] = [];

  for (const line of dataLines) {
    // Basic CSV split (no quoted-field support needed per spec)
    const cols = line.split(',').map(c => c.trim());
    const email = cols[emailCol] ?? '';
    const name = cols[nameCol] ?? '';

    if (!email) continue;

    const emailLower = email.toLowerCase();

    if (!EMAIL_RE.test(email)) {
      rows.push({ email, name, valid: false, error: 'Invalid email format' });
      continue;
    }

    if (seen.has(emailLower)) {
      rows.push({ email, name, valid: false, error: 'Duplicate in file' });
      continue;
    }

    seen.add(emailLower);
    rows.push({ email, name, valid: true });
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NewsletterPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Data states
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '', tags: '' });
  const [newCampaign, setNewCampaign] = useState({
    subjectAr: '',
    subjectEn: '',
    contentAr: '',
    contentEn: '',
  });

  // ---------------------------------------------------------------------------
  // Import modal state
  // ---------------------------------------------------------------------------
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [importStep, setImportStep] = useState<'upload' | 'preview'>('upload');
  const [importRows, setImportRows] = useState<ParsedRow[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  const resetImportModal = () => {
    setImportStep('upload');
    setImportRows([]);
    setImportFileName('');
    setImportLoading(false);
    // Reset the hidden file input so the same file can be re-selected
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    resetImportModal();
  };

  // Handle file selection
  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      toast.error(isRTL ? 'يرجى اختيار ملف CSV' : 'Please select a CSV file');
      return;
    }

    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = event => {
      const raw = event.target?.result as string;
      if (!raw || raw.trim().length === 0) {
        toast.error(isRTL ? 'الملف فارغ' : 'The file is empty');
        return;
      }
      const rows = parseCSV(raw);
      if (rows.length === 0) {
        toast.error(isRTL ? 'لم يتم العثور على بيانات صالحة' : 'No valid data found in the file');
        return;
      }
      setImportRows(rows);
      setImportStep('preview');
    };
    reader.onerror = () => {
      toast.error(isRTL ? 'فشل قراءة الملف' : 'Failed to read the file');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Confirm and send to API
  const handleConfirmImport = async () => {
    const validRows = importRows.filter(r => r.valid);
    if (validRows.length === 0) {
      toast.error(isRTL ? 'لا توجد سجلات صالحة للاستيراد' : 'No valid rows to import');
      return;
    }

    setImportLoading(true);
    try {
      const payload = validRows.map(r => ({
        email: r.email,
        name: r.name || undefined,
      }));

      const response = await importSubscribers(payload, {
        locale: locale as 'ar' | 'en',
      });

      if (response.success && response.data) {
        const { imported, duplicates, invalid } = response.data;
        const parts: string[] = [];
        if (imported > 0) parts.push(isRTL ? `تم استيراد ${imported}` : `${imported} imported`);
        if (duplicates > 0)
          parts.push(isRTL ? `${duplicates} مكرر` : `${duplicates} duplicate(s) skipped`);
        if (invalid > 0) parts.push(isRTL ? `${invalid} غير صالح` : `${invalid} invalid`);

        toast.success(parts.join(' · ') || (isRTL ? 'تم الاستيراد' : 'Import complete'));
        closeImportModal();
        await Promise.all([fetchSubscribers(), fetchStats()]);
      } else {
        toast.error(response.error?.message || (isRTL ? 'فشل الاستيراد' : 'Import failed'));
      }
    } catch {
      toast.error(isRTL ? 'حدث خطأ أثناء الاستيراد' : 'An error occurred during import');
    } finally {
      setImportLoading(false);
    }
  };

  // Computed preview counts
  const validCount = importRows.filter(r => r.valid).length;
  const invalidCount = importRows.filter(r => !r.valid).length;

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchSubscribers = useCallback(async () => {
    try {
      const response = await getSubscribers({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? (statusFilter as Subscriber['status']) : undefined,
        limit: 100,
      });
      if (response.success && response.data) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    }
  }, [searchQuery, statusFilter]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await getCampaigns({ limit: 100 });
      if (response.success && response.data) {
        setCampaigns(response.data.campaigns);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getSubscriberStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscribers(), fetchCampaigns(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchSubscribers, fetchCampaigns, fetchStats]);

  // ---------------------------------------------------------------------------
  // Computed display values
  // ---------------------------------------------------------------------------

  const displayStats = {
    total: stats?.total || 0,
    active: stats?.active || 0,
    unsubscribed: stats?.unsubscribed || 0,
    bounced: stats?.bounced || 0,
    avgOpenRate: 0,
  };

  const filteredSubscribers = subscribers;

  // ---------------------------------------------------------------------------
  // Utility helpers
  // ---------------------------------------------------------------------------

  const getStatusColor = (status: Subscriber['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'unsubscribed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'bounced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: Subscriber['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="size-4" />;
      case 'unsubscribed':
        return <UserMinus className="size-4" />;
      case 'bounced':
        return <AlertCircle className="size-4" />;
      case 'pending':
        return <Clock className="size-4" />;
      default:
        return null;
    }
  };

  const getCampaignStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // ---------------------------------------------------------------------------
  // Selection helpers
  // ---------------------------------------------------------------------------

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // ---------------------------------------------------------------------------
  // Action handlers
  // ---------------------------------------------------------------------------

  const handleAddSubscriber = async () => {
    setActionLoading(true);
    try {
      const tags = newSubscriber.tags
        ? newSubscriber.tags
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
        : [];
      const response = await createSubscriber({
        email: newSubscriber.email,
        name: newSubscriber.name || undefined,
        tags,
        locale: locale as 'ar' | 'en',
        source: 'manual',
      });
      if (response.success) {
        toast.success(isRTL ? 'تم إضافة المشترك' : 'Subscriber added');
        setShowAddModal(false);
        setNewSubscriber({ email: '', name: '', tags: '' });
        await Promise.all([fetchSubscribers(), fetchStats()]);
      } else {
        toast.error(
          response.error?.message || (isRTL ? 'فشل إضافة المشترك' : 'Failed to add subscriber')
        );
      }
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      toast.error(isRTL ? 'فشل إضافة المشترك' : 'Failed to add subscriber');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    setActionLoading(true);
    try {
      const response = await createCampaign({
        subject: { ar: newCampaign.subjectAr, en: newCampaign.subjectEn },
        content: { ar: newCampaign.contentAr, en: newCampaign.contentEn },
        recipientType: 'all',
      });
      if (response.success) {
        toast.success(isRTL ? 'تم إنشاء الحملة' : 'Campaign created');
        setShowCampaignModal(false);
        setNewCampaign({ subjectAr: '', subjectEn: '', contentAr: '', contentEn: '' });
        await fetchCampaigns();
      } else {
        toast.error(
          response.error?.message || (isRTL ? 'فشل إنشاء الحملة' : 'Failed to create campaign')
        );
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast.error(isRTL ? 'فشل إنشاء الحملة' : 'Failed to create campaign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    setActionLoading(true);
    try {
      const response = await exportSubscribers({
        status: statusFilter !== 'all' ? (statusFilter as Subscriber['status']) : undefined,
      });
      if (response.success && response.data) {
        const csvContent = [
          ['Email', 'Name', 'Status', 'Tags', 'Subscribed At'],
          ...response.data.subscribers.map(s => [
            s.email,
            s.name || '',
            s.status,
            s.tags,
            s.subscribedAt,
          ]),
        ]
          .map(row => row.join(','))
          .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export subscribers:', error);
      toast.error(isRTL ? 'فشل تصدير المشتركين' : 'Failed to export subscribers');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'unsubscribe' | 'activate') => {
    if (selectedSubscribers.length === 0) return;
    setActionLoading(true);
    try {
      const response = await bulkSubscriberAction({
        ids: selectedSubscribers,
        action,
      });
      if (response.success) {
        setSelectedSubscribers([]);
        await Promise.all([fetchSubscribers(), fetchStats()]);
      } else {
        toast.error(
          response.error?.message || (isRTL ? 'فشل تنفيذ الإجراء' : 'Failed to perform action')
        );
      }
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      toast.error(isRTL ? 'فشل تنفيذ الإجراء' : 'Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (
      !confirm(
        isRTL ? 'هل أنت متأكد من حذف هذه الحملة؟' : 'Are you sure you want to delete this campaign?'
      )
    )
      return;
    setActionLoading(true);
    try {
      const response = await deleteCampaign(id);
      if (response.success) {
        await fetchCampaigns();
      } else {
        toast.error(
          response.error?.message || (isRTL ? 'فشل حذف الحملة' : 'Failed to delete campaign')
        );
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      toast.error(isRTL ? 'فشل حذف الحملة' : 'Failed to delete campaign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicateCampaign = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await duplicateCampaign(id);
      if (response.success) {
        await fetchCampaigns();
      } else {
        toast.error(
          response.error?.message || (isRTL ? 'فشل نسخ الحملة' : 'Failed to duplicate campaign')
        );
      }
    } catch (error) {
      console.error('Failed to duplicate campaign:', error);
      toast.error(isRTL ? 'فشل نسخ الحملة' : 'Failed to duplicate campaign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذا المشترك؟'
          : 'Are you sure you want to delete this subscriber?'
      )
    )
      return;
    setActionLoading(true);
    try {
      const response = await deleteSubscriber(id);
      if (response.success) {
        await Promise.all([fetchSubscribers(), fetchStats()]);
      } else {
        toast.error(
          response.error?.message || (isRTL ? 'فشل حذف المشترك' : 'Failed to delete subscriber')
        );
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      toast.error(isRTL ? 'فشل حذف المشترك' : 'Failed to delete subscriber');
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // i18n strings
  // ---------------------------------------------------------------------------

  const texts = {
    ar: {
      title: 'النشرة البريدية',
      subscribers: 'المشتركين',
      campaigns: 'الحملات',
      totalSubscribers: 'إجمالي المشتركين',
      activeSubscribers: 'المشتركين النشطين',
      unsubscribed: 'إلغاء الاشتراك',
      bounced: 'البريد المرتد',
      avgOpenRate: 'متوسط معدل الفتح',
      search: 'بحث...',
      allStatuses: 'جميع الحالات',
      active: 'نشط',
      pending: 'قيد الانتظار',
      addSubscriber: 'إضافة مشترك',
      import: 'استيراد',
      export: 'تصدير',
      newCampaign: 'حملة جديدة',
      email: 'البريد الإلكتروني',
      name: 'الاسم',
      status: 'الحالة',
      source: 'المصدر',
      subscribedAt: 'تاريخ الاشتراك',
      openRate: 'معدل الفتح',
      tags: 'الوسوم',
      actions: 'الإجراءات',
      subject: 'الموضوع',
      sentAt: 'تاريخ الإرسال',
      scheduledFor: 'مجدول في',
      recipients: 'المستلمين',
      opened: 'مفتوح',
      clicked: 'نقرات',
      website: 'الموقع',
      manual: 'يدوي',
      api: 'API',
      deleteSelected: 'حذف المحدد',
      unsubscribeSelected: 'إلغاء اشتراك المحدد',
      selected: 'محدد',
      addNewSubscriber: 'إضافة مشترك جديد',
      tagsHint: 'افصل الوسوم بفواصل',
      cancel: 'إلغاء',
      add: 'إضافة',
      createCampaign: 'إنشاء حملة جديدة',
      subjectAr: 'الموضوع (عربي)',
      subjectEn: 'الموضوع (إنجليزي)',
      contentAr: 'المحتوى (عربي)',
      contentEn: 'المحتوى (إنجليزي)',
      saveDraft: 'حفظ كمسودة',
      schedule: 'جدولة',
      sendNow: 'إرسال الآن',
      importSubscribers: 'استيراد مشتركين',
      uploadCSV: 'رفع ملف CSV',
      csvFormat: 'التنسيق: email,name',
      csvFormatHint:
        'يمكن أن يحتوي الملف على عمود email وعمود name اختياري. يجب ألا يزيد عن 5000 سطر.',
      chooseFile: 'اختر ملف CSV',
      changeFile: 'تغيير الملف',
      previewTitle: 'معاينة البيانات',
      validRows: 'سجلات صالحة',
      invalidRows: 'سجلات غير صالحة',
      confirmImport: 'تأكيد الاستيراد',
      importError: 'خطأ',
      back: 'رجوع',
      draft: 'مسودة',
      scheduled: 'مجدول',
      sent: 'مرسل',
      sending: 'جاري الإرسال',
      noSubscribers: 'لا يوجد مشتركين',
      noCampaigns: 'لا يوجد حملات',
      view: 'عرض',
      edit: 'تعديل',
      delete: 'حذف',
      duplicate: 'نسخ',
    },
    en: {
      title: 'Newsletter',
      subscribers: 'Subscribers',
      campaigns: 'Campaigns',
      totalSubscribers: 'Total Subscribers',
      activeSubscribers: 'Active Subscribers',
      unsubscribed: 'Unsubscribed',
      bounced: 'Bounced',
      avgOpenRate: 'Avg. Open Rate',
      search: 'Search...',
      allStatuses: 'All Statuses',
      active: 'Active',
      pending: 'Pending',
      addSubscriber: 'Add Subscriber',
      import: 'Import',
      export: 'Export',
      newCampaign: 'New Campaign',
      email: 'Email',
      name: 'Name',
      status: 'Status',
      source: 'Source',
      subscribedAt: 'Subscribed At',
      openRate: 'Open Rate',
      tags: 'Tags',
      actions: 'Actions',
      subject: 'Subject',
      sentAt: 'Sent At',
      scheduledFor: 'Scheduled For',
      recipients: 'Recipients',
      opened: 'Opened',
      clicked: 'Clicked',
      website: 'Website',
      manual: 'Manual',
      api: 'API',
      deleteSelected: 'Delete Selected',
      unsubscribeSelected: 'Unsubscribe Selected',
      selected: 'selected',
      addNewSubscriber: 'Add New Subscriber',
      tagsHint: 'Separate tags with commas',
      cancel: 'Cancel',
      add: 'Add',
      createCampaign: 'Create New Campaign',
      subjectAr: 'Subject (Arabic)',
      subjectEn: 'Subject (English)',
      contentAr: 'Content (Arabic)',
      contentEn: 'Content (English)',
      saveDraft: 'Save as Draft',
      schedule: 'Schedule',
      sendNow: 'Send Now',
      importSubscribers: 'Import Subscribers',
      uploadCSV: 'Upload CSV File',
      csvFormat: 'Format: email, name',
      csvFormatHint:
        'File must have an email column and an optional name column. Maximum 5,000 rows.',
      chooseFile: 'Choose CSV File',
      changeFile: 'Change File',
      previewTitle: 'Data Preview',
      validRows: 'valid rows',
      invalidRows: 'invalid rows',
      confirmImport: 'Confirm Import',
      importError: 'Error',
      back: 'Back',
      draft: 'Draft',
      scheduled: 'Scheduled',
      sent: 'Sent',
      sending: 'Sending',
      noSubscribers: 'No subscribers found',
      noCampaigns: 'No campaigns found',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      duplicate: 'Duplicate',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  // ---------------------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div
        className={`flex min-h-[400px] items-center justify-center p-6 ${isRTL ? 'rtl' : 'ltr'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Mail className="size-7" />
            {t.title}
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalSubscribers}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {displayStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.activeSubscribers}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {displayStats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
              <UserMinus className="size-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.unsubscribed}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {displayStats.unsubscribed}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
              <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.bounced}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {displayStats.bounced}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <TrendingUp className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.avgOpenRate}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {displayStats.avgOpenRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'subscribers'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Users className="size-4" />
              {t.subscribers}
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Send className="size-4" />
              {t.campaigns}
            </button>
          </div>
        </div>

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="p-4">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search
                    className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`}
                  />
                  <input
                    type="text"
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-64 rounded-lg border border-gray-300 bg-white py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">{t.allStatuses}</option>
                  <option value="active">{t.active}</option>
                  <option value="unsubscribed">{t.unsubscribed}</option>
                  <option value="bounced">{t.bounced}</option>
                  <option value="pending">{t.pending}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  <UserPlus className="size-4" />
                  {t.addSubscriber}
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Upload className="size-4" />
                  {t.import}
                </button>
                <button
                  onClick={handleExport}
                  disabled={actionLoading}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Download className="size-4" />
                  {t.export}
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedSubscribers.length > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <span className="text-blue-700 dark:text-blue-400">
                  {selectedSubscribers.length} {t.selected}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('unsubscribe')}
                    disabled={actionLoading}
                    className="rounded px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {t.unsubscribeSelected}
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading}
                    className="rounded px-3 py-1 text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t.deleteSelected}
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-3 text-start">
                      <input
                        type="checkbox"
                        checked={
                          selectedSubscribers.length === filteredSubscribers.length &&
                          filteredSubscribers.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.email}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.name}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.status}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.source}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.subscribedAt}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.openRate}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.tags}
                    </th>
                    <th className="p-3 text-start font-medium text-gray-600 dark:text-gray-400">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubscribers.map(sub => (
                    <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(sub._id)}
                          onChange={() => toggleSelect(sub._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{sub.name || '-'}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(sub.status)}`}
                        >
                          {getStatusIcon(sub.status)}
                          {t[sub.status as keyof typeof t]}
                        </span>
                      </td>
                      <td className="p-3 capitalize text-gray-600 dark:text-gray-400">
                        {t[sub.source as keyof typeof t] || sub.source}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        {new Date(sub.subscribedAt).toLocaleDateString(locale)}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">-</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {sub.tags.map(tag => (
                            <span
                              key={tag}
                              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleDeleteSubscriber(sub._id)}
                          disabled={actionLoading}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSubscribers.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  {t.noSubscribers}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="p-4">
            {/* Toolbar */}
            <div className="mb-4 flex justify-between">
              <div className="relative">
                <Search
                  className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`}
                />
                <input
                  type="text"
                  placeholder={t.search}
                  className={`w-64 rounded-lg border border-gray-300 bg-white py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
                />
              </div>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <Send className="size-4" />
                {t.newCampaign}
              </button>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div
                  key={campaign._id}
                  className="rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-700 dark:hover:shadow-gray-900/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {campaign.subject[locale as keyof typeof campaign.subject] ||
                            campaign.subject.en}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}
                        >
                          {t[campaign.status as keyof typeof t]}
                        </span>
                      </div>

                      <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                        {campaign.sentAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {t.sentAt}: {new Date(campaign.sentAt).toLocaleDateString(locale)}
                          </span>
                        )}
                        {campaign.scheduledAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-4" />
                            {t.scheduledFor}:{' '}
                            {new Date(campaign.scheduledAt).toLocaleDateString(locale)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="size-4" />
                          {t.recipients}: {campaign.metrics?.recipientCount || 0}
                        </span>
                        {campaign.status === 'sent' && campaign.metrics && (
                          <>
                            <span className="flex items-center gap-1">
                              <Eye className="size-4" />
                              {t.opened}: {campaign.metrics.openCount} (
                              {campaign.metrics.recipientCount > 0
                                ? Math.round(
                                    (campaign.metrics.openCount / campaign.metrics.recipientCount) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="size-4" />
                              {t.clicked}: {campaign.metrics.clickCount} (
                              {campaign.metrics.recipientCount > 0
                                ? Math.round(
                                    (campaign.metrics.clickCount /
                                      campaign.metrics.recipientCount) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t.view}
                      >
                        <Eye className="size-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t.duplicate}
                        onClick={() => handleDuplicateCampaign(campaign._id)}
                        disabled={actionLoading}
                      >
                        <RefreshCw className="size-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t.delete}
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        disabled={actionLoading}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {campaigns.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  {t.noCampaigns}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add Subscriber Modal                                                */}
      {/* ------------------------------------------------------------------ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {t.addNewSubscriber}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.email} *
                </label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={e => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={e => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.tags}
                </label>
                <input
                  type="text"
                  value={newSubscriber.tags}
                  onChange={e => setNewSubscriber(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={t.tagsHint}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={actionLoading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddSubscriber}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                disabled={actionLoading || !newSubscriber.email}
              >
                {actionLoading && <Loader2 className="size-4 animate-spin" />}
                {t.add}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Create Campaign Modal                                               */}
      {/* ------------------------------------------------------------------ */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {t.createCampaign}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.subjectAr}
                  </label>
                  <input
                    type="text"
                    value={newCampaign.subjectAr}
                    onChange={e => setNewCampaign(prev => ({ ...prev, subjectAr: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.subjectEn}
                  </label>
                  <input
                    type="text"
                    value={newCampaign.subjectEn}
                    onChange={e => setNewCampaign(prev => ({ ...prev, subjectEn: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.contentAr}
                  </label>
                  <textarea
                    value={newCampaign.contentAr}
                    onChange={e => setNewCampaign(prev => ({ ...prev, contentAr: e.target.value }))}
                    className="h-40 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.contentEn}
                  </label>
                  <textarea
                    value={newCampaign.contentEn}
                    onChange={e => setNewCampaign(prev => ({ ...prev, contentEn: e.target.value }))}
                    className="h-40 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={actionLoading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={actionLoading || !newCampaign.subjectAr || !newCampaign.subjectEn}
              >
                {actionLoading && <Loader2 className="size-4 animate-spin" />}
                {t.saveDraft}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Import Modal                                                        */}
      {/* ------------------------------------------------------------------ */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.importSubscribers}
              </h2>
              <button
                onClick={closeImportModal}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Upload */}
              {importStep === 'upload' && (
                <div className="space-y-4">
                  {/* Drop zone */}
                  <label
                    htmlFor="csv-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/10"
                  >
                    <Upload className="mb-3 size-12 text-gray-400 dark:text-gray-500" />
                    <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">
                      {t.uploadCSV}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.csvFormat}</p>
                    <span className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
                      {t.chooseFile}
                    </span>
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    id="csv-upload"
                    className="hidden"
                    onChange={handleCSVFileChange}
                  />

                  {/* Format hint */}
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                    {t.csvFormatHint}
                  </p>
                </div>
              )}

              {/* Step 2: Preview */}
              {importStep === 'preview' && (
                <div className="space-y-4">
                  {/* Summary bar */}
                  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                    <FileText className="size-5 text-gray-500 dark:text-gray-400" />
                    <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                      {importFileName}
                    </span>
                    <div className="ms-auto flex gap-3 text-sm">
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="size-4" />
                        {validCount} {t.validRows}
                      </span>
                      {invalidCount > 0 && (
                        <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                          <AlertCircle className="size-4" />
                          {invalidCount} {t.invalidRows}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={resetImportModal}
                      className="text-xs text-blue-500 hover:underline dark:text-blue-400"
                    >
                      {t.changeFile}
                    </button>
                  </div>

                  {/* Preview table */}
                  <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="p-2 text-start font-medium text-gray-600 dark:text-gray-400">
                            {t.email}
                          </th>
                          <th className="p-2 text-start font-medium text-gray-600 dark:text-gray-400">
                            {t.name}
                          </th>
                          <th className="p-2 text-start font-medium text-gray-600 dark:text-gray-400">
                            {t.status}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {importRows.map((row, idx) => (
                          <tr
                            key={idx}
                            className={
                              row.valid
                                ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                : 'bg-red-50 dark:bg-red-900/10'
                            }
                          >
                            <td className="p-2 text-gray-900 dark:text-white">
                              {row.email || '-'}
                            </td>
                            <td className="p-2 text-gray-600 dark:text-gray-400">
                              {row.name || '-'}
                            </td>
                            <td className="p-2">
                              {row.valid ? (
                                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <CheckCircle className="size-3.5" />
                                  {isRTL ? 'صالح' : 'Valid'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400">
                                  <AlertCircle className="size-3.5" />
                                  {row.error}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {validCount === 0 && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {isRTL
                        ? 'لا توجد سجلات صالحة. يرجى التحقق من تنسيق الملف.'
                        : 'No valid rows found. Please check the file format.'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <button
                onClick={closeImportModal}
                disabled={importLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </button>

              {importStep === 'preview' && (
                <button
                  onClick={handleConfirmImport}
                  disabled={importLoading || validCount === 0}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {importLoading && <Loader2 className="size-4 animate-spin" />}
                  {t.confirmImport} ({validCount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
