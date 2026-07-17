import { chromium } from 'playwright';
const b = await chromium.launch();
// finale desktop
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4344/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(5000);
const H = await p.evaluate(()=>document.body.scrollHeight);
for (let s=H-2400; s<=H; s+=300){ await p.evaluate((y)=>window.scrollTo(0,y), s); await p.waitForTimeout(90); }
await p.evaluate((h)=>window.scrollTo(0, h), H); await p.waitForTimeout(1500);
await p.screenshot({ path:'/tmp/fin-top.png' });
// contact logo mobile
const m = await b.newPage({ viewport:{width:390,height:844} });
await m.goto('http://localhost:4344/contact', { waitUntil:'domcontentloaded' });
await m.waitForTimeout(3000);
await m.screenshot({ path:'/tmp/ct-mobile-logo.png' });
await b.close(); console.log('ok');
