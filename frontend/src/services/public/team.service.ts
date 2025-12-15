/**
 * Team API Service
 * خدمة واجهة برمجة الفريق
 */

import { apiClient, ApiResponse } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

export interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface Skill {
  name: BilingualText;
  level: number; // 0-100
}

export interface TeamMember {
  _id: string;
  name: BilingualText;
  slug: string;
  position: BilingualText;
  department: Department | string;
  bio: BilingualText;
  avatar: string;
  coverImage?: string;
  email?: string;
  phone?: string;
  socialLinks?: SocialLinks;
  skills?: Skill[];
  achievements?: BilingualText[];
  education?: Array<{
    degree: BilingualText;
    institution: BilingualText;
    year?: string;
  }>;
  experience?: Array<{
    title: BilingualText;
    company: BilingualText;
    period?: string;
  }>;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamFilters {
  page?: number;
  limit?: number;
  department?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
}

export interface TeamResponse {
  members: TeamMember[];
  total: number;
}

// API endpoints
const TEAM_ENDPOINT = '/team';
const DEPARTMENTS_ENDPOINT = '/team/departments';

/**
 * Get all active team members
 */
export async function getTeamMembers(
  filters: TeamFilters = {}
): Promise<ApiResponse<TeamResponse>> {
  const response = await apiClient.get<TeamResponse>(TEAM_ENDPOINT, {
    ...filters,
    isActive: true,
  });
  return response;
}

/**
 * Get team member by slug
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const response = await apiClient.get<{ member: TeamMember }>(`${TEAM_ENDPOINT}/${slug}`);
    return response.data?.member || null;
  } catch {
    return null;
  }
}

/**
 * Get featured team members
 */
export async function getFeaturedTeamMembers(limit = 4): Promise<TeamMember[]> {
  const response = await apiClient.get<{ members: TeamMember[] }>(`${TEAM_ENDPOINT}/featured`, {
    limit,
  });
  return response.data?.members || [];
}

/**
 * Get departments
 */
export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<{ departments: Department[] }>(DEPARTMENTS_ENDPOINT);
  return response.data?.departments || [];
}

/**
 * Get team members by department
 */
export async function getTeamMembersByDepartment(departmentSlug: string): Promise<TeamMember[]> {
  const response = await apiClient.get<{ members: TeamMember[] }>(
    `${DEPARTMENTS_ENDPOINT}/${departmentSlug}/members`
  );
  return response.data?.members || [];
}

export const teamService = {
  getTeamMembers,
  getTeamMemberBySlug,
  getFeaturedTeamMembers,
  getDepartments,
  getTeamMembersByDepartment,
};

export default teamService;
