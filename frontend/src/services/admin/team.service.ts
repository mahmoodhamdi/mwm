/**
 * Team Admin Service
 * خدمة إدارة الفريق
 */

import { api, extractData } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export interface TeamMemberSkill {
  name: BilingualText;
  level: number; // 1-100
  category?: string;
}

export interface TeamMemberSocial {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  email?: string;
}

export interface TeamMemberEducation {
  degree: BilingualText;
  institution: BilingualText;
  year: number;
}

export interface TeamMemberCertification {
  name: BilingualText;
  issuer: BilingualText;
  year: number;
  url?: string;
}

export interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  name: BilingualText;
  slug: string;
  position: BilingualText;
  bio: BilingualText;
  shortBio?: BilingualText;
  department: Department | string;
  avatar?: string;
  coverImage?: string;
  skills: TeamMemberSkill[];
  social?: TeamMemberSocial;
  experience?: number;
  education?: TeamMemberEducation;
  certifications?: TeamMemberCertification[];
  projects?: string[];
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
  };
  isLeader: boolean;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamFilters {
  page?: number;
  limit?: number;
  department?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isLeader?: boolean;
  search?: string;
  sort?: string;
}

export interface TeamResponse {
  members: TeamMember[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DepartmentsResponse {
  departments: Department[];
  total: number;
}

export interface CreateTeamMemberData {
  name: BilingualText;
  position: BilingualText;
  bio: BilingualText;
  shortBio?: BilingualText;
  department: string;
  avatar?: string;
  coverImage?: string;
  skills?: TeamMemberSkill[];
  social?: TeamMemberSocial;
  experience?: number;
  education?: TeamMemberEducation;
  certifications?: TeamMemberCertification[];
  projects?: string[];
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
  };
  isLeader?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  order?: number;
  joinedAt?: string;
}

export interface UpdateTeamMemberData extends Partial<CreateTeamMemberData> {}

export interface CreateDepartmentData {
  name: BilingualText;
  description?: BilingualText;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {}

// Admin Service Functions

/**
 * Get all team members (admin)
 */
export async function getAllMembers(filters: TeamFilters = {}): Promise<TeamResponse> {
  const response = await api.get('/team/admin', { params: filters });
  return extractData<TeamResponse>(response);
}

/**
 * Get team member by ID (admin)
 */
export async function getMemberById(id: string): Promise<TeamMember> {
  const response = await api.get(`/team/admin/${id}`);
  return extractData<{ member: TeamMember }>(response).member;
}

/**
 * Create team member
 */
export async function createMember(data: CreateTeamMemberData): Promise<TeamMember> {
  const response = await api.post('/team/admin', data);
  return extractData<{ member: TeamMember }>(response).member;
}

/**
 * Update team member
 */
export async function updateMember(id: string, data: UpdateTeamMemberData): Promise<TeamMember> {
  const response = await api.put(`/team/admin/${id}`, data);
  return extractData<{ member: TeamMember }>(response).member;
}

/**
 * Delete team member
 */
export async function deleteMember(id: string): Promise<void> {
  await api.delete(`/team/admin/${id}`);
}

/**
 * Reorder team members
 */
export async function reorderMembers(
  orderedIds: Array<{ id: string; order: number }>
): Promise<void> {
  await api.put('/team/admin/reorder', { members: orderedIds });
}

/**
 * Toggle active status
 */
export async function toggleActiveStatus(id: string): Promise<TeamMember> {
  const response = await api.put(`/team/admin/${id}/active`);
  return extractData<{ member: TeamMember }>(response).member;
}

/**
 * Toggle featured status
 */
export async function toggleFeaturedStatus(id: string): Promise<TeamMember> {
  const response = await api.put(`/team/admin/${id}/featured`);
  return extractData<{ member: TeamMember }>(response).member;
}

/**
 * Toggle leader status
 */
export async function toggleLeaderStatus(id: string): Promise<TeamMember> {
  const response = await api.put(`/team/admin/${id}/leader`);
  return extractData<{ member: TeamMember }>(response).member;
}

/**
 * Get all departments (admin)
 */
export async function getAllDepartments(): Promise<DepartmentsResponse> {
  const response = await api.get('/team/admin/departments');
  return extractData<DepartmentsResponse>(response);
}

/**
 * Create department
 */
export async function createDepartment(data: CreateDepartmentData): Promise<Department> {
  const response = await api.post('/team/admin/departments', data);
  return extractData<{ department: Department }>(response).department;
}

/**
 * Update department
 */
export async function updateDepartment(
  id: string,
  data: UpdateDepartmentData
): Promise<Department> {
  const response = await api.put(`/team/admin/departments/${id}`, data);
  return extractData<{ department: Department }>(response).department;
}

/**
 * Delete department
 */
export async function deleteDepartment(id: string): Promise<void> {
  await api.delete(`/team/admin/departments/${id}`);
}

// Service object
export const teamAdminService = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  reorderMembers,
  toggleActiveStatus,
  toggleFeaturedStatus,
  toggleLeaderStatus,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default teamAdminService;
