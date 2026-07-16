import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext();
// ustaw cookie i18next=pl dla domeny (jak po kliknięciu "pl" na stronie Igora)
await ctx.addCookies([
  { name:'i18next', value:'pl', domain:'.igorgrabowski.com', path:'/' },
  { name:'i18nextLng', value:'pl', domain:'.igorgrabowski.com', path:'/' },
]);
const p = await ctx.newPage();
await p.goto('https://www.igorgrabowski.com/?lang=en', { waitUntil:'networkidle', timeout:20000 });
await p.waitForTimeout(1800);
const txt = await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,160));
const pl=/Prace|Kontakt|kolekcj|Artyści|Polityka/i.test(txt), en=/Works|Artworks|Collection|Artists|PIECES/i.test(txt);
console.log('cookie i18next=pl + ?lang=en ->', pl?'PL':'', en?'EN':'', '|', txt.slice(0,110));
await b.close();
