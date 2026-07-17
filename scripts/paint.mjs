import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900}, hasTouch:false });
await p.goto('http://localhost:4352/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(6000);
// pociagniecie 1 (dol hero, tło)
await p.mouse.move(250, 720); await p.mouse.down();
for (let x=250;x<=1150;x+=25){ await p.mouse.move(x, 720 + Math.sin(x/80)*40); await p.waitForTimeout(8); }
await p.mouse.up();
// pociagniecie 2 (inny kolor)
await p.mouse.move(300, 800); await p.mouse.down();
for (let x=300;x<=1100;x+=25){ await p.mouse.move(x, 800 - Math.sin(x/70)*30); await p.waitForTimeout(8); }
await p.mouse.up();
await p.waitForTimeout(300);
const n = await p.evaluate(()=>document.querySelectorAll('.splat').length);
const sel = await p.evaluate(()=>String(getSelection()));
console.log('splats:', n, '| zaznaczony tekst (ma byc pusty):', JSON.stringify(sel.slice(0,30)));
await p.screenshot({ path:'/tmp/paint.png' });
await b.close();
