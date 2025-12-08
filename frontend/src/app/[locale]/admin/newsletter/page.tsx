'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
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
} from 'lucide-react';
import {
  getSubscribers,
  getSubscriberStats,
  createSubscriber,
  deleteSubscriber,
  bulkSubscriberAction,
  exportSubscribers,
  getCampaigns,
  createCampaign,
  deleteCampaign,
  duplicateCampaign,
  type Subscriber,
  type Campaign,
  type SubscriberStats,
} from '@/services/admin/newsletter.service';

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

  // Fetch subscribers
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

  // Fetch campaigns
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

  // Fetch stats
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

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscribers(), fetchCampaigns(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchSubscribers, fetchCampaigns, fetchStats]);

  // Computed stats for display
  const displayStats = {
    total: stats?.total || 0,
    active: stats?.active || 0,
    unsubscribed: stats?.unsubscribed || 0,
    bounced: stats?.bounced || 0,
    avgOpenRate: 0, // This would need to be calculated from campaign data
  };

  // Note: filtering is now done on the server side via API params
  // But we keep local filtering for immediate UI feedback
  const filteredSubscribers = subscribers;

  const getStatusColor = (status: Subscriber['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'unsubscribed':
        return 'bg-gray-100 text-gray-800';
      case 'bounced':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        setShowAddModal(false);
        setNewSubscriber({ email: '', name: '', tags: '' });
        await Promise.all([fetchSubscribers(), fetchStats()]);
      } else {
        alert(response.error || 'Failed to add subscriber');
      }
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      alert('Failed to add subscriber');
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
        setShowCampaignModal(false);
        setNewCampaign({ subjectAr: '', subjectEn: '', contentAr: '', contentEn: '' });
        await fetchCampaigns();
      } else {
        alert(response.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign');
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
      }
    } catch (error) {
      console.error('Failed to export subscribers:', error);
      alert('Failed to export subscribers');
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
        alert(response.error || 'Failed to perform action');
      }
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      alert('Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    setActionLoading(true);
    try {
      const response = await deleteCampaign(id);
      if (response.success) {
        await fetchCampaigns();
      } else {
        alert(response.error || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      alert('Failed to delete campaign');
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
        alert(response.error || 'Failed to duplicate campaign');
      }
    } catch (error) {
      console.error('Failed to duplicate campaign:', error);
      alert('Failed to duplicate campaign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    setActionLoading(true);
    try {
      const response = await deleteSubscriber(id);
      if (response.success) {
        await Promise.all([fetchSubscribers(), fetchStats()]);
      } else {
        alert(response.error || 'Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      alert('Failed to delete subscriber');
    } finally {
      setActionLoading(false);
    }
  };

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
      csvFormat: 'التنسيق: email,name,tags',
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
      csvFormat: 'Format: email,name,tags',
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

  // Loading state
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

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Mail className="size-7" />
            {t.title}
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.totalSubscribers}</p>
              <p className="text-xl font-bold">{displayStats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.activeSubscribers}</p>
              <p className="text-xl font-bold">{displayStats.active}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <UserMinus className="size-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.unsubscribed}</p>
              <p className="text-xl font-bold">{displayStats.unsubscribed}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <AlertCircle className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.bounced}</p>
              <p className="text-xl font-bold">{displayStats.bounced}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.avgOpenRate}</p>
              <p className="text-xl font-bold">{displayStats.avgOpenRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 rounded-lg bg-white shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'subscribers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="size-4" />
              {t.subscribers}
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
                    className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400${isRTL ? 'right-3' : 'left-3'}`}
                  />
                  <input
                    type="text"
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-64 rounded-lg border py-2 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="rounded-lg border px-3 py-2"
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
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  <Upload className="size-4" />
                  {t.import}
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  <Download className="size-4" />
                  {t.export}
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedSubscribers.length > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <span className="text-blue-700">
                  {selectedSubscribers.length} {t.selected}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('unsubscribe')}
                    className="rounded px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    {t.unsubscribeSelected}
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="rounded px-3 py-1 text-red-600 hover:text-red-800"
                  >
                    {t.deleteSelected}
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
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
                    <th className="p-3 text-start font-medium text-gray-600">{t.email}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.name}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.status}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.source}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.subscribedAt}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.openRate}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.tags}</th>
                    <th className="p-3 text-start font-medium text-gray-600">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSubscribers.map(sub => (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(sub._id)}
                          onChange={() => toggleSelect(sub._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3 font-medium">{sub.email}</td>
                      <td className="p-3 text-gray-600">{sub.name || '-'}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(sub.status)}`}
                        >
                          {getStatusIcon(sub.status)}
                          {t[sub.status as keyof typeof t]}
                        </span>
                      </td>
                      <td className="p-3 capitalize text-gray-600">
                        {t[sub.source as keyof typeof t] || sub.source}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(sub.subscribedAt).toLocaleDateString(locale)}
                      </td>
                      <td className="p-3">-</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {sub.tags.map(tag => (
                            <span
                              key={tag}
                              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          className="rounded p-1 hover:bg-gray-100"
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
                <div className="py-12 text-center text-gray-500">{t.noSubscribers}</div>
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
                  className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400${isRTL ? 'right-3' : 'left-3'}`}
                />
                <input
                  type="text"
                  placeholder={t.search}
                  className={`w-64 rounded-lg border py-2 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
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
                  className="rounded-lg border p-4 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-medium">
                          {campaign.subject[locale as keyof typeof campaign.subject] ||
                            campaign.subject.en}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}
                        >
                          {t[campaign.status as keyof typeof t]}
                        </span>
                      </div>

                      <div className="flex gap-6 text-sm text-gray-500">
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
                      <button className="rounded-lg p-2 hover:bg-gray-100" title={t.view}>
                        <Eye className="size-4 text-gray-500" />
                      </button>
                      <button
                        className="rounded-lg p-2 hover:bg-gray-100"
                        title={t.duplicate}
                        onClick={() => handleDuplicateCampaign(campaign._id)}
                        disabled={actionLoading}
                      >
                        <RefreshCw className="size-4 text-gray-500" />
                      </button>
                      <button
                        className="rounded-lg p-2 hover:bg-gray-100"
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
                <div className="py-12 text-center text-gray-500">{t.noCampaigns}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.addNewSubscriber}</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.email} *</label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={e => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.name}</label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={e => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.tags}</label>
                <input
                  type="text"
                  value={newSubscriber.tags}
                  onChange={e => setNewSubscriber(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder={t.tagsHint}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
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

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.createCampaign}</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.subjectAr}
                  </label>
                  <input
                    type="text"
                    value={newCampaign.subjectAr}
                    onChange={e => setNewCampaign(prev => ({ ...prev, subjectAr: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.subjectEn}
                  </label>
                  <input
                    type="text"
                    value={newCampaign.subjectEn}
                    onChange={e => setNewCampaign(prev => ({ ...prev, subjectEn: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.contentAr}
                  </label>
                  <textarea
                    value={newCampaign.contentAr}
                    onChange={e => setNewCampaign(prev => ({ ...prev, contentAr: e.target.value }))}
                    className="h-40 w-full rounded-lg border px-3 py-2"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.contentEn}
                  </label>
                  <textarea
                    value={newCampaign.contentEn}
                    onChange={e => setNewCampaign(prev => ({ ...prev, contentEn: e.target.value }))}
                    className="h-40 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                disabled={actionLoading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                disabled={actionLoading || !newCampaign.subjectAr || !newCampaign.subjectEn}
              >
                {actionLoading && <Loader2 className="size-4 animate-spin" />}
                {t.saveDraft}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.importSubscribers}</h2>

            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Upload className="mx-auto mb-4 size-12 text-gray-400" />
              <p className="mb-2 text-gray-600">{t.uploadCSV}</p>
              <p className="text-sm text-gray-400">{t.csvFormat}</p>
              <input type="file" accept=".csv" className="hidden" id="csv-upload" />
              <label
                htmlFor="csv-upload"
                className="mt-4 inline-block cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                {t.uploadCSV}
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
