import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch();

async function check(label, options) {
  const context = await browser.newContext(options);
  await context.addInitScript(() => localStorage.setItem('mioduszewsky_consent', 'rejected'));
  const page = await context.newPage();
  const ownErrors = [];
  page.on('pageerror', (error) => ownErrors.push(error.message));
  await page.goto(`${base}/pl/?utm_source=qa#oferta`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5200);
  await page.evaluate(() => {
    document.querySelector('.veil')?.remove();
    document.querySelectorAll('.rv, .ln-in, .nav').forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  });
  await page.locator('.hero').screenshot({ path: `/tmp/pl-${label}-hero.png` });
  await page.locator('.serv').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator('.serv').screenshot({ path: `/tmp/pl-${label}-offer.png` });

  const state = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    alternates: [...document.querySelectorAll('link[rel="alternate"]')].map((el) => [el.hreflang, el.href]),
    languageSwitch: document.querySelector('[data-language-switch]')?.href,
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));

  await page.goto(`${base}/pl/kontakt/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/pl-${label}-contact.png`, fullPage: true });
  const contactOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  console.log(JSON.stringify({ label, ...state, contactOverflow, ownErrors }, null, 2));
  await context.close();
}

await check('desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await check('mobile', { ...devices['iPhone 13'] });
await browser.close();
