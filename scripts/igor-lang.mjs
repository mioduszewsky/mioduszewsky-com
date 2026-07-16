import { chromium } from 'playwright';
const b = await chromium.launch();
for (const u of [
  'https://www.igorgrabowski.com/',
  'https://www.igorgrabowski.com/?lang=en',
  'https://www.igorgrabowski.com/en',
  'https://www.igorgrabowski.com/?lang=en-US',
]) {
  const p = await b.newPage();
  try {
    await p.goto(u, { waitUntil: 'networkidle', timeout: 20000 });
    await p.waitForTimeout(1500);
    const txt = await p.evaluate(() => document.body.innerText.replace(/\s+/g,' ').slice(0, 200));
    const pl = /Prace|Kontakt|kolekcj|Artyści|Polityka/i.test(txt);
    const en = /Works|Contact|Collection|Artists|Privacy/i.test(txt);
    console.log(`\n${u}\n  lang: ${pl?'PL':''}${en?'EN':''}${!pl&&!en?'?':''} | ${txt.slice(0,110)}`);
  } catch(e){ console.log(u, 'ERR', e.message.slice(0,60)); }
  await p.close();
}
await b.close();
