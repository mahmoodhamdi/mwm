/**
 * Database Seed Script
 * سكريبت تعبئة قاعدة البيانات
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import { Settings } from '../models/Settings';
import { SiteContent } from '../models/SiteContent';
import { Translation } from '../models/Translation';
import { Menu } from '../models/Menu';
import { Department } from '../models/Department';
import { TeamMember } from '../models/TeamMember';
import { ServiceCategory } from '../models/ServiceCategory';
import { Service } from '../models/Service';
import { ProjectCategory } from '../models/ProjectCategory';
import { Project } from '../models/Project';
import { User, UserRoles } from '../models/User';
import { BlogPost } from '../models/BlogPost';
import { BlogCategory } from '../models/BlogCategory';
import { Job } from '../models/Job';
import { additionalBlogCategories, getBlogPosts } from './blog-posts-data';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/mwm?authSource=admin';

// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
const seedSettings = async () => {
  console.log('Seeding Settings...');

  await Settings.deleteMany({});

  await Settings.create({
    general: {
      siteName: { ar: 'MWM', en: 'MWM' },
      siteTagline: {
        ar: 'حلول برمجية متكاملة',
        en: 'Integrated Software Solutions',
      },
      logo: {
        light: '/images/logo-light.svg',
        dark: '/images/logo-dark.svg',
      },
      favicon: '/favicon.ico',
      defaultLanguage: 'ar',
      maintenanceMode: false,
    },
    contact: {
      email: 'mwm.softwars.solutions@gmail.com',
      phone: '+201019793768',
      whatsapp: '+201019793768',
      address: {
        ar: 'القاهرة، مصر',
        en: 'Cairo, Egypt',
      },
      location: { lat: 30.0444, lng: 31.2357 },
      workingHours: {
        ar: 'الأحد - الخميس: 9 صباحاً - 6 مساءً',
        en: 'Sunday - Thursday: 9 AM - 6 PM',
      },
    },
    social: {
      facebook: 'https://facebook.com/mwmsoftware',
      twitter: 'https://twitter.com/mwmsoftware',
      instagram: 'https://instagram.com/mwmsoftware',
      linkedin: 'https://linkedin.com/company/mwmsoftware',
      github: 'https://github.com/mahmoodhamdi',
    },
    seo: {
      defaultTitle: {
        ar: 'MWM - حلول برمجية متكاملة | تطوير مواقع وتطبيقات',
        en: 'MWM - Integrated Software Solutions | Web & App Development',
      },
      defaultDescription: {
        ar: 'شركة تطوير برمجيات متخصصة في بناء تطبيقات الويب والموبايل والأنظمة المتكاملة وواجهات البرمجة. نعمل بأحدث التقنيات مثل Next.js و Node.js و Flutter و Laravel.',
        en: 'Software development company specializing in web apps, mobile apps, full-stack platforms, and APIs. We work with Next.js, Node.js, Flutter, Laravel, and more.',
      },
      defaultKeywords: {
        ar: [
          'تطوير مواقع',
          'تطبيقات موبايل',
          'برمجة',
          'Next.js',
          'Node.js',
          'Flutter',
          'Laravel',
          'واجهات برمجية',
          'API',
        ],
        en: [
          'web development',
          'mobile apps',
          'software',
          'Next.js',
          'Node.js',
          'Flutter',
          'Laravel',
          'API development',
          'full-stack',
        ],
      },
      ogImage: '/images/og-image.jpg',
    },
    features: {
      blog: true,
      careers: true,
      newsletter: true,
      testimonials: true,
      darkMode: true,
      multiLanguage: true,
      contactForm: true,
      chatWidget: false,
      analytics: true,
    },
  });

  console.log('Settings seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// SITE CONTENT
// ═══════════════════════════════════════════════════════════════
const seedSiteContent = async () => {
  console.log('Seeding Site Content...');

  const contentItems = [
    {
      key: 'home.hero.title',
      type: 'text',
      section: 'home',
      content: {
        ar: 'نحول أفكارك إلى واقع رقمي',
        en: 'We Turn Your Ideas Into Digital Reality',
      },
      description: 'Hero section main title',
      order: 1,
    },
    {
      key: 'home.hero.subtitle',
      type: 'text',
      section: 'home',
      content: {
        ar: 'شركة تطوير برمجيات متخصصة في بناء تطبيقات الويب والموبايل والمنصات المتكاملة بأحدث التقنيات. أنجزنا أكثر من 30 مشروع حقيقي في مختلف المجالات.',
        en: 'Software development company specializing in building web apps, mobile apps, and full-stack platforms with the latest technologies. We have delivered 30+ real projects across various industries.',
      },
      description: 'Hero section subtitle',
      order: 2,
    },
    {
      key: 'about.description',
      type: 'html',
      section: 'about',
      content: {
        ar: '<p>MWM هي شركة تطوير برمجيات متخصصة في تقديم حلول تقنية متكاملة. نعمل مع الشركات والمشاريع الناشئة لتحويل أفكارهم إلى منتجات رقمية ناجحة.</p><p>فريقنا متخصص في تطوير الويب (Next.js, React), تطبيقات الموبايل (Flutter), الباك إند (Node.js, Express, Laravel, Flask), وقواعد البيانات (MongoDB, PostgreSQL, Redis).</p><p>أنجزنا مشاريع متنوعة تشمل: منصات توصيل طعام, تطبيقات حجز خدمات, لوحات تحكم, أدوات تحويل بيانات, أنظمة حجز عيادات, منصات رياضات إلكترونية, بوتات واتساب, وأدوات سكرابينج.</p>',
        en: '<p>MWM is a software development company specializing in delivering integrated technology solutions. We work with businesses and startups to transform their ideas into successful digital products.</p><p>Our team specializes in web development (Next.js, React), mobile apps (Flutter), backend (Node.js, Express, Laravel, Flask), and databases (MongoDB, PostgreSQL, Redis).</p><p>We have delivered diverse projects including: food delivery platforms, service booking apps, admin dashboards, data conversion tools, clinic booking systems, esports platforms, WhatsApp bots, and web scraping tools.</p>',
      },
      description: 'About page description',
      order: 1,
    },
    {
      key: 'about.stats.projects',
      type: 'text',
      section: 'about',
      content: { ar: '30+', en: '30+' },
      description: 'Total projects count',
      order: 2,
    },
    {
      key: 'about.stats.technologies',
      type: 'text',
      section: 'about',
      content: { ar: '15+', en: '15+' },
      description: 'Technologies used count',
      order: 3,
    },
    {
      key: 'footer.copyright',
      type: 'text',
      section: 'footer',
      content: {
        ar: '© 2024 MWM. جميع الحقوق محفوظة.',
        en: '© 2024 MWM. All rights reserved.',
      },
      description: 'Footer copyright text',
      order: 1,
    },
  ];

  for (const item of contentItems) {
    await SiteContent.findOneAndUpdate(
      { key: item.key },
      { $set: item },
      { upsert: true, new: true }
    );
  }

  console.log('Site Content seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════
const seedTranslations = async () => {
  console.log('Seeding Translations...');

  const translations = [
    { key: 'viewAll', namespace: 'common', translations: { ar: 'عرض الكل', en: 'View All' } },
    { key: 'readMore', namespace: 'common', translations: { ar: 'اقرأ المزيد', en: 'Read More' } },
    { key: 'contactUs', namespace: 'common', translations: { ar: 'تواصل معنا', en: 'Contact Us' } },
    {
      key: 'learnMore',
      namespace: 'common',
      translations: { ar: 'اعرف المزيد', en: 'Learn More' },
    },
    { key: 'submit', namespace: 'common', translations: { ar: 'إرسال', en: 'Submit' } },
    {
      key: 'loading',
      namespace: 'common',
      translations: { ar: 'جاري التحميل...', en: 'Loading...' },
    },
    { key: 'error', namespace: 'common', translations: { ar: 'حدث خطأ', en: 'An error occurred' } },
    { key: 'success', namespace: 'common', translations: { ar: 'تم بنجاح', en: 'Success' } },
    { key: 'home', namespace: 'common', translations: { ar: 'الرئيسية', en: 'Home' } },
    { key: 'about', namespace: 'common', translations: { ar: 'من نحن', en: 'About' } },
    { key: 'services', namespace: 'common', translations: { ar: 'الخدمات', en: 'Services' } },
    { key: 'projects', namespace: 'common', translations: { ar: 'المشاريع', en: 'Projects' } },
    { key: 'team', namespace: 'common', translations: { ar: 'الفريق', en: 'Team' } },
    { key: 'blog', namespace: 'common', translations: { ar: 'المدونة', en: 'Blog' } },
    { key: 'careers', namespace: 'common', translations: { ar: 'الوظائف', en: 'Careers' } },
    { key: 'contact', namespace: 'common', translations: { ar: 'اتصل بنا', en: 'Contact' } },
    {
      key: 'heroTitle',
      namespace: 'home',
      translations: {
        ar: 'نحول أفكارك إلى واقع رقمي',
        en: 'We Turn Your Ideas Into Digital Reality',
      },
    },
    {
      key: 'heroDescription',
      namespace: 'home',
      translations: {
        ar: 'شركة تطوير برمجيات متخصصة',
        en: 'Specialized software development company',
      },
    },
    { key: 'ourServices', namespace: 'home', translations: { ar: 'خدماتنا', en: 'Our Services' } },
    { key: 'ourProjects', namespace: 'home', translations: { ar: 'مشاريعنا', en: 'Our Projects' } },
    { key: 'mission', namespace: 'about', translations: { ar: 'مهمتنا', en: 'Our Mission' } },
    { key: 'vision', namespace: 'about', translations: { ar: 'رؤيتنا', en: 'Our Vision' } },
    { key: 'values', namespace: 'about', translations: { ar: 'قيمنا', en: 'Our Values' } },
    {
      key: 'sendMessage',
      namespace: 'contact',
      translations: { ar: 'أرسل رسالة', en: 'Send Message' },
    },
    { key: 'name', namespace: 'contact', translations: { ar: 'الاسم', en: 'Name' } },
    { key: 'email', namespace: 'contact', translations: { ar: 'البريد الإلكتروني', en: 'Email' } },
    { key: 'phone', namespace: 'contact', translations: { ar: 'الهاتف', en: 'Phone' } },
    { key: 'message', namespace: 'contact', translations: { ar: 'الرسالة', en: 'Message' } },
  ];

  for (const trans of translations) {
    await Translation.findOneAndUpdate(
      { key: trans.key, namespace: trans.namespace },
      { $set: trans },
      { upsert: true, new: true }
    );
  }

  console.log('Translations seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// MENUS
// ═══════════════════════════════════════════════════════════════
const seedMenus = async () => {
  console.log('Seeding Menus...');

  const menus = [
    {
      name: 'Header Navigation',
      slug: 'header-nav',
      location: 'header',
      isActive: true,
      items: [
        {
          id: '1',
          label: { ar: 'الرئيسية', en: 'Home' },
          url: '/',
          type: 'internal',
          target: '_self',
          order: 0,
          isActive: true,
        },
        {
          id: '2',
          label: { ar: 'من نحن', en: 'About' },
          url: '/about',
          type: 'internal',
          target: '_self',
          order: 1,
          isActive: true,
        },
        {
          id: '3',
          label: { ar: 'الخدمات', en: 'Services' },
          url: '/services',
          type: 'internal',
          target: '_self',
          order: 2,
          isActive: true,
        },
        {
          id: '4',
          label: { ar: 'المشاريع', en: 'Projects' },
          url: '/projects',
          type: 'internal',
          target: '_self',
          order: 3,
          isActive: true,
        },
        {
          id: '5',
          label: { ar: 'الفريق', en: 'Team' },
          url: '/team',
          type: 'internal',
          target: '_self',
          order: 4,
          isActive: true,
        },
        {
          id: '6',
          label: { ar: 'المدونة', en: 'Blog' },
          url: '/blog',
          type: 'internal',
          target: '_self',
          order: 5,
          isActive: true,
        },
        {
          id: '7',
          label: { ar: 'اتصل بنا', en: 'Contact' },
          url: '/contact',
          type: 'internal',
          target: '_self',
          order: 6,
          isActive: true,
        },
      ],
    },
    {
      name: 'Footer Navigation',
      slug: 'footer-nav',
      location: 'footer',
      isActive: true,
      items: [
        {
          id: '1',
          label: { ar: 'الرئيسية', en: 'Home' },
          url: '/',
          type: 'internal',
          target: '_self',
          order: 0,
          isActive: true,
        },
        {
          id: '2',
          label: { ar: 'من نحن', en: 'About' },
          url: '/about',
          type: 'internal',
          target: '_self',
          order: 1,
          isActive: true,
        },
        {
          id: '3',
          label: { ar: 'الخدمات', en: 'Services' },
          url: '/services',
          type: 'internal',
          target: '_self',
          order: 2,
          isActive: true,
        },
        {
          id: '4',
          label: { ar: 'الوظائف', en: 'Careers' },
          url: '/careers',
          type: 'internal',
          target: '_self',
          order: 3,
          isActive: true,
        },
        {
          id: '5',
          label: { ar: 'اتصل بنا', en: 'Contact' },
          url: '/contact',
          type: 'internal',
          target: '_self',
          order: 4,
          isActive: true,
        },
      ],
    },
  ];

  for (const menu of menus) {
    await Menu.findOneAndUpdate({ slug: menu.slug }, { $set: menu }, { upsert: true, new: true });
  }

  console.log('Menus seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════════════════════════
const seedDepartments = async () => {
  console.log('Seeding Departments...');

  const departments = [
    {
      name: { ar: 'الإدارة', en: 'Management' },
      slug: 'management',
      description: { ar: 'فريق الإدارة والقيادة', en: 'Management and leadership team' },
      icon: 'briefcase',
      color: '#3B82F6',
      order: 1,
      isActive: true,
    },
    {
      name: { ar: 'التطوير', en: 'Development' },
      slug: 'development',
      description: { ar: 'فريق تطوير البرمجيات', en: 'Software development team' },
      icon: 'code',
      color: '#10B981',
      order: 2,
      isActive: true,
    },
    {
      name: { ar: 'التصميم', en: 'Design' },
      slug: 'design',
      description: { ar: 'فريق التصميم والإبداع', en: 'Design and creative team' },
      icon: 'palette',
      color: '#F59E0B',
      order: 3,
      isActive: true,
    },
    {
      name: { ar: 'التسويق', en: 'Marketing' },
      slug: 'marketing',
      description: { ar: 'فريق التسويق والمبيعات', en: 'Marketing and sales team' },
      icon: 'megaphone',
      color: '#EF4444',
      order: 4,
      isActive: true,
    },
  ];

  const createdDepartments: Record<string, mongoose.Types.ObjectId> = {};

  for (const dept of departments) {
    const created = await Department.findOneAndUpdate(
      { slug: dept.slug },
      { $set: dept },
      { upsert: true, new: true }
    );
    createdDepartments[dept.slug] = created._id;
  }

  console.log('Departments seeded successfully!');
  return createdDepartments;
};

// ═══════════════════════════════════════════════════════════════
// TEAM MEMBERS
// ═══════════════════════════════════════════════════════════════
const seedTeamMembers = async (departments: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Team Members...');

  const teamMembers = [
    {
      name: { ar: 'محمود حمدي', en: 'Mahmoud Hamdi' },
      slug: 'mahmoud-hamdi',
      position: { ar: 'المؤسس ومطور Full Stack', en: 'Founder & Full Stack Developer' },
      bio: {
        ar: 'مطور برمجيات متخصص في بناء المنصات المتكاملة والتطبيقات. خبرة واسعة في Node.js و Next.js و Flutter و Laravel. أسست MWM لتقديم حلول برمجية عالية الجودة.',
        en: 'Software developer specializing in building full-stack platforms and applications. Extensive experience with Node.js, Next.js, Flutter, and Laravel. Founded MWM to deliver high-quality software solutions.',
      },
      shortBio: { ar: 'مؤسس MWM ومطور Full Stack', en: 'MWM Founder & Full Stack Developer' },
      department: departments['management'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mahmoodhamdi',
        github: 'https://github.com/mahmoodhamdi',
      },
      experience: 5,
      order: 1,
      isLeader: true,
      isFeatured: true,
      isActive: true,
    },
  ];

  for (const member of teamMembers) {
    await TeamMember.findOneAndUpdate(
      { slug: member.slug },
      { $set: member },
      { upsert: true, new: true }
    );
  }

  console.log('Team Members seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// SERVICE CATEGORIES
// ═══════════════════════════════════════════════════════════════
const seedServiceCategories = async () => {
  console.log('Seeding Service Categories...');

  const categories = [
    {
      name: { ar: 'تطوير الويب', en: 'Web Development' },
      slug: 'web-development',
      description: {
        ar: 'تطوير مواقع وتطبيقات ويب متكاملة بأحدث التقنيات',
        en: 'Full-stack web application development with modern technologies',
      },
      icon: 'globe',
      order: 1,
      isActive: true,
    },
    {
      name: { ar: 'تطوير الموبايل', en: 'Mobile Development' },
      slug: 'mobile-development',
      description: {
        ar: 'تطوير تطبيقات موبايل لـ iOS و Android باستخدام Flutter',
        en: 'iOS and Android mobile app development using Flutter',
      },
      icon: 'smartphone',
      order: 2,
      isActive: true,
    },
    {
      name: { ar: 'واجهات برمجية (API)', en: 'Backend & API Development' },
      slug: 'backend-api',
      description: {
        ar: 'بناء واجهات برمجية REST API قوية وآمنة ومُوثقة',
        en: 'Building robust, secure, and well-documented REST APIs',
      },
      icon: 'server',
      order: 3,
      isActive: true,
    },
    {
      name: { ar: 'أتمتة وبوتات', en: 'Automation & Bots' },
      slug: 'automation-bots',
      description: {
        ar: 'بوتات واتساب، سكرابينج، أدوات أتمتة، وتكامل مع خدمات خارجية',
        en: 'WhatsApp bots, web scraping, automation tools, and third-party integrations',
      },
      icon: 'bot',
      order: 4,
      isActive: true,
    },
    {
      name: { ar: 'أدوات ويب', en: 'Web Tools & SaaS' },
      slug: 'web-tools',
      description: {
        ar: 'أدوات ويب متخصصة وتطبيقات SaaS للاستخدام اليومي',
        en: 'Specialized web tools and SaaS applications for everyday use',
      },
      icon: 'wrench',
      order: 5,
      isActive: true,
    },
    {
      name: { ar: 'التصميم وتجربة المستخدم', en: 'UI/UX Design' },
      slug: 'design',
      description: {
        ar: 'تصميم واجهات مستخدم عصرية مع دعم كامل للغة العربية و RTL',
        en: 'Modern UI design with full Arabic language and RTL support',
      },
      icon: 'palette',
      order: 6,
      isActive: true,
    },
  ];

  const createdCategories: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of categories) {
    const created = await ServiceCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
    createdCategories[cat.slug] = created._id;
  }

  console.log('Service Categories seeded successfully!');
  return createdCategories;
};

// ═══════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════
const seedServices = async (categories: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Services...');

  const services = [
    {
      title: { ar: 'تطوير مواقع ويب بـ Next.js', en: 'Next.js Web Development' },
      slug: 'nextjs-web-development',
      shortDescription: {
        ar: 'بناء مواقع وتطبيقات ويب حديثة وسريعة باستخدام Next.js و React',
        en: 'Building modern, fast websites and web apps with Next.js and React',
      },
      description: {
        ar: 'نقدم خدمات تطوير مواقع ويب متكاملة باستخدام Next.js (الإصدارات 14-16) مع React و TypeScript و Tailwind CSS. نبني مواقع تسويقية, لوحات تحكم, منصات SaaS, وأدوات ويب. جميع المواقع تدعم اللغة العربية والإنجليزية مع RTL, Dark Mode, وتحسين SEO.',
        en: 'We provide comprehensive web development services using Next.js (versions 14-16) with React, TypeScript, and Tailwind CSS. We build marketing websites, admin dashboards, SaaS platforms, and web tools. All sites support Arabic and English with RTL, Dark Mode, and SEO optimization.',
      },
      category: categories['web-development'],
      icon: 'code',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
      features: [
        {
          title: { ar: 'تصميم متجاوب مع RTL', en: 'Responsive Design with RTL' },
          description: {
            ar: 'مواقع تعمل على جميع الأجهزة مع دعم كامل للعربية',
            en: 'Sites that work on all devices with full Arabic support',
          },
        },
        {
          title: { ar: 'أداء عالي وسرعة تحميل', en: 'High Performance & Fast Loading' },
          description: {
            ar: 'مواقع محسنة للسرعة مع Turbopack و SSR و SSG',
            en: 'Speed-optimized sites with Turbopack, SSR, and SSG',
          },
        },
        {
          title: { ar: 'SEO محسن لمحركات البحث', en: 'SEO Optimized' },
          description: {
            ar: 'تحسين كامل لمحركات البحث مع metadata ديناميكي',
            en: 'Full search engine optimization with dynamic metadata',
          },
        },
        {
          title: { ar: 'Dark Mode ووضع ليلي', en: 'Dark Mode Support' },
          description: {
            ar: 'دعم الوضع المظلم مع next-themes',
            en: 'Dark mode support with next-themes',
          },
        },
      ],
      processSteps: [
        {
          title: { ar: 'تحليل المتطلبات', en: 'Requirements Analysis' },
          description: {
            ar: 'فهم احتياجاتك وتحديد النطاق',
            en: 'Understanding your needs and defining scope',
          },
          order: 1,
        },
        {
          title: { ar: 'التصميم والنمذجة', en: 'Design & Prototyping' },
          description: { ar: 'تصميم واجهات المستخدم', en: 'UI/UX design and prototyping' },
          order: 2,
        },
        {
          title: { ar: 'التطوير والبرمجة', en: 'Development' },
          description: {
            ar: 'بناء الموقع بأحدث التقنيات',
            en: 'Building the site with latest technologies',
          },
          order: 3,
        },
        {
          title: { ar: 'الاختبار والنشر', en: 'Testing & Deployment' },
          description: {
            ar: 'اختبار شامل ونشر على السيرفر',
            en: 'Comprehensive testing and deployment',
          },
          order: 4,
        },
      ],
      order: 1,
      isFeatured: true,
      isActive: true,
    },
    {
      title: { ar: 'تطوير تطبيقات Flutter', en: 'Flutter Mobile Development' },
      slug: 'flutter-mobile-development',
      shortDescription: {
        ar: 'تطوير تطبيقات موبايل لـ iOS و Android بكود واحد باستخدام Flutter',
        en: 'Cross-platform iOS & Android mobile app development using Flutter',
      },
      description: {
        ar: 'نطور تطبيقات موبايل عالية الجودة باستخدام Flutter و Dart. نستخدم Clean Architecture مع Riverpod أو BLoC لإدارة الحالة, GoRouter للتنقل, Dio للـ HTTP, و Freezed لـ code generation. جميع التطبيقات تدعم اللغة العربية والإنجليزية.',
        en: 'We develop high-quality mobile apps using Flutter and Dart. We use Clean Architecture with Riverpod or BLoC for state management, GoRouter for navigation, Dio for HTTP, and Freezed for code generation. All apps support Arabic and English.',
      },
      category: categories['mobile-development'],
      icon: 'smartphone',
      technologies: ['Flutter', 'Dart', 'Riverpod', 'BLoC', 'Firebase', 'GoRouter'],
      features: [
        {
          title: { ar: 'تطبيق واحد لجميع المنصات', en: 'One Codebase, All Platforms' },
          description: {
            ar: 'iOS و Android من كود Flutter واحد',
            en: 'iOS and Android from a single Flutter codebase',
          },
        },
        {
          title: { ar: 'تصميم عصري ومتحرك', en: 'Modern & Animated UI' },
          description: {
            ar: 'واجهات جذابة مع animations سلسة',
            en: 'Beautiful interfaces with smooth animations',
          },
        },
      ],
      order: 2,
      isFeatured: true,
      isActive: true,
    },
    {
      title: { ar: 'برمجة Backend API', en: 'Backend API Development' },
      slug: 'backend-api-development',
      shortDescription: {
        ar: 'بناء واجهات برمجية REST API احترافية ومُوثقة وآمنة',
        en: 'Building professional, documented, and secure REST APIs',
      },
      description: {
        ar: 'نبني واجهات برمجية قوية وآمنة باستخدام Node.js (Express/TypeScript) أو Python (Flask). نقدم: مصادقة JWT + OAuth, توثيق Swagger/OpenAPI, Rate Limiting, Redis caching, Socket.io real-time, دفع إلكتروني (Paymob), رفع ملفات (Cloudinary), إشعارات (FCM/APNs).',
        en: 'We build robust and secure APIs using Node.js (Express/TypeScript) or Python (Flask). We provide: JWT + OAuth auth, Swagger/OpenAPI docs, Rate Limiting, Redis caching, Socket.io real-time, payment integration (Paymob), file uploads (Cloudinary), push notifications (FCM/APNs).',
      },
      category: categories['backend-api'],
      icon: 'server',
      technologies: [
        'Node.js',
        'Express',
        'TypeScript',
        'Python',
        'Flask',
        'MongoDB',
        'Redis',
        'JWT',
      ],
      features: [
        {
          title: { ar: 'توثيق Swagger كامل', en: 'Full Swagger Documentation' },
          description: {
            ar: 'API مُوثق بالكامل مع Swagger UI و ReDoc',
            en: 'Fully documented API with Swagger UI and ReDoc',
          },
        },
        {
          title: { ar: 'أمان متقدم', en: 'Advanced Security' },
          description: {
            ar: 'JWT, CSRF, Rate Limiting, Helmet, Input Sanitization',
            en: 'JWT, CSRF, Rate Limiting, Helmet, Input Sanitization',
          },
        },
        {
          title: { ar: 'Real-time مع Socket.io', en: 'Real-time with Socket.io' },
          description: {
            ar: 'تحديثات فورية للبيانات عبر WebSocket',
            en: 'Instant data updates via WebSocket',
          },
        },
      ],
      order: 3,
      isFeatured: true,
      isActive: true,
    },
    {
      title: { ar: 'بوتات واتساب وأتمتة', en: 'WhatsApp Bots & Automation' },
      slug: 'whatsapp-bots-automation',
      shortDescription: {
        ar: 'بوتات واتساب ذكية وأدوات أتمتة وسكرابينج',
        en: 'Smart WhatsApp bots, automation tools, and web scraping',
      },
      description: {
        ar: 'نبني بوتات واتساب للرد التلقائي مع تكامل Google Sheets, أدوات سكرابينج لجمع البيانات من مواقع متعددة, وأدوات أتمتة لتبسيط العمليات المتكررة.',
        en: 'We build WhatsApp auto-reply bots with Google Sheets integration, web scraping tools for data collection from multiple sites, and automation tools to simplify repetitive workflows.',
      },
      category: categories['automation-bots'],
      icon: 'bot',
      technologies: ['Node.js', 'Python', 'Baileys', 'BeautifulSoup', 'Puppeteer'],
      features: [
        {
          title: { ar: 'بوتات واتساب ذكية', en: 'Smart WhatsApp Bots' },
          description: {
            ar: 'ردود تلقائية مع تكامل قواعد بيانات',
            en: 'Auto-replies with database integration',
          },
        },
        {
          title: { ar: 'سكرابينج ويب', en: 'Web Scraping' },
          description: {
            ar: 'جمع بيانات من مواقع متعددة',
            en: 'Data collection from multiple websites',
          },
        },
      ],
      order: 4,
      isFeatured: false,
      isActive: true,
    },
    {
      title: { ar: 'أدوات ويب و SaaS', en: 'Web Tools & SaaS' },
      slug: 'web-tools-saas',
      shortDescription: {
        ar: 'أدوات ويب متخصصة مثل محولات ملفات، مختصرات روابط، ومحررات',
        en: 'Specialized web tools like file converters, URL shorteners, and editors',
      },
      description: {
        ar: 'نبني أدوات ويب متخصصة تشمل: محولات ملفات (CSV, Excel, JSON, XML), مختصرات روابط, محررات Markdown مع PDF export, أدوات التحقق من البريد الإلكتروني, وأدوات إرسال بريد جماعي.',
        en: 'We build specialized web tools including: file converters (CSV, Excel, JSON, XML), URL shorteners, Markdown editors with PDF export, email validation tools, and bulk email sending tools.',
      },
      category: categories['web-tools'],
      icon: 'wrench',
      technologies: ['Next.js', 'React', 'TypeScript', 'Zustand', 'Tailwind CSS'],
      features: [
        {
          title: { ar: 'واجهة مستخدم بسيطة', en: 'Simple UI' },
          description: { ar: 'سهولة الاستخدام بدون تسجيل', en: 'Easy to use without registration' },
        },
        {
          title: { ar: 'معالجة سريعة', en: 'Fast Processing' },
          description: {
            ar: 'معالجة الملفات على المتصفح بدون سيرفر',
            en: 'Client-side file processing without server',
          },
        },
      ],
      order: 5,
      isFeatured: false,
      isActive: true,
    },
    {
      title: { ar: 'منصات متكاملة (Full-Stack)', en: 'Full-Stack Platforms' },
      slug: 'full-stack-platforms',
      shortDescription: {
        ar: 'بناء منصات متكاملة مع باك إند وفرونت إند وموبايل ولوحة تحكم',
        en: 'Building complete platforms with backend, frontend, mobile, and admin panel',
      },
      description: {
        ar: 'نبني منصات متكاملة تشمل: Backend API (Node.js/Express), Frontend (Next.js), Mobile App (Flutter), Admin Dashboard, Real-time notifications, Payment integration, وFile uploads. أمثلة: منصات توصيل طعام, حجز خدمات حرفيين, طلب توصيلات (ride-hailing).',
        en: 'We build complete platforms including: Backend API (Node.js/Express), Frontend (Next.js), Mobile App (Flutter), Admin Dashboard, Real-time notifications, Payment integration, and File uploads. Examples: food delivery, craftsmen booking, ride-hailing platforms.',
      },
      category: categories['web-development'],
      icon: 'layers',
      technologies: [
        'Node.js',
        'Express',
        'Next.js',
        'Flutter',
        'MongoDB',
        'Redis',
        'Socket.io',
        'Paymob',
      ],
      features: [
        {
          title: { ar: 'منصة كاملة من A إلى Z', en: 'Complete Platform A to Z' },
          description: {
            ar: 'باك إند + فرونت إند + موبايل + لوحة تحكم',
            en: 'Backend + Frontend + Mobile + Admin Dashboard',
          },
        },
        {
          title: { ar: 'دفع إلكتروني', en: 'Payment Integration' },
          description: {
            ar: 'تكامل مع Paymob (بطاقات + فودافون كاش)',
            en: 'Integration with Paymob (cards + Vodafone Cash)',
          },
        },
        {
          title: { ar: 'Real-time', en: 'Real-time' },
          description: { ar: 'تحديثات فورية عبر Socket.io', en: 'Instant updates via Socket.io' },
        },
      ],
      order: 6,
      isFeatured: true,
      isActive: true,
    },
  ];

  for (const service of services) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      { $set: service },
      { upsert: true, new: true }
    );
  }

  console.log('Services seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// PROJECT CATEGORIES
// ═══════════════════════════════════════════════════════════════
const seedProjectCategories = async () => {
  console.log('Seeding Project Categories...');

  const categories = [
    {
      name: { ar: 'منصات متكاملة', en: 'Full-Stack Platforms' },
      slug: 'full-stack-platforms',
      description: {
        ar: 'مشاريع منصات متكاملة مع باك إند وفرونت إند وموبايل',
        en: 'Complete platforms with backend, frontend, and mobile',
      },
      icon: 'layers',
      order: 1,
      isActive: true,
    },
    {
      name: { ar: 'تطبيقات ويب', en: 'Web Applications' },
      slug: 'web-applications',
      description: {
        ar: 'تطبيقات ويب متكاملة ومواقع تفاعلية',
        en: 'Full-stack web apps and interactive websites',
      },
      icon: 'globe',
      order: 2,
      isActive: true,
    },
    {
      name: { ar: 'واجهات برمجية (APIs)', en: 'Backend APIs' },
      slug: 'backend-apis',
      description: {
        ar: 'واجهات برمجية REST API مُوثقة وآمنة',
        en: 'Documented and secure REST APIs',
      },
      icon: 'server',
      order: 3,
      isActive: true,
    },
    {
      name: { ar: 'أدوات ويب', en: 'Web Tools' },
      slug: 'web-tools',
      description: {
        ar: 'أدوات ويب متخصصة للاستخدام اليومي',
        en: 'Specialized web tools for everyday use',
      },
      icon: 'wrench',
      order: 4,
      isActive: true,
    },
    {
      name: { ar: 'مواقع تسويقية', en: 'Marketing Websites' },
      slug: 'marketing-websites',
      description: {
        ar: 'مواقع تسويقية وعرض خدمات',
        en: 'Marketing and service showcase websites',
      },
      icon: 'megaphone',
      order: 5,
      isActive: true,
    },
    {
      name: { ar: 'أتمتة وسكرابينج', en: 'Automation & Scraping' },
      slug: 'automation-scraping',
      description: {
        ar: 'أدوات أتمتة وبوتات وسكرابينج',
        en: 'Automation tools, bots, and web scraping',
      },
      icon: 'bot',
      order: 6,
      isActive: true,
    },
  ];

  const createdCategories: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of categories) {
    const created = await ProjectCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
    createdCategories[cat.slug] = created._id;
  }

  console.log('Project Categories seeded successfully!');
  return createdCategories;
};

// ═══════════════════════════════════════════════════════════════
// PROJECTS (ALL REAL PROJECTS)
// ═══════════════════════════════════════════════════════════════
const seedProjects = async (categories: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Projects...');

  const projects = [
    // ── Full-Stack Platforms ──────────────────────────────────
    {
      title: { ar: 'منصة توصيل طعام باجور', en: 'Bagour Food Delivery Platform' },
      slug: 'bagour-delivery',
      shortDescription: {
        ar: 'منصة توصيل طعام متكاملة لمنطقة باجور، مصر — 6 مشاريع فرعية',
        en: 'Complete food delivery platform for Bagour, Egypt — 6 sub-projects',
      },
      description: {
        ar: 'منصة توصيل طعام متكاملة تشمل: Backend API (Node.js/Express/TypeScript), Customer App (Flutter), Driver App (Flutter), Restaurant App (Flutter), Admin Dashboard (Next.js), وShared Types. تدعم: تتبع الطلبات في الوقت الفعلي عبر Socket.io, دفع إلكتروني عبر Paymob (بطاقات + فودافون كاش), إشعارات فورية, وإدارة المطاعم والسائقين.',
        en: 'Complete food delivery platform including: Backend API (Node.js/Express/TypeScript), Customer App (Flutter), Driver App (Flutter), Restaurant App (Flutter), Admin Dashboard (Next.js), and Shared Types. Supports: real-time order tracking via Socket.io, Paymob payments (cards + Vodafone Cash), push notifications, restaurant and driver management.',
      },
      thumbnail: '/portfolio/bagour-delivery/home.png',
      images: [
        '/portfolio/bagour-delivery/home.png',
        '/portfolio/bagour-delivery/dashboard.svg',
        '/portfolio/bagour-delivery/mobile.svg',
        '/portfolio/bagour-delivery/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'Flutter', category: 'mobile' },
        { name: 'Next.js', category: 'frontend' },
        { name: 'MongoDB', category: 'database' },
        { name: 'Redis', category: 'database' },
        { name: 'Socket.io', category: 'backend' },
        { name: 'Paymob', category: 'other' },
      ],
      challenge: {
        ar: 'بناء منصة توصيل طعام كاملة تدعم 4 أنواع مستخدمين (عميل, سائق, مطعم, أدمن) مع تتبع فوري',
        en: 'Building a complete food delivery platform supporting 4 user types (customer, driver, restaurant, admin) with real-time tracking',
      },
      solution: {
        ar: 'بنينا 6 مشاريع فرعية متكاملة مع Socket.io rooms لكل طلب، ونظام دفع Paymob مع HMAC verification',
        en: 'We built 6 integrated sub-projects with Socket.io rooms per order, and Paymob payment system with HMAC verification',
      },
      duration: '4 months',
      isFeatured: true,
      isPublished: true,
      order: 1,
    },
    {
      title: { ar: 'منصة صنايعي — حجز حرفيين', en: 'Sana3y — Craftsmen Booking Platform' },
      slug: 'sana3y',
      shortDescription: {
        ar: 'منصة حجز خدمات حرفيين (سباكة، كهرباء، نجارة) — باك إند + فرونت إند + موبايل',
        en: 'Craftsmen booking platform (plumbing, electric, carpentry) — backend + frontend + mobile',
      },
      description: {
        ar: 'منصة متكاملة لحجز خدمات الحرفيين في مصر. تشمل: Backend API مع TypeScript و Joi validation, Dashboard بـ Next.js 16, وتطبيق Flutter مع Riverpod. المنصة تدعم: OTP عبر البريد الإلكتروني, دفع Paymob, إشعارات Socket.io, ونظام تقييم ومراجعات.',
        en: 'Comprehensive craftsmen booking platform for Egypt. Includes: Backend API with TypeScript and Joi validation, Dashboard with Next.js 16, and Flutter app with Riverpod. Platform supports: Email OTP verification, Paymob payments, Socket.io notifications, and ratings/reviews system.',
      },
      thumbnail: '/portfolio/sana3y/home.png',
      images: [
        '/portfolio/sana3y/home.png',
        '/portfolio/sana3y/dashboard.svg',
        '/portfolio/sana3y/mobile.svg',
        '/portfolio/sana3y/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'Flutter', category: 'mobile' },
        { name: 'MongoDB', category: 'database' },
        { name: 'Paymob', category: 'other' },
      ],
      duration: '3 months',
      isFeatured: true,
      isPublished: true,
      order: 2,
    },
    {
      title: { ar: 'وصلني — منصة نقل ركاب', en: 'Wasalni — Ride-Hailing Platform' },
      slug: 'wasalni',
      shortDescription: {
        ar: 'منصة طلب توصيلات شبيهة بأوبر مع تتبع GPS فوري',
        en: 'Uber-like ride-hailing platform with real-time GPS tracking',
      },
      description: {
        ar: 'منصة نقل ركاب متكاملة تشمل: Backend API (Express 5/TypeScript), Dashboard (Next.js 16), وتطبيقات Flutter. الميزات: تتبع GPS في الوقت الفعلي عبر Redis GEO commands, مطابقة السائقين القريبين, دفع Paymob + محفظة رقمية, OTP عبر Unifonic SMS, وSocket.io rooms للرحلات.',
        en: 'Complete ride-hailing platform including: Backend API (Express 5/TypeScript), Dashboard (Next.js 16), and Flutter apps. Features: real-time GPS tracking via Redis GEO commands, nearby driver matching, Paymob payments + digital wallet, Unifonic SMS OTP, and Socket.io rooms for trips.',
      },
      thumbnail: '/portfolio/wasalni/home.png',
      images: [
        '/portfolio/wasalni/home.png',
        '/portfolio/wasalni/dashboard.svg',
        '/portfolio/wasalni/mobile.svg',
        '/portfolio/wasalni/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express 5', category: 'backend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'Flutter', category: 'mobile' },
        { name: 'MongoDB', category: 'database' },
        { name: 'Redis GEO', category: 'database' },
        { name: 'Socket.io', category: 'backend' },
      ],
      duration: '4 months',
      isFeatured: true,
      isPublished: true,
      order: 3,
    },
    {
      title: { ar: 'MWM — موقع الشركة', en: 'MWM — Corporate Website & CMS' },
      slug: 'mwm-corporate',
      shortDescription: {
        ar: 'موقع شركة MWM ثنائي اللغة مع نظام إدارة محتوى كامل',
        en: 'Bilingual MWM corporate website with full CMS capabilities',
      },
      description: {
        ar: 'موقع شركة MWM مبني كـ monorepo بـ npm workspaces. يشمل: Backend API (Express/TypeScript/MongoDB), Frontend (Next.js 14/Tailwind), و Shared Types. يدعم: إدارة المحتوى ثنائي اللغة, مدونة, وظائف, نشرة بريدية, Dark Mode, Firebase push notifications, و GitHub OAuth.',
        en: 'MWM corporate website built as a monorepo with npm workspaces. Includes: Backend API (Express/TypeScript/MongoDB), Frontend (Next.js 14/Tailwind), and Shared Types. Supports: bilingual CMS, blog, careers, newsletter, Dark Mode, Firebase push notifications, and GitHub OAuth.',
      },
      thumbnail: '/portfolio/mwm-corporate/home.png',
      images: [
        '/portfolio/mwm-corporate/home.png',
        '/portfolio/mwm-corporate/dashboard.svg',
        '/portfolio/mwm-corporate/mobile.svg',
        '/portfolio/mwm-corporate/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
        { name: 'Redis', category: 'database' },
        { name: 'Docker', category: 'devops' },
        { name: 'Tailwind CSS', category: 'frontend' },
      ],
      githubUrl: 'https://github.com/mahmoodhamdi/mwm',
      duration: '2 months',
      isFeatured: true,
      isPublished: true,
      order: 4,
    },

    // ── Web Applications ─────────────────────────────────────
    {
      title: { ar: 'أكاديمية ابن كثير', en: 'Ibn Katheer Academy' },
      slug: 'ebn-kathier',
      shortDescription: {
        ar: 'منصة إدارة أكاديمية قرآن كريم — واجهة عربية كاملة',
        en: 'Quran academy management platform — full Arabic RTL interface',
      },
      description: {
        ar: 'منصة إدارة أكاديمية ابن كثير لتحفيظ القرآن الكريم. تشمل: إدارة المعلمين والطلاب، الحلقات والجلسات، الحضور والغياب، متابعة حفظ القرآن، ومدفوعات المعلمين. واجهة عربية كاملة RTL مع NextAuth 5 ونظام أدوار (ADMIN/TEACHER).',
        en: 'Ibn Katheer Quran Academy management platform. Includes: teacher and student management, circles and sessions, attendance tracking, Quran memorization progress, and teacher payments. Full Arabic RTL interface with NextAuth 5 and role system (ADMIN/TEACHER).',
      },
      thumbnail: '/portfolio/ebn-kathier/login.png',
      images: [
        '/portfolio/ebn-kathier/login.png',
        '/portfolio/ebn-kathier/login-full.png',
        '/portfolio/ebn-kathier/dashboard.svg',
        '/portfolio/ebn-kathier/mobile.svg',
        '/portfolio/ebn-kathier/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'React 19', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma 7', category: 'database' },
        { name: 'NextAuth 5', category: 'backend' },
        { name: 'Tailwind CSS 4', category: 'frontend' },
        { name: 'shadcn/ui', category: 'frontend' },
      ],
      duration: '6 weeks',
      isFeatured: true,
      isPublished: true,
      order: 5,
    },
    {
      title: { ar: 'نظام حجز عيادات', en: 'Clinic Booking System' },
      slug: 'clinic-booking-system',
      shortDescription: {
        ar: 'نظام حجز مواعيد أطباء مع 88 API endpoint — Laravel + Next.js',
        en: 'Doctor appointment booking system with 88 API endpoints — Laravel + Next.js',
      },
      description: {
        ar: 'نظام حجز مواعيد أطباء متكامل مبني بـ Laravel 12 (backend) و Next.js 16 (frontend). يشمل 88 endpoint موثقة في API.md. الميزات: إدارة الأطباء والمرضى, جدولة المواعيد, نظام أدوار متقدم, وتقارير.',
        en: 'Complete doctor appointment booking system built with Laravel 12 (backend) and Next.js 16 (frontend). Includes 88 documented endpoints in API.md. Features: doctor and patient management, appointment scheduling, advanced role system, and reports.',
      },
      thumbnail: '/portfolio/clinic-booking-system/home.png',
      images: [
        '/portfolio/clinic-booking-system/home.png',
        '/portfolio/clinic-booking-system/dashboard.svg',
        '/portfolio/clinic-booking-system/mobile.svg',
        '/portfolio/clinic-booking-system/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Laravel 12', category: 'backend' },
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma', category: 'database' },
        { name: 'TypeScript', category: 'frontend' },
      ],
      duration: '8 weeks',
      isFeatured: false,
      isPublished: true,
      order: 6,
    },

    // ── Backend APIs ─────────────────────────────────────────
    {
      title: { ar: 'Escore API — منصة رياضات إلكترونية', en: 'Escore API — Esports Platform' },
      slug: 'escore-backend',
      shortDescription: {
        ar: 'API متكامل لمنصة أخبار وإحصائيات الرياضات الإلكترونية — 25 موديول',
        en: 'Full-featured esports news & statistics API — 25 feature modules',
      },
      description: {
        ar: 'واجهة برمجية متكاملة لمنصة Escore للرياضات الإلكترونية. تغطي: أخبار, بطولات, فرق, لاعبين, مباريات, نتائج مباشرة, انتقالات, تصنيفات, ومتابعة. تدعم 12 لغة عبر ترجمة AI. منشورة على DigitalOcean مع Swagger docs.',
        en: 'Full-featured API for the Escore esports platform. Covers: news, tournaments, teams, players, matches, live scores, transfers, standings, and following. Supports 12 languages via AI translation. Deployed on DigitalOcean with Swagger docs.',
      },
      thumbnail: '/portfolio/escore-backend/api-docs.png',
      images: [
        '/portfolio/escore-backend/api-docs.png',
        '/portfolio/escore-backend/api-redoc.png',
        '/portfolio/escore-backend/dashboard.svg',
        '/portfolio/escore-backend/features.svg',
      ],
      category: categories['backend-apis'],
      technologies: [
        { name: 'Node.js 20', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
        { name: 'Redis', category: 'database' },
        { name: 'Bull', category: 'backend' },
        { name: 'Socket.io', category: 'backend' },
        { name: 'Swagger', category: 'other' },
      ],
      liveUrl: 'https://api.escore.app/api-docs',
      duration: '3 months',
      isFeatured: true,
      isPublished: true,
      order: 7,
    },
    {
      title: { ar: 'لوحة تحكم Escore', en: 'Escore Admin Dashboard' },
      slug: 'escore-frontend',
      shortDescription: {
        ar: 'لوحة تحكم إدارية لمنصة Escore للرياضات الإلكترونية',
        en: 'Admin dashboard for the Escore esports platform',
      },
      description: {
        ar: 'لوحة تحكم إدارية لمنصة Escore مبنية بـ Next.js 16 و React 19 مع Tailwind 4. تدير: الأخبار, البطولات, الفرق, المباريات, المستخدمين, والإعدادات. تستخدم جلسات مشفرة AES-256-GCM.',
        en: 'Admin dashboard for the Escore platform built with Next.js 16 and React 19 with Tailwind 4. Manages: news, tournaments, teams, matches, users, and settings. Uses AES-256-GCM encrypted sessions.',
      },
      thumbnail: '/portfolio/escore-frontend/home.png',
      images: [
        '/portfolio/escore-frontend/home.png',
        '/portfolio/escore-frontend/home-full.png',
        '/portfolio/escore-frontend/dashboard.svg',
        '/portfolio/escore-frontend/mobile.svg',
        '/portfolio/escore-frontend/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'React 19', category: 'frontend' },
        { name: 'JavaScript', category: 'frontend' },
        { name: 'Tailwind CSS 4', category: 'frontend' },
      ],
      liveUrl: 'https://escore.app',
      duration: '6 weeks',
      isFeatured: false,
      isPublished: true,
      order: 8,
    },
    {
      title: { ar: 'Esports Flask API', en: 'Esports World Cup Flask API' },
      slug: 'esports-flask',
      shortDescription: {
        ar: 'API لأخبار وبطولات كأس العالم للرياضات الإلكترونية — Python/Flask',
        en: 'Esports World Cup news and tournaments API — Python/Flask',
      },
      description: {
        ar: 'واجهة برمجية مبنية بـ Python/Flask لأخبار وبطولات كأس العالم للرياضات الإلكترونية (EWC). تشمل: أخبار, بطولات, فرق, وتصنيفات EWC. موثقة بـ Flasgger (Swagger).',
        en: 'API built with Python/Flask for Esports World Cup (EWC) news and tournaments. Includes: news, tournaments, teams, and EWC rankings. Documented with Flasgger (Swagger).',
      },
      thumbnail: '/portfolio/esports-flask/home.png',
      images: [
        '/portfolio/esports-flask/home.png',
        '/portfolio/esports-flask/dashboard.svg',
        '/portfolio/esports-flask/mobile.svg',
        '/portfolio/esports-flask/features.svg',
      ],
      category: categories['backend-apis'],
      technologies: [
        { name: 'Python', category: 'backend' },
        { name: 'Flask', category: 'backend' },
        { name: 'SQLite', category: 'database' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Flasgger', category: 'other' },
      ],
      duration: '3 weeks',
      isFeatured: false,
      isPublished: true,
      order: 9,
    },
    {
      title: { ar: 'Sounds API — تعلم لغات', en: 'Sounds API — Language Learning' },
      slug: 'sounds-api',
      shortDescription: {
        ar: 'API لتطبيق تعلم اللغات مع تقييم النطق عبر SpeechAce',
        en: 'Language learning API with pronunciation scoring via SpeechAce',
      },
      description: {
        ar: 'واجهة برمجية لمنصة تعلم اللغات (Faesl). تشمل: إدارة الدروس والتمارين, تقييم النطق عبر SpeechAce AI, تتبع تقدم المتعلم, ونظام مستويات.',
        en: 'API for the Faesl language learning platform. Includes: lesson and exercise management, pronunciation scoring via SpeechAce AI, learner progress tracking, and level system.',
      },
      thumbnail: '/portfolio/sounds-api/home.png',
      images: [
        '/portfolio/sounds-api/home.png',
        '/portfolio/sounds-api/dashboard.svg',
        '/portfolio/sounds-api/mobile.svg',
        '/portfolio/sounds-api/features.svg',
      ],
      category: categories['backend-apis'],
      technologies: [
        { name: 'Python', category: 'backend' },
        { name: 'Flask', category: 'backend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'SpeechAce AI', category: 'other' },
      ],
      duration: '4 weeks',
      isFeatured: false,
      isPublished: true,
      order: 10,
    },
    {
      title: { ar: 'Video Downloader API', en: 'Video Downloader API' },
      slug: 'downloader-api',
      shortDescription: {
        ar: 'API لتحميل فيديوهات من 1000+ منصة — YouTube, TikTok, Instagram',
        en: 'Video download API for 1000+ platforms — YouTube, TikTok, Instagram',
      },
      description: {
        ar: 'واجهة برمجية لاستخراج روابط تحميل مباشرة من YouTube و1000+ منصة أخرى باستخدام yt-dlp. تدعم: فيديوهات فردية وقوائم تشغيل, اختيار الجودة (144p - 4K), استخراج صوت, وترجمات.',
        en: 'API for extracting direct download links from YouTube and 1000+ other platforms using yt-dlp. Supports: single videos and playlists, quality selection (144p - 4K), audio extraction, and subtitles.',
      },
      thumbnail: '/portfolio/downloader-api/home.png',
      images: [
        '/portfolio/downloader-api/home.png',
        '/portfolio/downloader-api/dashboard.svg',
        '/portfolio/downloader-api/mobile.svg',
        '/portfolio/downloader-api/features.svg',
      ],
      category: categories['backend-apis'],
      technologies: [
        { name: 'Python', category: 'backend' },
        { name: 'Flask', category: 'backend' },
        { name: 'yt-dlp', category: 'other' },
        { name: 'SQLite', category: 'database' },
        { name: 'Docker', category: 'devops' },
      ],
      githubUrl: 'https://github.com/mahmoodhamdi/downloader-api',
      duration: '2 weeks',
      isFeatured: false,
      isPublished: true,
      order: 11,
    },

    // ── Web Tools ────────────────────────────────────────────
    {
      title: { ar: 'محول CSV, JSON و Excel', en: 'CSV, JSON & Excel Converter' },
      slug: 'csv-excel-converter',
      shortDescription: {
        ar: 'أداة تحويل ملفات بين CSV, JSON, Excel, XML, TSV مع معاينة فورية',
        en: 'File converter between CSV, JSON, Excel, XML, TSV with live preview',
      },
      description: {
        ar: 'أداة ويب لتحويل الملفات بين صيغ متعددة (CSV, TSV, JSON, XLSX, XLS, XML) مع معاينة فورية. تدعم: رفع ملفات, لصق بيانات, استيراد من URL, تحويل دفعي (batch), محول بيانات (transform), وAPI docs. مبنية بـ Next.js 14 مع Zustand.',
        en: 'Web tool for converting files between multiple formats (CSV, TSV, JSON, XLSX, XLS, XML) with live preview. Supports: file upload, data paste, URL import, batch conversion, data transform, and API docs. Built with Next.js 14 and Zustand.',
      },
      thumbnail: '/portfolio/csv-excel-converter/home.png',
      images: [
        '/portfolio/csv-excel-converter/home.png',
        '/portfolio/csv-excel-converter/home-full.png',
        '/portfolio/csv-excel-converter/dashboard.svg',
        '/portfolio/csv-excel-converter/mobile.svg',
        '/portfolio/csv-excel-converter/features.svg',
      ],
      category: categories['web-tools'],
      technologies: [
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'React', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'Zustand', category: 'frontend' },
        { name: 'Tailwind CSS', category: 'frontend' },
        { name: 'Vitest', category: 'other' },
        { name: 'Playwright', category: 'other' },
      ],
      duration: '3 weeks',
      isFeatured: true,
      isPublished: true,
      order: 12,
    },
    {
      title: { ar: 'أداة التحقق من البريد الإلكتروني', en: 'Email Validator Tool' },
      slug: 'email-validator',
      shortDescription: {
        ar: 'أداة تحقق من البريد الإلكتروني بـ 13 خطوة — فحص DNS, MX, SMTP',
        en: '13-step email validation tool — DNS, MX, SMTP verification',
      },
      description: {
        ar: 'أداة تحقق شاملة من صحة البريد الإلكتروني بـ 13 خطوة: فحص الصيغة (RFC 5322), التحقق من النطاق, فحص MX records, كشف البريد المؤقت (disposable), فحص الأدوار (admin@, support@), اقتراحات الأخطاء الإملائية, والمزيد.',
        en: 'Comprehensive 13-step email validation tool: syntax check (RFC 5322), domain verification, MX record lookup, disposable email detection, role-based check (admin@, support@), typo suggestions, and more.',
      },
      thumbnail: '/portfolio/email-validator/home.png',
      images: [
        '/portfolio/email-validator/home.png',
        '/portfolio/email-validator/home-full.png',
        '/portfolio/email-validator/dashboard.svg',
        '/portfolio/email-validator/mobile.svg',
        '/portfolio/email-validator/features.svg',
      ],
      category: categories['web-tools'],
      technologies: [
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'React 19', category: 'frontend' },
        { name: 'Zustand', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
      ],
      duration: '2 weeks',
      isFeatured: false,
      isPublished: true,
      order: 13,
    },
    {
      title: { ar: 'محرر Markdown إلى PDF', en: 'Markdown to PDF Editor' },
      slug: 'markdown-to-pdf',
      shortDescription: {
        ar: 'محرر Markdown مع معاينة فورية وتصدير PDF — ثيمات متعددة',
        en: 'Markdown editor with live preview and PDF export — multiple themes',
      },
      description: {
        ar: 'محرر Markdown احترافي مع معاينة فورية وتصدير PDF. يدعم: تمييز الصيغة, ثيمات متعددة, قوالب جاهزة, تحويل دفعي, شريط أدوات تنسيق, وعداد كلمات. مبني بـ Next.js 14 مع واجهة split-view.',
        en: 'Professional Markdown editor with live preview and PDF export. Supports: syntax highlighting, multiple themes, ready-made templates, batch conversion, formatting toolbar, and word counter. Built with Next.js 14 with split-view interface.',
      },
      thumbnail: '/portfolio/markdown-to-pdf/home.png',
      images: [
        '/portfolio/markdown-to-pdf/home.png',
        '/portfolio/markdown-to-pdf/dashboard.svg',
        '/portfolio/markdown-to-pdf/mobile.svg',
        '/portfolio/markdown-to-pdf/features.svg',
      ],
      category: categories['web-tools'],
      technologies: [
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'React', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'Tailwind CSS', category: 'frontend' },
      ],
      duration: '2 weeks',
      isFeatured: true,
      isPublished: true,
      order: 14,
    },
    {
      title: { ar: 'مختصر روابط URL', en: 'URL Shortener' },
      slug: 'url-shortener',
      shortDescription: {
        ar: 'أداة اختصار روابط مع تحليلات وQR codes وحماية بكلمة مرور',
        en: 'URL shortener with analytics, QR codes, and password protection',
      },
      description: {
        ar: 'أداة اختصار روابط احترافية مع: تحليلات مفصلة (نقرات, مواقع, أجهزة), توليد QR codes, حماية بكلمة مرور, اختصار دفعي, وAPI docs. مبنية بـ Next.js 14.',
        en: 'Professional URL shortener with: detailed analytics (clicks, locations, devices), QR code generation, password protection, bulk shortening, and API docs. Built with Next.js 14.',
      },
      thumbnail: '/portfolio/url-shortener/home.png',
      images: [
        '/portfolio/url-shortener/home.png',
        '/portfolio/url-shortener/dashboard.svg',
        '/portfolio/url-shortener/mobile.svg',
        '/portfolio/url-shortener/features.svg',
      ],
      category: categories['web-tools'],
      technologies: [
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'React', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
      ],
      duration: '2 weeks',
      isFeatured: false,
      isPublished: true,
      order: 15,
    },
    {
      title: { ar: 'أداة إرسال بريد جماعي', en: 'Bulk Email Sender' },
      slug: 'bulk-email-sender',
      shortDescription: {
        ar: 'نظام إرسال بريد جماعي مع حملات وقوالب وتحليلات',
        en: 'Bulk email sending system with campaigns, templates, and analytics',
      },
      description: {
        ar: 'نظام إرسال بريد إلكتروني جماعي متكامل. يشمل: لوحة تحكم, إدارة حملات (draft/sending/completed), قوالب بريد, إدارة جهات اتصال مع استيراد CSV, تحليلات (open rate, click rate), وإعدادات SMTP.',
        en: 'Complete bulk email sending system. Includes: dashboard, campaign management (draft/sending/completed), email templates, contact management with CSV import, analytics (open rate, click rate), and SMTP settings.',
      },
      thumbnail: '/portfolio/bulk-email-sender/home.png',
      images: [
        '/portfolio/bulk-email-sender/home.png',
        '/portfolio/bulk-email-sender/dashboard.svg',
        '/portfolio/bulk-email-sender/mobile.svg',
        '/portfolio/bulk-email-sender/features.svg',
      ],
      category: categories['web-tools'],
      technologies: [
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'React', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'Stripe', category: 'other' },
        { name: 'Paymob', category: 'other' },
      ],
      duration: '3 weeks',
      isFeatured: false,
      isPublished: true,
      order: 16,
    },

    // ── Marketing Websites ───────────────────────────────────
    {
      title: { ar: 'Smart Stand Egypt', en: 'Smart Stand Egypt Website' },
      slug: 'smartstand-egypt',
      shortDescription: {
        ar: 'موقع تسويقي لشركة حلول العرض والتسويق — تصميم ذهبي أنيق',
        en: 'Marketing website for display solutions company — elegant gold design',
      },
      description: {
        ar: 'موقع تسويقي لشركة Smart Stand Egypt المتخصصة في حلول العرض والتسويق. تصميم أنيق بألوان ذهبية مع: lazy loading ذكي, carousels مخصصة, animations عند التمرير, وعرض شركاء (LG, Red Bull, TCL, Panasonic). مبني بـ Next.js 16 كـ single-page.',
        en: 'Marketing website for Smart Stand Egypt, a display solutions company. Elegant gold-themed design with: smart lazy loading, custom carousels, scroll animations, and partner showcase (LG, Red Bull, TCL, Panasonic). Built with Next.js 16 as a single-page app.',
      },
      thumbnail: '/portfolio/smartstand-egypt/home.png',
      images: [
        '/portfolio/smartstand-egypt/home.png',
        '/portfolio/smartstand-egypt/home-full.png',
        '/portfolio/smartstand-egypt/dashboard.svg',
        '/portfolio/smartstand-egypt/mobile.svg',
        '/portfolio/smartstand-egypt/features.svg',
      ],
      category: categories['marketing-websites'],
      technologies: [
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'React 19', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'Tailwind CSS 4', category: 'frontend' },
        { name: 'Framer Motion', category: 'frontend' },
      ],
      duration: '2 weeks',
      isFeatured: true,
      isPublished: true,
      order: 17,
    },
    {
      title: { ar: 'دليل فروع LG مصر', en: 'LG Egypt Branch Finder' },
      slug: 'lg-branchs',
      shortDescription: {
        ar: 'تطبيق ويب للعثور على أقرب فروع LG في مصر — عربي كامل RTL',
        en: 'Web app for finding nearest LG stores in Egypt — full Arabic RTL',
      },
      description: {
        ar: 'تطبيق ويب للعثور على أقرب فروع LG Electronics في مصر. يستخدم: GPS المتصفح مع Haversine formula لحساب المسافات, بحث فوري بالاسم والمنطقة والمحافظة, كاشينج localStorage, ووضع مظلم. يشمل أيضاً: سكريبت Python لاستخراج إحداثيات من Google Maps, ومولد QR codes.',
        en: 'Web app for finding the nearest LG Electronics stores in Egypt. Uses: browser GPS with Haversine formula for distance calculation, real-time search by name/district/governorate, localStorage caching, and dark mode. Also includes: Python script for extracting coordinates from Google Maps, and QR code generator.',
      },
      thumbnail: '/portfolio/lg-branchs/home.png',
      images: [
        '/portfolio/lg-branchs/home.png',
        '/portfolio/lg-branchs/home-full.png',
        '/portfolio/lg-branchs/dashboard.svg',
        '/portfolio/lg-branchs/mobile.svg',
        '/portfolio/lg-branchs/features.svg',
      ],
      category: categories['marketing-websites'],
      technologies: [
        { name: 'HTML/CSS/JS', category: 'frontend' },
        { name: 'Python', category: 'backend' },
        { name: 'Geolocation API', category: 'other' },
        { name: 'GitHub Pages', category: 'devops' },
      ],
      liveUrl: 'https://lg-branchs.store',
      duration: '1 week',
      isFeatured: false,
      isPublished: true,
      order: 18,
    },

    // ── Automation & Scraping ────────────────────────────────
    {
      title: { ar: 'بوت واتساب مع Google Sheets', en: 'WhatsApp Bot + Google Sheets SaaS' },
      slug: 'whatsapp-sheets-bot',
      shortDescription: {
        ar: 'SaaS لأتمتة ردود واتساب للأعمال مع Stripe واشتراكات',
        en: 'SaaS for automating WhatsApp business replies with Stripe subscriptions',
      },
      description: {
        ar: 'تطبيق SaaS متكامل لأتمتة ردود واتساب للأعمال الصغيرة والعيادات والمطاعم. يشمل: اتصال WhatsApp Web عبر Baileys, مزامنة Google Sheets, اشتراكات Stripe, دعم ثنائي اللغة (عربي RTL + إنجليزي), 247 اختبار وحدة و95 اختبار E2E.',
        en: 'Complete SaaS application for automating WhatsApp replies for small businesses, clinics, and restaurants. Includes: WhatsApp Web connection via Baileys, Google Sheets sync, Stripe subscriptions, bilingual support (Arabic RTL + English), 247 unit tests and 95 E2E tests.',
      },
      thumbnail: '/portfolio/whatsapp-sheets-bot/home.png',
      images: [
        '/portfolio/whatsapp-sheets-bot/home.png',
        '/portfolio/whatsapp-sheets-bot/dashboard.svg',
        '/portfolio/whatsapp-sheets-bot/mobile.svg',
        '/portfolio/whatsapp-sheets-bot/features.svg',
      ],
      category: categories['automation-scraping'],
      technologies: [
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma', category: 'database' },
        { name: 'Baileys', category: 'backend' },
        { name: 'Stripe', category: 'other' },
        { name: 'NextAuth v5', category: 'backend' },
      ],
      githubUrl: 'https://github.com/mahmoodhamdi/whatsapp-sheets-bot',
      duration: '4 weeks',
      isFeatured: false,
      isPublished: true,
      order: 19,
    },
    {
      title: {
        ar: 'Artneer — سكرابينج شركات مقاولات',
        en: 'Artneer — Construction Companies Scraper',
      },
      slug: 'artneer',
      shortDescription: {
        ar: 'أداة CLI لجمع بيانات شركات المقاولات في مصر والسعودية والإمارات',
        en: 'CLI tool for scraping construction company data in Egypt, Saudi Arabia, and UAE',
      },
      description: {
        ar: 'أداة سكرابينج مبنية بـ Python تجمع بيانات الاتصال (إيميلات, هواتف, عناوين, مواقع) لشركات المقاولات من 8 مصادر مختلفة. تنتج ملفات Excel مع RTL عربي, CSV, و JSON. تستهدف مصر والسعودية والإمارات.',
        en: 'Python-based scraping tool that collects contact data (emails, phones, addresses, websites) for construction companies from 8 different sources. Produces Excel files with Arabic RTL, CSV, and JSON. Targets Egypt, Saudi Arabia, and UAE.',
      },
      thumbnail: '/portfolio/artneer/home.png',
      images: [
        '/portfolio/artneer/home.png',
        '/portfolio/artneer/dashboard.svg',
        '/portfolio/artneer/mobile.svg',
        '/portfolio/artneer/features.svg',
      ],
      category: categories['automation-scraping'],
      technologies: [
        { name: 'Python 3', category: 'backend' },
        { name: 'Click CLI', category: 'other' },
        { name: 'BeautifulSoup', category: 'other' },
        { name: 'Pandas', category: 'other' },
        { name: 'Cloudscraper', category: 'other' },
      ],
      duration: '2 weeks',
      isFeatured: false,
      isPublished: true,
      order: 20,
    },
    {
      title: { ar: 'Price Hunter — مقارنة أسعار', en: 'Price Hunter — Price Comparison' },
      slug: 'price-hunter',
      shortDescription: {
        ar: 'منصة مقارنة أسعار مع 15+ سكرابر لمتاجر إلكترونية',
        en: 'Price comparison platform with 15+ store scrapers',
      },
      description: {
        ar: 'منصة مقارنة أسعار تجمع بيانات المنتجات من 15+ متجر إلكتروني عبر web scraping مع BullMQ job queues. تشمل: بحث عبر المتاجر, تتبع أسعار, تنبيهات انخفاض سعر, وعرض المنتجات الرائجة.',
        en: 'Price comparison platform that aggregates product data from 15+ online stores via web scraping with BullMQ job queues. Includes: cross-store search, price tracking, price drop alerts, and trending products display.',
      },
      thumbnail: '/portfolio/price-hunter/home.png',
      images: [
        '/portfolio/price-hunter/home.png',
        '/portfolio/price-hunter/home-full.png',
        '/portfolio/price-hunter/dashboard.svg',
        '/portfolio/price-hunter/mobile.svg',
        '/portfolio/price-hunter/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma', category: 'database' },
        { name: 'BullMQ', category: 'backend' },
        { name: 'Redis', category: 'database' },
        { name: 'Puppeteer', category: 'other' },
      ],
      duration: '6 weeks',
      isFeatured: false,
      isPublished: true,
      order: 21,
    },

    // ── Additional Full-Stack Platforms ─────────────────────
    {
      title: { ar: 'المضيف السعودي — منصة سياحة', en: 'Saudi Host — Tourist Guide Platform' },
      slug: 'saudi-host',
      shortDescription: {
        ar: 'منصة ربط سياح بمرشدين محليين في المملكة العربية السعودية',
        en: 'Platform connecting tourists with local guides in Saudi Arabia',
      },
      description: {
        ar: 'منصة سياحية تربط الزوار بمرشدين سياحيين محليين في السعودية. تشمل: Backend API (Node.js/Express/TypeScript), Dashboard (Next.js 14), وتطبيق Flutter. تدعم: حجز جولات, تقييمات, دفع إلكتروني, ومحادثة فورية.',
        en: 'Tourism platform connecting visitors with local guides in Saudi Arabia. Includes: Backend API (Node.js/Express/TypeScript), Dashboard (Next.js 14), and Flutter app. Supports: tour booking, ratings, online payments, and real-time chat.',
      },
      thumbnail: '/portfolio/saudi-host/home.png',
      images: [
        '/portfolio/saudi-host/home.png',
        '/portfolio/saudi-host/dashboard.svg',
        '/portfolio/saudi-host/mobile.svg',
        '/portfolio/saudi-host/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'Flutter', category: 'mobile' },
        { name: 'MongoDB', category: 'database' },
      ],
      duration: '3 months',
      isFeatured: false,
      isPublished: true,
      order: 22,
    },
    {
      title: { ar: 'منصة صبري', en: 'Sabry Platform' },
      slug: 'sabry',
      shortDescription: {
        ar: 'منصة خدمات متعددة مع أنواع مشتركة بين الباك إند والفرونت إند',
        en: 'Multi-service platform with shared TypeScript types across frontend and backend',
      },
      description: {
        ar: 'منصة خدمات متعددة تشمل Backend API (Node.js/Express) و Frontend (Next.js) مع مكتبة أنواع TypeScript مشتركة. تتبع معمارية Clean Architecture مع فصل كامل بين الطبقات.',
        en: 'Multi-service platform including Backend API (Node.js/Express) and Frontend (Next.js) with shared TypeScript types library. Follows Clean Architecture with full separation of concerns.',
      },
      thumbnail: '/portfolio/sabry/home.png',
      images: [
        '/portfolio/sabry/home.png',
        '/portfolio/sabry/dashboard.svg',
        '/portfolio/sabry/mobile.svg',
        '/portfolio/sabry/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'Next.js', category: 'frontend' },
        { name: 'TypeScript', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
      ],
      duration: '6 weeks',
      isFeatured: false,
      isPublished: true,
      order: 23,
    },

    // ── Additional Web Applications ────────────────────────
    {
      title: { ar: 'Dare — متجر إلكتروني', en: 'Dare — E-Commerce Platform' },
      slug: 'dare',
      shortDescription: {
        ar: 'منصة تجارة إلكترونية ثنائية اللغة مع Filament 3 ولوحة تحكم متكاملة',
        en: 'Bilingual e-commerce platform with Filament 3 admin panel',
      },
      description: {
        ar: 'متجر إلكتروني متكامل مبني بـ Laravel 10 و Filament 3. يدعم: عربي/إنجليزي, إدارة المنتجات والتصنيفات, سلة مشتريات, إدارة الطلبات, نظام دفع, ولوحة تحكم Filament مع Livewire 3 لتجربة SPA.',
        en: 'Complete e-commerce store built with Laravel 10 and Filament 3. Supports: Arabic/English, product and category management, shopping cart, order management, payment system, and Filament admin panel with Livewire 3 for SPA experience.',
      },
      thumbnail: '/portfolio/dare/home.png',
      images: [
        '/portfolio/dare/home.png',
        '/portfolio/dare/dashboard.svg',
        '/portfolio/dare/mobile.svg',
        '/portfolio/dare/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Laravel 10', category: 'backend' },
        { name: 'Filament 3', category: 'backend' },
        { name: 'Livewire 3', category: 'frontend' },
        { name: 'MySQL', category: 'database' },
        { name: 'Tailwind CSS', category: 'frontend' },
      ],
      duration: '5 weeks',
      isFeatured: false,
      isPublished: true,
      order: 24,
    },
    {
      title: { ar: 'منصة دروس خصوصية', en: 'Online Tutoring System' },
      slug: 'tutoring-system',
      shortDescription: {
        ar: 'منصة تعليمية لحجز وإدارة جلسات الدروس الخصوصية',
        en: 'Educational platform for booking and managing tutoring sessions',
      },
      description: {
        ar: 'منصة تعليمية متكاملة لحجز وإدارة جلسات الدروس الخصوصية أونلاين. تشمل: إدارة المعلمين والطلاب, حجز الجلسات, نظام تقييم, ودفع إلكتروني.',
        en: 'Complete educational platform for booking and managing online tutoring sessions. Includes: teacher and student management, session booking, rating system, and online payments.',
      },
      thumbnail: '/portfolio/tutoring-system/home.png',
      images: [
        '/portfolio/tutoring-system/home.png',
        '/portfolio/tutoring-system/dashboard.svg',
        '/portfolio/tutoring-system/mobile.svg',
        '/portfolio/tutoring-system/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Next.js', category: 'frontend' },
        { name: 'Node.js', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
        { name: 'TypeScript', category: 'backend' },
      ],
      duration: '4 weeks',
      isFeatured: false,
      isPublished: true,
      order: 25,
    },

    // ── Additional Marketing & Static Sites ────────────────
    {
      title: { ar: 'بورتفوليو خمسات', en: 'Khamsat Services Portfolio' },
      slug: 'khamsat-portfolio',
      shortDescription: {
        ar: 'بورتفوليو احترافي لعرض خدمات على منصة خمسات — 15+ خدمة',
        en: 'Professional portfolio showcasing Khamsat platform services — 15+ services',
      },
      description: {
        ar: 'بورتفوليو ويب احترافي لعرض الخدمات المقدمة على منصة خمسات. يشمل 15+ نموذج خدمة مع وصف تفصيلي, أمثلة أعمال, والأسعار. مبني بـ HTML/CSS/JavaScript مع قوالب جاهزة.',
        en: 'Professional web portfolio showcasing services offered on the Khamsat platform. Includes 15+ service templates with detailed descriptions, work samples, and pricing. Built with HTML/CSS/JavaScript with ready-made templates.',
      },
      thumbnail: '/portfolio/khamsat-portfolio/home.png',
      images: [
        '/portfolio/khamsat-portfolio/home.png',
        '/portfolio/khamsat-portfolio/dashboard.svg',
        '/portfolio/khamsat-portfolio/mobile.svg',
        '/portfolio/khamsat-portfolio/features.svg',
      ],
      category: categories['marketing-websites'],
      technologies: [
        { name: 'HTML5', category: 'frontend' },
        { name: 'CSS3', category: 'frontend' },
        { name: 'JavaScript', category: 'frontend' },
      ],
      duration: '1 week',
      isFeatured: false,
      isPublished: true,
      order: 26,
    },

    // ── Additional Tools & APIs ────────────────────────────
    {
      title: { ar: 'Screenshot API', en: 'Screenshot API' },
      slug: 'screenshot-api',
      shortDescription: {
        ar: 'واجهة برمجية لأخذ لقطات شاشة لأي موقع ويب برمجياً',
        en: 'API for programmatically taking screenshots of any website',
      },
      description: {
        ar: 'واجهة برمجية لأخذ لقطات شاشة عالية الجودة لأي URL. تدعم: تخصيص أبعاد الشاشة, Full-page screenshots, اختيار العنصر المستهدف بـ CSS selector, وانتظار تحميل المحتوى.',
        en: 'API for taking high-quality screenshots of any URL. Supports: custom viewport dimensions, full-page screenshots, CSS selector targeting, and content loading wait strategies.',
      },
      thumbnail: '/portfolio/screenshot-api/home.png',
      images: [
        '/portfolio/screenshot-api/home.png',
        '/portfolio/screenshot-api/dashboard.svg',
        '/portfolio/screenshot-api/mobile.svg',
        '/portfolio/screenshot-api/features.svg',
      ],
      category: categories['backend-apis'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'Puppeteer', category: 'other' },
      ],
      duration: '1 week',
      isFeatured: false,
      isPublished: true,
      order: 27,
    },
    {
      title: { ar: 'أداة نفق الشبكة المحلية', en: 'Localhost Tunnel' },
      slug: 'localhost-tunnel',
      shortDescription: {
        ar: 'أداة لمشاركة خادم التطوير المحلي عبر الإنترنت بدون إعدادات معقدة',
        en: 'Tool for sharing local dev server over the internet without complex setup',
      },
      description: {
        ar: 'أداة Node.js تنشئ نفقاً آمناً لمشاركة خادم localhost مع العالم. مفيدة لاختبار Webhooks, عرض العمل للعملاء, واختبار الأجهزة المحمولة على خوادم التطوير المحلية.',
        en: 'Node.js tool that creates a secure tunnel to share your localhost server with the world. Useful for testing webhooks, demoing work to clients, and testing mobile devices against local dev servers.',
      },
      thumbnail: '/portfolio/localhost-tunnel/home.png',
      images: [
        '/portfolio/localhost-tunnel/home.png',
        '/portfolio/localhost-tunnel/dashboard.svg',
        '/portfolio/localhost-tunnel/mobile.svg',
        '/portfolio/localhost-tunnel/features.svg',
      ],
      category: categories['web-tools'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'WebSocket', category: 'backend' },
      ],
      duration: '3 days',
      isFeatured: false,
      isPublished: true,
      order: 28,
    },
    // ── 5 New Large-Scale Projects ──────────────────────────────
    {
      title: {
        ar: 'منصة إدارة أكاديمية ابن كثير القرآنية',
        en: 'Ebn Kathier Quran Academy Platform',
      },
      slug: 'ebn-kathier-academy',
      shortDescription: {
        ar: 'منصة شاملة لإدارة أكاديمية تحفيظ القرآن الكريم — حلقات، طلاب، معلمين، شهادات',
        en: 'Comprehensive Quran academy management platform — classes, students, teachers, certificates',
      },
      description: {
        ar: 'منصة كاملة لإدارة أكاديمية تحفيظ القرآن الكريم تشمل: إدارة الحلقات والجدول الزمني, تسجيل الطلاب وتتبع التقدم, نظام الحضور والغياب, إصدار الشهادات والإجازات, لوحة تحكم للإدارة والمعلمين, ودعم كامل للغة العربية مع واجهة RTL.',
        en: 'Full-featured Quran memorization academy platform including: class management and scheduling, student enrollment and progress tracking, attendance system, certificate issuance, admin and teacher dashboards, and complete Arabic language support with RTL interface.',
      },
      challenge: {
        ar: 'بناء نظام يدعم إدارة عشرات الحلقات ومئات الطلاب مع تتبع دقيق لتقدم الحفظ والمراجعة',
        en: 'Building a system that supports managing dozens of classes and hundreds of students with precise memorization and review progress tracking',
      },
      solution: {
        ar: 'استخدمنا Next.js 16 مع Prisma و PostgreSQL لقاعدة بيانات علائقية قوية, مع NextAuth للمصادقة ونظام أدوار متعدد المستويات',
        en: 'We used Next.js 16 with Prisma and PostgreSQL for a robust relational database, with NextAuth for authentication and a multi-level role system',
      },
      thumbnail: '/portfolio/ebn-kathier/login.png',
      images: [
        '/portfolio/ebn-kathier/login.png',
        '/portfolio/ebn-kathier/login-full.png',
        '/portfolio/ebn-kathier/dashboard.svg',
        '/portfolio/ebn-kathier/mobile.svg',
        '/portfolio/ebn-kathier/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'React 19', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma 7', category: 'backend' },
        { name: 'NextAuth 5', category: 'backend' },
        { name: 'Tailwind CSS', category: 'frontend' },
        { name: 'TypeScript', category: 'language' },
      ],
      duration: '3 months',
      isFeatured: true,
      isPublished: true,
      order: 29,
    },
    {
      title: { ar: 'نظام حجز عيادات طبية', en: 'Clinic Booking System' },
      slug: 'clinic-booking-system-project',
      shortDescription: {
        ar: 'نظام حجز مواعيد طبية كامل بـ 88 نقطة API — Laravel + Next.js',
        en: 'Complete medical appointment booking system with 88 API endpoints — Laravel + Next.js',
      },
      description: {
        ar: 'نظام حجز عيادات طبية احترافي يشمل: 88 نقطة API موثقة, إدارة الأطباء والتخصصات, نظام حجز مواعيد ذكي مع تجنب التعارض, لوحة تحكم إدارية كاملة, إشعارات بريد إلكتروني, ونظام تقييمات ومراجعات. مبني بـ Laravel 12 للباك اند و Next.js 16 للفرونت اند.',
        en: 'Professional clinic booking system featuring: 88 documented API endpoints, doctor and specialty management, intelligent appointment scheduling with conflict avoidance, full admin dashboard, email notifications, and ratings/reviews system. Built with Laravel 12 backend and Next.js 16 frontend.',
      },
      challenge: {
        ar: 'تصميم نظام حجز يتعامل مع جداول أطباء متعددة ويمنع تعارض المواعيد مع أداء عالي',
        en: 'Designing a booking system that handles multiple doctor schedules and prevents appointment conflicts with high performance',
      },
      solution: {
        ar: 'بنينا API قوي بـ Laravel مع 88 endpoint وتوثيق كامل, ونظام حجز ذكي يتحقق من التعارضات في الوقت الحقيقي',
        en: 'We built a robust API with Laravel featuring 88 endpoints and full documentation, with an intelligent booking system that checks conflicts in real-time',
      },
      thumbnail: '/portfolio/clinic-booking-system/home.png',
      images: [
        '/portfolio/clinic-booking-system/home.png',
        '/portfolio/clinic-booking-system/dashboard.svg',
        '/portfolio/clinic-booking-system/mobile.svg',
        '/portfolio/clinic-booking-system/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Laravel 12', category: 'backend' },
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma', category: 'backend' },
        { name: 'Tailwind CSS', category: 'frontend' },
        { name: 'TypeScript', category: 'language' },
        { name: 'PHP', category: 'language' },
      ],
      duration: '2.5 months',
      isFeatured: true,
      isPublished: true,
      order: 30,
    },
    {
      title: {
        ar: 'منصة مقارنة الأسعار Price Hunter',
        en: 'Price Hunter - Price Comparison Platform',
      },
      slug: 'price-hunter-platform',
      shortDescription: {
        ar: 'منصة مقارنة أسعار ذكية تراقب 15+ متجر إلكتروني تلقائياً مع تنبيهات فورية',
        en: 'Smart price comparison platform monitoring 15+ online stores automatically with instant alerts',
      },
      description: {
        ar: 'منصة Price Hunter تراقب أسعار المنتجات عبر أكثر من 15 متجر إلكتروني (Amazon, Noon, Jumia, ...) وترسل تنبيهات فورية عند انخفاض الأسعار. تشمل: scrapers ذكية لكل متجر, جدولة مهام مع BullMQ, واجهة بحث متقدمة, رسوم بيانية لتاريخ الأسعار, ونظام تنبيهات بالبريد.',
        en: 'Price Hunter platform monitors product prices across 15+ online stores (Amazon, Noon, Jumia, ...) and sends instant alerts when prices drop. Features: intelligent per-store scrapers, task scheduling with BullMQ, advanced search interface, price history charts, and email alert system.',
      },
      challenge: {
        ar: 'بناء نظام scraping موثوق يتعامل مع 15+ موقع مختلف دون حظر، مع تحديث الأسعار بشكل مستمر',
        en: 'Building a reliable scraping system that handles 15+ different websites without being blocked, with continuous price updates',
      },
      solution: {
        ar: 'استخدمنا Puppeteer مع proxy rotation و BullMQ لجدولة المهام, مع Prisma و PostgreSQL لتخزين تاريخ الأسعار بكفاءة',
        en: 'We used Puppeteer with proxy rotation and BullMQ for task scheduling, with Prisma and PostgreSQL for efficient price history storage',
      },
      thumbnail: '/portfolio/price-hunter/home.png',
      images: [
        '/portfolio/price-hunter/home.png',
        '/portfolio/price-hunter/home-full.png',
        '/portfolio/price-hunter/dashboard.svg',
        '/portfolio/price-hunter/mobile.svg',
        '/portfolio/price-hunter/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Next.js 14', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Prisma', category: 'backend' },
        { name: 'BullMQ', category: 'backend' },
        { name: 'Puppeteer', category: 'tools' },
        { name: 'Redis', category: 'database' },
        { name: 'TypeScript', category: 'language' },
      ],
      duration: '2 months',
      isFeatured: true,
      isPublished: true,
      order: 31,
    },
    {
      title: { ar: 'منصة E-Score للرياضات الإلكترونية', en: 'E-Score Esports Platform' },
      slug: 'escore-platform',
      shortDescription: {
        ar: 'منصة رياضات إلكترونية متكاملة — 25 وحدة API + لوحة تحكم إدارية كاملة',
        en: 'Complete esports platform — 25 API modules + full admin dashboard',
      },
      description: {
        ar: 'منصة E-Score هي نظام رياضات إلكترونية متكامل يشمل: 25 وحدة API (مستخدمين، فرق، بطولات، مباريات، إحصائيات، أخبار، ...), لوحة تحكم إدارية كاملة بـ Next.js, نظام إشعارات حقيقي بـ Socket.io, دعم iOS Live Activities بـ APNs, ونظام تحليلات متقدم.',
        en: 'E-Score is a comprehensive esports platform featuring: 25 API modules (users, teams, tournaments, matches, statistics, news, ...), full admin dashboard with Next.js, real-time notifications with Socket.io, iOS Live Activities via APNs, and advanced analytics system.',
      },
      challenge: {
        ar: 'بناء نظام real-time يدعم آلاف المستخدمين المتصلين مع 25 وحدة API متكاملة وإشعارات فورية',
        en: 'Building a real-time system supporting thousands of concurrent users with 25 integrated API modules and instant notifications',
      },
      solution: {
        ar: 'بنينا Backend بـ Node.js/Express مع MongoDB و Redis للكاش, Socket.io للتحديثات الحية, وAPNs لإشعارات iOS',
        en: 'We built the Backend with Node.js/Express with MongoDB and Redis caching, Socket.io for live updates, and APNs for iOS notifications',
      },
      thumbnail: '/portfolio/escore-frontend/home.png',
      images: [
        '/portfolio/escore-frontend/home.png',
        '/portfolio/escore-frontend/home-full.png',
        '/portfolio/escore-backend/api-docs.png',
        '/portfolio/escore-backend/api-redoc.png',
        '/portfolio/escore-frontend/dashboard.svg',
        '/portfolio/escore-frontend/features.svg',
      ],
      category: categories['full-stack-platforms'],
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend' },
        { name: 'Next.js 16', category: 'frontend' },
        { name: 'MongoDB', category: 'database' },
        { name: 'Redis', category: 'database' },
        { name: 'Socket.io', category: 'backend' },
        { name: 'TypeScript', category: 'language' },
        { name: 'Bull', category: 'backend' },
      ],
      duration: '4 months',
      isFeatured: true,
      isPublished: true,
      order: 32,
    },
    {
      title: { ar: 'منصة التجارة الإلكترونية Dare', en: 'Dare E-Commerce Platform' },
      slug: 'dare-ecommerce',
      shortDescription: {
        ar: 'منصة تجارة إلكترونية ثنائية اللغة (عربي/إنجليزي) بـ Laravel + Filament 3',
        en: 'Bilingual (Arabic/English) e-commerce platform with Laravel + Filament 3',
      },
      description: {
        ar: 'منصة Dare للتجارة الإلكترونية مبنية بـ Laravel 10 مع Filament 3 للوحة التحكم و Livewire 3 للتفاعلية. تشمل: كتالوج منتجات متقدم مع تصفية وبحث, سلة مشتريات وعملية شراء كاملة, نظام دفع إلكتروني, إدارة طلبات ومخزون, لوحة تحكم إدارية غنية بالرسوم البيانية, ودعم كامل RTL للعربية.',
        en: 'Dare e-commerce platform built with Laravel 10, Filament 3 for admin panel, and Livewire 3 for interactivity. Features: advanced product catalog with filtering and search, complete shopping cart and checkout flow, payment integration, order and inventory management, analytics-rich admin dashboard, and full RTL Arabic support.',
      },
      challenge: {
        ar: 'بناء منصة تجارة إلكترونية كاملة تدعم اللغتين العربية والإنجليزية مع لوحة تحكم سهلة الاستخدام',
        en: 'Building a complete e-commerce platform supporting both Arabic and English with a user-friendly admin panel',
      },
      solution: {
        ar: 'استخدمنا Laravel مع Filament 3 لبناء لوحة تحكم قوية بسرعة, و Livewire 3 للتفاعلية بدون JavaScript معقد',
        en: 'We used Laravel with Filament 3 to rapidly build a powerful admin panel, and Livewire 3 for interactivity without complex JavaScript',
      },
      thumbnail: '/portfolio/dare/home.png',
      images: [
        '/portfolio/dare/home.png',
        '/portfolio/dare/dashboard.svg',
        '/portfolio/dare/mobile.svg',
        '/portfolio/dare/features.svg',
      ],
      category: categories['web-applications'],
      technologies: [
        { name: 'Laravel 10', category: 'backend' },
        { name: 'Filament 3', category: 'frontend' },
        { name: 'Livewire 3', category: 'frontend' },
        { name: 'MySQL', category: 'database' },
        { name: 'Tailwind CSS', category: 'frontend' },
        { name: 'PHP', category: 'language' },
        { name: 'Alpine.js', category: 'frontend' },
      ],
      duration: '2 months',
      isFeatured: true,
      isPublished: true,
      order: 33,
    },
  ];

  for (const project of projects) {
    await Project.findOneAndUpdate(
      { slug: project.slug },
      { $set: project },
      { upsert: true, new: true }
    );
  }

  console.log(`Projects seeded successfully! (${projects.length} projects)`);
};

// ═══════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════
const seedUsers = async () => {
  console.log('Seeding Users...');

  await User.deleteOne({ email: 'admin@mwm.com' });

  await User.create({
    name: 'Admin',
    email: 'admin@mwm.com',
    password: 'Admin123!@#',
    role: UserRoles.SUPER_ADMIN,
    isEmailVerified: true,
    isActive: true,
    loginAttempts: 0,
    lockUntil: undefined,
  });

  console.log('Admin user created (admin@mwm.com / Admin123!@#)');
};

// ═══════════════════════════════════════════════════════════════
// BLOG CATEGORIES & POSTS
// ═══════════════════════════════════════════════════════════════
const seedBlogCategories = async () => {
  console.log('Seeding Blog Categories...');

  const categories = [
    {
      name: { ar: 'تقنية', en: 'Technology' },
      slug: 'technology',
      description: { ar: 'مقالات تقنية وبرمجية', en: 'Technology and programming articles' },
      isActive: true,
    },
    {
      name: { ar: 'تصميم', en: 'Design' },
      slug: 'design',
      description: { ar: 'مقالات التصميم وتجربة المستخدم', en: 'Design and UX articles' },
      isActive: true,
    },
    {
      name: { ar: 'دروس وشروحات', en: 'Tutorials' },
      slug: 'tutorials',
      description: { ar: 'دروس وشروحات تقنية', en: 'Technical tutorials and guides' },
      isActive: true,
    },
    ...additionalBlogCategories,
  ];

  const createdCategories: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of categories) {
    const created = await BlogCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
    createdCategories[cat.slug] = created._id;
  }

  console.log('Blog Categories seeded successfully!');
  return createdCategories;
};

const seedBlogPosts = async (categories: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Blog Posts...');

  const admin = await User.findOne({ email: 'admin@mwm.com' });
  if (!admin) {
    console.log('Admin user not found, skipping blog posts...');
    return;
  }

  const posts = [
    {
      title: {
        ar: 'لماذا نستخدم Next.js في جميع مشاريعنا',
        en: 'Why We Use Next.js for All Our Projects',
      },
      slug: 'why-nextjs',
      excerpt: {
        ar: 'تعرف على الأسباب التي جعلتنا نختار Next.js كإطار عمل أساسي لمشاريع الويب',
        en: 'Learn why we chose Next.js as our primary framework for web projects',
      },
      content: {
        ar: '<p>في MWM، نستخدم Next.js كإطار عمل أساسي لجميع مشاريع الويب. أكثر من 15 مشروع مبني بـ Next.js (الإصدارات 14-16).</p><h2>المميزات الرئيسية</h2><ul><li>Server-Side Rendering و Static Generation لأداء ممتاز</li><li>App Router مع layouts متداخلة</li><li>دعم TypeScript من البداية</li><li>تحسين SEO تلقائي مع metadata API</li><li>Turbopack للتطوير السريع</li></ul><h2>مشاريعنا بـ Next.js</h2><p>بنينا: أدوات تحويل ملفات, محررات, لوحات تحكم, مواقع تسويقية, ومنصات SaaS كاملة.</p>',
        en: '<p>At MWM, we use Next.js as our primary framework for all web projects. Over 15 projects are built with Next.js (versions 14-16).</p><h2>Key Features</h2><ul><li>Server-Side Rendering and Static Generation for excellent performance</li><li>App Router with nested layouts</li><li>TypeScript support from the start</li><li>Automatic SEO optimization with metadata API</li><li>Turbopack for fast development</li></ul><h2>Our Next.js Projects</h2><p>We have built: file converters, editors, admin dashboards, marketing websites, and complete SaaS platforms.</p>',
      },
      category: categories['technology'],
      author: admin._id,
      featuredImage: '/portfolio/smartstand-egypt/home.png',
      tags: [
        { ar: 'Next.js', en: 'Next.js' },
        { ar: 'ريأكت', en: 'React' },
        { ar: 'تطوير ويب', en: 'Web Development' },
      ],
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: {
        ar: 'بناء REST API احترافي بـ Node.js و Express',
        en: 'Building a Professional REST API with Node.js & Express',
      },
      slug: 'professional-rest-api-nodejs',
      excerpt: {
        ar: 'دليل شامل لبناء واجهة برمجية REST API قوية وآمنة ومُوثقة',
        en: 'Comprehensive guide to building a robust, secure, and documented REST API',
      },
      content: {
        ar: '<p>بناء API احترافي يحتاج أكثر من مجرد Express.js. في هذا المقال نشارك خبرتنا من بناء أكثر من 10 واجهات برمجية.</p><h2>البنية الأساسية</h2><p>نستخدم بنية modules-based مع: controllers, services, models, routes, validators, و repositories.</p><h2>الأمان</h2><ul><li>JWT مع HttpOnly cookies</li><li>CSRF protection</li><li>Rate limiting</li><li>Input sanitization مع express-mongo-sanitize</li></ul>',
        en: '<p>Building a professional API requires more than just Express.js. In this article, we share our experience from building 10+ APIs.</p><h2>Core Architecture</h2><p>We use a modules-based architecture with: controllers, services, models, routes, validators, and repositories.</p><h2>Security</h2><ul><li>JWT with HttpOnly cookies</li><li>CSRF protection</li><li>Rate limiting</li><li>Input sanitization with express-mongo-sanitize</li></ul>',
      },
      category: categories['tutorials'],
      author: admin._id,
      featuredImage: '/portfolio/escore-backend/api-docs.png',
      tags: [
        { ar: 'Node.js', en: 'Node.js' },
        { ar: 'Express', en: 'Express' },
        { ar: 'API', en: 'API' },
      ],
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: {
        ar: 'Flutter vs React Native: أيهما تختار في 2026؟',
        en: 'Flutter vs React Native: Which to Choose in 2026?',
      },
      slug: 'flutter-vs-react-native-2026',
      excerpt: {
        ar: 'مقارنة شاملة بين Flutter و React Native من واقع خبرتنا في بناء تطبيقات الموبايل',
        en: 'A comprehensive comparison between Flutter and React Native from our real mobile app development experience',
      },
      content: {
        ar: '<p>بعد بناء أكثر من 5 تطبيقات موبايل في MWM، نشارككم تجربتنا مع Flutter و React Native.</p><h2>لماذا نفضل Flutter؟</h2><ul><li>أداء أفضل بفضل محرك Skia</li><li>تصميم واحد لـ iOS و Android بنفس الشكل تماماً</li><li>Hot Reload سريع جداً</li><li>مكتبة widgets غنية ومتسقة</li><li>دعم ممتاز للـ animations</li></ul><h2>متى نستخدم React Native؟</h2><p>عندما يكون الفريق خبير في React ويحتاج إعادة استخدام كود الويب.</p><h2>مشاريعنا بـ Flutter</h2><p>بنينا: تطبيق توصيل طعام (Bagour)، تطبيق حجز حرفيين (Sana3y)، تطبيق مشاركة رحلات (Wasalni)، وتطبيقات إسلامية.</p>',
        en: '<p>After building 5+ mobile apps at MWM, we share our experience with Flutter and React Native.</p><h2>Why We Prefer Flutter</h2><ul><li>Better performance thanks to Skia engine</li><li>Pixel-perfect consistent UI across iOS and Android</li><li>Lightning-fast Hot Reload</li><li>Rich and consistent widget library</li><li>Excellent animation support</li></ul><h2>When to Use React Native?</h2><p>When the team is React-experienced and needs web code reuse.</p><h2>Our Flutter Projects</h2><p>We have built: food delivery app (Bagour), craftsmen booking (Sana3y), ride-hailing (Wasalni), and Islamic apps.</p>',
      },
      category: categories['technology'],
      author: admin._id,
      featuredImage: '/portfolio/wasalni/home.png',
      tags: [
        { ar: 'Flutter', en: 'Flutter' },
        { ar: 'تطبيقات موبايل', en: 'Mobile Apps' },
        { ar: 'React Native', en: 'React Native' },
      ],
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'دليل تصميم واجهات المستخدم ثنائية اللغة (RTL/LTR)',
        en: 'Guide to Designing Bilingual UI (RTL/LTR)',
      },
      slug: 'bilingual-rtl-ltr-design-guide',
      excerpt: {
        ar: 'كيف نبني واجهات تدعم العربية والإنجليزية بشكل مثالي مع Tailwind CSS و Next.js',
        en: 'How we build interfaces that perfectly support Arabic and English with Tailwind CSS and Next.js',
      },
      content: {
        ar: '<p>بناء تطبيق ثنائي اللغة يتطلب أكثر من مجرد ترجمة النصوص. في هذا المقال نشرح كيف ندعم RTL و LTR في مشاريعنا.</p><h2>التحديات الرئيسية</h2><ul><li>عكس الاتجاهات: margins, paddings, icons</li><li>الأرقام والهواتف يجب أن تبقى LTR حتى في صفحة عربية</li><li>الخطوط: Inter للإنجليزية و Cairo للعربية</li><li>اختبار كل صفحة في الاتجاهين</li></ul><h2>الأدوات التي نستخدمها</h2><ul><li>Tailwind CSS RTL plugin مع logical properties (ms-, me-, ps-, pe-)</li><li>next-intl لإدارة الترجمات والتوجيه</li><li>next-themes للوضع الداكن مع دعم RTL</li></ul>',
        en: '<p>Building a bilingual app requires more than text translation. In this article, we explain how we support RTL and LTR in our projects.</p><h2>Key Challenges</h2><ul><li>Mirroring directions: margins, paddings, icons</li><li>Numbers and phone numbers must stay LTR even on Arabic pages</li><li>Fonts: Inter for English, Cairo for Arabic</li><li>Testing every page in both directions</li></ul><h2>Tools We Use</h2><ul><li>Tailwind CSS RTL plugin with logical properties (ms-, me-, ps-, pe-)</li><li>next-intl for translation and routing management</li><li>next-themes for dark mode with RTL support</li></ul>',
      },
      category: categories['design'],
      author: admin._id,
      featuredImage: '/portfolio/mwm-corporate/home.png',
      tags: [
        { ar: 'RTL', en: 'RTL' },
        { ar: 'تصميم', en: 'Design' },
        { ar: 'Tailwind CSS', en: 'Tailwind CSS' },
        { ar: 'ثنائي اللغة', en: 'Bilingual' },
      ],
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'كيف تبني نظام مصادقة آمن بـ JWT و HttpOnly Cookies',
        en: 'How to Build Secure Authentication with JWT & HttpOnly Cookies',
      },
      slug: 'secure-jwt-httponly-auth',
      excerpt: {
        ar: 'تعلم كيف تحمي تطبيقك من هجمات XSS و CSRF باستخدام JWT مع cookies آمنة',
        en: 'Learn how to protect your app from XSS and CSRF attacks using JWT with secure cookies',
      },
      content: {
        ar: '<p>أغلب المطورين يخزنون JWT في localStorage — وهذا خطأ أمني كبير! في هذا المقال نشرح لماذا وكيف نحل المشكلة.</p><h2>المشكلة مع localStorage</h2><p>أي كود JavaScript في الصفحة يمكنه قراءة localStorage، مما يعني أن هجوم XSS واحد يسرق الـ token.</p><h2>الحل: HttpOnly Cookies</h2><ul><li>accessToken في HttpOnly cookie (15 دقيقة)</li><li>refreshToken في HttpOnly cookie (7 أيام)</li><li>CSRF token في cookie عادي (قابل للقراءة بـ JS)</li><li>X-CSRF-Token header مع كل طلب POST/PUT/DELETE</li></ul><h2>التطبيق العملي</h2><p>في مشروع MWM استخدمنا هذا النمط مع Express.js و cookie-parser و middleware مخصص للتحقق من CSRF.</p>',
        en: '<p>Most developers store JWT in localStorage — this is a major security mistake! In this article we explain why and how to fix it.</p><h2>The Problem with localStorage</h2><p>Any JavaScript code on the page can read localStorage, meaning a single XSS attack steals the token.</p><h2>The Solution: HttpOnly Cookies</h2><ul><li>accessToken in HttpOnly cookie (15 minutes)</li><li>refreshToken in HttpOnly cookie (7 days)</li><li>CSRF token in regular cookie (readable by JS)</li><li>X-CSRF-Token header with every POST/PUT/DELETE request</li></ul><h2>Practical Implementation</h2><p>In the MWM project we used this pattern with Express.js, cookie-parser, and custom CSRF verification middleware.</p>',
      },
      category: categories['tutorials'],
      author: admin._id,
      featuredImage: '/portfolio/escore-backend/api-docs.png',
      tags: [
        { ar: 'أمان', en: 'Security' },
        { ar: 'JWT', en: 'JWT' },
        { ar: 'مصادقة', en: 'Authentication' },
      ],
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'MongoDB vs PostgreSQL: متى تستخدم كل واحد؟',
        en: 'MongoDB vs PostgreSQL: When to Use Each?',
      },
      slug: 'mongodb-vs-postgresql',
      excerpt: {
        ar: 'دليل عملي لاختيار قاعدة البيانات المناسبة لمشروعك بناءً على خبرتنا في كلاهما',
        en: 'Practical guide to choosing the right database for your project based on our experience with both',
      },
      content: {
        ar: '<p>في MWM نستخدم كلاً من MongoDB و PostgreSQL حسب طبيعة المشروع. إليك دليلنا العملي.</p><h2>متى نستخدم MongoDB؟</h2><ul><li>بيانات غير منتظمة أو متغيرة الهيكل</li><li>منصات التواصل الاجتماعي والمحتوى</li><li>تطبيقات real-time تحتاج سرعة كتابة عالية</li><li>مشاريعنا: Bagour Delivery, Sana3y, Wasalni, Escore</li></ul><h2>متى نستخدم PostgreSQL؟</h2><ul><li>بيانات علائقية معقدة مع constraints</li><li>أنظمة مالية أو حجوزات تحتاج ACID</li><li>مشاريعنا: Price Hunter, Clinic Booking, Ebn Kathier</li></ul><h2>أداة ORM</h2><p>مع MongoDB نستخدم Mongoose، ومع PostgreSQL نستخدم Prisma لتجربة تطوير ممتازة.</p>',
        en: '<p>At MWM we use both MongoDB and PostgreSQL depending on the project nature. Here is our practical guide.</p><h2>When We Use MongoDB</h2><ul><li>Unstructured or schema-flexible data</li><li>Social and content platforms</li><li>Real-time apps needing high write speed</li><li>Our projects: Bagour Delivery, Sana3y, Wasalni, Escore</li></ul><h2>When We Use PostgreSQL</h2><ul><li>Complex relational data with constraints</li><li>Financial systems or bookings needing ACID</li><li>Our projects: Price Hunter, Clinic Booking, Ebn Kathier</li></ul><h2>ORM Choice</h2><p>With MongoDB we use Mongoose, and with PostgreSQL we use Prisma for an excellent developer experience.</p>',
      },
      category: categories['technology'],
      author: admin._id,
      featuredImage: '/portfolio/price-hunter/home.png',
      tags: [
        { ar: 'MongoDB', en: 'MongoDB' },
        { ar: 'PostgreSQL', en: 'PostgreSQL' },
        { ar: 'قواعد بيانات', en: 'Databases' },
      ],
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'أتمتة المهام المتكررة: من Web Scraping إلى بوتات WhatsApp',
        en: 'Automating Repetitive Tasks: From Web Scraping to WhatsApp Bots',
      },
      slug: 'automation-scraping-bots',
      excerpt: {
        ar: 'كيف نوفر ساعات من العمل اليدوي باستخدام أدوات الأتمتة والـ scraping',
        en: 'How we save hours of manual work using automation tools and scraping',
      },
      content: {
        ar: '<p>الأتمتة هي أحد أقوى أدواتنا في MWM. بنينا أدوات توفر ساعات من العمل اليومي.</p><h2>مشاريع الأتمتة</h2><ul><li><strong>Price Hunter:</strong> يراقب أسعار 15+ متجر أونلاين تلقائياً</li><li><strong>Artneer:</strong> 8 scrapers لجمع بيانات شركات المقاولات</li><li><strong>WhatsApp Sheets Bot:</strong> يربط WhatsApp بـ Google Sheets تلقائياً</li><li><strong>Bulk Email Sender:</strong> إرسال آلاف الإيميلات مع تخصيص</li></ul><h2>التقنيات المستخدمة</h2><ul><li>Puppeteer و Playwright للـ browser automation</li><li>Cheerio و BeautifulSoup للـ HTML parsing</li><li>BullMQ لجدولة المهام</li><li>Node.js و Python حسب المهمة</li></ul>',
        en: '<p>Automation is one of our strongest tools at MWM. We have built tools that save hours of daily work.</p><h2>Automation Projects</h2><ul><li><strong>Price Hunter:</strong> Monitors prices across 15+ online stores automatically</li><li><strong>Artneer:</strong> 8 scrapers for collecting construction company data</li><li><strong>WhatsApp Sheets Bot:</strong> Connects WhatsApp to Google Sheets automatically</li><li><strong>Bulk Email Sender:</strong> Sends thousands of personalized emails</li></ul><h2>Technologies Used</h2><ul><li>Puppeteer and Playwright for browser automation</li><li>Cheerio and BeautifulSoup for HTML parsing</li><li>BullMQ for job scheduling</li><li>Node.js and Python depending on the task</li></ul>',
      },
      category: categories['tutorials'],
      author: admin._id,
      featuredImage: '/portfolio/artneer/home.png',
      tags: [
        { ar: 'أتمتة', en: 'Automation' },
        { ar: 'Web Scraping', en: 'Web Scraping' },
        { ar: 'بوتات', en: 'Bots' },
      ],
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  // Add the 50 new blog posts
  const newPosts = getBlogPosts(categories, admin._id);
  const allPosts = [...posts, ...newPosts];

  for (const post of allPosts) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $set: post },
      { upsert: true, new: true }
    );
  }

  console.log(`Blog Posts seeded successfully! (${allPosts.length} posts)`);
};

// ═══════════════════════════════════════════════════════════════
// JOBS
// ═══════════════════════════════════════════════════════════════
const seedJobs = async (departments: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Jobs...');

  const jobs = [
    {
      title: {
        ar: 'مطور Full Stack (Node.js + Next.js)',
        en: 'Full Stack Developer (Node.js + Next.js)',
      },
      slug: 'full-stack-developer',
      description: {
        ar: '<p>نبحث عن مطور Full Stack متميز للعمل على منصاتنا المتكاملة. يجب أن يكون لديك خبرة قوية في Node.js/Express و Next.js/React.</p>',
        en: '<p>We are looking for an exceptional Full Stack Developer to work on our integrated platforms. You should have strong experience with Node.js/Express and Next.js/React.</p>',
      },
      requirements: [
        {
          ar: '3+ سنوات خبرة في Node.js و React/Next.js',
          en: '3+ years experience with Node.js and React/Next.js',
        },
        { ar: 'إتقان TypeScript', en: 'TypeScript proficiency' },
        { ar: 'خبرة بـ MongoDB و Redis', en: 'Experience with MongoDB and Redis' },
        {
          ar: 'معرفة بـ Socket.io و REST API design',
          en: 'Knowledge of Socket.io and REST API design',
        },
      ],
      responsibilities: [
        { ar: 'تطوير الواجهة الأمامية والخلفية', en: 'Develop frontend and backend' },
        { ar: 'بناء واجهات برمجية مُوثقة', en: 'Build documented APIs' },
        { ar: 'كتابة اختبارات', en: 'Write tests' },
      ],
      benefits: [
        { ar: 'راتب تنافسي', en: 'Competitive salary' },
        { ar: 'عمل عن بُعد', en: 'Remote work' },
        { ar: 'فرص تطوير وتعلم', en: 'Growth and learning opportunities' },
      ],
      department: departments['development'],
      type: 'full-time',
      location: { ar: 'عن بُعد / القاهرة', en: 'Remote / Cairo' },
      experienceLevel: 'mid',
      skills: ['Node.js', 'Next.js', 'React', 'TypeScript', 'MongoDB', 'Redis'],
      status: 'open',
      isFeatured: true,
    },
  ];

  for (const job of jobs) {
    await Job.findOneAndUpdate({ slug: job.slug }, { $set: job }, { upsert: true, new: true });
  }

  console.log('Jobs seeded successfully!');
};

// ═══════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════
const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    // Run all seed functions
    await seedSettings();
    await seedSiteContent();
    await seedTranslations();
    await seedMenus();

    const departments = await seedDepartments();
    await seedTeamMembers(departments);

    const serviceCategories = await seedServiceCategories();
    await seedServices(serviceCategories);

    const projectCategories = await seedProjectCategories();
    await seedProjects(projectCategories);

    await seedUsers();

    const blogCategories = await seedBlogCategories();
    await seedBlogPosts(blogCategories);

    await seedJobs(departments);

    console.log('\n=== All seed data has been inserted successfully! ===');
    console.log('Projects: 33 projects from the workspace');
    console.log('Services: 6 service offerings');
    console.log('Categories: 6 project categories, 6 service categories');
    console.log('Blog: 7 posts, 3 categories');
    console.log('Admin: admin@mwm.com / Admin123!@#');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run seed
seed();
