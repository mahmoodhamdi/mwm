#!/usr/bin/env node

/**
 * MWM Placeholder SVG Generator
 * Generates professional SVG placeholder images for portfolio projects and blog headers.
 *
 * Usage: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// ─── Constants ───────────────────────────────────────────────────────────────

const PORTFOLIO_DIR = path.join(__dirname, '../public/portfolio');
const BLOG_DIR = path.join(__dirname, '../public/blog');

// MWM brand palette
const COLORS = {
  sky: '#0ea5e9',
  skyLight: '#38bdf8',
  skyDark: '#0284c7',
  purple: '#8b5cf6',
  purpleLight: '#a78bfa',
  purpleDark: '#7c3aed',
  orange: '#f97316',
  orangeLight: '#fb923c',
  orangeDark: '#ea580c',
  green: '#22c55e',
  greenLight: '#4ade80',
  pink: '#ec4899',
  pinkLight: '#f472b6',
  teal: '#14b8a6',
  tealLight: '#2dd4bf',
  bgDark: '#0f172a',
  bgMid: '#1e293b',
  bgLight: '#334155',
  textLight: '#f1f5f9',
  textMid: '#94a3b8',
  textDim: '#475569',
  border: '#334155',
};

// ─── Project metadata ─────────────────────────────────────────────────────────

const PROJECTS = {
  artneer: {
    label: 'Artneer',
    subtitle: 'Construction Data Scraper',
    icon: 'scraper',
    accent: [COLORS.orange, COLORS.orangeDark],
    tags: ['Python', 'BeautifulSoup', 'CLI'],
  },
  'bagour-delivery': {
    label: 'Bagour Delivery',
    subtitle: 'Food Delivery Platform',
    icon: 'delivery',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Node.js', 'Next.js', 'Flutter'],
  },
  'bulk-email-sender': {
    label: 'Bulk Email Sender',
    subtitle: 'Mass Email Campaign Tool',
    icon: 'email',
    accent: [COLORS.purple, COLORS.purpleDark],
    tags: ['Next.js', 'SMTP', 'React'],
  },
  'clinic-booking-system': {
    label: 'Clinic Booking System',
    subtitle: 'Doctor Appointment Booking',
    icon: 'clinic',
    accent: [COLORS.green, '#16a34a'],
    tags: ['Laravel', 'Next.js', 'PostgreSQL'],
  },
  'csv-excel-converter': {
    label: 'CSV / Excel Converter',
    subtitle: 'Multi-Format File Conversion',
    icon: 'file',
    accent: [COLORS.teal, '#0d9488'],
    tags: ['Next.js', 'Vitest', 'Playwright'],
  },
  dare: {
    label: 'Dare',
    subtitle: 'Arabic/English E-Commerce',
    icon: 'shop',
    accent: [COLORS.pink, '#db2777'],
    tags: ['Laravel', 'Filament', 'Livewire'],
  },
  'downloader-api': {
    label: 'Downloader API',
    subtitle: 'Media Download Service',
    icon: 'download',
    accent: [COLORS.orange, COLORS.orangeDark],
    tags: ['Python', 'Flask', 'REST API'],
  },
  'ebn-kathier': {
    label: 'Ebn Kathier',
    subtitle: 'Quran Academy Management',
    icon: 'quran',
    accent: [COLORS.green, '#15803d'],
    tags: ['Next.js', 'PostgreSQL', 'NextAuth'],
  },
  'email-validator': {
    label: 'Email Validator',
    subtitle: '13-Step Validation Pipeline',
    icon: 'validate',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Next.js', 'Zustand', 'SMTP'],
  },
  'escore-backend': {
    label: 'eScore Backend',
    subtitle: 'E-Sports Platform API',
    icon: 'gaming',
    accent: [COLORS.purple, COLORS.purpleDark],
    tags: ['Node.js', 'MongoDB', 'Redis'],
  },
  'escore-frontend': {
    label: 'eScore Frontend',
    subtitle: 'E-Sports Admin Dashboard',
    icon: 'dashboard',
    accent: [COLORS.purple, '#6d28d9'],
    tags: ['Next.js', 'Tailwind 4', 'React 19'],
  },
  'esports-flask': {
    label: 'Esports Flask API',
    subtitle: 'Esports World Cup API',
    icon: 'trophy',
    accent: [COLORS.orange, COLORS.orangeDark],
    tags: ['Python', 'Flask', 'SQLite'],
  },
  'khamsat-portfolio': {
    label: 'Khamsat Portfolio',
    subtitle: 'Freelance Services Showcase',
    icon: 'portfolio',
    accent: [COLORS.teal, '#0f766e'],
    tags: ['HTML', 'CSS', 'Templates'],
  },
  'lg-branchs': {
    label: 'LG Branch Finder',
    subtitle: 'Egypt Branch Locator',
    icon: 'map',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Vanilla JS', 'Python', 'GitHub Pages'],
  },
  'localhost-tunnel': {
    label: 'Localhost Tunnel',
    subtitle: 'Local Development Tunneling',
    icon: 'tunnel',
    accent: [COLORS.bgLight, COLORS.textDim],
    tags: ['Node.js', 'Networking', 'CLI'],
  },
  'markdown-to-pdf': {
    label: 'Markdown to PDF',
    subtitle: 'Document Conversion Tool',
    icon: 'pdf',
    accent: [COLORS.pink, '#be185d'],
    tags: ['Next.js', 'React', 'PDF'],
  },
  'mwm-corporate': {
    label: 'MWM Corporate',
    subtitle: 'Bilingual Corporate CMS',
    icon: 'mwm',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Next.js', 'Node.js', 'MongoDB'],
  },
  'price-hunter': {
    label: 'Price Hunter',
    subtitle: 'Price Comparison Engine',
    icon: 'price',
    accent: [COLORS.green, '#15803d'],
    tags: ['Next.js', 'Prisma', 'BullMQ'],
  },
  sabry: {
    label: 'Sabry Platform',
    subtitle: 'Multi-Service Platform',
    icon: 'platform',
    accent: [COLORS.purple, COLORS.purpleDark],
    tags: ['Node.js', 'Next.js', 'TypeScript'],
  },
  sana3y: {
    label: 'Sana3y',
    subtitle: 'Craftsmen Booking Platform',
    icon: 'tools',
    accent: [COLORS.orange, COLORS.orangeDark],
    tags: ['Node.js', 'Next.js', 'Flutter'],
  },
  'saudi-host': {
    label: 'Saudi Host',
    subtitle: 'Tourist Guide Matching',
    icon: 'guide',
    accent: [COLORS.green, '#166534'],
    tags: ['Node.js', 'Next.js', 'Flutter'],
  },
  'screenshot-api': {
    label: 'Screenshot API',
    subtitle: 'Screenshot Generation Service',
    icon: 'screenshot',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Node.js', 'Puppeteer', 'REST'],
  },
  'smartstand-egypt': {
    label: 'SmartStand Egypt',
    subtitle: 'Marketing Website',
    icon: 'marketing',
    accent: [COLORS.purple, COLORS.purpleDark],
    tags: ['Next.js', 'Tailwind 4', 'React 19'],
  },
  'sounds-api': {
    label: 'Sounds API',
    subtitle: 'Language Learning API',
    icon: 'audio',
    accent: [COLORS.teal, '#0f766e'],
    tags: ['Python', 'Flask', 'PostgreSQL'],
  },
  'tutoring-system': {
    label: 'Tutoring System',
    subtitle: 'Online Tutoring Platform',
    icon: 'education',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Next.js', 'Node.js', 'WebRTC'],
  },
  'url-shortener': {
    label: 'URL Shortener',
    subtitle: 'Link Shortening Service',
    icon: 'link',
    accent: [COLORS.purple, COLORS.purpleDark],
    tags: ['Next.js', 'Redis', 'React'],
  },
  wasalni: {
    label: 'Wasalni',
    subtitle: 'Ride-Hailing Platform',
    icon: 'ride',
    accent: [COLORS.sky, COLORS.skyDark],
    tags: ['Node.js', 'Next.js', 'Flutter'],
  },
  'whatsapp-sheets-bot': {
    label: 'WhatsApp Sheets Bot',
    subtitle: 'WhatsApp + Google Sheets',
    icon: 'whatsapp',
    accent: [COLORS.green, '#15803d'],
    tags: ['Node.js', 'WhatsApp API', 'Sheets'],
  },
};

// ─── SVG Helper fragments ─────────────────────────────────────────────────────

function bgBase(accentA, accentB) {
  return `
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.bgDark}"/>
      <stop offset="60%" stop-color="${COLORS.bgMid}"/>
      <stop offset="100%" stop-color="${COLORS.bgDark}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentA}"/>
      <stop offset="100%" stop-color="${accentB}"/>
    </linearGradient>
    <linearGradient id="accentH" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentA}"/>
      <stop offset="100%" stop-color="${accentB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentA}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${accentA}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur4">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <filter id="blur2">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="600" cy="315" rx="500" ry="300" fill="url(#glow)"/>`;
}

function gridLines() {
  const v = Array.from(
    { length: 20 },
    (_, i) =>
      `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="630" stroke="white" stroke-width="1"/>`
  ).join('');
  const h = Array.from(
    { length: 10 },
    (_, i) =>
      `<line x1="0" y1="${i * 63}" x2="1200" y2="${i * 63}" stroke="white" stroke-width="1"/>`
  ).join('');
  return `<g opacity="0.03">${v}${h}</g>`;
}

function mwmBadge(x = 40, y = 30) {
  return `
  <g transform="translate(${x}, ${y})">
    <path d="M10 4L4 13L10 22" stroke="${COLORS.sky}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M26 4L32 13L26 22" stroke="${COLORS.sky}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="18" cy="13" r="2.5" fill="${COLORS.sky}"/>
    <line x1="12.5" y1="13" x2="15.5" y2="13" stroke="${COLORS.skyLight}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <line x1="20.5" y1="13" x2="23.5" y2="13" stroke="${COLORS.skyLight}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <text x="38" y="18" font-family="Inter, sans-serif" font-size="14" font-weight="800" letter-spacing="1">
      <tspan fill="${COLORS.sky}">M</tspan><tspan fill="${COLORS.textLight}">W</tspan><tspan fill="${COLORS.sky}">M</tspan>
    </text>
    <text x="38" y="27" font-family="Inter, sans-serif" font-size="7" font-weight="500" fill="${COLORS.textMid}" letter-spacing="2">SOFTWARE</text>
  </g>`;
}

function tags(tagList, cx, y) {
  const totalWidth =
    tagList.reduce((sum, t) => sum + t.length * 7.5 + 24, 0) + (tagList.length - 1) * 10;
  let x = cx - totalWidth / 2;
  const items = tagList.map(t => {
    const w = t.length * 7.5 + 24;
    const item = `
      <rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="${COLORS.bgLight}" opacity="0.7"/>
      <text x="${x + w / 2}" y="${y + 17}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="${COLORS.textMid}">${t}</text>`;
    x += w + 10;
    return item;
  });
  return items.join('');
}

// ─── DASHBOARD SVG ────────────────────────────────────────────────────────────

function dashboardSVG(project, meta) {
  const [accentA, accentB] = meta.accent;

  const statCards = [
    { label: 'Total Users', value: '24.8K', delta: '+12%' },
    { label: 'Revenue', value: '$182K', delta: '+8.4%' },
    { label: 'Orders', value: '3,291', delta: '+21%' },
    { label: 'Sessions', value: '97.2K', delta: '+5.6%' },
  ]
    .map((card, i) => {
      const x = 420 + i * 190;
      const y = 80;
      return `
      <rect x="${x}" y="${y}" width="175" height="80" rx="8" fill="${COLORS.bgLight}" opacity="0.5"/>
      <rect x="${x}" y="${y}" width="4" height="80" rx="2" fill="url(#accent)"/>
      <text x="${x + 16}" y="${y + 24}" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">${card.label}</text>
      <text x="${x + 16}" y="${y + 50}" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="${COLORS.textLight}">${card.value}</text>
      <rect x="${x + 16}" y="${y + 58}" width="38" height="14" rx="7" fill="${accentA}" opacity="0.2"/>
      <text x="${x + 35}" y="${y + 68}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${accentA}">${card.delta}</text>`;
    })
    .join('');

  // Sidebar
  const sidebarItems = ['Dashboard', 'Analytics', 'Users', 'Settings', 'Reports']
    .map((item, i) => {
      const active = i === 0;
      const y = 70 + i * 44;
      return `
      <rect x="30" y="${y}" width="160" height="34" rx="6" fill="${active ? accentA : 'transparent'}" opacity="${active ? 0.15 : 0}"/>
      <rect x="38" y="${y + 10}" width="3" height="14" rx="1.5" fill="${active ? accentA : COLORS.textDim}"/>
      <text x="52" y="${y + 21}" font-family="Inter, sans-serif" font-size="12" font-weight="${active ? 600 : 400}" fill="${active ? accentA : COLORS.textMid}">${item}</text>`;
    })
    .join('');

  // Chart bars
  const barData = [40, 65, 50, 80, 60, 90, 70, 85, 55, 75, 95, 68];
  const bars = barData
    .map((h, i) => {
      const x = 430 + i * 55;
      const barH = h * 1.2;
      const y = 330 - barH;
      return `
      <rect x="${x}" y="${y}" width="36" height="${barH}" rx="4" fill="url(#accent)" opacity="0.7"/>
      <rect x="${x}" y="${y}" width="36" height="6" rx="3" fill="${accentA}"/>`;
    })
    .join('');

  // Line chart
  const linePoints = [40, 55, 45, 70, 58, 80, 65, 85, 72, 90, 78, 95];
  const lineCoords = linePoints.map((v, i) => `${430 + i * 55 + 18},${445 - v * 0.8}`).join(' ');
  const areaCoords = `430,445 ${lineCoords} ${430 + 11 * 55 + 18},445`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
${bgBase(accentA, accentB)}
${gridLines()}

<!-- Sidebar panel -->
<rect x="20" y="20" width="200" height="590" rx="10" fill="${COLORS.bgMid}" opacity="0.8"/>
${mwmBadge(30, 28)}
${sidebarItems}

<!-- Main content area -->
<rect x="235" y="20" width="945" height="590" rx="10" fill="${COLORS.bgMid}" opacity="0.5"/>

<!-- Top nav bar -->
<rect x="235" y="20" width="945" height="50" rx="10" fill="${COLORS.bgLight}" opacity="0.4"/>
<text x="260" y="52" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="${COLORS.textLight}">${meta.label}</text>
<rect x="980" y="30" width="100" height="30" rx="8" fill="url(#accent)" opacity="0.9"/>
<text x="1030" y="49" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="white">+ New</text>

<!-- Stat cards row -->
${statCards}

<!-- Chart section heading -->
<text x="430" y="220" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="${COLORS.textLight}">Analytics Overview</text>
<text x="430" y="238" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Last 12 months performance</text>

<!-- Chart background -->
<rect x="420" y="250" width="740" height="130" rx="8" fill="${COLORS.bgDark}" opacity="0.6"/>
<!-- Bar chart -->
${bars}

<!-- Area/Line chart section -->
<rect x="420" y="400" width="740" height="80" rx="8" fill="${COLORS.bgDark}" opacity="0.6"/>
<polygon points="${areaCoords}" fill="url(#accent)" opacity="0.1"/>
<polyline points="${lineCoords}" fill="none" stroke="url(#accentH)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

<!-- Table heading -->
<text x="430" y="510" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="${COLORS.textLight}">Recent Activity</text>
<rect x="420" y="520" width="740" height="70" rx="8" fill="${COLORS.bgDark}" opacity="0.5"/>
${[0, 1, 2]
  .map(
    i => `
  <rect x="432" y="${530 + i * 20}" width="${200 + (i % 2) * 40}" height="10" rx="5" fill="${COLORS.bgLight}" opacity="0.5"/>
  <rect x="700" y="${530 + i * 20}" width="80" height="10" rx="5" fill="${COLORS.bgLight}" opacity="0.3"/>
  <rect x="830" y="${530 + i * 20}" width="60" height="10" rx="5" fill="${accentA}" opacity="0.3"/>`
  )
  .join('')}

<!-- Project name -->
<text x="600" y="620" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textDim}" letter-spacing="2">${meta.subtitle.toUpperCase()}</text>
</svg>`;
}

// ─── MOBILE SVG ──────────────────────────────────────────────────────────────

function mobileSVG(project, meta) {
  const [accentA, accentB] = meta.accent;

  // Phone screens - show two phones side by side
  function phoneFrame(x, y, w, h, content) {
    return `
    <g>
      <!-- Phone shadow -->
      <rect x="${x + 4}" y="${y + 4}" width="${w}" height="${h}" rx="28" fill="black" opacity="0.4" filter="url(#blur4)"/>
      <!-- Phone body -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="${COLORS.bgDark}" stroke="${COLORS.border}" stroke-width="2"/>
      <!-- Screen -->
      <rect x="${x + 6}" y="${y + 14}" width="${w - 12}" height="${h - 28}" rx="22" fill="${COLORS.bgMid}"/>
      <!-- Notch -->
      <rect x="${x + w / 2 - 20}" y="${y + 14}" width="40" height="16" rx="8" fill="${COLORS.bgDark}"/>
      <circle cx="${x + w / 2 - 5}" cy="${y + 22}" r="3" fill="${COLORS.bgLight}"/>
      <!-- Home indicator -->
      <rect x="${x + w / 2 - 20}" y="${y + h - 20}" width="40" height="4" rx="2" fill="${COLORS.bgLight}" opacity="0.5"/>
      <!-- Content -->
      ${content}
    </g>`;
  }

  const phone1Content = `
    <!-- Status bar -->
    <rect x="310" y="55" width="160" height="8" rx="4" fill="${COLORS.bgLight}" opacity="0.3"/>
    <!-- Hero header -->
    <rect x="310" y="75" width="160" height="40" rx="6" fill="url(#accent)" opacity="0.8"/>
    <text x="390" y="100" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="white">${meta.label}</text>
    <!-- Content cards -->
    ${[0, 1, 2]
      .map(
        i => `
    <rect x="315" y="${125 + i * 70}" width="150" height="60" rx="8" fill="${COLORS.bgLight}" opacity="0.4"/>
    <rect x="320" y="${130 + i * 70}" width="${60 + i * 15}" height="8" rx="4" fill="${accentA}" opacity="0.6"/>
    <rect x="320" y="${143 + i * 70}" width="130" height="6" rx="3" fill="${COLORS.bgLight}" opacity="0.3"/>
    <rect x="320" y="${153 + i * 70}" width="100" height="6" rx="3" fill="${COLORS.bgLight}" opacity="0.2"/>
    <rect x="320" y="${163 + i * 70}" width="50" height="12" rx="6" fill="url(#accent)" opacity="0.7"/>
    `
      )
      .join('')}
    <!-- Bottom nav -->
    <rect x="310" y="365" width="160" height="40" rx="0" fill="${COLORS.bgDark}" opacity="0.9"/>
    ${[0, 1, 2, 3]
      .map(
        i => `
    <rect x="${320 + i * 38}" y="375" width="20" height="20" rx="4" fill="${i === 0 ? accentA : COLORS.bgLight}" opacity="${i === 0 ? 0.8 : 0.3}"/>
    `
      )
      .join('')}`;

  const phone2Content = `
    <!-- Status bar -->
    <rect x="560" y="85" width="160" height="8" rx="4" fill="${COLORS.bgLight}" opacity="0.3"/>
    <!-- List view screen -->
    <rect x="560" y="105" width="160" height="30" rx="6" fill="${COLORS.bgLight}" opacity="0.2"/>
    <text x="640" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Explore</text>
    ${[0, 1, 2, 3, 4]
      .map(
        i => `
    <rect x="560" y="${145 + i * 55}" width="160" height="48" rx="8" fill="${COLORS.bgLight}" opacity="0.35"/>
    <rect x="565" y="${150 + i * 55}" width="38" height="38" rx="6" fill="url(#accent)" opacity="0.5"/>
    <rect x="610" y="${154 + i * 55}" width="80" height="7" rx="3.5" fill="${COLORS.textLight}" opacity="0.5"/>
    <rect x="610" y="${164 + i * 55}" width="55" height="6" rx="3" fill="${COLORS.textMid}" opacity="0.4"/>
    <rect x="610" y="${174 + i * 55}" width="35" height="10" rx="5" fill="${accentA}" opacity="0.6"/>
    `
      )
      .join('')}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
${bgBase(accentA, accentB)}
${gridLines()}

<!-- Background decorative circles -->
<circle cx="200" cy="315" r="220" fill="${accentA}" opacity="0.04"/>
<circle cx="1000" cy="315" r="180" fill="${accentB}" opacity="0.04"/>

<!-- Left info panel -->
<g transform="translate(40, 0)">
  ${mwmBadge(0, 30)}
  <text x="0" y="130" font-family="Inter, sans-serif" font-size="32" font-weight="800" fill="${COLORS.textLight}">${meta.label}</text>
  <text x="0" y="158" font-family="Inter, sans-serif" font-size="15" fill="${COLORS.textMid}">${meta.subtitle}</text>

  <!-- Accent line -->
  <rect x="0" y="175" width="60" height="3" rx="1.5" fill="url(#accentH)"/>

  <!-- Feature list -->
  ${meta.tags
    .map(
      (tag, i) => `
  <g transform="translate(0, ${210 + i * 36})">
    <circle cx="8" cy="8" r="8" fill="${accentA}" opacity="0.2"/>
    <circle cx="8" cy="8" r="4" fill="${accentA}"/>
    <text x="24" y="13" font-family="Inter, sans-serif" font-size="13" fill="${COLORS.textMid}">${tag}</text>
  </g>`
    )
    .join('')}

  <!-- Available on badges -->
  <rect x="0" y="460" width="130" height="36" rx="10" fill="${COLORS.bgLight}" opacity="0.5"/>
  <text x="65" y="482" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="${COLORS.textMid}">App Store</text>
  <rect x="145" y="460" width="130" height="36" rx="10" fill="${COLORS.bgLight}" opacity="0.5"/>
  <text x="210" y="482" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="${COLORS.textMid}">Google Play</text>
</g>

<!-- Phone 1 (main) -->
${phoneFrame(300, 35, 180, 410, phone1Content)}

<!-- Phone 2 (slightly offset) -->
${phoneFrame(530, 65, 180, 370, phone2Content)}

<!-- Floating UI elements -->
<rect x="750" y="100" width="200" height="90" rx="12" fill="${COLORS.bgMid}" opacity="0.9"/>
<rect x="758" y="108" width="3" height="74" rx="1.5" fill="url(#accent)"/>
<text x="772" y="128" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="${COLORS.textLight}">Real-time Updates</text>
<text x="772" y="146" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Live data synchronization</text>
<text x="772" y="162" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Push notifications</text>
<text x="772" y="178" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Offline support</text>

<rect x="750" y="215" width="200" height="90" rx="12" fill="${COLORS.bgMid}" opacity="0.9"/>
<rect x="758" y="223" width="3" height="74" rx="1.5" fill="url(#accent)"/>
<text x="772" y="243" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="${COLORS.textLight}">Performance</text>
<text x="772" y="261" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">60fps animations</text>
<text x="772" y="277" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Optimized rendering</text>
<text x="772" y="293" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">Fast startup time</text>

<!-- Stats row -->
${[
  { label: 'Downloads', value: '50K+' },
  { label: 'Rating', value: '4.8★' },
  { label: 'Countries', value: '12' },
]
  .map(
    (s, i) => `
<rect x="${760 + i * 140}" y="430" width="125" height="70" rx="10" fill="${COLORS.bgMid}" opacity="0.7"/>
<text x="${822 + i * 140}" y="468" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${COLORS.textLight}">${s.value}</text>
<text x="${822 + i * 140}" y="488" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.textMid}">${s.label}</text>`
  )
  .join('')}

<!-- Bottom label -->
<text x="600" y="620" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textDim}" letter-spacing="2">MOBILE APPLICATION</text>
</svg>`;
}

// ─── FEATURES SVG ────────────────────────────────────────────────────────────

function featuresSVG(project, meta) {
  const [accentA, accentB] = meta.accent;

  const featureData = [
    {
      title: 'Fast & Reliable',
      desc: 'Optimized for speed with enterprise-grade reliability and uptime guarantees.',
    },
    {
      title: 'Secure by Design',
      desc: 'End-to-end encryption, RBAC, and industry-standard security protocols.',
    },
    {
      title: 'Scalable Architecture',
      desc: 'Cloud-native infrastructure that scales with your business needs.',
    },
    {
      title: 'Developer API',
      desc: 'RESTful API with comprehensive docs, SDKs, and webhook support.',
    },
    {
      title: 'Real-time Sync',
      desc: 'Live data updates across all connected clients via WebSocket.',
    },
    {
      title: 'Analytics & Reports',
      desc: 'Detailed insights and custom dashboards to track key metrics.',
    },
  ];

  const featureCards = featureData
    .map((f, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 50 + col * 370;
      const y = 160 + row * 170;
      return `
    <rect x="${x}" y="${y}" width="340" height="145" rx="12" fill="${COLORS.bgMid}" opacity="0.7"/>
    <rect x="${x}" y="${y}" width="340" height="3" rx="1.5" fill="url(#accent)"/>
    <!-- Icon circle -->
    <circle cx="${x + 30}" cy="${y + 40}" r="18" fill="${accentA}" opacity="0.15"/>
    <circle cx="${x + 30}" cy="${y + 40}" r="8" fill="${accentA}" opacity="0.8"/>
    <!-- Title -->
    <text x="${x + 55}" y="${y + 35}" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.textLight}">${f.title}</text>
    <text x="${x + 55}" y="${y + 52}" font-family="Inter, sans-serif" font-size="10" fill="${accentA}">Feature ${i + 1}</text>
    <!-- Description lines (word-wrap simulation) -->
    <text x="${x + 20}" y="${y + 80}" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textMid}">${f.desc.substring(0, 50)}</text>
    <text x="${x + 20}" y="${y + 96}" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textMid}">${f.desc.substring(50)}</text>
    <!-- Bottom metric bar -->
    <rect x="${x + 20}" y="${y + 115}" width="200" height="4" rx="2" fill="${COLORS.bgLight}" opacity="0.4"/>
    <rect x="${x + 20}" y="${y + 115}" width="${80 + i * 25}" height="4" rx="2" fill="url(#accentH)"/>
    <text x="${x + 230}" y="${y + 120}" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.textMid}">${70 + i * 5}%</text>
    <!-- Learn more link -->
    <text x="${x + 20}" y="${y + 138}" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="${accentA}">Learn more →</text>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
${bgBase(accentA, accentB)}
${gridLines()}

<!-- Top header band -->
<rect x="0" y="0" width="1200" height="130" fill="${COLORS.bgMid}" opacity="0.6"/>
<rect x="0" y="127" width="1200" height="3" fill="url(#accentH)" opacity="0.5"/>

<!-- Header content -->
${mwmBadge(40, 20)}
<text x="600" y="58" text-anchor="middle" font-family="Inter, sans-serif" font-size="30" font-weight="800" fill="${COLORS.textLight}">${meta.label}</text>
<text x="600" y="84" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" fill="${COLORS.textMid}">${meta.subtitle}</text>
${tags(meta.tags, 600, 96)}

<!-- Feature cards grid -->
${featureCards}

<!-- Bottom CTA band -->
<rect x="0" y="580" width="1200" height="50" fill="${COLORS.bgMid}" opacity="0.6"/>
<text x="400" y="610" font-family="Inter, sans-serif" font-size="12" fill="${COLORS.textMid}">Built with modern technologies · Enterprise-ready · Fully documented</text>
<rect x="990" y="592" width="160" height="30" rx="8" fill="url(#accent)"/>
<text x="1070" y="611" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="white">View Project →</text>
</svg>`;
}

// ─── Blog header SVGs ─────────────────────────────────────────────────────────

const BLOG_THEMES = [
  {
    title: 'Building Scalable APIs',
    subtitle: 'REST, GraphQL & WebSocket Patterns',
    accentA: COLORS.sky,
    accentB: COLORS.skyDark,
    type: 'code',
  },
  {
    title: 'Modern React Patterns',
    subtitle: 'Server Components, Hooks & Performance',
    accentA: COLORS.purple,
    accentB: COLORS.purpleDark,
    type: 'react',
  },
  {
    title: 'Database Architecture',
    subtitle: 'SQL vs NoSQL · Indexing · Replication',
    accentA: COLORS.orange,
    accentB: COLORS.orangeDark,
    type: 'database',
  },
  {
    title: 'Mobile App Development',
    subtitle: 'Flutter · React Native · Cross-Platform',
    accentA: COLORS.teal,
    accentB: '#0d9488',
    type: 'mobile',
  },
  {
    title: 'DevOps & Deployment',
    subtitle: 'Docker · CI/CD · Kubernetes · Monitoring',
    accentA: COLORS.green,
    accentB: '#15803d',
    type: 'devops',
  },
  {
    title: 'UI/UX Best Practices',
    subtitle: 'Design Systems · Accessibility · Motion',
    accentA: COLORS.pink,
    accentB: '#db2777',
    type: 'design',
  },
  {
    title: 'Security in Web Apps',
    subtitle: 'Auth · CSRF · XSS · Rate Limiting',
    accentA: '#dc2626',
    accentB: '#991b1b',
    type: 'security',
  },
  {
    title: 'Performance Optimization',
    subtitle: 'Caching · CDN · Core Web Vitals',
    accentA: COLORS.orange,
    accentB: '#c2410c',
    type: 'performance',
  },
  {
    title: 'TypeScript Deep Dive',
    subtitle: 'Advanced Types · Generics · Decorators',
    accentA: '#2563eb',
    accentB: '#1d4ed8',
    type: 'typescript',
  },
  {
    title: 'System Design Fundamentals',
    subtitle: 'Microservices · Event Sourcing · CQRS',
    accentA: COLORS.purple,
    accentB: '#5b21b6',
    type: 'system',
  },
];

function codeSnippet(x, y, accentA, lines) {
  return `
  <rect x="${x}" y="${y}" width="500" height="${lines.length * 22 + 30}" rx="10" fill="${COLORS.bgDark}" opacity="0.9"/>
  <!-- traffic lights -->
  <circle cx="${x + 18}" cy="${y + 16}" r="5" fill="#ef4444" opacity="0.8"/>
  <circle cx="${x + 34}" cy="${y + 16}" r="5" fill="#f59e0b" opacity="0.8"/>
  <circle cx="${x + 50}" cy="${y + 16}" r="5" fill="#22c55e" opacity="0.8"/>
  <rect x="${x}" y="${y + 28}" width="500" height="1" fill="${COLORS.border}" opacity="0.5"/>
  ${lines
    .map((line, i) => {
      const tokens = line.tokens;
      let lx = x + 16;
      const ly = y + 48 + i * 22;
      return tokens
        .map(([text, color]) => {
          const el = `<text x="${lx}" y="${ly}" font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="12" fill="${color}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
          lx += text.length * 7.5;
          return el;
        })
        .join('');
    })
    .join('')}`;
}

function blogSVG(theme, index) {
  const { title, subtitle, accentA, accentB, type } = theme;

  const codeLines = {
    code: [
      {
        tokens: [
          ['async', '#c084fc'],
          [' function', '#60a5fa'],
          [' fetchData', '#fbbf24'],
          ['() {', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  const', '#c084fc'],
          [' res', '#e2e8f0'],
          [' = ', '#e2e8f0'],
          ['await', '#c084fc'],
          [' fetch(url);', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  return', '#c084fc'],
          [' res.', '#e2e8f0'],
          ['json', '#34d399'],
          ['();', '#e2e8f0'],
        ],
      },
      { tokens: [['}', '#e2e8f0']] },
    ],
    react: [
      {
        tokens: [
          ['export', '#c084fc'],
          [' default', '#c084fc'],
          [' function', '#60a5fa'],
          [' App()', '#fbbf24'],
          [' {', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  const', '#c084fc'],
          [' [', '#e2e8f0'],
          ['state', '#e2e8f0'],
          [', ', '#e2e8f0'],
          ['setState', '#34d399'],
          ['] = ', '#e2e8f0'],
          ['useState', '#34d399'],
          ['(0);', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  return', '#c084fc'],
          [' <', '#e2e8f0'],
          ['div', '#60a5fa'],
          [' className=', '#e2e8f0'],
          ['"app"', '#fbbf24'],
          ['>', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['    <', '#e2e8f0'],
          ['Counter', '#34d399'],
          [' value=', '#e2e8f0'],
          ['{state}', '#fb923c'],
          [' />', '#e2e8f0'],
        ],
      },
    ],
    database: [
      {
        tokens: [
          ['SELECT', '#60a5fa'],
          [' u.name', '#e2e8f0'],
          [',', '#e2e8f0'],
          [' COUNT', '#fbbf24'],
          ['(*)', '#e2e8f0'],
          [' AS', '#60a5fa'],
          [' total', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['FROM', '#60a5fa'],
          [' users u', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['JOIN', '#60a5fa'],
          [' orders o', '#e2e8f0'],
          [' ON', '#60a5fa'],
          [' u.id = o.user_id', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['GROUP BY', '#60a5fa'],
          [' u.name', '#e2e8f0'],
          [' HAVING', '#60a5fa'],
          [' total > ', '#e2e8f0'],
          ['10', '#fb923c'],
          [';', '#e2e8f0'],
        ],
      },
    ],
    typescript: [
      {
        tokens: [
          ['interface', '#60a5fa'],
          [' ApiResponse', '#fbbf24'],
          ['<T>', '#c084fc'],
          [' {', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  data', '#e2e8f0'],
          [':', '#e2e8f0'],
          [' T', '#c084fc'],
          [';', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  status', '#e2e8f0'],
          [':', '#e2e8f0'],
          [' number', '#60a5fa'],
          [';', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  message', '#e2e8f0'],
          [':', '#e2e8f0'],
          [' string', '#60a5fa'],
          [';', '#e2e8f0'],
        ],
      },
    ],
    security: [
      { tokens: [['// Verify HMAC signature', '#6b7280']] },
      {
        tokens: [
          ['const', '#c084fc'],
          [' hash', '#e2e8f0'],
          [' = ', '#e2e8f0'],
          ['crypto', '#34d399'],
          ['.createHmac(', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['  ', '#e2e8f0'],
          ['"sha256"', '#fbbf24'],
          [', process.env.', '#e2e8f0'],
          ['SECRET', '#fb923c'],
          [');', '#e2e8f0'],
        ],
      },
      {
        tokens: [
          ['hash', '#e2e8f0'],
          ['.update', '#34d399'],
          ['(payload)', '#e2e8f0'],
          ['.digest', '#34d399'],
          ['("hex"', '#fbbf24'],
          [');', '#e2e8f0'],
        ],
      },
    ],
  };

  const defaultLines = [
    {
      tokens: [
        ['// ', '#6b7280'],
        [title.substring(0, 30), '#6b7280'],
      ],
    },
    {
      tokens: [
        ['const', '#c084fc'],
        [' solution', '#e2e8f0'],
        [' = ', '#e2e8f0'],
        ['await', '#c084fc'],
        [' buildIt();', '#e2e8f0'],
      ],
    },
    {
      tokens: [
        ['console', '#e2e8f0'],
        ['.log', '#34d399'],
        ['(', '#e2e8f0'],
        ['"Success!"', '#fbbf24'],
        [');', '#e2e8f0'],
      ],
    },
    {
      tokens: [
        ['export', '#c084fc'],
        [' default', '#c084fc'],
        [' solution;', '#e2e8f0'],
      ],
    },
  ];

  const lines = codeLines[type] || defaultLines;

  // Decorative tech icons / shapes based on type
  function decorations() {
    if (type === 'database') {
      return `
      <!-- DB cylinders -->
      <ellipse cx="960" cy="240" rx="80" ry="20" fill="${accentA}" opacity="0.15"/>
      <rect x="880" y="240" width="160" height="80" fill="${accentA}" opacity="0.08"/>
      <ellipse cx="960" cy="320" rx="80" ry="20" fill="${accentA}" opacity="0.15"/>
      <ellipse cx="960" cy="370" rx="80" ry="20" fill="${accentA}" opacity="0.12"/>
      <rect x="880" y="370" width="160" height="60" fill="${accentA}" opacity="0.06"/>
      <ellipse cx="960" cy="430" rx="80" ry="20" fill="${accentA}" opacity="0.12"/>`;
    }
    if (type === 'mobile') {
      return `
      <!-- Phone outline -->
      <rect x="880" y="180" width="120" height="220" rx="20" fill="none" stroke="${accentA}" stroke-width="2" opacity="0.3"/>
      <rect x="890" y="200" width="100" height="180" rx="12" fill="${accentA}" opacity="0.05"/>
      <rect x="920" y="183" width="40" height="8" rx="4" fill="${accentA}" opacity="0.3"/>
      <rect x="920" y="388" width="40" height="5" rx="2.5" fill="${accentA}" opacity="0.3"/>`;
    }
    if (type === 'devops') {
      return `
      <!-- Docker/server boxes -->
      ${[0, 1, 2]
        .map(
          i => `
      <rect x="${860 + i * 50}" y="${200 + i * 40}" width="140" height="50" rx="6" fill="${accentA}" opacity="${0.08 + i * 0.03}"/>
      <rect x="${860 + i * 50}" y="${200 + i * 40}" width="140" height="50" rx="6" fill="none" stroke="${accentA}" stroke-width="1" opacity="0.3"/>
      `
        )
        .join('')}
      <!-- Connecting arrows -->
      <line x1="930" y1="250" x2="930" y2="280" stroke="${accentA}" stroke-width="2" stroke-dasharray="4" opacity="0.4"/>
      <line x1="980" y1="290" x2="980" y2="330" stroke="${accentA}" stroke-width="2" stroke-dasharray="4" opacity="0.4"/>`;
    }
    if (type === 'performance') {
      return `
      <!-- Gauge/meter -->
      <circle cx="960" cy="310" r="100" fill="none" stroke="${COLORS.bgLight}" stroke-width="12" opacity="0.2"/>
      <circle cx="960" cy="310" r="100" fill="none" stroke="url(#accent)" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="440" stroke-dashoffset="110" transform="rotate(-90 960 310)" opacity="0.7"/>
      <text x="960" y="305" text-anchor="middle" font-family="Inter, sans-serif" font-size="36" font-weight="800" fill="${COLORS.textLight}">95</text>
      <text x="960" y="328" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="${COLORS.textMid}">Score</text>`;
    }
    if (type === 'system') {
      return `
      <!-- Node graph -->
      ${[
        [960, 260],
        [880, 340],
        [1040, 340],
        [960, 420],
      ]
        .map(
          ([cx, cy], i) => `
      <circle cx="${cx}" cy="${cy}" r="24" fill="${accentA}" opacity="0.15"/>
      <circle cx="${cx}" cy="${cy}" r="12" fill="${accentA}" opacity="0.5"/>
      `
        )
        .join('')}
      <line x1="960" y1="284" x2="892" y2="328" stroke="${accentA}" stroke-width="2" opacity="0.4"/>
      <line x1="960" y1="284" x2="1028" y2="328" stroke="${accentA}" stroke-width="2" opacity="0.4"/>
      <line x1="892" y1="352" x2="948" y2="408" stroke="${accentA}" stroke-width="2" opacity="0.4"/>
      <line x1="1028" y1="352" x2="972" y2="408" stroke="${accentA}" stroke-width="2" opacity="0.4"/>`;
    }
    // default: abstract shapes
    return `
    <!-- Abstract hexagon/circuit pattern -->
    <polygon points="960,200 1010,230 1010,290 960,320 910,290 910,230" fill="none" stroke="${accentA}" stroke-width="2" opacity="0.2"/>
    <polygon points="960,230 990,247 990,283 960,300 930,283 930,247" fill="${accentA}" opacity="0.08"/>
    <circle cx="960" cy="265" r="20" fill="${accentA}" opacity="0.25"/>
    <!-- Orbiting dots -->
    <circle cx="960" cy="200" r="5" fill="${accentA}" opacity="0.6"/>
    <circle cx="1010" cy="260" r="5" fill="${accentA}" opacity="0.6"/>
    <circle cx="910" cy="260" r="5" fill="${accentA}" opacity="0.6"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
${bgBase(accentA, accentB)}
${gridLines()}

<!-- Top accent stripe -->
<rect x="0" y="0" width="1200" height="5" fill="url(#accentH)"/>

<!-- Left content area -->
<g transform="translate(60, 0)">
  ${mwmBadge(0, 40)}

  <!-- Category badge -->
  <rect x="0" y="120" width="${type.length * 8 + 30}" height="26" rx="13" fill="${accentA}" opacity="0.2"/>
  <text x="${(type.length * 8 + 30) / 2}" y="137" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="${accentA}">${type.toUpperCase()}</text>

  <!-- Main title -->
  <text x="0" y="198" font-family="Inter, sans-serif" font-size="38" font-weight="800" fill="${COLORS.textLight}">${title}</text>
  <text x="0" y="230" font-family="Inter, sans-serif" font-size="16" fill="${COLORS.textMid}">${subtitle}</text>

  <!-- Divider -->
  <rect x="0" y="252" width="80" height="3" rx="1.5" fill="url(#accentH)"/>

  <!-- Author / meta -->
  <circle cx="16" cy="300" r="16" fill="${accentA}" opacity="0.3"/>
  <text x="42" y="296" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="${COLORS.textLight}">MWM Engineering Blog</text>
  <text x="42" y="314" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textMid}">March 2026 · 8 min read</text>

  <!-- Read time pill -->
  <rect x="0" y="340" width="100" height="28" rx="14" fill="${COLORS.bgLight}" opacity="0.5"/>
  <text x="50" y="358" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textMid}">Tech Article</text>
</g>

<!-- Code snippet / visual right side -->
${codeSnippet(600, 140, accentA, lines)}

<!-- Decorative element -->
${decorations()}

<!-- Bottom bar -->
<rect x="0" y="590" width="1200" height="40" fill="${COLORS.bgMid}" opacity="0.7"/>
<text x="60" y="615" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textDim}">mwm.software/blog</text>
<text x="600" y="615" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textDim}" letter-spacing="2">MWM SOFTWARE SOLUTIONS</text>
<text x="1140" y="615" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.textDim}">${new Date().getFullYear()}</text>
</svg>`;
}

// ─── File writing ─────────────────────────────────────────────────────────────

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\nMWM Placeholder SVG Generator\n' + '='.repeat(40));

let totalFiles = 0;

// Portfolio SVGs
for (const [project, meta] of Object.entries(PROJECTS)) {
  const dir = path.join(PORTFOLIO_DIR, project);

  if (!fs.existsSync(dir)) {
    console.log(`  [SKIP] ${project} — directory not found`);
    continue;
  }

  const files = [
    { name: 'dashboard.svg', fn: dashboardSVG },
    { name: 'mobile.svg', fn: mobileSVG },
    { name: 'features.svg', fn: featuresSVG },
  ];

  for (const { name, fn } of files) {
    const filePath = path.join(dir, name);
    write(filePath, fn(project, meta));
    totalFiles++;
  }

  console.log(`  [OK] ${project} — dashboard.svg, mobile.svg, features.svg`);
}

// Blog header SVGs
console.log('\nGenerating blog headers...');
for (let i = 0; i < BLOG_THEMES.length; i++) {
  const theme = BLOG_THEMES[i];
  const fileName = `blog-header-${i + 1}.svg`;
  const filePath = path.join(BLOG_DIR, fileName);
  write(filePath, blogSVG(theme, i + 1));
  totalFiles++;
  console.log(`  [OK] ${fileName} — "${theme.title}"`);
}

console.log('\n' + '='.repeat(40));
console.log(`Done. Generated ${totalFiles} SVG files.\n`);
