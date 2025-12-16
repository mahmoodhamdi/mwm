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

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/mwm?authSource=admin';

// Seed data
const seedSettings = async () => {
  console.log('Seeding Settings...');

  const existingSettings = await Settings.findOne();
  if (existingSettings) {
    console.log('Settings already exist, skipping...');
    return;
  }

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
      facebook: 'https://facebook.com/mwm',
      twitter: 'https://twitter.com/mwm',
      instagram: 'https://instagram.com/mwm',
      linkedin: 'https://linkedin.com/company/mwm',
      github: 'https://github.com/mwm',
    },
    seo: {
      defaultTitle: {
        ar: 'MWM - حلول برمجية متكاملة',
        en: 'MWM - Integrated Software Solutions',
      },
      defaultDescription: {
        ar: 'شركة تطوير برمجيات متخصصة في بناء تطبيقات الويب والموبايل',
        en: 'Software development company specializing in web and mobile applications',
      },
      defaultKeywords: {
        ar: ['تطوير مواقع', 'تطبيقات', 'برمجة', 'تصميم'],
        en: ['web development', 'apps', 'software', 'design'],
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
        ar: 'شركة تطوير برمجيات متخصصة في بناء تطبيقات الويب والموبايل بأحدث التقنيات',
        en: 'Software development company specializing in building web and mobile applications with the latest technologies',
      },
      description: 'Hero section subtitle',
      order: 2,
    },
    {
      key: 'about.description',
      type: 'html',
      section: 'about',
      content: {
        ar: '<p>MWM هي شركة تطوير برمجيات رائدة متخصصة في تقديم حلول تقنية مبتكرة. نعمل مع الشركات الناشئة والمؤسسات الكبيرة لتحويل أفكارهم إلى منتجات رقمية ناجحة.</p>',
        en: '<p>MWM is a leading software development company specializing in delivering innovative technology solutions. We work with startups and large enterprises to transform their ideas into successful digital products.</p>',
      },
      description: 'About page description',
      order: 1,
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

const seedTranslations = async () => {
  console.log('Seeding Translations...');

  const translations = [
    // Common
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

    // Navigation
    { key: 'home', namespace: 'common', translations: { ar: 'الرئيسية', en: 'Home' } },
    { key: 'about', namespace: 'common', translations: { ar: 'من نحن', en: 'About' } },
    { key: 'services', namespace: 'common', translations: { ar: 'الخدمات', en: 'Services' } },
    { key: 'projects', namespace: 'common', translations: { ar: 'المشاريع', en: 'Projects' } },
    { key: 'team', namespace: 'common', translations: { ar: 'الفريق', en: 'Team' } },
    { key: 'blog', namespace: 'common', translations: { ar: 'المدونة', en: 'Blog' } },
    { key: 'careers', namespace: 'common', translations: { ar: 'الوظائف', en: 'Careers' } },
    { key: 'contact', namespace: 'common', translations: { ar: 'اتصل بنا', en: 'Contact' } },

    // Home page
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

    // About page
    { key: 'mission', namespace: 'about', translations: { ar: 'مهمتنا', en: 'Our Mission' } },
    { key: 'vision', namespace: 'about', translations: { ar: 'رؤيتنا', en: 'Our Vision' } },
    { key: 'values', namespace: 'about', translations: { ar: 'قيمنا', en: 'Our Values' } },

    // Contact page
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

const seedTeamMembers = async (departments: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Team Members...');

  const teamMembers = [
    {
      name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
      slug: 'ahmed-mohamed',
      position: { ar: 'المدير التنفيذي', en: 'CEO' },
      bio: {
        ar: 'قائد فريق MWM ولديه خبرة أكثر من 10 سنوات في مجال التقنية',
        en: 'MWM team leader with over 10 years of experience in technology',
      },
      shortBio: { ar: 'قائد فريق MWM', en: 'MWM team leader' },
      department: departments['management'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ahmed',
        twitter: 'https://twitter.com/ahmed',
      },
      experience: 10,
      order: 1,
      isLeader: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: { ar: 'سارة أحمد', en: 'Sara Ahmed' },
      slug: 'sara-ahmed',
      position: { ar: 'مديرة التطوير', en: 'Development Manager' },
      bio: {
        ar: 'مديرة فريق التطوير ولديها خبرة واسعة في إدارة المشاريع البرمجية',
        en: 'Development team manager with extensive experience in software project management',
      },
      shortBio: { ar: 'مديرة فريق التطوير', en: 'Development team manager' },
      department: departments['development'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      socialLinks: { linkedin: 'https://linkedin.com/in/sara', github: 'https://github.com/sara' },
      experience: 8,
      order: 2,
      isLeader: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: { ar: 'محمد علي', en: 'Mohamed Ali' },
      slug: 'mohamed-ali',
      position: { ar: 'مطور Full Stack', en: 'Full Stack Developer' },
      bio: {
        ar: 'مطور متكامل متخصص في React و Node.js',
        en: 'Full stack developer specializing in React and Node.js',
      },
      shortBio: { ar: 'مطور Full Stack', en: 'Full Stack Developer' },
      department: departments['development'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      socialLinks: { github: 'https://github.com/mohamed' },
      experience: 5,
      order: 3,
      isLeader: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: { ar: 'فاطمة حسن', en: 'Fatma Hassan' },
      slug: 'fatma-hassan',
      position: { ar: 'مصممة UI/UX', en: 'UI/UX Designer' },
      bio: {
        ar: 'مصممة متخصصة في تصميم تجربة المستخدم والواجهات',
        en: 'Designer specializing in UX and interface design',
      },
      shortBio: { ar: 'مصممة UI/UX', en: 'UI/UX Designer' },
      department: departments['design'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      socialLinks: { behance: 'https://behance.net/fatma', dribbble: 'https://dribbble.com/fatma' },
      experience: 6,
      order: 4,
      isLeader: false,
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

const seedServiceCategories = async () => {
  console.log('Seeding Service Categories...');

  const categories = [
    {
      name: { ar: 'تطوير الويب', en: 'Web Development' },
      slug: 'web-development',
      description: {
        ar: 'خدمات تطوير مواقع وتطبيقات الويب',
        en: 'Web and web application development services',
      },
      icon: 'globe',
      order: 1,
      isActive: true,
    },
    {
      name: { ar: 'تطوير الموبايل', en: 'Mobile Development' },
      slug: 'mobile-development',
      description: {
        ar: 'خدمات تطوير تطبيقات الهاتف المحمول',
        en: 'Mobile application development services',
      },
      icon: 'smartphone',
      order: 2,
      isActive: true,
    },
    {
      name: { ar: 'التصميم', en: 'Design' },
      slug: 'design',
      description: {
        ar: 'خدمات التصميم الجرافيكي وتجربة المستخدم',
        en: 'Graphic design and UX services',
      },
      icon: 'palette',
      order: 3,
      isActive: true,
    },
    {
      name: { ar: 'الاستشارات', en: 'Consulting' },
      slug: 'consulting',
      description: { ar: 'خدمات الاستشارات التقنية', en: 'Technical consulting services' },
      icon: 'lightbulb',
      order: 4,
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

const seedServices = async (categories: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Services...');

  const services = [
    {
      title: { ar: 'تطوير مواقع الويب', en: 'Web Development' },
      slug: 'web-development',
      shortDescription: {
        ar: 'نبني مواقع ويب حديثة وسريعة',
        en: 'We build modern and fast websites',
      },
      description: {
        ar: 'نقدم خدمات تطوير مواقع ويب متكاملة باستخدام أحدث التقنيات مثل React و Next.js و Node.js',
        en: 'We provide comprehensive web development services using the latest technologies like React, Next.js, and Node.js',
      },
      category: categories['web-development'],
      icon: 'code',
      features: [
        {
          title: { ar: 'تصميم متجاوب', en: 'Responsive Design' },
          description: {
            ar: 'مواقع تعمل على جميع الأجهزة',
            en: 'Websites that work on all devices',
          },
        },
        {
          title: { ar: 'أداء عالي', en: 'High Performance' },
          description: { ar: 'مواقع سريعة ومحسنة', en: 'Fast and optimized websites' },
        },
        {
          title: { ar: 'SEO محسن', en: 'SEO Optimized' },
          description: { ar: 'تحسين لمحركات البحث', en: 'Search engine optimization' },
        },
      ],
      order: 1,
      isFeatured: true,
      isActive: true,
    },
    {
      title: { ar: 'تطوير تطبيقات الموبايل', en: 'Mobile App Development' },
      slug: 'mobile-development',
      shortDescription: {
        ar: 'تطبيقات موبايل لـ iOS و Android',
        en: 'Mobile apps for iOS and Android',
      },
      description: {
        ar: 'نطور تطبيقات موبايل أصلية وهجينة باستخدام React Native و Flutter',
        en: 'We develop native and hybrid mobile apps using React Native and Flutter',
      },
      category: categories['mobile-development'],
      icon: 'smartphone',
      features: [
        {
          title: { ar: 'تطبيقات أصلية', en: 'Native Apps' },
          description: {
            ar: 'أداء عالي وتجربة مستخدم ممتازة',
            en: 'High performance and excellent UX',
          },
        },
        {
          title: { ar: 'Cross-Platform', en: 'Cross-Platform' },
          description: { ar: 'تطبيق واحد لجميع المنصات', en: 'One app for all platforms' },
        },
      ],
      order: 2,
      isFeatured: true,
      isActive: true,
    },
    {
      title: { ar: 'تصميم UI/UX', en: 'UI/UX Design' },
      slug: 'ui-ux-design',
      shortDescription: { ar: 'تصميم واجهات مستخدم جذابة', en: 'Attractive user interface design' },
      description: {
        ar: 'نصمم واجهات مستخدم جميلة وتجارب مستخدم سلسة',
        en: 'We design beautiful user interfaces and smooth user experiences',
      },
      category: categories['design'],
      icon: 'palette',
      features: [
        {
          title: { ar: 'تصميم حديث', en: 'Modern Design' },
          description: { ar: 'تصاميم عصرية وأنيقة', en: 'Contemporary and elegant designs' },
        },
        {
          title: { ar: 'Prototyping', en: 'Prototyping' },
          description: { ar: 'نماذج تفاعلية', en: 'Interactive prototypes' },
        },
      ],
      order: 3,
      isFeatured: true,
      isActive: true,
    },
    {
      title: { ar: 'الاستشارات التقنية', en: 'Technical Consulting' },
      slug: 'technical-consulting',
      shortDescription: {
        ar: 'نساعدك في اتخاذ القرارات التقنية',
        en: 'We help you make technical decisions',
      },
      description: {
        ar: 'نقدم استشارات تقنية متخصصة لمساعدتك في اختيار أفضل الحلول لمشروعك',
        en: 'We provide specialized technical consulting to help you choose the best solutions for your project',
      },
      category: categories['consulting'],
      icon: 'lightbulb',
      features: [
        {
          title: { ar: 'تحليل المتطلبات', en: 'Requirements Analysis' },
          description: { ar: 'فهم احتياجاتك بدقة', en: 'Understanding your needs precisely' },
        },
        {
          title: { ar: 'خارطة طريق', en: 'Roadmap' },
          description: { ar: 'خطة تنفيذ واضحة', en: 'Clear implementation plan' },
        },
      ],
      order: 4,
      isFeatured: false,
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

const seedProjectCategories = async () => {
  console.log('Seeding Project Categories...');

  const categories = [
    {
      name: { ar: 'مواقع ويب', en: 'Websites' },
      slug: 'websites',
      description: { ar: 'مشاريع مواقع الويب', en: 'Website projects' },
      order: 1,
      isActive: true,
    },
    {
      name: { ar: 'تطبيقات موبايل', en: 'Mobile Apps' },
      slug: 'mobile-apps',
      description: { ar: 'مشاريع تطبيقات الموبايل', en: 'Mobile app projects' },
      order: 2,
      isActive: true,
    },
    {
      name: { ar: 'أنظمة إدارة', en: 'Management Systems' },
      slug: 'management-systems',
      description: { ar: 'مشاريع أنظمة الإدارة', en: 'Management system projects' },
      order: 3,
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

const seedProjects = async (categories: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Projects...');

  const projects = [
    {
      title: { ar: 'منصة التجارة الإلكترونية', en: 'E-Commerce Platform' },
      slug: 'ecommerce-platform',
      shortDescription: { ar: 'منصة تجارة إلكترونية متكاملة', en: 'Complete e-commerce platform' },
      description: {
        ar: 'منصة تجارة إلكترونية متكاملة مع نظام إدارة المنتجات والطلبات',
        en: 'Complete e-commerce platform with product and order management system',
      },
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'],
      category: categories['websites'],
      technologies: [
        { name: 'React', category: 'frontend' },
        { name: 'Node.js', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
      ],
      client: { name: { ar: 'شركة التقنية', en: 'Tech Company' } },
      isFeatured: true,
      isPublished: true,
      order: 1,
    },
    {
      title: { ar: 'تطبيق توصيل الطعام', en: 'Food Delivery App' },
      slug: 'food-delivery-app',
      shortDescription: { ar: 'تطبيق توصيل طعام للموبايل', en: 'Mobile food delivery app' },
      description: {
        ar: 'تطبيق موبايل لتوصيل الطعام مع تتبع الطلبات في الوقت الفعلي',
        en: 'Mobile food delivery app with real-time order tracking',
      },
      thumbnail:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop'],
      category: categories['mobile-apps'],
      technologies: [
        { name: 'React Native', category: 'mobile' },
        { name: 'Firebase', category: 'backend' },
      ],
      client: { name: { ar: 'مطاعم الذواقة', en: 'Gourmet Restaurants' } },
      isFeatured: true,
      isPublished: true,
      order: 2,
    },
    {
      title: { ar: 'نظام إدارة المدارس', en: 'School Management System' },
      slug: 'school-management-system',
      shortDescription: {
        ar: 'نظام متكامل لإدارة المدارس',
        en: 'Complete school management system',
      },
      description: {
        ar: 'نظام متكامل لإدارة المدارس يشمل إدارة الطلاب والمعلمين والدرجات',
        en: 'Complete school management system including student, teacher, and grade management',
      },
      thumbnail:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'],
      category: categories['management-systems'],
      technologies: [
        { name: 'Next.js', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Docker', category: 'devops' },
      ],
      client: { name: { ar: 'وزارة التعليم', en: 'Ministry of Education' } },
      isFeatured: true,
      isPublished: true,
      order: 3,
    },
  ];

  for (const project of projects) {
    await Project.findOneAndUpdate(
      { slug: project.slug },
      { $set: project },
      { upsert: true, new: true }
    );
  }

  console.log('Projects seeded successfully!');
};

const seedUsers = async () => {
  console.log('Seeding Users...');

  // Delete existing admin user first to ensure clean password hash
  await User.deleteOne({ email: 'admin@mwm.com' });

  // Create fresh admin user with correct password
  const adminData = {
    name: 'Admin',
    email: 'admin@mwm.com',
    password: 'Admin123!@#',
    role: UserRoles.SUPER_ADMIN,
    isEmailVerified: true,
    isActive: true,
    loginAttempts: 0, // Reset login attempts
    lockUntil: undefined, // Clear any lock
  };

  await User.create(adminData);
  console.log('Admin user created with fresh password');

  console.log('Users seeded successfully!');
};

const seedBlogCategories = async () => {
  console.log('Seeding Blog Categories...');

  const categories = [
    {
      name: { ar: 'تقنية', en: 'Technology' },
      slug: 'technology',
      description: { ar: 'مقالات تقنية', en: 'Technology articles' },
      isActive: true,
    },
    {
      name: { ar: 'تصميم', en: 'Design' },
      slug: 'design',
      description: { ar: 'مقالات التصميم', en: 'Design articles' },
      isActive: true,
    },
    {
      name: { ar: 'أعمال', en: 'Business' },
      slug: 'business',
      description: { ar: 'مقالات الأعمال', en: 'Business articles' },
      isActive: true,
    },
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

  // Get admin user for author
  const admin = await User.findOne({ email: 'admin@mwm.com' });
  if (!admin) {
    console.log('Admin user not found, skipping blog posts...');
    return;
  }

  const posts = [
    {
      title: { ar: 'مستقبل تطوير الويب', en: 'The Future of Web Development' },
      slug: 'future-of-web-development',
      excerpt: {
        ar: 'نظرة على التقنيات الجديدة في تطوير الويب',
        en: 'A look at new technologies in web development',
      },
      content: {
        ar: '<p>تطوير الويب يتطور بسرعة كبيرة. في هذا المقال سنتعرف على أحدث التقنيات والأدوات المستخدمة في بناء تطبيقات الويب الحديثة.</p><p>React و Next.js أصبحا من أهم الأدوات في عالم تطوير الويب الحديث.</p>',
        en: '<p>Web development is evolving rapidly. In this article, we will learn about the latest technologies and tools used in building modern web applications.</p><p>React and Next.js have become some of the most important tools in modern web development.</p>',
      },
      category: categories['technology'],
      author: admin._id,
      featuredImage:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      tags: [
        { ar: 'ريأكت', en: 'React' },
        { ar: 'نيكست', en: 'Next.js' },
        { ar: 'تايب سكريبت', en: 'TypeScript' },
      ],
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: { ar: 'أساسيات تصميم UI/UX', en: 'UI/UX Design Fundamentals' },
      slug: 'ui-ux-design-fundamentals',
      excerpt: {
        ar: 'دليل شامل لأساسيات تصميم واجهات المستخدم',
        en: 'A comprehensive guide to UI design fundamentals',
      },
      content: {
        ar: '<p>تصميم واجهات المستخدم هو فن وعلم. في هذا المقال سنتعلم أساسيات التصميم الجيد وكيفية إنشاء تجارب مستخدم ممتازة.</p>',
        en: '<p>User interface design is both an art and a science. In this article, we will learn the fundamentals of good design and how to create excellent user experiences.</p>',
      },
      category: categories['design'],
      author: admin._id,
      featuredImage:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      tags: [
        { ar: 'واجهة المستخدم', en: 'UI' },
        { ar: 'تجربة المستخدم', en: 'UX' },
        { ar: 'تصميم', en: 'Design' },
      ],
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
    },
  ];

  for (const post of posts) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $set: post },
      { upsert: true, new: true }
    );
  }

  console.log('Blog Posts seeded successfully!');
};

const seedJobs = async (departments: Record<string, mongoose.Types.ObjectId>) => {
  console.log('Seeding Jobs...');

  const jobs = [
    {
      title: { ar: 'مطور Full Stack', en: 'Full Stack Developer' },
      slug: 'full-stack-developer',
      description: {
        ar: '<p>نبحث عن مطور Full Stack متميز للانضمام لفريقنا. يجب أن يكون لديك خبرة في React و Node.js.</p>',
        en: '<p>We are looking for an exceptional Full Stack Developer to join our team. You should have experience with React and Node.js.</p>',
      },
      requirements: [
        { ar: '3+ سنوات خبرة', en: '3+ years experience' },
        { ar: 'إتقان React و Node.js', en: 'Proficiency in React and Node.js' },
        { ar: 'معرفة بقواعد البيانات', en: 'Database knowledge' },
      ],
      responsibilities: [
        { ar: 'تطوير الواجهة الأمامية والخلفية', en: 'Develop frontend and backend' },
        { ar: 'العمل مع فريق التصميم', en: 'Work with design team' },
      ],
      benefits: [
        { ar: 'راتب تنافسي', en: 'Competitive salary' },
        { ar: 'تأمين صحي', en: 'Health insurance' },
        { ar: 'بيئة عمل مرنة', en: 'Flexible work environment' },
      ],
      department: departments['development'],
      type: 'full-time',
      location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
      experienceLevel: 'mid',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      salaryRange: { min: 15000, max: 25000, currency: 'EGP', period: 'monthly', isPublic: true },
      status: 'open',
      isFeatured: true,
    },
    {
      title: { ar: 'مصمم UI/UX', en: 'UI/UX Designer' },
      slug: 'ui-ux-designer',
      description: {
        ar: '<p>نبحث عن مصمم UI/UX مبدع للعمل على مشاريعنا المتنوعة.</p>',
        en: '<p>We are looking for a creative UI/UX Designer to work on our diverse projects.</p>',
      },
      requirements: [
        { ar: '2+ سنوات خبرة', en: '2+ years experience' },
        { ar: 'إتقان Figma', en: 'Proficiency in Figma' },
        { ar: 'معرض أعمال قوي', en: 'Strong portfolio' },
      ],
      responsibilities: [
        { ar: 'تصميم واجهات المستخدم', en: 'Design user interfaces' },
        { ar: 'إنشاء النماذج الأولية', en: 'Create prototypes' },
      ],
      benefits: [
        { ar: 'راتب تنافسي', en: 'Competitive salary' },
        { ar: 'تأمين صحي', en: 'Health insurance' },
        { ar: 'فرص تطوير', en: 'Growth opportunities' },
      ],
      department: departments['design'],
      type: 'full-time',
      location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
      experienceLevel: 'mid',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      salaryRange: { min: 12000, max: 20000, currency: 'EGP', period: 'monthly', isPublic: true },
      status: 'open',
      isFeatured: true,
    },
  ];

  for (const job of jobs) {
    await Job.findOneAndUpdate({ slug: job.slug }, { $set: job }, { upsert: true, new: true });
  }

  console.log('Jobs seeded successfully!');
};

// Main seed function
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

    console.log('\n✅ All seed data has been inserted successfully!');
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
