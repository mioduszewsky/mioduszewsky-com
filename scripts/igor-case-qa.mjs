// QA case'u Igora: zrzuty 1440/1024/320 (Chromium) + pomiary WebKit iPhone 13. argv: url, katalog wyników.
import { chromium, webkit, devices } from 'playwright';
const [url, out] = process.argv.slice(2);
const kill = () => document.querySelectorAll('body *').forEach((el) => {
  const s = getComputedStyle(el);
  if ((s.position === 'fixed') && /cookie|zgod|akceptuj/i.test(el.textContent || '')) el.remove();
});
const measure = () => {
  const W = document.documentElement.clientWidth;
  const off = [...document.querySelectorAll('.case *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > W + 1 || r.left < -1); }).map((el) => el.className || el.tagName).slice(0, 8);
  const txt = [...document.querySelectorAll('.case :is(h1,h2,p,li,figcaption)')];
  // tekst na tekście: nachodzące się prostokąty bloków tekstu na tym samym poziomie
  const clipped = txt.filter((el) => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible').length;
  const centered = txt.filter((el) => getComputedStyle(el).textAlign === 'center').map((el) => el.textContent.slice(0, 30));
  const h1 = getComputedStyle(document.querySelector('h1')).fontSize;
  const heights = [...document.querySelectorAll('.trip .mat')].map((m) => Math.round(m.getBoundingClientRect().height));
  return { W, scrollW: document.documentElement.scrollWidth, off, clipped, centered, h1, heights };
};
const b = await chromium.launch();
for (const w of [1440, 1024, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(kill);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.waitForTimeout(800);
  console.log(w, JSON.stringify(await p.evaluate(measure)));
  await p.screenshot({ path: `${out}/w${w}-cala.jpg`, fullPage: true, quality: 70, type: 'jpeg' });
  await p.screenshot({ path: `${out}/w${w}-ekran1.jpg`, quality: 80, type: 'jpeg' });
  await p.close();
}
await b.close();
const wb = await webkit.launch();
const ctx = await wb.newContext({ ...devices['iPhone 13'] });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(kill);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
await p.waitForTimeout(800);
console.log('webkit-iphone13', JSON.stringify(await p.evaluate(measure)));
const vid = await p.evaluate(async () => { const v = document.querySelector('.hang-1 video'); v.scrollIntoView(); await new Promise((r) => setTimeout(r, 2500)); return { paused: v.paused, t: v.currentTime, src: v.currentSrc.split('/').pop() }; });
console.log('webkit-video', JSON.stringify(vid));
await p.screenshot({ path: `${out}/iphone13-cala.jpg`, fullPage: true, quality: 70, type: 'jpeg' });
await wb.close();
