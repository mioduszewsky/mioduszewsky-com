#!/usr/bin/env node
import { chromium } from 'playwright';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';

const url = 'https://www.soscalemedia.se/';
const outDir = '/Users/kacpermioduszewski/mioduszewsky-com/docs/moodboard/screens/scan-soscalemedia-se';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  deviceScaleFactor: 2,
});
const page = await context.newPage();

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
} catch (e) {
  console.warn(`networkidle timeout: ${e.message}`);
}
await page.evaluate(() => document.fonts?.ready).catch(() => {});
await page.waitForTimeout(2500);

// Zamknij modal — klik na X (close button) lub przez Escape
await page.evaluate(() => {
  // znajdź wszystkie elementy z aria-label='Close' lub klasą close
  const closers = document.querySelectorAll('[aria-label*="lose" i], [class*="close" i], [class*="dismiss" i]');
  closers.forEach((el) => { try { el.click(); } catch {} });
  // ukryj modale brute-force
  document.querySelectorAll('[class*="modal" i], [class*="popup" i], [class*="overlay" i]').forEach((el) => {
    const s = getComputedStyle(el);
    if (s.position === 'fixed' || s.position === 'absolute') {
      el.style.display = 'none';
    }
  });
});
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(1500);

const positions = [
  { name: '01-viewport-top-clean', scroll: 0 },
  { name: '02-scroll-25-clean', scroll: 0.20 },
  { name: '03-scroll-50-clean', scroll: 0.45 },
  { name: '04-scroll-75-clean', scroll: 0.70 },
  { name: '06-scroll-90-clean', scroll: 0.90 },
];

for (const { name, scroll } of positions) {
  await page.evaluate((pct) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * pct, behavior: 'instant' });
  }, scroll);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

await browser.close();
console.log('Done.');
