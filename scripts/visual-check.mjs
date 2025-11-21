import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const baseUrl = 'http://localhost:4000';
const routes = [
  { path: '/', name: 'home' },
  { path: '/research/', name: 'research' },
  { path: '/teaching/', name: 'teaching' },
  { path: '/cv/', name: 'cv' },
  { path: '/publications/', name: 'publications' },
  { path: '/talks/', name: 'talks' },
  { path: '/portfolio/', name: 'portfolio' },
  { path: '/about/', name: 'about' }
];

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'tablet', width: 1024, height: 768 },
  { label: 'mobile', width: 390, height: 844 }
];

const screenshotDir = path.join('tmp', 'screens');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const toFileName = (name, label) => `${name}-${label}.png`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const diagnostics = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of routes) {
      const url = `${baseUrl.replace(/\/$/, '')}${route.path}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await delay(1500);

      // Scroll through the page to trigger lazy animations and content reveals
      await page.evaluate(() => window.scrollTo(0, 0));
      const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const steps = Math.max(2, Math.ceil(totalHeight / viewport.height));
      for (let i = 0; i < steps; i++) {
        await page.mouse.wheel(0, viewport.height);
        await delay(250);
      }
      await delay(500);

      const screenshotPath = path.join(screenshotDir, toFileName(`${route.name}`, viewport.label));
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const diag = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        const offenders = Array.from(document.querySelectorAll('body *'))
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.right > window.innerWidth + 1;
          })
          .slice(0, 8)
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            classes: el.className,
            right: el.getBoundingClientRect().right,
            width: el.getBoundingClientRect().width
          }));
        return {
          url: window.location.pathname,
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          overflow,
          offenders
        };
      });

      diagnostics.push({ viewport: viewport.label, url, ...diag });
    }

    await page.close();
  }

  await browser.close();

  const outputPath = path.join('tmp', 'screens', 'diagnostics.json');
  fs.writeFileSync(outputPath, JSON.stringify(diagnostics, null, 2));
  console.log(`Diagnostics written to ${outputPath}`);
})();
