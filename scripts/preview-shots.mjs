import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4322';
const OUT = process.argv[3] ?? './shots';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function shoot(name, contextOpts, scrolls) {
  const ctx = await browser.newContext(contextOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(2200);
  for (const s of scrolls) {
    await page.evaluate((y) => window.scrollTo(0, document.body.scrollHeight * y), s.frac);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${name}-${s.label}.png` });
  }
  console.log(`${name} errors:`, errors.length ? errors : 'none');
  await ctx.close();
}

const scrolls = [
  { label: '1-hero', frac: 0 },
  { label: '2-intro', frac: 0.18 },
  { label: '3-services', frac: 0.38 },
  { label: '4-building', frac: 0.62 },
  { label: '5-how', frac: 0.78 },
  { label: '6-footer', frac: 0.99 },
];

await shoot('desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, scrolls);
await shoot('mobile', { ...devices['iPhone 13'] }, scrolls);

await browser.close();
