'use client';

/**
 * User Management Page
 * صفحة إدارة المستخدمين
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Key,
  Eye,
  EyeOff,
  UserCog,
  Activity,
  Lock,
  Unlock,
  RefreshCw,
} from 'lucide-react';
import {
  usersAdminService,
  type User,
  type UserRole,
  type UserStatus,
  type UsersResponse,
  type UserStats,
} from '@/services/admin';

export default function UsersPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as UserRole,
    sendInvite: true,
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const roles: { value: UserRole; labelAr: string; labelEn: string; color: string }[] = [
    {
      value: 'super_admin',
      labelAr: 'مدير عام',
      labelEn: 'Super Admin',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      value: 'admin',
      labelAr: 'مدير',
      labelEn: 'Admin',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      value: 'editor',
      labelAr: 'محرر',
      labelEn: 'Editor',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      value: 'author',
      labelAr: 'كاتب',
      labelEn: 'Author',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    {
      value: 'viewer',
      labelAr: 'مشاهد',
      labelEn: 'Viewer',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
  ];

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Parameters<typeof usersAdminService.getAllUsers>[0] = {
        page,
        limit: 10,
        sort: '-createdAt',
      };

      if (roleFilter !== 'all') params.role = roleFilter as UserRole;
      if (statusFilter !== 'all') params.status = statusFilter as UserStatus;
      if (debouncedSearch) params.search = debouncedSearch;

      const response: UsersResponse = await usersAdminService.getAllUsers(params);
      setUsers(response.users);
      setTotalPages(response.pages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(isRTL ? 'فشل في تحميل المستخدمين' : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter, debouncedSearch, isRTL]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await usersAdminService.getUserStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Debounced search - updates debouncedSearch after 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getRoleInfo = (role: UserRole) => roles.find(r => r.value === role);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'locked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="size-4" />;
      case 'inactive':
        return <XCircle className="size-4" />;
      case 'locked':
        return <Lock className="size-4" />;
      case 'pending':
        return <Clock className="size-4" />;
      default:
        return null;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <ShieldAlert className="size-4" />;
      case 'admin':
        return <ShieldCheck className="size-4" />;
      case 'editor':
      case 'author':
        return <Shield className="size-4" />;
      default:
        return <Users className="size-4" />;
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => (prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]));
  };

  const handleAddUser = async () => {
    try {
      await usersAdminService.createUser(newUser);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'viewer', sendInvite: true });
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error('Failed to create user:', err);
      alert(isRTL ? 'فشل في إنشاء المستخدم' : 'Failed to create user');
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    try {
      await usersAdminService.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        isActive: editingUser.isActive,
      });
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      alert(isRTL ? 'فشل في تحديث المستخدم' : 'Failed to update user');
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser) return;
    if (newPassword !== confirmPassword) {
      alert(isRTL ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert(
        isRTL
          ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
          : 'Password must be at least 8 characters'
      );
      return;
    }
    try {
      await usersAdminService.resetUserPassword(editingUser._id, newPassword);
      setShowPasswordModal(false);
      setEditingUser(null);
      setNewPassword('');
      setConfirmPassword('');
      alert(isRTL ? 'تم إعادة تعيين كلمة المرور بنجاح' : 'Password reset successfully');
    } catch (err) {
      console.error('Failed to reset password:', err);
      alert(isRTL ? 'فشل في إعادة تعيين كلمة المرور' : 'Failed to reset password');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !confirm(
        isRTL ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?'
      )
    ) {
      return;
    }
    try {
      await usersAdminService.deleteUser(user._id);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(isRTL ? 'فشل في حذف المستخدم' : 'Failed to delete user');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete' | 'unlock') => {
    if (
      action === 'delete' &&
      !confirm(
        isRTL
          ? `هل أنت متأكد من حذف ${selectedUsers.length} مستخدم؟`
          : `Are you sure you want to delete ${selectedUsers.length} users?`
      )
    ) {
      return;
    }
    try {
      await usersAdminService.bulkAction({ ids: selectedUsers, action });
      setSelectedUsers([]);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error('Failed to perform bulk action:', err);
      alert(isRTL ? 'فشل في تنفيذ العملية' : 'Failed to perform action');
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const texts = {
    ar: {
      title: 'إدارة المستخدمين',
      totalUsers: 'إجمالي المستخدمين',
      activeUsers: 'المستخدمين النشطين',
      pendingUsers: 'في الانتظار',
      lockedUsers: 'الحسابات المقفلة',
      search: 'بحث...',
      allRoles: 'جميع الأدوار',
      allStatuses: 'جميع الحالات',
      addUser: 'إضافة مستخدم',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      status: 'الحالة',
      lastLogin: 'آخر دخول',
      createdAt: 'تاريخ الإنشاء',
      actions: 'الإجراءات',
      edit: 'تعديل',
      delete: 'حذف',
      resetPassword: 'إعادة تعيين كلمة المرور',
      active: 'نشط',
      inactive: 'غير نشط',
      locked: 'مقفل',
      pending: 'في الانتظار',
      verified: 'موثق',
      notVerified: 'غير موثق',
      twoFactorEnabled: '2FA مفعل',
      selected: 'محدد',
      activate: 'تفعيل',
      deactivate: 'تعطيل',
      unlock: 'فتح القفل',
      deleteSelected: 'حذف المحدد',
      addNewUser: 'إضافة مستخدم جديد',
      password: 'كلمة المرور',
      sendInvite: 'إرسال دعوة بالبريد',
      cancel: 'إلغاء',
      save: 'حفظ',
      add: 'إضافة',
      editUser: 'تعديل المستخدم',
      resetPasswordFor: 'إعادة تعيين كلمة المرور لـ',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      reset: 'إعادة تعيين',
      noUsers: 'لا يوجد مستخدمين',
      never: 'لم يسجل دخول',
      viewProfile: 'عرض الملف',
      viewActivity: 'عرض النشاط',
      refresh: 'تحديث',
      loadError: 'فشل في تحميل المستخدمين',
      retry: 'إعادة المحاولة',
    },
    en: {
      title: 'User Management',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      pendingUsers: 'Pending',
      lockedUsers: 'Locked Accounts',
      search: 'Search...',
      allRoles: 'All Roles',
      allStatuses: 'All Statuses',
      addUser: 'Add User',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      lastLogin: 'Last Login',
      createdAt: 'Created At',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      resetPassword: 'Reset Password',
      active: 'Active',
      inactive: 'Inactive',
      locked: 'Locked',
      pending: 'Pending',
      verified: 'Verified',
      notVerified: 'Not Verified',
      twoFactorEnabled: '2FA Enabled',
      selected: 'selected',
      activate: 'Activate',
      deactivate: 'Deactivate',
      unlock: 'Unlock',
      deleteSelected: 'Delete Selected',
      addNewUser: 'Add New User',
      password: 'Password',
      sendInvite: 'Send email invite',
      cancel: 'Cancel',
      save: 'Save',
      add: 'Add',
      editUser: 'Edit User',
      resetPasswordFor: 'Reset Password for',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      reset: 'Reset',
      noUsers: 'No users found',
      never: 'Never logged in',
      viewProfile: 'View Profile',
      viewActivity: 'View Activity',
      refresh: 'Refresh',
      loadError: 'Failed to load users',
      retry: 'Retry',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (error && users.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2"
          >
            <RefreshCw className="size-4" />
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <UserCog className="size-7" />
            {t.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="border-input hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2"
          >
            <UserPlus className="size-4" />
            {t.addUser}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t.totalUsers}</p>
              <p className="text-xl font-bold">{stats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t.activeUsers}</p>
              <p className="text-xl font-bold">{stats?.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <Clock className="size-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t.pendingUsers}</p>
              <p className="text-xl font-bold">{stats?.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
              <Lock className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t.lockedUsers}</p>
              <p className="text-xl font-bold">{stats?.locked || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between gap-4 border-b p-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search
                className={`text-muted-foreground absolute top-1/2 size-4 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`}
              />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`bg-background w-64 rounded-lg border py-2 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
              />
            </div>

            <select
              value={roleFilter}
              onChange={e => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="bg-background rounded-lg border px-3 py-2"
            >
              <option value="all">{t.allRoles}</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {locale === 'ar' ? role.labelAr : role.labelEn}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-background rounded-lg border px-3 py-2"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
              <option value="locked">{t.locked}</option>
              <option value="pending">{t.pending}</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between border-b bg-blue-50 p-3 dark:bg-blue-900/20">
            <span className="text-blue-700 dark:text-blue-300">
              {selectedUsers.length} {t.selected}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="flex items-center gap-1 rounded px-3 py-1 text-green-600 hover:text-green-800 dark:text-green-400"
              >
                <CheckCircle className="size-4" />
                {t.activate}
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="text-muted-foreground flex items-center gap-1 rounded px-3 py-1 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <XCircle className="size-4" />
                {t.deactivate}
              </button>
              <button
                onClick={() => handleBulkAction('unlock')}
                className="flex items-center gap-1 rounded px-3 py-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
              >
                <Unlock className="size-4" />
                {t.unlock}
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-1 rounded px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400"
              >
                <Trash2 className="size-4" />
                {t.deleteSelected}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-start">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-muted-foreground p-3 text-start font-medium">{t.name}</th>
                <th className="text-muted-foreground p-3 text-start font-medium">{t.email}</th>
                <th className="text-muted-foreground p-3 text-start font-medium">{t.role}</th>
                <th className="text-muted-foreground p-3 text-start font-medium">{t.status}</th>
                <th className="text-muted-foreground p-3 text-start font-medium">{t.lastLogin}</th>
                <th className="text-muted-foreground p-3 text-start font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => {
                const roleInfo = getRoleInfo(user.role);
                return (
                  <tr key={user._id} className="hover:bg-muted/50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleSelect(user._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex size-10 items-center justify-center rounded-full font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            {user.isEmailVerified ? (
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="size-3" />
                                {t.verified}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                <Clock className="size-3" />
                                {t.notVerified}
                              </span>
                            )}
                            {user.twoFactorEnabled && (
                              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                <Shield className="size-3" />
                                {t.twoFactorEnabled}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Mail className="size-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${roleInfo?.color}`}
                      >
                        {getRoleIcon(user.role)}
                        {locale === 'ar' ? roleInfo?.labelAr : roleInfo?.labelEn}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                      >
                        {getStatusIcon(user.status)}
                        {t[user.status as keyof typeof t]}
                      </span>
                    </td>
                    <td className="text-muted-foreground p-3 text-sm">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {formatDateTime(user.lastLogin)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{t.never}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                          className="hover:bg-muted rounded-lg p-2"
                          title={t.edit}
                        >
                          <Edit className="text-muted-foreground size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowPasswordModal(true);
                          }}
                          className="hover:bg-muted rounded-lg p-2"
                          title={t.resetPassword}
                        >
                          <Key className="text-muted-foreground size-4" />
                        </button>
                        <button className="hover:bg-muted rounded-lg p-2" title={t.viewActivity}>
                          <Activity className="text-muted-foreground size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="hover:bg-muted rounded-lg p-2"
                          title={t.delete}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-muted-foreground py-12 text-center">{t.noUsers}</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t p-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border px-3 py-1 disabled:opacity-50"
            >
              {isRTL ? '→' : '←'}
            </button>
            <span className="text-muted-foreground text-sm">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border px-3 py-1 disabled:opacity-50"
            >
              {isRTL ? '←' : '→'}
            </button>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.addNewUser}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.name} *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.email} *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-background w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.password} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUser.password}
                    onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className={`bg-background w-full rounded-lg border py-2 ${isRTL ? 'pl-10 pr-3' : 'pl-3 pr-10'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`text-muted-foreground absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.role}
                </label>
                <select
                  value={newUser.role}
                  onChange={e =>
                    setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))
                  }
                  className="bg-background w-full rounded-lg border px-3 py-2"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {locale === 'ar' ? role.labelAr : role.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendInvite"
                  checked={newUser.sendInvite}
                  onChange={e => setNewUser(prev => ({ ...prev, sendInvite: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="sendInvite" className="text-muted-foreground text-sm">
                  {t.sendInvite}
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="hover:bg-muted rounded-lg border px-4 py-2"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddUser}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
              >
                {t.add}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.editUser}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="bg-background w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="bg-background w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.role}
                </label>
                <select
                  value={editingUser.role}
                  onChange={e =>
                    setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                  }
                  className="bg-background w-full rounded-lg border px-3 py-2"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {locale === 'ar' ? role.labelAr : role.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.status}
                </label>
                <select
                  value={editingUser.isActive ? 'active' : 'inactive'}
                  onChange={e =>
                    setEditingUser({ ...editingUser, isActive: e.target.value === 'active' })
                  }
                  className="bg-background w-full rounded-lg border px-3 py-2"
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="hover:bg-muted rounded-lg border px-4 py-2"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleEditUser}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">
              {t.resetPasswordFor} {editingUser.name}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.newPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className={`bg-background w-full rounded-lg border py-2 ${isRTL ? 'pl-10 pr-3' : 'pl-3 pr-10'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`text-muted-foreground absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  {t.confirmPassword}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="bg-background w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setEditingUser(null);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="hover:bg-muted rounded-lg border px-4 py-2"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleResetPassword}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
