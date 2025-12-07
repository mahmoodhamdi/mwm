'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Filter,
  Users,
  Heart,
  Coffee,
  Zap,
  Globe,
  Award,
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
  postedAt: string;
  deadline?: string;
}

interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  jobsCount: number;
}

// Mock data
const departments: Department[] = [
  { id: '1', nameAr: 'الهندسة', nameEn: 'Engineering', jobsCount: 5 },
  { id: '2', nameAr: 'التصميم', nameEn: 'Design', jobsCount: 3 },
  { id: '3', nameAr: 'التسويق', nameEn: 'Marketing', jobsCount: 2 },
  { id: '4', nameAr: 'العمليات', nameEn: 'Operations', jobsCount: 1 },
];

const jobs: Job[] = [
  {
    id: '1',
    title: { ar: 'مطور واجهات أمامية - React', en: 'Frontend Developer - React' },
    slug: 'frontend-developer-react',
    department: departments[0],
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    type: 'full-time',
    experience: '3-5 years',
    salary: { min: 15000, max: 25000, currency: 'EGP' },
    description: {
      ar: 'نبحث عن مطور واجهات أمامية متميز للانضمام إلى فريقنا المتنامي. ستعمل على مشاريع مثيرة باستخدام أحدث التقنيات...',
      en: 'We are looking for an exceptional frontend developer to join our growing team. You will work on exciting projects using the latest technologies...',
    },
    postedAt: '2024-01-15',
    deadline: '2024-02-15',
  },
  {
    id: '2',
    title: { ar: 'مصمم UI/UX', en: 'UI/UX Designer' },
    slug: 'ui-ux-designer',
    department: departments[1],
    location: { ar: 'عن بعد', en: 'Remote' },
    type: 'remote',
    experience: '2-4 years',
    salary: { min: 12000, max: 18000, currency: 'EGP' },
    description: {
      ar: 'نبحث عن مصمم UI/UX مبدع لتصميم تجارب مستخدم استثنائية لعملائنا...',
      en: 'We are looking for a creative UI/UX designer to design exceptional user experiences for our clients...',
    },
    postedAt: '2024-01-18',
    deadline: '2024-02-20',
  },
  {
    id: '3',
    title: { ar: 'مطور خلفي - Node.js', en: 'Backend Developer - Node.js' },
    slug: 'backend-developer-nodejs',
    department: departments[0],
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    type: 'full-time',
    experience: '3-5 years',
    salary: { min: 18000, max: 28000, currency: 'EGP' },
    description: {
      ar: 'نبحث عن مطور خلفي ماهر في Node.js لبناء APIs قوية وقابلة للتوسع...',
      en: 'We are looking for a skilled Node.js backend developer to build robust and scalable APIs...',
    },
    postedAt: '2024-01-20',
    deadline: '2024-02-25',
  },
  {
    id: '4',
    title: { ar: 'مدير مشاريع', en: 'Project Manager' },
    slug: 'project-manager',
    department: departments[3],
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    type: 'full-time',
    experience: '5+ years',
    description: {
      ar: 'نبحث عن مدير مشاريع ذو خبرة لقيادة فرق المشاريع وضمان التسليم في الوقت المحدد...',
      en: 'We are looking for an experienced project manager to lead project teams and ensure on-time delivery...',
    },
    postedAt: '2024-01-22',
  },
  {
    id: '5',
    title: { ar: 'أخصائي تسويق رقمي', en: 'Digital Marketing Specialist' },
    slug: 'digital-marketing-specialist',
    department: departments[2],
    location: { ar: 'هجين', en: 'Hybrid' },
    type: 'full-time',
    experience: '2-3 years',
    salary: { min: 10000, max: 15000, currency: 'EGP' },
    description: {
      ar: 'نبحث عن أخصائي تسويق رقمي لإدارة حملاتنا الإعلانية وتحسين تواجدنا على الإنترنت...',
      en: 'We are looking for a digital marketing specialist to manage our ad campaigns and improve our online presence...',
    },
    postedAt: '2024-01-25',
    deadline: '2024-02-28',
  },
];

const benefits = [
  {
    icon: Heart,
    titleAr: 'تأمين صحي شامل',
    titleEn: 'Comprehensive Health Insurance',
    descriptionAr: 'تأمين طبي يشمل الفرد والعائلة',
    descriptionEn: 'Medical insurance covering individual and family',
  },
  {
    icon: Coffee,
    titleAr: 'بيئة عمل مرنة',
    titleEn: 'Flexible Work Environment',
    descriptionAr: 'العمل من المكتب أو من المنزل',
    descriptionEn: 'Work from office or home',
  },
  {
    icon: Zap,
    titleAr: 'تدريب وتطوير',
    titleEn: 'Training & Development',
    descriptionAr: 'برامج تدريبية وتطوير مستمر',
    descriptionEn: 'Continuous training and development programs',
  },
  {
    icon: Globe,
    titleAr: 'مشاريع عالمية',
    titleEn: 'Global Projects',
    descriptionAr: 'العمل على مشاريع مع عملاء من جميع أنحاء العالم',
    descriptionEn: 'Work on projects with clients from around the world',
  },
  {
    icon: Award,
    titleAr: 'مكافآت وحوافز',
    titleEn: 'Rewards & Incentives',
    descriptionAr: 'نظام مكافآت وحوافز تنافسي',
    descriptionEn: 'Competitive rewards and incentive system',
  },
  {
    icon: Users,
    titleAr: 'فريق متميز',
    titleEn: 'Amazing Team',
    descriptionAr: 'العمل مع فريق من المحترفين الموهوبين',
    descriptionEn: 'Work with a team of talented professionals',
  },
];

export default function CareersPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const jobTypes = [
    { value: 'all', labelAr: 'الكل', labelEn: 'All' },
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
    const matchesDepartment =
      selectedDepartment === 'all' || job.department.id === selectedDepartment;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesDepartment && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return isRTL ? 'اليوم' : 'Today';
    if (diffDays === 1) return isRTL ? 'أمس' : 'Yesterday';
    if (diffDays < 7) return isRTL ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return isRTL ? `منذ ${weeks} أسبوع` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return isRTL ? 'تنافسي' : 'Competitive';
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}`;
  };

  const getTypeLabel = (type: Job['type']) => {
    const found = jobTypes.find(t => t.value === type);
    return isRTL ? found?.labelAr : found?.labelEn;
  };

  const getTypeColor = (type: Job['type']) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      contract: 'bg-yellow-100 text-yellow-800',
      remote: 'bg-purple-100 text-purple-800',
      internship: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {isRTL ? 'انضم إلى فريقنا' : 'Join Our Team'}
            </h1>
            <p className="mb-8 text-lg text-blue-100">
              {isRTL
                ? 'نحن نبحث عن أشخاص موهوبين وشغوفين للانضمام إلى رحلتنا في بناء منتجات رقمية استثنائية'
                : "We're looking for talented and passionate people to join our journey in building exceptional digital products"}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="size-5" />
                <span>
                  {jobs.length} {isRTL ? 'وظيفة متاحة' : 'Open Positions'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <span>{isRTL ? 'القاهرة + عن بعد' : 'Cairo + Remote'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="container mx-auto -mt-8 px-4">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                className={`absolute top-1/2 size-5 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`}
              />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن وظيفة...' : 'Search for a job...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl border border-gray-200 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isRTL ? 'pl-4 pr-12' : 'pl-12 pr-4'}`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 hover:bg-gray-50 md:w-auto"
            >
              <Filter className="size-5" />
              {isRTL ? 'فلترة' : 'Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 border-t pt-4">
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2"
              >
                <option value="all">{isRTL ? 'كل الأقسام' : 'All Departments'}</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {isRTL ? dept.nameAr : dept.nameEn} ({dept.jobsCount})
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {isRTL ? type.labelAr : type.labelEn}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'الوظائف المتاحة' : 'Open Positions'}
            <span className="ms-2 text-lg font-normal text-gray-500">({filteredJobs.length})</span>
          </h2>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <Link key={job.id} href={`/${locale}/careers/${job.slug}`}>
                <div className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(job.type)}`}
                        >
                          {getTypeLabel(job.type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {isRTL ? job.department.nameAr : job.department.nameEn}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                        {isRTL ? job.title.ar : job.title.en}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-gray-600">
                        {isRTL ? job.description.ar : job.description.en}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-4" />
                          {isRTL ? job.location.ar : job.location.en}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {job.experience}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="size-4" />
                            {formatSalary(job.salary)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">{formatDate(job.postedAt)}</div>
                      <div className="flex items-center gap-1 font-medium text-blue-600 transition-colors group-hover:text-blue-700">
                        {isRTL ? 'التفاصيل' : 'View Details'}
                        {isRTL ? (
                          <ArrowLeft className="size-4" />
                        ) : (
                          <ArrowRight className="size-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white py-16 text-center shadow-md">
            <Briefcase className="mx-auto mb-4 size-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {isRTL ? 'لا توجد وظائف متاحة' : 'No jobs found'}
            </h3>
            <p className="text-gray-600">
              {isRTL
                ? 'جرب تعديل فلتر البحث أو تحقق لاحقاً'
                : 'Try adjusting your search filters or check back later'}
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {isRTL ? 'لماذا تعمل معنا؟' : 'Why Work With Us?'}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {isRTL
                ? 'نحن نؤمن بأن الموظفين السعداء يصنعون منتجات رائعة. لهذا نوفر بيئة عمل استثنائية.'
                : 'We believe that happy employees make great products. That is why we provide an exceptional work environment.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100">
                  <benefit.icon className="size-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {isRTL ? benefit.titleAr : benefit.titleEn}
                </h3>
                <p className="text-gray-600">
                  {isRTL ? benefit.descriptionAr : benefit.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {isRTL ? 'لم تجد الوظيفة المناسبة؟' : "Didn't find the right job?"}
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            {isRTL
              ? 'أرسل سيرتك الذاتية وسنتواصل معك عندما تتوفر فرصة مناسبة'
              : 'Send us your resume and we will contact you when a suitable opportunity arises'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
            {isRTL ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
