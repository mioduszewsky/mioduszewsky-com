import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4342/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1500);
const H = await p.evaluate(()=>document.body.scrollHeight);
// płynny scroll do dołu (żeby scroll handler ukrył nav)
for (let s=H-2000; s<=H; s+=400){ await p.evaluate((y)=>window.scrollTo(0,y), s); await p.waitForTimeout(120); }
await p.evaluate((h)=>window.scrollTo(0, h), H);
await p.waitForTimeout(2000);
await p.screenshot({ path:'/tmp/fin.png' });
await b.close(); console.log('ok');
