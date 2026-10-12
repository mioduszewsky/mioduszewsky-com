// Materiał do angielskiej wersji case'u Igora: igorgrabowski.com po angielsku. argv[2] = katalog wyników.
import { chromium, webkit, devices } from 'playwright';
const out = process.argv[2];
const base = 'https://www.igorgrabowski.com';
const prep = (nl) => (ctx) => ctx.addInitScript((nl) => { try { localStorage.setItem('aigor_lang', 'en'); if (nl) localStorage.setItem('aigor_nl', 'sub'); else localStorage.removeItem('aigor_nl'); } catch (e) {} }, nl);
const words = (p) => p.evaluate(() => [...document.querySelectorAll('a')].map((a) => ({ t: a.innerText.trim(), r: a.getBoundingClientRect().toJSON() })).filter((x) => x.t && x.r.height > 40));
const b = await chromium.launch();
// 1. Strona główna: plakat 2x i nagranie najazdu
let ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); await prep(true)(ctx);
let p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const w0 = await words(p); await p.mouse.move(w0[0].r.x + w0[0].r.width * .4, w0[0].r.y + w0[0].r.height / 2, { steps: 8 }); await p.waitForTimeout(1300);
await p.screenshot({ path: `${out}/home-hover.png` }); console.log('words', w0.map((w) => w.t.replace(/\s+/g, ' ')).join(' | '));
await ctx.close();
ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: `${out}/vid-home`, size: { width: 1280, height: 800 } } }); await prep(true)(ctx);
p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
const w1 = await words(p); await p.mouse.move(1200, 780);
for (const w of w1.slice(0, 2)) { await p.mouse.move(w.r.x + w.r.width * .35, w.r.y + w.r.height / 2, { steps: 25 }); await p.waitForTimeout(1800); }
await p.mouse.move(1200, 780, { steps: 25 }); await p.waitForTimeout(900); await ctx.close();
// 2. Galeria: nagranie przewijania
ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: `${out}/vid-gal`, size: { width: 1280, height: 800 } } }); await prep(true)(ctx);
p = await ctx.newPage(); await p.goto(base + '/obrazy', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < 5000; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
await p.waitForTimeout(1500); await p.mouse.move(640, 400);
for (let i = 0; i < 160; i++) { await p.mouse.wheel(0, 22); await p.waitForTimeout(40); }
await p.waitForTimeout(600); await ctx.close();
// 3. Okienko newslettera na galerii
ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); await prep(false)(ctx);
p = await ctx.newPage(); await p.goto(base + '/obrazy', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate(() => scrollTo(0, document.body.scrollHeight * .42)); await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}/slidein-d.png` }); await ctx.close();
await b.close();
// 4. Telefon (WebKit iPhone 13): nagranie auto-cyklu, galeria, okienko newslettera
const wb = await webkit.launch();
ctx = await wb.newContext({ ...devices['iPhone 13'], recordVideo: { dir: `${out}/vid-phone`, size: { width: 390, height: 844 } } }); await prep(true)(ctx);
p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
await p.screenshot({ path: `${out}/m-home.png` }); await p.waitForTimeout(11000); await ctx.close();
ctx = await wb.newContext({ ...devices['iPhone 13'] }); await prep(true)(ctx);
p = await ctx.newPage(); await p.goto(base + '/obrazy', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/m-obrazy.png` }); await ctx.close();
ctx = await wb.newContext({ ...devices['iPhone 13'] }); await prep(false)(ctx);
p = await ctx.newPage(); await p.goto(base + '/obrazy', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate(() => scrollTo(0, document.body.scrollHeight * .42)); await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}/slidein-m.png` }); await ctx.close();
await wb.close();
console.log('done');
