/**
 * Public Services Tests
 * اختبارات الخدمات العامة
 */

// Define mock functions
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

// Mock the API client before imports
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  },
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  extractData: jest.fn(
    (response: { data?: { data?: unknown } }) => response?.data?.data || response?.data
  ),
}));

// Import services after mocking
import {
  getServices,
  getServiceBySlug,
  getFeaturedServices,
  getServiceCategories,
  getServicesByCategory,
  searchServices,
} from '../public/services.service';

import {
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectCategories,
  getProjectsByCategory,
  searchProjects,
} from '../public/projects.service';

import {
  getTeamMembers,
  getTeamMemberBySlug,
  getFeaturedTeamMembers,
  getDepartments,
  getTeamMembersByDepartment,
} from '../public/team.service';

import {
  submitContactForm,
  subscribeNewsletter,
  unsubscribeNewsletter,
} from '../public/contact.service';

describe('Public Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Services Service', () => {
    describe('getServices', () => {
      it('should fetch services with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            services: [{ _id: '1', title: { ar: 'خدمة', en: 'Service' } }],
            total: 1,
          },
        };
        mockGet.mockResolvedValue(mockResponse);

        const result = await getServices();

        expect(mockGet).toHaveBeenCalledWith('/services', { isActive: true });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch services with custom filters', async () => {
        const mockResponse = { success: true, data: { services: [], total: 0 } };
        mockGet.mockResolvedValue(mockResponse);

        await getServices({
          page: 2,
          limit: 10,
          category: 'web',
          featured: true,
        });

        expect(mockGet).toHaveBeenCalledWith('/services', {
          page: 2,
          limit: 10,
          category: 'web',
          featured: true,
          isActive: true,
        });
      });
    });

    describe('getServiceBySlug', () => {
      it('should fetch service by slug', async () => {
        const mockService = { _id: '123', title: { ar: 'خدمة', en: 'Service' } };
        mockGet.mockResolvedValue({
          success: true,
          data: { service: mockService },
        });

        const result = await getServiceBySlug('web-development');

        expect(mockGet).toHaveBeenCalledWith('/services/web-development');
        expect(result).toEqual(mockService);
      });

      it('should return null when service not found', async () => {
        mockGet.mockRejectedValue(new Error('Not found'));

        const result = await getServiceBySlug('non-existent');

        expect(result).toBeNull();
      });

      it('should return null when data is empty', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getServiceBySlug('test');

        expect(result).toBeNull();
      });
    });

    describe('getFeaturedServices', () => {
      it('should fetch featured services with default limit', async () => {
        const mockServices = [
          { _id: '1', title: { ar: 'خدمة', en: 'Service' } },
          { _id: '2', title: { ar: 'خدمة 2', en: 'Service 2' } },
        ];
        mockGet.mockResolvedValue({
          success: true,
          data: { services: mockServices },
        });

        const result = await getFeaturedServices();

        expect(mockGet).toHaveBeenCalledWith('/services/featured', { limit: 6 });
        expect(result).toEqual(mockServices);
      });

      it('should fetch featured services with custom limit', async () => {
        mockGet.mockResolvedValue({ success: true, data: { services: [] } });

        await getFeaturedServices(3);

        expect(mockGet).toHaveBeenCalledWith('/services/featured', { limit: 3 });
      });

      it('should return empty array when data is empty', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getFeaturedServices();

        expect(result).toEqual([]);
      });
    });

    describe('getServiceCategories', () => {
      it('should fetch service categories', async () => {
        const mockCategories = [
          { _id: '1', name: { ar: 'تطوير', en: 'Development' }, slug: 'development' },
        ];
        mockGet.mockResolvedValue({
          success: true,
          data: { categories: mockCategories },
        });

        const result = await getServiceCategories();

        expect(mockGet).toHaveBeenCalledWith('/services/categories');
        expect(result).toEqual(mockCategories);
      });

      it('should return empty array when no categories', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getServiceCategories();

        expect(result).toEqual([]);
      });
    });

    describe('getServicesByCategory', () => {
      it('should fetch services by category', async () => {
        const mockServices = [{ _id: '1', title: { ar: 'خدمة', en: 'Service' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { services: mockServices },
        });

        const result = await getServicesByCategory('web');

        expect(mockGet).toHaveBeenCalledWith('/services/categories/web/services');
        expect(result).toEqual(mockServices);
      });

      it('should return empty array when no services in category', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getServicesByCategory('empty');

        expect(result).toEqual([]);
      });
    });

    describe('searchServices', () => {
      it('should search services', async () => {
        const mockServices = [{ _id: '1', title: { ar: 'خدمة', en: 'Service' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { services: mockServices },
        });

        const result = await searchServices('web');

        expect(mockGet).toHaveBeenCalledWith('/services/search', { q: 'web' });
        expect(result).toEqual(mockServices);
      });

      it('should return empty array when no results', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await searchServices('nonexistent');

        expect(result).toEqual([]);
      });
    });
  });

  describe('Projects Service', () => {
    describe('getProjects', () => {
      it('should fetch projects with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            projects: [{ _id: '1', title: { ar: 'مشروع', en: 'Project' } }],
            total: 1,
          },
        };
        mockGet.mockResolvedValue(mockResponse);

        const result = await getProjects();

        expect(mockGet).toHaveBeenCalledWith('/projects', { isActive: true });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch projects with custom filters', async () => {
        const mockResponse = { success: true, data: { projects: [], total: 0 } };
        mockGet.mockResolvedValue(mockResponse);

        await getProjects({
          page: 2,
          limit: 10,
          category: 'mobile',
          featured: true,
          search: 'app',
        });

        expect(mockGet).toHaveBeenCalledWith('/projects', {
          page: 2,
          limit: 10,
          category: 'mobile',
          featured: true,
          search: 'app',
          isActive: true,
        });
      });
    });

    describe('getProjectBySlug', () => {
      it('should fetch project by slug', async () => {
        const mockProject = { _id: '123', title: { ar: 'مشروع', en: 'Project' } };
        mockGet.mockResolvedValue({
          success: true,
          data: { project: mockProject },
        });

        const result = await getProjectBySlug('my-project');

        expect(mockGet).toHaveBeenCalledWith('/projects/my-project');
        expect(result).toEqual(mockProject);
      });

      it('should return null when project not found', async () => {
        mockGet.mockRejectedValue(new Error('Not found'));

        const result = await getProjectBySlug('non-existent');

        expect(result).toBeNull();
      });

      it('should return null when data is empty', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getProjectBySlug('test');

        expect(result).toBeNull();
      });
    });

    describe('getFeaturedProjects', () => {
      it('should fetch featured projects with default limit', async () => {
        const mockProjects = [{ _id: '1', title: { ar: 'مشروع', en: 'Project' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { projects: mockProjects },
        });

        const result = await getFeaturedProjects();

        expect(mockGet).toHaveBeenCalledWith('/projects/featured', { limit: 6 });
        expect(result).toEqual(mockProjects);
      });

      it('should fetch featured projects with custom limit', async () => {
        mockGet.mockResolvedValue({ success: true, data: { projects: [] } });

        await getFeaturedProjects(4);

        expect(mockGet).toHaveBeenCalledWith('/projects/featured', { limit: 4 });
      });

      it('should return empty array when data is empty', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getFeaturedProjects();

        expect(result).toEqual([]);
      });
    });

    describe('getProjectCategories', () => {
      it('should fetch project categories', async () => {
        const mockCategories = [{ _id: '1', name: { ar: 'ويب', en: 'Web' }, slug: 'web' }];
        mockGet.mockResolvedValue({
          success: true,
          data: { categories: mockCategories },
        });

        const result = await getProjectCategories();

        expect(mockGet).toHaveBeenCalledWith('/projects/categories');
        expect(result).toEqual(mockCategories);
      });

      it('should return empty array when no categories', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getProjectCategories();

        expect(result).toEqual([]);
      });
    });

    describe('getProjectsByCategory', () => {
      it('should fetch projects by category', async () => {
        const mockProjects = [{ _id: '1', title: { ar: 'مشروع', en: 'Project' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { projects: mockProjects },
        });

        const result = await getProjectsByCategory('web');

        expect(mockGet).toHaveBeenCalledWith('/projects/categories/web/projects');
        expect(result).toEqual(mockProjects);
      });

      it('should return empty array when no projects in category', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getProjectsByCategory('empty');

        expect(result).toEqual([]);
      });
    });

    describe('searchProjects', () => {
      it('should search projects', async () => {
        const mockProjects = [{ _id: '1', title: { ar: 'مشروع', en: 'Project' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { projects: mockProjects },
        });

        const result = await searchProjects('app');

        expect(mockGet).toHaveBeenCalledWith('/projects/search', { q: 'app' });
        expect(result).toEqual(mockProjects);
      });

      it('should return empty array when no results', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await searchProjects('nonexistent');

        expect(result).toEqual([]);
      });
    });
  });

  describe('Team Service', () => {
    describe('getTeamMembers', () => {
      it('should fetch team members with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            members: [{ _id: '1', name: { ar: 'أحمد', en: 'Ahmed' } }],
            total: 1,
          },
        };
        mockGet.mockResolvedValue(mockResponse);

        const result = await getTeamMembers();

        expect(mockGet).toHaveBeenCalledWith('/team', { isActive: true });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch team members with custom filters', async () => {
        const mockResponse = { success: true, data: { members: [], total: 0 } };
        mockGet.mockResolvedValue(mockResponse);

        await getTeamMembers({
          page: 2,
          limit: 10,
          department: 'engineering',
          featured: true,
        });

        expect(mockGet).toHaveBeenCalledWith('/team', {
          page: 2,
          limit: 10,
          department: 'engineering',
          featured: true,
          isActive: true,
        });
      });
    });

    describe('getTeamMemberBySlug', () => {
      it('should fetch team member by slug', async () => {
        const mockMember = { _id: '123', name: { ar: 'أحمد', en: 'Ahmed' } };
        mockGet.mockResolvedValue({
          success: true,
          data: { member: mockMember },
        });

        const result = await getTeamMemberBySlug('ahmed');

        expect(mockGet).toHaveBeenCalledWith('/team/ahmed');
        expect(result).toEqual(mockMember);
      });

      it('should return null when member not found', async () => {
        mockGet.mockRejectedValue(new Error('Not found'));

        const result = await getTeamMemberBySlug('non-existent');

        expect(result).toBeNull();
      });

      it('should return null when data is empty', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getTeamMemberBySlug('test');

        expect(result).toBeNull();
      });
    });

    describe('getFeaturedTeamMembers', () => {
      it('should fetch featured team members with default limit', async () => {
        const mockMembers = [{ _id: '1', name: { ar: 'أحمد', en: 'Ahmed' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { members: mockMembers },
        });

        const result = await getFeaturedTeamMembers();

        expect(mockGet).toHaveBeenCalledWith('/team/featured', { limit: 4 });
        expect(result).toEqual(mockMembers);
      });

      it('should fetch featured team members with custom limit', async () => {
        mockGet.mockResolvedValue({ success: true, data: { members: [] } });

        await getFeaturedTeamMembers(8);

        expect(mockGet).toHaveBeenCalledWith('/team/featured', { limit: 8 });
      });

      it('should return empty array when data is empty', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getFeaturedTeamMembers();

        expect(result).toEqual([]);
      });
    });

    describe('getDepartments', () => {
      it('should fetch departments', async () => {
        const mockDepartments = [
          { _id: '1', name: { ar: 'الهندسة', en: 'Engineering' }, slug: 'engineering' },
        ];
        mockGet.mockResolvedValue({
          success: true,
          data: { departments: mockDepartments },
        });

        const result = await getDepartments();

        expect(mockGet).toHaveBeenCalledWith('/team/departments');
        expect(result).toEqual(mockDepartments);
      });

      it('should return empty array when no departments', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getDepartments();

        expect(result).toEqual([]);
      });
    });

    describe('getTeamMembersByDepartment', () => {
      it('should fetch team members by department', async () => {
        const mockMembers = [{ _id: '1', name: { ar: 'أحمد', en: 'Ahmed' } }];
        mockGet.mockResolvedValue({
          success: true,
          data: { members: mockMembers },
        });

        const result = await getTeamMembersByDepartment('engineering');

        expect(mockGet).toHaveBeenCalledWith('/team/departments/engineering/members');
        expect(result).toEqual(mockMembers);
      });

      it('should return empty array when no members in department', async () => {
        mockGet.mockResolvedValue({ success: true, data: null });

        const result = await getTeamMembersByDepartment('empty');

        expect(result).toEqual([]);
      });
    });
  });

  describe('Contact Service', () => {
    describe('submitContactForm', () => {
      it('should submit contact form successfully', async () => {
        const formData = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Inquiry',
          message: 'Hello, I have a question.',
        };
        mockPost.mockResolvedValue({
          success: true,
          message: 'Message sent successfully',
          data: { ticketNumber: 'TICKET-123' },
        });

        const result = await submitContactForm(formData);

        expect(mockPost).toHaveBeenCalledWith('/contact', formData);
        expect(result).toEqual({
          success: true,
          message: 'Message sent successfully',
          ticketNumber: 'TICKET-123',
        });
      });

      it('should handle form submission with all fields', async () => {
        const formData = {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'ACME Inc',
          website: 'https://example.com',
          subject: 'Project Inquiry',
          message: 'I need a website.',
          service: 'web-development',
          budget: 'under_5k' as const,
          preferredContact: 'email' as const,
          recaptchaToken: 'test-token',
        };
        mockPost.mockResolvedValue({
          success: true,
          message: 'Sent',
          data: {},
        });

        const result = await submitContactForm(formData);

        expect(mockPost).toHaveBeenCalledWith('/contact', formData);
        expect(result.success).toBe(true);
      });

      it('should use default message when not provided', async () => {
        const formData = {
          name: 'John',
          email: 'john@example.com',
          subject: 'Test',
          message: 'Test message',
        };
        mockPost.mockResolvedValue({
          success: true,
          data: {},
        });

        const result = await submitContactForm(formData);

        expect(result.message).toBe('Message sent successfully');
      });
    });

    describe('subscribeNewsletter', () => {
      it('should subscribe to newsletter successfully', async () => {
        const data = { email: 'john@example.com', name: 'John', locale: 'en' as const };
        mockPost.mockResolvedValue({
          success: true,
          message: 'Subscribed successfully',
        });

        const result = await subscribeNewsletter(data);

        expect(mockPost).toHaveBeenCalledWith('/newsletter/subscribe', data);
        expect(result).toEqual({
          success: true,
          message: 'Subscribed successfully',
        });
      });

      it('should use default message when not provided', async () => {
        const data = { email: 'john@example.com' };
        mockPost.mockResolvedValue({
          success: true,
        });

        const result = await subscribeNewsletter(data);

        expect(result.message).toBe('Subscribed successfully');
      });
    });

    describe('unsubscribeNewsletter', () => {
      it('should unsubscribe from newsletter successfully', async () => {
        mockPost.mockResolvedValue({
          success: true,
          message: 'Unsubscribed successfully',
        });

        const result = await unsubscribeNewsletter('john@example.com', 'token123');

        expect(mockPost).toHaveBeenCalledWith('/newsletter/unsubscribe', {
          email: 'john@example.com',
          token: 'token123',
        });
        expect(result).toEqual({
          success: true,
          message: 'Unsubscribed successfully',
        });
      });

      it('should use default message when not provided', async () => {
        mockPost.mockResolvedValue({
          success: true,
        });

        const result = await unsubscribeNewsletter('john@example.com', 'token');

        expect(result.message).toBe('Unsubscribed successfully');
      });
    });
  });
});
