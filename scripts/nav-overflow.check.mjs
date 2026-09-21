import { chromium } from 'playwright';
const b = await chromium.launch();
const urls = ['/pl/','/','/pl/uslugi/','/services/','/pl/uslugi/wdrozenie-ai/'];
const widths = [320,360,390,430,768,1440];
let bad = 0;
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 860 } });
  const p = await ctx.newPage();
  for (const u of urls) {
    await p.goto('http://localhost:4331'+u, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(250);
    const res = await p.evaluate(() => {
      document.documentElement.style.setProperty('overflow-x','visible');
      document.body.style.setProperty('overflow-x','visible');
      const out = [];
      document.querySelectorAll('body *').forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        // .cur (kursor-blob) i .sr-only sa celowo poza kadrem - nie sa trescia strony
        if (e.closest('.cur') || e.classList.contains('cur') || e.classList.contains('sr-only')) return;
        if (r.right > innerWidth + 1 || r.left < -1) {
          const cls = (typeof e.className === 'string' ? e.className : '').split(' ')[0] || e.tagName;
          out.push(cls + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
        }
      });
      const navTxt = document.querySelector('.nav')?.innerText.replace(/\n/g,'|') || '';
      return { over: [...new Set(out)].slice(0,6), navTxt, scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
    });
    const flag = res.over.length ? 'OVERFLOW' : 'ok';
    if (res.over.length) bad++;
    console.log(`${String(w).padEnd(5)} ${u.padEnd(30)} ${flag} ${res.over.join(' ; ')}`);
  }
  await ctx.close();
}
await b.close();
console.log(bad ? `\nFAIL: ${bad} przypadkow z overflow` : '\nPASS: zero overflow na 6 szerokosciach x 5 tras');
