import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 390, 900, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4330/pl/', { waitUntil: 'networkidle' });
    if (await page.locator('#cookieReject').isVisible()) await page.locator('#cookieReject').click();
    await page.locator('.deal-beyond').scrollIntoViewIfNeeded();
    const result = await page.locator('.deal-beyond-grid').evaluate(grid => ({
      names: [...grid.querySelectorAll('.deal-bn')].map(e => e.textContent),
      links: [...grid.querySelectorAll('a')].map(e => e.getAttribute('href')),
      tops: [...grid.children].map(e => Math.round(e.getBoundingClientRect().top)),
      overflow: [...grid.querySelectorAll('*')].filter(e => {
        const r = e.getBoundingClientRect(); return r.left < -.5 || r.right > innerWidth + .5;
      }).map(e => e.className),
    }));
    assert.deepEqual(result.names, ['Wdrożenie AI', 'Aplikacja lub system', 'Cofounder as a Service']);
    assert.deepEqual(result.links, ['/pl/uslugi/wdrozenie-ai/', '/pl/uslugi/aplikacje-i-systemy/', '/pl/uslugi/cofounder-as-a-service/']);
    assert.deepEqual(result.overflow, []);
    if (width >= 900) assert.equal(new Set(result.tops).size, 1);
    if (width <= 390) assert.equal(new Set(result.tops).size, 3);
    await page.locator('.deal-beyond').screenshot({ path: `/tmp/service-landings-review/home-services-${width}.png` });
    for (const path of ['/pl/uslugi/konsultacja-biznesowa/', '/pl/konsultacja/kontakt/']) {
      assert.equal((await page.goto(`http://127.0.0.1:4330${path}`)).status(), 404);
    }
    console.log(`PASS homepage ${width}px: three services, links, layout, no overflow; consultation routes 404`);
    await context.close();
  }
} finally { await browser.close(); }
