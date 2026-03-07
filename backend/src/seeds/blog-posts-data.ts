/**
 * Blog Posts Data - 50 Professional Blog Posts
 * Auto-generated blog post data for MWM seed
 */

import mongoose from 'mongoose';

export const additionalBlogCategories = [
  {
    name: { ar: 'تطوير تطبيقات الموبايل', en: 'Mobile Development' },
    slug: 'mobile-development',
    description: {
      ar: 'مقالات تطوير تطبيقات الموبايل مع Flutter و React Native',
      en: 'Mobile app development articles with Flutter and React Native',
    },
    isActive: true,
  },
  {
    name: { ar: 'تطوير الباك اند', en: 'Backend Development' },
    slug: 'backend',
    description: {
      ar: 'مقالات تطوير الخوادم وواجهات البرمجية',
      en: 'Server-side and API development articles',
    },
    isActive: true,
  },
  {
    name: { ar: 'DevOps وإدارة الأنظمة', en: 'DevOps & Infrastructure' },
    slug: 'devops',
    description: {
      ar: 'مقالات DevOps والنشر والبنية التحتية',
      en: 'DevOps, deployment, and infrastructure articles',
    },
    isActive: true,
  },
  {
    name: { ar: 'أمن المعلومات', en: 'Security' },
    slug: 'security',
    description: {
      ar: 'مقالات أمان التطبيقات والشبكات',
      en: 'Application and network security articles',
    },
    isActive: true,
  },
  {
    name: { ar: 'الذكاء الاصطناعي', en: 'AI & Machine Learning' },
    slug: 'ai-ml',
    description: {
      ar: 'مقالات الذكاء الاصطناعي والتعلم الآلي',
      en: 'AI and machine learning articles',
    },
    isActive: true,
  },
  {
    name: { ar: 'نصائح مهنية', en: 'Career Tips' },
    slug: 'career',
    description: {
      ar: 'نصائح مهنية للمطورين والمبرمجين',
      en: 'Career tips for developers and programmers',
    },
    isActive: true,
  },
  {
    name: { ar: 'دراسات حالة', en: 'Case Studies' },
    slug: 'case-studies',
    description: {
      ar: 'دراسات حالة من مشاريعنا الحقيقية',
      en: 'Case studies from our real projects',
    },
    isActive: true,
  },
];

export function getBlogPosts(
  categories: Record<string, mongoose.Types.ObjectId>,
  authorId: mongoose.Types.ObjectId
) {
  return [
    {
      title: {
        ar: 'دليل شامل لـ Next.js 16 App Router',
        en: 'Complete Guide to Next.js 16 App Router',
      },
      slug: 'nextjs-16-app-router-guide',
      excerpt: {
        ar: 'تعلم كيف تبني تطبيقات ويب حديثة مع Next.js 16 و App Router',
        en: 'Learn how to build modern web apps with Next.js 16 and App Router',
      },
      content: {
        ar: '<h2>مقدمة عن Next.js 16</h2><p>Next.js 16 يقدم تحسينات ضخمة في الأداء مع Turbopack و App Router. في MWM استخدمنا هذا الإصدار في أكثر من 5 مشاريع إنتاجية.</p><h2>App Router vs Pages Router</h2><p>App Router هو المستقبل. يعتمد على React Server Components ويوفر تجربة تطوير أفضل بكثير:</p><ul><li>Layouts متداخلة تحافظ على الحالة</li><li>Loading UI تلقائي</li><li>Error boundaries لكل route</li><li>Streaming SSR للأداء</li></ul><h2>Server Components</h2><pre><code class="language-tsx">// app/blog/page.tsx - Server Component بشكل افتراضي\nexport default async function BlogPage() {\n  const posts = await fetch(\'https://api.example.com/posts\');\n  const data = await posts.json();\n  return (\n    &lt;div&gt;\n      {data.map(post =&gt; &lt;PostCard key={post.id} post={post} /&gt;)}\n    &lt;/div&gt;\n  );\n}</code></pre><h2>Metadata API</h2><p>الـ Metadata API الجديد يجعل SEO سهل جداً:</p><pre><code class="language-tsx">export async function generateMetadata({ params }) {\n  const post = await getPost(params.slug);\n  return {\n    title: post.title,\n    description: post.excerpt,\n    openGraph: { images: [post.image] },\n  };\n}</code></pre><h2>Route Handlers</h2><p>بديل API Routes في App Router:</p><pre><code class="language-ts">// app/api/posts/route.ts\nexport async function GET(request: Request) {\n  const posts = await db.post.findMany();\n  return Response.json({ data: posts });\n}\n\nexport async function POST(request: Request) {\n  const body = await request.json();\n  const post = await db.post.create({ data: body });\n  return Response.json({ data: post }, { status: 201 });\n}</code></pre><h2>خلاصة</h2><p>Next.js 16 مع App Router هو أفضل خيار لبناء تطبيقات ويب حديثة. في MWM نستخدمه في كل مشاريعنا الجديدة ونشجع عملائنا على اعتماده.</p>',
        en: '<h2>Introduction to Next.js 16</h2><p>Next.js 16 brings massive performance improvements with Turbopack and the App Router. At MWM, we\'ve used this version in 5+ production projects.</p><h2>App Router vs Pages Router</h2><p>App Router is the future. It\'s built on React Server Components and provides a much better developer experience:</p><ul><li>Nested layouts that preserve state</li><li>Automatic loading UI</li><li>Error boundaries per route</li><li>Streaming SSR for performance</li></ul><h2>Server Components</h2><pre><code class="language-tsx">// app/blog/page.tsx - Server Component by default\nexport default async function BlogPage() {\n  const posts = await fetch(\'https://api.example.com/posts\');\n  const data = await posts.json();\n  return (\n    &lt;div&gt;\n      {data.map(post =&gt; &lt;PostCard key={post.id} post={post} /&gt;)}\n    &lt;/div&gt;\n  );\n}</code></pre><h2>Metadata API</h2><p>The new Metadata API makes SEO incredibly easy:</p><pre><code class="language-tsx">export async function generateMetadata({ params }) {\n  const post = await getPost(params.slug);\n  return {\n    title: post.title,\n    description: post.excerpt,\n    openGraph: { images: [post.image] },\n  };\n}</code></pre><h2>Route Handlers</h2><p>The replacement for API Routes in App Router:</p><pre><code class="language-ts">// app/api/posts/route.ts\nexport async function GET(request: Request) {\n  const posts = await db.post.findMany();\n  return Response.json({ data: posts });\n}\n\nexport async function POST(request: Request) {\n  const body = await request.json();\n  const post = await db.post.create({ data: body });\n  return Response.json({ data: post }, { status: 201 });\n}</code></pre><h2>Conclusion</h2><p>Next.js 16 with App Router is the best choice for building modern web applications. At MWM, we use it for all new projects and encourage our clients to adopt it.</p>',
      },
      category: categories['technology'],
      author: authorId,
      featuredImage: '/blog/blog-header-1.svg',
      tags: [
        { ar: 'Next.js', en: 'Next.js' },
        { ar: 'React', en: 'React' },
        { ar: 'App Router', en: 'App Router' },
      ],
      status: 'published' as const,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء تطبيقات React قابلة للتوسع مع TypeScript',
        en: 'Building Scalable React Applications with TypeScript',
      },
      slug: 'scalable-react-typescript-patterns',
      excerpt: {
        ar: 'أنماط وممارسات لبناء تطبيقات React كبيرة ومنظمة',
        en: 'Patterns and practices for building large, organized React applications',
      },
      content: {
        ar: "<h2>لماذا TypeScript مع React؟</h2><p>TypeScript يوفر أمان الأنواع الذي يمنع أخطاء runtime. في MWM، كل مشاريعنا تستخدم TypeScript.</p><h2>بنية المجلدات</h2><pre><code class=\"language-text\">src/\n  components/     # مكونات UI قابلة لإعادة الاستخدام\n    ui/           # مكونات أساسية (Button, Input, Modal)\n    layout/       # Header, Footer, Sidebar\n    common/       # مكونات مشتركة\n  hooks/          # Custom hooks\n  services/       # API calls\n  types/          # TypeScript types\n  lib/            # Utilities\n  store/          # State management</code></pre><h2>أنماط المكونات</h2><pre><code class=\"language-tsx\">// Component with proper typing\ninterface ButtonProps {\n  variant: 'primary' | 'secondary' | 'danger';\n  size?: 'sm' | 'md' | 'lg';\n  isLoading?: boolean;\n  children: React.ReactNode;\n  onClick?: () =&gt; void;\n}\n\nexport function Button({ variant, size = 'md', isLoading, children, onClick }: ButtonProps) {\n  return (\n    &lt;button\n      className={cn(variants[variant], sizes[size])}\n      disabled={isLoading}\n      onClick={onClick}\n    &gt;\n      {isLoading ? &lt;Spinner /&gt; : children}\n    &lt;/button&gt;\n  );\n}</code></pre><h2>Custom Hooks</h2><pre><code class=\"language-tsx\">function useDebounce&lt;T&gt;(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() =&gt; {\n    const timer = setTimeout(() =&gt; setDebouncedValue(value), delay);\n    return () =&gt; clearTimeout(timer);\n  }, [value, delay]);\n  return debouncedValue;\n}</code></pre><h2>خلاصة</h2><p>استخدام TypeScript مع React ليس ترفاً بل ضرورة للمشاريع الكبيرة. الأنماط الصحيحة تجعل الكود أسهل في الصيانة والتطوير.</p>",
        en: "<h2>Why TypeScript with React?</h2><p>TypeScript provides type safety that prevents runtime errors. At MWM, all our projects use TypeScript.</p><h2>Folder Structure</h2><pre><code class=\"language-text\">src/\n  components/     # Reusable UI components\n    ui/           # Base components (Button, Input, Modal)\n    layout/       # Header, Footer, Sidebar\n    common/       # Shared components\n  hooks/          # Custom hooks\n  services/       # API calls\n  types/          # TypeScript types\n  lib/            # Utilities\n  store/          # State management</code></pre><h2>Component Patterns</h2><pre><code class=\"language-tsx\">interface ButtonProps {\n  variant: 'primary' | 'secondary' | 'danger';\n  size?: 'sm' | 'md' | 'lg';\n  isLoading?: boolean;\n  children: React.ReactNode;\n  onClick?: () =&gt; void;\n}\n\nexport function Button({ variant, size = 'md', isLoading, children, onClick }: ButtonProps) {\n  return (\n    &lt;button\n      className={cn(variants[variant], sizes[size])}\n      disabled={isLoading}\n      onClick={onClick}\n    &gt;\n      {isLoading ? &lt;Spinner /&gt; : children}\n    &lt;/button&gt;\n  );\n}</code></pre><h2>Custom Hooks</h2><pre><code class=\"language-tsx\">function useDebounce&lt;T&gt;(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() =&gt; {\n    const timer = setTimeout(() =&gt; setDebouncedValue(value), delay);\n    return () =&gt; clearTimeout(timer);\n  }, [value, delay]);\n  return debouncedValue;\n}</code></pre><h2>Conclusion</h2><p>Using TypeScript with React is not a luxury but a necessity for large projects. The right patterns make code easier to maintain and develop.</p>",
      },
      category: categories['technology'],
      author: authorId,
      featuredImage: '/blog/blog-header-2.svg',
      tags: [
        { ar: 'React', en: 'React' },
        { ar: 'TypeScript', en: 'TypeScript' },
        { ar: 'أنماط التصميم', en: 'Design Patterns' },
      ],
      status: 'published' as const,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تقنيات Tailwind CSS المتقدمة للمشاريع الإنتاجية',
        en: 'Advanced Tailwind CSS Techniques for Production Apps',
      },
      slug: 'tailwindcss-advanced-techniques',
      excerpt: {
        ar: 'plugins مخصصة، animations، ودعم RTL مع Tailwind CSS',
        en: 'Custom plugins, animations, and RTL support with Tailwind CSS',
      },
      content: {
        ar: "<h2>Tailwind CSS في المشاريع الكبيرة</h2><p>Tailwind CSS هو إطار CSS المفضل لدينا في MWM. نستخدمه في أكثر من 15 مشروع.</p><h2>دعم RTL</h2><p>لدعم العربية بشكل صحيح نستخدم logical properties:</p><pre><code class=\"language-html\">&lt;!-- بدل left/right استخدم start/end --&gt;\n&lt;div class=\"ps-4 pe-2 ms-auto me-0\"&gt;\n  &lt;p class=\"text-start\"&gt;نص يتكيف مع الاتجاه&lt;/p&gt;\n&lt;/div&gt;</code></pre><h2>Animations مخصصة</h2><pre><code class=\"language-js\">// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      animation: {\n        'fade-in': 'fadeIn 0.5s ease-in-out',\n        'slide-up': 'slideUp 0.3s ease-out',\n        'float': 'float 3s ease-in-out infinite',\n      },\n      keyframes: {\n        fadeIn: {\n          '0%': { opacity: '0' },\n          '100%': { opacity: '1' },\n        },\n        slideUp: {\n          '0%': { transform: 'translateY(20px)', opacity: '0' },\n          '100%': { transform: 'translateY(0)', opacity: '1' },\n        },\n      },\n    },\n  },\n};</code></pre><h2>Dark Mode</h2><pre><code class=\"language-tsx\">&lt;div className=\"bg-white dark:bg-gray-900 text-gray-900 dark:text-white\"&gt;\n  &lt;h1 className=\"text-primary-600 dark:text-primary-400\"&gt;عنوان&lt;/h1&gt;\n&lt;/div&gt;</code></pre><h2>cn() Utility</h2><pre><code class=\"language-ts\">import { clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}</code></pre><p>هذه الدالة تحل مشكلة تعارض classes في Tailwind.</p>",
        en: "<h2>Tailwind CSS in Large Projects</h2><p>Tailwind CSS is our preferred CSS framework at MWM. We use it in 15+ projects.</p><h2>RTL Support</h2><p>For proper Arabic support we use logical properties:</p><pre><code class=\"language-html\">&lt;!-- Use start/end instead of left/right --&gt;\n&lt;div class=\"ps-4 pe-2 ms-auto me-0\"&gt;\n  &lt;p class=\"text-start\"&gt;Text that adapts to direction&lt;/p&gt;\n&lt;/div&gt;</code></pre><h2>Custom Animations</h2><pre><code class=\"language-js\">// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      animation: {\n        'fade-in': 'fadeIn 0.5s ease-in-out',\n        'slide-up': 'slideUp 0.3s ease-out',\n        'float': 'float 3s ease-in-out infinite',\n      },\n      keyframes: {\n        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },\n        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },\n      },\n    },\n  },\n};</code></pre><h2>Dark Mode</h2><pre><code class=\"language-tsx\">&lt;div className=\"bg-white dark:bg-gray-900 text-gray-900 dark:text-white\"&gt;\n  &lt;h1 className=\"text-primary-600 dark:text-primary-400\"&gt;Title&lt;/h1&gt;\n&lt;/div&gt;</code></pre><h2>cn() Utility</h2><pre><code class=\"language-ts\">import { clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}</code></pre><p>This function solves the class conflict problem in Tailwind.</p>",
      },
      category: categories['design'],
      author: authorId,
      featuredImage: '/blog/blog-header-3.svg',
      tags: [
        { ar: 'Tailwind CSS', en: 'Tailwind CSS' },
        { ar: 'CSS', en: 'CSS' },
        { ar: 'تصميم', en: 'Design' },
      ],
      status: 'published' as const,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'Server Components vs Client Components في Next.js',
        en: 'Server Components vs Client Components in Next.js',
      },
      slug: 'server-vs-client-components-nextjs',
      excerpt: {
        ar: 'متى تستخدم كل نوع وكيف تتجنب الأخطاء الشائعة',
        en: 'When to use each type and how to avoid common mistakes',
      },
      content: {
        ar: "<h2>الفرق الأساسي</h2><p>Server Components يتم تشغيلها على السيرفر فقط ولا ترسل JavaScript للمتصفح. Client Components تعمل على المتصفح وتدعم interactivity.</p><h2>متى تستخدم Server Components؟</h2><ul><li>جلب بيانات من قاعدة البيانات أو API</li><li>عرض محتوى ثابت</li><li>SEO-critical content</li><li>الوصول لموارد السيرفر (ملفات, env variables)</li></ul><h2>متى تستخدم Client Components؟</h2><ul><li>useState, useEffect, onClick</li><li>Browser APIs (localStorage, window)</li><li>أي تفاعل مع المستخدم</li></ul><pre><code class=\"language-tsx\">'use client'; // هذا السطر يحول المكون لـ Client Component\n\nimport { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;{count}&lt;/button&gt;;\n}</code></pre><h2>النمط الصحيح: Server يمرر البيانات لـ Client</h2><pre><code class=\"language-tsx\">// page.tsx (Server Component)\nasync function ProjectsPage() {\n  const projects = await getProjects(); // جلب بيانات على السيرفر\n  return &lt;ProjectsClient projects={projects} /&gt;;\n}\n\n// ProjectsClient.tsx (Client Component)\n'use client';\nexport function ProjectsClient({ projects }) {\n  const [filter, setFilter] = useState('all');\n  // ... filtering logic\n}</code></pre>",
        en: "<h2>The Core Difference</h2><p>Server Components run on the server only and send no JavaScript to the browser. Client Components run in the browser and support interactivity.</p><h2>When to Use Server Components?</h2><ul><li>Fetching data from databases or APIs</li><li>Rendering static content</li><li>SEO-critical content</li><li>Accessing server resources (files, env variables)</li></ul><h2>When to Use Client Components?</h2><ul><li>useState, useEffect, onClick</li><li>Browser APIs (localStorage, window)</li><li>Any user interaction</li></ul><pre><code class=\"language-tsx\">'use client';\nimport { useState } from 'react';\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;{count}&lt;/button&gt;;\n}</code></pre><h2>The Right Pattern: Server Passes Data to Client</h2><pre><code class=\"language-tsx\">// page.tsx (Server Component)\nasync function ProjectsPage() {\n  const projects = await getProjects();\n  return &lt;ProjectsClient projects={projects} /&gt;;\n}\n\n// ProjectsClient.tsx (Client Component)\n'use client';\nexport function ProjectsClient({ projects }) {\n  const [filter, setFilter] = useState('all');\n  // ... filtering logic\n}</code></pre>",
      },
      category: categories['tutorials'],
      author: authorId,
      featuredImage: '/blog/blog-header-4.svg',
      tags: [
        { ar: 'Next.js', en: 'Next.js' },
        { ar: 'React', en: 'React' },
        { ar: 'Server Components', en: 'Server Components' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء SaaS كامل بـ Next.js و Prisma و PostgreSQL',
        en: 'Building a Full-Stack SaaS with Next.js, Prisma, and PostgreSQL',
      },
      slug: 'fullstack-saas-nextjs-prisma',
      excerpt: {
        ar: 'خطوة بخطوة لبناء منصة SaaS من الصفر',
        en: 'Step-by-step guide to building a SaaS platform from scratch',
      },
      content: {
        ar: '<h2>ما هو SaaS؟</h2><p>Software as a Service هو نموذج أعمال يوفر البرمجيات كخدمة اشتراك. في MWM بنينا عدة منصات SaaS مثل Ebn Kathier Academy.</p><h2>Tech Stack</h2><ul><li>Next.js 16 - Frontend + API routes</li><li>Prisma 7 - ORM لقاعدة البيانات</li><li>PostgreSQL - قاعدة بيانات علائقية</li><li>NextAuth 5 - مصادقة</li><li>Tailwind CSS - تصميم</li></ul><h2>Schema التصميم</h2><pre><code class="language-prisma">model User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  name      String?\n  role      Role     @default(USER)\n  plan      Plan     @default(FREE)\n  createdAt DateTime @default(now())\n  projects  Project[]\n}\n\nmodel Project {\n  id        String   @id @default(cuid())\n  name      String\n  slug      String   @unique\n  owner     User     @relation(fields: [ownerId], references: [id])\n  ownerId   String\n}</code></pre><h2>Authentication مع NextAuth</h2><pre><code class="language-ts">// auth.ts\nexport const { auth, signIn, signOut } = NextAuth({\n  providers: [Google, GitHub, Credentials],\n  callbacks: {\n    session({ session, token }) {\n      session.user.role = token.role;\n      return session;\n    },\n  },\n});</code></pre><h2>خلاصة</h2><p>بناء SaaS يحتاج تخطيط جيد من البداية. اختيار التقنيات الصحيحة يوفر وقت كبير في المستقبل.</p>',
        en: '<h2>What is SaaS?</h2><p>Software as a Service provides software via subscription. At MWM we\'ve built several SaaS platforms including Ebn Kathier Academy.</p><h2>Tech Stack</h2><ul><li>Next.js 16 - Frontend + API routes</li><li>Prisma 7 - Database ORM</li><li>PostgreSQL - Relational database</li><li>NextAuth 5 - Authentication</li><li>Tailwind CSS - Styling</li></ul><h2>Schema Design</h2><pre><code class="language-prisma">model User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  name      String?\n  role      Role     @default(USER)\n  plan      Plan     @default(FREE)\n  createdAt DateTime @default(now())\n  projects  Project[]\n}\n\nmodel Project {\n  id        String   @id @default(cuid())\n  name      String\n  slug      String   @unique\n  owner     User     @relation(fields: [ownerId], references: [id])\n  ownerId   String\n}</code></pre><h2>Authentication with NextAuth</h2><pre><code class="language-ts">export const { auth, signIn, signOut } = NextAuth({\n  providers: [Google, GitHub, Credentials],\n  callbacks: {\n    session({ session, token }) {\n      session.user.role = token.role;\n      return session;\n    },\n  },\n});</code></pre><h2>Conclusion</h2><p>Building a SaaS requires good planning from the start. Choosing the right technologies saves significant time in the future.</p>',
      },
      category: categories['tutorials'],
      author: authorId,
      featuredImage: '/blog/blog-header-5.svg',
      tags: [
        { ar: 'SaaS', en: 'SaaS' },
        { ar: 'Prisma', en: 'Prisma' },
        { ar: 'PostgreSQL', en: 'PostgreSQL' },
      ],
      status: 'published' as const,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'React Hook Form + Zod: دليل التحقق من البيانات',
        en: 'React Hook Form + Zod: The Ultimate Form Validation Guide',
      },
      slug: 'react-hook-form-zod-validation',
      excerpt: {
        ar: 'كيف تبني forms معقدة وآمنة بسهولة',
        en: 'How to build complex and secure forms easily',
      },
      content: {
        ar: "<h2>لماذا React Hook Form؟</h2><p>أخف مكتبة forms لـ React - لا re-renders غير ضرورية. مع Zod للتحقق من الأنواع.</p><h2>التكامل مع Zod</h2><pre><code class=\"language-tsx\">import { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport { z } from 'zod';\n\nconst schema = z.object({\n  name: z.string().min(2, 'الاسم مطلوب'),\n  email: z.string().email('بريد إلكتروني غير صحيح'),\n  phone: z.string().regex(/^\\+?[0-9]{10,15}$/, 'رقم هاتف غير صحيح'),\n  message: z.string().min(10, 'الرسالة قصيرة جداً'),\n});\n\ntype FormData = z.infer&lt;typeof schema&gt;;\n\nexport function ContactForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm&lt;FormData&gt;({\n    resolver: zodResolver(schema),\n  });\n\n  const onSubmit = async (data: FormData) =&gt; {\n    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });\n  };\n\n  return (\n    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;\n      &lt;input {...register('name')} /&gt;\n      {errors.name &amp;&amp; &lt;span&gt;{errors.name.message}&lt;/span&gt;}\n      &lt;button type=\"submit\"&gt;إرسال&lt;/button&gt;\n    &lt;/form&gt;\n  );\n}</code></pre><h2>Conditional Fields</h2><p>Zod يدعم conditional validation عبر discriminated unions وrefine.</p>",
        en: "<h2>Why React Hook Form?</h2><p>The lightest forms library for React - no unnecessary re-renders. Combined with Zod for type-safe validation.</p><h2>Integration with Zod</h2><pre><code class=\"language-tsx\">import { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport { z } from 'zod';\n\nconst schema = z.object({\n  name: z.string().min(2, 'Name is required'),\n  email: z.string().email('Invalid email'),\n  phone: z.string().regex(/^\\+?[0-9]{10,15}$/, 'Invalid phone'),\n  message: z.string().min(10, 'Message too short'),\n});\n\ntype FormData = z.infer&lt;typeof schema&gt;;\n\nexport function ContactForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm&lt;FormData&gt;({\n    resolver: zodResolver(schema),\n  });\n\n  const onSubmit = async (data: FormData) =&gt; {\n    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });\n  };\n\n  return (\n    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;\n      &lt;input {...register('name')} /&gt;\n      {errors.name &amp;&amp; &lt;span&gt;{errors.name.message}&lt;/span&gt;}\n      &lt;button type=\"submit\"&gt;Submit&lt;/button&gt;\n    &lt;/form&gt;\n  );\n}</code></pre><h2>Conditional Fields</h2><p>Zod supports conditional validation via discriminated unions and refine.</p>",
      },
      category: categories['tutorials'],
      author: authorId,
      featuredImage: '/blog/blog-header-6.svg',
      tags: [
        { ar: 'React Hook Form', en: 'React Hook Form' },
        { ar: 'Zod', en: 'Zod' },
        { ar: 'Forms', en: 'Forms' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'إدارة الحالة في 2026: Zustand vs Redux vs Jotai',
        en: 'State Management in 2026: Zustand vs Redux vs Jotai',
      },
      slug: 'state-management-2026-comparison',
      excerpt: {
        ar: 'مقارنة عملية من واقع مشاريعنا الحقيقية',
        en: 'Practical comparison from our real-world projects',
      },
      content: {
        ar: '<h2>لماذا Zustand؟</h2><p>في MWM اخترنا Zustand لأنه بسيط وخفيف ولا يحتاج boilerplate. مثالي مع Next.js.</p><pre><code class="language-ts">import { create } from \'zustand\';\n\ninterface AuthStore {\n  user: User | null;\n  isAuthenticated: boolean;\n  login: (user: User) =&gt; void;\n  logout: () =&gt; void;\n}\n\nexport const useAuthStore = create&lt;AuthStore&gt;((set) =&gt; ({\n  user: null,\n  isAuthenticated: false,\n  login: (user) =&gt; set({ user, isAuthenticated: true }),\n  logout: () =&gt; set({ user: null, isAuthenticated: false }),\n}));</code></pre><h2>المقارنة</h2><table><tr><th>الميزة</th><th>Zustand</th><th>Redux</th><th>Jotai</th></tr><tr><td>حجم Bundle</td><td>1.1KB</td><td>7.4KB</td><td>3.4KB</td></tr><tr><td>Boilerplate</td><td>قليل جداً</td><td>كثير</td><td>قليل</td></tr><tr><td>DevTools</td><td>نعم</td><td>ممتاز</td><td>نعم</td></tr></table><h2>نصيحتنا</h2><p>Zustand للمشاريع المتوسطة والكبيرة. Redux فقط إذا كان الفريق يعرفه جيداً. TanStack Query للـ server state.</p>',
        en: "<h2>Why Zustand?</h2><p>At MWM we chose Zustand because it's simple, lightweight, and needs no boilerplate. Perfect with Next.js.</p><pre><code class=\"language-ts\">import { create } from 'zustand';\n\ninterface AuthStore {\n  user: User | null;\n  isAuthenticated: boolean;\n  login: (user: User) =&gt; void;\n  logout: () =&gt; void;\n}\n\nexport const useAuthStore = create&lt;AuthStore&gt;((set) =&gt; ({\n  user: null,\n  isAuthenticated: false,\n  login: (user) =&gt; set({ user, isAuthenticated: true }),\n  logout: () =&gt; set({ user: null, isAuthenticated: false }),\n}));</code></pre><h2>Comparison</h2><table><tr><th>Feature</th><th>Zustand</th><th>Redux</th><th>Jotai</th></tr><tr><td>Bundle Size</td><td>1.1KB</td><td>7.4KB</td><td>3.4KB</td></tr><tr><td>Boilerplate</td><td>Minimal</td><td>Heavy</td><td>Low</td></tr><tr><td>DevTools</td><td>Yes</td><td>Excellent</td><td>Yes</td></tr></table><h2>Our Recommendation</h2><p>Zustand for medium-large projects. Redux only if the team knows it well. TanStack Query for server state.</p>",
      },
      category: categories['technology'],
      author: authorId,
      featuredImage: '/blog/blog-header-7.svg',
      tags: [
        { ar: 'Zustand', en: 'Zustand' },
        { ar: 'Redux', en: 'Redux' },
        { ar: 'State Management', en: 'State Management' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء ميزات Real-Time مع Socket.io و Next.js',
        en: 'Building Real-Time Features with Socket.io and Next.js',
      },
      slug: 'realtime-socketio-nextjs',
      excerpt: {
        ar: 'دردشة، إشعارات، وتحديثات حية في تطبيقات الويب',
        en: 'Chat, notifications, and live updates in web applications',
      },
      content: {
        ar: "<h2>Socket.io في مشاريعنا</h2><p>نستخدم Socket.io في Bagour Delivery (تتبع طلبات), Wasalni (تتبع GPS), وE-Score (إشعارات حية).</p><h2>إعداد السيرفر</h2><pre><code class=\"language-ts\">import { Server } from 'socket.io';\n\nconst io = new Server(httpServer, {\n  cors: { origin: process.env.CLIENT_URL },\n});\n\nio.on('connection', (socket) =&gt; {\n  const userId = socket.handshake.auth.userId;\n  socket.join(`user:${userId}`);\n\n  socket.on('send_message', (data) =&gt; {\n    io.to(`room:${data.roomId}`).emit('new_message', data);\n  });\n});</code></pre><h2>React Hook للـ Client</h2><pre><code class=\"language-tsx\">'use client';\nimport { useEffect, useState } from 'react';\nimport { io, Socket } from 'socket.io-client';\n\nexport function useSocket() {\n  const [socket, setSocket] = useState&lt;Socket | null&gt;(null);\n\n  useEffect(() =&gt; {\n    const s = io(process.env.NEXT_PUBLIC_WS_URL, {\n      auth: { token: getToken() },\n    });\n    setSocket(s);\n    return () =&gt; { s.disconnect(); };\n  }, []);\n\n  return socket;\n}</code></pre><h2>Rooms Pattern</h2><p>نستخدم rooms لتنظيم الاتصالات: <code>order:{orderId}</code>, <code>driver:{driverId}</code>, <code>admin:dashboard</code>.</p>",
        en: "<h2>Socket.io in Our Projects</h2><p>We use Socket.io in Bagour Delivery (order tracking), Wasalni (GPS tracking), and E-Score (live notifications).</p><h2>Server Setup</h2><pre><code class=\"language-ts\">import { Server } from 'socket.io';\n\nconst io = new Server(httpServer, {\n  cors: { origin: process.env.CLIENT_URL },\n});\n\nio.on('connection', (socket) =&gt; {\n  const userId = socket.handshake.auth.userId;\n  socket.join(`user:${userId}`);\n\n  socket.on('send_message', (data) =&gt; {\n    io.to(`room:${data.roomId}`).emit('new_message', data);\n  });\n});</code></pre><h2>React Client Hook</h2><pre><code class=\"language-tsx\">'use client';\nimport { useEffect, useState } from 'react';\nimport { io, Socket } from 'socket.io-client';\n\nexport function useSocket() {\n  const [socket, setSocket] = useState&lt;Socket | null&gt;(null);\n  useEffect(() =&gt; {\n    const s = io(process.env.NEXT_PUBLIC_WS_URL, { auth: { token: getToken() } });\n    setSocket(s);\n    return () =&gt; { s.disconnect(); };\n  }, []);\n  return socket;\n}</code></pre><h2>Rooms Pattern</h2><p>We use rooms to organize connections: <code>order:{orderId}</code>, <code>driver:{driverId}</code>, <code>admin:dashboard</code>.</p>",
      },
      category: categories['tutorials'],
      author: authorId,
      featuredImage: '/blog/blog-header-8.svg',
      tags: [
        { ar: 'Socket.io', en: 'Socket.io' },
        { ar: 'Real-time', en: 'Real-time' },
        { ar: 'WebSocket', en: 'WebSocket' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تحسين أداء الويب: دليل Core Web Vitals',
        en: 'Optimizing Web Performance: Core Web Vitals Guide',
      },
      slug: 'web-performance-core-web-vitals',
      excerpt: {
        ar: 'lazy loading, code splitting, وcaching للحصول على 100 في Lighthouse',
        en: 'Lazy loading, code splitting, and caching for a perfect Lighthouse score',
      },
      content: {
        ar: '<h2>ما هي Core Web Vitals؟</h2><p>ثلاث مقاييس تستخدمها Google لتقييم تجربة المستخدم: LCP (أكبر عنصر مرئي), FID (وقت التفاعل الأول), CLS (ثبات التخطيط).</p><h2>تحسين الصور</h2><pre><code class="language-tsx">import Image from \'next/image\';\n\n&lt;Image\n  src="/hero.webp"\n  alt="Hero"\n  width={1200}\n  height={630}\n  priority  // للصور فوق الطي\n  placeholder="blur"\n  blurDataURL={blurHash}\n/&gt;</code></pre><h2>Code Splitting</h2><pre><code class="language-tsx">import dynamic from \'next/dynamic\';\n\nconst HeavyChart = dynamic(() =&gt; import(\'./Chart\'), {\n  loading: () =&gt; &lt;Skeleton /&gt;,\n  ssr: false,\n});</code></pre><h2>Caching Strategies</h2><pre><code class="language-ts">// Next.js fetch with caching\nconst data = await fetch(url, {\n  next: { revalidate: 3600 }, // ISR: revalidate every hour\n});</code></pre><p>في MWM نحقق عادةً 90+ في كل مقاييس Lighthouse.</p>',
        en: '<h2>What are Core Web Vitals?</h2><p>Three metrics Google uses to evaluate user experience: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift).</p><h2>Image Optimization</h2><pre><code class="language-tsx">import Image from \'next/image\';\n\n&lt;Image\n  src="/hero.webp"\n  alt="Hero"\n  width={1200}\n  height={630}\n  priority\n  placeholder="blur"\n  blurDataURL={blurHash}\n/&gt;</code></pre><h2>Code Splitting</h2><pre><code class="language-tsx">import dynamic from \'next/dynamic\';\nconst HeavyChart = dynamic(() =&gt; import(\'./Chart\'), {\n  loading: () =&gt; &lt;Skeleton /&gt;,\n  ssr: false,\n});</code></pre><h2>Caching Strategies</h2><pre><code class="language-ts">const data = await fetch(url, {\n  next: { revalidate: 3600 },\n});</code></pre><p>At MWM we typically achieve 90+ on all Lighthouse metrics.</p>',
      },
      category: categories['technology'],
      author: authorId,
      featuredImage: '/blog/blog-header-9.svg',
      tags: [
        { ar: 'أداء', en: 'Performance' },
        { ar: 'Core Web Vitals', en: 'Core Web Vitals' },
        { ar: 'SEO', en: 'SEO' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء تطبيقات ويب يسهل الوصول إليها (a11y)',
        en: 'Building Accessible Web Applications (a11y)',
      },
      slug: 'accessible-web-applications-a11y',
      excerpt: {
        ar: 'ARIA, تنقل لوحة المفاتيح, وقارئات الشاشة',
        en: 'ARIA, keyboard navigation, and screen readers',
      },
      content: {
        ar: "<h2>لماذا إمكانية الوصول مهمة؟</h2><p>15% من سكان العالم لديهم إعاقة ما. الويب يجب أن يكون متاحاً للجميع. كما أن a11y يحسن SEO.</p><h2>ARIA Labels</h2><pre><code class=\"language-tsx\">&lt;button\n  aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}\n  aria-expanded={isMenuOpen}\n  onClick={toggleMenu}\n&gt;\n  {isMenuOpen ? &lt;X /&gt; : &lt;Menu /&gt;}\n&lt;/button&gt;</code></pre><h2>تنقل لوحة المفاتيح</h2><pre><code class=\"language-tsx\">function handleKeyDown(e: KeyboardEvent) {\n  switch (e.key) {\n    case 'Escape': closeModal(); break;\n    case 'Tab': trapFocus(e); break;\n    case 'Enter':\n    case ' ': activateItem(); break;\n  }\n}</code></pre><h2>Semantic HTML</h2><p>استخدم العناصر الصحيحة: <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>.</p>",
        en: "<h2>Why Accessibility Matters</h2><p>15% of the world's population has some form of disability. The web must be accessible to everyone. Plus, a11y improves SEO.</p><h2>ARIA Labels</h2><pre><code class=\"language-tsx\">&lt;button\n  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}\n  aria-expanded={isMenuOpen}\n  onClick={toggleMenu}\n&gt;\n  {isMenuOpen ? &lt;X /&gt; : &lt;Menu /&gt;}\n&lt;/button&gt;</code></pre><h2>Keyboard Navigation</h2><pre><code class=\"language-tsx\">function handleKeyDown(e: KeyboardEvent) {\n  switch (e.key) {\n    case 'Escape': closeModal(); break;\n    case 'Tab': trapFocus(e); break;\n    case 'Enter':\n    case ' ': activateItem(); break;\n  }\n}</code></pre><h2>Semantic HTML</h2><p>Use correct elements: <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>.</p>",
      },
      category: categories['design'],
      author: authorId,
      featuredImage: '/blog/blog-header-10.svg',
      tags: [
        { ar: 'إمكانية الوصول', en: 'Accessibility' },
        { ar: 'a11y', en: 'a11y' },
        { ar: 'ARIA', en: 'ARIA' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'Flutter Clean Architecture: دليل عملي',
        en: 'Flutter Clean Architecture: A Practical Guide',
      },
      slug: 'flutter-clean-architecture-guide',
      excerpt: {
        ar: 'بنية مشروع Flutter المثالية مع أمثلة حقيقية',
        en: 'The ideal Flutter project structure with real examples',
      },
      content: {
        ar: '<h2>Clean Architecture في Flutter</h2><p>في MWM نستخدم Clean Architecture في كل تطبيقات Flutter (Bagour, Sana3y, Wasalni).</p><h2>بنية المجلدات</h2><pre><code class="language-text">lib/\n  core/           # Utilities, constants, themes\n    router/       # GoRouter configuration\n    network/      # Dio client, interceptors\n    theme/        # App theme\n  features/       # Feature modules\n    auth/\n      data/       # Repositories, data sources, models\n      domain/     # Entities, use cases, repo interfaces\n      presentation/ # Screens, widgets, providers\n    home/\n      data/\n      domain/\n      presentation/</code></pre><h2>Repository Pattern</h2><pre><code class="language-dart">abstract class AuthRepository {\n  Future&lt;Either&lt;Failure, User&gt;&gt; login(String email, String password);\n  Future&lt;Either&lt;Failure, void&gt;&gt; logout();\n}\n\nclass AuthRepositoryImpl implements AuthRepository {\n  final AuthRemoteDataSource remote;\n  final AuthLocalDataSource local;\n\n  @override\n  Future&lt;Either&lt;Failure, User&gt;&gt; login(String email, String password) async {\n    try {\n      final user = await remote.login(email, password);\n      await local.cacheUser(user);\n      return Right(user);\n    } on ServerException catch (e) {\n      return Left(ServerFailure(e.message));\n    }\n  }\n}</code></pre>',
        en: '<h2>Clean Architecture in Flutter</h2><p>At MWM we use Clean Architecture in all Flutter apps (Bagour, Sana3y, Wasalni).</p><h2>Folder Structure</h2><pre><code class="language-text">lib/\n  core/           # Utilities, constants, themes\n    router/       # GoRouter configuration\n    network/      # Dio client, interceptors\n    theme/        # App theme\n  features/       # Feature modules\n    auth/\n      data/       # Repositories, data sources, models\n      domain/     # Entities, use cases, repo interfaces\n      presentation/ # Screens, widgets, providers</code></pre><h2>Repository Pattern</h2><pre><code class="language-dart">abstract class AuthRepository {\n  Future&lt;Either&lt;Failure, User&gt;&gt; login(String email, String password);\n  Future&lt;Either&lt;Failure, void&gt;&gt; logout();\n}\n\nclass AuthRepositoryImpl implements AuthRepository {\n  final AuthRemoteDataSource remote;\n  final AuthLocalDataSource local;\n\n  @override\n  Future&lt;Either&lt;Failure, User&gt;&gt; login(String email, String password) async {\n    try {\n      final user = await remote.login(email, password);\n      await local.cacheUser(user);\n      return Right(user);\n    } on ServerException catch (e) {\n      return Left(ServerFailure(e.message));\n    }\n  }\n}</code></pre>',
      },
      category: categories['mobile-development'],
      author: authorId,
      featuredImage: '/blog/blog-header-1.svg',
      tags: [
        { ar: 'Flutter', en: 'Flutter' },
        { ar: 'Clean Architecture', en: 'Clean Architecture' },
        { ar: 'Dart', en: 'Dart' },
      ],
      status: 'published' as const,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'إدارة الحالة في Flutter: Riverpod vs BLoC',
        en: 'State Management in Flutter: Riverpod vs BLoC',
      },
      slug: 'flutter-riverpod-vs-bloc',
      excerpt: {
        ar: 'مقارنة من واقع خبرتنا في كلا النمطين',
        en: 'Comparison from our experience with both patterns',
      },
      content: {
        ar: '<h2>Riverpod</h2><p>نستخدمه في Sana3y و Wasalni. مرن جداً ولا يحتاج BuildContext.</p><pre><code class="language-dart">final authProvider = StateNotifierProvider&lt;AuthNotifier, AuthState&gt;((ref) {\n  return AuthNotifier(ref.read(authRepositoryProvider));\n});\n\nclass AuthNotifier extends StateNotifier&lt;AuthState&gt; {\n  final AuthRepository _repo;\n  AuthNotifier(this._repo) : super(const AuthState.initial());\n\n  Future&lt;void&gt; login(String email, String password) async {\n    state = const AuthState.loading();\n    final result = await _repo.login(email, password);\n    state = result.fold(\n      (failure) =&gt; AuthState.error(failure.message),\n      (user) =&gt; AuthState.authenticated(user),\n    );\n  }\n}</code></pre><h2>BLoC</h2><p>نستخدمه في E-Score و Nawawi. أكثر تنظيماً للمشاريع الكبيرة.</p><pre><code class="language-dart">class AuthBloc extends Bloc&lt;AuthEvent, AuthState&gt; {\n  AuthBloc(this._repo) : super(AuthInitial()) {\n    on&lt;LoginRequested&gt;(_onLogin);\n  }\n\n  Future&lt;void&gt; _onLogin(LoginRequested event, Emitter&lt;AuthState&gt; emit) async {\n    emit(AuthLoading());\n    final result = await _repo.login(event.email, event.password);\n    result.fold(\n      (f) =&gt; emit(AuthError(f.message)),\n      (u) =&gt; emit(AuthAuthenticated(u)),\n    );\n  }\n}</code></pre>',
        en: '<h2>Riverpod</h2><p>We use it in Sana3y and Wasalni. Very flexible and doesn\'t need BuildContext.</p><pre><code class="language-dart">final authProvider = StateNotifierProvider&lt;AuthNotifier, AuthState&gt;((ref) {\n  return AuthNotifier(ref.read(authRepositoryProvider));\n});\n\nclass AuthNotifier extends StateNotifier&lt;AuthState&gt; {\n  final AuthRepository _repo;\n  AuthNotifier(this._repo) : super(const AuthState.initial());\n\n  Future&lt;void&gt; login(String email, String password) async {\n    state = const AuthState.loading();\n    final result = await _repo.login(email, password);\n    state = result.fold(\n      (failure) =&gt; AuthState.error(failure.message),\n      (user) =&gt; AuthState.authenticated(user),\n    );\n  }\n}</code></pre><h2>BLoC</h2><p>We use it in E-Score and Nawawi. More structured for large projects.</p><pre><code class="language-dart">class AuthBloc extends Bloc&lt;AuthEvent, AuthState&gt; {\n  AuthBloc(this._repo) : super(AuthInitial()) {\n    on&lt;LoginRequested&gt;(_onLogin);\n  }\n  Future&lt;void&gt; _onLogin(LoginRequested event, Emitter&lt;AuthState&gt; emit) async {\n    emit(AuthLoading());\n    final result = await _repo.login(event.email, event.password);\n    result.fold((f) =&gt; emit(AuthError(f.message)), (u) =&gt; emit(AuthAuthenticated(u)));\n  }\n}</code></pre>',
      },
      category: categories['mobile-development'],
      author: authorId,
      featuredImage: '/blog/blog-header-2.svg',
      tags: [
        { ar: 'Riverpod', en: 'Riverpod' },
        { ar: 'BLoC', en: 'BLoC' },
        { ar: 'Flutter', en: 'Flutter' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء تطبيق توصيل طعام بـ Flutter',
        en: 'Building a Food Delivery App with Flutter',
      },
      slug: 'building-food-delivery-app-flutter',
      excerpt: {
        ar: 'البنية الحقيقية لمشروع Bagour Delivery',
        en: 'Real architecture from the Bagour Delivery project',
      },
      content: {
        ar: "<h2>مشروع Bagour Delivery</h2><p>منصة توصيل طعام متكاملة بنيناها لمدينة باجور. تشمل 3 تطبيقات Flutter + Backend + Admin Dashboard.</p><h2>التحديات</h2><ul><li>تتبع الطلبات في الوقت الحقيقي</li><li>4 أنواع مستخدمين (عميل, سائق, مطعم, أدمن)</li><li>دفع إلكتروني مع Paymob</li></ul><h2>Socket.io Rooms</h2><pre><code class=\"language-ts\">// كل طلب له room خاص\nsocket.join(`order:${orderId}`);\nsocket.join(`restaurant:${restaurantId}`);\nsocket.join(`driver:${driverId}`);\n\n// تحديث حالة الطلب\nio.to(`order:${orderId}`).emit('order_status_updated', { status: 'on_the_way' });</code></pre><h2>النتيجة</h2><p>المنصة تخدم مئات الطلبات يومياً مع تتبع فوري ودفع إلكتروني آمن.</p>",
        en: "<h2>Bagour Delivery Project</h2><p>A complete food delivery platform we built for Bagour city. Includes 3 Flutter apps + Backend + Admin Dashboard.</p><h2>Challenges</h2><ul><li>Real-time order tracking</li><li>4 user types (customer, driver, restaurant, admin)</li><li>Electronic payment with Paymob</li></ul><h2>Socket.io Rooms</h2><pre><code class=\"language-ts\">socket.join(`order:${orderId}`);\nsocket.join(`restaurant:${restaurantId}`);\nsocket.join(`driver:${driverId}`);\nio.to(`order:${orderId}`).emit('order_status_updated', { status: 'on_the_way' });</code></pre><h2>Result</h2><p>The platform serves hundreds of daily orders with real-time tracking and secure payment.</p>",
      },
      category: categories['case-studies'],
      author: authorId,
      featuredImage: '/blog/blog-header-3.svg',
      tags: [
        { ar: 'Flutter', en: 'Flutter' },
        { ar: 'توصيل طعام', en: 'Food Delivery' },
        { ar: 'دراسة حالة', en: 'Case Study' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تحسين أداء تطبيقات Flutter',
        en: 'Flutter Performance Optimization Techniques',
      },
      slug: 'flutter-performance-optimization',
      excerpt: {
        ar: 'تقليل rebuilds وتحسين الذاكرة واللوائح الطويلة',
        en: 'Reducing rebuilds, memory optimization, and long lists',
      },
      content: {
        ar: '<h2>const Constructors</h2><pre><code class="language-dart">// خطأ - يعيد بناء كل مرة\nWidget build(BuildContext context) {\n  return Padding(padding: EdgeInsets.all(8));\n}\n\n// صح - لا يعيد بناء\nWidget build(BuildContext context) {\n  return const Padding(padding: EdgeInsets.all(8));\n}</code></pre><h2>ListView.builder</h2><pre><code class="language-dart">// للقوائم الطويلة - يبني العناصر المرئية فقط\nListView.builder(\n  itemCount: items.length,\n  itemBuilder: (context, index) =&gt; ItemCard(item: items[index]),\n)</code></pre><h2>RepaintBoundary</h2><p>يعزل الرسم لمنع إعادة رسم العناصر الثابتة عند تحديث جزء من الشاشة.</p><h2>Image Caching</h2><pre><code class="language-dart">CachedNetworkImage(\n  imageUrl: url,\n  placeholder: (_, __) =&gt; const CircularProgressIndicator(),\n  errorWidget: (_, __, ___) =&gt; const Icon(Icons.error),\n)</code></pre>',
        en: '<h2>const Constructors</h2><pre><code class="language-dart">// Wrong - rebuilds every time\nWidget build(BuildContext context) {\n  return Padding(padding: EdgeInsets.all(8));\n}\n\n// Right - no rebuild\nWidget build(BuildContext context) {\n  return const Padding(padding: EdgeInsets.all(8));\n}</code></pre><h2>ListView.builder</h2><pre><code class="language-dart">ListView.builder(\n  itemCount: items.length,\n  itemBuilder: (context, index) =&gt; ItemCard(item: items[index]),\n)</code></pre><h2>RepaintBoundary</h2><p>Isolates painting to prevent repainting static elements when a part of the screen updates.</p><h2>Image Caching</h2><pre><code class="language-dart">CachedNetworkImage(\n  imageUrl: url,\n  placeholder: (_, __) =&gt; const CircularProgressIndicator(),\n  errorWidget: (_, __, ___) =&gt; const Icon(Icons.error),\n)</code></pre>',
      },
      category: categories['mobile-development'],
      author: authorId,
      featuredImage: '/blog/blog-header-4.svg',
      tags: [
        { ar: 'Flutter', en: 'Flutter' },
        { ar: 'أداء', en: 'Performance' },
        { ar: 'تحسين', en: 'Optimization' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'Push Notifications في Flutter: دليل FCM الشامل',
        en: 'Push Notifications in Flutter: Complete FCM Guide',
      },
      slug: 'flutter-push-notifications-fcm',
      excerpt: {
        ar: 'إعداد Firebase Cloud Messaging مع APNs لـ iOS',
        en: 'Setting up Firebase Cloud Messaging with APNs for iOS',
      },
      content: {
        ar: "<h2>إعداد FCM</h2><pre><code class=\"language-dart\">Future&lt;void&gt; initNotifications() async {\n  await Firebase.initializeApp();\n  final messaging = FirebaseMessaging.instance;\n\n  // طلب إذن iOS\n  await messaging.requestPermission(alert: true, badge: true, sound: true);\n\n  // الحصول على token\n  final token = await messaging.getToken();\n  await saveTokenToServer(token!);\n\n  // معالجة الإشعارات\n  FirebaseMessaging.onMessage.listen((message) {\n    showLocalNotification(message);\n  });\n\n  FirebaseMessaging.onMessageOpenedApp.listen((message) {\n    navigateToScreen(message.data);\n  });\n}</code></pre><h2>إرسال من السيرفر</h2><pre><code class=\"language-ts\">import admin from 'firebase-admin';\n\nawait admin.messaging().send({\n  token: userFcmToken,\n  notification: { title: 'طلب جديد!', body: 'لديك طلب توصيل جديد' },\n  data: { orderId: '123', type: 'new_order' },\n});</code></pre>",
        en: "<h2>FCM Setup</h2><pre><code class=\"language-dart\">Future&lt;void&gt; initNotifications() async {\n  await Firebase.initializeApp();\n  final messaging = FirebaseMessaging.instance;\n  await messaging.requestPermission(alert: true, badge: true, sound: true);\n  final token = await messaging.getToken();\n  await saveTokenToServer(token!);\n\n  FirebaseMessaging.onMessage.listen((message) {\n    showLocalNotification(message);\n  });\n  FirebaseMessaging.onMessageOpenedApp.listen((message) {\n    navigateToScreen(message.data);\n  });\n}</code></pre><h2>Sending from Server</h2><pre><code class=\"language-ts\">import admin from 'firebase-admin';\nawait admin.messaging().send({\n  token: userFcmToken,\n  notification: { title: 'New Order!', body: 'You have a new delivery order' },\n  data: { orderId: '123', type: 'new_order' },\n});</code></pre>",
      },
      category: categories['mobile-development'],
      author: authorId,
      featuredImage: '/blog/blog-header-5.svg',
      tags: [
        { ar: 'FCM', en: 'FCM' },
        { ar: 'إشعارات', en: 'Notifications' },
        { ar: 'Firebase', en: 'Firebase' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تتبع GPS في الوقت الحقيقي بـ Flutter',
        en: 'Real-Time GPS Tracking in Flutter',
      },
      slug: 'flutter-gps-tracking-google-maps',
      excerpt: {
        ar: 'Google Maps وتتبع موقع السائق من مشروع وصلني',
        en: 'Google Maps and driver location tracking from the Wasalni project',
      },
      content: {
        ar: "<h2>من مشروع وصلني</h2><p>بنينا نظام تتبع GPS فوري للسائقين يستخدم Redis GEO commands لتخزين المواقع.</p><pre><code class=\"language-dart\">// تتبع موقع السائق\nGeolocator.getPositionStream(\n  locationSettings: const LocationSettings(\n    accuracy: LocationAccuracy.high,\n    distanceFilter: 10, // تحديث كل 10 متر\n  ),\n).listen((position) {\n  socket.emit('update_location', {\n    'lat': position.latitude,\n    'lng': position.longitude,\n  });\n});</code></pre><h2>عرض على الخريطة</h2><pre><code class=\"language-dart\">GoogleMap(\n  initialCameraPosition: CameraPosition(target: currentLocation, zoom: 15),\n  markers: {\n    Marker(\n      markerId: const MarkerId('driver'),\n      position: driverLocation,\n      icon: customDriverIcon,\n    ),\n  },\n  polylines: {routePolyline},\n)</code></pre>",
        en: "<h2>From the Wasalni Project</h2><p>We built a real-time GPS tracking system for drivers using Redis GEO commands for location storage.</p><pre><code class=\"language-dart\">Geolocator.getPositionStream(\n  locationSettings: const LocationSettings(\n    accuracy: LocationAccuracy.high,\n    distanceFilter: 10,\n  ),\n).listen((position) {\n  socket.emit('update_location', {\n    'lat': position.latitude,\n    'lng': position.longitude,\n  });\n});</code></pre><h2>Displaying on Map</h2><pre><code class=\"language-dart\">GoogleMap(\n  initialCameraPosition: CameraPosition(target: currentLocation, zoom: 15),\n  markers: {\n    Marker(markerId: const MarkerId('driver'), position: driverLocation, icon: customDriverIcon),\n  },\n  polylines: {routePolyline},\n)</code></pre>",
      },
      category: categories['mobile-development'],
      author: authorId,
      featuredImage: '/blog/blog-header-6.svg',
      tags: [
        { ar: 'GPS', en: 'GPS' },
        { ar: 'Google Maps', en: 'Google Maps' },
        { ar: 'تتبع', en: 'Tracking' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'التخزين الآمن والمصادقة في Flutter',
        en: 'Secure Storage and Authentication in Flutter Apps',
      },
      slug: 'flutter-secure-storage-auth',
      excerpt: {
        ar: 'JWT tokens وbiometrics وflutter_secure_storage',
        en: 'JWT tokens, biometrics, and flutter_secure_storage',
      },
      content: {
        ar: "<h2>لا تستخدم SharedPreferences للـ Tokens!</h2><p>SharedPreferences ليس مشفراً. استخدم flutter_secure_storage بدلاً منه.</p><pre><code class=\"language-dart\">final storage = FlutterSecureStorage();\n\n// حفظ token\nawait storage.write(key: 'access_token', value: token);\n\n// قراءة token\nfinal token = await storage.read(key: 'access_token');\n\n// حذف عند تسجيل الخروج\nawait storage.deleteAll();</code></pre><h2>Dio Interceptor للـ Token Refresh</h2><pre><code class=\"language-dart\">class AuthInterceptor extends Interceptor {\n  @override\n  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {\n    final token = await storage.read(key: 'access_token');\n    if (token != null) {\n      options.headers['Authorization'] = 'Bearer $token';\n    }\n    handler.next(options);\n  }\n\n  @override\n  void onError(DioException err, ErrorInterceptorHandler handler) async {\n    if (err.response?.statusCode == 401) {\n      final newToken = await refreshToken();\n      if (newToken != null) {\n        err.requestOptions.headers['Authorization'] = 'Bearer $newToken';\n        final response = await dio.fetch(err.requestOptions);\n        return handler.resolve(response);\n      }\n    }\n    handler.next(err);\n  }\n}</code></pre>",
        en: "<h2>Don't Use SharedPreferences for Tokens!</h2><p>SharedPreferences is not encrypted. Use flutter_secure_storage instead.</p><pre><code class=\"language-dart\">final storage = FlutterSecureStorage();\nawait storage.write(key: 'access_token', value: token);\nfinal token = await storage.read(key: 'access_token');\nawait storage.deleteAll();</code></pre><h2>Dio Interceptor for Token Refresh</h2><pre><code class=\"language-dart\">class AuthInterceptor extends Interceptor {\n  @override\n  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {\n    final token = await storage.read(key: 'access_token');\n    if (token != null) options.headers['Authorization'] = 'Bearer $token';\n    handler.next(options);\n  }\n\n  @override\n  void onError(DioException err, ErrorInterceptorHandler handler) async {\n    if (err.response?.statusCode == 401) {\n      final newToken = await refreshToken();\n      if (newToken != null) {\n        err.requestOptions.headers['Authorization'] = 'Bearer $newToken';\n        final response = await dio.fetch(err.requestOptions);\n        return handler.resolve(response);\n      }\n    }\n    handler.next(err);\n  }\n}</code></pre>",
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-7.svg',
      tags: [
        { ar: 'أمان', en: 'Security' },
        { ar: 'Flutter', en: 'Flutter' },
        { ar: 'مصادقة', en: 'Authentication' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'نشر تطبيقات Flutter على Play Store و App Store',
        en: 'Publishing Flutter Apps to Play Store and App Store',
      },
      slug: 'publishing-flutter-apps-stores',
      excerpt: {
        ar: 'دليل النشر الكامل من التوقيع للمراجعة',
        en: 'Complete publishing guide from signing to review',
      },
      content: {
        ar: '<h2>Android - Google Play</h2><pre><code class="language-bash"># توقيع التطبيق\nkeytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000\n\n# بناء App Bundle\nflutter build appbundle --release</code></pre><h2>iOS - App Store</h2><pre><code class="language-bash"># بناء للـ iOS\nflutter build ios --release\n\n# فتح Xcode للتوقيع والرفع\nopen ios/Runner.xcworkspace</code></pre><h2>نصائح للمراجعة</h2><ul><li>تأكد من سياسة الخصوصية</li><li>لقطات شاشة واضحة ومعبرة</li><li>وصف دقيق للتطبيق</li><li>لا تذكر منصات منافسة</li></ul>',
        en: '<h2>Android - Google Play</h2><pre><code class="language-bash">keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000\nflutter build appbundle --release</code></pre><h2>iOS - App Store</h2><pre><code class="language-bash">flutter build ios --release\nopen ios/Runner.xcworkspace</code></pre><h2>Review Tips</h2><ul><li>Ensure privacy policy is in place</li><li>Clear and descriptive screenshots</li><li>Accurate app description</li><li>Don\'t mention competing platforms</li></ul>',
      },
      category: categories['mobile-development'],
      author: authorId,
      featuredImage: '/blog/blog-header-8.svg',
      tags: [
        { ar: 'نشر', en: 'Publishing' },
        { ar: 'Play Store', en: 'Play Store' },
        { ar: 'App Store', en: 'App Store' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بنية Middleware في Express.js',
        en: 'Express.js Middleware Architecture Guide',
      },
      slug: 'expressjs-middleware-architecture',
      excerpt: {
        ar: 'دليل عملي واحترافي عن بنية Middleware في Express.js من خبراء MWM',
        en: 'Professional practical guide on Express.js Middleware Architecture Guide from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول بنية Middleware في Express.js. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم بنية Middleware في Express.js أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان بنية Middleware في Express.js يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Express.js Middleware Architecture Guide. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Express.js Middleware Architecture Guide has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Express.js Middleware Architecture Guide opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-9.svg',
      tags: [
        { ar: 'Express.js', en: 'Express.js' },
        { ar: 'Middleware', en: 'Middleware' },
        { ar: 'Node.js', en: 'Node.js' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء SaaS متعدد المستأجرين بـ Node.js',
        en: 'Building a Multi-Tenant SaaS Backend with Node.js',
      },
      slug: 'multi-tenant-saas-nodejs',
      excerpt: {
        ar: 'دليل عملي واحترافي عن بناء SaaS متعدد المستأجرين بـ Node.js من خبراء MWM',
        en: 'Professional practical guide on Building a Multi-Tenant SaaS Backend with Node.js from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول بناء SaaS متعدد المستأجرين بـ Node.js. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم بناء SaaS متعدد المستأجرين بـ Node.js أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان بناء SaaS متعدد المستأجرين بـ Node.js يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Building a Multi-Tenant SaaS Backend with Node.js. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Building a Multi-Tenant SaaS Backend with Node.js has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Building a Multi-Tenant SaaS Backend with Node.js opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-10.svg',
      tags: [
        { ar: 'SaaS', en: 'SaaS' },
        { ar: 'Multi-tenant', en: 'Multi-tenant' },
        { ar: 'Node.js', en: 'Node.js' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'MongoDB Aggregation Pipeline: تقنيات متقدمة',
        en: 'MongoDB Aggregation Pipeline: Advanced Techniques',
      },
      slug: 'mongodb-aggregation-advanced',
      excerpt: {
        ar: 'دليل عملي واحترافي عن MongoDB Aggregation Pipeline: تقنيات متقدمة من خبراء MWM',
        en: 'Professional practical guide on MongoDB Aggregation Pipeline: Advanced Techniques from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول MongoDB Aggregation Pipeline: تقنيات متقدمة. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم MongoDB Aggregation Pipeline: تقنيات متقدمة أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان MongoDB Aggregation Pipeline: تقنيات متقدمة يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with MongoDB Aggregation Pipeline: Advanced Techniques. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding MongoDB Aggregation Pipeline: Advanced Techniques has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering MongoDB Aggregation Pipeline: Advanced Techniques opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-1.svg',
      tags: [
        { ar: 'MongoDB', en: 'MongoDB' },
        { ar: 'Aggregation', en: 'Aggregation' },
        { ar: 'Database', en: 'Database' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 66 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'استراتيجيات التخزين المؤقت مع Redis',
        en: 'Redis Caching Strategies for High-Performance APIs',
      },
      slug: 'redis-caching-strategies',
      excerpt: {
        ar: 'دليل عملي واحترافي عن استراتيجيات التخزين المؤقت مع Redis من خبراء MWM',
        en: 'Professional practical guide on Redis Caching Strategies for High-Performance APIs from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول استراتيجيات التخزين المؤقت مع Redis. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم استراتيجيات التخزين المؤقت مع Redis أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان استراتيجيات التخزين المؤقت مع Redis يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Redis Caching Strategies for High-Performance APIs. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Redis Caching Strategies for High-Performance APIs has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Redis Caching Strategies for High-Performance APIs opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-2.svg',
      tags: [
        { ar: 'Redis', en: 'Redis' },
        { ar: 'Caching', en: 'Caching' },
        { ar: 'Performance', en: 'Performance' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'نظام طوابير المهام مع BullMQ',
        en: 'Building a Job Queue System with BullMQ and Redis',
      },
      slug: 'bullmq-job-queue-system',
      excerpt: {
        ar: 'دليل عملي واحترافي عن نظام طوابير المهام مع BullMQ من خبراء MWM',
        en: 'Professional practical guide on Building a Job Queue System with BullMQ and Redis from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول نظام طوابير المهام مع BullMQ. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم نظام طوابير المهام مع BullMQ أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان نظام طوابير المهام مع BullMQ يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Building a Job Queue System with BullMQ and Redis. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Building a Job Queue System with BullMQ and Redis has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Building a Job Queue System with BullMQ and Redis opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-3.svg',
      tags: [
        { ar: 'BullMQ', en: 'BullMQ' },
        { ar: 'Queue', en: 'Queue' },
        { ar: 'Redis', en: 'Redis' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'Rate Limiting وأمان الـ API',
        en: 'API Rate Limiting and Security Best Practices',
      },
      slug: 'api-rate-limiting-security',
      excerpt: {
        ar: 'دليل عملي واحترافي عن Rate Limiting وأمان الـ API من خبراء MWM',
        en: 'Professional practical guide on API Rate Limiting and Security Best Practices from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول Rate Limiting وأمان الـ API. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم Rate Limiting وأمان الـ API أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان Rate Limiting وأمان الـ API يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with API Rate Limiting and Security Best Practices. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding API Rate Limiting and Security Best Practices has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering API Rate Limiting and Security Best Practices opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-4.svg',
      tags: [
        { ar: 'Rate Limiting', en: 'Rate Limiting' },
        { ar: 'Security', en: 'Security' },
        { ar: 'API', en: 'API' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تصميم قواعد البيانات: علائقية vs وثائقية',
        en: 'Database Schema Design: Relational vs Document',
      },
      slug: 'database-schema-design-patterns',
      excerpt: {
        ar: 'دليل عملي واحترافي عن تصميم قواعد البيانات: علائقية vs وثائقية من خبراء MWM',
        en: 'Professional practical guide on Database Schema Design: Relational vs Document from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول تصميم قواعد البيانات: علائقية vs وثائقية. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم تصميم قواعد البيانات: علائقية vs وثائقية أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان تصميم قواعد البيانات: علائقية vs وثائقية يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Database Schema Design: Relational vs Document. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Database Schema Design: Relational vs Document has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Database Schema Design: Relational vs Document opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-5.svg',
      tags: [
        { ar: 'Schema Design', en: 'Schema Design' },
        { ar: 'Database', en: 'Database' },
        { ar: 'Architecture', en: 'Architecture' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تطوير API بـ Laravel من الصفر للإنتاج',
        en: 'Laravel API Development: From Zero to Production',
      },
      slug: 'laravel-api-development',
      excerpt: {
        ar: 'دليل عملي واحترافي عن تطوير API بـ Laravel من الصفر للإنتاج من خبراء MWM',
        en: 'Professional practical guide on Laravel API Development: From Zero to Production from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول تطوير API بـ Laravel من الصفر للإنتاج. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم تطوير API بـ Laravel من الصفر للإنتاج أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان تطوير API بـ Laravel من الصفر للإنتاج يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Laravel API Development: From Zero to Production. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Laravel API Development: From Zero to Production has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Laravel API Development: From Zero to Production opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['backend'],
      author: authorId,
      featuredImage: '/blog/blog-header-6.svg',
      tags: [
        { ar: 'Laravel', en: 'Laravel' },
        { ar: 'PHP', en: 'PHP' },
        { ar: 'API', en: 'API' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 86 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'Docker Compose للتطوير Full-Stack',
        en: 'Docker Compose for Full-Stack Development',
      },
      slug: 'docker-compose-fullstack',
      excerpt: {
        ar: 'دليل عملي واحترافي عن Docker Compose للتطوير Full-Stack من خبراء MWM',
        en: 'Professional practical guide on Docker Compose for Full-Stack Development from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول Docker Compose للتطوير Full-Stack. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم Docker Compose للتطوير Full-Stack أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان Docker Compose للتطوير Full-Stack يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Docker Compose for Full-Stack Development. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Docker Compose for Full-Stack Development has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Docker Compose for Full-Stack Development opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['devops'],
      author: authorId,
      featuredImage: '/blog/blog-header-7.svg',
      tags: [
        { ar: 'Docker', en: 'Docker' },
        { ar: 'DevOps', en: 'DevOps' },
        { ar: 'Containers', en: 'Containers' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'CI/CD مع GitHub Actions لـ Node.js',
        en: 'CI/CD Pipeline with GitHub Actions for Node.js',
      },
      slug: 'github-actions-cicd-nodejs',
      excerpt: {
        ar: 'دليل عملي واحترافي عن CI/CD مع GitHub Actions لـ Node.js من خبراء MWM',
        en: 'Professional practical guide on CI/CD Pipeline with GitHub Actions for Node.js from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول CI/CD مع GitHub Actions لـ Node.js. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم CI/CD مع GitHub Actions لـ Node.js أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان CI/CD مع GitHub Actions لـ Node.js يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with CI/CD Pipeline with GitHub Actions for Node.js. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding CI/CD Pipeline with GitHub Actions for Node.js has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering CI/CD Pipeline with GitHub Actions for Node.js opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['devops'],
      author: authorId,
      featuredImage: '/blog/blog-header-8.svg',
      tags: [
        { ar: 'GitHub Actions', en: 'GitHub Actions' },
        { ar: 'CI/CD', en: 'CI/CD' },
        { ar: 'DevOps', en: 'DevOps' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 94 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'نشر تطبيقات Next.js مع PM2 و Nginx',
        en: 'Deploying Next.js Apps with PM2 and Nginx',
      },
      slug: 'deploying-nextjs-pm2-nginx',
      excerpt: {
        ar: 'دليل عملي واحترافي عن نشر تطبيقات Next.js مع PM2 و Nginx من خبراء MWM',
        en: 'Professional practical guide on Deploying Next.js Apps with PM2 and Nginx from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول نشر تطبيقات Next.js مع PM2 و Nginx. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم نشر تطبيقات Next.js مع PM2 و Nginx أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان نشر تطبيقات Next.js مع PM2 و Nginx يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Deploying Next.js Apps with PM2 and Nginx. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Deploying Next.js Apps with PM2 and Nginx has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Deploying Next.js Apps with PM2 and Nginx opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['devops'],
      author: authorId,
      featuredImage: '/blog/blog-header-9.svg',
      tags: [
        { ar: 'PM2', en: 'PM2' },
        { ar: 'Nginx', en: 'Nginx' },
        { ar: 'Deployment', en: 'Deployment' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'MongoDB Replication و Sharding',
        en: 'MongoDB Replication and Sharding in Production',
      },
      slug: 'mongodb-replication-sharding',
      excerpt: {
        ar: 'دليل عملي واحترافي عن MongoDB Replication و Sharding من خبراء MWM',
        en: 'Professional practical guide on MongoDB Replication and Sharding in Production from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول MongoDB Replication و Sharding. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم MongoDB Replication و Sharding أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان MongoDB Replication و Sharding يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with MongoDB Replication and Sharding in Production. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding MongoDB Replication and Sharding in Production has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering MongoDB Replication and Sharding in Production opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['devops'],
      author: authorId,
      featuredImage: '/blog/blog-header-10.svg',
      tags: [
        { ar: 'MongoDB', en: 'MongoDB' },
        { ar: 'Replication', en: 'Replication' },
        { ar: 'Sharding', en: 'Sharding' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 102 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'مراقبة تطبيقات Node.js في الإنتاج',
        en: 'Monitoring Node.js Applications in Production',
      },
      slug: 'monitoring-nodejs-production',
      excerpt: {
        ar: 'دليل عملي واحترافي عن مراقبة تطبيقات Node.js في الإنتاج من خبراء MWM',
        en: 'Professional practical guide on Monitoring Node.js Applications in Production from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول مراقبة تطبيقات Node.js في الإنتاج. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم مراقبة تطبيقات Node.js في الإنتاج أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان مراقبة تطبيقات Node.js في الإنتاج يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Monitoring Node.js Applications in Production. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Monitoring Node.js Applications in Production has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Monitoring Node.js Applications in Production opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['devops'],
      author: authorId,
      featuredImage: '/blog/blog-header-1.svg',
      tags: [
        { ar: 'Monitoring', en: 'Monitoring' },
        { ar: 'Logging', en: 'Logging' },
        { ar: 'Production', en: 'Production' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 106 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'OWASP Top 10: دليل عملي',
        en: 'Web Application Security: OWASP Top 10 in Practice',
      },
      slug: 'owasp-top-10-practical',
      excerpt: {
        ar: 'دليل عملي واحترافي عن OWASP Top 10: دليل عملي من خبراء MWM',
        en: 'Professional practical guide on Web Application Security: OWASP Top 10 in Practice from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول OWASP Top 10: دليل عملي. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم OWASP Top 10: دليل عملي أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان OWASP Top 10: دليل عملي يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Web Application Security: OWASP Top 10 in Practice. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Web Application Security: OWASP Top 10 in Practice has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Web Application Security: OWASP Top 10 in Practice opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-2.svg',
      tags: [
        { ar: 'OWASP', en: 'OWASP' },
        { ar: 'Security', en: 'Security' },
        { ar: 'XSS', en: 'XSS' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'نظام صلاحيات RBAC: دليل التنفيذ',
        en: 'Implementing Role-Based Access Control (RBAC)',
      },
      slug: 'rbac-implementation-guide',
      excerpt: {
        ar: 'دليل عملي واحترافي عن نظام صلاحيات RBAC: دليل التنفيذ من خبراء MWM',
        en: 'Professional practical guide on Implementing Role-Based Access Control (RBAC) from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول نظام صلاحيات RBAC: دليل التنفيذ. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم نظام صلاحيات RBAC: دليل التنفيذ أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان نظام صلاحيات RBAC: دليل التنفيذ يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Implementing Role-Based Access Control (RBAC). From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Implementing Role-Based Access Control (RBAC) has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Implementing Role-Based Access Control (RBAC) opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-3.svg',
      tags: [
        { ar: 'RBAC', en: 'RBAC' },
        { ar: 'Authorization', en: 'Authorization' },
        { ar: 'Security', en: 'Security' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 114 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'تأمين رفع الملفات في Node.js',
        en: 'Securing File Uploads in Node.js Applications',
      },
      slug: 'secure-file-uploads-nodejs',
      excerpt: {
        ar: 'دليل عملي واحترافي عن تأمين رفع الملفات في Node.js من خبراء MWM',
        en: 'Professional practical guide on Securing File Uploads in Node.js Applications from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول تأمين رفع الملفات في Node.js. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم تأمين رفع الملفات في Node.js أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان تأمين رفع الملفات في Node.js يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Securing File Uploads in Node.js Applications. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Securing File Uploads in Node.js Applications has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Securing File Uploads in Node.js Applications opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-4.svg',
      tags: [
        { ar: 'File Upload', en: 'File Upload' },
        { ar: 'Security', en: 'Security' },
        { ar: 'Cloudinary', en: 'Cloudinary' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 118 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'استراتيجيات مصادقة API: مقارنة شاملة',
        en: 'API Authentication Strategies: Sessions vs JWT vs OAuth',
      },
      slug: 'api-auth-strategies-comparison',
      excerpt: {
        ar: 'دليل عملي واحترافي عن استراتيجيات مصادقة API: مقارنة شاملة من خبراء MWM',
        en: 'Professional practical guide on API Authentication Strategies: Sessions vs JWT vs OAuth from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول استراتيجيات مصادقة API: مقارنة شاملة. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم استراتيجيات مصادقة API: مقارنة شاملة أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان استراتيجيات مصادقة API: مقارنة شاملة يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with API Authentication Strategies: Sessions vs JWT vs OAuth. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding API Authentication Strategies: Sessions vs JWT vs OAuth has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering API Authentication Strategies: Sessions vs JWT vs OAuth opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-5.svg',
      tags: [
        { ar: 'JWT', en: 'JWT' },
        { ar: 'OAuth', en: 'OAuth' },
        { ar: 'Sessions', en: 'Sessions' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 122 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء Design System مع Tailwind و React',
        en: 'Building a Design System with Tailwind CSS and React',
      },
      slug: 'design-system-tailwind-react',
      excerpt: {
        ar: 'دليل عملي واحترافي عن بناء Design System مع Tailwind و React من خبراء MWM',
        en: 'Professional practical guide on Building a Design System with Tailwind CSS and React from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول بناء Design System مع Tailwind و React. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم بناء Design System مع Tailwind و React أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان بناء Design System مع Tailwind و React يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Building a Design System with Tailwind CSS and React. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Building a Design System with Tailwind CSS and React has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Building a Design System with Tailwind CSS and React opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['design'],
      author: authorId,
      featuredImage: '/blog/blog-header-6.svg',
      tags: [
        { ar: 'Design System', en: 'Design System' },
        { ar: 'Tailwind', en: 'Tailwind' },
        { ar: 'React', en: 'React' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 126 * 24 * 60 * 60 * 1000),
    },
    {
      title: { ar: 'دليل تنفيذ الوضع الداكن', en: 'Dark Mode Implementation Guide for Web Apps' },
      slug: 'dark-mode-implementation-guide',
      excerpt: {
        ar: 'دليل عملي واحترافي عن دليل تنفيذ الوضع الداكن من خبراء MWM',
        en: 'Professional practical guide on Dark Mode Implementation Guide for Web Apps from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول دليل تنفيذ الوضع الداكن. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم دليل تنفيذ الوضع الداكن أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان دليل تنفيذ الوضع الداكن يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Dark Mode Implementation Guide for Web Apps. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Dark Mode Implementation Guide for Web Apps has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Dark Mode Implementation Guide for Web Apps opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['design'],
      author: authorId,
      featuredImage: '/blog/blog-header-7.svg',
      tags: [
        { ar: 'Dark Mode', en: 'Dark Mode' },
        { ar: 'Themes', en: 'Themes' },
        { ar: 'CSS', en: 'CSS' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'أنماط تصميم Dashboards متجاوبة',
        en: 'Responsive Design Patterns for Complex Dashboards',
      },
      slug: 'responsive-dashboard-patterns',
      excerpt: {
        ar: 'دليل عملي واحترافي عن أنماط تصميم Dashboards متجاوبة من خبراء MWM',
        en: 'Professional practical guide on Responsive Design Patterns for Complex Dashboards from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول أنماط تصميم Dashboards متجاوبة. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم أنماط تصميم Dashboards متجاوبة أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان أنماط تصميم Dashboards متجاوبة يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Responsive Design Patterns for Complex Dashboards. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Responsive Design Patterns for Complex Dashboards has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Responsive Design Patterns for Complex Dashboards opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['design'],
      author: authorId,
      featuredImage: '/blog/blog-header-8.svg',
      tags: [
        { ar: 'Dashboard', en: 'Dashboard' },
        { ar: 'Responsive', en: 'Responsive' },
        { ar: 'Layout', en: 'Layout' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 134 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'دمج الذكاء الاصطناعي في تطبيقات الويب',
        en: 'Integrating AI Features into Your Web Application',
      },
      slug: 'integrating-ai-web-apps',
      excerpt: {
        ar: 'دليل عملي واحترافي عن دمج الذكاء الاصطناعي في تطبيقات الويب من خبراء MWM',
        en: 'Professional practical guide on Integrating AI Features into Your Web Application from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول دمج الذكاء الاصطناعي في تطبيقات الويب. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم دمج الذكاء الاصطناعي في تطبيقات الويب أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان دمج الذكاء الاصطناعي في تطبيقات الويب يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Integrating AI Features into Your Web Application. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Integrating AI Features into Your Web Application has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Integrating AI Features into Your Web Application opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['ai-ml'],
      author: authorId,
      featuredImage: '/blog/blog-header-9.svg',
      tags: [
        { ar: 'AI', en: 'AI' },
        { ar: 'OpenAI', en: 'OpenAI' },
        { ar: 'ChatGPT', en: 'ChatGPT' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 138 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء بحث ذكي مع Elasticsearch',
        en: 'Building Smart Search with Elasticsearch and Node.js',
      },
      slug: 'smart-search-elasticsearch',
      excerpt: {
        ar: 'دليل عملي واحترافي عن بناء بحث ذكي مع Elasticsearch من خبراء MWM',
        en: 'Professional practical guide on Building Smart Search with Elasticsearch and Node.js from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول بناء بحث ذكي مع Elasticsearch. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم بناء بحث ذكي مع Elasticsearch أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان بناء بحث ذكي مع Elasticsearch يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Building Smart Search with Elasticsearch and Node.js. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Building Smart Search with Elasticsearch and Node.js has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Building Smart Search with Elasticsearch and Node.js opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['ai-ml'],
      author: authorId,
      featuredImage: '/blog/blog-header-10.svg',
      tags: [
        { ar: 'Elasticsearch', en: 'Elasticsearch' },
        { ar: 'Search', en: 'Search' },
        { ar: 'Full-text', en: 'Full-text' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'Web Scraping على نطاق واسع',
        en: 'Web Scraping at Scale: Puppeteer + BullMQ Architecture',
      },
      slug: 'web-scraping-at-scale',
      excerpt: {
        ar: 'دليل عملي واحترافي عن Web Scraping على نطاق واسع من خبراء MWM',
        en: 'Professional practical guide on Web Scraping at Scale: Puppeteer + BullMQ Architecture from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول Web Scraping على نطاق واسع. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم Web Scraping على نطاق واسع أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان Web Scraping على نطاق واسع يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Web Scraping at Scale: Puppeteer + BullMQ Architecture. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Web Scraping at Scale: Puppeteer + BullMQ Architecture has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Web Scraping at Scale: Puppeteer + BullMQ Architecture opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['technology'],
      author: authorId,
      featuredImage: '/blog/blog-header-1.svg',
      tags: [
        { ar: 'Scraping', en: 'Scraping' },
        { ar: 'Puppeteer', en: 'Puppeteer' },
        { ar: 'Automation', en: 'Automation' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 146 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'أتمتة البريد الإلكتروني مع Node.js',
        en: 'Building Email Automation Systems with Node.js',
      },
      slug: 'email-automation-nodejs',
      excerpt: {
        ar: 'دليل عملي واحترافي عن أتمتة البريد الإلكتروني مع Node.js من خبراء MWM',
        en: 'Professional practical guide on Building Email Automation Systems with Node.js from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول أتمتة البريد الإلكتروني مع Node.js. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم أتمتة البريد الإلكتروني مع Node.js أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان أتمتة البريد الإلكتروني مع Node.js يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Building Email Automation Systems with Node.js. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Building Email Automation Systems with Node.js has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Building Email Automation Systems with Node.js opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['technology'],
      author: authorId,
      featuredImage: '/blog/blog-header-2.svg',
      tags: [
        { ar: 'Email', en: 'Email' },
        { ar: 'Automation', en: 'Automation' },
        { ar: 'Nodemailer', en: 'Nodemailer' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'كيف بنينا منصة نقل ركاب من الصفر',
        en: 'How We Built a Ride-Hailing Platform from Scratch',
      },
      slug: 'case-study-wasalni-ride-hailing',
      excerpt: {
        ar: 'دليل عملي واحترافي عن كيف بنينا منصة نقل ركاب من الصفر من خبراء MWM',
        en: 'Professional practical guide on How We Built a Ride-Hailing Platform from Scratch from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول كيف بنينا منصة نقل ركاب من الصفر. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم كيف بنينا منصة نقل ركاب من الصفر أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان كيف بنينا منصة نقل ركاب من الصفر يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with How We Built a Ride-Hailing Platform from Scratch. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding How We Built a Ride-Hailing Platform from Scratch has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering How We Built a Ride-Hailing Platform from Scratch opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['case-studies'],
      author: authorId,
      featuredImage: '/blog/blog-header-3.svg',
      tags: [
        { ar: 'Case Study', en: 'Case Study' },
        { ar: 'Wasalni', en: 'Wasalni' },
        { ar: 'Real-time', en: 'Real-time' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 154 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء منصة رياضات إلكترونية بـ 25 وحدة',
        en: 'Creating an Esports Platform with 25 API Modules',
      },
      slug: 'case-study-escore-esports',
      excerpt: {
        ar: 'دليل عملي واحترافي عن بناء منصة رياضات إلكترونية بـ 25 وحدة من خبراء MWM',
        en: 'Professional practical guide on Creating an Esports Platform with 25 API Modules from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول بناء منصة رياضات إلكترونية بـ 25 وحدة. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم بناء منصة رياضات إلكترونية بـ 25 وحدة أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان بناء منصة رياضات إلكترونية بـ 25 وحدة يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Creating an Esports Platform with 25 API Modules. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Creating an Esports Platform with 25 API Modules has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Creating an Esports Platform with 25 API Modules opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['case-studies'],
      author: authorId,
      featuredImage: '/blog/blog-header-4.svg',
      tags: [
        { ar: 'Case Study', en: 'Case Study' },
        { ar: 'Esports', en: 'Esports' },
        { ar: 'E-Score', en: 'E-Score' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 158 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'منصة مقارنة الأسعار: تفاصيل تقنية',
        en: 'Price Comparison Platform: Technical Deep Dive',
      },
      slug: 'case-study-price-hunter',
      excerpt: {
        ar: 'دليل عملي واحترافي عن منصة مقارنة الأسعار: تفاصيل تقنية من خبراء MWM',
        en: 'Professional practical guide on Price Comparison Platform: Technical Deep Dive from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول منصة مقارنة الأسعار: تفاصيل تقنية. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم منصة مقارنة الأسعار: تفاصيل تقنية أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان منصة مقارنة الأسعار: تفاصيل تقنية يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Price Comparison Platform: Technical Deep Dive. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Price Comparison Platform: Technical Deep Dive has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Price Comparison Platform: Technical Deep Dive opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['case-studies'],
      author: authorId,
      featuredImage: '/blog/blog-header-5.svg',
      tags: [
        { ar: 'Case Study', en: 'Case Study' },
        { ar: 'Price Hunter', en: 'Price Hunter' },
        { ar: 'Scraping', en: 'Scraping' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 162 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'العمل الحر كمطور في العالم العربي',
        en: 'Freelancing as a Developer in the Arab World: Complete Guide',
      },
      slug: 'freelancing-arab-developer-guide',
      excerpt: {
        ar: 'دليل عملي واحترافي عن العمل الحر كمطور في العالم العربي من خبراء MWM',
        en: 'Professional practical guide on Freelancing as a Developer in the Arab World: Complete Guide from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول العمل الحر كمطور في العالم العربي. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم العمل الحر كمطور في العالم العربي أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان العمل الحر كمطور في العالم العربي يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Freelancing as a Developer in the Arab World: Complete Guide. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Freelancing as a Developer in the Arab World: Complete Guide has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Freelancing as a Developer in the Arab World: Complete Guide opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['career'],
      author: authorId,
      featuredImage: '/blog/blog-header-6.svg',
      tags: [
        { ar: 'Freelancing', en: 'Freelancing' },
        { ar: 'Career', en: 'Career' },
        { ar: 'Khamsat', en: 'Khamsat' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 166 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'بناء بورتفوليو مطور محترف',
        en: 'Building Your Developer Portfolio: Tips That Actually Work',
      },
      slug: 'building-developer-portfolio',
      excerpt: {
        ar: 'دليل عملي واحترافي عن بناء بورتفوليو مطور محترف من خبراء MWM',
        en: 'Professional practical guide on Building Your Developer Portfolio: Tips That Actually Work from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول بناء بورتفوليو مطور محترف. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم بناء بورتفوليو مطور محترف أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان بناء بورتفوليو مطور محترف يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Building Your Developer Portfolio: Tips That Actually Work. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Building Your Developer Portfolio: Tips That Actually Work has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Building Your Developer Portfolio: Tips That Actually Work opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['career'],
      author: authorId,
      featuredImage: '/blog/blog-header-7.svg',
      tags: [
        { ar: 'Portfolio', en: 'Portfolio' },
        { ar: 'Career', en: 'Career' },
        { ar: 'GitHub', en: 'GitHub' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'أفضل ممارسات الحركة مع Framer Motion',
        en: 'Animation Best Practices with Framer Motion',
      },
      slug: 'framer-motion-animations-react',
      excerpt: {
        ar: 'دليل عملي واحترافي عن أفضل ممارسات الحركة مع Framer Motion من خبراء MWM',
        en: 'Professional practical guide on Animation Best Practices with Framer Motion from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول أفضل ممارسات الحركة مع Framer Motion. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم أفضل ممارسات الحركة مع Framer Motion أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان أفضل ممارسات الحركة مع Framer Motion يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Animation Best Practices with Framer Motion. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Animation Best Practices with Framer Motion has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Animation Best Practices with Framer Motion opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['design'],
      author: authorId,
      featuredImage: '/blog/blog-header-8.svg',
      tags: [
        { ar: 'Framer Motion', en: 'Framer Motion' },
        { ar: 'Animation', en: 'Animation' },
        { ar: 'React', en: 'React' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 174 * 24 * 60 * 60 * 1000),
    },
    {
      title: {
        ar: 'التحقق من المدخلات وتنظيفها',
        en: 'Input Validation and Sanitization Best Practices',
      },
      slug: 'input-validation-sanitization',
      excerpt: {
        ar: 'دليل عملي واحترافي عن التحقق من المدخلات وتنظيفها من خبراء MWM',
        en: 'Professional practical guide on Input Validation and Sanitization Best Practices from MWM experts',
      },
      content: {
        ar: '<h2>مقدمة</h2><p>في هذا المقال نشارك خبرتنا في MWM حول التحقق من المدخلات وتنظيفها. من واقع تجربتنا في بناء أكثر من 33 مشروع.</p><h2>لماذا هذا مهم؟</h2><p>في عالم تطوير البرمجيات سريع التطور، فهم التحقق من المدخلات وتنظيفها أصبح ضرورة لكل مطور. نستخدم هذه التقنيات يومياً في مشاريعنا الإنتاجية.</p><h2>التطبيق العملي</h2><p>طبقنا هذه المبادئ في مشاريع حقيقية مثل Bagour Delivery و Wasalni و E-Score. النتائج كانت ممتازة من حيث الأداء وقابلية الصيانة.</p><h2>نصائح من خبرتنا</h2><ul><li>ابدأ بالتخطيط الجيد قبل الكود</li><li>استخدم TypeScript دائماً</li><li>اكتب اختبارات منذ البداية</li><li>وثّق الكود المهم</li></ul><h2>خلاصة</h2><p>إتقان التحقق من المدخلات وتنظيفها يفتح أبواباً كثيرة في مسيرتك المهنية. في MWM نقدم استشارات وخدمات تطوير في هذا المجال. تواصل معنا لمناقشة مشروعك.</p>',
        en: '<h2>Introduction</h2><p>In this article, we share our MWM experience with Input Validation and Sanitization Best Practices. From our experience building 33+ projects.</p><h2>Why This Matters</h2><p>In the fast-evolving world of software development, understanding Input Validation and Sanitization Best Practices has become essential for every developer. We use these techniques daily in our production projects.</p><h2>Practical Application</h2><p>We applied these principles in real projects like Bagour Delivery, Wasalni, and E-Score. The results were excellent in terms of performance and maintainability.</p><h2>Tips from Our Experience</h2><ul><li>Start with good planning before coding</li><li>Always use TypeScript</li><li>Write tests from the beginning</li><li>Document important code</li></ul><h2>Conclusion</h2><p>Mastering Input Validation and Sanitization Best Practices opens many doors in your career. At MWM, we offer consulting and development services in this area. Contact us to discuss your project.</p>',
      },
      category: categories['security'],
      author: authorId,
      featuredImage: '/blog/blog-header-9.svg',
      tags: [
        { ar: 'Validation', en: 'Validation' },
        { ar: 'Joi', en: 'Joi' },
        { ar: 'Zod', en: 'Zod' },
      ],
      status: 'published' as const,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 178 * 24 * 60 * 60 * 1000),
    },
  ];
}
