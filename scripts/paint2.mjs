import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900}, hasTouch:false });
await p.goto('http://localhost:4353/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(6000);
await p.mouse.move(240, 700); await p.mouse.down();
for (let x=240;x<=1180;x+=22){ await p.mouse.move(x, 700 + Math.sin(x/90)*55); await p.waitForTimeout(7); }
await p.mouse.up();
await p.mouse.move(320, 800); await p.mouse.down();
for (let x=320;x<=1080;x+=22){ await p.mouse.move(x, 800 - Math.sin(x/75)*35); await p.waitForTimeout(7); }
await p.mouse.up();
await p.waitForTimeout(300);
const sel = await p.evaluate(()=>String(getSelection()));
console.log('zaznaczony tekst (ma byc pusty):', JSON.stringify(sel.slice(0,40)));
await p.screenshot({ path:'/tmp/paint2.png' });
await b.close();
