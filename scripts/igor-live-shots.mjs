// Zrzuty i nagrania żywej strony igorgrabowski.com do case study (PL, bez slide-inu newslettera).
import { chromium, webkit, devices } from 'playwright';
const out = process.argv[2];
const base = 'https://www.igorgrabowski.com';
const prep = async (ctx) => ctx.addInitScript(() => { try { localStorage.setItem('aigor_lang', 'pl'); localStorage.setItem('aigor_nl', 'sub'); } catch (e) {} });
const b = await chromium.launch();
// Desktop: zrzuty podstron
let ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await prep(ctx);
let p = await ctx.newPage();
for (const [n, path] of [['home', '/'], ['obrazy', '/obrazy'], ['okolekcji', '/o-kolekcji'], ['artysci', '/artysci'], ['kontakt', '/kontakt'], ['newsletter', '/newsletter']]) {
  await p.goto(base + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.mouse.move(5, 895);
  await p.screenshot({ path: `${out}/d-${n}.png` });
}
await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const words = await p.evaluate(() => [...document.querySelectorAll('a')].map((a) => ({ t: a.innerText.trim(), r: a.getBoundingClientRect().toJSON() })).filter((x) => x.t && x.r.height > 40));
console.log(JSON.stringify(words.map((w) => [w.t.replace(/\s+/g, ' '), Math.round(w.r.x), Math.round(w.r.y), Math.round(w.r.width), Math.round(w.r.height)])));
for (const [i, w] of words.slice(0, 2).entries()) {
  await p.mouse.move(w.r.x + w.r.width * 0.4, w.r.y + w.r.height / 2, { steps: 8 }); await p.waitForTimeout(1300);
  await p.screenshot({ path: `${out}/d-home-hover${i}.png` });
}
await ctx.close();
// Nagranie desktop: przejazd kursorem po hasłach
ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: `${out}/vid-d`, size: { width: 1280, height: 800 } } });
await prep(ctx); p = await ctx.newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
const w2 = await p.evaluate(() => [...document.querySelectorAll('a')].map((a) => ({ t: a.innerText.trim(), r: a.getBoundingClientRect().toJSON() })).filter((x) => x.t && x.r.height > 40));
await p.mouse.move(1200, 780);
for (const w of w2.slice(0, 2)) { await p.mouse.move(w.r.x + w.r.width * 0.35, w.r.y + w.r.height / 2, { steps: 25 }); await p.waitForTimeout(1800); }
await p.mouse.move(1200, 780, { steps: 25 }); await p.waitForTimeout(900);
await ctx.close();
await b.close();
// Telefon: WebKit iPhone 13, auto-cykl na home i galeria
const wb = await webkit.launch();
ctx = await wb.newContext({ ...devices['iPhone 13'], recordVideo: { dir: `${out}/vid-m`, size: { width: 390, height: 844 } } });
await prep(ctx); p = await ctx.newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
await p.screenshot({ path: `${out}/m-home.png` });
await p.waitForTimeout(8000);
await p.screenshot({ path: `${out}/m-home-2.png` });
await ctx.close();
ctx = await wb.newContext({ ...devices['iPhone 13'] }); await prep(ctx); p = await ctx.newPage();
for (const [n, path] of [['obrazy', '/obrazy'], ['okolekcji', '/o-kolekcji'], ['artysci', '/artysci']]) {
  await p.goto(base + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/m-${n}.png` });
}
await wb.close();
console.log('done');
