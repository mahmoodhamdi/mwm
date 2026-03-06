const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const projects = [
  {
    slug: 'bagour-delivery',
    title: 'Bagour Delivery',
    titleAr: 'منصة توصيل طعام باجور',
    color: '#e74c3c',
    icon: '🍕',
    techs: ['Node.js', 'Next.js', 'Flutter', 'MongoDB', 'Socket.io'],
    type: 'Full-Stack Platform',
  },
  {
    slug: 'sana3y',
    title: 'Sana3y Platform',
    titleAr: 'منصة صنايعي',
    color: '#3498db',
    icon: '🔧',
    techs: ['Node.js', 'Next.js', 'Flutter', 'MongoDB', 'Paymob'],
    type: 'Full-Stack Platform',
  },
  {
    slug: 'wasalni',
    title: 'Wasalni',
    titleAr: 'وصلني — منصة نقل ركاب',
    color: '#2ecc71',
    icon: '🚗',
    techs: ['Node.js', 'Next.js', 'Flutter', 'Redis', 'Socket.io'],
    type: 'Full-Stack Platform',
  },
  {
    slug: 'mwm-corporate',
    title: 'MWM Corporate',
    titleAr: 'موقع MWM للشركات',
    color: '#0ea5e9',
    icon: '🏢',
    techs: ['Node.js', 'Next.js 14', 'MongoDB', 'Redis', 'TypeScript'],
    type: 'Corporate Website',
  },
  {
    slug: 'clinic-booking-system',
    title: 'Clinic Booking System',
    titleAr: 'نظام حجز العيادات',
    color: '#9b59b6',
    icon: '🏥',
    techs: ['Laravel 12', 'Next.js 16', 'PostgreSQL', 'REST API'],
    type: 'Web Application',
  },
  {
    slug: 'esports-flask',
    title: 'Esports World Cup API',
    titleAr: 'واجهة برمجية لكأس العالم للرياضات الإلكترونية',
    color: '#e67e22',
    icon: '🎮',
    techs: ['Python', 'Flask', 'PostgreSQL', 'Flasgger', 'REST API'],
    type: 'Backend API',
  },
  {
    slug: 'sounds-api',
    title: 'Sounds API',
    titleAr: 'واجهة برمجية لتقييم النطق',
    color: '#1abc9c',
    icon: '🎤',
    techs: ['Python', 'Flask', 'PostgreSQL', 'SpeechAce'],
    type: 'Backend API',
  },
  {
    slug: 'downloader-api',
    title: 'Downloader API',
    titleAr: 'واجهة برمجية لتحميل الوسائط',
    color: '#e91e63',
    icon: '⬇️',
    techs: ['Python', 'Flask', 'REST API'],
    type: 'Backend API',
  },
  {
    slug: 'whatsapp-sheets-bot',
    title: 'WhatsApp Sheets Bot',
    titleAr: 'بوت واتساب + جوجل شيتس',
    color: '#25d366',
    icon: '🤖',
    techs: ['Node.js', 'WhatsApp API', 'Google Sheets'],
    type: 'Automation',
  },
  {
    slug: 'artneer',
    title: 'Artneer Scraper',
    titleAr: 'سكرابر بيانات شركات المقاولات',
    color: '#ff9800',
    icon: '🕷️',
    techs: ['Python', 'Click CLI', 'BeautifulSoup', 'Scrapy'],
    type: 'Automation & Scraping',
  },
  {
    slug: 'saudi-host',
    title: 'Saudi Host',
    titleAr: 'المضيف السعودي',
    color: '#006c35',
    icon: '🕌',
    techs: ['Node.js', 'Next.js 14', 'Flutter', 'MongoDB'],
    type: 'Full-Stack Platform',
  },
  {
    slug: 'sabry',
    title: 'Sabry Platform',
    titleAr: 'منصة صبري',
    color: '#795548',
    icon: '📦',
    techs: ['Node.js', 'Express', 'Next.js', 'TypeScript'],
    type: 'Full-Stack Platform',
  },
  {
    slug: 'dare',
    title: 'Dare E-Commerce',
    titleAr: 'متجر Dare الإلكتروني',
    color: '#673ab7',
    icon: '🛒',
    techs: ['Laravel 10', 'Filament 3', 'Livewire 3'],
    type: 'E-Commerce',
  },
  {
    slug: 'tutoring-system',
    title: 'Tutoring System',
    titleAr: 'منصة دروس خصوصية',
    color: '#ff5722',
    icon: '📚',
    techs: ['Next.js', 'Node.js', 'MongoDB'],
    type: 'Web Application',
  },
  {
    slug: 'khamsat-portfolio',
    title: 'Khamsat Portfolio',
    titleAr: 'بورتفوليو خمسات',
    color: '#00bcd4',
    icon: '💼',
    techs: ['HTML', 'CSS', 'JavaScript'],
    type: 'Static Website',
  },
  {
    slug: 'screenshot-api',
    title: 'Screenshot API',
    titleAr: 'واجهة برمجية لأخذ لقطات الشاشة',
    color: '#607d8b',
    icon: '📸',
    techs: ['Node.js', 'Puppeteer', 'Express'],
    type: 'Backend API',
  },
  {
    slug: 'localhost-tunnel',
    title: 'Localhost Tunnel',
    titleAr: 'أداة نفق الشبكة المحلية',
    color: '#9c27b0',
    icon: '🔗',
    techs: ['Node.js'],
    type: 'Developer Tool',
  },
];

function generateHTML(project) {
  const techBadges = project.techs.map(t => `<span class="tech">${t}</span>`).join('');

  return `<!DOCTYPE html>
<html dir="rtl">
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1440px; height: 900px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, ${project.color}22 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    position: relative;
  }
  .bg-pattern {
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 80%, ${project.color}15 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${project.color}20 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, ${project.color}08 0%, transparent 70%);
  }
  .grid-lines {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .card {
    position: relative; z-index: 2;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid ${project.color}40;
    border-radius: 24px;
    padding: 60px 80px;
    text-align: center;
    max-width: 800px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 80px ${project.color}15, 0 25px 50px rgba(0,0,0,0.3);
  }
  .icon { font-size: 72px; margin-bottom: 24px; }
  .type {
    display: inline-block;
    background: ${project.color}25;
    color: ${project.color};
    border: 1px solid ${project.color}50;
    padding: 6px 20px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .title {
    font-size: 48px; font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 12px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  .title-ar {
    font-size: 28px; font-weight: 600;
    color: #94a3b8;
    margin-bottom: 32px;
  }
  .techs {
    display: flex; flex-wrap: wrap; gap: 10px;
    justify-content: center;
    margin-top: 10px;
  }
  .tech {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: #e2e8f0;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
  }
  .brand {
    position: absolute;
    bottom: 30px; left: 50%;
    transform: translateX(-50%);
    color: #475569;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 3px;
  }
  .corner-accent {
    position: absolute;
    width: 120px; height: 120px;
    border: 2px solid ${project.color}30;
  }
  .corner-tl { top: 40px; left: 40px; border-right: none; border-bottom: none; border-radius: 12px 0 0 0; }
  .corner-br { bottom: 40px; right: 40px; border-left: none; border-top: none; border-radius: 0 0 12px 0; }
</style>
</head>
<body>
  <div class="bg-pattern"></div>
  <div class="grid-lines"></div>
  <div class="corner-accent corner-tl"></div>
  <div class="corner-accent corner-br"></div>
  <div class="card">
    <div class="icon">${project.icon}</div>
    <div class="type">${project.type}</div>
    <div class="title">${project.title}</div>
    <div class="title-ar">${project.titleAr}</div>
    <div class="techs">${techBadges}</div>
  </div>
  <div class="brand">MWM SOFTWARE</div>
</body>
</html>`;
}

async function main() {
  const outBase = path.join(__dirname, '..', 'frontend', 'public', 'portfolio');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 },
  });

  for (const project of projects) {
    const outDir = path.join(outBase, project.slug);
    fs.mkdirSync(outDir, { recursive: true });

    // Skip if real screenshots already exist (not placeholders)
    const existingFiles = fs.readdirSync(outDir);
    if (existingFiles.some(f => f === 'home.png' || f === 'login.png' || f === 'api-docs.png')) {
      console.log(`  SKIP: ${project.slug} (has real screenshots)`);
      continue;
    }

    const html = generateHTML(project);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const filepath = path.join(outDir, 'home.png');
    await page.screenshot({ path: filepath });
    console.log(`  OK: ${project.slug}/home.png`);
    await page.close();
  }

  await browser.close();
  console.log('\nDone! All placeholder screenshots generated.');
}

main().catch(console.error);
