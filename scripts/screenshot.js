const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshots(projectSlug, url, pages = []) {
  const outDir = path.join(__dirname, '..', 'frontend', 'public', 'portfolio', projectSlug);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const results = [];

  try {
    for (const page of pages) {
      const tab = await browser.newPage();
      const fullUrl = page.path ? `${url}${page.path}` : url;
      const filename = `${page.name || 'home'}.png`;
      const filepath = path.join(outDir, filename);

      console.log(`  Capturing: ${fullUrl} -> ${filename}`);

      try {
        await tab.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait a bit for animations/lazy loading
        await new Promise(r => setTimeout(r, 2000));

        // Scroll down to trigger lazy loading
        await tab.evaluate(async () => {
          await new Promise(resolve => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= document.body.scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve();
              }
            }, 100);
          });
        });

        await new Promise(r => setTimeout(r, 1000));

        await tab.screenshot({ path: filepath, fullPage: page.fullPage || false });
        results.push({ name: page.name, file: `/portfolio/${projectSlug}/${filename}` });
        console.log(`  OK: ${filename}`);
      } catch (err) {
        console.error(`  FAIL: ${fullUrl} - ${err.message}`);
      } finally {
        await tab.close();
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

// CLI usage: node screenshot.js <projectSlug> <url> <pageDefs>
// pageDefs is JSON array like: [{"name":"home","path":"/"},{"name":"about","path":"/about","fullPage":true}]
if (require.main === module) {
  const [slug, url, pagesJson] = process.argv.slice(2);
  if (!slug || !url || !pagesJson) {
    console.error('Usage: node screenshot.js <slug> <url> <pagesJson>');
    process.exit(1);
  }
  const pages = JSON.parse(pagesJson);
  takeScreenshots(slug, url, pages).then(results => {
    console.log('\nResults:', JSON.stringify(results, null, 2));
  });
}

module.exports = { takeScreenshots };
