import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const outDir = '/Users/kacpermioduszewski/mioduszewsky-com/docs/moodboard/screens/scan-serious-business';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto('https://serious.business/', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(1500);

// Find services section by scrolling to "Brand Strategy"
const brandStrategy = page.locator('text=/Brand Strategy/i').first();
await brandStrategy.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

// Determine bounding box from first ("Brand Strategy") to last ("Product")
const bb1 = await page.locator('text=/Brand Strategy/i').first().boundingBox();
const bbLast = await page.locator('text=/Product/i').first().boundingBox();

if (bb1 && bbLast) {
  // Scroll page so the whole stack is captured
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const bb1Abs = await page.locator('text=/Brand Strategy/i').first().evaluate(el => {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  });
  const bbLastAbs = await page.locator('text=/Product/i').first().evaluate(el => {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  });
  console.log('first:', bb1Abs, 'last:', bbLastAbs);

  // Take full-page screenshot first then crop using sharp... but no sharp. Use page.screenshot with clip after setting larger viewport.
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const totalWidth = await page.evaluate(() => document.body.scrollWidth);
  await page.setViewportSize({ width: 1440, height: Math.ceil(totalHeight) });
  await page.waitForTimeout(500);

  const top = Math.max(0, Math.floor(bb1Abs.y) - 40);
  const bottom = Math.ceil(bbLastAbs.y + bbLastAbs.h) + 600; // include the Product row block
  const height = Math.min(bottom - top, totalHeight - top);

  await page.screenshot({
    path: `${outDir}/06-services-stack.png`,
    clip: { x: 0, y: top, width: 1440, height },
  });
  console.log(`Saved: ${outDir}/06-services-stack.png (y=${top}, h=${height})`);
} else {
  console.error('Could not locate Brand Strategy or Product text');
}

await browser.close();
