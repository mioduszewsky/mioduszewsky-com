#!/usr/bin/env node
import { chromium } from 'playwright';
import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const url = 'https://www.theboncollectif.com/';
const outDir = '/Users/kacpermioduszewski/mioduszewsky-com/docs/moodboard/screens/scan-theboncollectif-com';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: false, args: ['--enable-webgl'] });
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
await page.waitForTimeout(3500);

// Zamknij modale
await page.evaluate(() => {
  document.querySelectorAll('[class*="modal" i], [class*="popup" i], [class*="cookie" i]').forEach((el) => {
    const s = getComputedStyle(el);
    if (s.position === 'fixed' || s.position === 'absolute') el.style.display = 'none';
  });
});
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(1500);

// Inwentaryzacja: canvas, video, font-families
const inventory = await page.evaluate(() => {
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

  const canvases = [...document.querySelectorAll('canvas')].map((c, i) => {
    const r = c.getBoundingClientRect();
    return {
      idx: i,
      width: c.width,
      height: c.height,
      visible: r.width > 0 && r.height > 0,
      pageTop: Math.round(r.top + window.scrollY),
      parentClass: c.parentElement?.className || '',
    };
  });

  const videos = [...document.querySelectorAll('video')].map((v, i) => {
    const r = v.getBoundingClientRect();
    return {
      idx: i,
      src: v.currentSrc || v.src,
      autoplay: v.autoplay,
      loop: v.loop,
      muted: v.muted,
      width: v.videoWidth,
      height: v.videoHeight,
      pageTop: Math.round(r.top + window.scrollY),
      parentClass: v.parentElement?.className || '',
    };
  });

  const bodyStyle = computed(document.body);
  const headings = [...document.querySelectorAll('h1, h2, h3')].slice(0, 8).map(computed);
  const buttons = [...document.querySelectorAll('button, a[class*="btn"], a[class*="button"]')].slice(0, 3).map(computed);

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
    topBackgrounds: topN(bgColors, 8),
    topTextColors: topN(textColors, 6),
    topFonts: topN(fontFamilies, 6),
    canvases,
    videos,
    scrollHeight: document.documentElement.scrollHeight,
  };
});

console.log('Inventory:', JSON.stringify({ canvases: inventory.canvases.length, videos: inventory.videos.length, fonts: inventory.topFonts.map(f => f.value), scrollHeight: inventory.scrollHeight }, null, 2));

await writeFile(join(outDir, 'report.json'), JSON.stringify({ url, scannedAt: new Date().toISOString(), ...inventory }, null, 2));

// Screen co 10% scrolla
const totalHeight = inventory.scrollHeight - 900;
for (let i = 0; i <= 10; i++) {
  const scrollTo = Math.round((totalHeight * i) / 10);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollTo);
  await page.waitForTimeout(1500);
  const name = `step-${String(i).padStart(2, '0')}-scroll-${scrollTo}.png`;
  await page.screenshot({ path: join(outDir, name), fullPage: false });
  console.log(`  ✓ ${name}`);
}

// Targetuj każdy canvas i video
for (const c of inventory.canvases) {
  if (!c.visible) continue;
  const targetY = Math.max(0, c.pageTop - 200);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(outDir, `canvas-${c.idx}-y${c.pageTop}.png`), fullPage: false });
  console.log(`  ✓ canvas-${c.idx} (parent: ${c.parentClass.slice(0,30)})`);
}
for (const v of inventory.videos) {
  const targetY = Math.max(0, v.pageTop - 200);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(outDir, `video-${v.idx}-y${v.pageTop}.png`), fullPage: false });
  console.log(`  ✓ video-${v.idx} (parent: ${v.parentClass.slice(0,30)})`);
}

await page.close();
await context.close();
await browser.close();
console.log('Done.');
