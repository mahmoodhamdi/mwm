/**
 * Admin Careers Service Tests
 * اختبارات خدمة إدارة الوظائف
 */

import { apiClient } from '@/lib/api';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  bulkUpdateJobsStatus,
  getApplications,
  getApplicationById,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
  bulkUpdateApplicationsStatus,
  getApplicationStats,
} from '../admin/careers.service';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Admin Careers Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Jobs API', () => {
    describe('getJobs', () => {
      it('should fetch jobs with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            jobs: [{ _id: '1', title: { ar: 'مطور', en: 'Developer' }, slug: 'developer' }],
            total: 1,
            pagination: { page: 1, limit: 10, pages: 1 },
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getJobs();

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/jobs', {});
        expect(result).toEqual(mockResponse);
      });

      it('should fetch jobs with filters', async () => {
        const mockResponse = {
          success: true,
          data: { jobs: [], total: 0, pagination: { page: 1, limit: 10, pages: 0 } },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        await getJobs({ page: 2, limit: 20, status: 'open', type: 'full-time', search: 'test' });

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/jobs', {
          page: 2,
          limit: 20,
          status: 'open',
          type: 'full-time',
          search: 'test',
        });
      });

      it('should handle API errors', async () => {
        mockApiClient.get.mockRejectedValue(new Error('Network error'));

        await expect(getJobs()).rejects.toThrow('Network error');
      });
    });

    describe('getJobById', () => {
      it('should fetch job by ID', async () => {
        const mockResponse = {
          success: true,
          data: { job: { _id: '123', title: { ar: 'وظيفة', en: 'Job' } } },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getJobById('123');

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/jobs/123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('createJob', () => {
      it('should create a new job', async () => {
        const jobData = {
          title: { ar: 'وظيفة جديدة', en: 'New Job' },
          slug: 'new-job',
          description: { ar: 'وصف', en: 'Description' },
          location: { ar: 'القاهرة', en: 'Cairo' },
          department: 'dept-1',
          type: 'full-time' as const,
          experienceLevel: 'mid' as const,
          status: 'draft' as const,
        };
        const mockResponse = {
          success: true,
          data: { message: 'Job created', job: { _id: '123', ...jobData } },
        };
        mockApiClient.post.mockResolvedValue(mockResponse);

        const result = await createJob(jobData);

        expect(mockApiClient.post).toHaveBeenCalledWith('/careers/admin/jobs', jobData);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateJob', () => {
      it('should update an existing job', async () => {
        const updateData = { title: { ar: 'عنوان محدث', en: 'Updated Title' } };
        const mockResponse = {
          success: true,
          data: { message: 'Job updated', job: { _id: '123', ...updateData } },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await updateJob('123', updateData);

        expect(mockApiClient.put).toHaveBeenCalledWith('/careers/admin/jobs/123', updateData);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('deleteJob', () => {
      it('should delete a job', async () => {
        const mockResponse = { success: true, data: { message: 'Job deleted' } };
        mockApiClient.delete.mockResolvedValue(mockResponse);

        const result = await deleteJob('123');

        expect(mockApiClient.delete).toHaveBeenCalledWith('/careers/admin/jobs/123');
        expect(result).toEqual(mockResponse);
      });

      it('should handle deletion of job with applications', async () => {
        mockApiClient.delete.mockRejectedValue({
          response: { status: 400, data: { message: 'Cannot delete job with applications' } },
        });

        await expect(deleteJob('123')).rejects.toBeDefined();
      });
    });

    describe('bulkUpdateJobsStatus', () => {
      it('should bulk update jobs status', async () => {
        const bulkData = { ids: ['1', '2', '3'], status: 'open' as const };
        const mockResponse = {
          success: true,
          data: { message: '3 jobs updated', modifiedCount: 3 },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await bulkUpdateJobsStatus(bulkData);

        expect(mockApiClient.put).toHaveBeenCalledWith('/careers/admin/jobs/bulk-status', bulkData);
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Applications API', () => {
    describe('getApplications', () => {
      it('should fetch applications with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            applications: [
              { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            ],
            total: 1,
            pagination: { page: 1, limit: 10, pages: 1 },
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getApplications();

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/applications', {});
        expect(result).toEqual(mockResponse);
      });

      it('should fetch applications with filters', async () => {
        const mockResponse = { success: true, data: { applications: [], total: 0 } };
        mockApiClient.get.mockResolvedValue(mockResponse);

        await getApplications({ page: 2, limit: 20, status: 'shortlisted', job: 'job-1' });

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/applications', {
          page: 2,
          limit: 20,
          status: 'shortlisted',
          job: 'job-1',
        });
      });
    });

    describe('getApplicationById', () => {
      it('should fetch application by ID', async () => {
        const mockResponse = {
          success: true,
          data: { application: { _id: '123', firstName: 'John', lastName: 'Doe' } },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getApplicationById('123');

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/applications/123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getApplicationsByJob', () => {
      it('should fetch applications for a specific job', async () => {
        const mockResponse = {
          success: true,
          data: {
            applications: [{ _id: '1', firstName: 'John' }],
            total: 1,
            pagination: { page: 1, limit: 10, pages: 1 },
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getApplicationsByJob('job-123', { page: 1, limit: 10 });

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/jobs/job-123/applications', {
          page: 1,
          limit: 10,
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateApplication', () => {
      it('should update application status', async () => {
        const updateData = { status: 'shortlisted' as const, notes: 'Good candidate' };
        const mockResponse = {
          success: true,
          data: { message: 'Application updated', application: { _id: '123', ...updateData } },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await updateApplication('123', updateData);

        expect(mockApiClient.put).toHaveBeenCalledWith(
          '/careers/admin/applications/123',
          updateData
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('deleteApplication', () => {
      it('should delete an application', async () => {
        const mockResponse = { success: true, data: { message: 'Application deleted' } };
        mockApiClient.delete.mockResolvedValue(mockResponse);

        const result = await deleteApplication('123');

        expect(mockApiClient.delete).toHaveBeenCalledWith('/careers/admin/applications/123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('bulkUpdateApplicationsStatus', () => {
      it('should bulk update applications status', async () => {
        const bulkData = { ids: ['1', '2', '3'], status: 'rejected' as const };
        const mockResponse = {
          success: true,
          data: { message: '3 applications updated', modifiedCount: 3 },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await bulkUpdateApplicationsStatus(bulkData);

        expect(mockApiClient.put).toHaveBeenCalledWith(
          '/careers/admin/applications/bulk-status',
          bulkData
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getApplicationStats', () => {
      it('should fetch application stats for a job', async () => {
        const mockResponse = {
          success: true,
          data: {
            job: { _id: '123', title: { ar: 'وظيفة', en: 'Job' }, applicationsCount: 10 },
            stats: {
              total: 10,
              pending: 3,
              reviewing: 2,
              shortlisted: 2,
              interviewed: 1,
              offered: 1,
              hired: 1,
              rejected: 0,
              withdrawn: 0,
            },
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getApplicationStats('123');

        expect(mockApiClient.get).toHaveBeenCalledWith('/careers/admin/jobs/123/stats');
        expect(result).toEqual(mockResponse);
      });
    });
  });
});
