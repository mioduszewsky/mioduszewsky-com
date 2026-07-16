import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext();
const p = await ctx.newPage();
// 1. wejdź, ustaw PL w localStorage (symulacja przeglądarki Kacpra)
await p.goto('https://www.igorgrabowski.com/', { waitUntil: 'networkidle', timeout: 20000 });
await p.evaluate(() => { try { localStorage.setItem('lang','pl'); localStorage.setItem('language','pl'); localStorage.setItem('locale','pl'); localStorage.setItem('i18nextLng','pl'); } catch(e){} });
// 2. teraz wejdź z ?lang=en — czy nadpisze PL?
await p.goto('https://www.igorgrabowski.com/?lang=en', { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(1800);
const txt = await p.evaluate(() => document.body.innerText.replace(/\s+/g,' ').slice(0,160));
const pl = /Prace|Kontakt|kolekcj|Artyści|Polityka/i.test(txt);
const en = /Works|Contact|Collection|Artists|Privacy|PIECES/i.test(txt);
console.log('po ustawieniu PL w localStorage + wejściu z ?lang=en:');
console.log('  ->', pl?'PL':'', en?'EN':'', '|', txt.slice(0,120));
console.log('  localStorage keys:', await p.evaluate(()=>Object.keys(localStorage).join(',')));
await b.close();
