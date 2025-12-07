'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  Users,
  FileText,
  X,
  Save,
  Download,
  Mail,
  Phone,
  CheckCircle,
  Star,
} from 'lucide-react';

// Types
interface Job {
  id: string;
  title: { ar: string; en: string };
  slug: string;
  department: { id: string; nameAr: string; nameEn: string };
  location: { ar: string; en: string };
  type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  experience: string;
  salary?: { min: number; max: number; currency: string };
  description: { ar: string; en: string };
  requirements: { ar: string[]; en: string[] };
  responsibilities: { ar: string[]; en: string[] };
  benefits: { ar: string[]; en: string[] };
  status: 'draft' | 'open' | 'closed' | 'filled';
  applicationsCount: number;
  createdAt: string;
  deadline?: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: { ar: string; en: string };
  applicant: {
    name: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter?: string;
    linkedin?: string;
    portfolio?: string;
  };
  experience: string;
  expectedSalary?: number;
  availableFrom?: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  rating?: number;
  notes?: string;
  appliedAt: string;
}

interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  jobsCount: number;
}

// Mock data
const mockDepartments: Department[] = [
  { id: '1', nameAr: 'الهندسة', nameEn: 'Engineering', jobsCount: 5 },
  { id: '2', nameAr: 'التصميم', nameEn: 'Design', jobsCount: 3 },
  { id: '3', nameAr: 'التسويق', nameEn: 'Marketing', jobsCount: 2 },
  { id: '4', nameAr: 'العمليات', nameEn: 'Operations', jobsCount: 1 },
  { id: '5', nameAr: 'الموارد البشرية', nameEn: 'Human Resources', jobsCount: 1 },
];

const mockJobs: Job[] = [
  {
    id: '1',
    title: { ar: 'مطور واجهات أمامية - React', en: 'Frontend Developer - React' },
    slug: 'frontend-developer-react',
    department: mockDepartments[0],
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    type: 'full-time',
    experience: '3-5 years',
    salary: { min: 15000, max: 25000, currency: 'EGP' },
    description: {
      ar: 'نبحث عن مطور واجهات أمامية متميز...',
      en: 'We are looking for an exceptional frontend developer...',
    },
    requirements: {
      ar: ['خبرة 3+ سنوات في React', 'إتقان TypeScript', 'معرفة بـ Next.js'],
      en: ['3+ years React experience', 'TypeScript proficiency', 'Next.js knowledge'],
    },
    responsibilities: {
      ar: ['تطوير واجهات المستخدم', 'تحسين الأداء', 'مراجعة الكود'],
      en: ['Develop user interfaces', 'Optimize performance', 'Code reviews'],
    },
    benefits: {
      ar: ['تأمين صحي', 'عمل مرن', 'تدريب مستمر'],
      en: ['Health insurance', 'Flexible work', 'Continuous training'],
    },
    status: 'open',
    applicationsCount: 24,
    createdAt: '2024-01-15',
    deadline: '2024-02-15',
  },
  {
    id: '2',
    title: { ar: 'مصمم UI/UX', en: 'UI/UX Designer' },
    slug: 'ui-ux-designer',
    department: mockDepartments[1],
    location: { ar: 'عن بعد', en: 'Remote' },
    type: 'remote',
    experience: '2-4 years',
    salary: { min: 12000, max: 18000, currency: 'EGP' },
    description: {
      ar: 'نبحث عن مصمم UI/UX مبدع...',
      en: 'We are looking for a creative UI/UX designer...',
    },
    requirements: {
      ar: ['خبرة في Figma', 'فهم تجربة المستخدم', 'بورتفوليو قوي'],
      en: ['Figma experience', 'UX understanding', 'Strong portfolio'],
    },
    responsibilities: {
      ar: ['تصميم الواجهات', 'بحث المستخدمين', 'إنشاء النماذج الأولية'],
      en: ['Design interfaces', 'User research', 'Create prototypes'],
    },
    benefits: {
      ar: ['عمل عن بعد', 'ساعات مرنة', 'بيئة إبداعية'],
      en: ['Remote work', 'Flexible hours', 'Creative environment'],
    },
    status: 'open',
    applicationsCount: 18,
    createdAt: '2024-01-18',
    deadline: '2024-02-20',
  },
  {
    id: '3',
    title: { ar: 'مدير تسويق رقمي', en: 'Digital Marketing Manager' },
    slug: 'digital-marketing-manager',
    department: mockDepartments[2],
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    type: 'full-time',
    experience: '5+ years',
    description: {
      ar: 'نبحث عن مدير تسويق رقمي ذو خبرة...',
      en: 'We are looking for an experienced digital marketing manager...',
    },
    requirements: {
      ar: ['خبرة 5+ سنوات', 'إدارة فرق', 'تحليل البيانات'],
      en: ['5+ years experience', 'Team management', 'Data analysis'],
    },
    responsibilities: {
      ar: ['إدارة الحملات', 'تحليل الأداء', 'تطوير الاستراتيجية'],
      en: ['Manage campaigns', 'Analyze performance', 'Develop strategy'],
    },
    benefits: {
      ar: ['راتب تنافسي', 'بونص سنوي', 'تأمين شامل'],
      en: ['Competitive salary', 'Annual bonus', 'Full insurance'],
    },
    status: 'closed',
    applicationsCount: 32,
    createdAt: '2024-01-10',
  },
];

const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: { ar: 'مطور واجهات أمامية - React', en: 'Frontend Developer - React' },
    applicant: {
      name: 'Ahmed Mohamed',
      email: 'ahmed@example.com',
      phone: '+20 100 123 4567',
      resume: '/resumes/ahmed-mohamed.pdf',
      linkedin: 'https://linkedin.com/in/ahmed',
      portfolio: 'https://ahmed.dev',
    },
    experience: '4 years',
    expectedSalary: 20000,
    availableFrom: '2024-02-01',
    status: 'shortlisted',
    rating: 4,
    appliedAt: '2024-01-16',
  },
  {
    id: '2',
    jobId: '1',
    jobTitle: { ar: 'مطور واجهات أمامية - React', en: 'Frontend Developer - React' },
    applicant: {
      name: 'Sara Ali',
      email: 'sara@example.com',
      phone: '+20 101 234 5678',
      resume: '/resumes/sara-ali.pdf',
      coverLetter: 'I am passionate about frontend development...',
    },
    experience: '3 years',
    expectedSalary: 18000,
    status: 'new',
    appliedAt: '2024-01-18',
  },
  {
    id: '3',
    jobId: '2',
    jobTitle: { ar: 'مصمم UI/UX', en: 'UI/UX Designer' },
    applicant: {
      name: 'Mohamed Hassan',
      email: 'mohamed@example.com',
      phone: '+20 102 345 6789',
      resume: '/resumes/mohamed-hassan.pdf',
      portfolio: 'https://behance.net/mohamed',
    },
    experience: '2 years',
    status: 'reviewing',
    rating: 3,
    appliedAt: '2024-01-19',
  },
];

export default function CareersAdminPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // State
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'departments'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Job form state
  const [jobForm, setJobForm] = useState({
    titleAr: '',
    titleEn: '',
    departmentId: '',
    locationAr: '',
    locationEn: '',
    type: 'full-time' as Job['type'],
    experience: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'EGP',
    descriptionAr: '',
    descriptionEn: '',
    requirementsAr: '',
    requirementsEn: '',
    responsibilitiesAr: '',
    responsibilitiesEn: '',
    benefitsAr: '',
    benefitsEn: '',
    status: 'draft' as Job['status'],
    deadline: '',
  });

  // Department form state
  const [departmentForm, setDepartmentForm] = useState({
    nameAr: '',
    nameEn: '',
  });

  const jobStatuses = [
    { value: 'all', labelAr: 'الكل', labelEn: 'All' },
    { value: 'draft', labelAr: 'مسودة', labelEn: 'Draft' },
    { value: 'open', labelAr: 'مفتوح', labelEn: 'Open' },
    { value: 'closed', labelAr: 'مغلق', labelEn: 'Closed' },
    { value: 'filled', labelAr: 'تم التوظيف', labelEn: 'Filled' },
  ];

  const applicationStatuses = [
    { value: 'all', labelAr: 'الكل', labelEn: 'All' },
    { value: 'new', labelAr: 'جديد', labelEn: 'New' },
    { value: 'reviewing', labelAr: 'قيد المراجعة', labelEn: 'Reviewing' },
    { value: 'shortlisted', labelAr: 'القائمة المختصرة', labelEn: 'Shortlisted' },
    { value: 'interviewed', labelAr: 'تمت المقابلة', labelEn: 'Interviewed' },
    { value: 'offered', labelAr: 'تم العرض', labelEn: 'Offered' },
    { value: 'hired', labelAr: 'تم التوظيف', labelEn: 'Hired' },
    { value: 'rejected', labelAr: 'مرفوض', labelEn: 'Rejected' },
  ];

  const jobTypes = [
    { value: 'full-time', labelAr: 'دوام كامل', labelEn: 'Full-time' },
    { value: 'part-time', labelAr: 'دوام جزئي', labelEn: 'Part-time' },
    { value: 'contract', labelAr: 'عقد', labelEn: 'Contract' },
    { value: 'remote', labelAr: 'عن بعد', labelEn: 'Remote' },
    { value: 'internship', labelAr: 'تدريب', labelEn: 'Internship' },
  ];

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === 'all' || job.department.id === selectedDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Handlers
  const handleAddJob = () => {
    setEditingJob(null);
    setJobForm({
      titleAr: '',
      titleEn: '',
      departmentId: '',
      locationAr: '',
      locationEn: '',
      type: 'full-time',
      experience: '',
      salaryMin: '',
      salaryMax: '',
      currency: 'EGP',
      descriptionAr: '',
      descriptionEn: '',
      requirementsAr: '',
      requirementsEn: '',
      responsibilitiesAr: '',
      responsibilitiesEn: '',
      benefitsAr: '',
      benefitsEn: '',
      status: 'draft',
      deadline: '',
    });
    setIsJobModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      titleAr: job.title.ar,
      titleEn: job.title.en,
      departmentId: job.department.id,
      locationAr: job.location.ar,
      locationEn: job.location.en,
      type: job.type,
      experience: job.experience,
      salaryMin: job.salary?.min.toString() || '',
      salaryMax: job.salary?.max.toString() || '',
      currency: job.salary?.currency || 'EGP',
      descriptionAr: job.description.ar,
      descriptionEn: job.description.en,
      requirementsAr: job.requirements.ar.join('\n'),
      requirementsEn: job.requirements.en.join('\n'),
      responsibilitiesAr: job.responsibilities.ar.join('\n'),
      responsibilitiesEn: job.responsibilities.en.join('\n'),
      benefitsAr: job.benefits.ar.join('\n'),
      benefitsEn: job.benefits.en.join('\n'),
      status: job.status,
      deadline: job.deadline || '',
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = () => {
    const dept = departments.find(d => d.id === jobForm.departmentId);
    const newJob: Job = {
      id: editingJob?.id || Date.now().toString(),
      title: { ar: jobForm.titleAr, en: jobForm.titleEn },
      slug: jobForm.titleEn.toLowerCase().replace(/\s+/g, '-'),
      department: dept || departments[0],
      location: { ar: jobForm.locationAr, en: jobForm.locationEn },
      type: jobForm.type,
      experience: jobForm.experience,
      salary:
        jobForm.salaryMin && jobForm.salaryMax
          ? {
              min: parseInt(jobForm.salaryMin),
              max: parseInt(jobForm.salaryMax),
              currency: jobForm.currency,
            }
          : undefined,
      description: { ar: jobForm.descriptionAr, en: jobForm.descriptionEn },
      requirements: {
        ar: jobForm.requirementsAr.split('\n').filter(r => r.trim()),
        en: jobForm.requirementsEn.split('\n').filter(r => r.trim()),
      },
      responsibilities: {
        ar: jobForm.responsibilitiesAr.split('\n').filter(r => r.trim()),
        en: jobForm.responsibilitiesEn.split('\n').filter(r => r.trim()),
      },
      benefits: {
        ar: jobForm.benefitsAr.split('\n').filter(b => b.trim()),
        en: jobForm.benefitsEn.split('\n').filter(b => b.trim()),
      },
      status: jobForm.status,
      applicationsCount: editingJob?.applicationsCount || 0,
      createdAt: editingJob?.createdAt || new Date().toISOString().split('T')[0],
      deadline: jobForm.deadline || undefined,
    };

    if (editingJob) {
      setJobs(jobs.map(j => (j.id === editingJob.id ? newJob : j)));
    } else {
      setJobs([newJob, ...jobs]);
    }
    setIsJobModalOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleViewApplication = (application: Application) => {
    setViewingApplication(application);
    setIsApplicationModalOpen(true);
  };

  const handleUpdateApplicationStatus = (id: string, newStatus: Application['status']) => {
    setApplications(applications.map(a => (a.id === id ? { ...a, status: newStatus } : a)));
    if (viewingApplication?.id === id) {
      setViewingApplication({ ...viewingApplication, status: newStatus });
    }
  };

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentForm({ nameAr: '', nameEn: '' });
    setIsDepartmentModalOpen(true);
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setDepartmentForm({ nameAr: dept.nameAr, nameEn: dept.nameEn });
    setIsDepartmentModalOpen(true);
  };

  const handleSaveDepartment = () => {
    if (editingDepartment) {
      setDepartments(
        departments.map(d =>
          d.id === editingDepartment.id
            ? { ...d, nameAr: departmentForm.nameAr, nameEn: departmentForm.nameEn }
            : d
        )
      );
    } else {
      setDepartments([
        ...departments,
        {
          id: Date.now().toString(),
          nameAr: departmentForm.nameAr,
          nameEn: departmentForm.nameEn,
          jobsCount: 0,
        },
      ]);
    }
    setIsDepartmentModalOpen(false);
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      filled: 'bg-blue-100 text-blue-800',
      new: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-purple-100 text-purple-800',
      shortlisted: 'bg-cyan-100 text-cyan-800',
      interviewed: 'bg-indigo-100 text-indigo-800',
      offered: 'bg-orange-100 text-orange-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string, isJob = true) => {
    const statuses = isJob ? jobStatuses : applicationStatuses;
    const found = statuses.find(s => s.value === status);
    return isRTL ? found?.labelAr : found?.labelEn;
  };

  const getTypeLabel = (type: Job['type']) => {
    const found = jobTypes.find(t => t.value === type);
    return isRTL ? found?.labelAr : found?.labelEn;
  };

  // Stats
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === 'open').length;
  const totalApplications = applications.length;
  const newApplications = applications.filter(a => a.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'إدارة الوظائف' : 'Careers Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة الوظائف وطلبات التقديم' : 'Manage jobs and applications'}
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'jobs' && (
            <button
              onClick={handleAddJob}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              {isRTL ? 'إضافة وظيفة' : 'Add Job'}
            </button>
          )}
          {activeTab === 'departments' && (
            <button
              onClick={handleAddDepartment}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              {isRTL ? 'إضافة قسم' : 'Add Department'}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Briefcase className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{isRTL ? 'إجمالي الوظائف' : 'Total Jobs'}</p>
              <p className="text-xl font-bold">{totalJobs}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{isRTL ? 'وظائف مفتوحة' : 'Open Jobs'}</p>
              <p className="text-xl font-bold">{openJobs}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Users className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isRTL ? 'إجمالي الطلبات' : 'Total Applications'}
              </p>
              <p className="text-xl font-bold">{totalApplications}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <FileText className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{isRTL ? 'طلبات جديدة' : 'New Applications'}</p>
              <p className="text-xl font-bold">{newApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`border-b-2 px-4 py-2 font-medium ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Briefcase className="size-4" />
              {isRTL ? 'الوظائف' : 'Jobs'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`border-b-2 px-4 py-2 font-medium ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              {isRTL ? 'الطلبات' : 'Applications'}
              {newApplications > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {newApplications}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`border-b-2 px-4 py-2 font-medium ${
              activeTab === 'departments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="size-4" />
              {isRTL ? 'الأقسام' : 'Departments'}
            </span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search
            className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}
          />
          <input
            type="text"
            placeholder={isRTL ? 'بحث...' : 'Search...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full rounded-lg border py-2 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
          />
        </div>
        {activeTab === 'jobs' && (
          <>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="rounded-lg border px-4 py-2"
            >
              {jobStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {isRTL ? status.labelAr : status.labelEn}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="rounded-lg border px-4 py-2"
            >
              <option value="all">{isRTL ? 'كل الأقسام' : 'All Departments'}</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {isRTL ? dept.nameAr : dept.nameEn}
                </option>
              ))}
            </select>
          </>
        )}
        {activeTab === 'applications' && (
          <>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="rounded-lg border px-4 py-2"
            >
              {applicationStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {isRTL ? status.labelAr : status.labelEn}
                </option>
              ))}
            </select>
            <select
              value={selectedJob}
              onChange={e => setSelectedJob(e.target.value)}
              className="rounded-lg border px-4 py-2"
            >
              <option value="all">{isRTL ? 'كل الوظائف' : 'All Jobs'}</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {isRTL ? job.title.ar : job.title.en}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Content */}
      {activeTab === 'jobs' && (
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الوظيفة' : 'Job'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'القسم' : 'Department'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'النوع' : 'Type'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الطلبات' : 'Applications'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الحالة' : 'Status'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {isRTL ? job.title.ar : job.title.en}
                      </p>
                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="size-3" />
                        {isRTL ? job.location.ar : job.location.en}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {isRTL ? job.department.nameAr : job.department.nameEn}
                  </td>
                  <td className="p-4 text-gray-600">{getTypeLabel(job.type)}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Users className="size-4 text-gray-400" />
                      {job.applicationsCount}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(job.status)}`}
                    >
                      {getStatusLabel(job.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                        title={isRTL ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                        title={isRTL ? 'عرض' : 'View'}
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        title={isRTL ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredJobs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {isRTL ? 'لا توجد وظائف' : 'No jobs found'}
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'المتقدم' : 'Applicant'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الوظيفة' : 'Job'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الخبرة' : 'Experience'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'التقييم' : 'Rating'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الحالة' : 'Status'}
                </th>
                <th
                  className={`p-4 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {isRTL ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{app.applicant.name}</p>
                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="size-3" />
                        {app.applicant.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{isRTL ? app.jobTitle.ar : app.jobTitle.en}</td>
                  <td className="p-4 text-gray-600">{app.experience}</td>
                  <td className="p-4">
                    {app.rating ? (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${i < app.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(app.status)}`}
                    >
                      {getStatusLabel(app.status, false)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewApplication(app)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                        title={isRTL ? 'عرض' : 'View'}
                      >
                        <Eye className="size-4" />
                      </button>
                      <a
                        href={app.applicant.resume}
                        download
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                        title={isRTL ? 'تحميل السيرة' : 'Download Resume'}
                      >
                        <Download className="size-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {isRTL ? 'لا توجد طلبات' : 'No applications found'}
            </div>
          )}
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map(dept => (
            <div key={dept.id} className="rounded-xl bg-white p-6 shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isRTL ? dept.nameAr : dept.nameEn}
                  </h3>
                  <p className="text-sm text-gray-500">{isRTL ? dept.nameEn : dept.nameAr}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditDepartment(dept)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="size-4" />
                <span>
                  {dept.jobsCount} {isRTL ? 'وظيفة' : 'jobs'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-xl font-bold">
                {editingJob
                  ? isRTL
                    ? 'تعديل وظيفة'
                    : 'Edit Job'
                  : isRTL
                    ? 'إضافة وظيفة جديدة'
                    : 'Add New Job'}
              </h2>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="space-y-6 p-6">
              {/* Title */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={jobForm.titleAr}
                    onChange={e => setJobForm({ ...jobForm, titleAr: e.target.value })}
                    className="w-full rounded-lg border p-2"
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
                    className="w-full rounded-lg border p-2"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Department and Type */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'القسم' : 'Department'}
                  </label>
                  <select
                    value={jobForm.departmentId}
                    onChange={e => setJobForm({ ...jobForm, departmentId: e.target.value })}
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="">{isRTL ? 'اختر القسم' : 'Select Department'}</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {isRTL ? dept.nameAr : dept.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'نوع العمل' : 'Job Type'}
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={e => setJobForm({ ...jobForm, type: e.target.value as Job['type'] })}
                    className="w-full rounded-lg border p-2"
                  >
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {isRTL ? type.labelAr : type.labelEn}
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
                    onChange={e =>
                      setJobForm({ ...jobForm, status: e.target.value as Job['status'] })
                    }
                    className="w-full rounded-lg border p-2"
                  >
                    {jobStatuses.slice(1).map(status => (
                      <option key={status.value} value={status.value}>
                        {isRTL ? status.labelAr : status.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'الموقع (عربي)' : 'Location (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={jobForm.locationAr}
                    onChange={e => setJobForm({ ...jobForm, locationAr: e.target.value })}
                    className="w-full rounded-lg border p-2"
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
                    className="w-full rounded-lg border p-2"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Experience and Deadline */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'سنوات الخبرة' : 'Experience Required'}
                  </label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={e => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full rounded-lg border p-2"
                    placeholder={isRTL ? 'مثال: 3-5 سنوات' : 'e.g., 3-5 years'}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'آخر موعد للتقديم' : 'Application Deadline'}
                  </label>
                  <input
                    type="date"
                    value={jobForm.deadline}
                    onChange={e => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full rounded-lg border p-2"
                  />
                </div>
              </div>

              {/* Salary */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'الحد الأدنى للراتب' : 'Min Salary'}
                  </label>
                  <input
                    type="number"
                    value={jobForm.salaryMin}
                    onChange={e => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'الحد الأقصى للراتب' : 'Max Salary'}
                  </label>
                  <input
                    type="number"
                    value={jobForm.salaryMax}
                    onChange={e => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'العملة' : 'Currency'}
                  </label>
                  <select
                    value={jobForm.currency}
                    onChange={e => setJobForm({ ...jobForm, currency: e.target.value })}
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    value={jobForm.descriptionAr}
                    onChange={e => setJobForm({ ...jobForm, descriptionAr: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
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
                    className="h-32 w-full rounded-lg border p-2"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL
                      ? 'المتطلبات (عربي - سطر لكل متطلب)'
                      : 'Requirements (Arabic - one per line)'}
                  </label>
                  <textarea
                    value={jobForm.requirementsAr}
                    onChange={e => setJobForm({ ...jobForm, requirementsAr: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'المتطلبات (إنجليزي)' : 'Requirements (English - one per line)'}
                  </label>
                  <textarea
                    value={jobForm.requirementsEn}
                    onChange={e => setJobForm({ ...jobForm, requirementsEn: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'المسؤوليات (عربي)' : 'Responsibilities (Arabic)'}
                  </label>
                  <textarea
                    value={jobForm.responsibilitiesAr}
                    onChange={e => setJobForm({ ...jobForm, responsibilitiesAr: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'المسؤوليات (إنجليزي)' : 'Responsibilities (English)'}
                  </label>
                  <textarea
                    value={jobForm.responsibilitiesEn}
                    onChange={e => setJobForm({ ...jobForm, responsibilitiesEn: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'المميزات (عربي)' : 'Benefits (Arabic)'}
                  </label>
                  <textarea
                    value={jobForm.benefitsAr}
                    onChange={e => setJobForm({ ...jobForm, benefitsAr: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'المميزات (إنجليزي)' : 'Benefits (English)'}
                  </label>
                  <textarea
                    value={jobForm.benefitsEn}
                    onChange={e => setJobForm({ ...jobForm, benefitsEn: e.target.value })}
                    className="h-32 w-full rounded-lg border p-2"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white p-4">
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveJob}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Save className="size-4" />
                {isRTL ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {isApplicationModalOpen && viewingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-xl font-bold">
                {isRTL ? 'تفاصيل الطلب' : 'Application Details'}
              </h2>
              <button
                onClick={() => setIsApplicationModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="space-y-6 p-6">
              {/* Applicant Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-bold">
                  {isRTL ? 'معلومات المتقدم' : 'Applicant Information'}
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Users className="size-4 text-gray-400" />
                    <span className="font-medium">{viewingApplication.applicant.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="size-4 text-gray-400" />
                    <a
                      href={`mailto:${viewingApplication.applicant.email}`}
                      className="text-blue-600"
                    >
                      {viewingApplication.applicant.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-gray-400" />
                    <a href={`tel:${viewingApplication.applicant.phone}`} className="text-blue-600">
                      {viewingApplication.applicant.phone}
                    </a>
                  </p>
                  {viewingApplication.applicant.linkedin && (
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">LinkedIn:</span>
                      <a
                        href={viewingApplication.applicant.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {viewingApplication.applicant.linkedin}
                      </a>
                    </p>
                  )}
                  {viewingApplication.applicant.portfolio && (
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">Portfolio:</span>
                      <a
                        href={viewingApplication.applicant.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {viewingApplication.applicant.portfolio}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Job Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-bold">{isRTL ? 'الوظيفة' : 'Job Applied For'}</h3>
                <p className="font-medium">
                  {isRTL ? viewingApplication.jobTitle.ar : viewingApplication.jobTitle.en}
                </p>
              </div>

              {/* Application Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-bold">{isRTL ? 'تفاصيل الطلب' : 'Application Details'}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">{isRTL ? 'الخبرة' : 'Experience'}</p>
                    <p className="font-medium">{viewingApplication.experience}</p>
                  </div>
                  {viewingApplication.expectedSalary && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'الراتب المتوقع' : 'Expected Salary'}
                      </p>
                      <p className="font-medium">{viewingApplication.expectedSalary} EGP</p>
                    </div>
                  )}
                  {viewingApplication.availableFrom && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'متاح من' : 'Available From'}
                      </p>
                      <p className="font-medium">{formatDate(viewingApplication.availableFrom)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تاريخ التقديم' : 'Applied On'}
                    </p>
                    <p className="font-medium">{formatDate(viewingApplication.appliedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {viewingApplication.applicant.coverLetter && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-bold">{isRTL ? 'خطاب التقديم' : 'Cover Letter'}</h3>
                  <p className="text-gray-700">{viewingApplication.applicant.coverLetter}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-bold">{isRTL ? 'تحديث الحالة' : 'Update Status'}</h3>
                <select
                  value={viewingApplication.status}
                  onChange={e =>
                    handleUpdateApplicationStatus(
                      viewingApplication.id,
                      e.target.value as Application['status']
                    )
                  }
                  className="w-full rounded-lg border p-2"
                >
                  {applicationStatuses.slice(1).map(status => (
                    <option key={status.value} value={status.value}>
                      {isRTL ? status.labelAr : status.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-bold">{isRTL ? 'التقييم' : 'Rating'}</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => {
                        setApplications(
                          applications.map(a =>
                            a.id === viewingApplication.id ? { ...a, rating: star } : a
                          )
                        );
                        setViewingApplication({ ...viewingApplication, rating: star });
                      }}
                      className="p-1"
                    >
                      <Star
                        className={`size-6 ${
                          star <= (viewingApplication.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex justify-between gap-2 border-t bg-white p-4">
              <a
                href={viewingApplication.applicant.resume}
                download
                className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                <Download className="size-4" />
                {isRTL ? 'تحميل السيرة الذاتية' : 'Download Resume'}
              </a>
              <button
                onClick={() => setIsApplicationModalOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {isDepartmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">
                {editingDepartment
                  ? isRTL
                    ? 'تعديل قسم'
                    : 'Edit Department'
                  : isRTL
                    ? 'إضافة قسم جديد'
                    : 'Add New Department'}
              </h2>
              <button
                onClick={() => setIsDepartmentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={departmentForm.nameAr}
                  onChange={e => setDepartmentForm({ ...departmentForm, nameAr: e.target.value })}
                  className="w-full rounded-lg border p-2"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}
                </label>
                <input
                  type="text"
                  value={departmentForm.nameEn}
                  onChange={e => setDepartmentForm({ ...departmentForm, nameEn: e.target.value })}
                  className="w-full rounded-lg border p-2"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t p-4">
              <button
                onClick={() => setIsDepartmentModalOpen(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveDepartment}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Save className="size-4" />
                {isRTL ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
