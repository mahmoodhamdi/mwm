/**
 * Users Admin Service
 * خدمة إدارة المستخدمين
 */

import { api, extractData } from '@/lib/api';
import { UserRole } from '@mwm/shared';

// Re-export type from shared
export type { UserRole };

// Types
export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  loginAttempts: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersFilters {
  page?: number;
  limit?: number;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  search?: string;
  sort?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  locked: number;
  pending: number;
  byRole: Record<UserRole, number>;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  sendInvite?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface BulkActionData {
  ids: string[];
  action: 'activate' | 'deactivate' | 'unlock' | 'delete';
}

// Admin Service Functions

/**
 * Get all users (admin)
 */
export async function getAllUsers(filters: UsersFilters = {}): Promise<UsersResponse> {
  const response = await api.get('/users', { params: filters });
  return extractData<UsersResponse>(response);
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return extractData<{ user: User }>(response).user;
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<UserStats> {
  const response = await api.get('/users/stats');
  return extractData<UserStats>(response);
}

/**
 * Create user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const response = await api.post('/users', data);
  return extractData<{ user: User }>(response).user;
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  const response = await api.put(`/users/${id}`, data);
  return extractData<{ user: User }>(response).user;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

/**
 * Reset user password
 */
export async function resetUserPassword(id: string, password: string): Promise<void> {
  await api.put(`/users/${id}/password`, { password });
}

/**
 * Toggle user status
 */
export async function toggleUserStatus(id: string): Promise<User> {
  const response = await api.put(`/users/${id}/status`);
  return extractData<{ user: User }>(response).user;
}

/**
 * Unlock user account
 */
export async function unlockUser(id: string): Promise<void> {
  await api.put(`/users/${id}/unlock`);
}

/**
 * Bulk action on users
 */
export async function bulkAction(data: BulkActionData): Promise<{ affected: number }> {
  const response = await api.post('/users/bulk', data);
  return extractData<{ affected: number }>(response);
}

// Service object
export const usersAdminService = {
  getAllUsers,
  getUserById,
  getUserStats,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus,
  unlockUser,
  bulkAction,
};

export default usersAdminService;
