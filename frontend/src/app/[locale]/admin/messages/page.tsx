'use client';

/**
 * Messages Inbox Page
 * صفحة صندوق الرسائل
 */

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Mail,
  MailOpen,
  Star,
  StarOff,
  Archive,
  Trash2,
  Reply,
  Search,
  Download,
  RefreshCw,
  Clock,
  User,
  Building,
  Phone,
  AtSign,
  MessageSquare,
  CheckCircle,
  Send,
} from 'lucide-react';

// Message type
interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  service?: string;
  budget?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  isStarred: boolean;
  priority: 'low' | 'normal' | 'high';
  createdAt: Date;
  replies?: Array<{
    id: string;
    message: string;
    sentAt: Date;
  }>;
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    company: 'شركة التقنية',
    subject: 'استفسار عن تطوير تطبيق',
    message: 'نحتاج تطوير تطبيق موبايل لشركتنا. هل يمكنكم تقديم عرض سعر؟',
    service: 'mobile',
    budget: '10000-25000',
    status: 'new',
    isStarred: true,
    priority: 'high',
    createdAt: new Date('2024-03-10T10:30:00'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    company: 'Tech Solutions',
    subject: 'Website Redesign Project',
    message: 'We are looking to redesign our corporate website. Can you provide a quote?',
    service: 'web',
    budget: '5000-10000',
    status: 'read',
    isStarred: false,
    priority: 'normal',
    createdAt: new Date('2024-03-09T14:20:00'),
  },
  {
    id: '3',
    name: 'محمد علي',
    email: 'mohamed@gmail.com',
    phone: '+966559876543',
    subject: 'سؤال عن الأسعار',
    message: 'ما هي أسعار خدمة تصميم الهوية البصرية؟',
    service: 'design',
    status: 'replied',
    isStarred: false,
    priority: 'low',
    createdAt: new Date('2024-03-08T09:15:00'),
    replies: [
      {
        id: 'r1',
        message: 'شكراً لتواصلك. أسعارنا تبدأ من 5000 ريال.',
        sentAt: new Date('2024-03-08T11:00:00'),
      },
    ],
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@business.org',
    company: 'Business Corp',
    subject: 'Partnership Inquiry',
    message: 'We would like to discuss a potential partnership opportunity.',
    status: 'archived',
    isStarred: false,
    priority: 'normal',
    createdAt: new Date('2024-03-05T16:45:00'),
  },
  {
    id: '5',
    name: 'فاطمة أحمد',
    email: 'fatima@email.com',
    phone: '+966512345678',
    subject: 'طلب عرض سعر',
    message: 'أحتاج عرض سعر لتطوير موقع إلكتروني لمتجري الإلكتروني مع ربط بوابة دفع.',
    service: 'web',
    budget: '25000+',
    status: 'new',
    isStarred: true,
    priority: 'high',
    createdAt: new Date('2024-03-11T08:00:00'),
  },
];

// Status configuration
const statusConfig = {
  new: { labelAr: 'جديد', labelEn: 'New', color: 'bg-blue-500' },
  read: { labelAr: 'مقروء', labelEn: 'Read', color: 'bg-gray-500' },
  replied: { labelAr: 'تم الرد', labelEn: 'Replied', color: 'bg-green-500' },
  archived: { labelAr: 'مؤرشف', labelEn: 'Archived', color: 'bg-yellow-500' },
};

// Priority configuration
const priorityConfig = {
  low: { labelAr: 'منخفض', labelEn: 'Low', color: 'text-gray-500' },
  normal: { labelAr: 'عادي', labelEn: 'Normal', color: 'text-blue-500' },
  high: { labelAr: 'عالي', labelEn: 'High', color: 'text-red-500' },
};

export default function MessagesPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'starred' && !msg.isStarred) return false;
      if (filterStatus !== 'starred' && msg.status !== filterStatus) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort by date (newest first)
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Stats
  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    starred: messages.filter(m => m.isStarred).length,
    archived: messages.filter(m => m.status === 'archived').length,
  };

  // Toggle message selection
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Select all
  const selectAll = () => {
    if (selectedIds.size === sortedMessages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedMessages.map(m => m.id)));
    }
  };

  // Toggle star
  const toggleStar = (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, isStarred: !m.isStarred } : m)));
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id && m.status === 'new' ? { ...m, status: 'read' } : m))
    );
  };

  // Archive messages
  const archiveSelected = () => {
    setMessages(prev => prev.map(m => (selectedIds.has(m.id) ? { ...m, status: 'archived' } : m)));
    setSelectedIds(new Set());
  };

  // Delete messages
  const deleteSelected = () => {
    if (!confirm(isArabic ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      return;
    }
    setMessages(prev => prev.filter(m => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
    if (selectedMessage && selectedIds.has(selectedMessage.id)) {
      setSelectedMessage(null);
    }
  };

  // Send reply
  const sendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    setMessages(prev =>
      prev.map(m =>
        m.id === selectedMessage.id
          ? {
              ...m,
              status: 'replied',
              replies: [
                ...(m.replies || []),
                { id: Date.now().toString(), message: replyText, sentAt: new Date() },
              ],
            }
          : m
      )
    );

    setReplyText('');
    setShowReplyModal(false);
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Subject', 'Message', 'Status', 'Date'];
    const rows = messages.map(m => [
      m.name,
      m.email,
      m.phone || '',
      m.company || '',
      m.subject,
      m.message.replace(/,/g, ';'),
      m.status,
      m.createdAt.toISOString(),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'messages.csv';
    a.click();
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isArabic ? 'صندوق الرسائل' : 'Messages Inbox'}</h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? `${stats.new} رسالة جديدة من ${stats.total}`
              : `${stats.new} new messages of ${stats.total}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages(mockMessages)}
            className="hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          >
            <RefreshCw className="size-4" />
            <span>{isArabic ? 'تحديث' : 'Refresh'}</span>
          </button>
          <button
            onClick={exportCSV}
            className="hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          >
            <Download className="size-4" />
            <span>{isArabic ? 'تصدير' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`rounded-lg border p-4 text-start transition-colors ${
            filterStatus === 'all' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail className="text-primary size-5" />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {isArabic ? 'إجمالي الرسائل' : 'Total Messages'}
          </p>
        </button>
        <button
          onClick={() => setFilterStatus('new')}
          className={`rounded-lg border p-4 text-start transition-colors ${
            filterStatus === 'new' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
          }`}
        >
          <div className="flex items-center gap-2">
            <MailOpen className="size-5 text-blue-500" />
            <span className="text-2xl font-bold">{stats.new}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{isArabic ? 'جديدة' : 'New'}</p>
        </button>
        <button
          onClick={() => setFilterStatus('starred')}
          className={`rounded-lg border p-4 text-start transition-colors ${
            filterStatus === 'starred' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className="size-5 text-yellow-500" />
            <span className="text-2xl font-bold">{stats.starred}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{isArabic ? 'مميزة' : 'Starred'}</p>
        </button>
        <button
          onClick={() => setFilterStatus('archived')}
          className={`rounded-lg border p-4 text-start transition-colors ${
            filterStatus === 'archived' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
          }`}
        >
          <div className="flex items-center gap-2">
            <Archive className="size-5 text-gray-500" />
            <span className="text-2xl font-bold">{stats.archived}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{isArabic ? 'مؤرشفة' : 'Archived'}</p>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isArabic ? 'البحث في الرسائل...' : 'Search messages...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-background focus:ring-primary w-full rounded-lg border py-2 pe-4 ps-10 focus:outline-none focus:ring-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-background focus:ring-primary rounded-lg border px-4 py-2 focus:outline-none focus:ring-2"
          >
            <option value="all">{isArabic ? 'الكل' : 'All'}</option>
            <option value="new">{isArabic ? 'جديد' : 'New'}</option>
            <option value="read">{isArabic ? 'مقروء' : 'Read'}</option>
            <option value="replied">{isArabic ? 'تم الرد' : 'Replied'}</option>
            <option value="archived">{isArabic ? 'مؤرشف' : 'Archived'}</option>
            <option value="starred">{isArabic ? 'مميز' : 'Starred'}</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="border-primary/20 bg-primary/5 flex items-center gap-4 rounded-lg border p-3">
          <span className="text-sm">
            {isArabic ? `${selectedIds.size} محدد` : `${selectedIds.size} selected`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={archiveSelected}
              className="hover:bg-muted inline-flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors"
            >
              <Archive className="size-4" />
              <span>{isArabic ? 'أرشفة' : 'Archive'}</span>
            </button>
            <button
              onClick={deleteSelected}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="size-4" />
              <span>{isArabic ? 'حذف' : 'Delete'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Message List */}
        <div className="space-y-2 lg:col-span-1">
          {/* Select All */}
          <div className="flex items-center gap-2 border-b pb-2">
            <input
              type="checkbox"
              checked={selectedIds.size === sortedMessages.length && sortedMessages.length > 0}
              onChange={selectAll}
              className="size-4 rounded border-gray-300"
            />
            <span className="text-muted-foreground text-sm">
              {isArabic ? 'تحديد الكل' : 'Select all'}
            </span>
          </div>

          {sortedMessages.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <MessageSquare className="mx-auto mb-3 size-12 opacity-50" />
              <p>{isArabic ? 'لا توجد رسائل' : 'No messages'}</p>
            </div>
          ) : (
            sortedMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  markAsRead(msg.id);
                }}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  selectedMessage?.id === msg.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                } ${msg.status === 'new' ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(msg.id)}
                  onChange={e => {
                    e.stopPropagation();
                    toggleSelect(msg.id);
                  }}
                  onClick={e => e.stopPropagation()}
                  className="mt-1 size-4 rounded border-gray-300"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate font-medium ${msg.status === 'new' ? 'font-bold' : ''}`}
                    >
                      {msg.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleStar(msg.id);
                        }}
                        className="p-0.5"
                      >
                        {msg.isStarred ? (
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="text-muted-foreground size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p
                    className={`truncate text-sm ${msg.status === 'new' ? 'font-semibold' : 'text-muted-foreground'}`}
                  >
                    {msg.subject}
                  </p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                    <Clock className="size-3" />
                    <span>{formatDate(msg.createdAt)}</span>
                    <span className={`size-2 rounded-full ${statusConfig[msg.status].color}`} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-card rounded-lg border">
              {/* Header */}
              <div className="border-b p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">{selectedMessage.subject}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs text-white ${statusConfig[selectedMessage.status].color}`}
                      >
                        {isArabic
                          ? statusConfig[selectedMessage.status].labelAr
                          : statusConfig[selectedMessage.status].labelEn}
                      </span>
                      <span className={`text-sm ${priorityConfig[selectedMessage.priority].color}`}>
                        {isArabic
                          ? priorityConfig[selectedMessage.priority].labelAr
                          : priorityConfig[selectedMessage.priority].labelEn}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
                    >
                      <Reply className="size-4" />
                      <span>{isArabic ? 'رد' : 'Reply'}</span>
                    </button>
                    <button
                      onClick={() => toggleStar(selectedMessage.id)}
                      className="hover:bg-muted rounded-lg border p-2 transition-colors"
                    >
                      {selectedMessage.isStarred ? (
                        <Star className="size-4 fill-yellow-500 text-yellow-500" />
                      ) : (
                        <StarOff className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sender Info */}
              <div className="border-b p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground size-4" />
                    <span className="text-sm">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AtSign className="text-muted-foreground size-4" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground size-4" />
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="text-primary text-sm hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  {selectedMessage.company && (
                    <div className="flex items-center gap-2">
                      <Building className="text-muted-foreground size-4" />
                      <span className="text-sm">{selectedMessage.company}</span>
                    </div>
                  )}
                </div>
                {(selectedMessage.service || selectedMessage.budget) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedMessage.service && (
                      <span className="bg-muted rounded-full px-2 py-1 text-xs">
                        {isArabic ? 'الخدمة:' : 'Service:'} {selectedMessage.service}
                      </span>
                    )}
                    {selectedMessage.budget && (
                      <span className="bg-muted rounded-full px-2 py-1 text-xs">
                        {isArabic ? 'الميزانية:' : 'Budget:'} ${selectedMessage.budget}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedMessage.message}
                </p>
                <div className="text-muted-foreground mt-4 text-xs">
                  <Clock className="me-1 inline size-3" />
                  {selectedMessage.createdAt.toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                </div>
              </div>

              {/* Replies */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div className="border-t p-4">
                  <h3 className="mb-4 font-medium">{isArabic ? 'الردود' : 'Replies'}</h3>
                  <div className="space-y-4">
                    {selectedMessage.replies.map(reply => (
                      <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">{reply.message}</p>
                        <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                          <CheckCircle className="size-3 text-green-500" />
                          <span>{isArabic ? 'تم الإرسال' : 'Sent'}</span>
                          <span>•</span>
                          <span>{reply.sentAt.toLocaleString(isArabic ? 'ar-SA' : 'en-US')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card text-muted-foreground flex h-full items-center justify-center rounded-lg border p-12 text-center">
              <div>
                <Mail className="mx-auto mb-3 size-12 opacity-50" />
                <p>{isArabic ? 'اختر رسالة لعرضها' : 'Select a message to view'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-lg rounded-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">
                {isArabic ? 'الرد على' : 'Reply to'} {selectedMessage.name}
              </h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'إلى' : 'To'}
                </label>
                <div className="bg-muted/50 rounded-lg border p-2 text-sm">
                  {selectedMessage.email}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={6}
                  className="bg-background focus:ring-primary w-full resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2"
                  placeholder={isArabic ? 'اكتب ردك هنا...' : 'Write your reply here...'}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="hover:bg-muted rounded-lg border px-4 py-2 transition-colors"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{isArabic ? 'إرسال' : 'Send'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
