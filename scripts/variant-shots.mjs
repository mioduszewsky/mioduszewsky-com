import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4323';
const OUT = process.argv[3] ?? './vshots';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

const pages = ['w1', 'w2', 'w3', 'w4', 'warianty'];
for (const slug of pages) {
  for (const [mode, opts] of [
    ['d', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }],
    ['m', { ...devices['iPhone 13'] }],
  ]) {
    const ctx = await browser.newContext(opts);
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${OUT}/${slug}-${mode}-top.png` });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/${slug}-${mode}-mid.png` });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/${slug}-${mode}-end.png` });
    if (errs.length) console.log(`${slug} ${mode} ERRORS:`, errs.slice(0, 3));
    await ctx.close();
  }
  console.log(`${slug}: OK`);
}
await browser.close();
