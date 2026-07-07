#!/usr/bin/env node
import { chromium } from 'playwright';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';

const url = 'https://www.soscalemedia.se/';
const outDir = '/Users/kacpermioduszewski/mioduszewsky-com/docs/moodboard/screens/scan-soscalemedia-se';
await mkdir(outDir, { recursive: true });

// Headed = realny GPU = WebGL / Three.js renderuje się normalnie
const browser = await chromium.launch({ headless: false, args: ['--enable-webgl', '--use-gl=swiftshader'] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  deviceScaleFactor: 2,
  recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
} catch (e) {
  console.warn(`networkidle timeout: ${e.message}`);
}
await page.evaluate(() => document.fonts?.ready).catch(() => {});
await page.waitForTimeout(3500); // dłużej żeby 3D się załadowało

// Zamknij modal popup
await page.evaluate(() => {
  document.querySelectorAll('[class*="modal" i], [class*="popup" i], [class*="overlay" i]').forEach((el) => {
    const s = getComputedStyle(el);
    if (s.position === 'fixed' || s.position === 'absolute') el.style.display = 'none';
  });
});
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(2000);

// Znajdź wszystkie <canvas> i ich pozycje
const canvases = await page.evaluate(() => {
  return [...document.querySelectorAll('canvas')].map((c, i) => {
    const r = c.getBoundingClientRect();
    return {
      idx: i,
      width: c.width,
      height: c.height,
      visible: r.width > 0 && r.height > 0,
      pageTop: r.top + window.scrollY,
      pageLeft: r.left + window.scrollX,
      classNames: c.className,
      parentClass: c.parentElement?.className || '',
    };
  });
});

console.log('Znaleziono canvas/WebGL:');
console.log(JSON.stringify(canvases, null, 2));

// Screen co 10% scrolla
const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
console.log(`Total scroll height: ${totalHeight}px`);

for (let i = 0; i <= 10; i++) {
  const scrollTo = Math.round((totalHeight * i) / 10);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollTo);
  await page.waitForTimeout(1500); // dłużej, żeby 3D dosięgło tej klatki
  const name = `step-${String(i).padStart(2, '0')}-scroll-${scrollTo}.png`;
  await page.screenshot({ path: join(outDir, name), fullPage: false });
  console.log(`  ✓ ${name}`);
}

// Bezpośrednio przewiń DO każdego canvasa i zrzuć
for (const c of canvases) {
  if (!c.visible) continue;
  const targetY = Math.max(0, c.pageTop - 200);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
  await page.waitForTimeout(2500);
  const name = `canvas-${c.idx}-y${Math.round(c.pageTop)}.png`;
  await page.screenshot({ path: join(outDir, name), fullPage: false });
  console.log(`  ✓ ${name} (canvas-targeted)`);
}

await page.close();
await context.close();
await browser.close();
console.log('Done.');
