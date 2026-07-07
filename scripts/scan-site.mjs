#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SCREENS_DIR = join(REPO_ROOT, 'docs/moodboard/screens');

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//.test(a));
const headed = args.includes('--headed');
const viewport = args.find((a) => a.startsWith('--viewport='))?.split('=')[1] ?? '1440x900';
const [vw, vh] = viewport.split('x').map(Number);

if (!url) {
  console.error('Usage: node scripts/scan-site.mjs <url> [--headed] [--viewport=1440x900]');
  process.exit(1);
}

const slug = url
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/[/?#].*$/, '')
  .replace(/[^a-z0-9-]/gi, '-')
  .toLowerCase();

const outDir = join(SCREENS_DIR, `scan-${slug}`);
await mkdir(outDir, { recursive: true });

console.log(`Scanning ${url}`);
console.log(`Viewport: ${vw}x${vh} | Headless: ${!headed}`);
console.log(`Output: ${outDir}\n`);

const browser = await chromium.launch({ headless: !headed });
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  deviceScaleFactor: 2,
});
const page = await context.newPage();

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
} catch (e) {
  console.warn(`networkidle timed out, continuing: ${e.message}`);
}

await page.evaluate(() => document.fonts?.ready).catch(() => {});
await page.waitForTimeout(1500);

const positions = [
  { name: '01-viewport-top', scroll: 0 },
  { name: '02-scroll-25', scroll: 0.25 },
  { name: '03-scroll-50', scroll: 0.50 },
  { name: '04-scroll-75', scroll: 0.75 },
];

for (const { name, scroll } of positions) {
  await page.evaluate((pct) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * pct, behavior: 'instant' });
  }, scroll);
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(600);
await page.screenshot({ path: join(outDir, '05-full-page.png'), fullPage: true });
console.log(`  ✓ 05-full-page.png (full scroll)`);

const styleReport = await page.evaluate(() => {
  const rgb = (s) => {
    const m = s?.match(/\d+(\.\d+)?/g);
    if (!m) return s;
    const [r, g, b, a] = m.map(Number);
    const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
    return a !== undefined && a < 1 ? `${s}` : `#${hex(r)}${hex(g)}${hex(b)}`;
  };
  const computed = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').slice(0, 80).trim(),
      color: rgb(s.color),
      backgroundColor: rgb(s.backgroundColor),
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
      lineHeight: s.lineHeight,
      textTransform: s.textTransform,
    };
  };

  const bodyStyle = computed(document.body);
  const headings = [...document.querySelectorAll('h1, h2, h3')].slice(0, 5).map(computed);
  const buttons = [...document.querySelectorAll('button, a[class*="btn"], a[class*="button"]')].slice(0, 3).map(computed);
  const ctas = [...document.querySelectorAll('a[href*="contact"], a[href*="work"], a[href*="hire"]')].slice(0, 3).map(computed);

  const allEls = [...document.querySelectorAll('body *')];
  const bgColors = new Map();
  const textColors = new Map();
  const fontFamilies = new Map();
  allEls.forEach((el) => {
    const s = getComputedStyle(el);
    const bg = rgb(s.backgroundColor);
    const fg = rgb(s.color);
    const ff = s.fontFamily;
    if (bg && !/^(transparent|rgba\(0, 0, 0, 0\))/.test(bg)) {
      bgColors.set(bg, (bgColors.get(bg) || 0) + 1);
    }
    if (fg) textColors.set(fg, (textColors.get(fg) || 0) + 1);
    if (ff) fontFamilies.set(ff, (fontFamilies.get(ff) || 0) + 1);
  });
  const topN = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([v, c]) => ({ value: v, count: c }));

  return {
    title: document.title,
    body: bodyStyle,
    headings,
    buttons,
    ctas,
    topBackgrounds: topN(bgColors, 8),
    topTextColors: topN(textColors, 6),
    topFonts: topN(fontFamilies, 5),
  };
});

await writeFile(join(outDir, 'report.json'), JSON.stringify({ url, scannedAt: new Date().toISOString(), viewport, ...styleReport }, null, 2));
console.log(`  ✓ report.json (computed styles + palette)\n`);

await browser.close();
console.log(`Done. ls ${outDir.replace(process.env.HOME, '~')}`);
