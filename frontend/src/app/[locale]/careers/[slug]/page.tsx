'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Upload,
  Send,
  Building,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
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
  postedAt: string;
  deadline?: string;
  applicationsCount: number;
}

// Mock job data
const mockJob: Job = {
  id: '1',
  title: { ar: 'مطور واجهات أمامية - React', en: 'Frontend Developer - React' },
  slug: 'frontend-developer-react',
  department: { id: '1', nameAr: 'الهندسة', nameEn: 'Engineering' },
  location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
  type: 'full-time',
  experience: '3-5 years',
  salary: { min: 15000, max: 25000, currency: 'EGP' },
  description: {
    ar: `نحن نبحث عن مطور واجهات أمامية متميز للانضمام إلى فريقنا المتنامي. ستعمل على مشاريع مثيرة باستخدام أحدث التقنيات مثل React و Next.js و TypeScript.

في هذا الدور، ستكون مسؤولاً عن بناء واجهات مستخدم عالية الجودة وسريعة الاستجابة. ستعمل بشكل وثيق مع فريق التصميم وفريق الخلفية لتقديم تجارب مستخدم استثنائية.

نحن نبحث عن شخص شغوف بالتقنية ويحب التعلم المستمر. إذا كنت تستمتع بحل المشاكل المعقدة وبناء منتجات رائعة، فهذه الوظيفة مناسبة لك!`,
    en: `We are looking for an exceptional frontend developer to join our growing team. You will work on exciting projects using the latest technologies like React, Next.js, and TypeScript.

In this role, you will be responsible for building high-quality, responsive user interfaces. You will work closely with the design team and backend team to deliver exceptional user experiences.

We are looking for someone who is passionate about technology and loves continuous learning. If you enjoy solving complex problems and building great products, this job is for you!`,
  },
  requirements: {
    ar: [
      'خبرة 3+ سنوات في تطوير الواجهات الأمامية',
      'إتقان React.js و TypeScript',
      'خبرة في Next.js و Server-Side Rendering',
      'معرفة جيدة بـ HTML5، CSS3، و JavaScript ES6+',
      'خبرة في استخدام Git و GitHub',
      'معرفة بأدوات إدارة الحالة مثل Redux أو Zustand',
      'فهم جيد لمبادئ تصميم واجهات المستخدم و UX',
      'القدرة على العمل ضمن فريق والتواصل الفعال',
      'إجادة اللغة الإنجليزية تحدثاً وكتابة',
    ],
    en: [
      '3+ years of frontend development experience',
      'Proficiency in React.js and TypeScript',
      'Experience with Next.js and Server-Side Rendering',
      'Strong knowledge of HTML5, CSS3, and JavaScript ES6+',
      'Experience with Git and GitHub',
      'Knowledge of state management tools like Redux or Zustand',
      'Good understanding of UI design principles and UX',
      'Ability to work in a team and communicate effectively',
      'Fluent in English (spoken and written)',
    ],
  },
  responsibilities: {
    ar: [
      'تطوير وصيانة تطبيقات الويب باستخدام React و Next.js',
      'كتابة كود نظيف وقابل للصيانة وإعادة الاستخدام',
      'تحسين أداء التطبيقات وضمان سرعة التحميل',
      'التعاون مع فريق التصميم لتحويل التصاميم إلى كود',
      'مراجعة كود الزملاء وتقديم ملاحظات بناءة',
      'المشاركة في اجتماعات التخطيط وتقدير المهام',
      'البقاء على اطلاع بأحدث التقنيات والممارسات',
      'توثيق الكود والمكونات للفريق',
    ],
    en: [
      'Develop and maintain web applications using React and Next.js',
      'Write clean, maintainable, and reusable code',
      'Optimize application performance and ensure fast loading',
      'Collaborate with design team to convert designs into code',
      'Review colleagues code and provide constructive feedback',
      'Participate in planning meetings and task estimation',
      'Stay up-to-date with latest technologies and practices',
      'Document code and components for the team',
    ],
  },
  benefits: {
    ar: [
      'تأمين صحي شامل للفرد والعائلة',
      'راتب تنافسي مع مراجعة سنوية',
      'بيئة عمل مرنة (هجين أو عن بعد)',
      'إجازة سنوية مدفوعة 21 يوم',
      'برامج تدريب وتطوير مستمر',
      'اشتراك في منصات التعلم الإلكتروني',
      'بيئة عمل ودية وداعمة',
      'فرص للترقي والنمو المهني',
    ],
    en: [
      'Comprehensive health insurance for individual and family',
      'Competitive salary with annual review',
      'Flexible work environment (hybrid or remote)',
      '21 days paid annual leave',
      'Continuous training and development programs',
      'Subscription to e-learning platforms',
      'Friendly and supportive work environment',
      'Opportunities for promotion and career growth',
    ],
  },
  postedAt: '2024-01-15',
  deadline: '2024-02-15',
  applicationsCount: 24,
};

// Related jobs
const relatedJobs = [
  {
    id: '2',
    title: { ar: 'مطور خلفي - Node.js', en: 'Backend Developer - Node.js' },
    slug: 'backend-developer-nodejs',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    type: 'full-time' as const,
  },
  {
    id: '3',
    title: { ar: 'مطور Full Stack', en: 'Full Stack Developer' },
    slug: 'full-stack-developer',
    location: { ar: 'عن بعد', en: 'Remote' },
    type: 'remote' as const,
  },
];

export default function JobDetailPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    experience: '',
    expectedSalary: '',
    availableFrom: '',
    coverLetter: '',
    resume: null as File | null,
  });

  const job = mockJob;

  const jobTypes: Record<string, { ar: string; en: string }> = {
    'full-time': { ar: 'دوام كامل', en: 'Full-time' },
    'part-time': { ar: 'دوام جزئي', en: 'Part-time' },
    contract: { ar: 'عقد', en: 'Contract' },
    remote: { ar: 'عن بعد', en: 'Remote' },
    internship: { ar: 'تدريب', en: 'Internship' },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return isRTL ? 'تنافسي' : 'Competitive';
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = isRTL ? job.title.ar : job.title.en;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        break;
    }
  };

  const daysUntilDeadline = job.deadline
    ? Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container mx-auto p-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-700">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/careers`} className="text-gray-500 hover:text-gray-700">
              {isRTL ? 'الوظائف' : 'Careers'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{isRTL ? job.title.ar : job.title.en}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Job Header */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    job.type === 'full-time'
                      ? 'bg-green-100 text-green-800'
                      : job.type === 'remote'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isRTL ? jobTypes[job.type].ar : jobTypes[job.type].en}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  {isRTL ? job.department.nameAr : job.department.nameEn}
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {isRTL ? job.title.ar : job.title.en}
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  {isRTL ? job.location.ar : job.location.en}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-5" />
                  {job.experience}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-2">
                    <DollarSign className="size-5" />
                    {formatSalary(job.salary)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsApplying(true)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Send className="size-5" />
                  {isRTL ? 'قدم الآن' : 'Apply Now'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    title="Facebook"
                  >
                    <Facebook className="size-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    title="Twitter"
                  >
                    <Twitter className="size-5" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    title="LinkedIn"
                  >
                    <Linkedin className="size-5" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    title={
                      copiedLink
                        ? isRTL
                          ? 'تم النسخ!'
                          : 'Copied!'
                        : isRTL
                          ? 'نسخ الرابط'
                          : 'Copy Link'
                    }
                  >
                    <LinkIcon className="size-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {isRTL ? 'وصف الوظيفة' : 'Job Description'}
              </h2>
              <div className="whitespace-pre-line text-gray-600">
                {isRTL ? job.description.ar : job.description.en}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {isRTL ? 'المتطلبات' : 'Requirements'}
              </h2>
              <ul className="space-y-3">
                {(isRTL ? job.requirements.ar : job.requirements.en).map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-500" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {isRTL ? 'المسؤوليات' : 'Responsibilities'}
              </h2>
              <ul className="space-y-3">
                {(isRTL ? job.responsibilities.ar : job.responsibilities.en).map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-blue-500" />
                    <span className="text-gray-600">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {isRTL ? 'المميزات' : 'Benefits'}
              </h2>
              <ul className="grid gap-3 md:grid-cols-2">
                {(isRTL ? job.benefits.ar : job.benefits.en).map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-purple-500" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-4 space-y-6">
              {/* Job Summary */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  {isRTL ? 'ملخص الوظيفة' : 'Job Summary'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                      <Calendar className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'تاريخ النشر' : 'Posted On'}</p>
                      <p className="font-medium">{formatDate(job.postedAt)}</p>
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-red-100">
                        <Clock className="size-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'آخر موعد للتقديم' : 'Application Deadline'}
                        </p>
                        <p className="font-medium">{formatDate(job.deadline)}</p>
                        {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
                          <p className="text-sm text-red-600">
                            {isRTL
                              ? `متبقي ${daysUntilDeadline} يوم`
                              : `${daysUntilDeadline} days left`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100">
                      <Users className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {isRTL ? 'عدد المتقدمين' : 'Applications'}
                      </p>
                      <p className="font-medium">
                        {job.applicationsCount} {isRTL ? 'متقدم' : 'applicants'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                      <Building className="size-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'القسم' : 'Department'}</p>
                      <p className="font-medium">
                        {isRTL ? job.department.nameAr : job.department.nameEn}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsApplying(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Send className="size-5" />
                  {isRTL ? 'قدم الآن' : 'Apply Now'}
                </button>
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    {isRTL ? 'وظائف مشابهة' : 'Similar Jobs'}
                  </h3>
                  <div className="space-y-4">
                    {relatedJobs.map(relatedJob => (
                      <Link
                        key={relatedJob.id}
                        href={`/${locale}/careers/${relatedJob.slug}`}
                        className="block rounded-lg border p-4 transition-colors hover:border-blue-500"
                      >
                        <h4 className="mb-1 font-medium text-gray-900">
                          {isRTL ? relatedJob.title.ar : relatedJob.title.en}
                        </h4>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="size-3" />
                          {isRTL ? relatedJob.location.ar : relatedJob.location.en}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
            {!isSubmitted ? (
              <>
                <div className="sticky top-0 border-b bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {isRTL ? 'التقديم على الوظيفة' : 'Apply for this Job'}
                    </h2>
                    <button
                      onClick={() => setIsApplying(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-1 text-gray-600">{isRTL ? job.title.ar : job.title.en}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h3 className="mb-4 font-bold text-gray-900">
                        {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'الاسم الكامل' : 'Full Name'} *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'البريد الإلكتروني' : 'Email'} *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'رقم الهاتف' : 'Phone Number'} *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">LinkedIn</label>
                          <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-3"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div>
                      <h3 className="mb-4 font-bold text-gray-900">
                        {isRTL ? 'المعلومات المهنية' : 'Professional Information'}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'سنوات الخبرة' : 'Years of Experience'} *
                          </label>
                          <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border p-3"
                            placeholder={isRTL ? 'مثال: 4 سنوات' : 'e.g., 4 years'}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'الراتب المتوقع' : 'Expected Salary'}
                          </label>
                          <input
                            type="text"
                            name="expectedSalary"
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-3"
                            placeholder={isRTL ? 'مثال: 20000 جنيه' : 'e.g., 20000 EGP'}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'رابط البورتفوليو' : 'Portfolio URL'}
                          </label>
                          <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-3"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'متاح من تاريخ' : 'Available From'}
                          </label>
                          <input
                            type="date"
                            name="availableFrom"
                            value={formData.availableFrom}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        {isRTL ? 'السيرة الذاتية' : 'Resume'} * (PDF, DOC, DOCX)
                      </label>
                      <div className="rounded-lg border-2 border-dashed p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="resume-upload"
                          required
                        />
                        <label
                          htmlFor="resume-upload"
                          className="flex cursor-pointer flex-col items-center gap-2"
                        >
                          <Upload className="size-8 text-gray-400" />
                          {formData.resume ? (
                            <span className="text-green-600">{formData.resume.name}</span>
                          ) : (
                            <span className="text-gray-600">
                              {isRTL ? 'اضغط لرفع ملف' : 'Click to upload file'}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        {isRTL ? 'خطاب التقديم' : 'Cover Letter'}
                      </label>
                      <textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-lg border p-3"
                        placeholder={
                          isRTL
                            ? 'اكتب لماذا أنت مناسب لهذه الوظيفة...'
                            : 'Write why you are a good fit for this position...'
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="rounded-lg border px-6 py-3 hover:bg-gray-50"
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Send className="size-5" />
                      )}
                      {isRTL ? 'إرسال الطلب' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="size-8 text-green-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Application Submitted Successfully!'}
                </h2>
                <p className="mb-6 text-gray-600">
                  {isRTL
                    ? 'شكراً لتقديمك. سنراجع طلبك ونتواصل معك قريباً.'
                    : 'Thank you for applying. We will review your application and contact you soon.'}
                </p>
                <button
                  onClick={() => {
                    setIsApplying(false);
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      linkedin: '',
                      portfolio: '',
                      experience: '',
                      expectedSalary: '',
                      availableFrom: '',
                      coverLetter: '',
                      resume: null,
                    });
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                  {isRTL ? 'إغلاق' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
