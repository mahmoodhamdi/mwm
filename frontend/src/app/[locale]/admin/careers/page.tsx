'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  X,
  Save,
  Mail,
  Phone,
  Star,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  bulkUpdateJobsStatus,
  getApplications,
  updateApplication,
  deleteApplication,
  bulkUpdateApplicationsStatus,
  type Job,
  type JobApplication,
  type JobStatus,
  type JobType,
  type ExperienceLevel,
  type ApplicationStatus,
  type CreateJobData,
  type UpdateJobData,
} from '@/services/admin/careers.service';

export default function CareersPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // State
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<ApplicationStatus | 'all'>(
    'all'
  );
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);

  // Data states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [applicationsTotalPages, setApplicationsTotalPages] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_applicationsTotal, setApplicationsTotal] = useState(0);
  const itemsPerPage = 10;

  // Job form state
  const [jobForm, setJobForm] = useState<{
    titleAr: string;
    titleEn: string;
    slug: string;
    descriptionAr: string;
    descriptionEn: string;
    locationAr: string;
    locationEn: string;
    department: string;
    type: JobType;
    experienceLevel: ExperienceLevel;
    status: JobStatus;
    applicationDeadline: string;
    isFeatured: boolean;
    skills: string;
    salaryMin: number;
    salaryMax: number;
    salaryCurrency: string;
    salaryPublic: boolean;
  }>({
    titleAr: '',
    titleEn: '',
    slug: '',
    descriptionAr: '',
    descriptionEn: '',
    locationAr: '',
    locationEn: '',
    department: '',
    type: 'full-time',
    experienceLevel: 'mid',
    status: 'draft',
    applicationDeadline: '',
    isFeatured: false,
    skills: '',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'EGP',
    salaryPublic: false,
  });

  // Status configs
  const jobStatusConfig: Record<JobStatus, { labelAr: string; labelEn: string; color: string }> = {
    draft: { labelAr: 'مسودة', labelEn: 'Draft', color: 'bg-gray-100 text-gray-800' },
    open: { labelAr: 'مفتوح', labelEn: 'Open', color: 'bg-green-100 text-green-800' },
    closed: { labelAr: 'مغلق', labelEn: 'Closed', color: 'bg-red-100 text-red-800' },
    filled: { labelAr: 'تم التعيين', labelEn: 'Filled', color: 'bg-blue-100 text-blue-800' },
  };

  const applicationStatusConfig: Record<
    ApplicationStatus,
    { labelAr: string; labelEn: string; color: string }
  > = {
    pending: { labelAr: 'معلق', labelEn: 'Pending', color: 'bg-gray-100 text-gray-800' },
    reviewing: {
      labelAr: 'قيد المراجعة',
      labelEn: 'Reviewing',
      color: 'bg-yellow-100 text-yellow-800',
    },
    shortlisted: {
      labelAr: 'قائمة قصيرة',
      labelEn: 'Shortlisted',
      color: 'bg-blue-100 text-blue-800',
    },
    interviewed: {
      labelAr: 'تمت المقابلة',
      labelEn: 'Interviewed',
      color: 'bg-purple-100 text-purple-800',
    },
    offered: { labelAr: 'تم العرض', labelEn: 'Offered', color: 'bg-indigo-100 text-indigo-800' },
    hired: { labelAr: 'تم التوظيف', labelEn: 'Hired', color: 'bg-green-100 text-green-800' },
    rejected: { labelAr: 'مرفوض', labelEn: 'Rejected', color: 'bg-red-100 text-red-800' },
    withdrawn: { labelAr: 'منسحب', labelEn: 'Withdrawn', color: 'bg-gray-100 text-gray-800' },
  };

  const jobTypeConfig: Record<JobType, { labelAr: string; labelEn: string }> = {
    'full-time': { labelAr: 'دوام كامل', labelEn: 'Full-time' },
    'part-time': { labelAr: 'دوام جزئي', labelEn: 'Part-time' },
    contract: { labelAr: 'تعاقد', labelEn: 'Contract' },
    internship: { labelAr: 'تدريب', labelEn: 'Internship' },
    remote: { labelAr: 'عن بعد', labelEn: 'Remote' },
  };

  const experienceLevelConfig: Record<ExperienceLevel, { labelAr: string; labelEn: string }> = {
    entry: { labelAr: 'مبتدئ', labelEn: 'Entry' },
    mid: { labelAr: 'متوسط', labelEn: 'Mid-Level' },
    senior: { labelAr: 'خبير', labelEn: 'Senior' },
    lead: { labelAr: 'قائد', labelEn: 'Lead' },
    executive: { labelAr: 'تنفيذي', labelEn: 'Executive' },
  };

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getJobs({
        page: jobsPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
      });

      if (response.success && response.data) {
        setJobs(response.data.jobs);
        setJobsTotalPages(response.data.pagination.pages);
        setJobsTotal(response.data.total);
      }
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحميل الوظائف' : 'Error loading jobs');
    } finally {
      setLoading(false);
    }
  }, [jobsPage, statusFilter, searchQuery, isRTL]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApplications({
        page: applicationsPage,
        limit: itemsPerPage,
        status: applicationStatusFilter !== 'all' ? applicationStatusFilter : undefined,
      });

      if (response.success && response.data) {
        setApplications(response.data.applications);
        setApplicationsTotalPages(response.data.pagination.pages);
        setApplicationsTotal(response.data.total);
      }
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحميل الطلبات' : 'Error loading applications');
    } finally {
      setLoading(false);
    }
  }, [applicationsPage, applicationStatusFilter, isRTL]);

  // Initial load
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else {
      fetchApplications();
    }
  }, [activeTab, fetchJobs, fetchApplications]);

  // Reset page on filter change
  useEffect(() => {
    setJobsPage(1);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    setApplicationsPage(1);
  }, [applicationStatusFilter]);

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle job form submit
  const handleSaveJob = async () => {
    setActionLoading(true);
    try {
      const jobData: CreateJobData | UpdateJobData = {
        title: { ar: jobForm.titleAr, en: jobForm.titleEn },
        slug: jobForm.slug || generateSlug(jobForm.titleEn),
        description: { ar: jobForm.descriptionAr, en: jobForm.descriptionEn },
        location: { ar: jobForm.locationAr, en: jobForm.locationEn },
        department: jobForm.department,
        type: jobForm.type,
        experienceLevel: jobForm.experienceLevel,
        status: jobForm.status,
        applicationDeadline: jobForm.applicationDeadline || undefined,
        isFeatured: jobForm.isFeatured,
        skills: jobForm.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        salaryRange:
          jobForm.salaryMin > 0
            ? {
                min: jobForm.salaryMin,
                max: jobForm.salaryMax,
                currency: jobForm.salaryCurrency,
                period: 'monthly',
                isPublic: jobForm.salaryPublic,
              }
            : undefined,
      };

      if (editingJob) {
        await updateJob(editingJob._id, jobData);
      } else {
        await createJob(jobData as CreateJobData);
      }

      setShowJobModal(false);
      setEditingJob(null);
      resetJobForm();
      fetchJobs();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء حفظ الوظيفة' : 'Error saving job');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle job delete
  const handleDeleteJob = async (id: string) => {
    if (
      !confirm(
        isRTL ? 'هل أنت متأكد من حذف هذه الوظيفة؟' : 'Are you sure you want to delete this job?'
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteJob(id);
      fetchJobs();
    } catch {
      setError(isRTL ? 'لا يمكن حذف وظيفة تحتوي على طلبات' : 'Cannot delete job with applications');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle bulk job status update
  const handleBulkJobStatusUpdate = async (status: JobStatus) => {
    if (selectedJobs.length === 0) return;

    setActionLoading(true);
    try {
      await bulkUpdateJobsStatus({ ids: selectedJobs, status });
      setSelectedJobs([]);
      fetchJobs();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحديث الوظائف' : 'Error updating jobs');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle application status update
  const handleUpdateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    setActionLoading(true);
    try {
      await updateApplication(id, { status });
      fetchApplications();
      if (viewingApplication && viewingApplication._id === id) {
        setViewingApplication({ ...viewingApplication, status });
      }
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحديث الطلب' : 'Error updating application');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle application delete
  const handleDeleteApplication = async (id: string) => {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذا الطلب؟'
          : 'Are you sure you want to delete this application?'
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteApplication(id);
      setShowApplicationModal(false);
      setViewingApplication(null);
      fetchApplications();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء حذف الطلب' : 'Error deleting application');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle bulk application status update
  const handleBulkApplicationStatusUpdate = async (status: ApplicationStatus) => {
    if (selectedApplications.length === 0) return;

    setActionLoading(true);
    try {
      await bulkUpdateApplicationsStatus({ ids: selectedApplications, status });
      setSelectedApplications([]);
      fetchApplications();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحديث الطلبات' : 'Error updating applications');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset job form
  const resetJobForm = () => {
    setJobForm({
      titleAr: '',
      titleEn: '',
      slug: '',
      descriptionAr: '',
      descriptionEn: '',
      locationAr: '',
      locationEn: '',
      department: '',
      type: 'full-time',
      experienceLevel: 'mid',
      status: 'draft',
      applicationDeadline: '',
      isFeatured: false,
      skills: '',
      salaryMin: 0,
      salaryMax: 0,
      salaryCurrency: 'EGP',
      salaryPublic: false,
    });
  };

  // Edit job handler
  const handleEditJob = async (job: Job) => {
    setEditingJob(job);
    setJobForm({
      titleAr: job.title.ar,
      titleEn: job.title.en,
      slug: job.slug,
      descriptionAr: job.description.ar,
      descriptionEn: job.description.en,
      locationAr: job.location.ar,
      locationEn: job.location.en,
      department: typeof job.department === 'string' ? job.department : job.department._id,
      type: job.type,
      experienceLevel: job.experienceLevel,
      status: job.status,
      applicationDeadline: job.applicationDeadline || '',
      isFeatured: job.isFeatured,
      skills: job.skills.join(', '),
      salaryMin: job.salaryRange?.min || 0,
      salaryMax: job.salaryRange?.max || 0,
      salaryCurrency: job.salaryRange?.currency || 'EGP',
      salaryPublic: job.salaryRange?.isPublic || false,
    });
    setShowJobModal(true);
  };

  // View application handler
  const handleViewApplication = async (application: JobApplication) => {
    setViewingApplication(application);
    setShowApplicationModal(true);
  };

  // Selection handlers
  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const toggleApplicationSelection = (appId: string) => {
    setSelectedApplications(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const selectAllJobs = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(j => j._id));
    }
  };

  const selectAllApplications = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(a => a._id));
    }
  };

  // Helper functions
  const getDepartmentName = (department: Job['department']): string => {
    if (typeof department === 'string') return '';
    return isRTL ? department.name.ar : department.name.en;
  };

  const getJobTitle = (job: JobApplication['job']): string => {
    if (typeof job === 'string') return '';
    return isRTL ? job.title.ar : job.title.en;
  };

  // Stats
  const jobStats = {
    total: jobsTotal,
    open: jobs.filter(j => j.status === 'open').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applicationsCount, 0),
  };

  // Render jobs tab
  const renderJobsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'إجمالي الوظائف' : 'Total Jobs'}</p>
          <p className="text-2xl font-bold">{jobStats.total}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'وظائف مفتوحة' : 'Open Jobs'}</p>
          <p className="text-2xl font-bold text-green-600">{jobStats.open}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'وظائف مغلقة' : 'Closed Jobs'}</p>
          <p className="text-2xl font-bold text-red-600">{jobStats.closed}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'إجمالي الطلبات' : 'Total Applications'}</p>
          <p className="text-2xl font-bold text-blue-600">{jobStats.totalApplications}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isRTL ? 'بحث في الوظائف...' : 'Search jobs...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as JobStatus | 'all')}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
          {Object.entries(jobStatusConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {isRTL ? config.labelAr : config.labelEn}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setEditingJob(null);
            resetJobForm();
            setShowJobModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="size-5" />
          {isRTL ? 'وظيفة جديدة' : 'New Job'}
        </button>
        <button
          onClick={() => fetchJobs()}
          className="rounded-lg border p-2 hover:bg-gray-50"
          title={isRTL ? 'تحديث' : 'Refresh'}
        >
          <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
          <span className="text-sm text-blue-800">
            {isRTL
              ? `تم اختيار ${selectedJobs.length} وظيفة`
              : `${selectedJobs.length} jobs selected`}
          </span>
          <button
            onClick={() => handleBulkJobStatusUpdate('open')}
            disabled={actionLoading}
            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isRTL ? 'فتح' : 'Open'}
          </button>
          <button
            onClick={() => handleBulkJobStatusUpdate('closed')}
            disabled={actionLoading}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isRTL ? 'إغلاق' : 'Close'}
          </button>
          <button
            onClick={() => setSelectedJobs([])}
            className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
          >
            {isRTL ? 'إلغاء التحديد' : 'Clear'}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Jobs Table */}
          <div className="overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onChange={selectAllJobs}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'الوظيفة' : 'Job'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'القسم' : 'Department'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'النوع' : 'Type'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'الطلبات' : 'Applications'}
                  </th>
                  <th className="w-24 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => toggleJobSelection(job._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{isRTL ? job.title.ar : job.title.en}</p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="size-3" />
                          <span>{isRTL ? job.location.ar : job.location.en}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{getDepartmentName(job.department)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm">
                        {isRTL ? jobTypeConfig[job.type].labelAr : jobTypeConfig[job.type].labelEn}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${jobStatusConfig[job.status].color}`}
                      >
                        {isRTL
                          ? jobStatusConfig[job.status].labelAr
                          : jobStatusConfig[job.status].labelEn}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="size-4 text-gray-400" />
                        {job.applicationsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="rounded p-1 hover:bg-gray-100"
                          title={isRTL ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="size-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="rounded p-1 hover:bg-gray-100"
                          title={isRTL ? 'حذف' : 'Delete'}
                          disabled={actionLoading}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {isRTL ? 'لا توجد وظائف' : 'No jobs found'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {jobsTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setJobsPage(p => Math.max(1, p - 1))}
                disabled={jobsPage === 1}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {isRTL ? 'السابق' : 'Previous'}
              </button>
              <span className="text-sm text-gray-500">
                {isRTL
                  ? `صفحة ${jobsPage} من ${jobsTotalPages}`
                  : `Page ${jobsPage} of ${jobsTotalPages}`}
              </span>
              <button
                onClick={() => setJobsPage(p => Math.min(jobsTotalPages, p + 1))}
                disabled={jobsPage === jobsTotalPages}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {isRTL ? 'التالي' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render applications tab
  const renderApplicationsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={applicationStatusFilter}
          onChange={e => setApplicationStatusFilter(e.target.value as ApplicationStatus | 'all')}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
          {Object.entries(applicationStatusConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {isRTL ? config.labelAr : config.labelEn}
            </option>
          ))}
        </select>
        <button
          onClick={() => fetchApplications()}
          className="rounded-lg border p-2 hover:bg-gray-50"
          title={isRTL ? 'تحديث' : 'Refresh'}
        >
          <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg bg-blue-50 p-4">
          <span className="text-sm text-blue-800">
            {isRTL
              ? `تم اختيار ${selectedApplications.length} طلب`
              : `${selectedApplications.length} applications selected`}
          </span>
          <button
            onClick={() => handleBulkApplicationStatusUpdate('shortlisted')}
            disabled={actionLoading}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isRTL ? 'قائمة قصيرة' : 'Shortlist'}
          </button>
          <button
            onClick={() => handleBulkApplicationStatusUpdate('rejected')}
            disabled={actionLoading}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isRTL ? 'رفض' : 'Reject'}
          </button>
          <button
            onClick={() => setSelectedApplications([])}
            className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
          >
            {isRTL ? 'إلغاء التحديد' : 'Clear'}
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Applications Table */}
          <div className="overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedApplications.length === applications.length &&
                        applications.length > 0
                      }
                      onChange={selectAllApplications}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'المتقدم' : 'Applicant'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'الوظيفة' : 'Job'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'التقييم' : 'Rating'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {isRTL ? 'التاريخ' : 'Date'}
                  </th>
                  <th className="w-24 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(app._id)}
                        onChange={() => toggleApplicationSelection(app._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {app.firstName} {app.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{getJobTitle(app.job)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${applicationStatusConfig[app.status].color}`}
                      >
                        {isRTL
                          ? applicationStatusConfig[app.status].labelAr
                          : applicationStatusConfig[app.status].labelEn}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`size-4 ${app.rating && star <= app.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewApplication(app)}
                          className="rounded p-1 hover:bg-gray-100"
                          title={isRTL ? 'عرض' : 'View'}
                        >
                          <Eye className="size-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app._id)}
                          className="rounded p-1 hover:bg-gray-100"
                          title={isRTL ? 'حذف' : 'Delete'}
                          disabled={actionLoading}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {isRTL ? 'لا توجد طلبات' : 'No applications found'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {applicationsTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setApplicationsPage(p => Math.max(1, p - 1))}
                disabled={applicationsPage === 1}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {isRTL ? 'السابق' : 'Previous'}
              </button>
              <span className="text-sm text-gray-500">
                {isRTL
                  ? `صفحة ${applicationsPage} من ${applicationsTotalPages}`
                  : `Page ${applicationsPage} of ${applicationsTotalPages}`}
              </span>
              <button
                onClick={() => setApplicationsPage(p => Math.min(applicationsTotalPages, p + 1))}
                disabled={applicationsPage === applicationsTotalPages}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {isRTL ? 'التالي' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Job Modal
  const renderJobModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-bold">
            {editingJob
              ? isRTL
                ? 'تعديل الوظيفة'
                : 'Edit Job'
              : isRTL
                ? 'وظيفة جديدة'
                : 'New Job'}
          </h2>
          <button onClick={() => setShowJobModal(false)} className="rounded p-1 hover:bg-gray-100">
            <X className="size-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                value={jobForm.titleAr}
                onChange={e => setJobForm({ ...jobForm, titleAr: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={jobForm.titleEn}
                onChange={e => setJobForm({ ...jobForm, titleEn: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الرابط' : 'Slug'}</label>
            <input
              type="text"
              value={jobForm.slug}
              onChange={e => setJobForm({ ...jobForm, slug: e.target.value })}
              placeholder={jobForm.titleEn ? generateSlug(jobForm.titleEn) : ''}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الموقع (عربي)' : 'Location (Arabic)'}
              </label>
              <input
                type="text"
                value={jobForm.locationAr}
                onChange={e => setJobForm({ ...jobForm, locationAr: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الموقع (إنجليزي)' : 'Location (English)'}
              </label>
              <input
                type="text"
                value={jobForm.locationEn}
                onChange={e => setJobForm({ ...jobForm, locationEn: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type, Experience, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'نوع العمل' : 'Job Type'}
              </label>
              <select
                value={jobForm.type}
                onChange={e => setJobForm({ ...jobForm, type: e.target.value as JobType })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(jobTypeConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {isRTL ? config.labelAr : config.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'مستوى الخبرة' : 'Experience Level'}
              </label>
              <select
                value={jobForm.experienceLevel}
                onChange={e =>
                  setJobForm({ ...jobForm, experienceLevel: e.target.value as ExperienceLevel })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(experienceLevelConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {isRTL ? config.labelAr : config.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الحالة' : 'Status'}
              </label>
              <select
                value={jobForm.status}
                onChange={e => setJobForm({ ...jobForm, status: e.target.value as JobStatus })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(jobStatusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {isRTL ? config.labelAr : config.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}
              </label>
              <textarea
                value={jobForm.descriptionAr}
                onChange={e => setJobForm({ ...jobForm, descriptionAr: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={6}
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}
              </label>
              <textarea
                value={jobForm.descriptionEn}
                onChange={e => setJobForm({ ...jobForm, descriptionEn: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={6}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'المهارات (مفصولة بفواصل)' : 'Skills (comma-separated)'}
            </label>
            <input
              type="text"
              value={jobForm.skills}
              onChange={e => setJobForm({ ...jobForm, skills: e.target.value })}
              placeholder="React, TypeScript, Node.js"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'الموعد النهائي' : 'Application Deadline'}
            </label>
            <input
              type="date"
              value={jobForm.applicationDeadline}
              onChange={e => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={jobForm.isFeatured}
              onChange={e => setJobForm({ ...jobForm, isFeatured: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              {isRTL ? 'وظيفة مميزة' : 'Featured Job'}
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={() => setShowJobModal(false)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSaveJob}
            disabled={actionLoading || !jobForm.titleAr || !jobForm.titleEn}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Save className="size-5" />
            )}
            {isRTL ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  // Application Modal
  const renderApplicationModal = () => {
    if (!viewingApplication) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-bold">{isRTL ? 'تفاصيل الطلب' : 'Application Details'}</h2>
            <button
              onClick={() => {
                setShowApplicationModal(false);
                setViewingApplication(null);
              }}
              className="rounded p-1 hover:bg-gray-100"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="space-y-6 p-6">
            {/* Applicant Info */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-medium">{isRTL ? 'معلومات المتقدم' : 'Applicant Info'}</h3>
              <div className="space-y-3">
                <p className="text-lg font-semibold">
                  {viewingApplication.firstName} {viewingApplication.lastName}
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="size-4" />
                  <span>{viewingApplication.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="size-4" />
                  <span>{viewingApplication.phone}</span>
                </div>
                {viewingApplication.linkedinUrl && (
                  <a
                    href={viewingApplication.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
                {viewingApplication.portfolioUrl && (
                  <a
                    href={viewingApplication.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                {isRTL ? 'الحالة' : 'Status'}
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(applicationStatusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() =>
                      handleUpdateApplicationStatus(
                        viewingApplication._id,
                        key as ApplicationStatus
                      )
                    }
                    disabled={actionLoading || viewingApplication.status === key}
                    className={`rounded-full px-3 py-1 text-sm ${
                      viewingApplication.status === key
                        ? config.color + ' font-medium'
                        : 'border hover:bg-gray-50'
                    } disabled:opacity-50`}
                  >
                    {isRTL ? config.labelAr : config.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            {viewingApplication.coverLetter && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {isRTL ? 'الرسالة التعريفية' : 'Cover Letter'}
                </label>
                <p className="rounded-lg border bg-gray-50 p-4 text-sm">
                  {viewingApplication.coverLetter}
                </p>
              </div>
            )}

            {/* Notes */}
            {viewingApplication.notes && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {isRTL ? 'ملاحظات' : 'Notes'}
                </label>
                <p className="rounded-lg border bg-gray-50 p-4 text-sm">
                  {viewingApplication.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t px-6 py-4">
            <button
              onClick={() => handleDeleteApplication(viewingApplication._id)}
              disabled={actionLoading}
              className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="size-5" />
              {isRTL ? 'حذف' : 'Delete'}
            </button>
            <button
              onClick={() => {
                setShowApplicationModal(false);
                setViewingApplication(null);
              }}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              {isRTL ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'الوظائف' : 'Careers'}</h1>
            <p className="text-gray-500">
              {isRTL ? 'إدارة الوظائف والطلبات' : 'Manage jobs and applications'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <div className="flex gap-4">
          {[
            { id: 'jobs', labelAr: 'الوظائف', labelEn: 'Jobs' },
            { id: 'applications', labelAr: 'الطلبات', labelEn: 'Applications' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'jobs' | 'applications')}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {isRTL ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'jobs' && renderJobsTab()}
        {activeTab === 'applications' && renderApplicationsTab()}
      </div>

      {/* Modals */}
      {showJobModal && renderJobModal()}
      {showApplicationModal && renderApplicationModal()}
    </div>
  );
}
