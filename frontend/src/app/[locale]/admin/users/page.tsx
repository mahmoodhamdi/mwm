'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

type UserRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer';
type UserStatus = 'active' | 'inactive' | 'locked' | 'pending';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  loginAttempts: number;
}

export default function UsersPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Mock data
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@mwm.com',
      role: 'super_admin',
      status: 'active',
      isEmailVerified: true,
      twoFactorEnabled: true,
      lastLogin: '2024-01-22T10:30:00',
      createdAt: '2023-06-15',
      loginAttempts: 0,
    },
    {
      id: '2',
      name: 'Sarah Ahmed',
      email: 'sarah@mwm.com',
      role: 'admin',
      status: 'active',
      isEmailVerified: true,
      twoFactorEnabled: false,
      lastLogin: '2024-01-21T15:45:00',
      createdAt: '2023-08-20',
      loginAttempts: 0,
    },
    {
      id: '3',
      name: 'Mohamed Ali',
      email: 'mohamed@mwm.com',
      role: 'editor',
      status: 'active',
      isEmailVerified: true,
      twoFactorEnabled: false,
      lastLogin: '2024-01-20T09:00:00',
      createdAt: '2023-09-10',
      loginAttempts: 0,
    },
    {
      id: '4',
      name: 'Fatima Omar',
      email: 'fatima@mwm.com',
      role: 'author',
      status: 'pending',
      isEmailVerified: false,
      twoFactorEnabled: false,
      createdAt: '2024-01-15',
      loginAttempts: 0,
    },
    {
      id: '5',
      name: 'Youssef Khaled',
      email: 'youssef@mwm.com',
      role: 'viewer',
      status: 'locked',
      isEmailVerified: true,
      twoFactorEnabled: false,
      lastLogin: '2024-01-10T14:20:00',
      createdAt: '2023-11-05',
      loginAttempts: 5,
    },
    {
      id: '6',
      name: 'Nour Hassan',
      email: 'nour@mwm.com',
      role: 'editor',
      status: 'inactive',
      isEmailVerified: true,
      twoFactorEnabled: false,
      lastLogin: '2023-12-15T11:00:00',
      createdAt: '2023-07-22',
      loginAttempts: 0,
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as UserRole,
    sendInvite: true,
  });

  const roles: { value: UserRole; labelAr: string; labelEn: string; color: string }[] = [
    {
      value: 'super_admin',
      labelAr: 'مدير عام',
      labelEn: 'Super Admin',
      color: 'bg-purple-100 text-purple-800',
    },
    { value: 'admin', labelAr: 'مدير', labelEn: 'Admin', color: 'bg-blue-100 text-blue-800' },
    { value: 'editor', labelAr: 'محرر', labelEn: 'Editor', color: 'bg-green-100 text-green-800' },
    { value: 'author', labelAr: 'كاتب', labelEn: 'Author', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'viewer', labelAr: 'مشاهد', labelEn: 'Viewer', color: 'bg-gray-100 text-gray-800' },
  ];

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    locked: users.filter(u => u.status === 'locked').length,
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleInfo = (role: UserRole) => roles.find(r => r.value === role);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'locked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => (prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]));
  };

  const handleAddUser = () => {
    console.log('Adding user:', newUser);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', password: '', role: 'viewer', sendInvite: true });
  };

  const handleEditUser = () => {
    console.log('Editing user:', editingUser);
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleResetPassword = () => {
    console.log('Resetting password for:', editingUser);
    setShowPasswordModal(false);
    setEditingUser(null);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete' | 'unlock') => {
    console.log(`${action} users:`, selectedUsers);
    setSelectedUsers([]);
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
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <UserCog className="size-7" />
            {t.title}
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <UserPlus className="size-4" />
          {t.addUser}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.totalUsers}</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.activeUsers}</p>
              <p className="text-xl font-bold">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.pendingUsers}</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Lock className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.lockedUsers}</p>
              <p className="text-xl font-bold">{stats.locked}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg bg-white shadow">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between gap-4 border-b p-4">
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
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="rounded-lg border px-3 py-2"
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
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border px-3 py-2"
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
          <div className="flex items-center justify-between border-b bg-blue-50 p-3">
            <span className="text-blue-700">
              {selectedUsers.length} {t.selected}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="flex items-center gap-1 rounded px-3 py-1 text-green-600 hover:text-green-800"
              >
                <CheckCircle className="size-4" />
                {t.activate}
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="flex items-center gap-1 rounded px-3 py-1 text-gray-600 hover:text-gray-800"
              >
                <XCircle className="size-4" />
                {t.deactivate}
              </button>
              <button
                onClick={() => handleBulkAction('unlock')}
                className="flex items-center gap-1 rounded px-3 py-1 text-yellow-600 hover:text-yellow-800"
              >
                <Unlock className="size-4" />
                {t.unlock}
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-1 rounded px-3 py-1 text-red-600 hover:text-red-800"
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
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-start">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-start font-medium text-gray-600">{t.name}</th>
                <th className="p-3 text-start font-medium text-gray-600">{t.email}</th>
                <th className="p-3 text-start font-medium text-gray-600">{t.role}</th>
                <th className="p-3 text-start font-medium text-gray-600">{t.status}</th>
                <th className="p-3 text-start font-medium text-gray-600">{t.lastLogin}</th>
                <th className="p-3 text-start font-medium text-gray-600">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map(user => {
                const roleInfo = getRoleInfo(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {user.isEmailVerified ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="size-3" />
                                {t.verified}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-600">
                                <Clock className="size-3" />
                                {t.notVerified}
                              </span>
                            )}
                            {user.twoFactorEnabled && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Shield className="size-3" />
                                {t.twoFactorEnabled}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-gray-600">
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
                    <td className="p-3 text-sm text-gray-600">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {formatDateTime(user.lastLogin)}
                        </div>
                      ) : (
                        <span className="text-gray-400">{t.never}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                          className="rounded-lg p-2 hover:bg-gray-100"
                          title={t.edit}
                        >
                          <Edit className="size-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowPasswordModal(true);
                          }}
                          className="rounded-lg p-2 hover:bg-gray-100"
                          title={t.resetPassword}
                        >
                          <Key className="size-4 text-gray-500" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-gray-100" title={t.viewActivity}>
                          <Activity className="size-4 text-gray-500" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-gray-100" title={t.delete}>
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">{t.noUsers}</div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.addNewUser}</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.name} *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.email} *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t.password} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUser.password}
                    onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full rounded-lg border py-2 ${isRTL ? 'pl-10 pr-3' : 'pl-3 pr-10'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.role}</label>
                <select
                  value={newUser.role}
                  onChange={e =>
                    setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))
                  }
                  className="w-full rounded-lg border px-3 py-2"
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
                <label htmlFor="sendInvite" className="text-sm text-gray-700">
                  {t.sendInvite}
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddUser}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">{t.editUser}</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.name}</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.email}</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.role}</label>
                <select
                  value={editingUser.role}
                  onChange={e =>
                    setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {locale === 'ar' ? role.labelAr : role.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t.status}</label>
                <select
                  value={editingUser.status}
                  onChange={e =>
                    setEditingUser({ ...editingUser, status: e.target.value as UserStatus })
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                  <option value="locked">{t.locked}</option>
                  <option value="pending">{t.pending}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleEditUser}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">
              {t.resetPasswordFor} {editingUser.name}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t.newPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full rounded-lg border py-2 ${isRTL ? 'pl-10 pr-3' : 'pl-3 pr-10'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t.confirmPassword}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setEditingUser(null);
                }}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleResetPassword}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
