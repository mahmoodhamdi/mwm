'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
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
  Loader2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  getJobBySlug,
  getJobs,
  submitApplication,
  type Job,
  type JobType,
  type JobApplication,
} from '@/services/public';

const jobTypeLabels: Record<JobType, { ar: string; en: string }> = {
  'full-time': { ar: 'دوام كامل', en: 'Full-time' },
  'part-time': { ar: 'دوام جزئي', en: 'Part-time' },
  contract: { ar: 'عقد', en: 'Contract' },
  remote: { ar: 'عن بعد', en: 'Remote' },
  internship: { ar: 'تدريب', en: 'Internship' },
};

export default function JobDetailPage() {
  const locale = useLocale() as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const params = useParams();
  const slug = params.slug as string;

  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    experience: '',
    expectedSalary: '',
    availableFrom: '',
    coverLetter: '',
    education: '',
    resume: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const jobData = await getJobBySlug(slug, locale);

        if (!jobData) {
          setError(isRTL ? 'الوظيفة غير موجودة' : 'Job not found');
          return;
        }

        setJob(jobData);

        // Fetch related jobs (same department)
        if (typeof jobData.department !== 'string') {
          const response = await getJobs({
            department: jobData.department._id,
            status: 'open',
            limit: 3,
            locale,
          });
          if (response.data) {
            setRelatedJobs(response.data.jobs.filter(j => j._id !== jobData._id).slice(0, 2));
          }
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(isRTL ? 'حدث خطأ أثناء تحميل الوظيفة' : 'Error loading job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug, locale, isRTL]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salaryRange?: Job['salaryRange']) => {
    if (!salaryRange || !salaryRange.isPublic) return isRTL ? 'تنافسي' : 'Competitive';
    return `${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()} ${salaryRange.currency}`;
  };

  const getLocalizedText = (text: { ar: string; en: string } | string): string => {
    if (typeof text === 'string') return text;
    return text[locale] || text.en || '';
  };

  const getDepartmentName = (department: Job['department']): string => {
    if (typeof department === 'string') return department;
    return getLocalizedText(department.name);
  };

  const getTypeLabel = (type: JobType) => {
    const labels = jobTypeLabels[type];
    return isRTL ? labels?.ar : labels?.en;
  };

  const getExperienceLabel = (level: Job['experienceLevel']) => {
    const labels: Record<string, { ar: string; en: string }> = {
      entry: { ar: 'مبتدئ', en: 'Entry Level' },
      mid: { ar: 'متوسط', en: 'Mid Level' },
      senior: { ar: 'خبير', en: 'Senior' },
      lead: { ar: 'قائد', en: 'Lead' },
      executive: { ar: 'تنفيذي', en: 'Executive' },
    };
    return isRTL ? labels[level]?.ar : labels[level]?.en;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const applicationData: JobApplication = {
        job: job._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        resume: formData.resume,
        coverLetter: formData.coverLetter,
        linkedIn: formData.linkedin,
        portfolio: formData.portfolio,
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : undefined,
        availableFrom: formData.availableFrom || undefined,
        experience: parseInt(formData.experience) || 0,
        education: formData.education,
      };

      await submitApplication(applicationData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError(isRTL ? 'حدث خطأ أثناء إرسال الطلب' : 'Error submitting application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = job ? getLocalizedText(job.title) : '';

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {error || (isRTL ? 'الوظيفة غير موجودة' : 'Job not found')}
        </h1>
        <Link
          href={`/${locale}/careers`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          {isRTL ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
          {isRTL ? 'العودة إلى الوظائف' : 'Back to Careers'}
        </Link>
      </div>
    );
  }

  const daysUntilDeadline = job.applicationDeadline
    ? Math.ceil(
        (new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
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
            <span className="text-gray-900">{getLocalizedText(job.title)}</span>
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
                  {getTypeLabel(job.type)}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  {getDepartmentName(job.department)}
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {getLocalizedText(job.title)}
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  {getLocalizedText(job.location)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-5" />
                  {getExperienceLabel(job.experienceLevel)}
                </span>
                {job.salaryRange && (
                  <span className="flex items-center gap-2">
                    <DollarSign className="size-5" />
                    {formatSalary(job.salaryRange)}
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
                {getLocalizedText(job.description)}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  {isRTL ? 'المتطلبات' : 'Requirements'}
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-500" />
                      <span className="text-gray-600">{getLocalizedText(req)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  {isRTL ? 'المسؤوليات' : 'Responsibilities'}
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-blue-500" />
                      <span className="text-gray-600">{getLocalizedText(resp)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  {isRTL ? 'المميزات' : 'Benefits'}
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-purple-500" />
                      <span className="text-gray-600">{getLocalizedText(benefit)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                      <p className="font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-red-100">
                        <Clock className="size-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'آخر موعد للتقديم' : 'Application Deadline'}
                        </p>
                        <p className="font-medium">{formatDate(job.applicationDeadline)}</p>
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
                  {job.applicationsCount !== undefined && (
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
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                      <Building className="size-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'القسم' : 'Department'}</p>
                      <p className="font-medium">{getDepartmentName(job.department)}</p>
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
                        key={relatedJob._id}
                        href={`/${locale}/careers/${relatedJob.slug}`}
                        className="block rounded-lg border p-4 transition-colors hover:border-blue-500"
                      >
                        <h4 className="mb-1 font-medium text-gray-900">
                          {getLocalizedText(relatedJob.title)}
                        </h4>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="size-3" />
                          {getLocalizedText(relatedJob.location)}
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
                  <p className="mt-1 text-gray-600">{getLocalizedText(job.title)}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {submitError && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{submitError}</div>
                  )}

                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h3 className="mb-4 font-bold text-gray-900">
                        {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'الاسم الأول' : 'First Name'} *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'اسم العائلة' : 'Last Name'} *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
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
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'الراتب المتوقع' : 'Expected Salary'}
                          </label>
                          <input
                            type="number"
                            name="expectedSalary"
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
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
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            {isRTL ? 'المؤهل الدراسي' : 'Education'}
                          </label>
                          <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-3"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resume URL */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        {isRTL ? 'رابط السيرة الذاتية' : 'Resume URL'} *
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border p-3">
                        <Upload className="size-5 text-gray-400" />
                        <input
                          type="url"
                          name="resume"
                          value={formData.resume}
                          onChange={handleInputChange}
                          required
                          className="w-full outline-none"
                          placeholder={
                            isRTL ? 'رابط Google Drive أو Dropbox' : 'Google Drive or Dropbox link'
                          }
                        />
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
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      linkedin: '',
                      portfolio: '',
                      experience: '',
                      expectedSalary: '',
                      availableFrom: '',
                      coverLetter: '',
                      education: '',
                      resume: '',
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
