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

// Blog
export type {
  BlogSEO,
  BlogCategory,
  BlogAuthor,
  BlogPost,
  BlogPostsFilters,
  BlogPostsPagination,
  BlogPostsResponse,
} from './blog.service';
export {
  getBlogPosts,
  getBlogPostBySlug,
  getFeaturedBlogPosts,
  getRelatedPosts,
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogTags,
  blogService,
} from './blog.service';

// Careers
export type {
  SalaryRange,
  JobType,
  ExperienceLevel,
  JobStatus,
  Job,
  JobsFilters,
  JobsPagination,
  JobsResponse,
  JobApplication,
  Department as CareersDepartment,
} from './careers.service';
export {
  getJobs,
  getJobBySlug,
  getFeaturedJobs,
  submitApplication,
  careersService,
  getDepartments as getCareersDepartments,
} from './careers.service';
