/**
 * Public Services Index
 * فهرس الخدمات العامة
 */

// Shared types
export type { BilingualText, PaginationMeta } from './types';

// Services - export specific types and functions to avoid conflicts
export type {
  ServiceCategory,
  ServiceFeature,
  ServicePricingPlan,
  ServiceFAQ,
  ServiceProcessStep,
  Service,
  ServicesFilters,
  ServicesResponse,
} from './services.service';
export {
  getServices,
  getServiceBySlug,
  getFeaturedServices,
  getServiceCategories,
  getServicesByCategory,
  searchServices,
  servicesService,
} from './services.service';

// Projects
export type {
  ProjectTechnology,
  ProjectTestimonial,
  ProjectCategory,
  Project,
  ProjectsFilters,
  ProjectsResponse,
} from './projects.service';
export {
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectCategories,
  getProjectsByCategory,
  searchProjects,
  projectsService,
} from './projects.service';

// Team
export type {
  SocialLinks,
  Skill,
  Department,
  TeamMember,
  TeamFilters,
  TeamResponse,
} from './team.service';
export {
  getTeamMembers,
  getTeamMemberBySlug,
  getFeaturedTeamMembers,
  getDepartments,
  getTeamMembersByDepartment,
  teamService,
} from './team.service';

// Contact
export type {
  ContactFormData,
  ContactResponse,
  NewsletterData,
  NewsletterResponse,
} from './contact.service';
export {
  submitContactForm,
  subscribeNewsletter,
  unsubscribeNewsletter,
  contactService,
} from './contact.service';
