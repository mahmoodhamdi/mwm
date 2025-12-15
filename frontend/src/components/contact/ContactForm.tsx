'use client';

/**
 * ContactForm Component
 * مكون نموذج الاتصال
 */

import { forwardRef, HTMLAttributes, useState } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';

// Budget options
export const budgetOptions = [
  { value: 'under_5k', labelAr: 'أقل من 5,000$', labelEn: 'Under $5,000' },
  { value: '5k_10k', labelAr: '5,000$ - 10,000$', labelEn: '$5,000 - $10,000' },
  { value: '10k_25k', labelAr: '10,000$ - 25,000$', labelEn: '$10,000 - $25,000' },
  { value: '25k_50k', labelAr: '25,000$ - 50,000$', labelEn: '$25,000 - $50,000' },
  { value: '50k_100k', labelAr: '50,000$ - 100,000$', labelEn: '$50,000 - $100,000' },
  { value: 'over_100k', labelAr: 'أكثر من 100,000$', labelEn: 'Over $100,000' },
  { value: 'not_sure', labelAr: 'غير متأكد', labelEn: 'Not Sure' },
];

// Preferred contact methods
export const contactMethods = [
  { value: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email' },
  { value: 'phone', labelAr: 'الهاتف', labelEn: 'Phone' },
  { value: 'whatsapp', labelAr: 'واتساب', labelEn: 'WhatsApp' },
];

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  subject: string;
  message: string;
  service?: string;
  budget?: string;
  preferredContact?: string;
  recaptchaToken?: string;
}

export interface ContactFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Available services list */
  services?: Array<{ value: string; labelAr: string; labelEn: string }>;
  /** Show budget field */
  showBudget?: boolean;
  /** Show service field */
  showService?: boolean;
  /** Show company field */
  showCompany?: boolean;
  /** Show website field */
  showWebsite?: boolean;
  /** Show preferred contact field */
  showPreferredContact?: boolean;
  /** Card variant */
  variant?: 'default' | 'minimal' | 'detailed';
  /** Custom submit handler */
  onSubmitSuccess?: (data: ContactFormData) => void;
  /** Custom error handler */
  onSubmitError?: (error: Error) => void;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const ContactForm = forwardRef<HTMLFormElement, ContactFormProps>(
  (
    {
      className,
      services = [],
      showBudget = true,
      showService = true,
      showCompany = true,
      showWebsite = false,
      showPreferredContact = true,
      variant = 'default',
      onSubmitSuccess,
      onSubmitError,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [formData, setFormData] = useState<ContactFormData>({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      subject: '',
      message: '',
      service: '',
      budget: '',
      preferredContact: 'email',
    });

    const [formState, setFormState] = useState<FormState>({
      isSubmitting: false,
      isSuccess: false,
      error: null,
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Translations
    const t = {
      title: isRTL ? 'تواصل معنا' : 'Contact Us',
      subtitle: isRTL ? 'نحن هنا للمساعدة' : "We're here to help",
      name: isRTL ? 'الاسم' : 'Name',
      namePlaceholder: isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name',
      email: isRTL ? 'البريد الإلكتروني' : 'Email',
      emailPlaceholder: isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
      phone: isRTL ? 'رقم الهاتف' : 'Phone',
      phonePlaceholder: isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone number',
      company: isRTL ? 'الشركة' : 'Company',
      companyPlaceholder: isRTL ? 'أدخل اسم شركتك' : 'Enter your company name',
      website: isRTL ? 'الموقع الإلكتروني' : 'Website',
      websitePlaceholder: isRTL ? 'أدخل رابط موقعك' : 'Enter your website URL',
      subject: isRTL ? 'الموضوع' : 'Subject',
      subjectPlaceholder: isRTL ? 'اختر موضوع رسالتك' : 'Choose your message subject',
      message: isRTL ? 'الرسالة' : 'Message',
      messagePlaceholder: isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...',
      service: isRTL ? 'الخدمة المطلوبة' : 'Requested Service',
      servicePlaceholder: isRTL ? 'اختر الخدمة' : 'Select a service',
      budget: isRTL ? 'الميزانية المتوقعة' : 'Expected Budget',
      budgetPlaceholder: isRTL ? 'اختر الميزانية' : 'Select budget range',
      preferredContact: isRTL ? 'طريقة التواصل المفضلة' : 'Preferred Contact Method',
      submit: isRTL ? 'إرسال الرسالة' : 'Send Message',
      submitting: isRTL ? 'جاري الإرسال...' : 'Sending...',
      successTitle: isRTL ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!',
      successMessage: isRTL
        ? 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.'
        : "Thank you for contacting us. We'll get back to you as soon as possible.",
      sendAnother: isRTL ? 'إرسال رسالة أخرى' : 'Send Another Message',
      required: isRTL ? 'مطلوب' : 'Required',
      optional: isRTL ? 'اختياري' : 'Optional',
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear field error when user starts typing
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    };

    const validateForm = (): boolean => {
      const errors: Record<string, string> = {};

      if (!formData.name.trim()) {
        errors.name = isRTL ? 'الاسم مطلوب' : 'Name is required';
      } else if (formData.name.length < 2) {
        errors.name = isRTL ? 'الاسم قصير جداً' : 'Name is too short';
      }

      if (!formData.email.trim()) {
        errors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
      }

      if (!formData.subject.trim()) {
        errors.subject = isRTL ? 'الموضوع مطلوب' : 'Subject is required';
      } else if (formData.subject.length < 5) {
        errors.subject = isRTL ? 'الموضوع قصير جداً' : 'Subject is too short';
      }

      if (!formData.message.trim()) {
        errors.message = isRTL ? 'الرسالة مطلوبة' : 'Message is required';
      } else if (formData.message.length < 10) {
        errors.message = isRTL ? 'الرسالة قصيرة جداً' : 'Message is too short';
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setFormState({ isSubmitting: true, isSuccess: false, error: null });

      try {
        // Submit contact form
        await apiClient.post('/contact', formData);

        setFormState({ isSubmitting: false, isSuccess: true, error: null });
        onSubmitSuccess?.(formData);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          website: '',
          subject: '',
          message: '',
          service: '',
          budget: '',
          preferredContact: 'email',
        });
      } catch (err) {
        const error = err as Error;
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: error.message || (isRTL ? 'حدث خطأ أثناء الإرسال' : 'An error occurred'),
        });
        onSubmitError?.(error);
      }
    };

    const resetForm = () => {
      setFormState({ isSubmitting: false, isSuccess: false, error: null });
      setFieldErrors({});
    };

    // Success state
    if (formState.isSuccess) {
      return (
        <div
          className={cn(
            'rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800',
            className
          )}
        >
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircleIcon className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {t.successTitle}
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{t.successMessage}</p>
          <button
            type="button"
            onClick={resetForm}
            className="bg-primary-600 hover:bg-primary-700 rounded-full px-6 py-3 font-medium text-white transition-colors"
          >
            {t.sendAnother}
          </button>
        </div>
      );
    }

    // Minimal variant
    if (variant === 'minimal') {
      return (
        <form ref={ref} onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
          {/* Error Alert */}
          {formState.error && (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <ExclamationCircleIcon className="size-5 shrink-0" />
              <p>{formState.error}</p>
            </div>
          )}

          {/* Name & Email Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="minimal-name" className="sr-only">
                {t.name}
              </label>
              <input
                type="text"
                id="minimal-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.name}
                aria-required="true"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'minimal-name-error' : undefined}
                className={cn(
                  'focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                  fieldErrors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
              {fieldErrors.name && (
                <p id="minimal-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="minimal-email" className="sr-only">
                {t.email}
              </label>
              <input
                type="email"
                id="minimal-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.email}
                aria-required="true"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'minimal-email-error' : undefined}
                className={cn(
                  'focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                  fieldErrors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
              {fieldErrors.email && (
                <p id="minimal-email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="minimal-subject" className="sr-only">
              {t.subject}
            </label>
            <input
              type="text"
              id="minimal-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t.subject}
              aria-required="true"
              aria-invalid={!!fieldErrors.subject}
              aria-describedby={fieldErrors.subject ? 'minimal-subject-error' : undefined}
              className={cn(
                'focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                fieldErrors.subject && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
            />
            {fieldErrors.subject && (
              <p id="minimal-subject-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="minimal-message" className="sr-only">
              {t.message}
            </label>
            <textarea
              id="minimal-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t.message}
              rows={4}
              aria-required="true"
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? 'minimal-message-error' : undefined}
              className={cn(
                'focus:border-primary-500 focus:ring-primary-500/20 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                fieldErrors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
            />
            {fieldErrors.message && (
              <p id="minimal-message-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 w-full rounded-lg px-6 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed"
          >
            {formState.isSubmitting ? t.submitting : t.submit}
          </button>
        </form>
      );
    }

    // Default and Detailed variants
    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn('rounded-2xl bg-white p-6 shadow-lg md:p-8 dark:bg-gray-800', className)}
        {...props}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
        </div>

        {/* Error Alert */}
        {formState.error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <ExclamationCircleIcon className="size-5 shrink-0" />
            <p>{formState.error}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Name & Email Row */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="form-name"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span>{t.name}</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'form-name-error' : undefined}
                  className={cn(
                    'focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-11 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                    fieldErrors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              {fieldErrors.name && (
                <p id="form-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="form-email"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span>{t.email}</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="form-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'form-email-error' : undefined}
                  className={cn(
                    'focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-11 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                    fieldErrors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                  <EnvelopeIcon className="size-5" />
                </div>
              </div>
              {fieldErrors.email && (
                <p id="form-email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Company Row */}
          {(showCompany || variant === 'detailed') && (
            <div className="grid gap-5 md:grid-cols-2">
              {/* Phone */}
              <div>
                <label
                  htmlFor="form-phone"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <span>{t.phone}</span>
                  <span className="text-xs text-gray-400">({t.optional})</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="form-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                    className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-11 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                    <PhoneIcon className="size-5" />
                  </div>
                </div>
              </div>

              {/* Company */}
              {showCompany && (
                <div>
                  <label
                    htmlFor="form-company"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span>{t.company}</span>
                    <span className="text-xs text-gray-400">({t.optional})</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="form-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={t.companyPlaceholder}
                      className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-11 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                      <BuildingOfficeIcon className="size-5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Website (detailed only) */}
          {(showWebsite || variant === 'detailed') && (
            <div>
              <label
                htmlFor="form-website"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span>{t.website}</span>
                <span className="text-xs text-gray-400">({t.optional})</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="form-website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder={t.websitePlaceholder}
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-11 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                  <GlobeAltIcon className="size-5" />
                </div>
              </div>
            </div>
          )}

          {/* Service & Budget Row */}
          {(showService || showBudget) && services.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {/* Service */}
              {showService && services.length > 0 && (
                <div>
                  <label
                    htmlFor="form-service"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span>{t.service}</span>
                    <span className="text-xs text-gray-400">({t.optional})</span>
                  </label>
                  <select
                    id="form-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">{t.servicePlaceholder}</option>
                    {services.map(service => (
                      <option key={service.value} value={service.value}>
                        {isRTL ? service.labelAr : service.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Budget */}
              {showBudget && (
                <div>
                  <label
                    htmlFor="form-budget"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span>{t.budget}</span>
                    <span className="text-xs text-gray-400">({t.optional})</span>
                  </label>
                  <select
                    id="form-budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">{t.budgetPlaceholder}</option>
                    {budgetOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {isRTL ? option.labelAr : option.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Preferred Contact */}
          {showPreferredContact && (
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.preferredContact}
              </label>
              <div className="flex flex-wrap gap-3">
                {contactMethods.map(method => (
                  <label
                    key={method.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                      formData.preferredContact === method.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method.value}
                      checked={formData.preferredContact === method.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>{isRTL ? method.labelAr : method.labelEn}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label
              htmlFor="form-subject"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span>{t.subject}</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="form-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t.subjectPlaceholder}
              aria-required="true"
              aria-invalid={!!fieldErrors.subject}
              aria-describedby={fieldErrors.subject ? 'form-subject-error' : undefined}
              className={cn(
                'focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                fieldErrors.subject && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
            />
            {fieldErrors.subject && (
              <p id="form-subject-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="form-message"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span>{t.message}</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="form-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.messagePlaceholder}
                rows={5}
                aria-required="true"
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? 'form-message-error' : undefined}
                className={cn(
                  'focus:border-primary-500 focus:ring-primary-500/20 w-full resize-none rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-11 text-gray-900 transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
                  fieldErrors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
              <div className="pointer-events-none absolute start-0 top-3 flex items-center ps-4 text-gray-400">
                <ChatBubbleBottomCenterTextIcon className="size-5" />
              </div>
            </div>
            {fieldErrors.message && (
              <p id="form-message-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 w-full rounded-lg px-6 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed"
          >
            {formState.isSubmitting ? t.submitting : t.submit}
          </button>
        </div>
      </form>
    );
  }
);

ContactForm.displayName = 'ContactForm';

export { ContactForm };
export default ContactForm;
