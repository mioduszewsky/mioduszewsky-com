#!/usr/bin/env node
// Full-page screenshoty żywych stron do interaktywnych device frame'ów.
// Użycie: node scripts/capture-fullpage.mjs
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/assets/live');
await mkdir(OUT, { recursive: true });

const targets = [
  { name: 'eskapizm-mobile', url: 'https://eskapizm.com', device: 'iPhone 13' },
  { name: 'aigor-mobile', url: 'https://aigor-reveal.vercel.app', device: 'iPhone 13' },
  { name: 'woodspot-mobile', url: 'https://woodspot-deck.vercel.app', device: 'iPhone 13' },
  { name: 'eskapizm-desktop', url: 'https://eskapizm.com', viewport: { width: 1440, height: 900 } },
];

const browser = await chromium.launch();
for (const t of targets) {
  const ctx = await browser.newContext(
    t.device ? { ...devices[t.device] } : { viewport: t.viewport, deviceScaleFactor: 2 }
  );
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    console.warn(`${t.name}: networkidle timeout, kontynuuję`);
  }
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  // zamknij cookie banner (eskapizm i podobne) — klik po tekście, także w iframe'ach
  await page.waitForTimeout(1500);
  const labels = ['Accept all', 'Akceptuję', 'Akceptuj', 'Zgadzam się'];
  let clicked = false;
  for (const frame of page.frames()) {
    for (const label of labels) {
      const el = frame.locator(`button:has-text("${label}"), [role=button]:has-text("${label}"), a:has-text("${label}")`).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click().catch(() => {});
        clicked = true;
        break;
      }
    }
    if (clicked) break;
  }
  if (clicked) await page.waitForTimeout(1200);
  // fallback: wywal overlaye consentowe, gdyby klik nie zadziałał
  await page.evaluate(() => {
    document.querySelectorAll('div, section, aside').forEach((el) => {
      const st = getComputedStyle(el);
      if ((st.position === 'fixed' || st.position === 'sticky') && /cookie|privacy|consent/i.test(el.textContent || '') && el.querySelector('button, [role=button]')) {
        el.remove();
      }
    });
  }).catch(() => {});
  // wymuś lazy-load: przewiń na dół i wróć
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 250);
        else { window.scrollTo(0, 0); setTimeout(res, 600); }
      };
      step();
    });
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, `${t.name}.png`), fullPage: true });
  console.log(`${t.name}: OK`);
  await ctx.close();
}
await browser.close();
