# MWM - Integrated Software Solutions

## Full Project Plan (Enhanced Edition v2.0)

## خطة المشروع الشاملة - النسخة المحسنة

---

<a id="top"></a>

## جدول المحتويات | Table of Contents

| #   | القسم                      | Section                   | الرابط                                                            |
| --- | -------------------------- | ------------------------- | ----------------------------------------------------------------- |
| 1   | نظرة عامة                  | Project Overview          | [🔗](#1-project-overview--نظرة-عامة)                              |
| 2   | المبادئ وأفضل الممارسات    | Core Principles           | [🔗](#2-core-principles--best-practices--المبادئ-وأفضل-الممارسات) |
| 3   | هيكل المشروع               | Project Structure         | [🔗](#3-project-structure--هيكل-المشروع)                          |
| 4   | نظام الترجمة               | Localization System       | [🔗](#4-localization-system--نظام-الترجمة-والتعريب)               |
| 5   | نظام الإعدادات الديناميكية | Dynamic Configuration     | [🔗](#5-dynamic-configuration-system--نظام-الإعدادات-الديناميكية) |
| 6   | الميزات الكاملة            | Complete Features         | [🔗](#6-complete-features--الميزات-الكاملة)                       |
| 7   | هيكل قاعدة البيانات        | Database Schema           | [🔗](#7-database-schema--هيكل-قاعدة-البيانات)                     |
| 8   | توثيق الـ API              | API Documentation         | [🔗](#8-api-documentation--توثيق-الـ-api)                         |
| 9   | استراتيجية السيو           | SEO Strategy              | [🔗](#9-seo-strategy--استراتيجية-السيو)                           |
| 10  | استراتيجية الاختبارات      | Testing Strategy          | [🔗](#10-testing-strategy--استراتيجية-الاختبارات)                 |
| 11  | نظام معالجة الأخطاء        | Error Handling            | [🔗](#11-error-handling-system--نظام-معالجة-الأخطاء)              |
| 12  | تطبيق الأمان               | Security Implementation   | [🔗](#12-security-implementation--تطبيق-الأمان)                   |
| 13  | تحسين الأداء               | Performance Optimization  | [🔗](#13-performance-optimization--تحسين-الأداء)                  |
| 14  | مراحل التطوير              | Development Phases        | [🔗](#14-development-phases--مراحل-التطوير)                       |
| 15  | DevOps & CI/CD             | DevOps & CI/CD            | [🔗](#15-devops--cicd)                                            |
| 16  | إعدادات البيئة             | Environment Configuration | [🔗](#16-environment-configuration--إعدادات-البيئة)               |

---

<a id="1-project-overview--نظرة-عامة"></a>

## 1. Project Overview | نظرة عامة

### الرؤية | Vision

إنشاء موقع احترافي عالمي المستوى، قابل للتخصيص بالكامل، ومتعدد اللغات لوكالة تطوير.

Create a world-class, fully customizable, multilingual development agency website.

### الأهداف الرئيسية | Key Goals

| الهدف                | الوصف                              | Goal                  | Description                    |
| -------------------- | ---------------------------------- | --------------------- | ------------------------------ |
| 🎨 قابل للتخصيص 100% | كل شيء قابل للتعديل من لوحة التحكم | 100% Customizable     | Everything editable from admin |
| 🌍 متعدد اللغات      | عربي + إنجليزي + قابل للتوسع       | Multilingual          | Arabic + English + Extensible  |
| 🔍 سيو متقدم         | تحسين محركات البحث بأعلى المعايير  | Advanced SEO          | Search engine optimization     |
| 🔒 أمان مؤسسي        | حماية على مستوى المؤسسات           | Enterprise Security   | Bank-level security            |
| ✅ اختبارات شاملة    | تغطية 80%+ للكود                   | Comprehensive Testing | 80%+ code coverage             |
| ♿ إمكانية الوصول    | متوافق مع WCAG 2.1 AA              | Accessibility         | WCAG 2.1 AA compliant          |

### مقاييس النجاح | Success Metrics

```yaml
Performance:
  - Lighthouse Score: 95+ (all categories)
  - Core Web Vitals: All green
  - Page Load Time: < 2 seconds
  - Time to First Byte: < 200ms

Quality:
  - Test Coverage: 80%+ critical paths
  - Zero critical security vulnerabilities
  - WCAG 2.1 AA compliance
  - SEO Score: 95+
```

### التقنيات المستخدمة | Tech Stack

```yaml
Frontend:
  - Next.js 14 (App Router)
  - React 18 + TypeScript 5
  - Tailwind CSS 3 + RTL support
  - Framer Motion
  - Zustand + React Query
  - next-intl (i18n)

Backend:
  - Node.js 20 LTS
  - Express.js 4 + TypeScript
  - MongoDB 7 + Mongoose 8
  - Redis 7 (caching)
  - JWT + Refresh Tokens
  - Socket.io (real-time)

DevOps:
  - Docker + Docker Compose
  - GitHub Actions (CI/CD)
  - Nginx (reverse proxy)
  - Cloudinary (media)
```

---

<a id="2-core-principles--best-practices--المبادئ-وأفضل-الممارسات"></a>

## 2. Core Principles & Best Practices | المبادئ وأفضل الممارسات

### 2.1 معايير جودة الكود | Code Quality Standards

```yaml
TypeScript:
  - Strict mode: ENABLED
  - No any: ENFORCED
  - No implicit returns: ENFORCED

Naming Conventions:
  Files:
    - Components: PascalCase (Button.tsx)
    - Utilities: camelCase (formatDate.ts)
    - Constants: SCREAMING_SNAKE_CASE
    - Types: PascalCase with prefix (IUser, TResponse)

  Variables:
    - Boolean: isActive, hasPermission, canEdit
    - Arrays: users, items (plural)
    - Functions: verb + noun (getUser, createProject)
    - Handlers: handle + Event (handleClick)

Architecture:
  Backend:
    - Repository Pattern: Data access
    - Service Layer: Business logic
    - Controller Layer: HTTP handling
    - Middleware: Cross-cutting concerns

  Frontend:
    - Feature-based structure
    - Custom hooks for logic
    - Context for global state
    - React Query for server state
```

### 2.2 Git Workflow | سير عمل Git

```yaml
Branches:
  main: Production code only
  develop: Integration branch
  feature/*: New features
  bugfix/*: Bug fixes
  hotfix/*: Production fixes
  release/*: Release preparation

Commit Format: # Conventional Commits
  type(scope): description

  Types:
    feat: New feature
    fix: Bug fix
    docs: Documentation
    style: Formatting
    refactor: Code restructuring
    test: Adding tests
    chore: Maintenance

PR Requirements:
  - ✅ 1+ approval required
  - ✅ All tests pass
  - ✅ No merge conflicts
  - ✅ Lint checks passed
  - ✅ Build successful
  - ✅ Coverage maintained
```

### 2.3 تعريف الإنجاز | Definition of Done

```yaml
Code Checklist:
  - [ ] TypeScript strict mode passes
  - [ ] ESLint passes (no warnings)
  - [ ] No console.log statements
  - [ ] Self-documenting with JSDoc

Testing Checklist:
  - [ ] Unit tests written & passing
  - [ ] Integration tests written & passing
  - [ ] E2E tests for critical paths
  - [ ] Coverage meets threshold (80%)

Localization Checklist:
  - [ ] All strings externalized
  - [ ] Arabic translation provided
  - [ ] English translation provided
  - [ ] RTL layout tested
  - [ ] Date/number formatting localized

Accessibility Checklist:
  - [ ] Keyboard navigation works
  - [ ] Screen reader tested
  - [ ] Color contrast WCAG AA
  - [ ] Focus indicators visible
  - [ ] Alt text for images

SEO Checklist:
  - [ ] Meta tags configured
  - [ ] Structured data added
  - [ ] Semantic HTML used
  - [ ] Performance optimized
```

---

<a id="3-project-structure--هيكل-المشروع"></a>

## 3. Project Structure | هيكل المشروع

```
mwm/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── cd.yml              # Continuous Deployment
│   │   └── security-scan.yml   # Security scanning
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   └── docker-compose.test.yml
│
├── packages/
│   └── shared/                  # Shared types & utilities
│       └── src/
│           ├── types/
│           ├── constants/
│           └── utils/
│
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── config/             # Configuration
│   │   ├── constants/          # Error messages (ar/en)
│   │   ├── types/              # TypeScript types
│   │   ├── models/             # Mongoose models
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic
│   │   ├── controllers/        # HTTP handlers
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Express middleware
│   │   ├── validations/        # Input validation
│   │   ├── utils/              # Utility functions
│   │   ├── jobs/               # Background jobs
│   │   └── sockets/            # Real-time
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
├── frontend/
│   ├── public/
│   │   └── locales/            # Translation files
│   │       ├── ar/
│   │       │   ├── common.json
│   │       │   ├── home.json
│   │       │   └── ...
│   │       └── en/
│   │           └── ...
│   └── src/
│       ├── app/
│       │   └── [locale]/       # Locale-based routing
│       │       ├── (main)/     # Public pages
│       │       ├── (admin)/    # Admin dashboard
│       │       └── (auth)/     # Auth pages
│       ├── components/
│       │   ├── ui/             # Base components
│       │   ├── common/         # Shared components
│       │   ├── sections/       # Page sections
│       │   ├── forms/          # Form components
│       │   └── admin/          # Admin components
│       ├── hooks/              # Custom hooks
│       ├── lib/                # Libraries
│       │   ├── api/            # API client
│       │   ├── i18n/           # Internationalization
│       │   └── seo/            # SEO utilities
│       ├── store/              # State management
│       └── types/              # TypeScript types
│
└── nginx/
    └── nginx.conf
```

---

<a id="4-localization-system--نظام-الترجمة-والتعريب"></a>

## 4. Localization System | نظام الترجمة والتعريب

### 4.1 Configuration | الإعدادات

```typescript
// lib/i18n/config.ts

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export const localeConfig = {
  ar: {
    name: 'العربية',
    dir: 'rtl',
    dateFormat: 'dd/MM/yyyy',
    currency: 'EGP',
  },
  en: {
    name: 'English',
    dir: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD',
  },
};
```

### 4.2 Translation Files Structure | هيكل ملفات الترجمة

```json
// public/locales/ar/common.json
{
  "navigation": {
    "home": "الرئيسية",
    "about": "من نحن",
    "services": "خدماتنا",
    "portfolio": "أعمالنا",
    "team": "فريقنا",
    "blog": "المدونة",
    "contact": "تواصل معنا",
    "careers": "الوظائف"
  },
  "buttons": {
    "submit": "إرسال",
    "cancel": "إلغاء",
    "save": "حفظ",
    "delete": "حذف",
    "edit": "تعديل",
    "loadMore": "تحميل المزيد",
    "getStarted": "ابدأ الآن",
    "learnMore": "اعرف المزيد",
    "contactUs": "تواصل معنا"
  },
  "forms": {
    "name": "الاسم",
    "email": "البريد الإلكتروني",
    "phone": "رقم الهاتف",
    "message": "الرسالة",
    "required": "هذا الحقل مطلوب",
    "invalidEmail": "البريد الإلكتروني غير صحيح"
  },
  "errors": {
    "general": "حدث خطأ غير متوقع",
    "notFound": "الصفحة غير موجودة",
    "serverError": "خطأ في الخادم",
    "unauthorized": "غير مصرح"
  }
}
```

```json
// public/locales/en/common.json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "portfolio": "Portfolio",
    "team": "Team",
    "blog": "Blog",
    "contact": "Contact",
    "careers": "Careers"
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "loadMore": "Load More",
    "getStarted": "Get Started",
    "learnMore": "Learn More",
    "contactUs": "Contact Us"
  },
  "forms": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "message": "Message",
    "required": "This field is required",
    "invalidEmail": "Invalid email address"
  },
  "errors": {
    "general": "An unexpected error occurred",
    "notFound": "Page not found",
    "serverError": "Server error",
    "unauthorized": "Unauthorized"
  }
}
```

### 4.3 Translation Hook | هوك الترجمة

```typescript
// hooks/useTranslation.ts

export function useTranslation(namespace?: string) {
  const locale = useLocale();

  const t = useCallback(
    (key: string, params?: Record<string, any>) => {
      // Get translation with interpolation support
      // t('greeting', { name: 'أحمد' }) => "مرحباً أحمد"
    },
    [locale, namespace]
  );

  const formatDate = useCallback(
    (date: Date) => {
      return new Intl.DateTimeFormat(locale).format(date);
    },
    [locale]
  );

  const formatNumber = useCallback(
    (num: number) => {
      return new Intl.NumberFormat(locale).format(num);
    },
    [locale]
  );

  const formatCurrency = useCallback(
    (amount: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: locale === 'ar' ? 'EGP' : 'USD',
      }).format(amount);
    },
    [locale]
  );

  return {
    t,
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    formatDate,
    formatNumber,
    formatCurrency,
  };
}
```

### 4.4 RTL Support | دعم RTL

```css
/* styles/rtl.css */

[dir='rtl'] {
  direction: rtl;
  text-align: right;
}

/* Logical properties - work for both RTL and LTR */
.margin-start {
  margin-inline-start: 1rem;
}
.margin-end {
  margin-inline-end: 1rem;
}
.padding-start {
  padding-inline-start: 1rem;
}
.padding-end {
  padding-inline-end: 1rem;
}
.text-start {
  text-align: start;
}
.text-end {
  text-align: end;
}
.start-0 {
  inset-inline-start: 0;
}
.end-0 {
  inset-inline-end: 0;
}
```

### 4.5 Database Translation Model | نموذج الترجمة في قاعدة البيانات

```typescript
// models/Translation.ts

interface ITranslation {
  key: string; // "home.hero.title"
  namespace: string; // "home"
  translations: {
    ar: string;
    en: string;
    [locale: string]: string; // Extensible
  };
  description?: string; // Admin reference
  isSystem: boolean; // System vs user-created
}
```

---

<a id="5-dynamic-configuration-system--نظام-الإعدادات-الديناميكية"></a>

## 5. Dynamic Configuration System | نظام الإعدادات الديناميكية

### 5.1 Everything is Configurable | كل شيء قابل للتعديل

```yaml
من لوحة التحكم يمكن تعديل: ✅ المحتوى النصي (جميع الصفحات)
  ✅ الصور والوسائط
  ✅ الألوان والثيمات
  ✅ القوائم والتنقل
  ✅ معلومات التواصل
  ✅ روابط السوشيال ميديا
  ✅ إعدادات السيو
  ✅ تفعيل/تعطيل الميزات
  ✅ ترتيب الأقسام
  ✅ الترجمات
```

### 5.2 Site Content Model (CMS)

```typescript
// models/SiteContent.ts

interface ISiteContent {
  key: string;           // "home.hero.title"
  type: 'text' | 'html' | 'image' | 'array' | 'object';
  content: {
    ar: any;
    en: any;
  };
  section: string;       // "home", "about", etc.
  order?: number;
  isActive: boolean;
}

// Example content
{
  key: "home.hero.title",
  type: "text",
  content: {
    ar: "نحول أفكارك إلى واقع رقمي",
    en: "We Turn Your Ideas Into Digital Reality"
  },
  section: "home"
}
```

### 5.3 Settings Model | نموذج الإعدادات

```typescript
interface ISettings {
  // General
  general: {
    siteName: { ar: string; en: string };
    siteTagline: { ar: string; en: string };
    logo: { light: string; dark: string };
    favicon: string;
    defaultLanguage: 'ar' | 'en';
    maintenanceMode: boolean;
  };

  // Contact
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: { ar: string; en: string };
    location: { lat: number; lng: number };
    workingHours: { ar: string; en: string };
  };

  // Social Media
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
  };

  // SEO Defaults
  seo: {
    defaultTitle: { ar: string; en: string };
    defaultDescription: { ar: string; en: string };
    defaultKeywords: { ar: string[]; en: string[] };
    ogImage: string;
    googleAnalyticsId: string;
  };

  // Feature Toggles
  features: {
    blog: boolean;
    careers: boolean;
    newsletter: boolean;
    testimonials: boolean;
    darkMode: boolean;
    multiLanguage: boolean;
  };

  // Homepage Sections
  homepage: {
    heroEnabled: boolean;
    servicesEnabled: boolean;
    portfolioEnabled: boolean;
    statsEnabled: boolean;
    testimonialsEnabled: boolean;
    sectionsOrder: string[];
  };

  // Theme
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fonts: {
      heading: string;
      body: string;
      arabic: string;
    };
  };
}
```

### 5.4 Menu Builder | منشئ القوائم

```typescript
interface IMenuItem {
  id: string;
  label: { ar: string; en: string };
  url: string;
  type: 'internal' | 'external';
  target: '_self' | '_blank';
  icon?: string;
  children?: IMenuItem[];
  order: number;
  isActive: boolean;
}

interface IMenu {
  name: string; // "main", "footer", "mobile"
  location: 'header' | 'footer' | 'sidebar';
  items: IMenuItem[];
  isActive: boolean;
}
```

---

<a id="6-complete-features--الميزات-الكاملة"></a>

## 6. Complete Features | الميزات الكاملة

### 6.1 Public Website | الموقع العام

#### الصفحة الرئيسية | Home Page

```yaml
Hero Section:
  - عنوان رئيسي متحرك (قابل للتعديل)
  - تأثير الكتابة التلقائية
  - أزرار CTA (قابلة للتخصيص)
  - خلفية فيديو/صورة
  - عداد الإحصائيات

Services Overview:
  - شبكة خدمات (3-6 عناصر)
  - أيقونة + عنوان + وصف
  - تأثيرات hover
  - رابط للصفحة الكاملة

Featured Projects:
  - كاروسيل/شبكة المشاريع
  - فلتر حسب الفئة
  - كارت المشروع مع hover
  - معاينة سريعة

Statistics Section:
  - عدادات متحركة
  - مشاريع منجزة / عملاء سعداء / سنوات خبرة

Testimonials:
  - سلايدر الشهادات
  - صورة + اسم + منصب
  - تقييم بالنجوم

Tech Stack:
  - أيقونات التقنيات
  - تجميع حسب الفئة
  - تأثير hover

Clients Marquee:
  - شعارات العملاء
  - تمرير لا نهائي

Latest Blog:
  - آخر 3 مقالات
  - صورة + عنوان + مقتطف
```

#### صفحة الخدمات | Services Page

```yaml
Services List:
  - عرض شبكي/قائمة
  - فلتر وبحث
  - كارت خدمة مع تفاصيل

Service Detail Page:
  - Hero section
  - وصف تفصيلي
  - خطوات العمل
  - باقات الأسعار (اختياري)
  - أسئلة شائعة
  - مشاريع مرتبطة
  - CTA
```

#### صفحة الأعمال | Portfolio Page

```yaml
Portfolio Grid:
  - تخطيط Masonry/Grid
  - فلتر حسب:
      - الفئة
      - التقنية
      - الصناعة
  - بحث
  - معاينة سريعة

Project Detail:
  - Hero image/video
  - نظرة عامة
  - التحديات والحلول
  - النتائج والتأثير
  - التقنيات المستخدمة
  - معرض الصور
  - شهادة العميل
  - مشاريع مرتبطة
```

#### صفحة الفريق | Team Page

```yaml
Team Grid:
  - فلتر حسب القسم
  - بحث بالاسم
  - كارت عضو مع hover

Member Profile:
  - صورة كبيرة
  - الاسم والمنصب
  - السيرة الذاتية
  - المهارات (مرئي)
  - المشاريع
  - السوشيال ميديا
```

#### المدونة | Blog

```yaml
Blog Listing:
  - Grid/List view
  - Featured posts
  - فلتر وبحث
  - تصنيفات وتاغز
  - Pagination

Blog Post:
  - صورة بارزة
  - تصنيف وتاغز
  - معلومات الكاتب
  - وقت القراءة
  - جدول المحتويات
  - محتوى غني (code, images, videos)
  - أزرار المشاركة
  - مقالات مرتبطة
  - RSS feed
```

#### صفحة التواصل | Contact Page

```yaml
Contact Form:
  - الاسم (مطلوب)
  - البريد الإلكتروني (مطلوب)
  - الهاتف
  - الشركة
  - نوع الخدمة
  - الميزانية المتوقعة
  - وصف المشروع
  - مرفقات
  - reCAPTCHA

Contact Info:
  - البريد الإلكتروني
  - الهاتف
  - واتساب
  - العنوان
  - خريطة Google
  - ساعات العمل
```

#### صفحة الوظائف | Careers Page

```yaml
Job Listings:
  - فلتر حسب القسم/النوع
  - بحث
  - كارت الوظيفة

Job Detail:
  - المسمى الوظيفي
  - القسم والموقع
  - نطاق الراتب (اختياري)
  - الوصف
  - المتطلبات
  - المسؤوليات
  - المميزات
  - نموذج التقديم
```

### 6.2 Admin Dashboard | لوحة التحكم

#### Dashboard Overview

```yaml
Statistics Cards:
  - إجمالي المشاريع
  - إجمالي الرسائل (جديد)
  - زوار اليوم
  - مشتركي النشرة

Charts:
  - الزيارات (Line chart)
  - مصادر الزيارات (Pie)
  - الرسائل حسب الخدمة (Bar)
  - الأجهزة (Donut)

Recent Activity:
  - آخر الرسائل
  - آخر المشتركين
  - النشاط الأخير
```

#### Content Management | إدارة المحتوى

```yaml
Features:
  - محرر المحتوى لكل قسم
  - دعم AR/EN جنباً لجنب
  - محرر نص غني
  - رفع صور مع crop
  - معاينة مباشرة
  - تاريخ التعديلات
```

#### Projects Management | إدارة المشاريع

```yaml
Projects List:
  - DataTable مع ترتيب
  - Drag & drop للترتيب
  - حالة النشر
  - إجراءات متعددة

Project Editor:
  - معلومات أساسية (AR/EN)
  - الوسائط (صور/فيديو)
  - التقنيات والتصنيفات
  - معلومات العميل
  - شهادة العميل
  - إعدادات SEO
```

#### Blog Management | إدارة المدونة

```yaml
Features:
  - محرر WYSIWYG (TipTap)
  - رفع صور داخل المقال
  - إدارة التصنيفات والتاغز
  - جدولة النشر
  - معاينة المقال
  - تاريخ التعديلات
```

#### Messages Management | إدارة الرسائل

```yaml
Features:
  - صندوق الوارد
  - مقروء/غير مقروء
  - نجمة/مهم
  - رد عبر البريد
  - أرشفة/حذف
  - تصدير CSV
```

#### Users & Permissions | المستخدمين والصلاحيات

```yaml
Roles:
  - Super Admin: صلاحيات كاملة
  - Admin: إدارة المحتوى والمستخدمين
  - Editor: إضافة وتعديل المحتوى
  - Author: كتابة المقالات فقط
  - Viewer: عرض فقط

Permissions:
  - users:read, users:create, users:update, users:delete
  - projects:read, projects:create, projects:update, projects:delete
  - services:*, team:*, blog:*, messages:*
  - settings:read, settings:update
  - analytics:read
```

#### Settings | الإعدادات

```yaml
Sections:
  - الإعدادات العامة
  - معلومات التواصل
  - السوشيال ميديا
  - إعدادات SEO
  - تخصيص الثيم
  - تفعيل الميزات
  - النسخ الاحتياطي
```

---

<a id="7-database-schema--هيكل-قاعدة-البيانات"></a>

## 7. Database Schema | هيكل قاعدة البيانات

### 7.1 Core Models

```typescript
// User Model
interface IUser {
  _id: ObjectId;
  name: string;
  email: string; // unique
  password: string; // hashed
  avatar?: string;
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer';
  customPermissions?: string[];

  isEmailVerified: boolean;
  isActive: boolean;

  twoFactorEnabled: boolean;
  twoFactorSecret?: string;

  refreshTokens: Array<{
    token: string;
    expiresAt: Date;
    device: string;
    ip: string;
  }>;

  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// Project Model
interface IProject {
  _id: ObjectId;

  title: { ar: string; en: string };
  slug: string; // unique
  shortDescription: { ar: string; en: string };
  description: { ar: string; en: string };
  challenge?: { ar: string; en: string };
  solution?: { ar: string; en: string };
  results?: { ar: string; en: string };

  thumbnail: string;
  images: string[];
  video?: string;

  category: ObjectId;
  technologies: string[];

  client?: {
    name: { ar: string; en: string };
    logo?: string;
  };

  testimonial?: {
    text: { ar: string; en: string };
    author: { ar: string; en: string };
    position: { ar: string; en: string };
  };

  liveUrl?: string;
  githubUrl?: string;

  seo: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    keywords: { ar: string[]; en: string[] };
  };

  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  views: number;

  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Service Model
interface IService {
  _id: ObjectId;

  title: { ar: string; en: string };
  slug: string;
  shortDescription: { ar: string; en: string };
  description: { ar: string; en: string };

  icon: string;
  image?: string;

  features: Array<{ ar: string; en: string }>;

  pricing?: Array<{
    name: { ar: string; en: string };
    price: number;
    currency: string;
    features: Array<{ ar: string; en: string }>;
    isPopular: boolean;
  }>;

  faqs: Array<{
    question: { ar: string; en: string };
    answer: { ar: string; en: string };
  }>;

  seo: {
    /* ... */
  };

  isActive: boolean;
  order: number;
}

// BlogPost Model
interface IBlogPost {
  _id: ObjectId;

  title: { ar: string; en: string };
  slug: string;
  content: { ar: string; en: string }; // HTML
  excerpt: { ar: string; en: string };

  thumbnail: string;

  category: ObjectId;
  tags: ObjectId[];
  author: ObjectId;

  views: number;
  readingTime: number;

  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;

  seo: {
    /* ... */
  };

  createdAt: Date;
  updatedAt: Date;
}

// Contact Model
interface IContact {
  _id: ObjectId;

  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: ObjectId;
  budget?: string;
  subject: string;
  message: string;
  attachments?: string[];

  status: 'new' | 'read' | 'replied' | 'archived';
  isStarred: boolean;
  notes?: string;

  ip: string;
  userAgent: string;
  locale: string;

  createdAt: Date;
}
```

### 7.2 Database Indexes

```javascript
// Performance indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ isPublished: 1, isFeatured: 1, order: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ '$**': 'text' }); // Full-text search

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, tags: 1 });

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
```

---

<a id="8-api-documentation--توثيق-الـ-api"></a>

## 8. API Documentation | توثيق الـ API

### 8.1 API Standards

```yaml
Base URL: /api/v1

Response Format (Success):
  {
    "success": true,
    "data": {...},
    "message": "Success",
    "meta": {
      "pagination": {...}
    }
  }

Response Format (Error):
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human readable message",
      "details": [...]
    }
  }

Pagination:
  Query: ?page=1&limit=10
  Response meta.pagination:
    {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true
    }

Filtering: ?status=published&category=web
Sorting: ?sort=createdAt:desc
Fields: ?fields=title,slug,thumbnail
Search: ?search=keyword
Locale: Header Accept-Language: ar
```

### 8.2 API Endpoints

```yaml
# Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
POST   /api/v1/auth/verify-email/:token
GET    /api/v1/auth/me
PUT    /api/v1/auth/me

# Users (Admin)
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

# Projects
GET    /api/v1/projects              # Public
GET    /api/v1/projects/:slug        # Public
GET    /api/v1/projects/featured     # Public
GET    /api/v1/projects/admin        # Admin
POST   /api/v1/projects              # Admin
PUT    /api/v1/projects/:id          # Admin
DELETE /api/v1/projects/:id          # Admin

# Services
GET    /api/v1/services
GET    /api/v1/services/:slug
POST   /api/v1/services              # Admin
PUT    /api/v1/services/:id          # Admin
DELETE /api/v1/services/:id          # Admin

# Team
GET    /api/v1/team
GET    /api/v1/team/:slug
POST   /api/v1/team                  # Admin
PUT    /api/v1/team/:id              # Admin
DELETE /api/v1/team/:id              # Admin

# Blog
GET    /api/v1/blog
GET    /api/v1/blog/:slug
GET    /api/v1/blog/categories
POST   /api/v1/blog                  # Admin
PUT    /api/v1/blog/:id              # Admin
DELETE /api/v1/blog/:id              # Admin

# Contact
POST   /api/v1/contact               # Public
GET    /api/v1/contact/messages      # Admin
PUT    /api/v1/contact/messages/:id  # Admin
DELETE /api/v1/contact/messages/:id  # Admin

# Content (CMS)
GET    /api/v1/content               # Public
GET    /api/v1/content/:key          # Public
PUT    /api/v1/content/:key          # Admin

# Translations
GET    /api/v1/translations/:locale
PUT    /api/v1/translations/:id      # Admin

# Settings
GET    /api/v1/settings/public       # Public
GET    /api/v1/settings              # Admin
PUT    /api/v1/settings              # Admin

# Media
POST   /api/v1/media/upload          # Admin
DELETE /api/v1/media/:id             # Admin

# Analytics
GET    /api/v1/analytics/overview    # Admin
GET    /api/v1/analytics/visitors    # Admin

# Health
GET    /api/v1/health
```

---

<a id="9-seo-strategy--استراتيجية-السيو"></a>

## 9. SEO Strategy | استراتيجية السيو

### 9.1 Technical SEO

```typescript
// next.config.js
module.exports = {
  compress: true,
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};
```

### 9.2 Meta Tags

```typescript
// lib/seo/generateMetadata.ts

export function generateMetadata(props: SEOProps): Metadata {
  const { title, description, image, url, locale } = props;

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `/ar${url}`,
        en: `/en${url}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
```

### 9.3 Structured Data (JSON-LD)

```typescript
// Organization Schema
export function generateOrganizationSchema(settings: any, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.general.siteName[locale],
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: settings.general.logo.light,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.contact.phone,
      email: settings.contact.email,
    },
    sameAs: Object.values(settings.social).filter(Boolean),
  };
}

// Service Schema
export function generateServiceSchema(service: any, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title[locale],
    description: service.description[locale],
    provider: { '@type': 'Organization', name: 'MWM' },
  };
}

// BlogPost Schema
export function generateBlogPostSchema(post: any, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title[locale],
    description: post.excerpt[locale],
    image: post.thumbnail,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author.name },
  };
}

// FAQ Schema
export function generateFAQSchema(faqs: any[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question[locale],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale],
      },
    })),
  };
}
```

### 9.4 SEO Checklist

```yaml
Technical:
  - [x] SSL certificate
  - [x] Mobile-friendly
  - [x] Fast load (<3s)
  - [x] Core Web Vitals
  - [x] XML sitemap
  - [x] Robots.txt
  - [x] Canonical URLs
  - [x] Hreflang tags
  - [x] Custom 404

On-Page:
  - [x] Unique titles (50-60 chars)
  - [x] Meta descriptions (150-160 chars)
  - [x] H1 per page
  - [x] Header hierarchy
  - [x] Alt text for images
  - [x] Internal linking
  - [x] Schema markup

Content:
  - [x] Original content
  - [x] Keyword research
  - [x] Blog posts
  - [x] FAQ sections
```

---

<a id="10-testing-strategy--استراتيجية-الاختبارات"></a>

## 10. Testing Strategy | استراتيجية الاختبارات

### 10.1 Testing Pyramid

```yaml
E2E Tests (10%):
  - Critical user journeys
  - Cross-browser testing
  - Mobile testing

Integration Tests (30%):
  - API endpoints
  - Database operations
  - Authentication flows

Unit Tests (60%):
  - Utility functions
  - React components
  - Custom hooks
  - Business logic
```

### 10.2 Backend Testing

```typescript
// tests/integration/auth.test.ts

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test@1234',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'invalid',
          password: 'Test@1234',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with duplicate email', async () => {
      await createTestUser({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Another',
          email: 'test@example.com',
          password: 'Test@1234',
        })
        .expect(409);

      expect(response.body.error.code).toBe('EMAIL_EXISTS');
    });
  });
});
```

### 10.3 Frontend Testing

```typescript
// tests/unit/components/Button.test.tsx

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// tests/e2e/contact.spec.ts (Playwright)

test.describe('Contact Page', () => {
  test('should submit form successfully', async ({ page }) => {
    await page.goto('/ar/contact');

    await page.fill('[name="name"]', 'أحمد محمد');
    await page.fill('[name="email"]', 'ahmed@test.com');
    await page.fill('[name="message"]', 'رسالة اختبارية');

    await page.click('button[type="submit"]');

    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### 10.4 Coverage Requirements

```yaml
Thresholds:
  Statements: 80%
  Branches: 75%
  Functions: 80%
  Lines: 80%

Critical Paths (100%):
  - Authentication
  - Form submissions
  - Data mutations
```

---

<a id="11-error-handling-system--نظام-معالجة-الأخطاء"></a>

## 11. Error Handling System | نظام معالجة الأخطاء

### 11.1 Error Classes

```typescript
// utils/ApiError.ts

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true,
    public details?: any
  ) {
    super(message);
  }
}

export const Errors = {
  // Auth
  UNAUTHORIZED: (msg?: string) => new ApiError(401, 'UNAUTHORIZED', msg || 'غير مصرح'),
  INVALID_CREDENTIALS: () => new ApiError(401, 'INVALID_CREDENTIALS', 'بيانات الدخول غير صحيحة'),
  TOKEN_EXPIRED: () => new ApiError(401, 'TOKEN_EXPIRED', 'انتهت صلاحية الجلسة'),

  // Validation
  VALIDATION_ERROR: (details: any) =>
    new ApiError(400, 'VALIDATION_ERROR', 'خطأ في البيانات', true, details),

  // Not Found
  NOT_FOUND: (resource: string) => new ApiError(404, 'NOT_FOUND', `${resource} غير موجود`),

  // Conflict
  EMAIL_EXISTS: () => new ApiError(409, 'EMAIL_EXISTS', 'البريد الإلكتروني مستخدم'),

  // Rate Limit
  TOO_MANY_REQUESTS: () => new ApiError(429, 'TOO_MANY_REQUESTS', 'طلبات كثيرة، حاول لاحقاً'),

  // Server
  INTERNAL_ERROR: () => new ApiError(500, 'INTERNAL_ERROR', 'خطأ في الخادم', false),
};
```

### 11.2 Localized Error Messages

```typescript
// constants/errorMessages/ar.ts
export const errorMessagesAr = {
  UNAUTHORIZED: 'غير مصرح بالوصول',
  INVALID_CREDENTIALS: 'بيانات الدخول غير صحيحة',
  TOKEN_EXPIRED: 'انتهت صلاحية الجلسة',
  VALIDATION_ERROR: 'خطأ في البيانات المدخلة',
  NOT_FOUND: 'غير موجود',
  EMAIL_EXISTS: 'البريد الإلكتروني مستخدم بالفعل',
  TOO_MANY_REQUESTS: 'طلبات كثيرة، حاول لاحقاً',
  INTERNAL_ERROR: 'حدث خطأ غير متوقع',
};

// constants/errorMessages/en.ts
export const errorMessagesEn = {
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Session expired',
  VALIDATION_ERROR: 'Validation error',
  NOT_FOUND: 'Not found',
  EMAIL_EXISTS: 'Email already exists',
  TOO_MANY_REQUESTS: 'Too many requests',
  INTERNAL_ERROR: 'An unexpected error occurred',
};
```

### 11.3 Error Handler Middleware

```typescript
// middlewares/errorHandler.ts

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const locale = req.headers['accept-language']?.startsWith('ar') ? 'ar' : 'en';

  logger.error({ message: err.message, stack: err.stack, path: req.path });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: getLocalizedMessage(err.code, locale) || err.message,
        details: err.details,
      },
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: getLocalizedMessage('INTERNAL_ERROR', locale),
    },
  });
};
```

---

<a id="12-security-implementation--تطبيق-الأمان"></a>

## 12. Security Implementation | تطبيق الأمان

### 12.1 Security Middleware

```typescript
// middlewares/security.ts

export function setupSecurity(app: Express) {
  // Helmet - Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(','),
      credentials: true,
    })
  );

  // Rate limiting
  app.use(
    '/api/',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100,
    })
  );

  // Auth rate limiting (stricter)
  app.use(
    '/api/v1/auth/login',
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
    })
  );

  // NoSQL injection protection
  app.use(mongoSanitize());

  // XSS protection
  app.use(xss());

  // HTTP Parameter Pollution
  app.use(hpp());
}
```

### 12.2 Input Validation

```typescript
// validations/schemas/auth.schema.ts

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'الاسم يجب أن يكون على الأقل {#limit} أحرف',
      'any.required': 'الاسم مطلوب',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'البريد الإلكتروني غير صحيح',
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
      'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز',
    }),
  }),
};
```

### 12.3 Authentication Middleware

```typescript
// middlewares/auth.ts

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw Errors.UNAUTHORIZED();
  }

  const token = authHeader.split(' ')[1];

  // Check blacklist
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) throw Errors.INVALID_TOKEN();

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  // Get user
  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) throw Errors.UNAUTHORIZED();

  req.user = user;
  next();
};

// RBAC
export const authorize = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = rolePermissions[req.user.role];

    if (userPermissions.includes('*')) return next();

    const hasPermission = permissions.every(p => userPermissions.includes(p));
    if (!hasPermission) throw Errors.INSUFFICIENT_PERMISSIONS();

    next();
  };
};
```

---

<a id="13-performance-optimization--تحسين-الأداء"></a>

## 13. Performance Optimization | تحسين الأداء

### 13.1 Caching Strategy

```typescript
// middlewares/cache.ts

export const cache = (ttl = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    const cacheKey = `cache:${req.originalUrl}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis.setex(cacheKey, ttl, JSON.stringify(body));
      }
      return originalJson(body);
    };

    next();
  };
};

// Cache invalidation
export const invalidateCache = async (pattern: string) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
};
```

### 13.2 Image Optimization

```typescript
// components/OptimizedImage.tsx

export function OptimizedImage({ src, alt, className, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(
        'transition-all duration-700',
        isLoading ? 'blur-lg scale-105' : 'blur-0 scale-100',
        className
      )}
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  );
}
```

### 13.3 Lazy Loading

```typescript
// components/LazySection.tsx

export function LazySection({ children, fallback }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? children : fallback}
    </div>
  );
}
```

---

<a id="14-development-phases--مراحل-التطوير"></a>

## 14. Development Phases | مراحل التطوير

### Overview | نظرة عامة

```
┌─────────────────────────────────────────────────────────────────┐
│                    Total Duration: 12 weeks                      │
├─────────────────────────────────────────────────────────────────┤
│ Phase 1: Foundation          │ 2 weeks  │ ████░░░░░░░░░░░░░░░░ │
│ Phase 2: Core Features       │ 3 weeks  │ ████████░░░░░░░░░░░░ │
│ Phase 3: Admin Dashboard     │ 3 weeks  │ ████████████░░░░░░░░ │
│ Phase 4: Advanced Features   │ 2 weeks  │ ████████████████░░░░ │
│ Phase 5: Polish & Deploy     │ 2 weeks  │ ████████████████████ │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Foundation | المرحلة الأولى: الأساس

**المدة: أسبوعان | Duration: 2 weeks**

#### 1.1 Project Setup (3 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Initialize monorepo structure
  - [x] Setup Docker environment
  - [x] Configure ESLint, Prettier, Husky
  - [x] Setup CI/CD pipelines
  - [x] Setup shared packages

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Config validation (22 tests)
  Integration:
    - [x] Docker services health check (22 tests)

معايير الانتقال | Gate Criteria:
  ✅ All services start successfully
  ✅ Linting passes
  ✅ CI pipeline passes
  ✅ 94 total tests passing
```

#### 1.2 Backend Foundation (4 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Express + TypeScript setup
  - [x] MongoDB + Mongoose connection
  - [x] Redis connection
  - [x] Logger setup (Winston)
  - [x] Error handling system
  - [x] Security middleware (helmet, cors, rate limiting, hpp, mongoSanitize)
  - [x] Health check endpoints
  - [x] Validation middleware with Joi
  - [x] Base Repository pattern
  - [x] Response utilities
  - [x] Helper functions

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Error classes (12 tests)
    - [x] Utility functions (36 tests)
    - [x] Validation middleware (20 tests)
    - [x] Response utilities (12 tests)
  Integration:
    - [x] Database connection (13 tests)
    - [x] Health endpoints (22 tests)

معايير الانتقال | Gate Criteria:
  ✅ Health check returns 200
  ✅ Database connected
  ✅ 134 total tests passing
```

#### 1.3 Frontend Foundation (4 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Next.js 14 + TypeScript setup
  - [x] Tailwind CSS + RTL
  - [x] i18n configuration
  - [x] Base UI components (Button, Input, Card, Modal, Spinner, Container)
  - [x] Theme provider (dark/light/system)
  - [x] API client with axios
  - [x] Custom hooks (useLocalStorage, useDebounce, useMediaQuery, useClickOutside)
  - [x] Utility functions (cn for Tailwind class merging)

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] UI components (76 tests)
    - [x] Hooks (useDebounce, useMediaQuery, useClickOutside, useLocalStorage)
    - [x] Utility functions (cn function)
  Integration:
    - [x] Theme switching
    - [x] Component rendering

معايير الانتقال | Gate Criteria:
  ✅ Build passes
  ✅ All frontend tests passing
  ✅ 80%+ component coverage
```

#### 1.4 Authentication System (3 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] User model with password hashing, login attempts, account locking
  - [x] JWT + Refresh tokens with rotation
  - [x] Password hashing (bcrypt, 12 rounds)
  - [x] Auth routes (register, login, logout, refresh, forgot-password, reset-password, verify-email, me)
  - [x] Auth middleware with RBAC (5 roles: super_admin, admin, editor, author, viewer)
  - [x] Email verification service
  - [x] Password reset flow

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Token generation/verification
    - [x] Password hashing
    - [x] User model validation
    - [x] Login attempts tracking
  Integration:
    - [x] Register flow
    - [x] Login flow
    - [x] Password reset
    - [x] Token refresh
    - [x] Profile update

معايير الانتقال | Gate Criteria:
  ✅ All auth endpoints functional
  ✅ Email verification works
  ✅ RBAC with 5 roles implemented
  ✅ Account locking after failed attempts
```

---

### Phase 2: Core Features | المرحلة الثانية: الميزات الأساسية

**المدة: 3 أسابيع | Duration: 3 weeks**

#### 2.1 Settings & CMS System (3 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Settings model + API
  - [x] SiteContent model (CMS)
  - [x] Content API
  - [x] Translation model + API
  - [x] Menu model + API

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Model validations (Settings, SiteContent, Translation, Menu)
  Integration:
    - [x] CRUD operations
    - [x] Caching (Redis)
    - [x] Localization (ar/en)

معايير الانتقال | Gate Criteria:
  ✅ All CRUD operations work
  ✅ Translations by locale
  ✅ Settings cached
```

#### 2.2 Public Website Layout (3 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Header + Mobile menu
  - [x] Footer
  - [x] Language switcher
  - [x] Theme switcher
  - [x] SEO components
  - [x] Newsletter component

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Header tests
    - [x] Footer tests
    - [x] Newsletter tests
    - [x] LanguageSwitcher tests
  Integration:
    - [x] Navigation
    - [x] Language switching

معايير الانتقال | Gate Criteria:
  ✅ Components responsive
  ✅ RTL layout correct
  ✅ Accessibility passes
```

#### 2.3 Services Module (4 days) ✅ COMPLETED

```yaml
Backend:
  - [x] Service model (with features, pricing plans, FAQs, process steps)
  - [x] ServiceCategory model
  - [x] Service CRUD API (with Redis caching)
  - [x] Service validation schemas (Joi)

Frontend:
  - [x] Services list page
  - [x] Service detail page
  - [x] Service cards (4 variants)
  - [x] Pricing components (3 variants)
  - [x] FAQ accordion (4 variants)
  - [x] Process steps (4 variants)

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Service model tests
    - [x] ServiceCategory model tests
    - [x] ServiceCard component tests
    - [x] PricingCard component tests
    - [x] FAQAccordion component tests
    - [x] ProcessSteps component tests (67 tests total)

معايير الانتقال | Gate Criteria:
  ✅ CRUD functional
  ✅ Redis caching implemented
  ✅ SEO meta generated
  ✅ Frontend tests passing
```

#### 2.4 Projects/Portfolio Module (5 days) ✅ COMPLETED

```yaml
Backend:
  - [x] Project model
  - [x] ProjectCategory model
  - [x] Project CRUD API (controller + routes)
  - [x] Categories & Technologies
  - [x] Validation schemas
  - [x] Redis caching

Frontend:
  - [x] ProjectCard component (4 variants)
  - [x] ProjectGrid component (3 variants)
  - [x] Gallery component (3 variants + lightbox)
  - [x] TechStack component (4 variants)
  - [x] Filters & category support

الاختبارات المطلوبة | Required Tests:
  Unit: ✅ Model tests, ✅ Component tests
  Integration: Ready for Phase 3

ملفات التنفيذ | Implementation Files:
  Backend:
    - src/models/Project.ts
    - src/models/ProjectCategory.ts
    - src/validations/project.validation.ts
    - src/controllers/project.controller.ts
    - src/routes/project.routes.ts
  Frontend:
    - src/components/projects/ProjectCard.tsx
    - src/components/projects/ProjectGrid.tsx
    - src/components/projects/Gallery.tsx
    - src/components/projects/TechStack.tsx
    - src/components/projects/index.ts

معايير الانتقال | Gate Criteria:
  ✅ All CRUD operations
  ✅ Category filtering
  ✅ Frontend components ready
  ✅ Backend tests passing
  ✅ Frontend tests passing (85 tests)
```

#### 2.5 Team Module (3 days) ✅ COMPLETED

```yaml
Backend:
  - [x] TeamMember model (with skills, social links, education, certifications)
  - [x] Department model
  - [x] Team CRUD API (controller + routes)
  - [x] Validation schemas (Joi)
  - [x] Redis caching (30 min TTL)

Frontend:
  - [x] TeamCard component (4 variants: default, featured, compact, horizontal)
  - [x] TeamGrid component (3 variants: grid, masonry, list)
  - [x] SkillsChart component (4 variants: bars, radial, grouped, compact)
  - [x] Department filtering
  - [x] Social links display

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Department model tests
    - [x] TeamMember model tests
    - [x] TeamCard component tests (31 tests)
    - [x] TeamGrid component tests (18 tests)
    - [x] SkillsChart component tests (17 tests)

ملفات التنفيذ | Implementation Files:
  Backend:
    - src/models/Department.ts
    - src/models/TeamMember.ts
    - src/validations/team.validation.ts
    - src/controllers/team.controller.ts
    - src/routes/team.routes.ts
  Frontend:
    - src/components/team/TeamCard.tsx
    - src/components/team/TeamGrid.tsx
    - src/components/team/SkillsChart.tsx
    - src/components/team/index.ts

معايير الانتقال | Gate Criteria:
  ✅ CRUD functional
  ✅ All frontend tests passing (66 tests)
  ✅ Backend model tests ready
  ✅ Redis caching implemented
```

#### 2.6 Contact Module (3 days) ✅ COMPLETED

```yaml
Backend:
  - [x] Contact model (with status, priority, replies, labels, notes)
  - [x] Contact form API (submit, getMessages, update, reply, delete, bulk actions)
  - [x] Contact validation schemas (Joi)
  - [x] Redis caching (5 min TTL)
  - [x] Message statistics endpoint
  - [x] Email notification (prepared - TODO)
  - [x] reCAPTCHA (prepared - TODO)

Frontend:
  - [x] ContactForm component (3 variants: default, minimal, detailed)
  - [x] ContactInfo component (4 variants: default, card, minimal, horizontal)
  - [x] Social links display
  - [x] Budget options
  - [x] Preferred contact method
  - [x] Form validation
  - [x] Success/Error states

الاختبارات المطلوبة | Required Tests:
  Unit:
    - [x] Contact model tests (28 tests)
    - [x] ContactForm component tests (46 tests - 1 skipped)
    - [x] ContactInfo component tests (all passing)

ملفات التنفيذ | Implementation Files:
  Backend:
    - src/models/Contact.ts
    - src/validations/contact.validation.ts
    - src/controllers/contact.controller.ts
    - src/routes/contact.routes.ts
  Frontend:
    - src/components/contact/ContactForm.tsx
    - src/components/contact/ContactInfo.tsx
    - src/components/contact/index.ts
    - src/messages/ar.json (updated)
    - src/messages/en.json (updated)

معايير الانتقال | Gate Criteria:
  ✅ Form submits correctly
  ✅ All CRUD operations work
  ✅ Frontend tests passing (46 tests)
  ✅ Backend tests passing (28 tests)
  ✅ Redis caching implemented
```

---

### Phase 3: Admin Dashboard | المرحلة الثالثة: لوحة التحكم

**المدة: 3 أسابيع | Duration: 3 weeks**

#### 3.1 Admin Layout & Dashboard (4 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Admin layout
  - [x] Sidebar navigation
  - [x] Dashboard statistics
  - [x] Charts components
  - [x] Recent activity

معايير الانتقال | Gate Criteria:
  ✅ Layout responsive
  ✅ Stats load correctly
  ✅ Charts render
```

**التنفيذ | Implementation:**

Frontend Components:

- AdminLayout.tsx - Main layout wrapper with sidebar and header
- AdminSidebar.tsx - Responsive sidebar with navigation
- AdminHeader.tsx - Header with search, notifications, user menu
- StatsCard.tsx - Statistics card with trends and variants
- DashboardCharts.tsx - Line, Pie, Bar charts (CSS-based)
- RecentActivity.tsx - Activity feed with time formatting

Admin Pages:

- /[locale]/admin - Dashboard page with stats, charts, activity
- /[locale]/admin/layout.tsx - Admin layout wrapper

Tests:

- 64 tests for admin components (all passing)
- AdminSidebar, StatsCard, DashboardCharts, RecentActivity tests

#### 3.2 CRUD Interfaces (5 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Projects management
  - [x] Services management
  - [x] Team management
  - [x] DataTable component
  - [ ] Rich text editor (Phase 3.3)
  - [ ] Image upload + crop (Phase 3.3)
  - [ ] Drag & drop ordering (Phase 3.3)

معايير الانتقال | Gate Criteria:
  ✅ All CRUD operations
  ✅ DataTable with sorting, filtering, pagination
  ✅ Bulk actions support
  ✅ 94 admin tests passing
```

**التنفيذ | Implementation:**

Frontend Components:

- DataTable.tsx - Reusable data table with sorting, filtering, pagination, bulk actions
- tableActions factory functions for view, edit, delete actions

Admin Pages:

- /[locale]/admin/projects - Projects management with status filters
- /[locale]/admin/services - Services management with order, activation status
- /[locale]/admin/team - Team members management with visibility controls

Tests:

- DataTable component tests (part of 94 admin tests)
- All management pages functional

#### 3.3 Content Management (4 days) ✅ COMPLETED

```yaml
المهام | Tasks:
  - [x] Content editor interface
  - [x] Translation editor
  - [x] Menu builder
  - [x] Preview functionality

معايير الانتقال | Gate Criteria:
  ✅ Content editable
  ✅ Translations work
  ✅ Preview accurate
```

**التنفيذ | Implementation:**

Admin Pages:

- /[locale]/admin/content - Content editor with section grouping and bilingual editing
- /[locale]/admin/translations - Translation editor with namespace management and export
- /[locale]/admin/menus - Menu builder with hierarchy and preview

Features:

- Bilingual content editing (Arabic/English side-by-side)
- Search and filter functionality
- Unsaved changes tracking
- Preview modal for all editors
- Add/Edit/Delete operations
- System vs custom translation differentiation
- Menu item hierarchy with children support
- Internal/External link types

Tests:

- 122 admin tests (6 test suites, all passing)

#### 3.4 Messages & Newsletter (3 days)

```yaml
المهام | Tasks:
  - [ ] Messages inbox
  - [ ] Reply functionality
  - [ ] Newsletter subscribers
  - [ ] Export functionality

معايير الانتقال | Gate Criteria:
  ✅ Messages manageable
  ✅ Reply sends email
  ✅ Export works
```

#### 3.5 User Management & Permissions (3 days)

```yaml
المهام | Tasks:
  - [ ] Users list & editor
  - [ ] Role management
  - [ ] Permission matrix
  - [ ] Activity logs

معايير الانتقال | Gate Criteria:
  ✅ RBAC working
  ✅ Audit logs recording
  ✅ 90% auth coverage
```

#### 3.6 Settings & SEO Management (2 days)

```yaml
المهام | Tasks:
  - [ ] General settings
  - [ ] SEO defaults
  - [ ] Theme customization
  - [ ] Feature toggles

معايير الانتقال | Gate Criteria:
  ✅ Settings save correctly
  ✅ Theme applies
  ✅ SEO meta updates
```

---

### Phase 4: Advanced Features | المرحلة الرابعة: الميزات المتقدمة

**المدة: أسبوعان | Duration: 2 weeks**

#### 4.1 Blog System (5 days)

```yaml
Backend:
  - [ ] BlogPost model
  - [ ] Blog API
  - [ ] Categories & Tags
  - [ ] RSS feed

Frontend:
  - [ ] Blog listing
  - [ ] Blog post page
  - [ ] Author profile
  - [ ] Related posts
  - [ ] TOC generation

معايير الانتقال | Gate Criteria:
  ✅ CRUD functional
  ✅ SEO optimized
  ✅ RSS valid
  ✅ 85% coverage
```

#### 4.2 Careers Module (3 days)

```yaml
المهام | Tasks:
  - [ ] Career & Application models
  - [ ] Career API
  - [ ] Jobs listing & detail pages
  - [ ] Application form
  - [ ] Admin applications view

معايير الانتقال | Gate Criteria:
  ✅ Applications received
  ✅ CV uploads work
  ✅ 80% coverage
```

#### 4.3 Analytics & Notifications (3 days)

```yaml
المهام | Tasks:
  - [ ] Analytics dashboard
  - [ ] Socket.io notifications
  - [ ] In-app notifications
  - [ ] Email notifications

معايير الانتقال | Gate Criteria:
  ✅ Data tracking works
  ✅ Real-time works
  ✅ Email sends
```

---

### Phase 5: Polish & Deploy | المرحلة الخامسة: التحسين والنشر

**المدة: أسبوعان | Duration: 2 weeks**

#### 5.1 Performance Optimization (3 days)

```yaml
المهام | Tasks:
  - [ ] Image optimization audit
  - [ ] Bundle analysis
  - [ ] Caching optimization
  - [ ] Database indexing
  - [ ] Lazy loading

معايير الانتقال | Gate Criteria:
  ✅ Lighthouse 95+
  ✅ Core Web Vitals green
  ✅ Load time <2s
```

#### 5.2 SEO Final Optimization (2 days)

```yaml
المهام | Tasks:
  - [ ] Meta tags audit
  - [ ] Structured data verification
  - [ ] Sitemap generation
  - [ ] Accessibility audit

معايير الانتقال | Gate Criteria:
  ✅ All pages have meta
  ✅ Schema valid
  ✅ WCAG AA compliant
```

#### 5.3 Security Audit (2 days)

```yaml
المهام | Tasks:
  - [ ] Dependency audit
  - [ ] OWASP checklist
  - [ ] Penetration testing
  - [ ] Rate limiting verification

معايير الانتقال | Gate Criteria:
  ✅ No critical vulnerabilities
  ✅ All endpoints secured
```

#### 5.4 Documentation (2 days)

```yaml
المهام | Tasks:
  - [ ] API documentation (Swagger)
  - [ ] README files
  - [ ] Deployment guide
  - [ ] Admin user guide

معايير الانتقال | Gate Criteria:
  ✅ API docs complete
  ✅ Guides clear
```

#### 5.5 Deployment (3 days)

```yaml
المهام | Tasks:
  - [ ] Production Docker setup
  - [ ] SSL certificates
  - [ ] CDN setup
  - [ ] Monitoring setup
  - [ ] Backup configuration
  - [ ] Staging deployment
  - [ ] Production deployment
  - [ ] Smoke testing

معايير الانتقال | Gate Criteria:
  ✅ All tests pass
  ✅ No errors in logs
  ✅ SSL working
  ✅ Monitoring active
```

---

<a id="15-devops--cicd"></a>

## 15. DevOps & CI/CD

### 15.1 GitHub Actions

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint

  test-backend:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm ci
      - run: cd backend && npm test -- --coverage

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage

  build:
    runs-on: ubuntu-latest
    needs: [lint, test-backend, test-frontend]
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm ci && npm run build
      - run: cd frontend && npm ci && npm run build
```

### 15.2 Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '5000:5000'
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/mwm
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      - backend

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    ports:
      - '27017:27017'

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    ports:
      - '6379:6379'

volumes:
  mongo-data:
  redis-data:
```

---

<a id="16-environment-configuration--إعدادات-البيئة"></a>

## 16. Environment Configuration | إعدادات البيئة

### Backend (.env.example)

```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/mwm

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-api-key
EMAIL_FROM=noreply@mwm.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# reCAPTCHA
RECAPTCHA_SECRET_KEY=

# Sentry
SENTRY_DSN=
```

### Frontend (.env.example)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

---

## Summary | ملخص

### ما يميز هذا المشروع | Key Differentiators

| الميزة                   | الوصف                                               |
| ------------------------ | --------------------------------------------------- |
| 🎨 **قابل للتخصيص 100%** | كل شيء قابل للتعديل من لوحة التحكم بدون تعديل الكود |
| 🌍 **متعدد اللغات**      | دعم كامل للعربية والإنجليزية مع RTL                 |
| 🔍 **سيو متقدم**         | Meta tags, Schema, Sitemap, Core Web Vitals         |
| 🔒 **أمان مؤسسي**        | JWT, RBAC, Rate limiting, Input validation          |
| ✅ **اختبارات شاملة**    | Unit, Integration, E2E (80%+ coverage)              |
| ⚡ **أداء عالي**         | Caching, Lazy loading, Image optimization           |
| 📱 **متجاوب**            | Mobile-first responsive design                      |
| ♿ **إمكانية الوصول**    | WCAG 2.1 AA compliant                               |

### الميزات الرئيسية | Main Features

```
✅ نظام CMS كامل
✅ لوحة تحكم متقدمة
✅ نظام مستخدمين وصلاحيات
✅ مدونة متكاملة
✅ إدارة المشاريع
✅ إدارة الخدمات
✅ إدارة الفريق
✅ نظام رسائل
✅ نشرة بريدية
✅ وظائف وتقديم طلبات
✅ تحليلات
✅ إشعارات real-time
✅ دعم Dark mode
✅ API موثق
```

---

**Document Version:** 2.0
**Last Updated:** 2024
**Author:** MWM Development Team

---

> 💡 **ملاحظة**: هذه الخطة قابلة للتعديل حسب متطلبات المشروع. يُنصح بمراجعتها دورياً مع الفريق.
